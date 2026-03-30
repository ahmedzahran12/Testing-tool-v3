import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService';
import { validate } from '../validation/validator';
import { createOrderSchema } from '../validation/schemas';
import ApiError from '../utils/ApiError'; // Import ApiError

class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      await validate(createOrderSchema)(req, res, () => { });
      const { customerId, items } = req.body;
      const newOrder = await orderService.createOrder(customerId, items);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }

  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.user?.role === 'customer' ? req.user.id : undefined;
      const orders = await orderService.listOrders(customerId);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new ApiError(400, 'Order ID is required.');
      }
      await orderService.deleteOrder(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async listPaidOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const paidOrders = await orderService.listPaidOrders();
      res.status(200).json(paidOrders);
    } catch (error) {
      next(error);
    }
  }

  async checkoutOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customerId = req.user?.id;

      if (!orderId) {
        throw new ApiError(400, 'Order ID is required.');
      }
      if (!customerId) {
        throw new ApiError(401, 'Authentication required: Customer ID not found.');
      }

      const checkedOutOrder = await orderService.checkoutOrder(orderId, customerId);
      res.status(200).json(checkedOutOrder);
    } catch (error) {
      next(error);
    }
  }
  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customerId = req.user?.id;

      if (!orderId) {
        throw new ApiError(400, 'Order ID is required.');
      }
      if (!customerId) {
        throw new ApiError(401, 'Authentication required: Customer ID not found.');
      }

      const cancelledOrder = await orderService.cancelOrder(orderId, customerId);
      res.status(200).json(cancelledOrder);
    } catch (error) {
      next(error);
    }
  }
  async updateItemQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
      const customerId = req.user?.id;
      const { quantity } = req.body;

      if (!orderId || !itemId) throw new ApiError(400, 'Order ID and Item ID are required.');
      if (!customerId) throw new ApiError(401, 'Authentication required: Customer ID not found.');
      if (quantity === undefined) throw new ApiError(400, 'Quantity is required.');

      const updatedOrder = await orderService.updateOrderItemQuantity(orderId, customerId, itemId, Number(quantity));
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
