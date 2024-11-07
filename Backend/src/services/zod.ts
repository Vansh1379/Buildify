import zod from "zod"

const signupValidation = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(3),
});

const loginValidation = zod.object({
    email: zod.string().email(),
    password: zod.string().min(3),
});

export { signupValidation, loginValidation };