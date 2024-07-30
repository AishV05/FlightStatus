import React, { useState, useEffect } from 'react';
import { getUserFlights } from '../../api/flights';

const UserDashboard = () => {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        const fetchFlights = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const userFlights = await getUserFlights(token);
                setFlights(userFlights);
            } catch (error) {
                console.error("Failed to fetch user flights", error);
            }
        };

        fetchFlights();
    }, []);

    return (
        <div>
            <h1>User Dashboard</h1>
            <ul>
                {flights.map(flight => (
                    <li key={flight._id}>
                        <h2 className='text-gray-50'>{flight.flight_id}</h2>
                        <p>Airline: {flight.airline}</p>
                        <p>Status: {flight.status}</p>
                        <p>Departure Gate: {flight.departure_gate}</p>
                        <p>Arrival Gate: {flight.arrival_gate}</p>
                        <p>Scheduled Departure: {flight.scheduled_departure}</p>
                        <p>Scheduled Arrival: {flight.scheduled_arrival}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserDashboard;
