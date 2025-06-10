require('dotenv').config()

import { NextFunction,Request,Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"


export const adminCoordinatorAuthValidation = async(req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({
            message: "Unauthorised access"
        });
        return
    }
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload
        const role = decoded.userRole

        if(role==="admin" || role === "coordinator"){
            next()
        }else{
            res.status(403).json({
                message: "Access denied"
            });
            return
        }
    } catch (error) {
        res.status(403).json({
            message: "Invalid or expired token"
        })
        
    }
}