import { Groq } from "groq-sdk/client.js";

import dotenv from 'dotenv'

dotenv.config()

// console.log(process.env.API_KEY);


const groq = new Groq({
    // apiKey:process.env.API_KEY
    apiKey:'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'
})

export const main = async(data)=>{
    const completions = await chatMessage(data)
    // console.log(completions.choices[0]?.message?.content || '')
    return completions.choices[0]?.message?.content || ''
}

export const chatMessage = async(data)=>{
    console.log('chegou na ia');
    
    return groq.chat.completions.create({
        messages:[
            {
                role: 'system',
                content:'voce tem que pegar os dados entregues e interpreta-las para me retornar as seguintes informções: Quem fez a transferencia; qual o valor; Para quem foi feita; A data da transferencia; Tipo da transferencia'
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