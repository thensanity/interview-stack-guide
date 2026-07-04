import type { ProductRepository } from "@interview/db";
import type { EventBus, ScenarioId } from "@interview/events";

export interface GraphQLContext {
  repo: ProductRepository;
  dataProvider: string;
  events: EventBus;
  getActiveScenarios: () => ScenarioId[];
  triggerScenario: (id: ScenarioId) => { ok: boolean; message: string };
}

async function dbOp<T>(ctx: GraphQLContext, fn: () => Promise<T>, onDbError?: () => boolean): Promise<T> {
  if (onDbError?.()) throw new Error("Simulated database failure");
  return fn();
}

export function createResolvers(onDbError?: () => boolean) {
  return {
    Query: {
      products: async (
        _: unknown,
        args: { filter?: { category?: string; inStock?: boolean; minPrice?: number; maxPrice?: number } },
        ctx: GraphQLContext
      ) => dbOp(ctx, () => ctx.repo.findAll(args.filter), onDbError),

      product: async (_: unknown, args: { id: string }, ctx: GraphQLContext) =>
        dbOp(ctx, () => ctx.repo.findById(args.id), onDbError),

      productCount: async (_: unknown, __: unknown, ctx: GraphQLContext) =>
        dbOp(ctx, () => ctx.repo.count(), onDbError),

      events: (_: unknown, __: unknown, ctx: GraphQLContext) => ctx.events.getHistory(50),

      activeScenarios: (_: unknown, __: unknown, ctx: GraphQLContext) => ctx.getActiveScenarios(),

      health: () => "ok",

      dataProvider: (_: unknown, __: unknown, ctx: GraphQLContext) => ctx.dataProvider,
    },

    Mutation: {
      createProduct: async (
        _: unknown,
        args: {
          input: {
            name: string;
            description: string;
            price: number;
            category: string;
            tags?: string[];
            inStock?: boolean;
          };
        },
        ctx: GraphQLContext
      ) => {
        const product = await dbOp(ctx, () => ctx.repo.create(args.input), onDbError);
        ctx.events.emitDomain("PRODUCT_CREATED", `Product created: ${product.name}`, { productId: product.id });
        return product;
      },

      updateProduct: async (
        _: unknown,
        args: {
          id: string;
          input: {
            name?: string;
            description?: string;
            price?: number;
            category?: string;
            tags?: string[];
            inStock?: boolean;
          };
        },
        ctx: GraphQLContext
      ) => {
        const product = await dbOp(ctx, () => ctx.repo.update(args.id, args.input), onDbError);
        if (product) {
          ctx.events.emitDomain("PRODUCT_UPDATED", `Product updated: ${product.name}`, { productId: product.id });
        }
        return product;
      },

      deleteProduct: async (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
        const deleted = await dbOp(ctx, () => ctx.repo.delete(args.id), onDbError);
        if (deleted) {
          ctx.events.emitDomain("PRODUCT_DELETED", `Product deleted: ${args.id}`, { productId: args.id });
        }
        return deleted;
      },

      triggerScenario: async (_: unknown, args: { id: string }, ctx: GraphQLContext) =>
        ctx.triggerScenario(args.id as ScenarioId),
    },
  };
}

export { typeDefs } from "./schema.js";
