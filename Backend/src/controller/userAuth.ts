import  { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";
import { loginValidation, signupValidation } from "../services/zod";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

export const signupAuth = async (req: Request, res: Response) => {
    try {

        const signupPayload = req.body;
        const name = signupPayload.name;
        const email = signupPayload.email;
        const password = signupPayload.password;
        const parsepayload = signupValidation.safeParse(signupPayload);

        if (!parsepayload.success) {
            return res.status(400).json({
                msg: "Failed zod validation in singup controller",
                error: parsepayload.error.errors,
            });
        }

        const userExist = await prisma.user.findFirst({
            where: { email: email }
        });

        if (userExist) {
            return res.status(409).json({
                msg: "User Already Exist. login please "
            });
        }

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password,
            }
        });

        const token = jwt.sign({
            data: newUser.id
        }, 'secret', { expiresIn: '5h' });

        res.status(201).json({
            token
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error in singup controller logic",
            error: error,
        });
    }

};

// ...................................................................................................................................................

export const loginAuth = async (req: Request, res: Response) => {
    try {
        const loginPayload = req.body;
        const email = loginPayload.email;
        const password = loginPayload.password;
        const parsepayload = loginValidation.safeParse(loginPayload);

        if (!parsepayload.success) {
            return res.status(400).json({
                msg: "Failed Zod Validation",
                error: parsepayload.error.errors,
            });
        }

        const userExist = await prisma.user.findFirst({
            where: {
                email: email,
                password: password
            }
        });

        if (userExist) {
            const token = jwt.sign({
                data: userExist.id
            }, 'secret', { expiresIn: '5h' });

            res.status(200).json({
                token
            });
        }

    } catch (error) {
        res.status(500).json({
            msg: "error in login controller",
            error: error,
        });
    }

}

export const userDetails = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        const userDetails = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, password: true }
        });

        if (!userDetails) {
            res.status(404).json({
                error: "User not found"
            })
        }

        res.status(200).json({
            msg: "These are the details of the user",
            data: userDetails
        });

    } catch (error) {
        res.status(500).json({
            msg: "Internal Server error"
        });
    }
}