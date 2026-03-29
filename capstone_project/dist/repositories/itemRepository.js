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
exports.itemRepository = void 0;
// src/repositories/itemRepository.ts
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.join(__dirname, '../data');
const itemsFilePath = path_1.default.join(dataDir, 'items.json');
class ItemRepository {
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
    readItemsFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDataDir();
            try {
                const data = yield promises_1.default.readFile(itemsFilePath, 'utf-8');
                return JSON.parse(data);
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    // If file does not exist, return an empty array
                    return [];
                }
                throw new Error(`Error reading items file: ${error.message}`);
            }
        });
    }
    writeItemsFile(items) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDataDir();
            yield promises_1.default.writeFile(itemsFilePath, JSON.stringify(items, null, 2));
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.readItemsFile();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.readItemsFile();
            return items.find(item => item.id === id) || null;
        });
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.readItemsFile();
            const newItem = Object.assign({ id: Date.now().toString() }, item);
            items.push(newItem);
            yield this.writeItemsFile(items);
            return newItem;
        });
    }
    update(id, updatedItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.readItemsFile();
            const index = items.findIndex(item => item.id === id);
            if (index === -1) {
                return null;
            }
            items[index] = Object.assign(Object.assign(Object.assign({}, items[index]), updatedItem), { id }); // Ensure ID remains the same
            yield this.writeItemsFile(items);
            return items[index];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.readItemsFile();
            const initialLength = items.length;
            const filteredItems = items.filter(item => item.id !== id);
            if (filteredItems.length === initialLength) {
                return false; // Item not found
            }
            yield this.writeItemsFile(filteredItems);
            return true;
        });
    }
}
exports.itemRepository = new ItemRepository();
