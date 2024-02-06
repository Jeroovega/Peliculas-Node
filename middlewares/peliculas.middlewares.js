import { validationResult } from "express-validator"

const peliculaMiddleware = (req, res, next) => {
    const errores = validationResult(req)

    if (!errores.isEmpty()) { // Si hay errores entra acá
        res.status(400).json({ errores: errores.array() })
    }
    // Si no hay errores sigue de largo
    next()
}

export default peliculaMiddleware
