const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const mondaySdk = require("monday-sdk-js");

const monday = mondaySdk();
monday.setToken(process.env.MONDAY_API_TOKEN);

async function generateDoc(itemId) {
  // Carrega o template Word
  const content = fs.readFileSync(path.resolve(__dirname, "template.docx"), "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  // Busca dados do item no Monday
  const query = `
    query {
      items(ids: ${itemId}) {
        column_values {
          id
          text
        }
      }
    }
  `;
  const response = await monday.api(query);
  const columnValues = response.data.items[0].column_values;

  // Monta objeto para preenchimento
  const data = {};
  columnValues.forEach(col => {
    data[col.id] = col.text || "";
  });

  doc.render(data);

  const buffer = doc.getZip().generate({ type: "nodebuffer" });
  return buffer;
}

module.exports = generateDoc;
