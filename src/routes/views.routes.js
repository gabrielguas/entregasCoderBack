import { Router } from "express";
import productDao from "../Dao/DBManager/product.dao.js";
import cookieParser from "cookie-parser";

const router = Router();
////////////////////////
// Cookies

router.use(cookieParser());

// router.get("/setcookie", (req, res) => {
//   //Sin firma
//   //res.cookie("CooderCookie", "Esta es una cookie sin firma", { maxAge: 30000 }).send("Cookie asignada con exito");

//   // Con firma
//   res.cookie("CooderCookie", "Esta es una cookie con firma", { maxAge: 30000, signed: true }).send("Cookie asignada con exito");
// });

// router.get("/getcookie", (req, res) => {
//   // Sin firma
//   //res.send(req.cookies);

//   // Con firma
//   res.send(req.signedCookies);
// });

// router.get("/deletecookie",(req,res) =>{
//   // Sin firma y con firma es lo mismo

//   res.clearCookie("CooderCookie").send("CookieBorrada");
// })

//////////////////////

router.get("/", (req, res) => {
  res.render("index", {
    title: "Titulo",
    nombre: "Gabriel",
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Titulo",
    nombre: "Gabriel",
  });
});

router.get("/home", async (req, res) => {
  try {
    const productsData = await pm.getProducts(req, res);
    res.render("home", { products: productsData });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener todos los productos
router.get("/products", async (req, res) => {
  try {
    const products = await productDao.getAllProductsPaginate(req);
    console.log(products);

    const sessionData = req.session.user || {};

    res.render("home", {
      products,
      sessionData,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Sessions

// router.get("/session", (req, res) => {
//   if (req.session.counter) {
//     req.session.counter++;
//     res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
//   } else {
//     req.session.counter = 1;
//     res.send("Bienvenido!!");
//   }
// });

// router.get("/logout", (req, res) => {
//   req.session.destroy((error) => {
//     if (error) {
//       res.json({
//         error: "Error logout",
//         msg: "Error al cerrar la sesion",
//       });
//     }
//     res.send("Session cerrada correctamente");
//   });
// });

// router.get("/login", (req, res) => {
//   const { username, password } = req.query;

//   if (username != "pepe" || password !== "123qwe") {
//     return res.status(401).send("Login failed, check your credentials");
//   } else {
//     req.session.user = username;
//     req.session.admin = false;
//     res.send("Login successful");
//   }
// });

// //Middleware auth

// function auth(req,res,next) {
//   if (req.session.user == 'pepe' && req.session.admin){
//     return next();
//   } else {
//     return res.status(403).send('Usuario no autorizado para ingresar a este recurso')
//   }
// }

// router.get('/private',auth, (req,res) => {
//   res.send('Estas autorizado');
// })

export default router;
