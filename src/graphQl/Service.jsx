import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://eu-west-2.cdn.hygraph.com/content/cm71z3a6k00lx07usssoh7nfe/master",
  cache: new InMemoryCache(),
});

export default client;