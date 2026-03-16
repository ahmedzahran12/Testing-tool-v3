"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authService_1 = require("../services/authService");
const authMiddleware = (req, res, next) => {
    const adminAuth = authService_1.authService.getAdminBasicAuth();
    // Try Bearer token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        const user = authService_1.authService.verifyToken(token);
        if (user) {
            // @ts-ignore
            req.user = user;
            return next();
        }
    }
    // If Bearer token fails or is not present, try Basic Auth for admin
    return adminAuth(req, res, (err) => {
        if (err) {
            return next(err);
        }
        // @ts-ignore
        if (!req.auth || !req.auth.user) {
            res.setHeader('WWW-Authenticate', 'Bearer realm="Protected"');
            return res.status(401).send('Authentication required.');
        }
        next();
    });
};
exports.authMiddleware = authMiddleware;
