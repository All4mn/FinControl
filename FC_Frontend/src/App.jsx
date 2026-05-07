import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "../src/components/landingPage/LandingPage.jsx"
import Login from "../src/components/login/Login.jsx"
import Cadastro from "../src/components/cadastro/Cadastro.jsx"
// import Dashboard from "../src/components/dashboard/Dashboard.jsx"
// import Relatorios from "../src/components/relatorios/Relatorios.jsx"
// import Arquivados from "../src/components/arquivados/Arquivados.jsx"
// import NovaConta from "../src/components/novaConta/NovaConta.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        
        <Route path="/cadastro" element={<Cadastro />} />

        {/* <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/dashboard/relatorios" element={<Relatorios />} />

        <Route path="/dashboard/arquivados" element={<Arquivados />} />

        <Route path="/dashboard/conta" element={<NovaConta />} /> */}

      </Routes>
    </BrowserRouter>
  )
}