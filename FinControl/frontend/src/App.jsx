import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import ContasPage from './pages/ContasPage.jsx';
import CategoriasPage from './pages/CategoriasPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { clearSession, getCurrentUser } from './services/auth.js';

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <Router>
      <div className="app-shell">
        {user && <Header user={user} onLogout={handleLogout} />}

        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/registro" element={<RegisterPage onRegister={setUser} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transacoes"
            element={
              <ProtectedRoute user={user}>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contas"
            element={
              <ProtectedRoute user={user}>
                <ContasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute user={user}>
                <CategoriasPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
