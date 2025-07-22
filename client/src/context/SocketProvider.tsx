import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import MockMatchingService from "../lib/mockMatchingService";

interface ISocketContext {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  mockMatching: MockMatchingService;
  isUsingMockMode: boolean;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isUsingMockMode, setIsUsingMockMode] = useState(false);
  const mockMatching = MockMatchingService.getInstance();

  useEffect(() => {
    if (!socket) {
      // Determine socket URL based on environment
      let socketUrl: string;

      if (window.location.hostname.includes('webcontainer-api.io')) {
        // WebContainer environment - use the exposed port URL
        socketUrl = window.location.origin.replace('5173', '8000');
      } else if (window.location.hostname === "localhost") {
        socketUrl = "http://localhost:8000";
      } else {
        socketUrl = `http://${window.location.hostname}:8000`;
      }

      console.log('Attempting to connect to:', socketUrl);

      const newSocket = io(socketUrl, {
        transports: ["websocket", "polling"],
        secure: window.location.protocol === 'https:',
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setIsUsingMockMode(false);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        
        // Try alternative port if localhost
        if (window.location.hostname === "localhost" && socketUrl.includes(":8000")) {
          console.log("Trying alternative port 8001...");
          const altSocket = io("http://localhost:8001", {
            transports: ["websocket", "polling"],
            secure: false,
            timeout: 20000,
            forceNew: true,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
          });
          
          altSocket.on("connect", () => {
            console.log("Connected to alternative port:", altSocket.id);
            setSocket(altSocket);
            setIsUsingMockMode(false);
          });
          
          altSocket.on("connect_error", () => {
            console.log("Alternative port also failed, falling back to mock matching mode");
            setIsUsingMockMode(true);
            mockMatching.startBotSimulation();
            altSocket.close();
          });
        } else {
          console.log("Falling back to mock matching mode");
          setIsUsingMockMode(true);
          mockMatching.startBotSimulation();
        }
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts");
      });

      newSocket.on("reconnect_error", (error) => {
        console.error("Socket reconnection error:", error);
      });

      setSocket(newSocket);

      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
      };
    }
  }, [socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        console.log("Component unmounting, closing socket");
        socket.close();
        setSocket(null);
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, setSocket, mockMatching, isUsingMockMode }}
    >
      {children}
    </SocketContext.Provider>
  );
};
