import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const gqlServer = new ApolloServer({
  schema: executableSchema,
  context: ({ req }) => req,
});

export default gqlServer;
