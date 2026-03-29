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
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const usersFilePath = path_1.default.join(__dirname, '../../users.json');
const JWT_SECRET = 'your_jwt_secret'; // In a real app, use an environment variable
class AuthService {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield promises_1.default.readFile(usersFilePath, 'utf-8');
                return JSON.parse(data);
            }
            catch (error) {
                console.error('Error reading users file:', error);
                return [];
            }
        });
    }
    generateToken(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.getUsers();
            const user = users.find((u) => u.username === username && u.password === password);
            if (user) {
                const role = user.isAdmin ? 'admin' : 'customer';
                const payload = {
                    id: user.id || username, // Assuming 'id' exists or use username as fallback
                    username: user.username,
                    role: role,
                };
                return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            }
            return null;
        });
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    getAdminBasicAuth() {
        return (0, express_basic_auth_1.default)({
            authorizer: this.adminAuthorizer.bind(this),
            authorizeAsync: true,
            challenge: true,
            realm: 'AdminArea',
        });
    }
    adminAuthorizer(username, password, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.getUsers();
            const adminUser = users.find((u) => u.username === username && u.password === password && u.isAdmin);
            if (adminUser) {
                // Attach user info to the request for Basic Auth as well
                // This part needs to be handled in the middleware that uses getAdminBasicAuth
                // For now, just return authorized true
                return cb(null, true);
            }
            else {
                return cb(null, false);
            }
        });
    }
}
exports.authService = new AuthService();
