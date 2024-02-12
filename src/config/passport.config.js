import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

// Declaro la estrategia
const localStrategy = passportLocal.Strategy;


const initializePassport = () => {

  //Register
  passport.use('register', new localStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age, rol } = req.body;
      try {
        const exist = await userModel.findOne({ email });
        if (exist) {
          console.log("Ya hay un usuario registrado con ese email");
          done(null, false);
        }

        const result = await userModel.create({ first_name, last_name, email, age, password: createHash(password), rol });
        res.send({
          status: "success",
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
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          console.warn('El usuario no existe');
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          console.warn('Credenciales invalidas')
          return done(null, false)
        }
        return done(null, user);

      } catch (error) {
        return done("Error al iniciar sesion: " + error);
      }
    }
  ))

  // Funciones de serializacion y desserializacion
  passport.serializeUser(async (user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user)
    } catch (error) {
      console.error("Error desserialiazndo al usuario: ", error)
    }
  })

  // Usando github
  passport.use('github', new GitHubStrategy(
    {
    clientID: 'Iv1.fa8d8469e3cb5a04',
    clientSecret: 'c9db6fdd47b626e6d8a602642b4a5728349325cc',
    callbackUrl: 'http://localhost:8080/api/session/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log("Profile obtenido del usuario de GitHub: ");
      // console.log(profile);
      try {
        //Validamos si el user existe en la DB
        // const user = await userModel.findOne({ email: profile._json.email });
        const user = await userModel.findOne({ $or: [{ email: profile._json.email }, { username: profile._json.login }] });
        if (!user) {
          let newUser = {
            username: profile._json.login,
            email: profile._json.url,
            password: 'gitHubUserPass',
            loggedBy: "GitHub",
            type: "user"
          }
          const result = await userModel.create(newUser);
          return done(null, result)
        } else {
          // Si entramos por aca significa que el user ya existe en la DB
          return done(null, user)
        }

      } catch (error) {
        return done(error)
      }
    }
  ));




}

export default initializePassport;