import app from "./app";
import getGraphQLServer from "./services/graphql";
import DBConnector from "./services/database";
import config from "./config";
import jwt from "express-jwt";
import authMailer from "./services/mail";
import authDBGateway from "./services/database/auth";
import authInputValidator from "./services/validation";
import AuthInteractor from "../core/interactors/auth";

export function startServer(port: number = 3000, host: string = "localhost") {
  return new Promise((resolve) => {
    app.listen(port, host, () => {
      console.log(`Server started at ${host}:${port}`);
      resolve();
    });
  });
}

export async function addMiddlewares() {
  app.use(
    jwt({
      secret: process.env.JWT_SECRET || "some-secret",
      credentialsRequired: false,
    })
  );

  let authInteractor = new AuthInteractor({
    notifier: authMailer,
    dbGateway: authDBGateway,
    inputValidator: authInputValidator,
  });
  const gqlServer = await getGraphQLServer({ authInteractor });
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
