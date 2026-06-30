import React from 'react'
import axios from "axios";
import { useState,useEffect } from 'react'
import styles from './Conta.module.css'
import Header from '../../components/componentesPadrao/headerLogged/HeaderLogged.jsx'
import Footer from '../../components/componentesPadrao/footer/Footer'

import TableConta from '../../components/componentesPadrao/tableConta/TableConta.jsx'
const Conta = () => {
    
      const API_BASE_URL = 
      // "http://localhost:3000"
        import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";
      const [usuario, setUsuario] = useState(null);
      const [carregando, setCarregando] = useState(true);
      const [conta, setConta] = React.useState(null)
    
      useEffect(() => {
        const fetchUsuario = async () => {
          try {
            console.log(API_BASE_URL);
            const response = await axios.get(`${API_BASE_URL}/usuarios/me`, {
              withCredentials: true,
            });
            console.log(response)
    
            if (response.data.sucesso) {
              setUsuario(response.data.dados);
            } else {
              window.location.href = "/login";
            }
          } catch (err) {
            console.error("Erro ao carregar usuário:", err);
            window.location.href = "/login";
          } finally {
            setCarregando(false);
          }
        };
    
        fetchUsuario();
      }, []);

      useEffect(()=>{
        fetchConta()
      },[usuario])

      const fetchConta = async()=>{
        try {
          // const response = await axios.get(`${API_BASE_URL}/contas/search/${usuario.id_usuario}`)
          const response = await axios.get(`http://localhost:3000/contas/search/${usuario.id_usuario}`)
          if(!response){
            throw new Error("falha em buscar conta")
          }
          
          setConta(response.data.dados)
          console.log(conta);
          
        } catch (error) {
          console.error(error);
          
        }
      }
    
      if (carregando) {
        return (
          <div className={styles.dashboard}>
            <Header usuario={null} logado={true} />
            <main className={styles.main}>
              <p>Carregando informações do usuário...</p>
            </main>
            <Footer />
          </div>
        );
      }
  return (
    <div>
        <Header usuario={usuario} logado={true}/>
        <main className={styles.conta_window}>
          <TableConta
          conta={conta}
          />
          {/* <button onClick={()=>console.log(usuario)}>buscar usuario</button> */}
          <button>Criar conta</button>
        </main>
        <Footer/>
    </div>
  )
}

export default Conta