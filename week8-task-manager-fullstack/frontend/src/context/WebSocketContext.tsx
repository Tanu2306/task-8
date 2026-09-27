import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { WebSocketEvent } from '../types';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketContextType {
  isConnected: boolean;
  isOnline: boolean;
  onlineUsers: Set<string>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Listen to browser network state
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      queryClient.invalidateQueries();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  // Connect WebSocket when authenticated
  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        setOnlineUsers((prev) => new Set(prev).add(user.email));

        // Subscribe to tasks topic
        client.subscribe('/topic/tasks', (message) => {
          try {
            const event: WebSocketEvent = JSON.parse(message.body);
            // Invalidate React Query cache when task updates arrive via WebSocket
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
          } catch (e) {
            console.error('Failed to parse WS task message:', e);
          }
        });

        // Subscribe to user notifications
        client.subscribe(`/topic/notifications/${user.id}`, () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });

        client.subscribe('/topic/notifications', () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });

        // Subscribe to presence
        client.subscribe('/topic/presence', (message) => {
          try {
            const event: WebSocketEvent<string> = JSON.parse(message.body);
            if (event.type === 'USER_ONLINE') {
              setOnlineUsers((prev) => new Set(prev).add(event.payload));
            } else if (event.type === 'USER_OFFLINE') {
              setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.delete(event.payload);
                return next;
              });
            }
          } catch (e) {
            console.error('Failed to parse WS presence message:', e);
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP Broker error:', frame.headers['message']);
        setIsConnected(false);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [user, queryClient]);

  return (
    <WebSocketContext.Provider value={{ isConnected, isOnline, onlineUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
