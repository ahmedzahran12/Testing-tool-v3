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
exports.jsonController = void 0;
const jsonService_1 = require("../services/jsonService");
class JsonController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonService_1.jsonService.create(req.body);
                res.status(201).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(400).json({ error: 'An unknown error occurred' });
                }
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new Error('ID is required');
                }
                const result = yield jsonService_1.jsonService.get(id);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(404).json({ error: error.message });
                }
                else {
                    res.status(404).json({ error: 'An unknown error occurred' });
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new Error('ID is required');
                }
                const result = yield jsonService_1.jsonService.update(id, req.body);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(400).json({ error: 'An unknown error occurred' });
                }
            }
        });
    }
    patch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new Error('ID is required');
                }
                const result = yield jsonService_1.jsonService.patch(id, req.body);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(400).json({ error: 'An unknown error occurred' });
                }
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
                if (!id) {
                    throw new Error('ID is required');
                }
                yield jsonService_1.jsonService.delete(id);
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(404).json({ error: error.message });
                }
                else {
                    res.status(404).json({ error: 'An unknown error occurred' });
                }
            }
        });
    }
}
exports.jsonController = new JsonController();
