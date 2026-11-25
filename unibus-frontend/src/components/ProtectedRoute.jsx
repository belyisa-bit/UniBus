import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'

export default function ProtectedRoute() {
  const location = useLocation()
  const [motivo, setMotivo] = useState('')
  const [usuario, setUsuario] = useState(() => authService.getUsuario())
  useEffect(() => {
    const sincronizar = () => {
      const atual = authService.getUsuario()
      if (!atual) setMotivo('Sua sessão foi encerrada. Entre novamente para continuar.')
      setUsuario(atual)
    }
    window.addEventListener('storage', sincronizar)
    window.addEventListener('unibus-auth-change', sincronizar)
    return () => {
      window.removeEventListener('storage', sincronizar)
      window.removeEventListener('unibus-auth-change', sincronizar)
    }
  }, [])
  return usuario
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location, motivo }} />
}
