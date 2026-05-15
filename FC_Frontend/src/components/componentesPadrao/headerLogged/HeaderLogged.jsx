import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './HeaderLogged.module.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || 'http://localhost:3000';

export default function Header({ usuario, logado = false }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const toggleBusca = () => setBuscaAberta(!buscaAberta);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/usuarios/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error('Erro ao sair:', err);
    } finally {
      navigate('/login');
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Início', icon: 'home' },
    { href: '/dashboard/relatorios', label: 'Relatórios', icon: 'chart' },
    { href: '/dashboard/arquivados', label: 'Arquivados', icon: 'archive' },
    { href: '/dashboard/conta', label: 'Nova Conta', icon: 'plus' },
  ];

  const renderIcon = (icon) => {
    switch (icon) {
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        );
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        );
      case 'archive':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="5" x="2" y="3" rx="1" />
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
            <path d="M10 12h4" />
          </svg>
        );
      case 'plus':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={logado ? '/dashboard' : '/'} className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
              <path d="M2 9v1c0 1.1.9 2 2 2h1" />
              <path d="M16 11h.01" />
            </svg>
          </div>
          <span className={styles.logoText}>FinControl</span>
        </Link>

        {logado && (
          <>
            <nav className={`${styles.nav} ${menuAberto ? styles.navAberto : ''}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`${styles.navLink} ${location.pathname === link.href ? styles.navLinkAtivo : ''}`}
                  onClick={() => setMenuAberto(false)}
                >
                  {renderIcon(link.icon)}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className={styles.acoes}>
              <div className={`${styles.buscaContainer} ${buscaAberta ? styles.buscaAberta : ''}`}>
                <button
                  className={styles.btnIcone}
                  onClick={toggleBusca}
                  aria-label="Buscar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
                {buscaAberta && (
                  <input
                    type="text"
                    className={styles.inputBusca}
                    placeholder="Buscar transação..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    autoFocus
                  />
                )}
              </div>

              <Link to="/dashboard/conta" className={styles.btnCompartilhar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" x2="12" y1="2" y2="15" />
                </svg>
                <span>Compartilhar conta</span>
              </Link>

              <div className={styles.perfilContainer}>
                <button className={styles.btnPerfil} onClick={toggleMenu}>
                  <div className={styles.avatar}>
                    {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
                {menuAberto && (
                  <div className={styles.menuDropdown}>
                    <div className={styles.menuHeader}>
                      <span className={styles.menuNome}>{usuario?.nome || 'Usuário'}</span>
                      <span className={styles.menuEmail}>{usuario?.email || ''}</span>
                    </div>
                    <div className={styles.menuDivisor} />
                    <Link to="/perfil" className={styles.menuItem} onClick={() => setMenuAberto(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Meu Perfil
                    </Link>
                    <Link to="/configuracoes" className={styles.menuItem} onClick={() => setMenuAberto(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Configurações
                    </Link>
                    <div className={styles.menuDivisor} />
                    <button className={styles.menuItemSair} onClick={handleLogout}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button className={styles.btnMenuMobile} onClick={toggleMenu} aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuAberto ? (
                  <>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </>
                ) : (
                  <>
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </>
        )}

        {!logado && (
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.btnCadastro}>
              LogOut
            </Link>

            {/* outros componentes virão aqui, como o filtrar conta talvez e o icone do perfil */}
          </div>
        )}
      </div>
    </header>
  );
}
