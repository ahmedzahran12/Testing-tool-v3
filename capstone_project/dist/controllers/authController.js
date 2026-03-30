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
exports.authController = void 0;
const authService_1 = require("../services/authService");
const validator_1 = require("../validation/validator");
const schemas_1 = require("../validation/schemas");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class AuthController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validator_1.validate)(schemas_1.loginSchema)(req, res, () => { });
                const { username, password } = req.body;
                const token = yield authService_1.authService.generateToken(username, password);
                if (token) {
                    res.json({ token });
                }
                else {
                    throw new ApiError_1.default(401, 'Invalid credentials');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.authController = new AuthController();
