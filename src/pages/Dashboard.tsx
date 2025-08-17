/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../utils/auth'; // Importa a função utilitária

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserIdFromToken();
      const token = localStorage.getItem('authToken');

      if (!userId || !token) {
        setLoading(false);
        setError("Não foi possível obter o ID do usuário. Faça o login novamente.");
        return;
      }

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/usuario/${userId}`, config);
        const emprestimosResponse = await axios.get(`${import.meta.env.VITE_API_URL}/emprestimo/tomados-por/${userId}`, config);
        const wishlistResponse = await axios.get(`${import.meta.env.VITE_API_URL}/wishlist/${userId}`, config);

        setUserData({
          ...userResponse.data,
          emprestimos: emprestimosResponse.data,
          wishlist: wishlistResponse.data,
        });

      } catch (err) {
        setError("Erro ao carregar os dados. Verifique se o token é válido e tente novamente.");
        console.error("Erro ao buscar dados do usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-white text-center p-8">Carregando dados...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Olá, {userData?.nome}!</h1>
      <p className="mb-8 text-gray-400">Bem-vindo(a) de volta ao Letrário.</p>
      
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-2xl mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-600">Seus Empréstimos</h2>
        {userData?.emprestimos?.length > 0 ? (
          <ul className="space-y-4">
            {userData.emprestimos.map((loan: any) => (
              <li key={loan.id} className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
                <span>Livro: {loan.livro?.titulo}</span>
                <span className={`font-bold ${loan.dataDevolucao ? 'text-green-400' : 'text-yellow-400'}`}>
                  {loan.dataDevolucao ? 'Devolvido' : 'Em andamento'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Você não possui empréstimos registrados.</p>
        )}
      </div>

      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-600">Sua Lista de Desejos</h2>
        {userData?.wishlist?.livros?.length > 0 ? (
          <ul className="space-y-4">
            {userData.wishlist.livros.map((book: any) => (
              <li key={book.id} className="p-4 bg-gray-700 rounded-lg flex items-center gap-4">
                <img src={book.capaUrl || 'https://placehold.co/60x90/5A67D8/FFFFFF?text=Sem+Capa'} alt={`Capa de ${book.titulo}`} className="w-12 h-20 object-cover rounded shadow-md" />
                <div>
                  <h3 className="text-lg font-bold">{book.titulo}</h3>
                  <p className="text-sm text-gray-400">{book.autor}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Sua lista de desejos está vazia.</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
