// Funções pequenas usadas em várias páginas

// "2026-11-10" -> "10/11/2026"
function formatarData(data) {
  if (!data) {
    return "-";
  }
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// data de hoje no formato "aaaa-mm-dd", que é o mesmo do input type="date"
function hoje() {
  const data = new Date();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// cor do badge do Bootstrap para cada status do pedido
function corDoStatus(status) {
  if (status === "Em análise") return "warning";
  if (status === "Aprovado") return "info";
  if (status === "Reprovado") return "danger";
  if (status === "Cancelado") return "secondary";
  if (status === "Contratado") return "success";
  return "light";
}

function nomeDoAutomovel(automovel) {
  if (!automovel) {
    return "Automóvel removido";
  }
  return `${automovel.marca} ${automovel.modelo} ${automovel.ano} (${automovel.placa})`;
}
