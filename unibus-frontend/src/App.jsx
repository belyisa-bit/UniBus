import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Linhas from './pages/Linhas'
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
        <Route path="/linhas/:id" element={<DetalhesLinha />} />
      </Route>
    </Routes>
  )
}

export default App
