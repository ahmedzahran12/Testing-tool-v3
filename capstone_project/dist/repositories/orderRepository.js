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
exports.orderRepository = void 0;
// src/repositories/orderRepository.ts
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.join(__dirname, '../data');
class OrderRepository {
    ensureDataDir() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.access(dataDir);
            }
            catch (error) {
                yield promises_1.default.mkdir(dataDir, { recursive: true });
            }
        });
    }
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDataDir();
            const filePath = path_1.default.join(dataDir, `${order.id}.json`);
            yield promises_1.default.writeFile(filePath, JSON.stringify(order, null, 2));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(dataDir, `${id}.json`);
            try {
                const data = yield promises_1.default.readFile(filePath, 'utf-8');
                return JSON.parse(data);
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    return null; // File not found
                }
                throw new Error(`Error reading order file: ${error.message}`);
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDataDir();
            const files = yield promises_1.default.readdir(dataDir);
            const orderFiles = files.filter(file => file.endsWith('.json') && !file.includes('items.json') && !file.includes('users.json')); // Exclude items.json and users.json
            const orders = [];
            for (const file of orderFiles) {
                try {
                    const data = yield promises_1.default.readFile(path_1.default.join(dataDir, file), 'utf-8');
                    const order = JSON.parse(data);
                    // Basic validation to ensure it's an order object
                    if (order.id && order.customerId && order.items && order.total !== undefined) {
                        orders.push(order);
                    }
                }
                catch (error) {
                    console.error(`Error reading or parsing file ${file}:`, error);
                }
            }
            return orders;
        });
    }
    update(id, updatedOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDataDir();
            const filePath = path_1.default.join(dataDir, `${id}.json`);
            yield promises_1.default.writeFile(filePath, JSON.stringify(updatedOrder, null, 2));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(dataDir, `${id}.json`);
            try {
                yield promises_1.default.unlink(filePath);
                return true;
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    return false; // File not found
                }
                throw new Error(`Error deleting order file: ${error.message}`);
            }
        });
    }
}
exports.orderRepository = new OrderRepository();
