# Relatório Individual — 3º Bimestre

**Nome:** Mateus Augusto
**Projeto:** FinControl  
**Disciplina:** Projeto Integrador

---

## 1. Atividades realizadas

Durante o bimestre, me dediquei a fazer a integração com o bot do whatsapp, que seria a nosso diferencial. Entretando não cheguei a temrinar a integração por completo, somente estruturei a ideia, repassei o plano para os outros companheiros e enquanto essa documentação esta sendo feita, a integração ainda está em produção. A integração consiste com a biblioteca open source do [whatsapp-web.js](https://wwebjs.dev/), a biblioteca open source do OCR [tesseract.js](https://tesseract.projectnaptha.com/) e a IA do [groq](https://groq.com/)

## 2. Principais dificuldades encontradas

Pensar como o bot identificaria a pessoa que o enviar mensagem e como ele indentificaria tambem o comprovante enviado via OCR, percebemos por tentativa de leitura da OCR que alguns comprovantes talvez não consigam ser lidos pelo OCR escolhido (tesseract) e tambem configurar a IA para a mesma poder fazer a interpretação certa dos dados recebidos pela leitura do tesseract. 

Outra dificuldade seria também registrar a baixa em uma conta específica vinculada ao cliente.

## 3. Tentativas de resolução

- Ao clicar na opção que redirecionaria o cliente ao nosso whatsapp, seria vinculado ao banco de dados na linha do usuário uma hash temporaria que seria copiada para a area de transferencia do mesmo. Ao enviar para o bot, ele procuraria no banco de dados por um usuario com aquela hash e vincularia o lid (um identificador unico do whatsapp-web.js) no lugar da hash temporaria, assim toda mensagem que o usuario enviasse, o bot saberia que aquele usuário é ele pelo lid que ele recebe

- A respeito da resposta da IA, o que eu pensei seria configurar o modo no qual ela deve fazer a interpretação dos dados coletados pelo tesseract e assim retornar em um objeto os valores uteis (quem é, valor, metodo, etc) para que seja enviado em uma rota específica

- Para o registro ser vinculado em uma conta específica, penso que o bot iria saber qual conta estaria vinculada aquele usuario atraves de uma pequena entrevista de configuração do bot

Lembrando que algumas dessas partes ainda não foram implementadas

## 4. Contribuição para o projeto

Além da iniciativa do bot, eu ajudei na divisão de trabalhos inicialmente, levantando quais objetivos deveriamos cumprir nesse bimestre

## 5. Considerações finais

Achei que a implementação do bot foi um dos projetos mais diferentes que eu ja fiz pois envolve integração de diferentes tecnologias para a melhor experiencia do usuario, isso me ajudou a entender o fluxo de pensamento do cliente, como essas tecnologias podem se integrar umas com as outras, me ensinou a ler e se aprofundar na documentação dessas ferramentas e acredito que tais habilidades são úteis para aplicações no mercado de trabalho (automações, bots de responsta ao cliente, etc). Entretanto o fato de que eu não cheguei a completar as metas propostas por mim mesmo me frustra, mas eu tento me consolar pensando que, na reta final do ano acaba não me restando muito tempo por conta dos vestibulares e outros compromissos tanto academicos quanto pessoais