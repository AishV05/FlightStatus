// src/components/Dashboard/FlightList.js

import React, { useState, useEffect } from 'react';
import { createWebSocket } from '../../api/websocket';

const FlightList = () => {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        // WebSocket handlers
        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.flights) {
                setFlights(data.flights);
            }
        };

        const handleOpen = () => {
            console.log('WebSocket connection opened.');
        };

        const handleClose = () => {
            console.log('WebSocket connection closed.');
        };

        const handleError = (error) => {
            console.error('WebSocket error:', error);
        };

        // Create WebSocket connection
        const socket = createWebSocket(handleMessage, handleOpen, handleClose, handleError);

        // Cleanup on component unmount
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className='justify-center align-center '>
            <table className='text-base border-collapse border-slate-400 table-auto font-mono w-full'>
                <thead>
                    <tr>
                        <th className='px-2 py-2 text-right'>Flight Id</th>
                        <th className='px-2 py-2 text-right'>Airline</th>
                        <th className='px-2 py-2 text-right'>Departure City</th>
                        <th className='px-2 py-2 text-right'>Arrival City</th>
                        <th className='px-2 py-2 text-right'>Status</th>
                        <th className='px-2 py-2 text-right'>Departure Gate</th>
                        <th className='px-2 py-2 text-right'>Arrival Gate</th>
                        <th className='px-2 py-2 text-right'>Scheduled Departure</th>
                        <th className='px-2 py-2 text-right'>Scheduled Arrival</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map(flight => (
                        <tr key={flight._id} className="bg-white even:bg-gray-100">
                            <td className='px-2 py-2 text-right'>{flight.flight_id}</td>
                            <td className='px-2 py-2 text-right'>{flight.airline}</td>
                            <td className='px-2 py-2 text-right'>{flight.departure_city}</td>
                            <td className='px-2 py-2 text-right'>{flight.arrival_city}</td>
                            <td className='px-2 py-2 text-right'>{flight.status}</td>
                            <td className='px-2 py-2 text-right'>{flight.departure_gate}</td>
                            <td className='px-2 py-2 text-right'>{flight.arrival_gate}</td>
                            <td className='px-2 py-2 text-right'>{new Date(flight.scheduled_departure).toLocaleString()}</td>
                            <td className='px-2 py-2 text-right'>{new Date(flight.scheduled_arrival).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FlightList;
