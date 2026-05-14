# Relatório Individual — Projeto Integrador

**Disciplina:** Projeto Integrador  
**Curso:** Técnico Integrado em Informática — UTFPR-CM  
**Integrante:** Allan Guilherme Camargo de Oliveira  
**Projeto:** FinControl — Sistema de Controle Financeiro Pessoal  
**Equipe:** Money Control  
**Data:** maio de 2026

---

## Atividades Realizadas

Minha atuação no projeto abrangeu tanto o planeamento estrutural quanto o desenvolvimento técnico, com foco principal no **backend**. No início do projeto, colaborei na criação dos **wireframes**, estabelecendo o esboço visual das interfaces para garantir uma experiência de utilizador funcional. Também auxiliei na elaboração do **Diagrama de Entidade-Relacionamento (DER)**, definindo a estrutura das tabelas e as relações fundamentais para o armazenamento dos dados financeiros.

No desenvolvimento do código, fui responsável por implementar a lógica do servidor e, especificamente, pela integração do sistema de autenticação externa, permitindo que os utilizadores acedam à plataforma através das suas contas Google.

---

## Conhecimentos Adquiridos

O projeto permitiu-me consolidar a transição do design para a funcionalidade. Ao participar na criação dos wireframes e do DER, compreendi como uma boa arquitetura de dados e interface facilita o desenvolvimento do backend. Aprendi a estruturar rotas e controladores de forma mais eficiente em Node.js, garantindo que o fluxo de dados entre o utilizador e a base de dados fosse fluido.

Aprofundei significativamente os meus conhecimentos em **autenticação e segurança**. Trabalhar com o Google OAuth 2.0 ajudou-me a entender a importância da validação de tokens no lado do servidor e como gerir a persistência de perfis de utilizadores de forma segura. Além disso, a experiência com o PostgreSQL reforçou a minha capacidade de manipular bases de dados relacionais em ambientes de desenvolvimento real.

---

## Dificuldades Encontradas

A principal dificuldade encontrada foi a implementação do **login com o Google**. Embora fosse a minha segunda vez a trabalhar com esta integração, o processo revelou-se complexo devido a configurações específicas de redirecionamento e à necessidade de garantir que o backend validasse corretamente o `idToken` recebido do frontend. Ajustar as credenciais no Google Cloud Console e sincronizá-las com as variáveis de ambiente do projeto exigiu várias tentativas e erros.

Outro desafio foi garantir que a estrutura planeada no DER fosse fielmente traduzida para o código, especialmente no que toca às restrições de chaves estrangeiras e à integridade dos dados durante as operações de escrita no banco de dados.

---

## Como as Dificuldades Foram Resolvidas

Para resolver os problemas com o sistema de login, recorri à documentação oficial do Google e analisei projetos de referência para identificar falhas na minha lógica de validação. O uso de logs no servidor foi essencial para perceber onde o fluxo de autenticação estava a ser interrompido, permitindo-me corrigir as rotas de callback.

Em relação à base de dados, resolvi as inconsistências através de testes constantes no **DBeaver**, executando queries manuais para validar se as relações entre as tabelas estavam a funcionar conforme o esperado. O diálogo constante com a equipa também foi fundamental para ajustar o backend sempre que uma nova necessidade de dados surgia no frontend.