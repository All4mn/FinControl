# Relatório Individual — 2º Bimestre

**Nome:** Hiago Gimenez Viera
**Projeto:** FinControl
**Disciplina:** Projeto Integrador

---

## 1. Atividades realizadas

Durante este bimestre, participei principalmente da implementação da funcionalidade de **Carteira** no sistema FinControl. As atividades realizadas incluem:

- Análise do modelo de dados existente e identificação da entidade `carteira` como tabela de apoio.
- Implementação do backend para CRUD de carteiras, seguindo a arquitetura em camadas do projeto.
- Criação do endpoint de listagem de carteiras do usuário: `GET /carteiras/usuario/:id_usuario`.
- Ajuste do frontend para consumir apenas carteiras do usuário autenticado.
- Desenvolvimento dos componentes de interface para cadastro e listagem de carteiras.
- Documentação técnica da funcionalidade carteira dentro da pasta `Documentação`.

## 2. Conhecimentos adquiridos

Este trabalho permitiu aprofundar conhecimentos em:

- Arquitetura em camadas no backend (controller → service → repository).
- Criação de APIs RESTful com Fastify e Node.js.
- Integração entre frontend React e backend via Axios.
- Organização de componentes React e hooks customizados para fluxo de dados.
- Filtragem de dados por usuário para preservar segurança e personalização da experiência.

## 3. Principais dificuldades encontradas

As maiores dificuldades técnicas foram:

- Entender como manter o padrão arquitetural do projeto já existente sem quebrar a estrutura de rotas.
- Garantir que a listagem de carteiras retornasse apenas os dados do usuário logado, em vez de todas as carteiras.
- Integrar corretamente o novo recurso ao frontend de maneira consistente com o estilo visual do projeto.

## 4. Como superei as dificuldades

Para superar esses desafios, adotei as seguintes ações:

- Analisei a estrutura de pastas e os arquivos de outras entidades (`conta`, `categoria`, `transacao`) para replicar o padrão de controller/service/repository.
- Criei um endpoint dedicado para filtro por usuário e validei o parâmetro `id_usuario` no serviço.
- Reutilizei componentes existentes do frontend e adaptei apenas o necessário para manter a consistência visual.
- Testei o fluxo de criação e listagem de carteiras com diferentes usuários para validar o comportamento.

## 5. Contribuição para o projeto

Minha contribuição fortaleceu o sistema em vários pontos:

- A funcionalidade de carteira passou a ser uma parte utilizável e segura do aplicativo.
- O backend ganhou um endpoint específico de usuário, melhorando a lógica de acesso ao dado.
- O frontend passou a exibir carteiras de maneira personalizada, conforme o usuário autenticado.
- A documentação técnica do projeto recebeu um novo artefato detalhando a implementação da carteira.

---

## 6. Considerações finais

Este bimestre foi importante para consolidar a capacidade de trabalhar em projetos fullstack com separação de responsabilidades. O foco em uma tabela de apoio (`carteira`) permitiu entregar um CRUD completo sem interferir diretamente na entidade central de transações, o que era o objetivo pedagógico do exercício.

A próxima etapa natural é integrar a carteira ao dashboard e ao fluxo de transações, bem como estender o controle de acesso para proteger todas as operações de edição e exclusão.
