import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
let token = localStorage.getItem('access_token')
export const getFlights = async () => {
    const response = await axios.get(`${API_URL}/flights`);
    return response.data;
};

export const createFlight = async (flightData) => {
    const response = await axios.post(`${API_URL}/flights`, flightData,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateFlight = async (id, flightData) => {
    const response = await axios.put(`${API_URL}/flights/${id}`, flightData,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteFlight = async (id) => {
    const response = await axios.delete(`${API_URL}/flights/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
