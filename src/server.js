import express from "express";
import productRouter from './routes/product.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//Main
app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenido",
    });
});


// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080, () => console.log("Server listening on port 8080"));
