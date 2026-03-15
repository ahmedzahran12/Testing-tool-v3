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
exports.jsonRepository = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.join(__dirname, '../data');
class JsonRepository {
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
    create(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDataDir();
            const filePath = path_1.default.join(dataDir, `${id}.json`);
            yield promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2));
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(dataDir, `${id}.json`);
            try {
                const data = yield promises_1.default.readFile(filePath, 'utf-8');
                return JSON.parse(data);
            }
            catch (error) {
                return null;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDataDir();
            const filePath = path_1.default.join(dataDir, `${id}.json`);
            yield promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(dataDir, `${id}.json`);
            try {
                yield promises_1.default.unlink(filePath);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error('Error deleting file');
                }
            }
        });
    }
}
exports.jsonRepository = new JsonRepository();
