import { useState } from "react";
import axios from "axios";
import { validarCarteiraHasConta } from "./CarteiraHasContaSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCarteiraHasConta = () => {
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

    const errorMsg = validarCarteiraHasConta(formData);
    if (errorMsg) {
      setError(errorMsg);
      return false;
    }

    setLoading(true);
    try {
      const payload = {
        id_carteira: Number(formData.id_carteira),
        id_conta: Number(formData.id_conta),
      };

      await axios.post(`${API_BASE_URL}/carteira-has-conta`, payload, {
        withCredentials: true,
      });

      setFormData({ id_carteira: "", id_conta: "" });
      setError("");
      return true;
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao vincular carteira e conta.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, handleChange, handleSubmit };
};