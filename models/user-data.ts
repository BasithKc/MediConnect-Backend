import mongoose, { Document, Schema, CallbackError } from "mongoose";
import bcrypt from 'bcrypt'

export interface userData extends Document{
  _id: string
  name:string,
  email:string,
  password: string,
  isVerified: boolean,
  role: string
}

const UserSchema:Schema = new mongoose.Schema<userData>({
  name: { type : String , required: true },
  email:{type:String,required:true},
  password:{type:String},
  isVerified:{type:Boolean,default:false},
  role: {
    type: String,
    default: 'user'
  }
});

// Pre-save middleware to hash the password
UserSchema.pre<userData>('save', async function (next){
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


const Users= mongoose.model<userData>('Users', UserSchema)
export default Users