import mongoose, { CallbackError, Schema } from "mongoose";//Importing required modules for schema creation of doctors
import bcrypt from 'bcrypt'

//Seperate schema for education
const educationSchema = new mongoose.Schema({
  degree: {type: String, required: true},
  institution: {type: String, required: true},
  completionYear: {type: Number, required: true},
  experience: {type: String, required:true }
})
//schema for registration
const registrationSchema = new mongoose.Schema({
  reg_num: String,
  reg_council: String,
  reg_year: String
})

const doctorDataSchema: Schema = new mongoose.Schema({//new schema createion
    name:{type : String , required: true},
    email:{ type:String , unique:true ,required: true },
    password:{type:String , required: true },
    isVerified: {type : Boolean , default: false },
    role: {
      type: String,
      default: 'doctor'
    },
    gender: String,
    specialization: String,
    education: educationSchema,
    registration: registrationSchema
});


// Pre-save middleware to hash the password
doctorDataSchema.pre<any>('save', async function (next){
  try{
    //Check if the password is modified
    if(!this.isModified('password')) return next();

    //Generate salt
    const salt = await bcrypt.genSalt(10);

    //Hash the password
    this.password = await bcrypt.hash(this.password, salt)
    
    return next()
  } catch (err){
    return next(err as CallbackError)
  }
})

const Doctors= mongoose.model('Doctors', doctorDataSchema);//model creating using the schema doctorDataSchema
export default Doctors