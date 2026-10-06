import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js'
import { reader } from '../OCR/code/index.js'

import { main } from '../OCR/code/ia.js'
import { buscarUsuarioPorTelefone, registrarLancamento } from './db.js';

const { Client, LocalAuth } = pkg

const client = new Client({
    authStrategy: new LocalAuth()
})

const dadosPendentes = new Map();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.on('message', async(msg) => {
    if(msg.fromMe || msg.from.endsWith('@g.us') || msg.from === 'status@broadcast') return;

    //telefone tentativa d capturar

    const contatoUsuario = await client.getContact();
    const telefoneUsuario = contatoUsuario.number;


    console.log(`Numero: ${telefoneUsuario}
        Mensagem: ${msg.body}
        Tipo: ${msg.type}`);

        // Número de Telefone: ${client.info.wid.user}
        // console.log(msg.type);


    if (msg.body === '!ping') {
        msg.reply('pong');
    }

    try {
        
        const pendente = dadosPendentes.get(telefone)
        if (pendente && msg.type === 'chat') {
            const resposta = msg.body.trim().toLowerCase()
 
            if (['1', '2'].includes(resposta)) {
                const tipo = resposta === '1' ? 'despesa' : 'receita'
                await registrarLancamento(pendente.usuarioId, { ...pendente.dados, tipo })
                dadosPendentes.delete(telefone)
                return msg.reply(`✅ ${tipo} lançada com sucesso!`)
            }
 
            if (['não', 'nao', 'n'].includes(resposta)) {
                dadosPendentes.delete(telefone)
                return msg.reply('Ok, operação cancelada. Pode enviar outro comprovante quando quiser.')
            }
            
        }
 
       
        if (msg.type === 'image' && msg.hasMedia) {
            
            const usuario = await buscarUsuarioPorTelefone(telefone)
            if (!usuario) {
                return msg.reply('Não foi encontrado seu número cadastrado na plataforma. Confira o telefone no seu cadastro.')
            }
 
            msg.reply('Comprovante recebido, processando...')
            const media = await msg.downloadMedia()
 
            if (!media) {
                return msg.reply('não consegui baixar')
            }
            const buffer = Buffer.from(media.data, 'base64')
 
            const resultado = await reader(buffer);
            console.log(resultado)
 
            const dados = await main(resultado)  
            console.log(dados)
 
            if (!dados || typeof dados.valor !== 'number') {
                return msg.reply('Não foi possível extrair os dados do comprovante. Por favor, envie outro comprovante ou verifique se a imagem está legível.')
            }
 
            dadosPendentes.set(telefone, { usuarioId: usuario.id, dados })
 
            return msg.reply(
            `Confirme os dados:
            💰 Valor: R$ ${dados.valor.toFixed(2)}
            👤 De: ${dados.pagador ?? '—'}
            ➡️ Para: ${dados.recebedor ?? '—'}
            📅 Data: ${dados.data ?? '—'}
            🔖 Tipo: ${dados.tipo ?? '—'}
            
            Responda:
            *1* para lançar como DESPESA (gasto)
            *2* para lançar como RECEITA (recebimento)
            *não* para cancelar`)
        }
 
        
 
    } catch (error) {
        console.error(error)
        msg.reply('Ocorreu um erro ao processar sua mensagem.')
    }
});

client.initialize();