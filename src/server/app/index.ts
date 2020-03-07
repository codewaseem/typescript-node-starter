require("dotenv").config();
import express from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import gqlServer from "../services/graphql";

const app = express();
app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "*.amazonaws.com"],
      },
    })
  );
  app.use(compression());
}

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

if (process.env.NODE_ENV == "development") {
  app.get("/test", (_, res) => {
    res.json({
      status: "success",
      message: "working",
    });
  });
}

gqlServer.applyMiddleware({ app });

export default app;
