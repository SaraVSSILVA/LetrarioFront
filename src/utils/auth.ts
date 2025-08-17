import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // 'sub' é o nome da claim que o NestJS usa para o ID do usuário
  username: string;
  iat: number;
  exp: number;
}

/**
 * Decodifica o token JWT armazenado no localStorage para obter o ID do usuário.
 * @returns O ID do usuário (string) ou null se o token não for encontrado ou for inválido.
 */
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.sub;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};