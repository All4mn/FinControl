import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js'
import { reader } from '../OCR/code/index.js'

import { main } from '../OCR/code/ia.js'

const { Client, LocalAuth } = pkg

const client = new Client({
    authStrategy: new LocalAuth()
})

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// client.on('message', (msg) => {
//     console.log(msg)
//     if (msg.body === '!ping') {
//         msg.reply('pong');
//     }
// });
client.on('message', async(msg) => {
    console.log(`Numero: ${msg.from}
        Mensagem: ${msg.body}
        tipo: ${msg.type}`)
    // console.log(msg.type);
    
    if (msg.body === '!ping') {
        msg.reply('pong');
    }

    try {
        if(msg.type === 'image' && msg.hasMedia){
            msg.reply('foto')
            const media = await msg.downloadMedia()
            // console.log(media);
            
            if(!media){
                msg.reply('não consegui baixar')
            }
            const buffer = Buffer.from(media.data,'base64')

             const resultado = await reader(buffer);
             console.log(resultado)

            const interpret = await main(resultado)
            console.log(interpret)



            
        }else{
            // msg.reply('a mensagem não é uma imagem ou não possui midia')
        }

        
    } catch (error) {
        console.error(error)
    }

    // if (msg.body === "!ola") {
    //     msg.reply('vai toma no cu');
    // }

});

client.initialize();