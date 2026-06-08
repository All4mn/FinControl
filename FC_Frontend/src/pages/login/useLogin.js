import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validarLogin } from "./LoginSchema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const useLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
  };

  const toggleMostrarSenha = () => setMostrarSenha(!mostrarSenha);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validarLogin(formData);
    if (validationError) {
      setErro(validationError);
      return;
    }

    setCarregando(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/usuarios/login`,
        {
          email_usuario: formData.email,
          senha_usuario: formData.senha,
        },
        { withCredentials: true }
      );

      console.log("Login realizado:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Email ou senha incorretos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setErro("Não foi possível obter o token do Google.");
      return;
    }

    const idToken = response.credential;

    try {
      setErro("");
      const result = await axios.post(
        `${API_BASE_URL}/usuarios/login-google`,
        { idToken },
        { withCredentials: true }
      );

      if (result.data.sucesso) {
        const { dados: usuario, cadastroIncompleto } = result.data;

        if (cadastroIncompleto) {
          window.sessionStorage.setItem("completarCadastroUsuario", JSON.stringify(usuario));
          navigate("/completar-cadastro", { state: { usuario, fromGoogle: true } });
        } else {
          navigate("/dashboard");
        }
      } else {
        setErro(result.data.mensagem || "Erro no login com Google.");
      }
    } catch (err) {
      console.error("Erro no login com Google:", err);
      setErro(err.response?.data?.mensagem || "Erro ao fazer login com Google. Tente novamente.");
    }
  };

  return {
    formData,
    mostrarSenha,
    carregando,
    erro,
    setErro,
    handleChange,
    handleSubmit,
    toggleMostrarSenha,
    handleGoogleCredentialResponse,
  };
};
