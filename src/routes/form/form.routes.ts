import { Router } from "express";
const formRouter = Router();

import { createNewForm, getAllForm, getFormStats } from "../../controller/form/form.controller";



formRouter.post("/create",createNewForm)

formRouter.get("/stats/:userId",getFormStats);
formRouter.get("/all/:userId",getAllForm)


export default formRouter
