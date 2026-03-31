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
exports.orderController = void 0;
const orderService_1 = require("../services/orderService");
const validator_1 = require("../validation/validator");
const schemas_1 = require("../validation/schemas");
const ApiError_1 = __importDefault(require("../utils/ApiError")); // Import ApiError
class OrderController {
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validator_1.validate)(schemas_1.createOrderSchema)(req, res, () => { });
                const { customerId, items } = req.body;
                const newOrder = yield orderService_1.orderService.createOrder(customerId, items);
                res.status(201).json(newOrder);
            }
            catch (error) {
                next(error);
            }
        });
    }
    listOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const customerId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'customer' ? req.user.id : undefined;
                const orders = yield orderService_1.orderService.listOrders(customerId);
                res.status(200).json(orders);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new ApiError_1.default(400, 'Order ID is required.');
                }
                // Customer-specific role validations
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'customer') {
                    const order = yield orderService_1.orderService.findById(id); // orderService.findById throws 404 if not found
                    if (order.customerId !== req.user.id) {
                        throw new ApiError_1.default(403, 'Forbidden: You can only delete your own orders.');
                    }
                    if (order.status !== 'pending') {
                        throw new ApiError_1.default(403, 'Forbidden: You cannot cancel an order that has already been paid or shipped.');
                    }
                }
                yield orderService_1.orderService.deleteOrder(id);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
    listPaidOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paidOrders = yield orderService_1.orderService.listPaidOrders();
                res.status(200).json(paidOrders);
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkoutOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!orderId) {
                    throw new ApiError_1.default(400, 'Order ID is required.');
                }
                if (!customerId) {
                    throw new ApiError_1.default(401, 'Authentication required: Customer ID not found.');
                }
                const checkedOutOrder = yield orderService_1.orderService.checkoutOrder(orderId, customerId);
                res.status(200).json(checkedOutOrder);
            }
            catch (error) {
                next(error);
            }
        });
    }
    shipOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!orderId) {
                    throw new ApiError_1.default(400, 'Order ID is required.');
                }
                const shippedOrder = yield orderService_1.orderService.shipOrder(orderId);
                res.status(200).json(shippedOrder);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.orderController = new OrderController();
