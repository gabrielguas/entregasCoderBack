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
import session from "express-session";
import FileStore from 'session-file-store'
import MongoStore from "connect-mongo";

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


// Configuracion de Session

const fileStore = FileStore(session)


app.use(session(


  {
      //Usando -> session-file-store
      //store: new fileStore({ path: "./sessions", ttl: 15, retries: 0}), 

      // Usando connect-mongo
      store: MongoStore.create({
        mongoUrl:`mongodb+srv://guasgabriel22:FanoQ6mSsi7a1iwu@curso-backend-ch.j0ycecz.mongodb.net/entregaDB?retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 10 * 60
      }),
      secret: "coderS3cr3t",
      resave: false, // guarda en memoria, no es necesario porque va a estar en un archivo
      saveUninitialized: true // lo guarda al crear la session
  }
))

// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter)




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