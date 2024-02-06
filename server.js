import express from 'express';
import { engine } from 'express-handlebars';
import methodOverride from 'method-override' 
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import 'dotenv/config';
import flash from 'connect-flash'; // Mensajes flash

import * as passportStrategy from './config/passport.js'
import path from 'node:path' // Librería de node para carpetas
import routerPeliculas from './routers/peliculas.router.js';
import routerUsuarios from './routers/usuarios.router.js';
import routerPublic from './routers/public.router.js';
import conectarMongo from './config/mongo.js';


// ! ------------------------------ Configuración
const PORT = process.env.PORT || 8080;
const app = express();
const uriMongo = process.env.URI_MREMOTA // process.env.URI_MLOCAL
const palabraSecreta = process.env.SESSION_SECRET

// * Configuración Handlebars - HBS
app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join('views')) // Carpeta para trabajar

// ! ------------------------------ Conexión base de datos.

conectarMongo(uriMongo)

// ! ------------------------------ Middlewares
app.use(express.urlencoded({extended: true})) // Decodigica el body cuando llega por formulario HTML
app.use(express.json()) // Decodifica el body cuando llega por json
app.use(methodOverride('_method')) // Sirve para que funcionen los métodos PUT Y DELETE ya que los FORM de HTML solo tienen GET Y POST. Esto cambia el post por Delete o Put (Otorga una url con el método DELETE/POST)

// ! ----- express-session
app.use(session(
    {
        secret: palabraSecreta, // Contraseña que se encuentra en env
        resave: false,
        saveUnitialized: false,
        store: MongoStore.create({mongoUrl: uriMongo}) // Viene de Mongo Connect, le pasamos al create el mongoUrl (dónde se conecta para guardar la información en la base de datos)
    }
))

// ! ----- passport
app.use(passport.initialize()) // inicializa
app.use(passport.session())

// ! ----- connect-flash
app.use(flash()) // Mensajes flash (Mensajes que se muestran una vez y desaparecen, como los de error o de éxito. Se agrega un método flash al req que permite enviar un mensaje)

app.use((req, res, next) => {
    res.locals.mensaje_exito = req.flash('mensaje_exito');
    res.locals.mensaje_error = req.flash('mensaje_error');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // Si no hay usuario, que sea null
    next();
})  // Este middleware modifica el objeto res, le agrega propiedades que son los mensajes que se van a mostrar en la vista.


// ! ----------------------------------- Rutas
app.use('/', routerPublic)
app.use('/api/peliculas', routerPeliculas)
app.use('/api/auth', routerUsuarios)

app.all('*', (req, res) => {
    const { method, url } = req
    res.status(404).json({
        status: 404,
        url: url,
        metodo: method,
        mensaje: 'No se encontró el recurso solicitado'

    }

    )
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})