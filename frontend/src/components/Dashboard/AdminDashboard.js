import React, { useState, useEffect } from 'react';
import { getFlights, createFlight, updateFlight, deleteFlight } from '../../api/flights';

const AdminDashboard = () => {
    const [flights, setFlights] = useState([]);
    const [newFlight, setNewFlight] = useState({
        flight_id: '',
        airline: '',
        departure_city: '',
        arrival_city: '',
        status: '',
        departure_gate: '',
        arrival_gate: '',
        scheduled_departure: '',
        scheduled_arrival: '',
    });
    const [editFlight, setEditFlight] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const allFlights = await getFlights();
                setFlights(allFlights);
            } catch (error) {
                console.error("Failed to fetch flights", error);
            }
        };

        fetchFlights();
    }, []);

    const handleCreate = async () => {
        try {
            await createFlight(newFlight);
            setNewFlight({
                flight_id: '',
                airline: '',
                departure_city: '',
                arrival_city: '',
                status: '',
                departure_gate: '',
                arrival_gate: '',
                scheduled_departure: '',
                scheduled_arrival: '',
            });
            const updatedFlights = await getFlights();
            setFlights(updatedFlights);
        } catch (error) {
            console.error("Failed to create flight", error);
        }
    };

    const handleUpdate = async () => {
        try {
            if (editFlight) {
                await updateFlight(editFlight._id, editFlight);
                setEditFlight(null);
                const updatedFlights = await getFlights();
                setFlights(updatedFlights);
            }
        } catch (error) {
            console.error("Failed to update flight", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteFlight(id);
            const updatedFlights = await getFlights();
            setFlights(updatedFlights);
        } catch (error) {
            console.error("Failed to delete flight", error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            
            {/* Create Flight Form */}
            <h2>Create Flight</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                <input
                    type="text"
                    placeholder="Flight ID"
                    value={newFlight.flight_id}
                    onChange={(e) => setNewFlight({ ...newFlight, flight_id: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Airline"
                    value={newFlight.airline}
                    onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={newFlight.status}
                    onChange={(e) => setNewFlight({ ...newFlight, status: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Departure Gate"
                    value={newFlight.departure_gate}
                    onChange={(e) => setNewFlight({ ...newFlight, departure_gate: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Arrival Gate"
                    value={newFlight.arrival_gate}
                    onChange={(e) => setNewFlight({ ...newFlight, arrival_gate: e.target.value })}
                />
                <input
                    type="datetime-local"
                    placeholder="Scheduled Departure"
                    value={newFlight.scheduled_departure}
                    onChange={(e) => setNewFlight({ ...newFlight, scheduled_departure: e.target.value })}
                />
                <input
                    type="datetime-local"
                    placeholder="Scheduled Arrival"
                    value={newFlight.scheduled_arrival}
                    onChange={(e) => setNewFlight({ ...newFlight, scheduled_arrival: e.target.value })}
                />
                <button type="submit">Create Flight</button>
            </form>

            {/* Update Flight Form */}
            {editFlight && (
                <div>
                    <h2>Update Flight</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <input
                            type="text"
                            placeholder="Flight ID"
                            value={editFlight.flight_id}
                            onChange={(e) => setEditFlight({ ...editFlight, flight_id: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Airline"
                            value={editFlight.airline}
                            onChange={(e) => setEditFlight({ ...editFlight, airline: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Status"
                            value={editFlight.status}
                            onChange={(e) => setEditFlight({ ...editFlight, status: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Departure Gate"
                            value={editFlight.departure_gate}
                            onChange={(e) => setEditFlight({ ...editFlight, departure_gate: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Arrival Gate"
                            value={editFlight.arrival_gate}
                            onChange={(e) => setEditFlight({ ...editFlight, arrival_gate: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            placeholder="Scheduled Departure"
                            value={editFlight.scheduled_departure}
                            onChange={(e) => setEditFlight({ ...editFlight, scheduled_departure: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            placeholder="Scheduled Arrival"
                            value={editFlight.scheduled_arrival}
                            onChange={(e) => setEditFlight({ ...editFlight, scheduled_arrival: e.target.value })}
                        />
                        <button type="submit">Update Flight</button>
                    </form>
                </div>
            )}

            {/* Flight List */}
            <h2>Manage Flights</h2>
            <ul>
                {flights.map(flight => (
                    <li key={flight._id}>
                        <h3>{flight.flight_id}</h3>
                        <p>Airline: {flight.airline}</p>
                        <p>Status: {flight.status}</p>
                        <p>Departure Gate: {flight.departure_gate}</p>
                        <p>Arrival Gate: {flight.arrival_gate}</p>
                        <p>Scheduled Departure: {flight.scheduled_departure}</p>
                        <p>Scheduled Arrival: {flight.scheduled_arrival}</p>
                        <button onClick={() => setEditFlight(flight)}>Edit</button>
                        <button onClick={() => handleDelete(flight._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;





