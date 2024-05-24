import jwt from 'jsonwebtoken'

//Generate the jwt token
const secretKey = process.env['JWT_SECRET_KEY']

//function to decode the Jwt token
export function decodeJwtToken (token: string) {
  try {
    const decodedToken: any = jwt.decode(token)
    console.log(decodedToken);
    
    return decodedToken
  } catch (error) {
    //handling error
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

//function to verify the Jwt token
// export function verifyJwtToken (token) {
//   try {
//     const decodedToken = jwt.verify(token, secretKey as jwt.Secret)
//     return decodedToken
//   } catch (error) {
//     console.error('Error verifying JWT token');
//     return null;
    
//   }
// }