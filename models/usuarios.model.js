import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UsuarioSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true // Que sea único
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true, // => createAt y updateAt
        versionKey: false
    }
)

// Métodos Schema (métodos de Mongoose para los esquemas)

// * Voy a utilizar la libreria Bcrypy (API para encriptado de contraseñas)
UsuarioSchema.methods.encriptarPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)    // Genero un numero al azar (semilla) le da 10 vueltas para generar una buena encriptación
    return await bcrypt.hash(password, salt) // Me retorna la password
}

UsuarioSchema.methods.comprobarPassword = async function (password) { // Es función tradicional si o si porque voy a trabajar con el .this
    return await bcrypt.compare(password, this.password) // El this es el que se encuentra en la base de datos, se compara el password q nos pasó con el de la base de datos. Retorna true o false.
}

const UsuarioModel = mongoose.model('usuarios', UsuarioSchema)


/* -------------------------------------------------------------------- */
/* Métodos de iteracción con la base de datos */
/* -------------------------------------------------------------------- */

// * Busco el usuario en mi base de datos y devuelvo el usuario si lo encuentro, si no lo encuentro devuelvo un error.
const getUserByEmail = async (email) => {
    try {
        const userFound = await UsuarioModel.findOne({ email })
        return userFound
    } catch (error) {
        console.log('[getUserByEmail]: Error al obtener el email del usuario', error)
    }
}

// * Guardamos el usuario en la base de datos. (Todavía no estaría encriptado.)
const createUser = async (nuevoUsuario) => { // nuevoUsuario = {name, email, password}
    try {

        const usuarioCreado = new UsuarioModel(nuevoUsuario)
        usuarioCreado.password = await usuarioCreado.encriptarPassword(nuevoUsuario.password) // Se recibe la contraseña del usuario y la encripta
        await usuarioCreado.save() // Acá se guardó en la base de datos

        return usuarioCreado

    } catch (error) {
        console.log('[createUser]: Error al crear el usuario', error)
    }
}

// * Verificar si el password del usuario es correcto
const checkUserPassword = async (usuario, password) => {
    try {

        const isMatch = await usuario.comprobarPassword(password) // devuelve true o false
        return isMatch

    } catch (error) {
        console.log('[checkUserPassword]: Error la contraseña no coincide', error)
    }
}

const getUserById = async (id) => {
    try {
        const usuario = await UsuarioModel.findById(id)
        return usuario
    } catch (error) {
        console.log('[getUserById]: No se pudo encontrar el usuario', error)
    }
}

export default {
    getUserByEmail,
    createUser,
    checkUserPassword,
    getUserById
}