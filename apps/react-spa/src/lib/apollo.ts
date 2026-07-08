import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: API_URL ? `${API_URL}/graphql` : "/graphql" }),
  cache: new InMemoryCache(),
});

export const GET_PRODUCTS = `
  query GetProducts {
    products(limit: 10) { items { id name price category inStock } total }
    dataProvider
  }
`;
