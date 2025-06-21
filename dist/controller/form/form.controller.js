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
exports.getFormById = exports.deleteForm = exports.getAllForm = exports.createNewForm = exports.getFormStats = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const zod_1 = __importDefault(require("zod"));
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
        if (!isUserExist) {
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
const createNewForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = zod_1.default.object({
            userId: zod_1.default.string().uuid(),
            name: zod_1.default.string().min(4, "Name is required and of 4 characters"),
            description: zod_1.default.string(),
        });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid input",
                error: result.error,
            });
            return;
        }
        const { userId, name, description } = result.data;
        const user = yield prisma.user.findUnique({
            where: {
                userId,
            },
        });
        if (!user) {
            res.status(404).json({
                message: "No users found !",
            });
        }
        const newForm = yield prisma.form.create({
            data: {
                userId,
                name,
                description,
            },
        });
        if (!newForm) {
            res.status(400).json({
                message: "Failed to create form",
            });
            return;
        }
        res.status(200).json({
            message: `${name} Form created successfully`,
            form: newForm,
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
exports.createNewForm = createNewForm;
const getAllForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = zod_1.default.object({
            userId: zod_1.default.string().uuid("User id is required and it must be uuid"),
        });
        const result = schema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid input",
                error: result.error,
            });
            return;
        }
        const { userId } = result.data;
        const forms = yield prisma.form.findMany({
            where: { userId }, orderBy: {
                createdAt: "desc"
            }
        });
        if (!forms || forms.length === 0) {
            res.status(404).json({
                message: "No forms found",
            });
            return;
        }
        res.status(200).json({
            message: "Forms fetched",
            forms,
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
exports.getAllForm = getAllForm;
const deleteForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formid } = req.params;
    if (!formid) {
        res.status(400).json({
            message: "All fields are required"
        });
        return;
    }
    try {
        const form = yield prisma.form.findUnique({
            where: {
                id: formid
            }
        });
        if (!form) {
            res.status(404).json({
                message: "No form found"
            });
        }
        yield prisma.form.delete({
            where: {
                id: formid
            }
        });
        res.status(200).json({
            message: `${form === null || form === void 0 ? void 0 : form.name} form deleted `
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});
exports.deleteForm = deleteForm;
const getFormById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, formId } = req.body;
    if (!(userId === null || userId === void 0 ? void 0 : userId.trim()) || !(formId === null || formId === void 0 ? void 0 : formId.trim())) {
        res.status(400).json({
            message: "All fields are required"
        });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                userId
            }
        });
        if (!user) {
            res.status(404).json({
                message: "NO users found"
            });
            return;
        }
        const form = yield prisma.form.findUnique({
            where: {
                userId,
                id: formId
            }
        });
        if (!form) {
            res.status(404).json({
                message: "No form found"
            });
            return;
        }
        res.status(200).json({
            message: `${form.name} form fetched successfully`,
            form: form
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});
exports.getFormById = getFormById;
