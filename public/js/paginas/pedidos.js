const sessao = exigirLogin("cliente");

const formPedido = document.getElementById("form-pedido");
const inputPedidoId = document.getElementById("pedido-id");
const selectAutomovel = document.getElementById("automovel");
const inputInicio = document.getElementById("data-inicio");
const inputFim = document.getElementById("data-fim");
const tituloForm = document.getElementById("titulo-form");
const btnEnviar = document.getElementById("btn-enviar");
const btnCancelarEdicao = document.getElementById("btn-cancelar-edicao");
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
    tabela.innerHTML = `<tr><td colspan="5" class="text-muted">Você ainda não fez nenhum pedido.</td></tr>`;
    return;
  }

  for (const pedido of pedidos) {
    const automovel = buscarAutomovelNaLista(pedido.automovelId);

    // cliente só altera pedido em análise e só cancela o que ainda não virou contrato
    const podeEditar = pedido.status === "Em análise";
    const podeCancelar = pedido.status === "Em análise" || pedido.status === "Aprovado";

    let parecer = "";
    if (pedido.parecer) {
      parecer = `<div class="small text-muted mt-1">Parecer: ${pedido.parecer}</div>`;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatarData(pedido.dataPedido)}</td>
      <td>${nomeDoAutomovel(automovel)}</td>
      <td>${formatarData(pedido.dataInicio)} a ${formatarData(pedido.dataFim)}</td>
      <td>
        <span class="badge text-bg-${corDoStatus(pedido.status)}">${pedido.status}</span>
        ${parecer}
      </td>
      <td class="text-end text-nowrap">
        ${podeEditar ? `<button class="btn btn-sm btn-outline-primary btn-editar">Modificar</button>` : ""}
        ${podeCancelar ? `<button class="btn btn-sm btn-outline-danger btn-cancelar">Cancelar</button>` : ""}
      </td>
    `;

    if (podeEditar) {
      tr.querySelector(".btn-editar").addEventListener("click", () => prepararEdicao(pedido));
    }
    if (podeCancelar) {
      tr.querySelector(".btn-cancelar").addEventListener("click", () => cancelarPedido(pedido));
    }
    tabela.appendChild(tr);
  }
}

function prepararEdicao(pedido) {
  inputPedidoId.value = pedido.id;
  selectAutomovel.value = pedido.automovelId;
  inputInicio.value = pedido.dataInicio;
  inputFim.value = pedido.dataFim;

  tituloForm.textContent = "Modificar pedido";
  btnEnviar.textContent = "Salvar alterações";
  btnCancelarEdicao.classList.remove("d-none");
  mensagem.className = "alert d-none";
}

function limparFormulario() {
  formPedido.reset();
  inputPedidoId.value = "";
  tituloForm.textContent = "Novo pedido de aluguel";
  btnEnviar.textContent = "Enviar pedido";
  btnCancelarEdicao.classList.add("d-none");
}

async function cancelarPedido(pedido) {
  if (!confirm("Tem certeza que deseja cancelar este pedido?")) {
    return;
  }
  await atualizarPedido(pedido.id, { status: "Cancelado" });
  limparFormulario();
  carregarPedidos();
}

formPedido.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (inputFim.value < inputInicio.value) {
    mostrarMensagem("A data de devolução não pode ser antes da retirada.", "danger");
    return;
  }

  if (inputPedidoId.value) {
    await atualizarPedido(inputPedidoId.value, {
      automovelId: selectAutomovel.value,
      dataInicio: inputInicio.value,
      dataFim: inputFim.value
    });
    mostrarMensagem("Pedido alterado com sucesso.", "success");
  } else {
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
  }

  limparFormulario();
  carregarPedidos();
});

btnCancelarEdicao.addEventListener("click", () => {
  limparFormulario();
  mensagem.className = "alert d-none";
});

async function iniciar() {
  try {
    await carregarAutomoveis();
    await carregarPedidos();
  } catch (erro) {
    tabela.innerHTML = `<tr><td colspan="5" class="text-danger">Erro ao carregar os dados. O JSON Server está rodando?</td></tr>`;
    console.error(erro);
  }
}

if (sessao) {
  iniciar();
}
