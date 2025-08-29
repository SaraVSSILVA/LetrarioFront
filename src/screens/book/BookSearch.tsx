import React, { useState } from 'react';
import axios from 'axios';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}

interface SearchResultsProps {
  onBookSelect: (book: Book) => void;
}

const BookSearch: React.FC<SearchResultsProps> = ({ onBookSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    if (!searchTerm.trim()) {
      setLoading(false);
      return;
    }

    if (!GOOGLE_BOOKS_API_KEY) {
      setError('A chave da API do Google Books não está configurada. Por favor, verifique o arquivo .env.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${GOOGLE_BOOKS_API_KEY}`);
      setResults(response.data.items || []);
    } catch (err) {
      setError('Erro ao buscar livros. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6 bg-gray-800 rounded-lg shadow-lg max-w-sm mx-auto mb-8">
      <h2 className="text-xl font-bold mb-4 text-white text-center">Encontre um Livro</h2>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o título ou autor..."
          className="flex-grow p-2 rounded-l-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 font-bold text-white bg-indigo-500 rounded-r-md hover:bg-indigo-600 disabled:bg-indigo-300"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
      
      {error && <p className="text-red-400 text-center">{error}</p>}
      
      {results.length > 0 && (
        <ul className="flex flex-col gap-4 max-h-60 overflow-y-auto">
          {results.map(book => (
            <li 
              key={book.id} 
              className="flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => onBookSelect(book)}
            >
              <img 
                src={book.volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/60x90/5A67D8/FFFFFF?text=Sem+Capa'} 
                alt={book.volumeInfo.title} 
                className="w-12 h-16 object-cover rounded"
              />
              <div>
                <h3 className="text-sm font-semibold text-white">{book.volumeInfo.title}</h3>
                <p className="text-xs text-gray-400">{book.volumeInfo.authors?.join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookSearch;
