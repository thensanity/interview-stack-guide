/** Shared domain types — consumed by API, web, and react-spa */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
}

export interface PaginatedMeta {
  total: number;
  limit: number;
  offset: number;
  nextCursor?: string | null;
  provider?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginatedMeta;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
