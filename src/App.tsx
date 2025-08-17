import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginScreen from './pages/login/LoginScreen';
import Book from './pages/Book';
import Genre from './pages/Genre';
import Loan from './pages/Loan';
import User from './pages/User';
import WishlistPage from './pages/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterScreen from './pages/register/RegisterScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/livros"
          element={
            <ProtectedRoute>
              <Book />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generos"
          element={
            <ProtectedRoute>
              <Genre />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emprestimos"
          element={
            <ProtectedRoute>
              <Loan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/desejos"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
