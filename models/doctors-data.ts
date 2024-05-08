import mongoose, { CallbackError, Document, Schema } from "mongoose";//Importing required modules for schema creation of doctors
import bcrypt from 'bcrypt'

interface doctorData extends Document{//Interface 
  name: string,
  email: string,
  password: string,
  isVerified: boolean
}

const doctorDataSchema: Schema = new mongoose.Schema<doctorData>({//new schema createion
    name:{type : String , required: true},
    email:{ type:String , unique:true ,required: true },
    password:{type:String , required: true },
    isVerified: {type : Boolean , default: false }
});


// Pre-save middleware to hash the password
doctorDataSchema.pre<doctorData>('save', async function (next){
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

const Doctors= mongoose.model<doctorData>('Doctors', doctorDataSchema);//model creating using the schema doctorDataSchema
export default Doctors