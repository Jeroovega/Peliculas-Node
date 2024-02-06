import express from 'express';
import controller from '../controllers/public.controller.js' 

const routerPublic = express.Router();

routerPublic.get('/', controller.mostrarPeliculasPublic)

export default routerPublic;