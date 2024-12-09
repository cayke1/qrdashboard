import { Request, Response, Router } from "express";
import { prisma } from "./db/prisma";

const routes = Router();

routes.get("/", async (req: Request, res: Response) => {
  const activeLink = await prisma.links.findFirst({
    where: {
      active: true,
    },
  });
  if (!activeLink) {
    return res.send("No active link");
  }
  res.redirect(activeLink.url);
});

routes.get("/dashboard", async (req: Request, res: Response) => {
  const links = await prisma.links.findMany();
  res.render("index", { links });
});

function _treatUrl(url: string) {
  if (!url.startsWith("https")) {
    return `https://${url}`;
  }
  return url;
}

routes.post("/create", async (req: Request, res: Response) => {
  const url = _treatUrl(req.body.url);
  const title = req.body.title;

  await prisma.links.create({
    data: {
      url,
      title,
    },
  });

  res.redirect("/dashboard");
});

routes.post("/activate/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const atualActive = await prisma.links.findFirst({
    where: {
      active: true,
    },
  });
  if (atualActive) {
    await prisma.links.update({
      where: {
        id: atualActive.id,
      },
      data: {
        active: false,
      },
    });
  }

  await prisma.links.update({
    where: {
      id: parseInt(id),
    },
    data: {
      active: true,
    },
  });

  res.redirect("/dashboard");
});

routes.post("/delete/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  await prisma.links.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.redirect("/dashboard");
});

export { routes };
