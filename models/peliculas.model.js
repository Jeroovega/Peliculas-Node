import mongoose from "mongoose";

/* -------------------------------------------------- */
/* Schema (La estructura que va a tener el documento) */
/* -------------------------------------------------- */

const peliculaSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        }
    },
    {
        versionKey: false, // En Mongoose cuando se devuelve un objeto se agrega un __v. Con esto lo quitamos
        timestamps: true // createAt y updateAt - Es decir, el tiempo cuando se creó.
    }
)

/* -------------------------------------------------- */
/* Model (Basado en el schema) */
/* -------------------------------------------------- */

const PeliculaModel = mongoose.model('peliculas', peliculaSchema) // Primer parametro la colección, segundo el esquema.

/* -------------------------------------------------- */
/* Métodos de iteracción con la base de datos (interactuar) */
/* -------------------------------------------------- */

const getAllPeliculas = async () => {

    try {
        const peliculas = await PeliculaModel.find({})
        return peliculas
    } catch (error) {
        console.log('[getAllPeliculas]: Error al obtener las películas', error)
    }
}

const getOneByIdPelicula = async (id) => {

    try {
        const pelicula = await PeliculaModel.findById(id) // null si no encuentra la pelicula
        return pelicula
    } catch (error) {
        console.log('[getOneByIdPelicula]: Error al buscar la película por ID', error)
    }
}

const createPelicula = async (nuevaPelicula) => {
    try {
        const pelicula = new PeliculaModel(nuevaPelicula)
        const peliculaGuardada = await pelicula.save() // Si la pelicula no se crea devuelve un null
        return peliculaGuardada;
    } catch (error) {
        console.log('[createPelicula]: Error al guardar la película ', error)
        return null
    }
}

const updatePelicula = async (id, editandoPelicula) => {

    try {
        const peliculaEditada = PeliculaModel.findByIdAndUpdate(id, editandoPelicula, {new: true}) // El tercer parametro sirve ya que sin este la constante peliculaEditada no sería la nueva pelicula ya editada, sino que devolvería la pelicula sin editar

        return peliculaEditada

    } catch (error) {
        console.log('[updatePelicula]: Error al editar la película ', error)
        return null
    }
}

const deletePelicula = async (id) => {
    try {
        const isDeleted = await PeliculaModel.findByIdAndDelete(id)

        return isDeleted
    } catch (error) {
        console.log('[deletePelicula]: Error al eliminar la película ', error)
        return null
    }
}

export default {
    getAllPeliculas,
    getOneByIdPelicula,
    createPelicula,
    deletePelicula,
    updatePelicula
}