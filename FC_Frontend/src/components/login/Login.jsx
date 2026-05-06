import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Seguindo estritamente o padrão de POST solicitado
  const fazerLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !senha) {
      alert("Os campos 'Email' e 'Senha' são obrigatórios.");
      return;
    }

    console.log(`
      Email: ${email}
      Senha: ${senha}
    `);

    try {
      // Usando uma rota hipotética de login baseada no seu padrão de API
      const response = await axios.post("http://localhost:3000/usuarios/login", { 
        email_usuario: email, 
        senha_usuario: senha 
      });
      console.log("Login realizado com sucesso", response.data);
      // Aqui entraria a lógica de salvar token/redirecionar
    } catch (err) {
      console.log("Deu erro no envio do login: ", err);
    }
  };

  // Padrão de POST para o Login com Google (conforme sua documentação de API)
  const loginComGoogle = async () => {
    const mockIdToken = "SEU_ID_TOKEN_GOOGLE_AQUI"; // Isso viria do SDK do Google

    console.log(`Tentando login com Google, Token: ${mockIdToken}`);

    try {
      const response = await axios.post("http://localhost:3000/usuarios/login-google", { 
        idToken: mockIdToken 
      });
      console.log("Login com Google realizado", response.data);
    } catch (err) {
      console.log("Deu erro no envio do login com Google: ", err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Cabeçalho com Degradê Verde */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          {/* Ícone de Porquinho Simples em SVG */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <span className={styles.logoText}>FinControl</span>
        </div>
        <button className={styles.btnCadastro}>Cadastre-se</button>
      </header>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Faça seu Login</h1>
          
          <form onSubmit={fazerLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input 
                type="email" 
                placeholder="Email" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input 
                type="password" 
                placeholder="Senha" 
                className={styles.input}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <a href="/esqueci-senha" className={styles.forgotPassword}>
              Esqueci minha senha
            </a>

            <button type="submit" className={styles.btnEntrar}>
              Entrar
            </button>
          </form>
        </div>

        <button onClick={loginComGoogle} className={styles.btnGoogle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className={styles.googleText}>Login com o Google</span>
        </button>
      </main>

      {/* Ícone de Acessibilidade Flutuante */}
      <div className={styles.accessibilityWrapper}>
        <div className={styles.accessibilityIcon}>
           {/* Ícone representativo de Libras/Acessibilidade */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9.5 11.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
           </svg>
        </div>
      </div>

      {/* Rodapé Padrão */}
      <footer className={styles.footer}>
        <div className={styles.footerItem}>
          <span>📞 (44) 9 0000-0000</span>
        </div>
        <div className={styles.footerItem}>
          <span>✉️ fincontrol.contato@gmail.com</span>
        </div>
        <div className={styles.footerItem}>
          <span>📸 @FinControlLTDA</span>
        </div>
      </footer>
    </div>
  );
};

export default Login;