import type { ProductRepository } from "@interview/db";
import type { EventBus, ScenarioId } from "@interview/events";
import type DataLoader from "dataloader";
import type { Product } from "@interview/db";
import type { AuthUser } from "@interview/types";
import { createProductLoader } from "./dataloaders.js";

export interface GraphQLContext {
  repo: ProductRepository;
  dataProvider: string;
  events: EventBus;
  getActiveScenarios: () => ScenarioId[];
  triggerScenario: (id: ScenarioId) => { ok: boolean; message: string };
  user?: AuthUser;
  loaders: {
    product: DataLoader<string, Product | null>;
  };
}

async function dbOp<T>(ctx: GraphQLContext, fn: () => Promise<T>, onDbError?: () => boolean): Promise<T> {
  if (onDbError?.()) throw new Error("Simulated database failure");
  return fn();
}

function assertAuth(ctx: GraphQLContext, enableAuth?: boolean) {
  if (enableAuth && !ctx.user) throw new Error("Authentication required for mutations");
}

function assertAdmin(ctx: GraphQLContext, enableAuth?: boolean) {
  assertAuth(ctx, enableAuth);
  if (enableAuth && ctx.user?.role !== "admin") throw new Error("Admin role required");
}

export function createGraphQLContext(
  repo: ProductRepository,
  dataProvider: string,
  events: EventBus,
  getActiveScenarios: () => ScenarioId[],
  triggerScenario: (id: ScenarioId) => { ok: boolean; message: string }
): GraphQLContext {
  return {
    repo,
    dataProvider,
    events,
    getActiveScenarios,
    triggerScenario,
    loaders: {
      product: createProductLoader(repo),
    },
  };
}

export function createResolvers(onDbError?: () => boolean, enableAuth?: boolean) {
  return {
    Query: {
      products: async (
        _: unknown,
        args: {
          filter?: { category?: string; inStock?: boolean; minPrice?: number; maxPrice?: number };
          limit?: number;
          offset?: number;
          cursor?: string;
        },
        ctx: GraphQLContext
      ) =>
        dbOp(
          ctx,
          () =>
            ctx.repo.findAllPaginated(args.filter, {
              limit: args.limit,
              offset: args.offset,
              cursor: args.cursor,
            }),
          onDbError
        ),

      product: async (_: unknown, args: { id: string }, ctx: GraphQLContext) =>
        dbOp(ctx, () => ctx.loaders.product.load(args.id), onDbError),

      productsByIds: async (_: unknown, args: { ids: string[] }, ctx: GraphQLContext) =>
        dbOp(ctx, () => ctx.loaders.product.loadMany(args.ids), onDbError),

      productCount: async (_: unknown, __: unknown, ctx: GraphQLContext) =>
        dbOp(ctx, () => ctx.repo.count(), onDbError),

      events: (_: unknown, __: unknown, ctx: GraphQLContext) => ctx.events.getHistory(50),

      activeScenarios: (_: unknown, __: unknown, ctx: GraphQLContext) => ctx.getActiveScenarios(),

      health: () => "ok",

      dataProvider: (_: unknown, __: unknown, ctx: GraphQLContext) => ctx.dataProvider,
    },

    ProductPage: {
      items: (page: { items: Product[] }) => page.items,
      total: (page: { total: number }) => page.total,
      limit: (page: { limit: number }) => page.limit,
      offset: (page: { offset: number }) => page.offset,
      nextCursor: (page: { nextCursor: string | null }) => page.nextCursor,
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
        assertAuth(ctx, enableAuth);
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
        assertAuth(ctx, enableAuth);
        const product = await dbOp(ctx, () => ctx.repo.update(args.id, args.input), onDbError);
        if (product) {
          ctx.events.emitDomain("PRODUCT_UPDATED", `Product updated: ${product.name}`, { productId: product.id });
        }
        return product;
      },

      deleteProduct: async (_: unknown, args: { id: string }, ctx: GraphQLContext) => {
        assertAdmin(ctx, enableAuth);
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
