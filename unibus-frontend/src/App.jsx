import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Linhas from './pages/Linhas'
import DetalhesLinha from './pages/DetalhesLinha'
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
   <>
    <Header />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/linhas" element={<Linhas />} />
      <Route path="/linhas/:id" element={<DetalhesLinha />} />
    </Routes>

    <Footer />
  </>
  )
}

export default App