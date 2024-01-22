import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";


// Declaro la estrategia
const localStrategy = passportLocal.Strategy;


const initializePassport = () =>{
  //Register
  passport.use('register', new localStrategy(
    {passReqToCallback: true, usernameField: 'email'},
    async(req, username, password, done) => {
      const { first_name, last_name, email, age, rol } = req.body;
      try {
        const exist = await userModel.findOne({ email });
        if (exist){
          console.log("Ya hay un usuario registrado con ese email");
          done(null,false);
        }

        const result = await userModel.create({first_name,last_name,email,age,password: createHash(password),rol});
        res.send({status: "success",
          message: "Usuario creado con éxito, ID: " + result._id,
        });
        return done(null, result);

      } catch (error) {
        return done("Error registrando al usuario: " + error);
      }
    }
    ))

    //Login
    passport.use('login', new localStrategy(
      { passReqToCallback: true, usernameField: 'email'},
      async(req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user){
          console.warn('El usuario no existe');
          return done(null,false);
        }
        if (!isValidPassword(user, password)) {
          console.warn('Credenciales invalidas')
          return done(null,false)
        }
        return done(null, user);

      } catch (error) {
        return done("Error al iniciar sesion: " + error);
      }
      }
    ))

    // Funciones de serializacion y desserializacion
    passport.serializeUser(async (user, done) => {
      done(null,user._id)
    })

    passport.deserializeUser(async (id, done) => {
      try {
        let user = await userModel.findById(id);
        done(null, user)
      } catch (error) {
        console.error("Error desserialiazndo al usuario: ", error)
      }
    })
}

export default initializePassport;