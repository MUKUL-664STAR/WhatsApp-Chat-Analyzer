"use strict";
/**
 * Main Routes Configuration
 *
 * Central routing file that imports and configures all route modules
 *
 * @module routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const router = (0, express_1.Router)();
// API Routes
router.use('/api', chatRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map