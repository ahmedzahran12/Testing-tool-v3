"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const jsonController_1 = require("./controllers/jsonController");
const authController_1 = require("./controllers/authController");
const authMiddleware_1 = require("./middleware/authMiddleware");
const router = (0, express_1.Router)();
exports.router = router;
// Auth route
router.post('/login', authController_1.authController.login);
// Protected JSON routes
router.use('/json', authMiddleware_1.authMiddleware);
router.post('/json', jsonController_1.jsonController.create);
router.get('/json/:id', jsonController_1.jsonController.get);
router.put('/json/:id', jsonController_1.jsonController.update);
router.patch('/json/:id', jsonController_1.jsonController.patch);
router.delete('/json/:id', jsonController_1.jsonController.delete);
