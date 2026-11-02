async function listarAgentes() {
  const resposta = await fetch(`${API_URL}/agentes`);
  return await resposta.json();
}
