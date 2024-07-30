from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .websocket_manager import WebSocketManager
from .notifications import notify_users
from typing import List
from datetime import datetime
from .database import flight_collection
import json
from .dependencies import fetch_user_details

websocket_router = APIRouter()
manager = WebSocketManager()

def serialize_flight(flight):
    # Convert the MongoDB ObjectId to a string
    flight['_id'] = str(flight['_id'])
    
    # Convert datetime objects to ISO 8601 string format
    for key in ['scheduled_departure', 'scheduled_arrival', 'actual_departure', 'actual_arrival']:
        if flight.get(key):
            flight[key] = flight[key].isoformat()
    
    return flight

@websocket_router.websocket("/flights")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            try:
                flights = await flight_collection.find().to_list(length=None)
                flight_data = {"flights": [serialize_flight(flight) for flight in flights]}
                
                # # Send flight update to Kafka
                # for flight in flight_data['flights']:
                #     send_flight_update_to_kafka(flight)
                
                # Broadcast to WebSocket clients
                await manager.broadcast(flight_data)
            except Exception as e:
                print(f"Error during WebSocket operation: {e}")
                break
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({"message": "A client disconnected"})




