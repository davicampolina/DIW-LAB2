// Guarda quem está logado no localStorage do navegador

function salvarSessao(usuario, perfil) {
  const sessao = {
    id: usuario.id,
    nome: usuario.nome,
    perfil: perfil,
    // para agentes guarda se é Empresa ou Banco
    tipo: perfil === "agente" ? usuario.tipo : "Cliente"
  };
  localStorage.setItem("sessao", JSON.stringify(sessao));
}

function pegarSessao() {
  const sessao = localStorage.getItem("sessao");
  if (sessao) {
    return JSON.parse(sessao);
  }
  return null;
}

function sair() {
  localStorage.removeItem("sessao");
  window.location.href = "index.html";
}

// usado no começo das páginas que precisam de login
function exigirLogin(perfil) {
  const sessao = pegarSessao();
  if (!sessao || sessao.perfil !== perfil) {
    window.location.href = "index.html";
    return null;
  }

  const nomeUsuario = document.getElementById("nome-usuario");
  if (nomeUsuario) {
    nomeUsuario.textContent = `${sessao.nome} (${sessao.tipo})`;
  }
  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", sair);
  }
  return sessao;
}
