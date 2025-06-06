"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formRouter = (0, express_1.Router)();
const form_controller_1 = require("../../controller/form/form.controller");
formRouter.get("/stats/:userId", form_controller_1.getFormStats);
exports.default = formRouter;
