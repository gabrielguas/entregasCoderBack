import { Router } from "express";
import CartManager from "../CartManager.js";
import mongoose from "mongoose";

const router = Router();
const cartManager = new CartManager('./src/carrito.json');
import cartDao from "../Dao/DBManager/cart.dao.js";

// Crear el carrito, le paso el ID del usuario como parametro
router.post("/:uid", async (req, res) => {
    try {
      const uid = req.params.uid;
      const newCart = await cartDao.createCart(uid)
      res.status(201).json(newCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  });


// Obtener productos del carrito por su ID
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartId = new mongoose.Types.ObjectId(cid); // Convertir a ObjectId
    const cart = await cartDao.getProductById(cartId);
    console.log("Productos: ", cart.products);
    res.json(cart.products); // Devolver los productos como respuesta
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

// Agregar productos
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartDao.addProductToCart(cartId, productId);
    res.json(updatedCart);
    console.log("Agregado al carrito");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartDao.removeProductFromCart(cartId, productId);
    res.json(updatedCart);
    console.log("Producto eliminado del carrito");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
