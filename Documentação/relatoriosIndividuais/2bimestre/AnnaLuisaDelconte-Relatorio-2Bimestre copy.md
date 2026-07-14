# Relatório Individual — Projeto Integrador (2° Bimestre)

*Disciplina:* Projeto Integrador  
*Curso:* Técnico Integrado em Informática — UTFPR-CM  
*Integrante:* Anna Luísa Delconte da Costa Ferreira  
*Projeto:* FinControl — Sistema de Controle Financeiro Pessoal  
*Equipe:* Money Control  
*Data:* 14 julho de 2026

---

## Atividades Realizadas

Durante este segundo bimestre, minhas atividades técnicas concentraram-se no desenvolvimento completo do CRUD da tabela CarteiraHasConta, que desempenha o papel de relacionar duas outras entidades cruciais do sistema: Carteiras e Contas. No planejamento dessa tabela, tomei a decisão arquitetural de não implementar o soft delete (exclusão lógica). Como a exclusão de um vínculo entre carteira e conta não resulta na perda definitiva de dados das entidades principais, mas sim no rompimento de uma associação, a remoção física direta foi a abordagem mais adequada e limpa para o banco de dados na minha opinião.

Além disso, iniciamos o planejamento e a preparação para as futuras telas de administrador que serão desenvolvidas ao longo do terceiro bimestre. Com o objetivo de manter a identidade visual do sistema coesa, trabalhei em conjunto com o Eduardo para padronizar os estilos CSS que darão base a essas novas interfaces.

---

## Conhecimentos Adquiridos

No aspecto de desenvolvimento, o grande ganho deste bimestre foi a experiência prática de implementar um fluxo de CRUD de ponta a ponta, integrando completamente o back-end e o front-end. Embora já tivesse trabalhado com conceitos semelhantes antes no meu estágio, por exemplo, consolidar esse ciclo completo — seguindo padrões de código para que toda a equipe pudesse compreender e estruturando as requisições em múltiplos arquivos do front-end — representou um processo muito gratificante para mim. No último bimestre eu não havia mexido no backend e gostei muito de ter essa oportunidade agora, até porque o professor comentou no começo do ano sobre o “giro” de responsabilidades de cada um.

Outro aprendizado importante ocorreu na área de automação: com a ajuda do Mateus, aprendi a estruturar e criar scripts automatizados em formato de arquivo .sh (Shell Script), baseando-me nos modelos que ele já havia desenvolvido para o nosso projeto, o que foi muito legal de aprender e com certeza vai contribuir para meus futuros projetos.

No âmbito pessoal, continuei a aprimorar minhas habilidades de trabalho eficiente em equipe, entendendo que o desenvolvimento de software de qualidade está diretamente atrelado ao alinhamento técnico entre os membros.

---

## Dificuldades Encontradas

O maior desafio enfrentado neste período esteve relacionado à comunicação interna e à habilidade do grupo de escutar e compreender as necessidades mútuas de forma empática. 

Gerenciar um fluxo de trabalho com um grupo composto por oito pessoas provou ser uma tarefa complexa. Manter todos os integrantes cientes, alinhados e confortáveis com as decisões tomadas em tempo integral é um desafio constante não só para mim, mas para toda a equipe. Como consequência dessa barreira comunicativa, surgiram momentos de descontentamento com escolhas técnicas, questionamentos frequentes e, em contrapartida, cenários onde alguns membros participavam menos ativamente das discussões, o que acabou gerando desgastes na dinâmica e no vínculo da equipe.

---

## Como as Dificuldades Foram Resolvidas

Para contornar as dificuldades de comunicação e reduzir os atritos na equipe, busquei atuar de forma mais ativa na mediação dos diálogos, incentivando canais onde todos pudessem expressar suas opiniões antes que decisões críticas fossem tomadas. O esforço concentrou-se em trazer os integrantes mais reservados para o debate e tentar traduzir as necessidades individuais de cada setor do projeto para os demais membros.

No lado técnico, a tomada de decisão sobre a tabela CarteiraHasConta e a estruturação do script .sh foram solucionadas por meio de debates técnicos diretos com o Eduardo e o Mateus. Essa troca de conhecimentos e o alinhamento de padrões prévios ajudaram a mitigar erros de integração e garantiram que o código final estivesse limpo e compreensível para todos.