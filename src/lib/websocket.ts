import { WebSocketMessage } from "@/types/websocket";
import { getToken } from "./auth";
import { Product } from "@/types/product";

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 3000;
  private messageCallbacks: ((message: WebSocketMessage) => void)[] = [];
  private broadcastChannel: BroadcastChannel | null = null;

  constructor(url: string = "wss://echo.websocket.org") {
    this.url = url;

    if (typeof window !== "undefined") {
      this.broadcastChannel = new BroadcastChannel("products-sync");

      this.broadcastChannel.onmessage = (event) => {
        if (event.data.type === "NEW_PRODUCT" && event.data.product) {
          this.notifyListeners({
            event: "new_product",
            product: event.data.product,
          });
        }
      };
    }
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          console.log("WebSocket connection established");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            console.log("Raw WebSocket message received:", event.data);

            if (typeof event.data === "string") {
              const trimmedData = event.data.trim();

              if (trimmedData.startsWith("Request")) {
                console.log("Received server info message:", trimmedData);
                return;
              }

              if (trimmedData.startsWith("{") || trimmedData.startsWith("[")) {
                const data = JSON.parse(trimmedData);
                console.log("Parsed WebSocket JSON message:", data);
                this.notifyListeners(data);

                if (
                  data.event === "new_product" &&
                  data.product &&
                  this.broadcastChannel
                ) {
                  this.broadcastChannel.postMessage({
                    type: "NEW_PRODUCT",
                    product: data.product,
                    source: "websocket",
                  });
                }
              } else {
                console.log("Received non-JSON text message:", trimmedData);
                this.notifyListeners({
                  event: "text",
                  data: trimmedData,
                });
              }
            } else {
              console.log("Received non-string WebSocket message:", event.data);
            }
          } catch (e) {
            console.error("Failed to parse WebSocket message:", e);
            if (typeof event.data === "string") {
              console.log(
                "Error on message:",
                event.data.substring(0, 100) + "..."
              );
            }
          }
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.socket.onclose = () => {
          console.log("WebSocket connection closed");
          this.attemptReconnect();
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection", error);
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }

  public sendMessage(message: WebSocketMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      this.connect().then(() => this.sendMessage(message));
      return;
    }

    const token = getToken();
    if (token) {
      message.token = token;
    }

    this.socket.send(JSON.stringify(message));
  }

  public sendNewProduct(product: Product): void {
    this.sendMessage({
      event: "new_product",
      product,
    });
  }

  public subscribe(callback: (message: WebSocketMessage) => void): () => void {
    this.messageCallbacks.push(callback);

    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  private notifyListeners(message: WebSocketMessage): void {
    this.messageCallbacks.forEach((callback) => callback(message));
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const timeout =
      this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${timeout}ms...`);

    setTimeout(() => {
      this.connect().catch(() => {
        console.error("Reconnect attempt failed");
      });
    }, timeout);
  }

  public syncNewProduct(product: Product): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: "NEW_PRODUCT",
        product,
        source: "local",
      });
    }
  }
}

let wsClientInstance: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!wsClientInstance && typeof window !== "undefined") {
    wsClientInstance = new WebSocketClient();
  }
  return wsClientInstance as WebSocketClient;
}
