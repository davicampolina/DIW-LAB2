// Funções da rota /contratos

async function listarContratos() {
  const resposta = await fetch(`${API_URL}/contratos`);
  return await resposta.json();
}

async function criarContrato(contrato) {
  const resposta = await fetch(`${API_URL}/contratos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contrato)
  });
  return await resposta.json();
}
