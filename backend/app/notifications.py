import os
from twilio.rest import Client
from typing import List
from .dependencies import fetch_user_details

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_sms_notification(phone_number: str, message: str):
    if not message:
        raise ValueError("Message body is required")
    try:
        
        twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        print(f"SMS sent to {phone_number}: {message}")
    except Exception as e:
        print(f"Failed to send SMS: {e}")

async def notify_users(flight_update: dict, message: str):
    flight_users = flight_update.get('userList', [])
    user_phone_numbers = await fetch_user_details(flight_users)

    # Ensure the message is not empty
    if not message:
        raise ValueError("Notification message is required")

    # SMS notifications
    for phone_number in user_phone_numbers:
        send_sms_notification(phone_number, message)
