import { generateDoc, uploadFile } from "../utils/docFunctions.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Método não permitido" });
  }

  try {
    const itemId = req.body.itemId || req.query.itemId;
    if (!itemId) {
      return res.status(400).send({ error: "Item ID não informado." });
    }

    const docBuffer = await generateDoc(itemId);
    await uploadFile(itemId, docBuffer);

    res.status(200).send("Documento gerado e anexado com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao gerar documento." });
  }
}
