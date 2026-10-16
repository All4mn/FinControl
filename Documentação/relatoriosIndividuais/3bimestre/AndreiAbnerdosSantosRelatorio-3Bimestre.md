# Relatório Individual — Projeto Integrador (3º Bimestre)

**Disciplina:** Projeto Integrador
**Curso:** Técnico Integrado em Informática — UTFPR-CM
**Integrante:** Andrei Abner dos Santos
**Projeto:** FinControl — Sistema de Controle Financeiro Pessoal
**Equipe:** Money Control
**Data:** Agosto/Setembro de 2026

---

## Atividades Realizadas

Durante este bimestre (agosto e setembro), minhas atividades concentraram-se na refatoração da camada de dados do sistema FinControl, atuando de forma focada na infraestrutura do backend.

As principais contribuições realizadas neste período foram:

1. **Implementação do Drizzle ORM (Backend):** Fiquei responsável por atualizar a arquitetura do backend junto ao Allan, substituindo a abordagem anterior de consultas para a utilização do Drizzle ORM, visando melhorar a legibilidade, manutenção e segurança das operações no banco de dados.

2. **Migração de Features Específicas:** Realizei a conversão e adaptação completa das funcionalidades relacionadas a entidades centrais do sistema, especificamente: **Carteira**, **CarteiraHasConta** (relação entre carteiras e contas), **Conta**, **Moeda** e **Usuario**. Garanti que as operações CRUD dessas entidades funcionassem perfeitamente com a nova ferramenta de ORM.

---

## Conhecimentos Adquiridos

O processo de migração e atualização da base de dados proporcionou grande experiência prática em arquitetura de software, destacando-se:

- **Mapeamento Objeto-Relacional (ORM):** Aprofundamento no conceito de ORMs e em como eles abstraem a complexidade do banco de dados na camada de aplicação.
- **Sintaxe do Drizzle ORM:** Compreensão da estrutura e dos métodos do Drizzle para a construção de *queries* tipadas e seguras como alternativa ao uso de *queries* SQL puras.
- **Refatoração de Código:** Experiência no processo de atualização de uma base de código existente, adaptando rotas e controladores para uma nova tecnologia de persistência de dados sem quebrar as regras de negócio já estabelecidas.

---

## Dificuldades Encontradas

Durante o desenvolvimento da atualização do backend, a principal dificuldade enfrentada foi:

- **Tradução de Consultas Complexas:** Alguns métodos do sistema utilizavam *queries* SQL com uma alta complexidade. Adaptar e reescrever essas instruções específicas para a sintaxe do Drizzle ORM se mostrou um desafio considerável, exigindo um tempo de estudo e implementação que ultrapassaria o escopo e o prazo do bimestre.

---

## Como as Dificuldades Foram Resolvidas

- **Estratégia de Migração Gradual e Pragmática:** Para garantir a estabilidade do sistema e a entrega no prazo estipulado, optei por manter temporariamente as *queries* mais complexas escritas em SQL puro (raw SQL).
- **Planejamento de Dívida Técnica:** Documentei e isolei esses métodos específicos, deixando a base preparada para que esses ajustes finais de conversão para o Drizzle ORM sejam retomados e concluídos de forma segura durante o próximo bimestre.