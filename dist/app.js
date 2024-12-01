"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express2 = __toESM(require("express"));

// src/routes.ts
var import_express = require("express");

// src/db/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes.ts
var routes = (0, import_express.Router)();
routes.get("/", async (req, res) => {
  const activeLink = await prisma.links.findFirst({
    where: {
      active: true
    }
  });
  if (!activeLink) {
    return res.send("No active link");
  }
  res.redirect(activeLink.url);
});
routes.get("/dashboard", async (req, res) => {
  const links = await prisma.links.findMany();
  res.render("index", { links });
});
routes.post("/create", async (req, res) => {
  const url = req.body.url;
  console.log(url);
  const title = url.split(".")[1];
  await prisma.links.create({
    data: {
      url,
      title
    }
  });
  res.redirect("/dashboard");
});
routes.post("/activate/:id", async (req, res) => {
  const id = req.params.id;
  const atualActive = await prisma.links.findFirst({
    where: {
      active: true
    }
  });
  if (atualActive) {
    await prisma.links.update({
      where: {
        id: atualActive.id
      },
      data: {
        active: false
      }
    });
  }
  await prisma.links.update({
    where: {
      id: parseInt(id)
    },
    data: {
      active: true
    }
  });
  res.redirect("/dashboard");
});
routes.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await prisma.links.delete({
    where: {
      id: parseInt(id)
    }
  });
  res.redirect("/dashboard");
});

// src/app.ts
var import_cors = __toESM(require("cors"));
var App = class {
  express;
  constructor() {
    this.express = (0, import_express2.default)();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.express.use(import_express2.default.json());
    this.express.use(import_express2.default.urlencoded({ extended: true }));
    this.express.use(
      (0, import_cors.default)({
        credentials: true
      })
    );
    this.express.use(function(req, res, next) {
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
  routes() {
    this.express.use(routes);
  }
};
var app_default = new App().express;
