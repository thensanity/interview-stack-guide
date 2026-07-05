import { z } from "zod";

/** Shared Zod schemas — interview: validate at API boundary, reuse in REST + GraphQL */
export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price: z.number().positive().max(1_000_000),
  category: z.string().min(1).max(100),
  tags: z.array(z.string().max(50)).max(20).optional(),
  inStock: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  category: z.string().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  cursor: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilterQuery = z.infer<typeof productFilterSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
