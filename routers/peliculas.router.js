import express from 'express'
import controller from '../controllers/peliculas.controller.js'
import isAuthenticated from '../middlewares/usuarios.middleware.js';
import validator from '../validators/peliculas.validators.js'

const routerPeliculas = express.Router(); // Con esto después me lo puedo llevar a otros archivos

/* --------------------------------------------- */
/* CRUD COMPLETO DE PELÍCULAS */
/* --------------------------------------------- */
routerPeliculas.get('/', controller.list)

// ! Renderizar el formulario de creación de peliculas
routerPeliculas.get('/create', isAuthenticated, controller.formCreate)
// ! Renderizar el formulario de edición de peliculas
routerPeliculas.get('/edit/:id', isAuthenticated, controller.formEdit)
// ! Renderizar la vista de una película
routerPeliculas.get('/show/:id', validator.peliculaShowValidator, controller.show) // Lo del medio es el validor para que si me envía un id se muestre, de lo contrario que no se muestre
 


// ! CRUD: READ => Método GET ONE / ALL.
// * http://localhost:8080        => READ ALL
// * http://localhost:8080/:id    => READ ONE
routerPeliculas.get('/:id?', isAuthenticated, controller.read)

// ! CRUD: CREATE => Método POST.
// * http://localhost:8080        => CREATE
routerPeliculas.post('/', isAuthenticated, validator.peliculaCreateValidator ,controller.create)

// ! CRUD: UPDATE => Método PUT.
// * http://localhost:8080/:id    => UPDATE
routerPeliculas.put('/:id', isAuthenticated, controller.update)

// ! CRUD: DELETE => Método DELETE.
// * http://localhost:8080/:id    => DELETE
routerPeliculas.delete('/:id', isAuthenticated, controller.remove)

export default routerPeliculas;

/*

----------- MÉTODO INCORRECTO -----------

GET |   /listar-todos-los-post  | READ ALL
GET |   /listar-un-post/:id     | READ ONE

----------- MÉTODO CORRECTO   -----------

GET     |  /api/peliculas           | READ ALL
GET     |  /api/peliculas/:id       | READ ONE
POST    |  /api/peliculas           | CREATE
PUT     |  /api/peliculas/:id       | UPDATE
DELETE  |  /api/peliculas/:id       | DELETE

*/