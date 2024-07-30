// src/api/websocket.js
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws/flights';

export const createWebSocket = (onMessage, onOpen, onClose, onError) => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onmessage = onMessage;
    socket.onopen = onOpen;
    socket.onclose = onClose;
    socket.onerror = onError;

    return socket;
};

