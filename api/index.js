export default function handler(req, res) {
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <html>
        <head><title>Gerar Contrato</title></head>
        <body style="text-align: center; margin-top: 100px;">
          <h1>Gerar Contrato</h1>
          <form action="/api/generate-doc" method="post">
            <input type="text" name="itemId" placeholder="Digite o ID do Item" required />
            <br/><br/>
            <button type="submit">Gerar Documento</button>
          </form>
        </body>
      </html>
    `);
  }
  