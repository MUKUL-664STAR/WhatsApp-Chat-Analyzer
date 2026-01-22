"use strict";
/**
 * WhatsApp Chat Analyzer API Server v2.0
 *
 * Main application entry point
 * Configures Express app with middleware and routes, then starts the server
 *
 * @module app
 * @version 2.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const routes_1 = __importDefault(require("./routes"));
const responseHandler_1 = require("./middleware/responseHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// ============================================================
// Middleware Configuration
// ============================================================
// Enable trust proxy
app.enable('trust proxy');
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Enable response compression
app.use((0, compression_1.default)({
    threshold: 1024, // Only compress responses larger than 1KB
    level: 6, // Compression level (0-9)
}));
// Parse JSON bodies
app.use(express_1.default.json());
// Parse URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware (development only)
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const start = Date.now();
        if (!req.path.includes('health')) {
            res.on('finish', () => {
                const duration = Date.now() - start;
                console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
            });
        }
        next();
    });
}
// ============================================================
// Routes
// ============================================================
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'WhatsApp Chat Analyzer API v2.0',
        documentation: '/api/health',
        endpoints: {
            health: 'GET /api/health',
            analyze: 'POST /api/analyze',
            statistics: 'GET /api/statistics',
        },
    });
});
app.get('/status', (req, res) => {
    res.status(200).end();
});
app.head('/status', (req, res) => {
    res.status(200).end();
});
// Mount all API routes
app.use(routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path,
    });
});
// ============================================================
// Error Handler (Must be last)
// ============================================================
app.use(responseHandler_1.errorHandler);
// ============================================================
// Server Startup
// ============================================================
const server = app.listen(PORT, () => {
    console.log('============================================================');
    console.log('🚀 WhatsApp Chat Analyzer API v2.0 (TypeScript)');
    console.log('============================================================');
    console.log(`📡 Server running on port: ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📂 Working directory: ${process.cwd()}`);
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   POST http://localhost:${PORT}/api/analyze`);
    console.log(`   GET  http://localhost:${PORT}/api/statistics`);
    console.log('');
    console.log('✨ Features:');
    console.log('   ✓ TypeScript');
    console.log('   ✓ Joi validation');
    console.log('   ✓ Crypto-js encryption');
    console.log('   ✓ Response compression');
    console.log('   ✓ Standardized error handling');
    console.log('   ✓ Centralized routing');
    console.log('============================================================');
});
// ============================================================
// Graceful Shutdown Handlers
// ============================================================
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=app.js.map