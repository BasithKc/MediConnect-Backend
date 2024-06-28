import mongoose, { Schema } from "mongoose";

const appointmentSchema: Schema = new mongoose.Schema({
  doctorId: {
    type: Schema.ObjectId
  },
  userId: {
    type: Schema.ObjectId
  },
  appointmentDetails: {
    time: String,
    date: String
  }
}) 

const appointment = mongoose.model('Appointment', appointmentSchema)

export default appointment
