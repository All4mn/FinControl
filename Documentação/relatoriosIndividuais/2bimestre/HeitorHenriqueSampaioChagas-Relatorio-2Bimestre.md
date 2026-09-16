# Relatório Individual — Projeto Integrador

**Disciplina:** Projeto Integrador  
**Curso:** Técnico Integrado para a Internet — UTFPR-CM  
**Integrante:** Heitor Henrique Sampaio Chagas  
**Projeto:** FinControl — Sistema de Controle Financeiro Pessoal  
**Equipe:** Money Control  
**Bimestre:** 2º Bimestre — 2026

---

## Atividades Realizadas

Neste bimestre a equipe dividiu o trabalho por CRUDs, cada integrante ficando responsável por implementar uma entidade completa no backend e no frontend. Fiquei responsável pelo CRUD de **status_usuario**.

Implementei a funcionalidade de ponta a ponta: criação da lógica no backend (model, controller e rotas) e a interface correspondente no frontend, permitindo criar, listar, editar e excluir os status de usuário no sistema.

Além do CRUD, mexi diretamente no banco de dados para corrigir problemas na tabela `status_usuario`, o que envolveu ajustar a estrutura e popular os dados para permitir testes reais da funcionalidade.

---

## Conhecimentos Adquiridos

Implementar o CRUD completo sozinho, do banco até a tela, consolidou o entendimento de como as camadas do sistema se conectam na prática — antes eu enxergava backend e frontend de forma mais isolada, lendo o código de outras pessoas; dessa vez precisei fazer as duas pontas se comunicarem corretamente.

Aprendi também sobre a diferença entre `INT` e `SERIAL` no PostgreSQL. Eu tinha implementado o campo `id` como `INT` comum, o que exigia calcular manualmente o próximo valor (tamanho da lista + 1) toda vez que um novo status era criado. O Mateus sugeriu usar `SERIAL`, que resolve isso automaticamente no próprio banco — entendi na prática por que colunas de identificador quase sempre devem usar tipos autoincrementáveis em vez de lógica manual na aplicação.

Outro aprendizado importante veio da refatoração do frontend. Inicialmente escrevi a tela inteira como um componente único, misturando formulário, listagem e lógica de estado. Precisei fragmentar isso em componentes menores e mais focados, o que deixou o código mais legível e me fez entender na prática o motivo de se componentizar interfaces React em vez de concentrar tudo em um arquivo.

---

## Dificuldades Encontradas

A primeira dificuldade foi um erro recorrente de referência ao banco: minha implementação estava chamando o nome errado de tabela e de coluna em algumas consultas. Esse tipo de erro é traiçoeiro porque o sistema não indica exatamente qual nome está incorreto — só falha na execução — então localizar exatamente onde a nomenclatura divergia do schema real do banco exigiu revisão cuidadosa junto com o Mateus.

A segunda dificuldade foi estrutural: eu havia implementado toda a tela de `status_usuario` como um único componente no frontend, sem separação de responsabilidades. Isso dificultava tanto a leitura quanto futuras alterações.

A terceira foi o uso incorreto do tipo `INT` para o campo `id`, calculando o próximo valor manualmente a partir do tamanho da lista — uma abordagem frágil, que quebraria facilmente em casos de exclusão de registros ou uso concorrente.

---

## Como as Dificuldades Foram Resolvidas

O erro de nomes de tabela e coluna foi corrigido comparando minha implementação com o schema real do banco no DBeaver, com apoio direto do Mateus, que apontou onde exatamente as referências estavam divergentes.

A fragmentação do frontend foi feita reestruturando a tela original em componentes menores, cada um responsável por uma parte específica da interface (formulário, listagem, itens individuais), seguindo o padrão já usado pelo resto da equipe no restante do sistema.

O problema do `id` como `INT` foi resolvido alterando a coluna para `SERIAL` no banco de dados, eliminando a necessidade de calcular o próximo valor manualmente na aplicação — o próprio PostgreSQL passou a gerenciar a geração dos identificadores.
