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
exports.signIn = exports.signUp = void 0;
require("dotenv").config();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = zod_1.default.object({
            userName: zod_1.default.string().min(4, "Name is required"),
            userEmail: zod_1.default.string().email("Invalid Email"),
            userPassword: zod_1.default.string().min(8, "Password must be 8 characters"),
            userAvtar: zod_1.default.string().url("Invalid avtar url"),
            userRegistrationNumber: zod_1.default
                .string()
                .length(10, "Registration number must be exactly 10 characters"),
        });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid input",
                error: result.error.format(),
            });
            return;
        }
        const { userName, userEmail, userPassword, userAvtar, userRegistrationNumber, } = result.data;
        const isUserExist = yield prisma.user.findFirst({
            where: {
                userEmail,
                userRegistrationNumber,
            },
        });
        if (isUserExist) {
            res.status(409).json({
                message: "User already exists !",
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(userPassword, 10);
        const user = yield prisma.user.create({
            data: {
                userName,
                userEmail,
                userPassword: hashedPassword,
                userAvtar,
                userRegistrationNumber,
            },
        });
        if (!user) {
            res.status(500).json({
                message: "Failed to signup",
            });
            return;
        }
        console.log(process.env.JWT_SECRET);
        const token = jsonwebtoken_1.default.sign({ userEmail: user.userEmail, userRole: user.userRole }, process.env.JWT_SECRET ||
            "oquhejceuiscgihnieivriguotruichugihueihgi626454995959x59f5er9f59g9r4b9w494br9t", { expiresIn: "30days" });
        res.status(200).json({
            message: `${user.userName} signed up`,
            token: token,
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: `${err.message}`,
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = zod_1.default.object({
            userEmail: zod_1.default.string().email("Invalid email"),
            userPassword: zod_1.default.string().min(8, "Password must be 8 characters"),
        });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                messsage: "Invalid input",
                error: result.error.flatten(),
            });
            return;
        }
        const { userEmail, userPassword } = result.data;
        const isUserExist = yield prisma.user.findUnique({
            where: { userEmail },
        });
        if (!isUserExist) {
            res.status(404).json({
                message: "No user found try signing up",
            });
            return;
        }
        const validPassword = yield bcryptjs_1.default.compare(userPassword, isUserExist.userPassword);
        if (!validPassword) {
            res.status(401).json({
                message: "Incorrect password",
            });
            return;
        }
        console.log("signin");
        console.log(process.env.JWT_SECRET);
        const token = jsonwebtoken_1.default.sign({ userEmail: isUserExist.userEmail, userRole: isUserExist.userRole }, process.env.JWT_SECRET ||
            "oquhejceuiscgihnieivriguotruichugihueihgi626454995959x59f5er9f59g9r4b9w494br9t", { expiresIn: "30days" });
        res.status(200).json({
            message: `${isUserExist.userName} signed in successfully`,
            token: token,
            user: {
                userId: isUserExist.userId,
                userName: isUserExist.userName,
                userEmail: isUserExist.userEmail,
                userAvtar: isUserExist.userAvtar,
                userRole: isUserExist.userRole,
            },
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: `${err.message}`,
        });
    }
});
exports.signIn = signIn;
