from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
import json
from bson import ObjectId

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()  
        return super().default(obj)

class FlightBase(BaseModel):
    flight_id: str
    airline: str
    departure_city: str
    arrival_city: str
    status: str
    departure_gate: str
    arrival_gate: str
    capacity : int
    scheduled_departure: datetime
    scheduled_arrival: datetime
    actual_departure: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    userList: Optional[List[str]] = []

    def json(self, *args, **kwargs):
        kwargs['cls'] = CustomJSONEncoder
        return super().json(*args, **kwargs)
    
class FlightCreate(FlightBase):
    pass

class FlightUpdateStatus(BaseModel):
    status: Optional[str]

class FlightUpdateArrivalGate(BaseModel):
    arrival_gate: Optional[str]

class FlightUpdateDepartureGate(BaseModel):
    departure_gate: Optional[str]
    
class FlightUpdateArrivalTime(BaseModel):
    scheduled_arrival: Optional[datetime]

class FlightUpdateDepartureTime(BaseModel):
    scheduled_departure: Optional[datetime]
    
class UserBase(BaseModel):
    email: EmailStr
    username: str
    phone_number: str
    
class UserCreate(UserBase):
    password: str
    
class User(UserBase):
    id: str
    is_admin: bool = False

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

