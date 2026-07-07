# Relatório Individual — 2º Bimestre

**Nome:** Eduardo Lorenzo Novais Cheliga
**Projeto:** FinControl  
**Disciplina:** Projeto Integrador  

---

## 1. Atividades realizadas

Durante este bimestre, dediquei-me expressivamente à implementação, refatoração e estabilização da funcionalidade de **Moeda** no sistema FinControl, além de liderar um esforço focado na **padronização visual e arquitetural do frontend** do projeto. As atividades realizadas incluem:

- **Padronização do Frontend:** Alinhamento estético e estrutural das telas do sistema seguindo a identidade visual unificada do FinControl. Integração completa da página de moedas com os componentes globais reutilizáveis (`HeaderLogged` e `Footer`).
- **Modularização de Componentes:** Refatoração da página principal `CreateMoeda` através da divisão de responsabilidades em subcomponentes atômicos e isolados (`FormMoeda` para o formulário de cadastro e `TableMoeda` para a listagem estruturada).
- **Desenvolvimento de Custom Hooks:** Criação e refinamento do hook customizado `useCreateMoeda.js` para centralizar todo o gerenciamento de estados assíncronos, chamadas de API e regras de negócio do ciclo de vida da entidade.
- **Tratamento de Bugs de Estado e Ciclo de Vida:** Resolução de problemas críticos de concorrência e mutabilidade no React, como a persistência de chaves primárias (`id_moeda`) no estado local após requisições HTTP de atualização (`PUT`), impedindo erros colaterais em exclusões subsequentes.
- **Depuração e Correção de Runtime:** Eliminação de exceções graves que resultavam em quebra de renderização (*telas brancas*), tratando erros de referência (*ReferenceError*) e de reatribuição inadequada de constantes (*TypeError*).

## 2. Conhecimentos adquiridos

Este trabalho permitiu consolidar e aprofundar conhecimentos práticos em:

- **Componentização Avançada no React:** Divisão de telas complexas em componentes funcionais menores, melhorando de forma drástica a legibilidade, testabilidade e reutilização de código.
- **Gerenciamento de Estados Imutáveis:** Manipulação precisa de estados usando o operador *spread* (`...`) no React para atualizar propriedades dinamicamente sem corromper ou perder metadados vitais (como IDs vindos do banco de dados).
- **Consumo Consistente de APIs REST:** Integração síncrona e assíncrona entre o frontend React e o backend Fastify/Node.js utilizando Axios com tratamento robusto de respostas e tratamento amigável de erros.
- **UX Aplicada e Resolução de Erros:** Tradução de falhas técnicas do interpretador JavaScript e retornos de restrições de integridade do banco de dados em comportamentos visuais previsíveis e estáveis para o usuário final.

## 3. Principais dificuldades encontradas

As maiores dificuldades técnicas enfrentadas ao longo do período foram:

- **Instabilidade de Estado pós-Edição:** Rastrear o sumiço silencioso do identificador `id_moeda` no estado local do React após salvar uma edição em linha, o que gerava requisições inválidas para rotas nulas (`DELETE /moedas/undefined`) e disparava bloqueios falsos de chaves estrangeiras no banco.
- **Exceções de Sintaxe e Runtime:** Lidar com comportamentos inesperados do compilador que resultavam em telas brancas devido a falhas sintáticas temporárias no escopo do hook ou passagem inadequada de funções de callback inline para os componentes filhos.
- **Consistência Estética Rigorosa:** Adaptar o formulário e a listagem de moedas para que refletissem de forma exata o mesmo espaçamento, tipografia, efeitos hover e padrões visuais já estabelecidos nos componentes padrão do ecossistema do projeto.

## 4. Como superei as dificuldades

Para superar esses desafios de forma eficiente, adotei as seguintes estratégias:

- **Depuração via DevTools e Console:** Utilização minuciosa do console do navegador e da aba de rede (Network) para inspecionar rigorosamente o formato exato dos payloads recebidos da API e o mapeamento dos objetos no React.
- **Refatoração com Fusão de Estado (State Merging):** Correção da lógica de atualização do estado local, substituindo a substituição direta do objeto por um mapeamento defensivo que combina os dados anteriores preservando os IDs invariantes (`{ ...m, ...data }`).
- **Simplificação de Prop Drilling:** Substituição de arrow functions complexas ou redundantes na passagem de propriedades por referências diretas e limpas das funções do hook para os componentes filho, eliminando erros de reatribuição de constantes (`Assignment to constant variable`).

## 5. Contribuição para o projeto

Minha atuação trouxe impactos diretos e significativos na qualidade técnica e na experiência do usuário do FinControl:

- **Módulo de Moedas Estável:** O sistema agora conta com um fluxo CRUD completo de moedas (Criação, Leitura, Atualização em linha e Exclusão) robusto e sem vazamento de memória ou erros de estado.
- **Frontend Padronizado e Fluido:** A interface visual foi elevada ao padrão profissional estabelecido pela equipe de design, utilizando os mesmos componentes estruturais básicos do projeto, garantindo uma navegação coesa.
- **Código Limpo e Escalável:** A separação entre lógica de dados (Hooks) e renderização visual (Componentes) facilitará a futura manutenção do código e a integração com a entidade central de Contas e Transações.

---

## 6. Considerações finais

Este bimestre representou um marco essencial no amadurecimento técnico sobre arquiteturas fullstack e boas práticas de componentização. A dedicação em resolver problemas profundos de sincronização de estados e a aplicação rigorosa de padrões visuais permitiram entregar uma entrega estável, limpa e alinhada com as metas do Projeto Integrador.

Os próximos passos envolverão a vinculação dinâmica dessas moedas padronizadas no fluxo principal de transações financeiras e na geração de saldos consolidados no dashboard administrativo.