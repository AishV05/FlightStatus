from .database import flight_collection
from .schema import FlightCreate, FlightBase
from .notifications import notify_users
from datetime import datetime
from typing import List, Tuple

async def create_flight(flight: FlightCreate):
    flight_data = flight.dict()
    await flight_collection.insert_one(flight_data)
    return flight

async def get_flight(flight_id: str):
    return await flight_collection.find_one({"flight_id": flight_id})

async def update_flight(flight_id: str, update: FlightBase, update_type: str):
    og_flight = await flight_collection.find_one({"flight_id": flight_id})
    if not og_flight:
        return None
    
    update_data = update.dict(exclude_unset=True)
    changes = []

    for key, value in update_data.items():
        if key in og_flight and og_flight[key] != value:
            changes.append((key, og_flight[key], value))
            og_flight[key] = value

    await flight_collection.update_one({"flight_id": flight_id}, {"$set": og_flight})
    
    flight_data = await flight_collection.find_one({"flight_id": flight_id})
    message = generate_update_message(flight_id, changes, update_type)
    
    await notify_users(flight_data, message)
    return flight_data

def generate_update_message(flight_id: str, changes: List[Tuple[str, any, any]], update_type: str) -> str:
    messages = {
        "status": "status",
        "departure_gate": "departure gate",
        "arrival_gate": "arrival gate",
        "scheduled_departure": "scheduled departure time",
        "scheduled_arrival": "scheduled arrival time",
    }

    change_messages = []
    for change in changes:
        field, old, new = change
        if field in messages:
            field_name = messages[field]
            if isinstance(old, datetime):
                old = old.isoformat()
            if isinstance(new, datetime):
                new = new.isoformat()
            change_messages.append(f"Your flight's {field_name} has been changed from {old} to {new}")

    return f"{flight_id}: " + "; ".join(change_messages)


async def delete_flight(flight_id: str):


    result = await flight_collection.delete_one({"flight_id": flight_id})
    return result.deleted_count > 0

async def get_all_flights():
    flights = await flight_collection.find().to_list(None)
    return flights

