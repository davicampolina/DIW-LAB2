const sessao = exigirLogin("agente");

const tabela = document.getElementById("tabela-pedidos");
const filtroStatus = document.getElementById("filtro-status");

// elementos do modal de análise
const modalAnalise = new bootstrap.Modal(document.getElementById("modal-analise"));
const dadosCliente = document.getElementById("dados-cliente");
const selectAutomovel = document.getElementById("analise-automovel");
const inputInicio = document.getElementById("analise-inicio");
const inputFim = document.getElementById("analise-fim");
const inputParecer = document.getElementById("analise-parecer");
const mensagemAnalise = document.getElementById("mensagem-analise");

let pedidos = [];
let clientes = [];
let automoveis = [];
let pedidoSelecionado = null;

function buscarClienteNaLista(id) {
  return clientes.find((cliente) => cliente.id === id);
}

function buscarAutomovelNaLista(id) {
  return automoveis.find((automovel) => automovel.id === id);
}

function calcularRendaTotal(cliente) {
  let total = 0;
  for (const rendimento of cliente.rendimentos) {
    total += rendimento.valor;
  }
  return total;
}

async function carregarDados() {
  pedidos = await listarPedidos();
  clientes = await listarClientes();
  automoveis = await listarAutomoveis();

  selectAutomovel.innerHTML = "";
  for (const automovel of automoveis) {
    selectAutomovel.innerHTML += `<option value="${automovel.id}">${nomeDoAutomovel(automovel)}</option>`;
  }

  mostrarPedidos();
}

function mostrarPedidos() {
  tabela.innerHTML = "";

  let lista = pedidos;
  if (filtroStatus.value !== "") {
    lista = pedidos.filter((pedido) => pedido.status === filtroStatus.value);
  }

  if (lista.length === 0) {
    tabela.innerHTML = `<tr><td colspan="6" class="text-muted">Nenhum pedido encontrado.</td></tr>`;
    return;
  }

  for (const pedido of lista) {
    const cliente = buscarClienteNaLista(pedido.clienteId);
    const automovel = buscarAutomovelNaLista(pedido.automovelId);

    let botoes = "";
    if (pedido.status === "Em análise" && cliente) {
      botoes = `<button class="btn btn-sm btn-primary btn-analisar">Analisar</button>`;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        ${cliente ? cliente.nome : "Cliente removido"}
        <div class="small text-muted">${cliente ? cliente.profissao : ""}</div>
      </td>
      <td>${cliente ? formatarDinheiro(calcularRendaTotal(cliente)) : "-"}</td>
      <td>${nomeDoAutomovel(automovel)}</td>
      <td>${formatarData(pedido.dataInicio)} a ${formatarData(pedido.dataFim)}</td>
      <td><span class="badge text-bg-${corDoStatus(pedido.status)}">${pedido.status}</span></td>
      <td class="text-end text-nowrap">${botoes}</td>
    `;

    const btnAnalisar = tr.querySelector(".btn-analisar");
    if (btnAnalisar) {
      btnAnalisar.addEventListener("click", () => abrirAnalise(pedido));
    }
    tabela.appendChild(tr);
  }
}

function abrirAnalise(pedido) {
  pedidoSelecionado = pedido;
  const cliente = buscarClienteNaLista(pedido.clienteId);

  let rendimentos = "";
  for (const rendimento of cliente.rendimentos) {
    rendimentos += `<li>${rendimento.entidadeEmpregadora}: ${formatarDinheiro(rendimento.valor)}</li>`;
  }
  if (rendimentos === "") {
    rendimentos = "<li>Nenhum rendimento informado</li>";
  }

  dadosCliente.innerHTML = `
    <p class="mb-1"><strong>${cliente.nome}</strong> - CPF ${cliente.cpf} - RG ${cliente.rg}</p>
    <p class="mb-1">${cliente.profissao} | ${cliente.endereco}</p>
    <ul class="mb-1">${rendimentos}</ul>
    <p class="mb-0">Renda total: <strong>${formatarDinheiro(calcularRendaTotal(cliente))}</strong></p>
  `;

  selectAutomovel.value = pedido.automovelId;
  inputInicio.value = pedido.dataInicio;
  inputFim.value = pedido.dataFim;
  inputParecer.value = pedido.parecer;
  mensagemAnalise.classList.add("d-none");

  modalAnalise.show();
}

// o agente também pode modificar o pedido antes de avaliar
async function salvarPedido(novoStatus) {
  if (inputFim.value < inputInicio.value) {
    mensagemAnalise.textContent = "A data de devolução não pode ser antes da retirada.";
    mensagemAnalise.classList.remove("d-none");
    return;
  }

  const dados = {
    automovelId: selectAutomovel.value,
    dataInicio: inputInicio.value,
    dataFim: inputFim.value,
    parecer: inputParecer.value.trim()
  };

  if (novoStatus) {
    dados.status = novoStatus;
    dados.agenteId = sessao.id;
  }

  await atualizarPedido(pedidoSelecionado.id, dados);
  modalAnalise.hide();
  carregarDados();
}

document.getElementById("btn-salvar-pedido").addEventListener("click", () => salvarPedido(null));
document.getElementById("btn-aprovar").addEventListener("click", () => salvarPedido("Aprovado"));
document.getElementById("btn-reprovar").addEventListener("click", () => salvarPedido("Reprovado"));

filtroStatus.addEventListener("change", mostrarPedidos);

if (sessao) {
  carregarDados().catch((erro) => {
    tabela.innerHTML = `<tr><td colspan="6" class="text-danger">Erro ao carregar os pedidos. O JSON Server está rodando?</td></tr>`;
    console.error(erro);
  });
}
