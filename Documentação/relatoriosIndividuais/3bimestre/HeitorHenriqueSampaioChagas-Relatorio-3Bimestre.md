# Relatório Individual — Projeto Integrador

**Disciplina:** Projeto Integrador  
**Curso:** Técnico Integrado para a Internet — UTFPR-CM  
**Integrante:** Heitor Henrique Sampaio Chagas  
**Projeto:** FinControl — Sistema de Controle Financeiro Pessoal  
**Equipe:** Money Control  
**Data:** outubro de 2026 

---

## Atividades Realizadas

Neste período, minha principal contribuição foi a realização dos ajustes no backend registrados no commit `e616b1c0aeb2e5aacca10341c87f7aafa3ed678e`, intitulado **“Ajustes”**. A alteração envolveu quatro arquivos, com 56 adições e 14 remoções.

Uma das atividades foi padronizar os nomes dos arquivos de rotas utilizados em `app.js`. Os imports passaram a seguir o padrão com a extensão `.routes.js`, incluindo as rotas de usuário, categoria, método, conta, carteira, transação, status de usuário, logs e moeda.

Também melhorei o tratamento de erros relacionados à criação de transações. O `TransacaoService` passou a lançar `AppError` com status HTTP 400 quando o ID da conta não é informado, quando o valor da transação está ausente ou quando a descrição não foi preenchida. No `TransacaoController`, foram tratados esses erros de validação e também códigos específicos do PostgreSQL (`23503`, `23522`, `22P02` e `23514`), retornando uma mensagem adequada para dados de transação inválidos.

Por fim, atualizei o arquivo `transacao.http` com exemplos para buscar uma transação por ID, editar uma transação e removê-la. Também revisei os dados dos exemplos, como o ID da carteira, o formato do valor monetário e a descrição.

---

## Conhecimentos Adquiridos

Esse trabalho aprofundou meu entendimento sobre a organização de um backend em camadas e sobre a importância de manter uma convenção consistente para os nomes dos arquivos. A padronização dos imports em `app.js` mostrou como pequenas divergências de nomenclatura podem dificultar a manutenção e até impedir que as rotas sejam carregadas corretamente.

Aprendi também a diferenciar erros de validação da aplicação de erros inesperados. Ao utilizar `AppError` com o status 400, o sistema consegue informar ao cliente que os dados enviados são inválidos, em vez de tratar toda falha como um erro interno do servidor. Isso tornou mais claro o papel do service na validação dos dados e do controller na transformação dos erros em respostas HTTP.

Outro aprendizado foi sobre o tratamento de erros do PostgreSQL. A análise dos códigos `23503`, `23522`, `22P02` e `23514` ajudou a entender como violações de chave estrangeira, restrições de valores e tipos inválidos podem ser identificadas e convertidas em respostas compreensíveis para quem utiliza a API.

Além disso, os exemplos do arquivo HTTP reforçaram meu entendimento das operações de consulta, edição e exclusão de transações, permitindo testar e documentar essas funcionalidades de forma mais completa.

---

## Dificuldades Encontradas

A principal dificuldade foi distinguir os diferentes tipos de erro que poderiam ocorrer durante a criação de uma transação. Nem toda falha deveria retornar status 500: campos obrigatórios ausentes são problemas de entrada do usuário, enquanto determinados erros do banco também indicam que os dados enviados não são válidos.

Outra dificuldade foi identificar todos os imports que precisavam ser atualizados com a nova convenção de nomes. Como o ajuste envolvia várias funcionalidades, foi necessário revisar cada rota registrada em `app.js` para evitar que algum módulo permanecesse com o padrão antigo.

Também foi necessário conferir se os exemplos HTTP representavam corretamente as operações disponíveis. Além de adicionar as requisições de busca, edição e remoção, revisei os valores utilizados para que os exemplos permanecessem coerentes com o formato esperado pela API.

---

## Como as Dificuldades Foram Resolvidas

Para separar os erros de validação dos erros genéricos, utilizei a classe `AppError` já existente no projeto e defini o status 400 nas validações do `TransacaoService`. No controller, passei a verificar primeiro se o erro era uma instância de `AppError` e, em seguida, tratei explicitamente os códigos conhecidos do PostgreSQL. Assim, cada situação passou a receber uma resposta HTTP adequada.

A padronização dos imports foi resolvida revisando todas as rotas importadas em `app.js` e substituindo os nomes antigos pelo padrão `.routes.js`, mantendo os nomes das funções exportadas.

Para a documentação e os testes das operações, incluí uma variável para o ID da transação e adicionei exemplos separados de `GET`, `PUT` e `DELETE` no arquivo `transacao.http`. Também atualizei os dados do corpo das requisições, conferindo os campos e formatos utilizados pelas transações.
