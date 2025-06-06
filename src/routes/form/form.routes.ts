import { Router } from "express";
const formRouter = Router();

import { getFormStats } from "../../controller/form/form.controller";

formRouter.get("/stats/:userId",getFormStats)


export default formRouter
