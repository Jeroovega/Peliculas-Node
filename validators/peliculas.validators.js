import { check } from "express-validator"
import peliculaMiddleware from "../middlewares/peliculas.middlewares.js"

const peliculaShowValidator = [
    // Tengo que tener un array de Middleware
    check('id') // <= Primer middleware es el check
        .isMongoId()
        .withMessage('Envió información incorrecta para mostrar la pelicula'),
    peliculaMiddleware // <= Segundo middleware define si paso o no paso
]

const peliculaCreateValidator = [
    check('title')
        .notEmpty()
        .withMessage('El campo título es obligatorio'),
    peliculaMiddleware
]

export default {
    peliculaShowValidator,
    peliculaCreateValidator
}