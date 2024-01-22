import express from "express";
import productRouter from "./routes/product.router.js";
import sessionRouter from "./routes/session.router.js";
import githubLoginViewRouter from "./routes/github-login.views.router.js"
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import mongoDBConnection from "./utils/mongoDB.js";
import viewRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import cartRouter from "./routes/carts.router.js";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import usersViewrouter from "./routes/users.views.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


const app = express();
const httpServer = app.listen(8080, () =>
  console.log("Server listening on port 8080")
);

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
      },
    },
  })
);

// Seteo el motor

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// Public
app.use(express.static(__dirname + "/public"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuracion de Session

const fileStore = FileStore(session);

app.use(
  session({
    //Usando -> session-file-store
    //store: new fileStore({ path: "./sessions", ttl: 15, retries: 0}),

    // Usando connect-mongo
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://guasgabriel22:FanoQ6mSsi7a1iwu@curso-backend-ch.j0ycecz.mongodb.net/entregaDB?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10 * 60,
    }),
    secret: "coderS3cr3t",
    resave: false, // guarda en memoria, no es necesario porque va a estar en un archivo
    saveUninitialized: true, // lo guarda al crear la session
  })
);
// Middleware de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


// Routes views
app.use("/", viewRouter);
app.use("/users", usersViewrouter);
app.use("/github", githubLoginViewRouter);

// Routes API
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/session", sessionRouter);

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
