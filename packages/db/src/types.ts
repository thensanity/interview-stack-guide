/** Domain model shared across NoSQL providers and GraphQL */
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

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  inStock?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  tags?: string[];
  inStock?: boolean;
}

export interface ProductFilter {
  category?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

/** Repository pattern — interview talking point: swap implementations without changing API layer */
export interface ProductRepository {
  findAll(filter?: ProductFilter): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export type DataProvider = "mongodb" | "dynamodb";

export interface DbConfig {
  provider: DataProvider;
  mongodbUri?: string;
  dynamodb?: {
    tableName: string;
    region: string;
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
}
