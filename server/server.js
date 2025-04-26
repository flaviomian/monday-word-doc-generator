const express = require("express");
const cors = require("cors");
const generateDoc = require("./generateDoc");
const uploadFile = require("./uploadFile");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-doc", async (req, res) => {
  const { itemId } = req.body;

  try {
    const docBuffer = await generateDoc(itemId);
    await uploadFile(itemId, docBuffer);
    res.send({ message: "Documento gerado e anexado com sucesso!" });
  } catch (error) {
    console.error("Erro no generate-doc:", error);
    res.status(500).send({ error: "Erro ao gerar documento." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
