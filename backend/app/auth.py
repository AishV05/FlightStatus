from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
from datetime import timedelta
from pymongo.errors import DuplicateKeyError
from .schema import User, UserCreate, UserInDB, Token
from .dependencies import ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme, get_current_user, get_password_hash,authenticate_user, create_access_token
from .database import user_collection
import logging
from bson import ObjectId
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()



@router.post("/register")
async def register(user: UserCreate):
    try:
        print(user)
        hashed_password = get_password_hash(user.password)
        user_dict = user.dict()
        user_dict['hashed_password'] = hashed_password
        user_dict['is_admin'] = False  
        del user_dict['password']

        result = await user_collection.insert_one(user_dict)
        if result.inserted_id:
            return {"message": "User created successfully"}
        else:
            raise HTTPException(status_code=500, detail="User creation failed")
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="User with this email or username already exists")
    except Exception as e:
        logger.error(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect email, username, or password")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/user", response_model=User)
async def get_user_endpoint(current_user: UserInDB = Depends(get_current_user)):
    logger.info(f"Retrieved current user: {current_user.username}")
    return current_user

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    try:
        # Here we simply acknowledge the logout request
        return {"message": "Successfully logged out"}
    except JWTError as e:
        logger.error(f"Error during logout: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



