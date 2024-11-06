import { NextFunction, Request, Response } from "express";

export const signupAuth = (req:Request, res:Response, next:NextFunction) =>{
    const loginPayload = req.body;
}