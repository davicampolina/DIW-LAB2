const formCadastro = document.getElementById("form-cadastro");
const mensagem = document.getElementById("mensagem");

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

formCadastro.addEventListener("submit", async (evento) => {
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

  const jaExiste = await buscarClientePorCpf(cliente.cpf);
  if (jaExiste) {
    mensagem.textContent = "Já existe um cliente cadastrado com esse CPF.";
    mensagem.className = "alert alert-danger mt-3";
    return;
  }

  await criarCliente(cliente);
  mensagem.textContent = "Conta criada! Redirecionando para o login...";
  mensagem.className = "alert alert-success mt-3";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
