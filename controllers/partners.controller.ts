import { Request, Response } from "express";
import { decodeJwtToken } from "../middleware/jwt.service";
import Doctors from "../models/doctors-data";

export default {

  updateProfile:async (req: Request, res: Response) => {
    const { name, completionYear, degree, experience, gender, institution, reg_council, reg_num, reg_year, specialization } = req.body.formData

    console.log(req.body.formData)
    try {
      
      const decodedToken = decodeJwtToken(req.body.token)//passing the token to decode and get the user details 

      const userId = decodedToken.userId//retrieving the userId

      //update the profile
      const updatedProfile = await Doctors.findByIdAndUpdate(userId, 
        {
          $set: {
            name,
            gender,
            specialization,
            education: {
              degree,
              institution,
              completionYear,
              experience
            },
            registration: {
              reg_num,
              reg_council,
              reg_year
            }
          }
        },
        {upsert: true},
      )
      console.log(updatedProfile);
      
    } catch (error) {
      //catching the error
      console.error(error)
    }
  }
  
}