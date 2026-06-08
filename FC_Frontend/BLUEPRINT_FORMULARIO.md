# Blueprint: Módulo de Formulário e Autenticação Genérico

Este documento define o padrão arquitetural para a criação de novas telas de formulário, fluxos de autenticação ou páginas de entrada de dados no projeto **FinControl**. 

O objetivo é separar a **Lógica (Hook)**, a **Validação (Schema)** e a **Visualização (Componente)**.

---

## 1. Estrutura de Arquivos Recomendada

Sempre que criar uma nova entidade (ex: `Produto`, `Configuracao`), utilize a seguinte estrutura de pasta dentro de `src/pages/`:

```text
src/pages/[NomeDaEntidade]/
├── [NomeDaEntidade].jsx          # Interface Visual (JSX)
├── [NomeDaEntidade].module.css   # Estilos escopados
├── use[NomeDaEntidade].js        # Lógica, Estado e API (Custom Hook)
└── [NomeDaEntidade]Schema.js     # Regras de validação e formatação
```

---

## 2. Modelos de Código

### A. O Custom Hook (`use[NomeDaEntidade].js`)
Responsável por gerenciar o `useState`, lidar com eventos de input e chamadas ao Axios.

```javascript
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validar[NomeDaEntidade] } from "./[NomeDaEntidade]Schema";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const use[NomeDaEntidade] = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    [Campo1]: "",
    [Campo2]: "",
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
    const errorMsg = validar[NomeDaEntidade](formData);
    if (errorMsg) return setError(errorMsg);

    setLoading(true);
    try {
      const payload = {
        api_campo1: formData.[Campo1],
        api_campo2: formData.[Campo2],
      };

      await axios.post(`${API_BASE_URL}/[endpoint]`, payload, { withCredentials: true });
      navigate("/[rota_sucesso]");
    } catch (err) {
      setError(err.response?.data?.mensagem || "Erro na operação.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, error, handleChange, handleSubmit };
};
```

### B. O Schema de Validação (`[NomeDaEntidade]Schema.js`)
Centraliza as regras de negócio para manter o componente e o hook limpos.

```javascript
export const validar[NomeDaEntidade] = (data) => {
  if (!data.[Campo1]?.trim()) return "Campo 1 é obrigatório.";
  
  // Exemplo de Regex
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "E-mail inválido.";
  }

  return null; // Retorna null se estiver tudo ok
};

export const formatarEntrada = (valor) => {
  return valor.toUpperCase(); // Exemplo de formatador
};
```

### C. O Componente de Página (`[NomeDaEntidade].jsx`)
Focado apenas na estrutura do DOM e aplicação das classes CSS.

```jsx
import React from "react";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./[NomeDaEntidade].module.css";
import { use[NomeDaEntidade] } from "./use[NomeDaEntidade]";

export default function [NomeDaEntidade]() {
  const { formData, loading, error, handleChange, handleSubmit } = use[NomeDaEntidade]();

  return (
    <div className={styles.page}>
      <Header logado={false} />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>[Título]</h1>
          {error && <div className={styles.erro}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <input 
              name="[Campo1]" 
              value={formData.[Campo1]} 
              onChange={handleChange} 
              className={styles.input} 
            />
            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Processando..." : "Enviar"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

---

## 3. Checklist de Adaptação

1.  **Chaves do Estado:** Garanta que o `name` do `<input>` seja idêntico à chave no `formData`.
2.  **Mapping de API:** No `handleSubmit`, ajuste o `payload` para os nomes de campos esperados pelo Backend.
3.  **Endpoint:** Atualize a URL no `axios.post/get`.
4.  **Feedback:** Use o estado `loading` para desabilitar botões e mostrar spinners.
5.  **Estilos:** O arquivo `.module.css` deve conter as classes base `.page`, `.main` e `.card` para manter a consistência visual com Login/Cadastro.
