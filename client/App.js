import React, { useState } from "react";
import mondaySdk from "monday-sdk-js";
import axios from "axios";

const monday = mondaySdk();

function App() {
  const [loading, setLoading] = useState(false);

  const gerarContrato = async () => {
    setLoading(true);

    try {
      const res = await monday.get("itemIds"); // Pega o ID do item selecionado
      const itemId = res.data[0];

      await axios.post("/generate-doc", { itemId });

      alert("Contrato gerado e anexado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar contrato:", error);
      alert("Erro ao gerar contrato.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Gerar Contrato</h1>
      <button onClick={gerarContrato} disabled={loading}>
        {loading ? "Gerando..." : "Gerar Contrato"}
      </button>
    </div>
  );
}

export default App;
