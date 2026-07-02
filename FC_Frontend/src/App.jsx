import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/LandingPage.jsx";
import Login from "./pages/login/Login.jsx";
import Cadastro from "./pages/cadastro/Cadastro.jsx";
import CompletarCadastro from "./pages/completarCadastro/CompletarCadastro.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Logs from "./pages/logsTransacoes/Logs.jsx";
import StatusUsuario from "./pages/statusUsuario/StatusUsuario.jsx";
import Carteira from "./pages/carteira/Carteira.jsx";
import CarteirasAdmin from "./pages/carteiras/CarteirasAdmin.jsx";
import CreateMoeda from "./pages/createMoeda/createMoeda.jsx";
// import Relatorios from "./pages/relatorios/Relatorios.jsx"
// import Arquivados from "./pages/arquivados/Arquivados.jsx"
// import NovaConta from "./pages/novaConta/NovaConta.jsx"
import Conta from "./pages/conta/Conta.jsx";
import CarteiraHasConta from "./pages/carteiraHasConta/CarteiraHasConta.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/completar-cadastro" element={<CompletarCadastro />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/dashboard/logs" element={<Logs />} />

        <Route path="/create-moeda" element={<CreateMoeda />} />

        <Route path="/dashboard/status-usuario" element={<StatusUsuario />} />
        <Route path="/dashboard/conta" element={<Conta />} />
        <Route path="/dashboard/carteira" element={<Carteira />} />
        <Route path="/dashboard/carteiras" element={<CarteirasAdmin />} />
        <Route path="/carteiras" element={<CarteirasAdmin />} />
        <Route
          path="/dashboard/carteira-has-conta"
          element={<CarteiraHasConta />}
        />

        {/* <Route path="/dashboard/relatorios" element={<Relatorios />} /> */}

        {/* <Route path="/dashboard/arquivados" element={<Arquivados />} /> */}

        {/* <Route path="/dashboard/conta" element={<NovaConta />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
