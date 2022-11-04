"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const currentUser = (req, res, next) => {
    var _a, _b, _c;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt) && !req.headers['authorization']) {
        return next();
    }
    var token;
    if ((_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt) {
        token = (_c = req.session) === null || _c === void 0 ? void 0 : _c.jwt;
    }
    else {
        token = req.headers['authorization'];
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        req.currentUser = payload;
    }
    catch (error) { }
    next();
};
exports.currentUser = currentUser;
