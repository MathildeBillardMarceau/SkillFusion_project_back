import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2),
});


export const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  userId: z.string().min(1),
  categoriesId: z.array(z.string()).optional(),
  chapters: z.array( z.object ({ 
    title: z.string().min(1),
    description: z.string().optional(),
    text: z.string().optional(),
    order: z.number().optional(),
    media: z.object({
      id: z.string().optional(),
      url: z.string().optional(),
    }).optional(),
})
  ).optional(),
});

export const updateCourseSchema = z.object ({
  id: z.string(),
  input: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    categoriesId: z.array(z.string()).optional(),
    chapters: z.array(z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      text: z.string().optional(),
      order: z.number().optional(),
      media: z.object({
        id: z.string().optional(),
        url: z.string().optional(),
      }).optional(),
    })).optional(),
  }).optional(),
});
