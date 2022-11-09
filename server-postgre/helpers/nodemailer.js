const nodemailer = require("nodemailer");
const { createPDF } = require("./pdfjs");


async function processPayment(payUrl,customerEmail) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
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
    to: 'dam.n8910@gmail.com', // list of receivers
    subject: "Menunggu Pembayaran", // Subject line
    text: `Segera lakukan pembayaran ticketmu dengan link : ${payUrl}`, // plain text body
    attachments:[{
      path:outputPdf
    }]
  }

  // send mail with defined transport object

  await transporter.sendMail(message)
  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = processPayment