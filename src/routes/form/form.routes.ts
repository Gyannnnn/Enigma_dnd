import { Router } from "express";
const formRouter = Router();

import { createNewForm, deleteForm, getAllForm, getFormStats } from "../../controller/form/form.controller";
import { adminCoordinatorAuthValidation } from "../../middleware/auth/adminCordinator.auth";



formRouter.post("/create",adminCoordinatorAuthValidation,createNewForm)
formRouter.delete("/delete/:formid",adminCoordinatorAuthValidation,deleteForm)
formRouter.get("/stats/:userId",getFormStats);90
formRouter.get("/all/:userId",getAllForm)


export default formRouter
