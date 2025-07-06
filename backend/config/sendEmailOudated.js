import { Resend } from 'resend';
import dotenv from 'dotenv'

dotenv.config()

if(!process.env.RESEND_API_KEY){
    console.log("Provide Resend API Key")
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({name,sendTo,subject,html}) => {
    try {
  const { data, error } = await resend.emails.send({
    from: 'SwiftSo <onboarding@resend.dev>',
    to: sendTo,
    subject: subject,
    html: html,
  });

   if (error) {
    return console.error({ error });
  }

  return data
    }
    catch(error){
console.log(error)
    }
}

