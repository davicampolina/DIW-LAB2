const form = document.getElementById("form-cliente");
const inputId = document.getElementById("cliente-id");
const tabela = document.getElementById("tabela-clientes");
const tituloForm = document.getElementById("titulo-form");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const mensagem = document.getElementById("mensagem");

function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `alert alert-${tipo} mt-3`;
}

function esconderMensagem() {
  mensagem.className = "alert d-none mt-3";
}

function calcularRendaTotal(cliente) {
  let total = 0;
  for (const rendimento of cliente.rendimentos) {
    total += rendimento.valor;
  }
  return total;
}

// monta a tabela com os clientes cadastrados
async function carregarClientes() {
  try {
    const clientes = await listarClientes();
    tabela.innerHTML = "";

    if (clientes.length === 0) {
      tabela.innerHTML = `<tr><td colspan="5" class="text-muted">Nenhum cliente cadastrado.</td></tr>`;
      return;
    }

    for (const cliente of clientes) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.cpf}</td>
        <td>${cliente.profissao}</td>
        <td>${formatarDinheiro(calcularRendaTotal(cliente))}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
          <button class="btn btn-sm btn-outline-danger btn-excluir">Excluir</button>
        </td>
      `;
      tr.querySelector(".btn-editar").addEventListener("click", () => prepararEdicao(cliente));
      tr.querySelector(".btn-excluir").addEventListener("click", () => removerCliente(cliente));
      tabela.appendChild(tr);
    }
  } catch (erro) {
    tabela.innerHTML = `<tr><td colspan="5" class="text-danger">Não foi possível carregar os clientes. O JSON Server está rodando?</td></tr>`;
    console.error(erro);
  }
}

// pega os 3 campos de rendimento e só guarda os que foram preenchidos
function lerRendimentos() {
  const empregadores = document.querySelectorAll("#rendimentos .empregador");
  const valores = document.querySelectorAll("#rendimentos .valor");
  const rendimentos = [];

  for (let i = 0; i < empregadores.length; i++) {
    const empregador = empregadores[i].value.trim();
    if (empregador !== "") {
      rendimentos.push({
        entidadeEmpregadora: empregador,
        valor: Number(valores[i].value)
      });
    }
  }
  return rendimentos;
}

function preencherRendimentos(rendimentos) {
  const empregadores = document.querySelectorAll("#rendimentos .empregador");
  const valores = document.querySelectorAll("#rendimentos .valor");

  for (let i = 0; i < empregadores.length; i++) {
    if (rendimentos[i]) {
      empregadores[i].value = rendimentos[i].entidadeEmpregadora;
      valores[i].value = rendimentos[i].valor;
    } else {
      empregadores[i].value = "";
      valores[i].value = "";
    }
  }
}

function prepararEdicao(cliente) {
  inputId.value = cliente.id;
  document.getElementById("nome").value = cliente.nome;
  document.getElementById("rg").value = cliente.rg;
  document.getElementById("cpf").value = cliente.cpf;
  document.getElementById("endereco").value = cliente.endereco;
  document.getElementById("profissao").value = cliente.profissao;
  document.getElementById("email").value = cliente.email;
  document.getElementById("senha").value = cliente.senha;
  preencherRendimentos(cliente.rendimentos);

  tituloForm.textContent = "Editar cliente";
  btnSalvar.textContent = "Salvar alterações";
  btnCancelar.classList.remove("d-none");
  esconderMensagem();
  window.scrollTo(0, 0);
}

function limparFormulario() {
  form.reset();
  inputId.value = "";
  tituloForm.textContent = "Novo cliente";
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.classList.add("d-none");
}

async function removerCliente(cliente) {
  if (!confirm(`Deseja excluir o cliente ${cliente.nome}?`)) {
    return;
  }
  await excluirCliente(cliente.id);
  carregarClientes();
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const cliente = {
    nome: document.getElementById("nome").value.trim(),
    rg: document.getElementById("rg").value.trim(),
    cpf: document.getElementById("cpf").value.trim(),
    endereco: document.getElementById("endereco").value.trim(),
    profissao: document.getElementById("profissao").value.trim(),
    email: document.getElementById("email").value.trim(),
    senha: document.getElementById("senha").value,
    rendimentos: lerRendimentos()
  };

  // não deixa cadastrar dois clientes com o mesmo CPF
  const clienteComMesmoCpf = await buscarClientePorCpf(cliente.cpf);
  if (clienteComMesmoCpf && clienteComMesmoCpf.id !== inputId.value) {
    mostrarMensagem("Já existe um cliente cadastrado com esse CPF.", "danger");
    return;
  }

  if (inputId.value) {
    await atualizarCliente(inputId.value, cliente);
    mostrarMensagem("Cliente atualizado com sucesso!", "success");
  } else {
    await criarCliente(cliente);
    mostrarMensagem("Cliente cadastrado com sucesso!", "success");
  }

  limparFormulario();
  carregarClientes();
});

btnCancelar.addEventListener("click", () => {
  limparFormulario();
  esconderMensagem();
});

carregarClientes();
