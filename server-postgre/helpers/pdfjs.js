const { jsPDF } = require("jspdf");
const QRCode = require("qrcode");

// Creating a document
const doc = new jsPDF({
  orientation: "landscape", 
});

const createPDF = async (url,data) => {
  // Create qrCode
  let qrCode = await QRCode.toDataURL(url);

//   var generateData = function (amount) {           
//     var result = [];
//     var data = {
//       coin: "100",
//       game_group: "GameGroup",
//       game_name: "XPTO2",
//       game_version: "25",
//       machine: "20485861",
//       vlt: "0",
//     };
//     for (var i = 0; i < 5; i += 1) {
//       data.id = (i + 1).toString();
//       result.push(Object.assign({}, data));
//     }
//     return result;
//   };

//   function createHeaders(keys) {
//     var result = [];
//     for (var i = 0; i < keys.length; i += 1) {
//       result.push({
//         id: keys[i],
//         name: keys[i],
//         prompt: keys[i],
//         width: 65,
//         align: "center",
//         padding: 0,
//       });
//     }
//     return result;
//   }

//   var headers = createHeaders([
//     "id",
//     "coin",
//     "game_group",
//     "game_name",
//     "game_version",
//     "machine",
//     "vlt",
//   ]);

  doc.addImage("https://media.discordapp.net/attachments/1035515386172543087/1038008127443968030/logo.png", "JPEG", 240, 0, 40, 40);
  doc.addImage(qrCode, "JPEG", 40, 120, 60, 60);
  doc.setFontSize(40);
  doc.text("Nicket", 10, 20);
 
  doc.setFontSize(14);
  doc.text("Website : Eagle FC", 10, 30);
  doc.text("Email : dam.n8910@gmail.com", 10, 35);

  doc.setLineWidth(0,5);
  doc.line(280, 38, 10, 40);

  doc.setFontSize(14);
  doc.text(`Bill to : ${data.email}`, 10, 50);
  let pay = 'belum dibayar'
  if (data.isPaid) {
    pay= 'sudah dibayar'
  }
  doc.text(`Status : ${pay}`,10,58)

  doc.setFontSize(20);
  doc.text(`Invoice #A-${data.id}`, 250, 50);

  doc.setFontSize(14);
  doc.text(`${data.updateAt}`, 256, 60);

  doc.setLineWidth(0, 2);
  doc.line(280, 64, 10, 65);
  
  doc.setFontSize(14);
  doc.text("Tiket Macth", 31, 75);
  doc.text("Seat", 91, 75);
  doc.text("Amount", 131, 75);
  doc.text("Price", 181, 75);
  doc.text("Total",241,75)
 
  doc.setLineWidth(0, 2);
  doc.line(280, 80, 10, 81);
  
  doc.text(`${data.macth}`, 31, 93);
  doc.text(`${data.categorySeat}`, 91, 93);
  doc.text(`${data.amount}`, 139, 93);
  doc.text(`RP.${data.ticketPrice}`, 171, 93);
  
  // total 
  let total = data.ticketPrice*data.amount
  doc.text(`RP.${total}`,231,93)
  
  doc.setLineWidth(0, 2);
  doc.line(280, 100, 10, 101);
  let PPN = (total*10)/100
  doc.text("PPN :",201,110)
  doc.text(`RP.${PPN}`,231,110)

  let output = total + PPN
  doc.text("Total :",201,125)
  doc.text(`RP. ${output}`,231,125)
  
  doc.setLineWidth(0, 2);
  doc.line(280,130,220,130)
//   doc.line(280, 70, 10, 71);

//   doc.table(60, 80, generateData(100), headers, { autoSize: true });

  const pdfOutput = doc.output("datauristring");

  return pdfOutput;
};


module.exports = { createPDF };
