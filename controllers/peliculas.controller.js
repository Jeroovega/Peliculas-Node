import models from '../models/peliculas.model.js'
import handleError from '../utils/handleError.js'
import { mongoToObj } from '../utils/mongoToObj.js'

const list = async (req, res) => {
    const nombre = req.user?.name;
    const correo = req.user?.email;

    try {
        let peliculas = await models.getAllPeliculas() // Esto devuelve un objeto con propiedades y métodos de MongoDB hay que ocnvertirlo
        peliculas = mongoToObj(peliculas) // Al objeto de Mongo lo transformo en un String, lo limpio. Luego lo vuelvo a transformar en un objeto de JavaScript
        res.status(200).render('peliculas/list-private', { titulo: 'Listado películas', peliculas, nombre, correo }) // La información es un array entonces se envuelve en un objeto - Esto es para HandleBars
    } catch (error) {
        handleError(res, 'Error [list]: No se pudo listar las película/s', error)
    }

}

// Controlador que renderiza (muestra) el formulario de creacion de peliculas
const formCreate = (req, res) => {
    res.status(200).render('peliculas/create', { titulo: 'Formulario de creación' }) // El titulo es para el titulo de la página
}

// Controlador que renderiza (muestra) el formulario de edición de películas
const formEdit = async (req, res) => {

    const id = req.params.id

    try {
        let pelicula = await models.getOneByIdPelicula(id)

        if (!pelicula) {
            return res.status(404).send('No se encuentra la pelicula a editar')
        }

        pelicula = mongoToObj(pelicula)

        res.status(200).render('peliculas/edit', { titulo: 'Formulario de edición', pelicula })

    } catch (error) {
        handleError(res, 'Error [formEdit]: No se pudo cargar el formulario con la película', error)
    }

}

// Controlador que renderiza (muestra) una película
const show = async (req, res) => {
    const id = req.params.id

    try {
        const peliculaMostrar = await models.getOneByIdPelicula(id)

        if (!peliculaMostrar) // Si la pelicula no la encuentra
        {
            throw new Error('No se encontró ninguna pelicula')
        }

        res.status(200).render('peliculas/show', { pelicula: mongoToObj(peliculaMostrar) })
    } catch (error) {
        handleError(res, 'Error [show]: No se pudo mostrar la película', error)
    }

}

const read = async (req, res) => {
    const id = req.params.id

    try {
        if (id) {
            const pelicula = await models.getOneByIdPelicula(id)
            res.status(200).json({ ok: true, pelicula })
        } else {
            const peliculas = await models.getAllPeliculas()
            res.status(200).json({ ok: true, peliculas })
        }
    } catch (error) {
        handleError(res, 'Error [read]: No se pudo leer las película/s', error)
    }

}

const create = async (req, res) => {
    const pelicula = req.body

    try {
        const peliculaCreada = await models.createPelicula(pelicula)

        if (!peliculaCreada) { // Si no se puede crear la pelicula (devuelve null)
            throw new Error('No se pudo crear la película')
        }
        res.status(201).render('peliculas/show', { pelicula: mongoToObj(peliculaCreada), mensajeExito: 'Película creada' })

    } catch (error) {
        handleError(res, 'Error [create]: No se pudo crear la película', error)
    }

}

const update = async (req, res) => {
    const id = req.params.id
    const peliculaNueva = req.body;

    try {
        const peliculaEditada = await models.updatePelicula(id, peliculaNueva)

        if (!peliculaEditada) {
            return req.status(404).send('No está la pelicula')
        }

        req.flash('mensaje_exito', 'Película actualizada con éxito') // El primer argumento es el nombre que definimos en el middleware de server.js, el segundo es el mensaje que queremos mostrar
        res.redirect('/api/peliculas')

    } catch (error) {
        handleError(res, 'Error [update]: No se pudo editar la película', error)
    }

}

const remove = async (req, res) => {
    const id = req.params.id

    try {
        const isDeleted = await models.deletePelicula(id)

        if (!isDeleted) {
            return res.status(404).send('No se encontró la pelicula que se quiere borrar')
        }

        req.flash('mensaje_exito', 'Película eliminada con éxito')
        res.redirect('/api/peliculas')

    } catch (error) {
        handleError(res, 'Error [remove]: No se pudo eliminar la película', error)
    }

}

export default {
    read,
    create,
    update,
    remove,
    list,
    formCreate,
    formEdit,
    show
}