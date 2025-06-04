"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
const auth_controlller_1 = require("../../controller/authController/auth.controlller");
authRouter.post("/signup", auth_controlller_1.signUp);
authRouter.post("/signin", auth_controlller_1.signIn);
exports.default = authRouter;
