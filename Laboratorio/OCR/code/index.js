import { createWorker } from "tesseract.js";

import { main } from "./ia.js";

const worker = await createWorker('por')

const {data} =  await worker.recognize('./image/andrei.jpeg')

console.log(await main(data))

console.log('texto:', data.text)
console.log('Confiança:', data.confidence);