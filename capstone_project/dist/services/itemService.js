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
exports.itemService = void 0;
// src/services/itemService.ts
const itemRepository_1 = require("../repositories/itemRepository");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class ItemService {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return itemRepository_1.itemRepository.findAll();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield itemRepository_1.itemRepository.findById(id);
            if (!item) {
                throw new ApiError_1.default(404, `Item with ID ${id} not found.`);
            }
            return item;
        });
    }
    create(itemData) {
        return __awaiter(this, void 0, void 0, function* () {
            // These validations are also covered by Joi schema, but good to have service-level checks too
            if (!itemData.name || itemData.price === undefined || itemData.stock === undefined) {
                throw new ApiError_1.default(400, 'Item name, price, and stock are required.');
            }
            if (itemData.price <= 0) {
                throw new ApiError_1.default(400, 'Item price must be positive.');
            }
            if (itemData.stock < 0) {
                throw new ApiError_1.default(400, 'Item stock cannot be negative.');
            }
            return itemRepository_1.itemRepository.create(itemData);
        });
    }
    update(id, itemData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingItem = yield itemRepository_1.itemRepository.findById(id);
            if (!existingItem) {
                throw new ApiError_1.default(404, `Item with ID ${id} not found.`);
            }
            if (itemData.price !== undefined && itemData.price <= 0) {
                throw new ApiError_1.default(400, 'Item price must be positive.');
            }
            if (itemData.stock !== undefined && itemData.stock < 0) {
                throw new ApiError_1.default(400, 'Item stock cannot be negative.');
            }
            const updatedItem = Object.assign(Object.assign(Object.assign({}, existingItem), itemData), { id });
            const result = yield itemRepository_1.itemRepository.update(id, updatedItem);
            if (!result) {
                // This case should ideally not happen if findById passed
                throw new ApiError_1.default(500, `Failed to update item with ID ${id} for an unknown reason.`);
            }
            return result;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield itemRepository_1.itemRepository.delete(id);
            if (!deleted) {
                throw new ApiError_1.default(404, `Item with ID ${id} not found.`);
            }
        });
    }
}
exports.itemService = new ItemService();
