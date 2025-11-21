import { z } from 'zod';

// Authentication schemas
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required'),
});

// Department schemas
export const departmentNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(
    /^[a-zA-Z0-9\s\-_]+$/,
    'Name can only contain letters, numbers, spaces, hyphens, and underscores'
  )
  .trim();

export const createDepartmentSchema = z.object({
  name: departmentNameSchema,
  subDepartments: z
    .array(
      z.object({
        name: departmentNameSchema,
      })
    )
    .optional()
    .nullable(),
});

export const updateDepartmentSchema = z.object({
  id: z.number().int().positive('ID must be a positive number'),
  name: departmentNameSchema,
});

export const createSubDepartmentSchema = z.object({
  departmentId: z.number().int().positive('Department ID must be a positive number'),
  name: departmentNameSchema,
});

export const updateSubDepartmentSchema = z.object({
  id: z.number().int().positive('ID must be a positive number'),
  name: departmentNameSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
export type CreateSubDepartmentFormData = z.infer<typeof createSubDepartmentSchema>;
export type UpdateSubDepartmentFormData = z.infer<typeof updateSubDepartmentSchema>;

