// src/types.ts

import { Request } from 'express';

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number; // Discount percentage (0–100). Defaults to 0 if not provided.
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  discount: number; // Discount percentage snapshotted from item at order creation time.
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: number;
  paid: boolean;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
}

// Extend the Request type to include a user property, as it will be added by authentication middleware
declare global {
  namespace Express {
    interface Request {
      user?: User; 
      auth?: { user: string; password?: string }; // Added for express-basic-auth
    }
  }
}

