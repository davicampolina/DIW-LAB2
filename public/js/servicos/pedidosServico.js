// Funções da rota /pedidos

async function listarPedidos() {
  const resposta = await fetch(`${API_URL}/pedidos`);
  return await resposta.json();
}

async function listarPedidosDoCliente(clienteId) {
  const resposta = await fetch(`${API_URL}/pedidos?clienteId=${clienteId}`);
  return await resposta.json();
}

async function criarPedido(pedido) {
  const resposta = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido)
  });
  return await resposta.json();
}

async function atualizarPedido(id, dados) {
  const resposta = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return await resposta.json();
}
