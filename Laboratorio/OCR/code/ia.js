import { Groq } from "groq-sdk/client.js";

import { configDotenv } from "dotenv";

const groq = new Groq({
    apiKey:process.env.API_KEY
})

export const main = async(data)=>{
    const completions = await chatMessage(data)
    console.log(completions.choices[0]?.message?.content || '')
}

export const chatMessage = async(data)=>{
    return groq.chat.completions.create({
        messages:[
            {
                role: 'system',
                content:'voce tem que pegar os dados entregues e interpreta-las para me retornar as seguintes informções: Quem fez a transferencia; qual o valor; Para quem foi feita; A data da transferencia; Tipo da transferencia. ao final gere um sql para inserir esses dados em uma tabela chamada transação '
            },
            {
                role:'user',
                content:data.text

            }
        ],
        model:'openai/gpt-oss-20b'
    })
}