//Importing third party modules
import express, { Router } from 'express';

const PartnersRouter:Router = express.Router()

//importing the controller
import partnersController from '../controllers/partners.controller';

PartnersRouter.post('/profile/update', partnersController.updateProfile)

export default PartnersRouter