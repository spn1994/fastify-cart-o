"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//devido ao erro SyntaxError: Cannot use import statement outside a module, mudei para assim
const database_1 = require("./src/database");
const config = database_1.config;
exports.default = config;
