// Login de clientes e agentes.
// perfil pode ser "cliente" ou "agente"
async function fazerLogin(email, senha, perfil) {
  const rota = perfil === "cliente" ? "clientes" : "agentes";
  const resposta = await fetch(`${API_URL}/${rota}?email=${encodeURIComponent(email)}`);
  const usuarios = await resposta.json();

  const usuario = usuarios[0];
  if (!usuario || usuario.senha !== senha) {
    return null;
  }
  return usuario;
}
