import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN;

export async function generateDoc(itemId) {
  const templatePath = path.join(process.cwd(), "template", "template.docx");
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

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

  const response = await axios.post(
    "https://api.monday.com/v2",
    { query },
    { headers: { Authorization: MONDAY_API_TOKEN } }
  );

  const columnValues = response.data.data.items[0].column_values;

  const data = {};
  columnValues.forEach((col) => {
    data[col.id] = col.text || "";
  });

  doc.render(data);

  const buffer = doc.getZip().generate({ type: "nodebuffer" });
  return buffer;
}

export async function uploadFile(itemId, fileBuffer) {
  const formData = new FormData();
  formData.append("file", fileBuffer, "ContratoGerado.docx");

  const mutation = `
    mutation ($file: File!) {
      add_file_to_column(item_id: ${itemId}, column_id: "file_mkqc1xb7", file: $file) {
        id
      }
    }
  `;

  const response = await axios.post(
    "https://api.monday.com/v2/file",
    formData,
    {
      headers: {
        Authorization: MONDAY_API_TOKEN,
        ...formData.getHeaders(),
      },
      params: {
        query: mutation,
      },
    }
  );

  return response.data;
}
