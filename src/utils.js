import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

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

export default __dirname;

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// // Obtén la ruta del directorio actual del archivo 'pathUtils.js'
// const currentDirectory = path.dirname(__filename);
// // Retrocede un nivel para llegar al directorio principal de la aplicación
// const __dirname = path.resolve(currentDirectory, '..');

// export default __dirname;
