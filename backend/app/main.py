from fastapi import FastAPI, Depends, HTTPException, status
from dotenv import load_dotenv
import os, logging
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId


# Load environment variables from .env file
load_dotenv()

# Ensure SECRET_KEY is set
if not os.getenv('SECRET_KEY'):
    raise ValueError("SECRET_KEY environment variable not set")

# Import after environment variables are loaded
from .crud import create_flight, get_flight, update_flight, delete_flight
from .schema import FlightCreate, FlightBase, FlightUpdateStatus,FlightUpdateArrivalGate,FlightUpdateDepartureGate,FlightUpdateArrivalTime, FlightUpdateDepartureTime
from .dependencies import get_current_user
from .auth import router
from .database import init_db, close_connection, flight_collection, user_collection
from .websocket_router import websocket_router

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.on_event("shutdown")
def on_shutdown():
    close_connection()


origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/auth")
app.include_router(websocket_router, prefix="/ws")

@app.post("/flights", response_model=FlightBase)
async def create_flight_endpoint(flight: FlightCreate, user: dict = Depends(get_current_user)):
    flight_data = await create_flight(flight)
    if not flight_data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Flight creation failed")
    return flight_data

@app.get("/flights/{flight_id}", response_model=FlightBase)
async def get_flight_endpoint(flight_id: str, user: dict = Depends(get_current_user)):
    flight_data = await get_flight(flight_id)
    if not flight_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found")
    return flight_data

@app.put("/flights/{flight_id}/status", response_model=FlightBase)
async def update_flight_status(flight_id: str, update: FlightUpdateStatus, user: dict = Depends(get_current_user)):
    updated_flight = await update_flight(flight_id, update,"status")
    if not updated_flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found or update failed")
    return updated_flight

@app.put("/flights/{flight_id}/arrivalGate", response_model=FlightBase)
async def update_flight_gates(flight_id: str, update: FlightUpdateArrivalGate, user: dict = Depends(get_current_user)):
    updated_flight = await update_flight(flight_id, update,"arrival_gate")
    if not updated_flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found or update failed")
    return updated_flight

@app.put("/flights/{flight_id}/departureGate", response_model=FlightBase)
async def update_flight_gates(flight_id: str, update: FlightUpdateDepartureGate, user: dict = Depends(get_current_user)):
    updated_flight = await update_flight(flight_id, update,"departure_gate")
    if not updated_flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found or update failed")
    return updated_flight

@app.put("/flights/{flight_id}/arrivaltime", response_model=FlightBase)
async def update_flight_schedule(flight_id: str, update: FlightUpdateArrivalTime, user: dict = Depends(get_current_user)):
    updated_flight = await update_flight(flight_id, update,"scheduled_arrival")
    if not updated_flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found or update failed")
    return updated_flight

@app.put("/flights/{flight_id}/departuretime", response_model=FlightBase)
async def update_flight_schedule(flight_id: str, update: FlightUpdateDepartureTime, user: dict = Depends(get_current_user)):
    updated_flight = await update_flight(flight_id, update,"scheduled_departure")
    if not updated_flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found or update failed")
    return updated_flight

@app.delete("/flights/{flight_id}")
async def delete_flight_endpoint(flight_id: str, user: dict = Depends(get_current_user)):
    deleted = await delete_flight(flight_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found or deletion failed")
    return {"message": "Flight deleted successfully"}

logging.basicConfig(level=logging.INFO)

@app.get("/flights/{flight_id}/users")
async def get_users_for_flight(flight_id: str):
    flight = await flight_collection.find_one({"flight_id": flight_id})
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    user_ids = flight.get("userList", [])
    if not user_ids:    
        return []
       
    obj_user_ids = [ObjectId(id) for id in user_ids]
    users_cursor = user_collection.find({"_id": {"$in": obj_user_ids}})
    users = await users_cursor.to_list(length=None)
    if not users:
        raise HTTPException(status_code=404, detail="No users found for this flight")
    serialized_users = [
        {
            "user_id": str(user.get("_id")),
            "email": user.get("email"),
            "phone_number": user.get("phone_number")
        }
        for user in users
    ]      
    return serialized_users