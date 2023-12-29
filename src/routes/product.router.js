import { Router } from "express";
import productDao from "../Dao/dbManager/product.dao.js";

const router = Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productDao.getAllProductsPaginate(req);
    console.log(products);
    res.render("home", {
      products,
    })
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
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



const getProductByID_middleware = (req, res, next) => {
  const { ID } = req.params;
  const product = pm.getProductByID(ID);
  req.product = product;
  next();
};

router.get("/:ID", getProductByID_middleware, (req, res) => {
  const { product } = req;
  res.json({ product });
});


// Middleware para actualizar producto
const actualizarProductoMiddleware = (req, res, next) => {
  const { ID } = req.params;
  const data = req.body;

  const resultado = pm.updateProduct(ID, data);
  res.locals.resultado = resultado;

  next();
};

router.put("/:ID", actualizarProductoMiddleware, (req, res) => {
  const resultado = res.locals.resultado;
  res.json(resultado);
});

// Middleware para eliminar producto
const eliminarProductoMiddleware = (req, res, next) => {
  const { ID } = req.params;
  const resultado = pm.deleteProduct(ID);
  res.locals.resultado = resultado;
  next();
};

router.delete("/:ID", eliminarProductoMiddleware, (req, res) => {
  const resultado = res.locals.resultado;
  res.json(resultado);
});

export default router;
