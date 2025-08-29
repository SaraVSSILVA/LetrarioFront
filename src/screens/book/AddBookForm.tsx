/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import BookSearch from './BookSearch';
import axios from 'axios';
import { getUserIdFromToken } from '../../utils/auth';

const AddBookScreen: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleBookSelect = (book: any) => {
    setSelectedBook(book);
    setSuccess(null);
    setError(null);
  };

  const handleAddBookToLibrario = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    const userId = getUserIdFromToken();

    if (!token || !userId || !selectedBook) {
      setError("Informações incompletas para adicionar o livro.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const bookData = {
        titulo: selectedBook.volumeInfo.title,
        autor: selectedBook.volumeInfo.authors?.join(', '),
        capaUrl: selectedBook.volumeInfo.imageLinks?.thumbnail,
      };

      const response = await axios.post('https://letrario-api.onrender.com/api/livros', bookData, config);

      if (response.status === 201) {
        setSuccess('Livro adicionado com sucesso!');
        setSelectedBook(null); 
      }

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Erro: ${err.response.data.message || 'Falha ao adicionar o livro.'}`);
      } else {
        setError("Erro de rede. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Adicionar Novo Livro</h1>
      
      {!selectedBook ? (
        <BookSearch onBookSelect={handleBookSelect} />
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Livro Selecionado</h2>
          <div className="flex flex-col items-center text-center">
            <img 
              src={selectedBook.volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/100x150/5A67D8/FFFFFF?text=Sem+Capa'} 
              alt={selectedBook.volumeInfo.title} 
              className="w-24 h-32 object-cover rounded mb-4"
            />
            <h3 className="font-semibold text-lg">{selectedBook.volumeInfo.title}</h3>
            <p className="text-sm text-gray-400">{selectedBook.volumeInfo.authors?.join(', ')}</p>
          </div>
          
          {success && <p className="text-green-400 mt-4">{success}</p>}
          {error && <p className="text-red-400 mt-4">{error}</p>}
          
          <button
            onClick={handleAddBookToLibrario}
            disabled={loading}
            className="mt-6 w-full p-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:bg-indigo-300"
          >
            {loading ? 'Adicionando...' : 'Adicionar à Minha Biblioteca'}
          </button>
          
          <button 
            onClick={() => setSelectedBook(null)} 
            className="mt-2 w-full p-2 text-sm text-gray-400 hover:text-white"
          >
            Buscar outro livro
          </button>
        </div>
      )}
    </div>
  );
};

export default AddBookScreen;
