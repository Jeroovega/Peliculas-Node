import models from '../models/peliculas.model.js'
import { mongoToObj } from '../utils/mongoToObj.js'
import handleError from '../utils/handleError.js'


const mostrarPeliculasPublic = async (req, res) => {

    const nombre = req.user?.name;

    try {
        let peliculas = await models.getAllPeliculas()
        peliculas = mongoToObj(peliculas)
        res.status(200).render('list-public', { titulo: 'Listado películas', peliculas, nombre })

    } catch (error) {
        handleError(res, 'Error [mostrarPeliculasPublic]: No se pudo mostrar las película/s', error)
    }
}

export default {
    mostrarPeliculasPublic
}