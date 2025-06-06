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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormStats = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getFormStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!(userId === null || userId === void 0 ? void 0 : userId.trim())) {
        res.status(400).json({
            message: "All fields are required !",
        });
        return;
    }
    try {
        const isUserExist = yield prisma.user.findUnique({
            where: {
                userId,
            },
        });
        if (!userId) {
            res.status(404).json({
                message: "No users found !",
            });
            return;
        }
        const stats = yield prisma.form.aggregate({
            where: {
                userId,
            },
            _sum: {
                visits: true,
                submissions: true,
            },
        });
        if (!stats) {
            res.status(500).json({
                message: "Something went wrong try again",
            });
        }
        const visits = stats._sum.visits || 0;
        const submissions = stats._sum.submissions || 0;
        let submissionRate = 0;
        if (visits > 0) {
            submissionRate = (submissions / visits) * 100;
        }
        const bounceRate = 100 - submissionRate;
        res.status(200).json({
            message: "Statistics fetched successfully",
            data: {
                visits: visits,
                submissions: submissions,
                submissionRate: submissionRate,
                bounceRate: bounceRate,
            },
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.getFormStats = getFormStats;
