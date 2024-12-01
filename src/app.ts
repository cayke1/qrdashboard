import express from "express";
import { routes } from "./routes";
import cors from "cors";

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();

    this.middlewares();

    this.routes();
  }

  private middlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));

    this.express.use(
      cors({
        credentials: true,
      })
    );

    this.express.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    });

    this.express.set("view engine", "ejs");
  }

  private routes() {
    this.express.use(routes);
  }
}

export default new App().express;
