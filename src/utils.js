import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validar hash
export const isValidPassword = (user, password) => {
  console.log(
    `Datos a validar: user-password ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};

// JWT

const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";

// Crear token 
export const generateJWToken = (user) => {
  return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '1h'})
}

// Auth Token
export const authToken = (req,res,next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader){
    return res.status(401).send({ error: "User not authenticated or mission token."});
  }
  const token = authHeader.split(' ')[1]; // Split para retirar la palabra Bearer
  jwt.verify(token, PRIVATE_KEY, (error, credentials) =>{
    if (error) {
      return res.status(403).send({ error: "Token invalidad, unauthorized"});
    }else {
      req.user = credentials.user;
      console.log(req.user);
      next();
    }
  }) 
}

export default __dirname;

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// // Obtén la ruta del directorio actual del archivo 'pathUtils.js'
// const currentDirectory = path.dirname(__filename);
// // Retrocede un nivel para llegar al directorio principal de la aplicación
// const __dirname = path.resolve(currentDirectory, '..');

// export default __dirname;
