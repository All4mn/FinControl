# Relatório Individual — 2º Bimestre

**Nome:** Mateus Augusto Gomes Garcia
**Projeto:** FinControl
**Disciplina:** Projeto Integrador

---

## 1. Atividades realizadas

Durante este bimestre, participei principalmente da implementação da funcionalidade de **Conta** e de **Logs** no sistema FinControl. As atividades realizadas incluem:
 
 **Conta**
 - CRUD completo de administração de contas (criação, update, delete -> arquivar, select controlado);
 - Filtragem de informações de acordo com o cliente que está logado;
 - Manipulação de valor monetário;
 - Integração com o select de moedas na criação de novas contas;
 - Modal e tabela estilizada no frontend


**Logs**
- Refatoração de dados a ser consultados dentro da tabela do banco de dados;
- Manipulação de dados do tipo jsonb e o 'desempacotamento' desses dados;
- Tabela completa com filtragem por valor, id (conta, carteira, transação, log e categoria), descrição;
- Comparativo de dados antes e depois em casos de UPDATE.

# 2. Conhecimentos adquiridos

Com o desenrolar desse trabalho eu aprendi:

- Mesclagem de diferentes rotas para ampliar o poder de uma funcionalidade (moedas junto com contas para cadastro);
- Tratamento de erros e criação personalizada deles;
- Manipulação de colunas de dados do tipo jsonb 
- Divisão de páginas do frontend em componentes;
- Gerenciamento de projetos e pessoas.
- Criação de sh. para criação de features personalizadas

## 3. Principais dificuldades encontradas

As maiores dificuldades que eu encontrei foram:

- Conciliar o tempo do projeto com outras responsabilidades;
- Mesclar todas as versões do projeto na apresentação final;
- Identificar alguns problemas e fraquezas do nosso banco de dados tardiamente 
- Tratar erros fantasmas ou erros silenciosos retornandos por try/catch genéricos

## 4. Como superei as dificuldades

Para superar esses desafios, adotei as seguintes ações:

- Utilzei as aulas para fazer manutenções de rotas ja existentes e novas rotas das tabelas trabalhadas;
- Auxiliei nas revisões dos códigos de cada um e na cobrança dos membros para apressarem suas features;
- Após a apresentação, refatorarei algumas tabelas incrementando algumas regras de negocio que deveriam ter sido previstas anteriormente (ex: sigla de moeda na tabela moeda para diferenciação personalizada do estilo monetário da conta)
- Estou refatorando aos poucos cada pasta para eliminar erros silenciosos internos que deveriam ser tratados pelo próprio fastify

## 5. Contribuição para o projeto

Minha contribuição fortaleceu o sistema em vários pontos:

- Invenção de .sh personalizado para a rápida criação de features;
- Ajudei a moldar o modelo que seria seguido nas outras features e no frontend;
- Auxiliei na supervisão dos códigos, sendo escalado para revisor na maioria das branchs criadas.

---

## 6. Considerações finais

Este bimestre botou em teste as habilidades de gestão de pessoas, manutenção de códigos alheios e refatoração, pois muito das features foram realizadas em prazos, curtos que por consequencia tiveram alguns erros e conflitos tanto com códigos anteirores quanto com a propria estrutura adotada.

Honestamente a progressão do projeto me deixou um tanto confuso a respeito do proposito e do caminho que certas áreas seguiram, porém acredito que com a passos futuros, o projeto fique mais claro e que podemos identificar erros e fraquezas mais cedo para que não haja dúvidas, contradições e/ou ambiguidades.
