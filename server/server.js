const express = require("express");
const cors = require("cors");
const generateDoc = require("./generateDoc");
const uploadFile = require("./uploadFile");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Pagina inicial simples
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Gerar Contrato</title></head>
      <body style="text-align: center; margin-top: 100px;">
        <h1>Gerar Contrato</h1>
        <form action="/generate-doc" method="post">
          <input type="text" name="itemId" placeholder="Digite o ID do Item" required />
          <br/><br/>
          <button type="submit">Gerar Documento</button>
        </form>
      </body>
    </html>
  `);
});

// Endpoint para gerar documento
app.post("/generate-doc", async (req, res) => {
    try {
      const itemId = req.body.itemId || req.query.itemId; // Pegando tanto do body quanto da query
  
      if (!itemId) {
        return res.status(400).send({ error: "Item ID não informado." });
      }
  
      const docBuffer = await generateDoc(itemId);
      await uploadFile(itemId, docBuffer);
  
      res.send("Documento gerado e anexado com sucesso!");
    } catch (error) {
      console.error("Erro no generate-doc:", error);
      res.status(500).send({ error: "Erro ao gerar documento." });
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });