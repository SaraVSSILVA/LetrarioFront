import { Navigate } from 'react-router-dom'
import type { JSX } from 'react/jsx-runtime'

interface PrivateRouteProps {
  children: JSX.Element
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token')

  // Se não tiver token, redireciona pro login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Se tiver token, renderiza o conteúdo protegido
  return children
}

export default PrivateRoute