import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>FinControl</h1>
        <p>Controle Financeiro Pessoal</p>
      </div>
    </>
  )
}

export default App