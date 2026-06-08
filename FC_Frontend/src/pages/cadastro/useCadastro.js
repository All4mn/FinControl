import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validarCadastro, formatarTelefone } from "./CadastroSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useCadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
  };

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: valorFormatado }));
    setErro("");
  };

  const toggleMostrarSenha = () => setMostrarSenha(!mostrarSenha);
  const toggleMostrarConfirmarSenha = () => setMostrarConfirmarSenha(!mostrarConfirmarSenha);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validarCadastro(formData);
    if (validationError) {
      setErro(validationError);
      return;
    }

    setCarregando(true);

    try {
      const dados = {
        nome_usuario: formData.nome,
        email_usuario: formData.email,
        senha_usuario: formData.senha,
        telefone_usuario: formData.telefone.replace(/\D/g, ""),
      };

      await axios.post(`${API_BASE_URL}/usuarios`, dados);
      
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      if (err.response?.status === 409) {
        setErro("Este email já está cadastrado.");
      } else {
        setErro("Erro ao realizar cadastro. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return {
    formData,
    mostrarSenha,
    mostrarConfirmarSenha,
    carregando,
    erro,
    handleChange,
    handleTelefoneChange,
    handleSubmit,
    toggleMostrarSenha,
    toggleMostrarConfirmarSenha,
  };
};
