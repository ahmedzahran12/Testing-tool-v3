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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authMiddleware = void 0;
const authService_1 = require("../services/authService");
const authMiddleware = (req, res, next) => {
    const adminAuth = authService_1.authService.getAdminBasicAuth();
    // Try Bearer token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        const user = authService_1.authService.verifyToken(token); // user now includes id and role
        if (user) {
            req.user = user;
            return next();
        }
    }
    // If Bearer token fails or is not present, try Basic Auth for admin
    adminAuth(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
        }
        // Check if basic auth was successful and user is authenticated
        // The basic-auth library attaches `req.auth` if successful
        // We need to manually populate req.user for basic auth users
        if (req.auth && req.auth.user) {
            // For basic auth, we assume it's an admin if it passed adminAuth
            // In a more robust system, we would fetch user details from DB
            // For now, we'll create a dummy admin user
            req.user = { id: req.auth.user, username: req.auth.user, role: 'admin' };
            return next();
        }
        res.setHeader('WWW-Authenticate', 'Bearer realm="Protected", Basic realm="AdminArea"');
        return res.status(401).send('Authentication required.');
    }));
};
exports.authMiddleware = authMiddleware;
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required for this action.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden: ${req.user.role} does not have access.` });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
