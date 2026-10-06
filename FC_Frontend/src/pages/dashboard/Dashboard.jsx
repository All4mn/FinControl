import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./Dashboard.module.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carteira, setCarteira] = useState(null);
  const [carteiraLoading, setCarteiraLoading] = useState(false);

  const formatCurrency = (value, currency) => {
    if (value === null || value === undefined || value === "") return "—";
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "—";

    const currencyOptions = currency
      ? { style: "currency", currency }
      : { style: "decimal" };
    return new Intl.NumberFormat("pt-BR", {
      ...currencyOptions,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        console.log(API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/usuarios/me`, {
          withCredentials: true,
        });

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

  useEffect(() => {
    const fetchCarteira = async () => {
      if (!usuario) return;
      setCarteiraLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/carteiras/usuario/${usuario.id_usuario}`,
          { withCredentials: true },
        );
        setCarteira(response.data.dados);
      } catch (err) {
        console.error("Erro ao carregar carteira:", err);
        setCarteira(null);
      } finally {
        setCarteiraLoading(false);
      }
    };

    fetchCarteira();
  }, [usuario]);

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

  const getCurrencyCode = (nome_moeda) => {
    const name = String(nome_moeda || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (name.includes("euro") || name.includes("eur")) return "EUR";
    if (name.includes("dolar") || name.includes("dollar") || name.includes("usd")) return "USD";
    if (name.includes("real") || name.includes("brl")) return "BRL";
    if (/^[a-z]{3}$/i.test(name.trim())) return name.trim().toUpperCase();
    return null;
  };

  return (
    <div className={styles.dashboard}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <div className={styles.topSection}>
          <div className={styles.introCard}>
            <h1>Olá, {usuario?.nome_usuario}</h1>
            <p>Veja o resumo da sua carteira e seu saldo consolidado.</p>
          </div>
        </div>

        {usuario && (
          <div className={styles.carteiraCard}>
            <div className={styles.carteiraCardHeader}>
              <span className={styles.carteiraTitle}>
                Carteira do {usuario.nome_usuario}
              </span>
            </div>
            <div className={styles.carteiraCardBody}>
              {carteiraLoading ? (
                <p className={styles.carteiraSaldo}>Carregando...</p>
              ) : carteira && carteira.saldo_total !== null && carteira.saldo_total !== undefined ? (
                <div className={styles.carteiraSaldos}>
                  <div className={styles.carteiraSaldoItem}>
                    <span className={styles.carteiraSaldoName}>Saldo da carteira</span>
                    <span className={styles.carteiraSaldoValue}>
                      {formatCurrency(carteira.saldo_total, getCurrencyCode(carteira.saldos?.[0]?.nome_moeda))}
                    </span>
                  </div>
                </div>
              ) : carteira && carteira.saldos?.length ? (
                <>
                  <p className={styles.carteiraLabel}>Saldos por moeda</p>
                  <div className={styles.carteiraSaldos}>
                    {carteira.saldos.map((saldo) => (
                      <div className={styles.carteiraSaldoItem} key={`${saldo.id_moeda}-${saldo.nome_moeda}`}>
                        <span className={styles.carteiraSaldoName}>{saldo.nome_moeda || "Moeda não informada"}</span>
                        <span className={styles.carteiraSaldoValue}>{formatCurrency(saldo.saldo_total, getCurrencyCode(saldo.nome_moeda))}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className={styles.carteiraSaldo}>Nenhuma conta cadastrada</p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
