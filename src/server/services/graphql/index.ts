import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import AuthResolver from "./resolvers/Auth";
import { TypegooseMiddleware } from "./middlewares/typegoose-middleware";

export default async function getGraphQLServer() {
  const schema = await buildSchema({
    resolvers: [AuthResolver],
    globalMiddlewares: [TypegooseMiddleware],
  });
  return new ApolloServer({
    schema,
  });
}
