//Importing third party modules
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose, { Document} from 'mongoose'


//ObjectId
const ObjectId = mongoose.Types.ObjectId

//Importing models
import Doctors from "../models/doctors-data";
import Users, { userData } from "../models/user-data";
import sendOTPEmail  from "../utils/nodemailer/nodemailer.service";
import { decodeJwtToken } from "../middleware/jwt.service";


//Generate the jwt token
const secretKey = process.env['JWT_SECRET_KEY']

// In-memory storage for OTPs and user IDs (replace with a more robust storage solution)
const otpStorage: { [userId: string]: string } = {};

export default {

  //Handling the authentication 
  authenticate: async (req:Request, res: Response) => {
    const header = req.body.headers
    try {
      const decodedToken = decodeJwtToken(header.Authorization)//passing the token to decode and get the user details 
      
      if (decodedToken) {
        const userId = decodedToken.userId //retrieving the userId
  
        const user = await Users.findOne({ _id: new ObjectId( userId) }) || await Doctors.findOne({_id: userId}) //retrieving the user from database
        
        if(user) {
          return res.status(200).json({user})
        }else {
          return res.status(404).json({})
        }
      }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Invalid JWT token'})
      
    }   
  },

  //Handling signup request
  signupUser :  async (req:Request, res: Response) => {
    try{
      const {name,  email, password} = req.body //Retrieving the data from req.body

      const userType = req.params?.[`userType`] as string || '' //Getting the type of user either patient or doctor    
  
      //Checking if user already exist in db
      const existUser = await Doctors.findOne({email}) ?? await Users.findOne({email})
  
      if(existUser){ //IF user exist
        return res.status( 400).json({message: 'Email already exist'})//sending message of user Exist with status code 400
      }
    
      let otp!: string;//Declare otp variable to store otp gloablly

      // If user does not exist new data is created
      if(userType === 'Doctor'){ //If type of user is Doctor
        const newDoctor =new Doctors ({
          name,
          email,
          password})
        const savedDoctor: any = await newDoctor.save()
        const userId = savedDoctor._id.toString() //retrieving the id from mongodb

        otp = await sendOTPEmail(email)//Send OTP function

        // Store the OTP and user ID in the in-memory storage
        otpStorage[userId] = otp
        return res.status(201).json({message:'User Created successfully', userId})
  
      } else if(userType==='Patient'){// if type of user is  Patient
        const newUser = new Users ({
          name,
          email,
          password,
        })
        const savedUser: userData = await newUser.save()
        const userId = savedUser._id.toString() //retrieving the id from mongodb

        otp = await sendOTPEmail(email)//send OTP function

        // Store the OTP and user ID in the in-memory storage
        otpStorage[userId] = otp
        return res.status(201).json({message:'User Created successfully', userId})
      }
  
      return res.status(201).json({message:'User Created successfully'})//sending success message
    } catch(error){
      //Catching the occured error
      return res.status(500).json({message: (error as Error).message})
    }
  },

  //funcion for verifying the OTP and generating JWT token
  verifyOTP: async (req:Request, res: Response) => { 
    const { otpValue, userId } = req.body;
    console.log(userId);
    
  
    //Check if the otp exist in the stroage
    const generatedOTP = otpStorage[userId]    
    try {
      
    if(!generatedOTP) {
      return res.status(400).json({ error: 'Invalid user ID or OTP' });
    }
    
    // Verify the OTP
    if (generatedOTP !== otpValue) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }
    
    //Changing the isVerified to true
    const isVerified =  await Users.findOneAndUpdate({_id: userId}, {isVerified: true}) || await Doctors.findOneAndUpdate({_id: userId}, {isVerified: true})
                             

    const jwtToken = jwt.sign({ userId }, secretKey as string, { expiresIn: '1h' });

    //remove the otp from storage
    delete otpStorage[userId]

    return res.status(200).json({token: jwtToken})
    } catch (error) {
      console.log(error);
      
    }

  },

  //function for handling login request from user
  loginUser: async (req: Request, res: Response) => {
    //login data
    const {email, password} = req.body;

    try {
      const userExist: any = await Doctors.findOne({email}) || await Users.findOne({email}) //Checking if user exist

      if(!userExist) { //If no user return
        return res.status(400).json({message: 'Account does not exist, Please Register'})
      }

      if(!userExist.isVerified) {
        const userId = userExist._id.toString() //retrieving the id from mongodb

        const otp = await sendOTPEmail(email)//Send OTP function

        // Store the OTP and user ID in the in-memory storage
        otpStorage[userId] = otp
        return res.status(201).json({message: 'Account need verification', userId, email: userExist.email})
      }

      const existPassword: string | undefined = userExist?.password //retrieving the password
      
      const isPasswordCorrect = await bcrypt.compare(password, existPassword as string ) //Comapring the password 
      
      if(!isPasswordCorrect) { //if password does not match return
        return res.status(400).json({message: 'Invalid Password'})
      }    
      
      const userId: string = userExist?._id //Retrieving the Id
      const jwtToken = jwt.sign({ userId }, secretKey as string, { expiresIn: '1h' });//Generating JWT token

      return res.status(200).json({token: jwtToken})
    } catch (error) {
      console.log(error);
      
      //catching and handling the error
      return res.status(500).json({message: 'Server Error'})
    }
    
  },

  //function for verifying email
  verifyEmail: async (req: Request, res:Response) => {
    const {name, email} = req.body.constultForm

   try {
     //checking if user already exist 
     const userExist = await Users.findOne({email}) || Doctors.findOne({email})

     const newUser = new Users({ //create a new user 
       name,
       email
     })
     const saveUser = await newUser.save()
     const userId = saveUser._id.toString()//id for storing otp
 
     const otp = await sendOTPEmail(email)
     otpStorage[userId] = otp //storing the otp to verify     

     res.status(200).json({message: 'Otp Sented', userId})
   } catch (error) {
    console.log(error)
    res.status(500).json({message: 'Server Error'})
   }
  }
}
