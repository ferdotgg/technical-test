import { Product } from "./product";

export interface WebSocketMessage {
  event: string;
  product?: Product;
  token?: string;
  [key: string]: unknown;
}
