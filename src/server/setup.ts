import app from "./app";
import gqlServer from "./services/graphql";

export function startServer(port: number = 3000, host: string = "localhost") {
  addServicesToApp();
  return new Promise((resolve) => {
    app.listen(port, host, () => {
      console.log(`Server started at ${host}:${port}`);
      resolve();
    });
  });
}

function addServicesToApp() {
  gqlServer.applyMiddleware({ app });
}
