import { Router } from "express";
const authRouter = Router()


import { signIn, signUp } from "../../controller/authController/auth.controlller";



authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)


export default authRouter;