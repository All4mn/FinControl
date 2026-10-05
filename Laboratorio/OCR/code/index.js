import { createWorker } from "tesseract.js";

import { main } from "./ia.js";

const worker = await createWorker('por')

// const {data} =  await worker.recognize('./image/andrei.jpeg')

export async function reader(pic){
    console.log('chegou aqui');
    
    const {data} = await worker.recognize(pic)
    return data.text
} 

// console.log(await reader())

// console.log('texto:', data.text)
// console.log('Confiança:', data.confidence);