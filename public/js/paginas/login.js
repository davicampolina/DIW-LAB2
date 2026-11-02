const formLogin = document.getElementById("form-login");
const mensagem = document.getElementById("mensagem");

// se já estiver logado vai direto para a página certa
function irParaPaginaInicial(perfil) {
  if (perfil === "cliente") {
    window.location.href = "pedidos.html";
  } else {
    window.location.href = "avaliacao.html";
  }
}

const sessaoAtual = pegarSessao();
if (sessaoAtual) {
  irParaPaginaInicial(sessaoAtual.perfil);
}

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const perfil = document.querySelector("input[name='perfil']:checked").value;

  try {
    const usuario = await fazerLogin(email, senha, perfil);

    if (!usuario) {
      mensagem.textContent = "E-mail ou senha incorretos.";
      mensagem.classList.remove("d-none");
      return;
    }

    salvarSessao(usuario, perfil);
    irParaPaginaInicial(perfil);
  } catch (erro) {
    mensagem.textContent = "Não foi possível conectar. O JSON Server está rodando?";
    mensagem.classList.remove("d-none");
    console.error(erro);
  }
});
