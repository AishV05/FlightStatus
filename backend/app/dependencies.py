from fastapi import Depends, HTTPException, status, WebSocket
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from .database import user_collection, db
from .schema import TokenData, UserInDB
from typing import Optional
from typing import List, Tuple
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging
from bson import ObjectId

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable not set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def get_user(identifier: str) -> Optional[UserInDB]:
    user = await user_collection.find_one({"$or": [{"email": identifier}, {"username": identifier}]})
    if user:
        
        user["id"] = str(user["_id"])  
        del user["_id"]
        return UserInDB(**user)


async def authenticate_user(identifier: str, password: str) -> Optional[UserInDB]:
    user = await get_user(identifier)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = await get_user(identifier=token_data.username)
    if user is None:
        raise credentials_exception
    
    return user

async def get_current_user_websocket(websocket: WebSocket, token: str) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        await websocket.close(code=4000)  
        raise credentials_exception
    
    user = await user_collection.find_one({"username": token_data.username})
    if user is None:
        await websocket.close(code=4000)  # Custom code for user not found
        raise credentials_exception
    
    return UserInDB(**user)

async def fetch_user_details(flight_users: List[str]) -> Tuple[List[str], List[str]]:
    try:
        user_phone_numbers = []
        
        obj_user_ids = [ObjectId(id) for id in flight_users]
        users_cursor = user_collection.find({"_id": {"$in": obj_user_ids}})
        users = await users_cursor.to_list(length=None)

        for user in users:
            if user.get('phone_number'):
                user_phone_numbers.append(user['phone_number'])
        
        return user_phone_numbers
    
    except Exception as e:
        print(f"Failed to fetch user details: {e}")
        return []