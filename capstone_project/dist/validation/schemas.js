"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createOrderSchema = exports.orderItemSchema = exports.itemSchema = void 0;
// src/validation/schemas.ts
const joi_1 = __importDefault(require("joi"));
// Schema for Item creation and update
exports.itemSchema = joi_1.default.object({
    name: joi_1.default.string()
        .pattern(/^[a-zA-Z0-9\s]+$/) // Alphanumeric characters and spaces only
        .min(3)
        .max(100)
        .required()
        .messages({
        'string.pattern.base': 'Item name must contain only alphanumeric characters and spaces.',
        'string.empty': 'Item name cannot be empty.',
        'string.min': 'Item name should have a minimum length of {#limit}.',
        'string.max': 'Item name should have a maximum length of {#limit}.',
        'any.required': 'Item name is required.',
    }),
    description: joi_1.default.string()
        .pattern(/^[a-zA-Z0-9\s.,!?_()'"-]+$/) // Alphanumeric, spaces, and common punctuation
        .min(5)
        .max(500)
        .optional()
        .messages({
        'string.pattern.base': 'Description contains invalid characters.',
        'string.min': 'Description should have a minimum length of {#limit}.',
        'string.max': 'Description should have a maximum length of {#limit}.',
    }),
    price: joi_1.default.number()
        .positive()
        .precision(2)
        .required()
        .messages({
        'number.base': 'Price must be a number.',
        'number.positive': 'Price must be a positive number.',
        'number.precision': 'Price must have at most {#limit} decimal places.',
        'any.required': 'Price is required.',
    }),
    stock: joi_1.default.number()
        .integer()
        .min(0)
        .required()
        .messages({
        'number.base': 'Stock must be an integer.',
        'number.integer': 'Stock must be an integer.',
        'number.min': 'Stock cannot be negative.',
        'any.required': 'Stock is required.',
    }),
});
// Schema for individual items within an order
exports.orderItemSchema = joi_1.default.object({
    itemId: joi_1.default.string()
        .alphanum() // Item IDs are typically alphanumeric
        .required()
        .messages({
        'string.alphanum': 'Item ID must be alphanumeric.',
        'string.empty': 'Item ID cannot be empty.',
        'any.required': 'Item ID is required.',
    }),
    quantity: joi_1.default.number()
        .integer()
        .min(1)
        .required()
        .messages({
        'number.base': 'Quantity must be a number.',
        'number.integer': 'Quantity must be an integer.',
        'number.min': 'Quantity must be at least {#limit}.',
        'any.required': 'Quantity is required.',
    }),
});
// Schema for Order creation
exports.createOrderSchema = joi_1.default.object({
    customerId: joi_1.default.string()
        .alphanum() // Customer IDs are typically alphanumeric
        .required()
        .messages({
        'string.alphanum': 'Customer ID must be alphanumeric.',
        'string.empty': 'Customer ID cannot be empty.',
        'any.required': 'Customer ID is required.',
    }),
    items: joi_1.default.array()
        .items(exports.orderItemSchema)
        .min(1)
        .required()
        .messages({
        'array.base': 'Items must be an array.',
        'array.min': 'Order must contain at least one item.',
        'any.required': 'Items are required for an order.',
    }),
});
// Schema for Login
exports.loginSchema = joi_1.default.object({
    username: joi_1.default.string()
        .alphanum() // Usernames typically alphanumeric
        .min(3)
        .max(30)
        .required()
        .messages({
        'string.alphanum': 'Username must contain only alphanumeric characters.',
        'string.empty': 'Username cannot be empty.',
        'string.min': 'Username should have a minimum length of {#limit}.',
        'string.max': 'Username should have a maximum length of {#limit}.',
        'any.required': 'Username is required.',
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'string.empty': 'Password cannot be empty.',
        'string.min': 'Password should have a minimum length of {#limit}.',
        'any.required': 'Password is required.',
    }),
});
