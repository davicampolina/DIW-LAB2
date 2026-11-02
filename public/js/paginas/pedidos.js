const sessao = exigirLogin("cliente");

const formPedido = document.getElementById("form-pedido");
const selectAutomovel = document.getElementById("automovel");
const inputInicio = document.getElementById("data-inicio");
const inputFim = document.getElementById("data-fim");
const tabela = document.getElementById("tabela-pedidos");
const mensagem = document.getElementById("mensagem");

let automoveis = [];

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `alert alert-${tipo}`;
}

function buscarAutomovelNaLista(id) {
  return automoveis.find((automovel) => automovel.id === id);
}

async function carregarAutomoveis() {
  automoveis = await listarAutomoveis();
  selectAutomovel.innerHTML = `<option value="">Selecione...</option>`;
  for (const automovel of automoveis) {
    selectAutomovel.innerHTML += `<option value="${automovel.id}">${nomeDoAutomovel(automovel)}</option>`;
  }
}

async function carregarPedidos() {
  const pedidos = await listarPedidosDoCliente(sessao.id);
  tabela.innerHTML = "";

  if (pedidos.length === 0) {
    tabela.innerHTML = `<tr><td colspan="4" class="text-muted">Você ainda não fez nenhum pedido.</td></tr>`;
    return;
  }

  for (const pedido of pedidos) {
    const automovel = buscarAutomovelNaLista(pedido.automovelId);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatarData(pedido.dataPedido)}</td>
      <td>${nomeDoAutomovel(automovel)}</td>
      <td>${formatarData(pedido.dataInicio)} a ${formatarData(pedido.dataFim)}</td>
      <td><span class="badge text-bg-${corDoStatus(pedido.status)}">${pedido.status}</span></td>
    `;
    tabela.appendChild(tr);
  }
}

formPedido.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (inputFim.value < inputInicio.value) {
    mostrarMensagem("A data de devolução não pode ser antes da retirada.", "danger");
    return;
  }

  const pedido = {
    clienteId: sessao.id,
    automovelId: selectAutomovel.value,
    dataInicio: inputInicio.value,
    dataFim: inputFim.value,
    dataPedido: hoje(),
    status: "Em análise",
    parecer: "",
    agenteId: ""
  };

  await criarPedido(pedido);
  mostrarMensagem("Pedido enviado! Agora é só aguardar a análise.", "success");
  formPedido.reset();
  carregarPedidos();
});

async function iniciar() {
  try {
    await carregarAutomoveis();
    await carregarPedidos();
  } catch (erro) {
    tabela.innerHTML = `<tr><td colspan="4" class="text-danger">Erro ao carregar os dados. O JSON Server está rodando?</td></tr>`;
    console.error(erro);
  }
}

if (sessao) {
  iniciar();
}
