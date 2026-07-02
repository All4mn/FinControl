
import { useState } from "react";
import axios from "axios";
import { validarCreateMoeda } from "./CreateMoedaSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCreateMoeda = () => {
  const [formData, setFormData] = useState({
    nome_moeda: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
    setSucesso("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validarCreateMoeda(formData);
    if (errorMsg) return setErro(errorMsg);

    setCarregando(true);

    try {
      const payload = {
        nome_moeda: formData.nome_moeda.trim(),
      };

      await axios.post(`${API_BASE_URL}/moedas`, payload, { withCredentials: true });
      setFormData({ nome_moeda: "" });
      setSucesso("Moeda criada com sucesso!");
    } catch (err) {
      console.error("Erro ao criar moeda:", err);

      if (err.response?.status === 409) {
        setErro("Já existe uma moeda com esse nome.");
      } else {
        setErro(err.response?.data?.mensagem || "Erro ao criar moeda.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return { formData, carregando, erro, sucesso, handleChange, handleSubmit };
};