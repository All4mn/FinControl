import axios from 'axios'
import { error } from 'qrcode-terminal'

export async function InsertDB(lid,hash){
    console.log(lid,hash)
    try {
        const response = await axios.put(`http://localhost:3000/usuarios/update/${encodeURIComponent(lid)}/${encodeURIComponent(hash)}`,{})
        if(!response || response.length == 0) throw new Error('não foi possivel substituir hash pelo lid')
        return response.data.dados 
    } catch (error) {
        console.error(error.response?.data)
    }
    
    // return 'bunda'
}