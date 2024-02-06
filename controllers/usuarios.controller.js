import passport from "passport"
import models from "../models/usuarios.model.js"


const showAuthFormSignUp = (req, res) => {
    res.render('usuarios/signup') // <= Renderizo el formulario de registro
}

const signup = async (req, res) => {
    try {
        const errors = []
        const { name, email, password, confirm_password } = req.body
        console.log(name, email, password, confirm_password)
        console.log(req.body)

        if (password !== confirm_password) {
            errors.push({ msg: 'Las contraseñas no coinciden' })
        }

        if (password.length < 5) {
            errors.push({ msg: 'La contraseña debe tener al menos 5 caracteres' })
        }

        if (errors.length > 0) {
            return res.render('usuarios/signup', {
                errors,
                name,
                email
            })
        }

        const userFound = await models.getUserByEmail(email)

        if (userFound) {
            return res.send('Ya existe el usuario en nuestros registros')
        }

        const newUser = await models.createUser({ name, email, password })

        if (!newUser) {
            return res.send('No se pudo crear el usuario')
        }

        req.flash('mensaje_exito', 'Usuario creado con éxito')
        res.redirect('/api/auth/signin')

    } catch (error) {
        res.send('Error: ' + error);
    }
}

const showAuthFormSignIn = (req, res) => {
    res.render('usuarios/signin')
}

// Con Passport podemos validar si se encuentra un usuario y contraseña en la base de datos del backend, nos ahorramos codigo.
// Primer argumento ('la estrategia') en este caso local. y un objeto donde te redireccione si pudiste acceder que contiene 'successRedirect' y 'failureRedirect'
const signin = passport.authenticate('local', {
    successRedirect: '/api/peliculas',
    failureRedirect: '/api/auth/signin'
}) 

const logout = (req, res) => {

    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/api/auth/signin')
    });

} 

export default {
    showAuthFormSignUp,
    signup,
    showAuthFormSignIn,
    signin,
    logout
}

