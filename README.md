# Flight Status 
A comprehensive solution that utilizes a modern tech stack to deliver real-time flight information, including delays, cancellations, and gate changes, while integrating a robust notification system to keep passengers informed.



## Installation

Clone the repository

    git clone https://github.com/AishV05/FlightStatus.git


## Run Backend 
Create and activate the virtual environment

    python -m venv venv

    venv\Scripts\activate

Change directory the backend folder

    cd backend

Install the requirements 

    pip install -r requirements.txt

Run Backend app

    cd app
    uvicorn app.main:app --reload


For environment variables,
populate the following

    MONGODB_URI = <YOUR_MONGODB_URI>
    TWILIO_ACCOUNT_SID = <YOUR_TWILIO_ACCOUNT_SID>
    TWILIO_AUTH_TOKEN = <YOUR_TWILIO_AUTH_TOKEN>
    TWILIO_PHONE_NUMBER = <YOUR_TWILIO_PHONE_NUMBER>
    SECRET_KEY=<YOUR_SECRET_KEY>

## Run Frontend

Change directory to the frontend folder

    cd frontend
    npm install
    npm start





    
    



 


