import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import BooksPage from './pages/booksPage/BooksPage';
import FavoriteBooksPage from './pages/favoriteBooksPage/FavoriteBooksPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import ContactUsPage from './pages/contactUsPage/ContactUsPage';
import LoginPage from './pages/loginPage/LoginPage';
import SignupPage from './pages/signupPage/SignupPage';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import './App.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoriteBooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <Footer /> {/* Add Footer here */}
      <ToastContainer position='bottom-right'/>
    </Router>
  );
}

export default App;