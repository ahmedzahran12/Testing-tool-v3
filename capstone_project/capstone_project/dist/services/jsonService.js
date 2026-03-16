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
exports.jsonService = void 0;
const jsonRepository_1 = require("../repositories/jsonRepository");
class JsonService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || Object.keys(data).length === 0) {
                throw new Error('Data is required');
            }
            const id = Date.now().toString();
            const newData = Object.assign({ id }, data);
            yield jsonRepository_1.jsonRepository.create(id, newData);
            return newData;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield jsonRepository_1.jsonRepository.get(id);
            if (!data) {
                throw new Error('Data not found');
            }
            return data;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || Object.keys(data).length === 0) {
                throw new Error('Data is required');
            }
            const existingData = yield jsonRepository_1.jsonRepository.get(id);
            if (!existingData) {
                throw new Error('Data not found');
            }
            const updatedData = Object.assign(Object.assign({}, existingData), data);
            yield jsonRepository_1.jsonRepository.update(id, updatedData);
            return updatedData;
        });
    }
    patch(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || Object.keys(data).length === 0) {
                throw new Error('Data is required');
            }
            const existingData = yield jsonRepository_1.jsonRepository.get(id);
            if (!existingData) {
                throw new Error('Data not found');
            }
            const updatedData = Object.assign(Object.assign({}, existingData), data);
            yield jsonRepository_1.jsonRepository.update(id, updatedData);
            return updatedData;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingData = yield jsonRepository_1.jsonRepository.get(id);
            if (!existingData) {
                throw new Error('Data not found');
            }
            yield jsonRepository_1.jsonRepository.delete(id);
        });
    }
}
exports.jsonService = new JsonService();
