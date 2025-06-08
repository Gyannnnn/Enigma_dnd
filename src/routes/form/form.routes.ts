import { Router } from "express";
const formRouter = Router();

import { createNewForm, getFormStats } from "../../controller/form/form.controller";



formRouter.post("/create",createNewForm)

formRouter.get("/stats/:userId",getFormStats);


export default formRouter
