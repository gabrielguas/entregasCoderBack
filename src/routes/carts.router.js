import { Router } from "express";
import mongoose from "mongoose";
import productDao from "../Dao/DBManager/product.dao.js";

const router = Router();
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


// // Obtener productos del carrito por su ID
// router.get("/:cid", async (req, res) => {
//   try {
//     const cid = req.params.cid;
//     const cartId = new mongoose.Types.ObjectId(cid); // Convertir a ObjectId
//     const cart = await cartDao.getProductById(cartId);
//     console.log("Productos: ", cart.products);
//     res.json(cart.products); // Devolver los productos como respuesta
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener los productos del carrito" });
//   }
// });

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

// Obtener productos de un carrito
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartId = new mongoose.Types.ObjectId(cid);
    const cart = await cartDao.getProductById(cartId);

    // Obtén los IDs de los productos en el carrito
    const productIdsWithQuantities = cart.products;

    // Obtén detalles de productos con cantidades y precios totales
    const productsWithDetails = await Promise.all(productIdsWithQuantities.map(async product => {
      const productDetails = await productDao.getProductById(product.productId);
      return {
        ...productDetails.toObject(), // Convertir a objeto para manipulación
        quantity: product.quantity,
        total: productDetails.price * product.quantity,
      };
    }));

    // Calcular el precio total del carrito
    const totalPrice = productsWithDetails.reduce((total, product) => total + product.total, 0);

    // Renderiza la vista con los detalles del carrito
    res.render("verCart", { products: productsWithDetails, totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
});

export default router;
