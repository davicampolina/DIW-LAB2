// Funções da rota /pedidos

async function listarPedidos() {
  const resposta = await fetch(`${API_URL}/pedidos`);
  return await resposta.json();
}

// O filtro é feito aqui e não com ?clienteId= porque o JSON Server
// transforma "1" em número na busca, e no db.json os ids são texto.
async function listarPedidosDoCliente(clienteId) {
  const pedidos = await listarPedidos();
  return pedidos.filter((pedido) => pedido.clienteId === clienteId);
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
