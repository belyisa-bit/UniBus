import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Linhas from './pages/Linhas'
import DetalhesLinha from './pages/DetalhesLinha'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/linhas" element={<Linhas />} />
      <Route path="/linhas/:id" element={<DetalhesLinha />} />
    </Routes>
  )
}

export default App