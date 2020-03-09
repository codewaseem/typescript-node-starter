import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import AuthResolver from "./resolvers/Auth";
import { TypegooseMiddleware } from "./middlewares/typegoose-middleware";

type GraphServerQLDependency = {
  authInteractor: IAuthInteractor;
};

export default async function getGraphQLServer({
  authInteractor,
}: GraphServerQLDependency) {
  const schema = await buildSchema({
    resolvers: [AuthResolver],
    globalMiddlewares: [TypegooseMiddleware],
  });
  return new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, authInteractor }),
  });
}
