import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import { reader } from "../OCR/code/index.js";

import { main } from "../OCR/code/ia.js";

import { InsertDB } from "./insertDB.js";
import { findInDBByHash } from "./findInDBByHash.js";
import axios from "axios";
import { AsyncLocalStorage } from "async_hooks";
import { error } from "console";

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
});

const now = new Date();
console.log(now);

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// client.on('message', (msg) => {
//     console.log(msg)
//     if (msg.body === '!ping') {
//         msg.reply('pong');
//     }
// });
// client.on('message', async(msg) => {
//     console.log(`Numero: ${msg.from}
//         Mensagem: ${msg.body}
//         tipo: ${msg.type}`)
//     // console.log(msg.type);

//     if (msg.body === '!ping') {
//         msg.reply('pong');
//     }

//     try {
//         if(msg.type === 'image' && msg.hasMedia){
//             msg.reply('foto')
//             const media = await msg.downloadMedia()
//             // console.log(media);

//             if(!media){
//                 msg.reply('não consegui baixar')
//             }
//             const buffer = Buffer.from(media.data,'base64')

//              const resultado = await reader(buffer);
//              console.log(resultado)

//             const interpret = await main(resultado)
//             console.log(interpret)

//         }else{
//             // msg.reply('a mensagem não é uma imagem ou não possui midia')
//         }

//     } catch (error) {
//         console.error(error)
//     }

//     // if (msg.body === "!ola") {
//     //     msg.reply('vai toma no cu');
//     // }

// });

client.on("message_create", async (msg) => {
  if (msg.type === "e2e_notification") return;

  if (msg.fromMe) {
    console.log("eu que falei");
    // console.log(msg._data);

    // return
  }
  console.log(`remetente: ${msg.from}
        destino: ${msg.to}
        conteudo: ${msg.body}
        tempo: ${msg.timestamp}`);
  if (msg.body.startsWith("!")) {
    const hash = msg.body.slice(1).trim();
    const lid = msg.from.replace('@lid','')
    const respostaCurta = await findInDBByHash(hash);
    // console.log(respostaCurta);
    msg.reply(
      `Ola! ${respostaCurta.nomeUsuario}, seu telefone é o ${respostaCurta.telefoneUsuario} e seu email é o ${respostaCurta.emailUsuario}, e o seu token lid é o ${respostaCurta.lid} e será trocado por ${msg.from}`,
    );
    console.log(lid, hash)
    await InsertDB(lid,hash)
    

    //   msg.reply(hash);
  }

  if (msg.body == "!lid") {
    msg.reply(msg.to);
  }
  if (msg.body == "!catch") {
    const response = await axios.get(`http://localhost:3000/usuarios`);
    console.log(response.data);
    if (!response || response.length == 0) {
      throw new Error("Não foi possivel captar a response");
    }

    msg.reply(JSON.stringify(response.data.dados[0]));
  }

  // if(msg.body == '!axios'){
  //     const response = await axios.get(`http://localhost:3000/usuarios/lid/${msg.to}`)

  //     console.log(response.data);

  // }
});

client.initialize();
