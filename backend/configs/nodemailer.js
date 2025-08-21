// import nodemailer from 'nodemailer';
import SibApiV3Sdk from 'sib-api-v3-sdk';

// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const sendEmail = async ({ to, subject, body }) => {
//   const response = await transporter.sendMail({
//     from: process.env.SENDER_EMAIL,
//     to,
//     subject,
//     html: body,
//   });

//   return response;
// };

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, body }) => {
  let sendSmtpEmail = {
    sender: { email: process.env.SENDER_EMAIL, name: 'Netflix Movie App' },
    to: [{ email: to }],
    subject: subject,
    htmlContent: body,
  };

  const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

  return response;
};

export default sendEmail;
