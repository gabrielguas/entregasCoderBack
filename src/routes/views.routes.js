import { Router } from "express";
import productDao from "../Dao/DBManager/product.dao.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Titulo",
    nombre: "Gabriel",
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Titulo",
    nombre: "Gabriel",
  });
});

router.get("/home", async (req, res) => {
  try {
    const productsData = await pm.getProducts(req, res);
    res.render("home", { products: productsData });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener todos los productos
router.get("/products", async (req, res) => {
  try {
    const products = await productDao.getAllProductsPaginate(req);
    console.log(products);
    res.render("home", {
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;
