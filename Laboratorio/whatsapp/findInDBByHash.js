import axios from 'axios'
export async function findInDBByHash(hash) {
 try {
      const response = await axios.get(
        `http://localhost:3000/usuarios/lid/${hash}`,
      );
      if(!response || response.length ==0){
        throw new Error()
      }

      return response.data.mensagem;
    }catch(error){
        console.error(error.response?.data)
    }

}