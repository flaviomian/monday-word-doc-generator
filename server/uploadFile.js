const axios = require("axios");

async function uploadFile(itemId, fileBuffer) {
  const apiToken = process.env.MONDAY_API_TOKEN;

  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]), "ContratoGerado.docx");

  const query = `
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
        "Authorization": apiToken,
        ...formData.getHeaders()
      },
      params: {
        query: query
      }
    }
  );

  return response.data;
}

module.exports = uploadFile;
