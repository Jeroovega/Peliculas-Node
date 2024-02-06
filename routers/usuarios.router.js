import express from "express";
import controller from '../controllers/usuarios.controller.js'

const routerUsuarios = express.Router();

// ! Renderizar vista de Sign Up
// * http://localhost:8080/api/auth/signup
routerUsuarios.get('/signup', controller.showAuthFormSignUp)

// Recibe los datos del formulario de registro
routerUsuarios.post('/signup', controller.signup)


// ! Renderizar vista de Sign In
// * http://localhost:8080/api/auth/signin
routerUsuarios.get('/signin', controller.showAuthFormSignIn)

// Recibe los datos del formulario de logueo
routerUsuarios.post('/signin', controller.signin)


// ! Deslogueo de usuarios
// * http://localhost:8080/api/auth/logout
routerUsuarios.get('/logout', controller.logout)

export default routerUsuarios