import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

const pm = new ProductManager('./src/products.json')

const getProducts_middleware = async (req, res, next) => {
  const products = pm.getProducts(req, res);
  req.products = products;
  next();
};

router.get("/", getProducts_middleware, (req, res) => {
  const { products } = req;
  res.json(
    { products }
  );
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


// Middleware para agregar producto
const agregarProductoMiddleware = (req, res, next) => {
  const { title, description, price, code, stock, category, thumbnails } = req.body;
  const resultado = pm.addProduct(title, description, price, code, stock, category, thumbnails);
  res.locals.resultado = resultado;
  next();
};

router.post("/", agregarProductoMiddleware, (req, res) => {
  const resultado = res.locals.resultado;
  res.status(201).json(resultado);
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
