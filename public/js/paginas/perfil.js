const sessao = exigirLogin("cliente");

const formPerfil = document.getElementById("form-perfil");
const mensagem = document.getElementById("mensagem");
const btnExcluir = document.getElementById("btn-excluir");

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

  for (let i = 0; i < rendimentos.length && i < empregadores.length; i++) {
    empregadores[i].value = rendimentos[i].entidadeEmpregadora;
    valores[i].value = rendimentos[i].valor;
  }
}

async function carregarDados() {
  const cliente = await buscarCliente(sessao.id);

  document.getElementById("nome").value = cliente.nome;
  document.getElementById("rg").value = cliente.rg;
  document.getElementById("cpf").value = cliente.cpf;
  document.getElementById("endereco").value = cliente.endereco;
  document.getElementById("profissao").value = cliente.profissao;
  document.getElementById("email").value = cliente.email;
  document.getElementById("senha").value = cliente.senha;
  preencherRendimentos(cliente.rendimentos);
}

formPerfil.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  // o CPF não entra aqui porque não pode ser alterado
  const dados = {
    nome: document.getElementById("nome").value.trim(),
    rg: document.getElementById("rg").value.trim(),
    endereco: document.getElementById("endereco").value.trim(),
    profissao: document.getElementById("profissao").value.trim(),
    email: document.getElementById("email").value.trim(),
    senha: document.getElementById("senha").value,
    rendimentos: lerRendimentos()
  };

  const clienteAtualizado = await atualizarCliente(sessao.id, dados);
  salvarSessao(clienteAtualizado, "cliente");
  document.getElementById("nome-usuario").textContent = `${clienteAtualizado.nome} (Cliente)`;

  mensagem.textContent = "Dados atualizados!";
  mensagem.className = "alert alert-success mt-3";
});

btnExcluir.addEventListener("click", async () => {
  if (!confirm("Deseja mesmo excluir sua conta? Essa ação não pode ser desfeita.")) {
    return;
  }
  await excluirCliente(sessao.id);
  sair();
});

if (sessao) {
  carregarDados();
}
