"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routes_1 = require("./routes");
const ApiError_1 = __importDefault(require("./utils/ApiError")); // Import ApiError
const app = (0, express_1.default)();
// Global API Timeout Middleware (30 seconds)
app.use((req, res, next) => {
    req.setTimeout(30 * 1000, () => {
        const err = new Error('Request Timeout');
        err.status = 408; // 408 Request Timeout
        next(err);
    });
    next();
});
// 1. JSON body parsing middleware with custom error handling for invalid JSON
app.use((0, body_parser_1.json)());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('Invalid JSON received:', err.message);
        return res.status(400).json({ error: 'Invalid JSON payload received.' });
    }
    next(err);
});
// Use the main router
app.use(routes_1.router);
// 2. Handle 404 Not Found (and implicitly 405 for existing paths with unsupported methods by Express)
// This middleware catches requests that fall through all other routes
app.use((req, res, next) => {
    const err = new Error(`Cannot ${req.method} ${req.originalUrl}`);
    err.status = 404;
    next(err);
});
// 3. Centralized Error Handling Middleware (Express-specific)
app.use((err, req, res, next) => {
    // If headers have already been sent, delegate to default Express error handler
    if (res.headersSent) {
        return next(err);
    }
    // Log the error
    console.error('API Error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack); // Log stack in dev
    }
    let statusCode = 500;
    let errorMessage = 'Internal Server Error';
    if (err instanceof ApiError_1.default) {
        statusCode = err.status;
        errorMessage = err.message;
    }
    else if (err.status) { // For errors with a 'status' property (e.g., from req.setTimeout or 404 handler)
        statusCode = err.status;
        errorMessage = err.message;
    }
    // For 500 errors, hide specific error messages in production
    if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
        errorMessage = 'Internal Server Error';
    }
    res.status(statusCode).json({ error: errorMessage });
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Iti Intake 46 Tool for API Testing Sessions`);
    console.log(`Server is running on port ${port}`);
});
// Global unhandled promise rejection handler - only for truly critical issues leading to shutdown
process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
    // Log the stack trace for critical errors
    if (reason instanceof Error) {
        console.error(reason.stack);
    }
    // A robust application might attempt to gracefully shutdown here
    server.close(() => {
        process.exit(1); // Exit with a failure code
    });
});
// Global uncaught exception handler - only for truly critical issues leading to shutdown
process.on('uncaughtException', (error) => {
    console.error('CRITICAL: Uncaught Exception:', error.message);
    console.error(error.stack);
    // A robust application might attempt to gracefully shutdown here
    server.close(() => {
        process.exit(1); // Exit with a failure code
    });
});
