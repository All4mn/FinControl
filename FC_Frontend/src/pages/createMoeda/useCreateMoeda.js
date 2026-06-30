import { useState } from "react";
import axios from "axios";
import { validarCreateMoeda } from "./CreateMoedaSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCreateMoeda = () => {
  const [formData, setFormData] = useState({
    nome_moeda: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSucesso("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação vinda do Schema
    const errorMsg = validarCreateMoeda(formData);
    if (errorMsg) return setError(errorMsg);

    setLoading(true);
    setError("");
    setSucesso("");

    try {
      const payload = {
        nome_moeda: formData.nome_moeda.trim(),
      };

      await axios.post(`${API_BASE_URL}/moedas`, payload, { withCredentials: true });

      // Permanece na mesma página: limpa o formulário e exibe feedback de sucesso
      setFormData({ nome_moeda: "" });
      setSucesso("Moeda criada com sucesso!");
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro ao criar moeda.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, sucesso, handleChange, handleSubmit };
};