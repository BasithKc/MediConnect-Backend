import { Request, Response } from "express";

//Importing the models
import Doctors from "../models/doctors-data";
import { decodeJwtToken } from "../middleware/jwt.service";
import appointment from "../models/appointment";

export default {
  getDoctorsList: async (req:Request, res: Response) => {

    const disease = req.params.disease
    try {
      //retrieving the doctors according to disease from database
      const doctors = await Doctors.find({specialization: disease }, '_id name specialization')
      
      res.status(200).json({list: doctors}) //Return the retrieved data to users
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  }, 

//Get doctor details by id
  getDoctorById : async (req: Request, res: Response) => {

    const id = req.params.id
    try {
      //Get the doctor details from mongodb
      const doctor = await Doctors.findOne({_id: id}, {password: 0})
      res.status(200).json(doctor)
    } catch (error) {
      res.status(400).json(error)
    }
  },

  createAppointment: async (req: Request, res: Response) => {
    const {doctorId, userToken, appointmentDetails} = req.body

    try {
      //decoding the token
      const decodedToken =  decodeJwtToken(userToken)
      const userId = decodedToken.userId

      //Creating the appointment in database
      const newAppointment  = new appointment({
        doctorId,
        userId,
        appointmentDetails
      })
      await newAppointment.save()

       return res.status(200).json({message: 'New appointment created successfully'})
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }

  
  }
}