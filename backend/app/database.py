from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the MongoDB URL from environment variables
MONGO_URL = os.getenv('MONGODB_URI', 'mongodb://127.0.0.1:27017/flight_db')

# Initialize the MongoDB client
client = AsyncIOMotorClient(MONGO_URL)

# Select the database
db = client.get_database()

# Define the collection for flights and users
flight_collection = db.get_collection('flights')
user_collection = db.get_collection('users')
notification_collection = db.get_collection('notifications')

# Ensure unique indexes on email and username
async def init_db():
    logger.info("Initializing database...")
    await db["users"].create_index("email", unique=True)
    await db["users"].create_index("username", unique=True)
    logger.info("Database initialized with unique indexes on email and username")

# Function to close the database connection
def close_connection():
    logger.info("Closing database connection")
    client.close()

