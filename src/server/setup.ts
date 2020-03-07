import app from "./app";
import gqlServer from "./services/graphql";

export function startServer(port: number = 3000, host: string = "localhost") {
  return new Promise((resolve) => {
    gqlServer.applyMiddleware({ app });
    app.listen(port, host, () => {
      console.log(`Server started at ${host}:${port}`);
      resolve();
    });
  });
}
