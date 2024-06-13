//Importing third party modules
import express, { Router } from 'express';

const authRouter:Router = express.Router()

//Importing Controllers
import authController from '../controllers/auth.controller';

authRouter.post('/me', authController.authenticate)

// Routing for the user's signing up
authRouter.post('/signup/:userType', authController.signupUser)

//Endpoint  for verifying the otp
authRouter.post('/verify-otp', authController.verifyOTP)

//Endpoint for when user attempt to login 
authRouter.post('/login', authController.loginUser)

//Endpoint of when user enter the email from consult page
authRouter.post('/verify/email', authController.verifyEmail)


export default authRouter