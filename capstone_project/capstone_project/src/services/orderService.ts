// src/services/orderService.ts
import { orderRepository } from '../repositories/orderRepository';
import { itemService } from './itemService';
import { Order, OrderItem } from '../types';
import ApiError from '../utils/ApiError';

class OrderService {
  async createOrder(customerId: string, itemsDetails: { itemId: string; quantity: number }[]): Promise<Order> {
    if (!customerId) {
      throw new ApiError(400, 'Customer ID is required to create an order.');
    }
    if (!itemsDetails || itemsDetails.length === 0) {
      throw new ApiError(400, 'No items provided for the order.');
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const itemDetail of itemsDetails) {
      // itemService.findById throws ApiError(404) if not found
      const item = await itemService.findById(itemDetail.itemId);
      if (item.stock < itemDetail.quantity) {
        throw new ApiError(400, `Not enough stock for item: ${item.name}. Available: ${item.stock}, Requested: ${itemDetail.quantity}`);
      }

      // Snapshot the discount at order creation time
      const discount = item.discount ?? 0;
      const discountedPrice = item.price * (1 - discount / 100);

      const orderItem: OrderItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        discount,
        quantity: itemDetail.quantity,
      };
      orderItems.push(orderItem);
      total += discountedPrice * itemDetail.quantity;

      // Decrement stock
      await itemService.update(item.id, { stock: item.stock - itemDetail.quantity });
    }

    // Round total to 2 decimal places to avoid floating point drift
    total = Math.round(total * 100) / 100;

    const newOrder: Order = {
      id: Date.now().toString(),
      customerId,
      items: orderItems,
      total,
      status: 'pending',
      createdAt: Date.now(),
      paid: false,
    };

    await orderRepository.create(newOrder);
    return newOrder;
  }

  async listOrders(customerId?: string): Promise<Order[]> {
    const allOrders = await orderRepository.findAll();
    if (customerId) {
      return allOrders.filter(order => order.customerId === customerId);
    }
    return allOrders; // Admin view
  }

  async deleteOrder(orderId: string): Promise<void> {
    const orderToDelete = await orderRepository.findById(orderId);
    if (!orderToDelete) {
      throw new ApiError(404, `Order with ID ${orderId} not found.`);
    }

    // Re-increment stock for deleted order items (simplified rollback)
    // Stock rollback uses quantity only — discount does not affect stock counts
    for (const orderItem of orderToDelete.items) {
      const item = await itemService.findById(orderItem.itemId);
      await itemService.update(item.id, { stock: item.stock + orderItem.quantity });
    }

    const deleted = await orderRepository.delete(orderId);
    if (!deleted) {
      throw new ApiError(500, `Failed to delete order with ID ${orderId} for an unknown reason.`);
    }
  }

  async listPaidOrders(): Promise<Order[]> {
    const allOrders = await orderRepository.findAll();
    return allOrders.filter(order => order.paid === true);
  }

  async checkoutOrder(orderId: string, customerId: string): Promise<Order> {
    const orderToCheckout = await orderRepository.findById(orderId);
    if (!orderToCheckout) {
      throw new ApiError(404, `Order with ID ${orderId} not found.`);
    }
    if (orderToCheckout.customerId !== customerId) {
      throw new ApiError(401, 'Unauthorized: This order does not belong to the provided customer ID.');
    }
    if (orderToCheckout.paid) {
      throw new ApiError(400, `Order with ID ${orderId} has already been paid.`);
    }

    orderToCheckout.paid = true;
    orderToCheckout.status = 'paid';

    await orderRepository.update(orderId, orderToCheckout);
    return orderToCheckout;
  }
}

export const orderService = new OrderService();
