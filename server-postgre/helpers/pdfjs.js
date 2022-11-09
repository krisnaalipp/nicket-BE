const { jsPDF } = require("jspdf");
const QRCode = require("qrcode");

// Creating a document
const doc = new jsPDF({
  orientation: "landscape", 
});

const createPDF = async (url) => {
  // Create qrCode
  let qrCode = await QRCode.toDataURL(url);

  var generateData = function (amount) {
    var result = [];
    var data = {
      coin: "100",
      game_group: "GameGroup",
      game_name: "XPTO2",
      game_version: "25",
      machine: "20485861",
      vlt: "0",
    };
    for (var i = 0; i < 5; i += 1) {
      data.id = (i + 1).toString();
      result.push(Object.assign({}, data));
    }
    return result;
  };

  function createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
      result.push({
        id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 65,
        align: "center",
        padding: 0,
      });
    }
    return result;
  }

  var headers = createHeaders([
    "id",
    "coin",
    "game_group",
    "game_name",
    "game_version",
    "machine",
    "vlt",
  ]);

  doc.setFontSize(40);
  doc.text("Nicket", 10, 20);

  doc.addImage(qrCode, "JPEG", 250, 3, 35, 35);

  doc.setFontSize(12);
  doc.text("Alamat : lsdkmlksdmkfmsdf", 10, 25);
  doc.text("website : djnskfjnsjdnfjsndf", 10, 30);
  doc.text("email : djnskfjnsjdnfjsndf", 10, 35);

  doc.setLineWidth(1);
  doc.line(1000, 38, 0, 40);

  doc.setFontSize(12);
  doc.text("Bill to : lsdkmlksdmkfmsdf", 10, 50);
  doc.text("email nya yang beli: ", 10, 55);

  doc.setFontSize(20);
  doc.text("Invoice", 260, 50);

  doc.setFontSize(14);
  doc.text("Tanggal", 264, 55);

  doc.setLineWidth(0, 2);
  doc.line(280, 70, 10, 71);

  doc.table(60, 80, generateData(100), headers, { autoSize: true });

  const pdfOutput = doc.output("datauristring");

  return pdfOutput;
};


module.exports = { createPDF };
