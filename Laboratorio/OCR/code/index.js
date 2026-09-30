import { createWorker } from "tesseract.js";

import { main } from "./ia.js";

const worker = await createWorker('por')

const {data} =  await worker.recognize('./image/comprovante.jpeg')

main(data)

// console.log('texto:', data.text)
// console.log('Confiança:', data.confidence);