import { Router } from "express";
import productDao from "../Dao/DBManager/product.dao.js";

const router = Router();

// Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productDao.getAllProducts(req);
    res.json(products);
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});


// Agregar un producto
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const createdProduct = await productDao.createProduct(product);
    console.log("Producto creado con éxito:", createdProduct);
    console.log("Datos del producto:", product);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// Obtener producto por su ID
router.get("/:ID", async (req, res) => {
  const { ID } = req.params;
  try {
    const product = await productDao.getProductById(ID);
    res.json(product);
  } catch (error) {
    console.log("Error al buscar el producto por ID");
    console.log(error);
  }
});

// Actualizar producto
router.put("/:ID", async (req, res) => {
  const { ID } = req.params;
  const data = req.body;

  try {
    const product = await productDao.updateProduct(ID, data);
    if (product) {
      res.json({
        message: "Producto actualizado con exito",
      });
    } else {
      res.json({
        message: "No se pudo actualizar el producto",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Eliminar un producto por su ID
router.delete("/:ID", async (req, res) => {
  const { ID } = req.params;
  try {
    const product = await productDao.deleteProduct(ID);
    if (product) {
      res.json({
        message: "Producto eliminado con exito",
      });
    } else {
      res.json({
        message: "No se encontro en producto en la base de datos",
      });
    }
  } catch (error) {
    console.log("Error al eliminar el producto");
  }
});

router.get("/detalle/:ID", async (req, res) => {
  const { ID } = req.params;

  try {
    const product = await productDao.getProductById(ID);
    res.json(product);
  } catch (error) {
    console.log("Error al buscar el producto por ID");
    console.log(error);
    res.status(500).json({ error: "Error al buscar el producto por ID" });
  }
});


export default router;
