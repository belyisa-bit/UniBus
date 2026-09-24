import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Linhas from './pages/Linhas'
import Faculdades from './pages/Faculdades'
import DetalhesLinha from './pages/DetalhesLinha'
import Header from './components/Header/Header'
import './App.css'

function MainLayout() {
  return (
    <div className="app-layout">
      <Header />
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/linhas" element={<Linhas />} />
        <Route path="/rotas" element={<DetalhesLinha />} />
        <Route path="/linhas/:id" element={<DetalhesLinha />} />
        <Route path="/faculdades" element={<Faculdades />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
