import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js'

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
client.on('message_create', (msg) => {
    console.log(msg)
    if (msg.body === '!ping') {
        msg.reply('pong');
    }
    if (msg.body === "!ola") {
        msg.reply('vai toma no cu');
    }
});

client.initialize();