import { Router } from "express";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password, rol } = req.body;
  console.log("Registrando usuario: ");
  console.log(req.body);

  const exist = await userModel.findOne({ email });

  if (exist) {
    return res
      .status(400)
      .send({
        status: "error",
        msg: "Ya hay un usuario registrado con ese email!",
      });
  }

  const result = await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    rol,
  });
  res.send({
    status: "success",
    message: "Usuario creado con éxito, ID: " + result._id,
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user)return res.status(401).send({ status: "error", message: "Credenciales incorrectas!" });

  if (!isValidPassword(user, password)) { return res.status(401).send({ status: "error", message: "Credenciales incorrectas!" });
  }

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

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al destruir la sesión:", error);
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

export default router;
