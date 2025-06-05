import { useEffect, useState, useCallback, useRef } from "react";
import { getWebSocketClient, WebSocketClient } from "@/lib/websocket";
import { WebSocketMessage } from "@/types/websocket";
import { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { addProduct } from "@/store/slices/productSlice";

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsClient = useRef<WebSocketClient | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        wsClient.current = getWebSocketClient();

        wsClient.current
          .connect()
          .then(() => setIsConnected(true))
          .catch((error) =>
            console.error("Failed to connect to WebSocket:", error)
          );

        const unsubscribe = wsClient.current.subscribe((message) => {
          console.log("WebSocket message received:", message);
          setLastMessage(message);
          if (message.event === "new_product" && message.product) {
            dispatch(addProduct(message.product));
          }
        });

        return () => {
          clearTimeout(timer);
          unsubscribe();
          wsClient.current?.disconnect();
        };
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, isMounted]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsClient.current) {
      console.log("Sending WebSocket message:", message);
      wsClient.current.sendMessage(message);
    } else {
      console.error("WebSocket client not initialized");
    }
  }, []);

  const sendNewProduct = useCallback((product: Product) => {
    if (wsClient.current) {
      console.log("Sending new product via WebSocket:", product);
      wsClient.current.sendNewProduct(product);
    } else {
      console.error("WebSocket client not initialized");
    }
  }, []);

  const syncNewProduct = useCallback((product: Product) => {
    if (wsClient.current) {
      wsClient.current.syncNewProduct(product);
    }
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    sendNewProduct,
    syncNewProduct,
  };
};
