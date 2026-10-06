import { Groq } from "groq-sdk/client.js";

import dotenv from 'dotenv'

dotenv.config()

// console.log(process.env.API_KEY);


const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY
    //apiKey:'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'
})

export const main = async(data)=>{
    const completions = await chatMessage(data)
    // console.log(completions.choices[0]?.message?.content || '')
    // return completions.choices[0]?.message?.content || ''
    const texto = completions.choices[0]?.message?.content || ''
    return extrairJSON(texto)
}

// limpa do json - n sei se vai dar certo

function extrairJSON(texto) {
    const limpo = texto.replace(/```json|```/g, '').trim()
    try {
        return JSON.parse(limpo)
    } catch {
        console.error('a GROQ não gerou um JSON válido:', texto)
        return null
    }
}

export const chatMessage = async(data)=>{
    console.log('chegou na ia');
    
    return groq.chat.completions.create({
        messages:[
            {
                role: 'system',
                //pedi p IA escrever um textinho mais claro p mandar pro groq
                content: `Você recebe o texto extraído por OCR de um comprovante de transferência Pix.
                Interprete os dados e responda SOMENTE com um JSON válido, sem nenhum texto antes ou depois, neste formato:
                {"pagador": string ou null, "valor": number (ex: 150.75), "recebedor": string ou null, "data": "AAAA-MM-DD" ou null, "tipo": string (ex: "Pix")}
                Se não encontrar algum campo, use null.`


                // content:'voce tem que pegar os dados entregues e interpreta-las para me retornar as seguintes informções: Quem fez a transferencia; qual o valor; Para quem foi feita; A data da transferencia; Tipo da transferencia'
                // content:'me trate igual um rei'
            },
            {
                role:'user',
                content:data
                // content:data

            }
        ],
        model:'openai/gpt-oss-20b'
    })
}

// main('ola')