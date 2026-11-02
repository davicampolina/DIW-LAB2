async function listarAutomoveis() {
  const resposta = await fetch(`${API_URL}/automoveis`);
  return await resposta.json();
}

async function atualizarAutomovel(id, dados) {
  const resposta = await fetch(`${API_URL}/automoveis/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return await resposta.json();
}
