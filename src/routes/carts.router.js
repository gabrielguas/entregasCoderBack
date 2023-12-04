import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();
const cartManager = new CartManager('./src/carrito.json');

// Middleware para obtener un carrito por ID
const getCartByIdMiddleware = (req, res, next) => {
    const cartId = req.params.cid;
    const cart = cartManager.getCartById(cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    req.cart = cart;
    next();
};

// Crear carrito
router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.json(newCart);
});

// Obtener productos de un carrito por su cid
router.get('/:cid', getCartByIdMiddleware, (req, res) => {
    const cart = req.cart;
    res.json(cart.getProducts());
});

// Agregar productos
router.post('/:cid/product/:pid', getCartByIdMiddleware, (req, res) => {
    const cart = req.cart;
    const productId = req.params.pid;

    cart.addProduct(productId);
    cartManager.saveCarts(); // Esto luego veo como lo solucionó, lo hice rápido y me pase de largo muchos bad smells XD
    res.json(cart.getProducts());
});


export default router;
