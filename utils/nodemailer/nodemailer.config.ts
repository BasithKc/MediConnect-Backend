import  nodemailer from 'nodemailer'

const pass = process.env['EMAIL_PASSWORD']
// Create a transporter object
 const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // SMTP server address
  auth: {
    user: 'basithkccr7@gmail.com', 
    pass: pass 
  }
});

export default transporter