# Revisão dos diagramas

Os diagramas estão separados em duas versões:

- `docs/diagramas/v1` - modelagem inicial, feita antes de começar o código.
- `docs/diagramas/v2` - versão revisada depois da implementação do CRUD e do protótipo, para ficar alinhada com o código.

Cada diagrama tem o arquivo `.puml` (fonte em PlantUML) e a imagem `.png` gerada a partir dele.

## O que mudou da v1 para a v2

### Casos de uso
- Adicionado **Manter dados cadastrais**: o cliente precisa alterar ou excluir o próprio cadastro (página `perfil.html`).
- Adicionado **Gerenciar clientes**: o CRUD completo de clientes (`gestao-clientes.html`) ficou disponível para os agentes, que precisam ver os dados dos clientes para fazer a análise financeira.
- "Consultar pedido" virou **Consultar pedidos e status**, que é o que a tela `meus-pedidos.html` mostra.

### Classes
- **Empresa e Banco** deixaram de ser subclasses de Agente. No JSON Server os dois ficam na mesma coleção `/agentes`, então foi criado o atributo `tipo` (enum `TipoAgente`). A regra de que só banco concede crédito ficou como uma nota no diagrama e é verificada no `avaliacao.js` (`sessao.tipo === "Banco"`).
- **Pedido** ganhou `dataPedido`, `parecer`, `agenteId` e as chaves `clienteId` e `automovelId`. O `status` virou o enum `StatusPedido` com os valores usados no código: Em análise, Aprovado, Reprovado, Cancelado e Contratado.
- **Automovel** ganhou `proprietarioTipo` e `proprietarioId`, porque o requisito diz que o carro pode ficar registrado como propriedade do cliente, da empresa ou do banco. Esse dado é atualizado quando o contrato é executado.
- **Contrato** ganhou `proprietarioId` e as chaves do pedido, cliente, automóvel e agente. O `tipoPropriedade` virou o enum `TipoProprietario`.
- **ContratoCredito** passou a ser uma composição dentro do contrato (campo `credito` no `db.json`), com o `bancoId` e o `valor`.
- **Rendimento** continua igual, mas aparece também como atributo `rendimentos[0..3]` do Cliente, que é como ele fica salvo no `db.json`.
- Os métodos foram renomeados para os nomes das funções que existem no código (`criarPedido`, `atualizarPedido`, `listarPedidosDoCliente`, `criarContrato`, `fazerLogin`...).

### Páginas renomeadas
- `clientes.html` virou `gestao-clientes.html` e `pedidos.html` virou `meus-pedidos.html`. Ao testar com o JSON Server, a rota `GET /clientes` estava devolvendo a página `clientes.html` em vez do JSON (o JSON Server serve a pasta `public` antes da API e completa a extensão `.html`). Os diagramas de pacotes e de componentes da v2 já usam os nomes novos.

### Pacotes
- Os pacotes agora mostram os arquivos de verdade de cada camada: páginas HTML (Visão), scripts de `js/paginas` (Controle), scripts de `js/servicos` (Serviços) e o `db.json` (Persistência).
- Foi criado o pacote **Apoio** com `config.js` (endereço da API), `sessao.js` (usuário logado) e `utils.js` (formatação de datas e valores).

### Componentes
- O "Serviço de Clientes", "Serviço de Pedidos" e "Serviço de Contratos" viraram um componente para cada arquivo de serviço, incluindo `loginServico.js`, `agentesServico.js` e `automoveisServico.js`, que não estavam na v1.
- Cada página aparece como um componente (HTML + script), ligada só aos serviços que ela usa.
- Entrou o `localStorage`, usado pelo `sessao.js` para guardar quem está logado.
- A interface da API mostra as rotas criadas pelo JSON Server: `/clientes`, `/agentes`, `/automoveis`, `/pedidos` e `/contratos`.

## Relação entre classes e código

| Classe        | Coleção no db.json | Serviço (js/servicos)   | Páginas que usam                         |
|---------------|--------------------|-------------------------|------------------------------------------|
| Cliente       | `clientes`         | `clientesServico.js`    | cadastro, perfil, gestao-clientes, avaliacao |
| Agente        | `agentes`          | `agentesServico.js`     | avaliacao                                |
| Usuario       | `clientes` / `agentes` | `loginServico.js`   | index (login)                            |
| Automovel     | `automoveis`       | `automoveisServico.js`  | meus-pedidos, avaliacao                  |
| Pedido        | `pedidos`          | `pedidosServico.js`     | meus-pedidos, avaliacao                  |
| Contrato      | `contratos`        | `contratosServico.js`   | avaliacao                                |
