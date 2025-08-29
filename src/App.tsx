import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/login/LoginScreen';
import Genre from './screens/Genre';
import Loan from './screens/Loan';
import User from './screens/User';
import WishlistPage from './screens/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';
import BookSearch from './screens/book/BookSearch';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
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
              <BookSearch />
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
