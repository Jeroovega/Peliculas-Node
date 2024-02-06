import passport from "passport"
import { Strategy } from "passport-local"
import models from "../models/usuarios.model.js"

// La Strategy recibe dos objetos -> el primero con los fields que quiero que chequee, y como segundo argumento una callback que va a ser la validación
// ! PASO UNO

// Primer argumento (obj del field)
const fieldEstrategia = { usernameField: 'email' }
// Segundo argumento (Callback)
const comprobacionUsuario = async (email, password, done) => {
    try {
        const usuario = await models.getUserByEmail(email)

        if (!usuario) {
            return done(null, false, { message: 'Usuario no encontrado' }) // done recibe 2 parámetros (null, que es el manejo de errores, si hay un error pasa por ahí) y un false indicando que el usuario no existe
        }

        // Si el usuario existe pasamos al siguiente paso de checkear la constraseña
        const passwordCorrecto = await models.checkUserPassword(usuario, password)
        if (!passwordCorrecto) {
            return done(null, false, { message: 'Contraseña incorrecta' })
        }

        // Si existe el usuario y la contraseña es correcta entonces pasamos al ultimo paso, retornamos el done.
        return done(null, usuario)
    } catch (error) {
        console.log('[comprobacionUsuario]:' + error)
    }
}

// ! PASO DOS
const estrategiaLocal = new Strategy(fieldEstrategia, comprobacionUsuario)

// ! PASO TRES
export default passport.use(estrategiaLocal)

//! PASO CUATRO
// El serializeUser convierte en una cadena de caracteres 
passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
})

passport.deserializeUser( async (id, done) => {
    const usuario = await models.getUserById(id)
    done(null, usuario)
})

// Esto lo precisa passport para un trabajo interno, nosotros no lo vamos a usar