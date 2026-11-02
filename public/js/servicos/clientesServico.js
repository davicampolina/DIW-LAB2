// Funções que conversam com a rota /clientes do JSON Server

async function listarClientes() {
  const resposta = await fetch(`${API_URL}/clientes`);
  return await resposta.json();
}

async function buscarCliente(id) {
  const resposta = await fetch(`${API_URL}/clientes/${id}`);
  return await resposta.json();
}

async function buscarClientePorCpf(cpf) {
  const resposta = await fetch(`${API_URL}/clientes?cpf=${encodeURIComponent(cpf)}`);
  const lista = await resposta.json();
  return lista[0];
}

async function criarCliente(cliente) {
  const resposta = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return await resposta.json();
}

async function atualizarCliente(id, cliente) {
  const resposta = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  return await resposta.json();
}

async function excluirCliente(id) {
  await fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" });
}
