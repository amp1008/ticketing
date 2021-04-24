"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var body_parser_1 = require("body-parser");
var cookie_session_1 = __importDefault(require("cookie-session"));
var common_1 = require("@amp-tickets/common");
var router_1 = require("./routes/router");
var app = express_1.default();
exports.app = app;
app.set('trust proxy', true);
app.use(cookie_session_1.default({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(body_parser_1.json());
app.use(common_1.currentUser);
app.use(router_1.router);
app.all('*', function () {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
