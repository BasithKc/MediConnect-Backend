//Importing third party modules
import express, { Router } from 'express';

const ConsultRouter:Router = express.Router()

//Importing consult controller
import consultController from '../controllers/consultController';

//Routing

//Listing some specific doctors
ConsultRouter.get('/doctors-list/:disease', consultController.getDoctorsList )

//Endpoint for finding the doctor by id
ConsultRouter.get('/doctor/:id', consultController.getDoctorById)

//Endpoint for creating appointment
ConsultRouter.post('/create/appointment', consultController.createAppointment)

export default ConsultRouter