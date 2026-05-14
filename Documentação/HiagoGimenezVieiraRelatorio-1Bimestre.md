# Relatório Individual — Projeto Integrador

**Disciplina:** Projeto Integrador  
**Curso:** Técnico Integrado em Informática — UTFPR-CM  
**Integrante:** Hiago Gimenez Vieira  
**Projeto:** FinControl — Sistema de Controle Financeiro Pessoal  
**Equipe:** Money Control  
**Data:** maio de 2026

---

## Atividades Realizadas

Minha atuação no projeto foi principalmente focada na infraestrutura e configuração do ambiente, especificamente na criação e gerenciamento da camada de banco de dados do sistema. Desenvolvi o script shell (`setup.sh`) que automatiza a configuração e execução inicial do projeto, aprendendo a escrever scripts shell do zero e entendendo como integrar múltiplas tecnologias através de um arquivo de inicialização centralizado.

Trabalhei na implementação do banco de dados PostgreSQL utilizando a plataforma Neon, que oferece um serviço de banco de dados em nuvem. Após enfrentar dificuldades iniciais com a containerização via Docker, mudei para o Neon como solução mais viável para o projeto, o que envolveu configurar a conexão remota e integrar as credenciais no ambiente.

Além disso, participei ativamente da criação da estrutura completa do banco de dados junto com a equipe. Utilizando o DBeaver como ferramenta de gerenciamento, colaborei na criação de todas as tabelas do sistema — usuarios, categorias, contas, metodos, transacoes e logs — definindo os schemas, relacionamentos, tipos de dados e constraints apropriados para cada entidade do FinControl.

---

## Conhecimentos Adquiridos

O projeto me proporcionou um aprendizado significativo em scripting shell e automação. Compreendi como criar scripts que executam múltiplos comandos em sequência, tratam variáveis de ambiente e conseguem orquestrar a inicialização de aplicações complexas com múltiplos componentes (frontend, backend e banco de dados).

Adquiri também conhecimento prático sobre infraestrutura em nuvem ao trabalhar com o Neon. Entendi como um banco de dados gerenciado funciona, como configurar credenciais de acesso seguro, e como conectar uma aplicação local a um banco de dados remoto via string de conexão. Essa experiência me deu uma perspectiva concreta sobre alternativas ao Docker para ambientes de desenvolvimento.

Aprofundei bastante meu conhecimento em design de banco de dados durante a criação das tabelas. Aprendeu na prática sobre tipos de dados apropriados (VARCHAR, BOOLEAN, TIMESTAMP, etc.), como estruturar relacionamentos entre tabelas, a importância de definir chaves primárias e estrangeiras, e como usar constraints para garantir a integridade dos dados. O uso do DBeaver como ferramenta visual facilitou muito esse aprendizado, permitindo visualizar os relacionamentos e testar queries.

---

## Dificuldades Encontradas

A principal dificuldade foi a containerização com Docker durante as primeiras tentativas de configurar o ambiente. As questões envolviam tanto a configuração dos containers quanto a comunicação entre eles (frontend, backend e banco de dados), o que se mostrou mais complexo do que o inicialmente previsto.

Outra dificuldade foi garantir que o script shell `setup.sh` funcionasse corretamente em todos os cenários e máquinas diferentes, considerando variáveis de ambiente, permissões de arquivo e sequência de execução dos comandos.

Além disso, estruturar o banco de dados de forma adequada, considerando os relacionamentos entre as entidades e as necessidades específicas do sistema FinControl, exigiu compreensão profunda dos requisitos do projeto e da arquitetura da aplicação.

---

## Como as Dificuldades Foram Resolvidas

Diante dos desafios com Docker, a equipe e eu decidimos adotar o Neon como solução alternativa para o banco de dados em nuvem. Isso simplificou significativamente a configuração inicial, permitindo que nos concentrássemos nas outras partes do projeto sem ficar presos em problemas de containerização. Essa decisão provou ser acertada, resultando em um ambiente de desenvolvimento mais ágil.

Para o script shell, utilizei a prática de testes iterativos — executando o script múltiplas vezes, adicionando validações e tratamento de erros conforme os problemas apareciam. Documentei cada etapa para que outros membros da equipe conseguissem entender e manter o script no futuro.

Na construção do banco de dados, trabalhei em colaboração com os demais integrantes e utilizei o DBeaver extensivamente para visualizar os schemas, testar relacionamentos e garantir que tudo estava funcionando conforme esperado. Consultei a documentação técnica do projeto e as historinhas de usuário para garantir que as tabelas refletiam adequadamente as necessidades do sistema.
