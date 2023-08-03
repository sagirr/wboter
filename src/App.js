import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import MessageForm from './components/MessageForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { AuthProvider, AuthContext } from './components/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <LogoutButton /> {/* Çıkış Yap butonunu ekleyelim */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/message" element={<PrivateRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute = () => {
  // Check if the user is logged in
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  return isLoggedIn() ? <MessageForm /> : navigate('/login');
};

const LogoutButton = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn() ? <button onClick={handleLogout}>Çıkış Yap</button> : null;
};

export default App;
