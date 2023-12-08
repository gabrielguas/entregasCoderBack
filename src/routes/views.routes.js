import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const pm = new ProductManager('./src/products.json');

router.get('/', (req, res) => {
    res.render("index", {
        title: "Titulo",
        nombre: "Gabriel"
    });
});

router.get('/realtimeproducts', (req, res) => {
    res.render("realTimeProducts",  {
        title: "Titulo",
        nombre: "Gabriel"
    });
});


router.get('/home', async (req, res) => {
    try {
        const productsData = await pm.getProducts(req, res);
        res.render('home', { products: productsData });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;
