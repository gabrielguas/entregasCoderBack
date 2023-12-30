import { Router } from "express";
import CartManager from "../CartManager.js";

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
router.get("/:cid", async (req,res) => {
  try{
    const cid = req.params.cid;
    const cart = await cartDao.getProductById(cid);
    console.log("Productos: ",cart.products);
  }catch(error){
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
})

// Agregar productos
router.post('/:cid/product/:pid',(req, res) => {
    const cart = req.cart;
    const productId = req.params.pid;

    cart.addProduct(productId);
    cartManager.saveCarts(); // Esto luego veo como lo solucionó, lo hice rápido y me pase de largo muchos bad smells XD
    res.json(cart.getProducts());
});


export default router;
