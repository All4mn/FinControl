import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "../src/components/landingPage/LandingPage.jsx"
import Login from "../src/components/login/Login.jsx"

export default function App() {
  return (
    // O BrowserRouter é quem cria o "contexto" que faltava para o useNavigate funcionar!
    <BrowserRouter>
      <Routes>
        {/* A rota principal (/) vai renderizar a Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* A rota /login vai renderizar o Login */}
        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}