//Importing third party modules
import express, { Router } from 'express';

const router:Router = express.Router()

//Importing Controllers
import authController from '../controllers/auth.controller';

// Routing for the user's signing up
router.post('/signup/:userType', authController.signupUser)

//Endpoint  for verifying the otp
router.post('/verify-otp', authController.verifyOTP)

//Endpoint for when user attempt to login 
router.post('/login/:userType', authController.loginUser)


export default router