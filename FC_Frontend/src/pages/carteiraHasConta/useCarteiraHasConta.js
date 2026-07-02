import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validarCarteiraHasConta } from "./CarteiraHasContaSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCarteiraHasConta = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_carteira: "",
    id_conta: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação vinda do Schema
    const errorMsg = validarCarteiraHasConta(formData);
    if (errorMsg) return setError(errorMsg);

    setLoading(true);
    try {
      const payload = {
        id_carteira: Number(formData.id_carteira),
        id_conta: Number(formData.id_conta),
      };

      await axios.post(`${API_BASE_URL}/carteira-has-conta`, payload, { withCredentials: true });
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao vincular carteira e conta.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, handleChange, handleSubmit };
};