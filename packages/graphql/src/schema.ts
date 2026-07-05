/** GraphQL SDL — interview topics: schema-first design, types vs REST resources, N+1 with DataLoader */
export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    tags: [String!]!
    inStock: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input ProductFilterInput {
    category: String
    inStock: Boolean
    minPrice: Float
    maxPrice: Float
  }

  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    tags: [String!]
    inStock: Boolean
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    category: String
    tags: [String!]
    inStock: Boolean
  }

  type Query {
    products(filter: ProductFilterInput, limit: Int, offset: Int, cursor: String): ProductPage!
    product(id: ID!): Product
    productsByIds(ids: [ID!]!): [Product]!
    productCount: Int!
    events: [AppEvent!]!
    activeScenarios: [String!]!
    health: String!
    dataProvider: String!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Boolean!
    triggerScenario(id: String!): ScenarioResult!
  }

  type AppEvent {
    id: ID!
    type: String!
    category: String!
    message: String!
    scenarioId: String
    timestamp: String!
  }

  type ScenarioResult {
    ok: Boolean!
    message: String!
  }

  type ProductPage {
    items: [Product!]!
    total: Int!
    limit: Int!
    offset: Int!
    nextCursor: String
  }
`;
