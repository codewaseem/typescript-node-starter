import app from "./app";
import getGraphQLServer from "./services/graphql";
import DBConnector from "./services/database";
import config from "./config";

export function startServer(port: number = 3000, host: string = "localhost") {
  return new Promise((resolve) => {
    app.listen(port, host, () => {
      console.log(`Server started at ${host}:${port}`);
      resolve();
    });
  });
}

export async function setupGraphQL() {
  const gqlServer = await getGraphQLServer();
  gqlServer.applyMiddleware({ app });
}

export async function connectToDB() {
  let dbConnection = new DBConnector();
  await dbConnection.start(config.development.database_url);
  // console.log("DB Connected");
  // if (process.env.NODE_ENV == "development") {
  //   console.log("DevMode: Dropping Database");
  //   await connection.db.dropDatabase();
  // }
}
