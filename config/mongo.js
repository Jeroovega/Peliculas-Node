import mongoose from 'mongoose';

const conectarMongo = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log("Conexión a MONGODB Exitosa")
    } catch (error) {
        console.log(`Error al conectarse a la base de datos. Error: ${error}`)
    }
}

export default conectarMongo