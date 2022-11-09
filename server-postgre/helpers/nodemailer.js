const nodemailer = require("nodemailer");
const { createPDF } = require("./pdfjs");


async function processPayment(payUrl,customerEmail) {

  let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: 'admnicket8@gmail.com', // generated ethereal user
      pass: 'xwbshnnwjbnsvelx', // generated ethereal password
    },
  });

  let outputPdf = await createPDF(payUrl)

  let message = {
    from: '"Admin Nicket" <admnicket8@gmail.com>', // sender address
    to: customerEmail, // list of receivers
    subject: "Menunggu Pembayaran", // Subject line
    text: `Segera lakukan pembayaran ticketmu dengan link : ${payUrl}`, // plain text body
    attachments:[{
      path:outputPdf
    }]
  }


  await transporter.sendMail(message)
  const output = {
    message : 'Success Send Message'
  }

  return output
}

module.exports = processPayment