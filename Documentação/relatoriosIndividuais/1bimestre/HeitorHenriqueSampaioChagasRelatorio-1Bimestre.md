# Relatório Individual — Projeto Integrador

**Disciplina:** Projeto Integrador  
**Curso:** Técnico Integrado em Informática — UTFPR-CM  
**Integrante:** Heitor Henrique Sampaio Chagas  
**Projeto:** FinControl — Sistema de Controle Financeiro Pessoal  
**Equipe:** Money Control  
**Data:** maio de 2026

---

## Atividades Realizadas

Minha atuação no projeto foi concentrada principalmente na área de documentação e organização do repositório. Escrevi a documentação técnica do sistema, cobrindo a descrição geral do projeto, as tecnologias adotadas com suas respectivas justificativas, e o guia de configuração e execução, detalhando o passo a passo para que qualquer pessoa consiga rodar o sistema localmente a partir do zero.

Além disso, fiz uma contribuição direta no código ao revisar as requisições HTTP do backend: identifiquei que uma das chamadas ao banco de dados estava referenciando o campo `google_id` em vez do nome correto da coluna na tabela, que é `google_id_usuario`. Esse tipo de erro é difícil de notar sem leitura cuidadosa do código junto com o schema do banco, porque o sistema falha em runtime sem nenhuma mensagem de erro óbvia sobre o nome da coluna. Apontei o problema para a equipe, que realizou a correção.

---

## Conhecimentos Adquiridos

O projeto me deu a chance de entender na prática como um sistema web real é estruturado do início ao fim. Ver o backend em Node.js com Fastify organizado em camadas de rotas, controllers e models deixou claro como essa separação de responsabilidades funciona concretamente — até então, a ideia de MVC era mais abstrata pra mim.

Aprofundei também o entendimento sobre como o frontend em React se comunica com o backend via Axios: as requisições HTTP são feitas nas chamadas de função, os dados voltam em JSON e alimentam o estado dos componentes. Entender isso da perspectiva de quem escreve a documentação exigiu ler o código com cuidado, o que acabou sendo uma forma eficaz de aprendizado.

Outra área em que aprendi bastante foi a autenticação com Google OAuth. Acompanhar como o fluxo funciona — o frontend recebe um `idToken` do Google, envia pro backend, que verifica com a `google-auth-library` e cria ou recupera o usuário no banco — me deu uma visão bem concreta de como integrações com serviços externos funcionam em projetos reais.

Por fim, trabalhar com o PostgreSQL via DBeaver para entender a estrutura das tabelas foi importante tanto pra redigir a documentação quanto pra identificar o erro na consulta.

---

## Dificuldades Encontradas

A principal dificuldade foi escrever uma documentação técnica que fosse precisa sem ter desenvolvido as partes que eu estava documentando. Isso exigiu ler o código-fonte com atenção antes de redigir qualquer coisa, o que tomou tempo considerável, especialmente para entender o fluxo de autenticação Google e a lógica de transações.

Outra dificuldade foi a identificação do bug no nome da coluna. Sem acesso direto ao banco de dados configurado, precisei cruzar as informações do código (o arquivo `db.js`, os models e as rotas) para entender exatamente qual nome de campo o banco esperava e qual a requisição estava enviando. A diferença entre `google_id` e `google_id_usuario` é pequena o suficiente para passar despercebida numa leitura rápida.

---

## Como as Dificuldades Foram Resolvidas

Para a documentação, adotei a prática de ler o código antes de escrever — especialmente os arquivos `app.js`, `db.js`, os controllers e os models — para garantir que o que estava sendo documentado correspondia ao comportamento real do sistema. Quando havia dúvidas sobre o funcionamento de alguma parte, consultei a equipe diretamente.

O erro no nome da coluna foi resolvido pela leitura conjunta do model de usuário (`usuario.js`) e do controller correspondente (`usuarioController.js`), comparando o nome do campo passado como parâmetro com o nome real da coluna no banco. Depois de confirmar a discrepância, comuniquei à equipe, que aplicou a correção.
