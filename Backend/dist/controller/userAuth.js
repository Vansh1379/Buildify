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
exports.userDetails = exports.loginAuth = exports.signupAuth = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("../services/zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signupAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signupPayload = req.body;
        const name = signupPayload.name;
        const email = signupPayload.email;
        const password = signupPayload.password;
        const parsepayload = zod_1.signupValidation.safeParse(signupPayload);
        if (!parsepayload.success) {
            return res.status(400).json({
                msg: "Failed zod validation in singup controller",
                error: parsepayload.error.errors,
            });
        }
        const userExist = yield prisma.user.findFirst({
            where: { email: email }
        });
        if (userExist) {
            return res.status(409).json({
                msg: "User Already Exist. login please "
            });
        }
        const newUser = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password,
            }
        });
        const token = jsonwebtoken_1.default.sign({
            data: newUser.id
        }, 'secret', { expiresIn: '5h' });
        res.status(201).json({
            token
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Error in singup controller logic",
            error: error,
        });
    }
});
exports.signupAuth = signupAuth;
// ...................................................................................................................................................
const loginAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginPayload = req.body;
        const email = loginPayload.email;
        const password = loginPayload.password;
        const parsepayload = zod_1.loginValidation.safeParse(loginPayload);
        if (!parsepayload.success) {
            return res.status(400).json({
                msg: "Failed Zod Validation",
                error: parsepayload.error.errors,
            });
        }
        const userExist = yield prisma.user.findFirst({
            where: {
                email: email,
                password: password
            }
        });
        if (userExist) {
            const token = jsonwebtoken_1.default.sign({
                data: userExist.id
            }, 'secret', { expiresIn: '5h' });
            res.status(200).json({
                token
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: "error in login controller",
            error: error,
        });
    }
});
exports.loginAuth = loginAuth;
const userDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const userDetails = yield prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, password: true }
        });
        if (!userDetails) {
            res.status(404).json({
                error: "User not found"
            });
        }
        res.status(200).json({
            msg: "These are the details of the user",
            data: userDetails
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal Server error"
        });
    }
});
exports.userDetails = userDetails;
