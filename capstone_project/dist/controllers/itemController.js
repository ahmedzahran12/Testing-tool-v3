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
exports.itemController = void 0;
const itemService_1 = require("../services/itemService");
const validator_1 = require("../validation/validator");
const schemas_1 = require("../validation/schemas");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class ItemController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation is now handled by a middleware that throws ApiError if validation fails
                yield (0, validator_1.validate)(schemas_1.itemSchema)(req, res, () => { }); // Call validate middleware
                const newItem = yield itemService_1.itemService.create(req.body);
                res.status(201).json(newItem);
            }
            catch (error) {
                next(error); // Pass error to global error handler
            }
        });
    }
    list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield itemService_1.itemService.findAll();
                res.status(200).json(items);
            }
            catch (error) {
                next(error);
            }
        });
    }
    get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new ApiError_1.default(400, 'Item ID is required.');
                }
                const item = yield itemService_1.itemService.findById(id); // findById now throws ApiError(404)
                res.status(200).json(item);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new ApiError_1.default(400, 'Item ID is required.');
                }
                yield (0, validator_1.validate)(schemas_1.itemSchema)(req, res, () => { }); // Call validate middleware
                const updatedItem = yield itemService_1.itemService.update(id, req.body); // update now throws ApiError(404)
                res.status(200).json(updatedItem);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new ApiError_1.default(400, 'Item ID is required.');
                }
                yield itemService_1.itemService.delete(id); // delete now throws ApiError(404)
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.itemController = new ItemController();
