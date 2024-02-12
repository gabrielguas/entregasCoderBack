import { Router } from "express";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";


const router = Router();

// Register
router.post("/register",passport.authenticate('register',{failureRedirect: '/api/session/fail-register'}), async (req, res) => {
  console.log("Registrando usuario: ");
  res.status(201).send({ status: "success", message:"Usuario creado con exito!"})
});


// Login
router.post("/login",passport.authenticate('login',{failureRedirect: '/api/session/fail-login'}), async (req, res) => {
  console.log("Usuario encontrado para el login: ");
  const user = req.user
  console.log(user);

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    rol: user.rol,
  };

  res.send({
    status: "success",
    payload: req.session.user,
    message: "Login realizado!!",
  });
});


// Passport GitHub

router.get("/github", passport.authenticate('github', { scope: ['user:email']}),
async (req,res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/github/error'}), async( req,res ) =>{
  const user = req.user;
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: 18,
    rol: user.rol,
  };
  res.redirect("/users")
}
)




// Cerrar sesion
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al destruir la sesión: " + error);
      res.status(500).json({
        error: "Error logout",
        msg: "Error al cerrar la sesión",
      });
    } else {
      console.log(req.session);
      res.json({
        success: true,
        msg: "Sesión cerrada correctamente",
      });
    }
  });
});
















router.get('/fail-register', (req,res) =>{
  res.status(401).send({error: "error en el procecso de registro"})
})

router.get('/fail-login', (req,res) =>{
  res.status(401).send({error: "error en el procecso de login"})
})
export default router;
