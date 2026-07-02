import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCarteira = () => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carteiras, setCarteiras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
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
    if (!usuario) return;
    fetchCarteiras();
  }, [usuario]);

  const fetchCarteiras = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/carteiras/usuario/${usuario.id_usuario}`,
        {
          withCredentials: true,
        },
      );
      const carteira = response.data.dados;
      setCarteiras(carteira ? [carteira] : []);
      setError("");
    } catch (err) {
      setCarteiras([]);
      setError(err.response?.data?.mensagem || "Erro ao carregar a carteira.");
    } finally {
      setLoading(false);
    }
  };

  return {
    usuario,
    carregando,
    carteiras,
    loading,
    error,
  };
};
