"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const __1 = require("..");
const currentUser = (req, res, next) => {
    var _a, _b, _c;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt) && !req.headers['authorization']) {
        throw new __1.BadRequestError("Token/Session not provided");
    }
    var token;
    if ((_b = req.session) === null || _b === void 0 ? void 0 : _b.jwt) {
        token = (_c = req.session) === null || _c === void 0 ? void 0 : _c.jwt;
    }
    else {
        const accessToken = req.headers.authorization.split(' ')[1];
        token = accessToken;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        req.currentUser = payload;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new __1.BadRequestError(error.message);
        }
        else {
            throw new __1.BadRequestError(error.message);
        }
    }
    next();
};
exports.currentUser = currentUser;
