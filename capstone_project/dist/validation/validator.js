"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            throw new ApiError_1.default(400, errors.join('; ')); // Throw ApiError
        }
        // Attach validated data to the request object
        req[source] = value;
        next();
    };
};
exports.validate = validate;
