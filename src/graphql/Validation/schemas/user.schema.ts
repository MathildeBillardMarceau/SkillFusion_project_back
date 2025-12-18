import { z } from "zod";

///REGISTER

export const PW_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/


export const registerUserSchema = z.object({
  email: z.email(),
  password: z.string().regex(PW_REGEX),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
})

//LOGIN

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().regex(PW_REGEX),
})

//UPDATE

export const updateUserSchema = z.object({
  email: z.email().optional(),
  password: z.string().regex(PW_REGEX).optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
});