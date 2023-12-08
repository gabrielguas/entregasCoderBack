import express from "express";
import productRouter from './routes/product.router.js'
import cartsRouter from './routes/carts.router.js'
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";
import viewRouter from './routes/views.routes.js'
import { Server } from 'socket.io'
import ProductManager from "./ProductManager.js";


const app = express();
const httpServer = app.listen(8080, () => console.log("Server listening on port 8080"));

const socketServer = new Server(httpServer);


// Engine

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}))

// Seteo el motor

app.set("view engine", "hbs")
app.set("views", `${__dirname}/views`);

// Public
app.use(express.static(`${__dirname}/public`));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", viewRouter)

// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);


// comunicacion del socket

socketServer.on('connection', (socketClient) => {
    const pm = new ProductManager('./src/products.json');
    const products = pm.getProducts();
    console.log("Nuevo cliente conectado");

    socketClient.on("message", (data) => {
        console.log(data);
    })
    socketClient.emit("sendProducts",products)


    socketClient.on("newProduct", (data) => {
        pm.addProduct(data)
    })
})