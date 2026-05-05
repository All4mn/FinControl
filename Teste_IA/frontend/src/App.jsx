// =============================================================================
// src/App.jsx
// Roteamento simples baseado em pathname
// =============================================================================

import Login         from './pages/Login';
import Cadastro      from './pages/Cadastro';
import Dashboard     from './pages/Dashboard';
import NovaTransacao from './pages/NovaTransacao';

function App() {
  const path = window.location.pathname;

  if (path === '/cadastro')       return <Cadastro />;
  if (path === '/dashboard')      return <Dashboard />;
  if (path === '/nova-transacao') return <NovaTransacao />;
  return <Login />;
}

export default App;
