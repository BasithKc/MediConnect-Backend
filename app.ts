//Third party modules
import express from "express";
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()//configuring the dotenv

const app = express()

//Middlewares
app.use(express.json())
app.use(cors())

// Connect to MongoDB
const mongoURL = process.env['MONGO_URL']


mongoose.connect(mongoURL as string)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Define routes
import router from "./routes/authRoutes";
app.use('/auth', router)

// Start the server Listening to the port
const PORT:number = process.env['PORT']? parseInt(process.env['PORT']) : 4000 

app.listen(PORT, () => console.log('Server listening on port', PORT))