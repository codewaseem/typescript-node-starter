import { ApolloServer } from "apollo-server-express";
import typeDefs from "../../typeDefs";
import resolvers from "../../resolvers";

// const { HttpLink } = require("apollo-link-http");
// const { execute, toPromise } = require("apollo-link");

// const {
//   //   dataSources,
//   // context: defaultContext,
//   typeDefs,
//   resolvers,
// } = require("../");

/**
 * Integration testing utils
 */

export const constructTestServer = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // dataSources: () => ({ userAPI, launchAPI }),
  });

  return { server };
};

/**
 * e2e Testing Utils
 */

// export const startTestServer = async (server) => {
//   // if using apollo-server-express...
//   // const app = express();
//   // server.applyMiddleware({ app });
//   // const httpServer = await app.listen(0);

//   const httpServer = await server.listen({ port: 0 });

//   const link = new HttpLink({
//     uri: `http://localhost:${httpServer.port}`,
//     fetch,
//   });

//   const executeOperation = ({ query, variables = {} }) =>
//     execute(link, { query, variables });

//   return {
//     link,
//     stop: () => httpServer.server.close(),
//     graphql: executeOperation,
//   };
// };
