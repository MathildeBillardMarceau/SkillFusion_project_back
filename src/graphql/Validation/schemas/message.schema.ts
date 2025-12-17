import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z.string().min(1),
  userId: z.string(),
  courseId: z.string(),
});

export const updateMessageSchema = z.object({
  id: z.string(),
  input: z.object({
    content: z.string().min(1).optional(),
    userId: z.string().optional(),
    courseId: z.string().optional(),
  }),
});

