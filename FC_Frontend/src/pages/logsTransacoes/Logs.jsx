import React from "react";
import axios from "axios";
import Header from "../../components/componentesPadrao/headerLogged/headerLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./Logs.module.css";
import TableLog from "../../components/componentesPadrao/tableLog/TableLog.jsx";
import { useEffect } from "react";

const API_BASE_URL =
  // import.meta.env.VITE_BACKEND_RENDER_URL ||
   "http://localhost:3000";

const Logs = () => {
  const [log, setLog] = React.useState([]);

  useEffect(() => {
    fetchLogs()
  }, []);

  const fetchLogs = async () => {
    try {
      console.log(API_BASE_URL);
      const response = await axios.get(`${API_BASE_URL}/logs/filter`, {
        withCredentials: true,
      });
      console.log(response.data.dados);
      setLog(response.data.dados);

      if (!response.data) {
        throw new Error("Erro ao carregar logs");
      }
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    }
  }

  return (
    <div className={styles.fullWindow}>
      <Header logado={true} />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Logs</h1>
        </div>
        <section>
          <TableLog 
          logs={log}
          />
        </section>

        <button onClick={()=>console.log(log.dados)}>visualizar log</button>
      </div>
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default Logs;
