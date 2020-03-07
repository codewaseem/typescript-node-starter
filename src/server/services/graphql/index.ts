import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import Resolvers from "./resolvers";
import Schema from "./typeDefs";

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const gqlServer = new ApolloServer({
  schema: executableSchema,
  context: ({ req }) => req,
});

export default gqlServer;
