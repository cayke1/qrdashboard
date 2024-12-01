"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes.ts
var routes_exports = {};
__export(routes_exports, {
  routes: () => routes
});
module.exports = __toCommonJS(routes_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  routes
});
