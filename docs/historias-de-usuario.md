# Histórias de Usuário

Histórias levantadas a partir da descrição do sistema de aluguel de carros.

Atores:
- **Cliente**: usuário individual que faz os pedidos de aluguel.
- **Agente**: empresa ou banco que avalia os pedidos. O banco também pode conceder crédito.

---

### US01 - Cadastro de cliente
**Como** cliente, **quero** me cadastrar no sistema informando meus dados pessoais, **para** poder usar o sistema e fazer pedidos de aluguel.

Critérios de aceitação:
- O cadastro pede RG, CPF, nome, endereço, profissão, e-mail e senha.
- O cliente pode informar até 3 empregadores com os rendimentos de cada um.
- Não é possível cadastrar dois clientes com o mesmo CPF.

### US02 - Login
**Como** usuário (cliente ou agente), **quero** entrar no sistema com e-mail e senha, **para** acessar as funções do meu perfil.

Critérios de aceitação:
- Só usuários cadastrados conseguem entrar.
- Se o e-mail ou a senha estiverem errados, aparece uma mensagem de erro.

### US03 - Manter dados do cliente
**Como** cliente, **quero** consultar e alterar meus dados cadastrais, **para** manter minhas informações atualizadas.

Critérios de aceitação:
- O cliente consegue editar todos os dados, menos o CPF.
- O cliente pode excluir o próprio cadastro.

### US04 - Introduzir pedido
**Como** cliente, **quero** criar um pedido de aluguel escolhendo um automóvel e as datas, **para** alugar um carro.

Critérios de aceitação:
- O pedido é criado com o status "Em análise".
- A data de fim não pode ser antes da data de início.

### US05 - Consultar pedidos
**Como** cliente, **quero** ver a lista dos meus pedidos e o status de cada um, **para** acompanhar o andamento.

Critérios de aceitação:
- A lista mostra o automóvel, as datas e o status do pedido.
- O cliente só vê os próprios pedidos.

### US06 - Modificar pedido
**Como** cliente, **quero** alterar um pedido que ainda está em análise, **para** corrigir o carro ou as datas.

Critérios de aceitação:
- Só pedidos com status "Em análise" podem ser alterados pelo cliente.

### US07 - Cancelar pedido
**Como** cliente, **quero** cancelar um pedido, **para** desistir do aluguel.

Critérios de aceitação:
- Pedidos já contratados não podem ser cancelados.
- O pedido cancelado continua aparecendo na lista com o status "Cancelado".

### US08 - Avaliar pedido
**Como** agente, **quero** analisar financeiramente os pedidos dos clientes, **para** aprovar ou reprovar o aluguel.

Critérios de aceitação:
- O agente vê os dados do cliente (rendimentos) junto com o pedido.
- O agente escolhe aprovar ou reprovar e pode escrever um parecer.

### US09 - Modificar pedido (agente)
**Como** agente, **quero** alterar um pedido, **para** ajustar datas ou o automóvel antes de aprovar.

### US10 - Executar contrato
**Como** agente, **quero** gerar o contrato de um pedido aprovado, **para** concluir o aluguel.

Critérios de aceitação:
- Só pedidos aprovados podem virar contrato.
- O contrato informa se o carro fica registrado como propriedade do cliente, da empresa ou do banco.

### US11 - Conceder crédito
**Como** banco, **quero** associar um contrato de crédito ao aluguel, **para** financiar o cliente.

Critérios de aceitação:
- Só agentes do tipo banco podem conceder crédito.
- O contrato de crédito guarda o valor concedido e o banco responsável.
