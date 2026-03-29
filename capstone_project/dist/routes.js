"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const jsonController_1 = require("./controllers/jsonController");
const authController_1 = require("./controllers/authController");
const authMiddleware_1 = require("./middleware/authMiddleware"); // Import authorizeRoles
const itemController_1 = require("./controllers/itemController"); // Import itemController
const orderController_1 = require("./controllers/orderController"); // Import orderController
const router = (0, express_1.Router)();
exports.router = router;
// Auth route
router.post('/login', authController_1.authController.login);
// Protected JSON routes (existing)
router.use('/json', authMiddleware_1.authMiddleware);
router.post('/json', jsonController_1.jsonController.create);
router.get('/json/:id', jsonController_1.jsonController.get);
router.put('/json/:id', jsonController_1.jsonController.update);
router.patch('/json/:id', jsonController_1.jsonController.patch);
router.delete('/json/:id', jsonController_1.jsonController.delete);
// Item Routes
// List items (Customer and Admin)
router.get('/items', authMiddleware_1.authMiddleware, itemController_1.itemController.list);
// Get single item (Customer and Admin)
router.get('/items/:id', authMiddleware_1.authMiddleware, itemController_1.itemController.get);
// Create items (Admin only)
router.post('/items', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), itemController_1.itemController.create);
// Update item (Admin only)
router.put('/items/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), itemController_1.itemController.update);
// Delete item (Admin only)
router.delete('/items/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), itemController_1.itemController.delete);
// Order Routes
// Create orders (Admin only)
router.post('/orders', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), orderController_1.orderController.createOrder);
// List orders (Customer and Admin) - customer can only list their own, admin can list all
router.get('/orders', authMiddleware_1.authMiddleware, orderController_1.orderController.listOrders);
// Delete order (Admin only)
router.delete('/orders/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), orderController_1.orderController.deleteOrder);
// List paid orders (Admin only)
router.get('/orders/paid', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), orderController_1.orderController.listPaidOrders);
// Checkout items (Customer only)
router.post('/orders/:id/checkout', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['customer']), orderController_1.orderController.checkoutOrder);
