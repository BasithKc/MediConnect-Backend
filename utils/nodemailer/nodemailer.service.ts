import transporter from "./nodemailer.config";

export const sendOTPEmail = async  (recipientEmail: string): Promise<any>  => {

  try {
    const otp = generatedOTP()
  
    // Email options
    const mailOptions: MailOptions = {
      from: 'basithkccr7@gmail.com', // Sender's email address
      to: recipientEmail, // Recipient's email address
      subject: 'Your OTP', // Subject line
      text: `Your OTP is ${otp}`, // Plain text body
    };
  
    await transporter.sendMail(mailOptions)
    return otp as string
    
  } catch (error) {
    console.error(error);
    
  }
}

function generatedOTP(): string {
  const min = 1000
  const max = 9000

  const otp = Math.floor(Math.random() * (max - min + 1)) + min
  return otp.toString()
}


interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
}

export default sendOTPEmail