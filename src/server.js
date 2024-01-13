import express from "express";
import productRouter from './routes/product.router.js'
import handlebars from 'express-handlebars'
import __dirname from "./utils/pathUtils.js";
import mongoDBConnection from "./utils/mongoDB.js";
import viewRouter from './routes/views.routes.js'
import { Server } from 'socket.io'
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import  cartRouter  from './routes/carts.router.js'

const app = express();
const httpServer = app.listen(8080, () => console.log("Server listening on port 8080"));

const socketServer = new Server(httpServer);
mongoDBConnection; // Aca deberia volver a validar al conexion?


// Engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      // Función de ayuda para codificar objetos a JSON
      json: function (context) {
        return JSON.stringify(context);
      }
    }
  })
);


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
app.use("/api/carts", cartRouter);

















// comunicacion del socket

// socketServer.on('connection', (socketClient) => {
//     const pm = new ProductManager('./src/products.json');
//     const products = pm.getProducts();
//     console.log("Nuevo cliente conectado");

//     socketClient.on("message", (data) => {
//         console.log(data);
//     })
//     socketClient.emit("sendProducts",products)


//     socketClient.on("newProduct", (data) => {
//         pm.addProduct(data)
//     })

//     socketClient.on("deleteProduct", (ID) =>{
//         pm.deleteProduct(ID)
//     } )
// })