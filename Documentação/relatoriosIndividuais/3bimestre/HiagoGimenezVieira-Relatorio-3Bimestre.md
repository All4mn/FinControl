# Relatório Individual — 3º Bimestre

**Nome:** Hiago Gimenez Vieira  
**Projeto:** FinControl  
**Disciplina:** Projeto Integrador

---

## 1. Atividades realizadas

Durante este bimestre, concentrei meus esforços em tentar desenvolver as funcionalidades de **movimentações financeiras (transações)** e realizar ajustes relacionados às **contas**. Foram feitas alterações no código, mas os fluxos não funcionaram como esperado e não consegui concluir a entrega funcional. As atividades tentadas foram:

- Tentativa de desenvolver a tela de transações, com listagem, cadastro e edição de receitas e despesas.
- Tentativa de integrar o formulário de transação com as contas, categorias e métodos disponíveis no sistema.
- Tentativa de incluir busca, filtros por tipo de movimentação e um resumo mensal de entradas e saídas por moeda.
- Alterações nas operações do backend para consultar, criar, editar, arquivar e remover transações; porém, o fluxo completo não funcionou corretamente.
- Tentativa de criar uma área para movimentações arquivadas, com opção de restaurá-las.
- Tentativas de corrigir erros no fluxo de transações, incluindo validação dos campos obrigatórios e melhoria das respostas de erro do backend.
- Tentativa de ajustar o cadastro de contas para validar o saldo inicial, informar falhas e atualizar a listagem após a criação; esse fluxo também não foi concluído com o funcionamento esperado.
- Alteração no fluxo de exclusão ou desativação de usuário para arquivar as contas associadas.

## 2. Principais dificuldades encontradas

As principais dificuldades estiveram relacionadas à integração entre o formulário de movimentações e os dados necessários para registrar cada transação. Foi necessário lidar com a disponibilidade de contas, categorias e métodos, além de garantir que valores e datas fossem enviados em formatos aceitos pelo backend.

Também encontrei dificuldades ao investigar erros no cadastro e na atualização de transações. Em alguns casos, as respostas genéricas da API dificultavam identificar se a falha estava na validação, na requisição ou na persistência dos dados. No fluxo de contas, mesmo após tentar tratar situações como ausência de moedas cadastradas, falha ao atualizar a listagem e validação do saldo inicial, não consegui fazer o cadastro funcionar corretamente de ponta a ponta.

## 3. Tentativas de resolução

Para tentar resolver os problemas, fiz ajustes graduais nos pontos envolvidos:

- Acrescentei validações para campos necessários da movimentação, como conta, valor, descrição e data, incluindo a verificação de que o valor fosse positivo.
- Trabalhei na melhoria do tratamento de erros do backend para diferenciar problemas de validação e indisponibilidade de serviços.
- Ajustei o formulário de contas para exibir estados de carregamento e mensagens de erro, validar o saldo e atualizar os dados exibidos após o cadastro.
- Revisei o carregamento das informações necessárias para as telas e os fluxos de arquivamento e restauração das movimentações.

Apesar dessas tentativas, os erros não foram resolvidos por completo e as funcionalidades não ficaram operando corretamente como esperado.

## 4. Contribuição para o projeto

Minha contribuição neste bimestre consistiu principalmente nas tentativas de implementar e corrigir os fluxos de transações e contas. Embora tenham sido feitas alterações no frontend e no backend, **não deu certo como esperado**: não consegui deixar essas funcionalidades funcionando corretamente de ponta a ponta. Assim, o trabalho não resultou em uma entrega funcional completa, e os problemas permaneceram pendentes.

## 5. Considerações finais

Durante o bimestre, tentei implementar o registro e o acompanhamento de movimentações associadas às contas, além de corrigir os erros encontrados. Apesar das alterações e das tentativas de solução, **não consegui fazer os fluxos funcionarem como deveriam**. Como próximo passo, seria necessário revisar e testar a integração entre frontend, backend e banco de dados para identificar a causa dos problemas e concluir as funcionalidades.
