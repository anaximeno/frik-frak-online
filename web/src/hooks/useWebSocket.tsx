/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useState } from "react";

type WebSocketMessage = {
  data: any;
};

interface UseWebSocketReturn {
  sendSocketMessage: (message: any) => void;
  lastSocketMessage: WebSocketMessage | null;
  socketConnectionStatus: "connecting" | "connected" | "disconnected";
  socketError: Event | null;
}

const useWebSocket = (url: string): UseWebSocketReturn => {
  const socket = useRef<WebSocket | null>(null);
  const [lastSocketMessage, setLastSocketMessage] =
    useState<WebSocketMessage | null>(null);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [socketError, setSocketError] = useState<Event | null>(null);

  useEffect(() => {
    socket.current = new WebSocket(url);
    setSocketConnectionStatus("connecting");

    // Connection opened
    socket.current.onopen = () => {
      console.log("WebSocket connection established");
      setSocketConnectionStatus("connected");
      setSocketError(null);
    };

    // Listen for messages
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Real-time update:", data);
      setLastSocketMessage({ data: data });
    };

    // Handle errors
    socket.current.onerror = (event) => {
      console.error("WebSocket error:", event);
      setSocketError(event);
    };

    // Handle connection close
    socket.current.onclose = () => {
      console.log("WebSocket connection closed");
      setSocketConnectionStatus("disconnected");
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [url]);

  const sendSocketMessage = useCallback((message: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  return {
    sendSocketMessage,
    lastSocketMessage,
    socketConnectionStatus,
    socketError,
  };
};

export default useWebSocket;
