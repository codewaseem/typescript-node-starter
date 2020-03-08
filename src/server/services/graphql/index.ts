import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import AuthResolver from "./resolvers/Auth";

export default async function getGraphQLServer() {
  const schema = await buildSchema({
    resolvers: [AuthResolver],
  });
  return new ApolloServer({
    schema,
  });
}
