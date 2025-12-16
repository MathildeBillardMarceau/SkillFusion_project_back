import { z } from "zod";

///REGISTER

const PW_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/


export const registerUserSchema = z.object({
  email: z.email(),
  password: z.regex(PW_REGEX),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
})

//LOGIN

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.regex(PW_REGEX),
})