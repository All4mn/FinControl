# Relatório Individual — 3º Bimestre

**Nome:** Allan Guilherme Camargo de Oliveira
**Projeto:** FinControl
**Disciplina:** Projeto Integrador

---

## 1. Atividades realizadas

Durante este bimestre, minha atividade principal foi a evolução da camada de persistência do projeto FinControl, concentrando esforços na migração dos repositórios para a utilização de um ORM. As atividades realizadas incluem:

- **Atualização dos repositórios para ORM (Drizzle):** principal foco do bimestre, substituindo o acesso direto ao banco por uma camada de mapeamento objeto-relacional, com o auxílio do Andrei.
- **Auxílio nas demais demandas da equipe:** suporte superficial a outras tarefas do time, restrito à emissão de opiniões e à análise técnica de decisões.
- **Início do bot de leitura de nota fiscal:** apoio no ponto de partida da criação de um bot integrado ao **WhatsApp**, utilizando IA open-source (**Grok**) e **OCR** para extração de dados da nota fiscal. A funcionalidade **não foi finalizada** neste bimestre.
- **Criação da tela principal:** contribuição na construção da tela principal do projeto, contemplando a **tabela de transações** e **gráficos**. A tela foi **entregue, porém com erros ainda em análise** para correção.

## 2. Conhecimentos adquiridos

Este trabalho permitiu consolidar e aprofundar conhecimentos práticos em:

- **ORM e Persistência de Dados:** uso do **Drizzle** para mapeamento objeto-relacional, modelagem das entidades e abstração das consultas SQL.
- **Arquitetura de Acesso a Dados:** padronização da camada de repositórios, tornando o código mais legível e desacoplado do banco.
- **Integração com WhatsApp e IA:** noções de integração de bot com o WhatsApp e do uso de IA (**Grok**) combinada a **OCR** para leitura de nota fiscal.
- **Frontend de Visualização:** construção de tabela de transações e gráficos na tela principal.

## 3. Principais dificuldades encontradas

As maiores dificuldades técnicas enfrentadas ao longo do período foram:

- **Migração para o ORM:** adaptar a camada de acesso a dados existente para o **Drizzle** sem quebrar as funcionalidades já implementadas.
- **Fluxo do bot de nota fiscal:** compreender a combinação de WhatsApp, OCR e IA para extrair corretamente os dados da nota fiscal, etapa ainda **incompleta**.
- **Erros na tela principal:** analisar e identificar as falhas presentes na tela principal após a entrega.

## 4. Como superei as dificuldades

Para superar esses desafios de forma eficiente, adotei as seguintes estratégias:

- **Apoio na adoção do ORM:** apoio direto do Andrei durante a migração dos repositórios para o Drizzle, acelerando o entendimento da ferramenta.
- **Estudo e testes iterativos:** consulta à documentação e realização de testes contínuos para validar o comportamento da camada de dados.
- **Análise incremental dos erros:** investigação progressiva das falhas reportadas na tela principal, isolando cada problema para correção.

## 5. Contribuição para o projeto

Minha atuação trouxe impactos diretos na organização e na maturidade técnica do desenvolvimento do FinControl:

- **Acesso a dados padronizado:** a adoção do ORM nos repositórios padronizou a camada de persistência e facilitou a manutenção do projeto.
- **Colaboração pontual:** contribuí com opiniões e análises nas demais demandas da equipe.
- **Avanço de funcionalidades:** apoio no esboço inicial do bot de leitura de nota fiscal e na tela principal (tabela de transações e gráficos), esta última com pendências de correção em análise.

---

## 6. Considerações finais

Este bimestre foi marcado pela consolidação do acesso a dados do projeto por meio do ORM, o que representou o principal avanço técnico sob minha responsabilidade. O contato com as frentes do bot de nota fiscal e da tela principal também ampliou minha visão sobre integração e visualização de dados, ainda que de forma parcial.

Os próximos passos consistem em **finalizar o bot de leitura de nota fiscal** e **corrigir os erros identificados na tela principal**, garantindo a estabilidade das entregas antes de avançar para novas funcionalidades.
