"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
// src/services/orderService.ts
const orderRepository_1 = require("../repositories/orderRepository");
const itemService_1 = require("./itemService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class OrderService {
    createOrder(customerId, itemsDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!customerId) {
                throw new ApiError_1.default(400, 'Customer ID is required to create an order.');
            }
            if (!itemsDetails || itemsDetails.length === 0) {
                throw new ApiError_1.default(400, 'No items provided for the order.');
            }
            const orderItems = [];
            let total = 0;
            for (const itemDetail of itemsDetails) {
                // itemService.findById now throws ApiError(404) if not found
                const item = yield itemService_1.itemService.findById(itemDetail.itemId);
                if (item.stock < itemDetail.quantity) {
                    throw new ApiError_1.default(400, `Not enough stock for item: ${item.name}. Available: ${item.stock}, Requested: ${itemDetail.quantity}`);
                }
                const orderItem = {
                    itemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: itemDetail.quantity,
                };
                orderItems.push(orderItem);
                total += item.price * itemDetail.quantity;
                // Decrement stock
                yield itemService_1.itemService.update(item.id, { stock: item.stock - itemDetail.quantity });
            }
            const newOrder = {
                id: Date.now().toString(),
                customerId,
                items: orderItems,
                total,
                status: 'pending',
                createdAt: Date.now(),
                paid: false,
            };
            yield orderRepository_1.orderRepository.create(newOrder);
            return newOrder;
        });
    }
    findById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield orderRepository_1.orderRepository.findById(orderId);
            if (!order) {
                throw new ApiError_1.default(404, `Order with ID ${orderId} not found.`);
            }
            return order;
        });
    }
    listOrders(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allOrders = yield orderRepository_1.orderRepository.findAll();
            if (customerId) {
                return allOrders.filter(order => order.customerId === customerId);
            }
            return allOrders; // Admin view
        });
    }
    deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderToDelete = yield orderRepository_1.orderRepository.findById(orderId);
            if (!orderToDelete) {
                throw new ApiError_1.default(404, `Order with ID ${orderId} not found.`);
            }
            // Re-increment stock for deleted order items (simplified rollback)
            for (const orderItem of orderToDelete.items) {
                // itemService.findById now throws ApiError(404) if not found
                const item = yield itemService_1.itemService.findById(orderItem.itemId);
                yield itemService_1.itemService.update(item.id, { stock: item.stock + orderItem.quantity });
            }
            const deleted = yield orderRepository_1.orderRepository.delete(orderId);
            if (!deleted) {
                // This case should ideally not happen if findById passed
                throw new ApiError_1.default(500, `Failed to delete order with ID ${orderId} for an unknown reason.`);
            }
        });
    }
    listPaidOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const allOrders = yield orderRepository_1.orderRepository.findAll();
            return allOrders.filter(order => order.paid === true);
        });
    }
    checkoutOrder(orderId, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderToCheckout = yield orderRepository_1.orderRepository.findById(orderId);
            if (!orderToCheckout) {
                throw new ApiError_1.default(404, `Order with ID ${orderId} not found.`);
            }
            if (orderToCheckout.customerId !== customerId) {
                throw new ApiError_1.default(401, 'Unauthorized: This order does not belong to the provided customer ID.');
            }
            if (orderToCheckout.paid) {
                throw new ApiError_1.default(400, `Order with ID ${orderId} has already been paid.`);
            }
            orderToCheckout.paid = true;
            orderToCheckout.status = 'paid'; // Update status to 'paid'
            yield orderRepository_1.orderRepository.update(orderId, orderToCheckout);
            return orderToCheckout;
        });
    }
}
exports.orderService = new OrderService();
