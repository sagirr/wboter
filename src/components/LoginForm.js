import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ekledik
import { AuthContext } from './AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const { login, logout } = useContext(AuthContext); // logout fonksiyonunu alalım
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Giriş işlemi için backend'e POST isteği gönder
      const response = await axios.post('http://localhost:3008/login', {
        username: username,
        password: password,
      });

      console.log(response.data); // Başarılı yanıt gelirse { message: 'OK' } olmalı

      // Kullanıcıyı oturum açmış gibi işaretle ve ana sayfaya yönlendir
      await login(username);
      navigate('/message');
    } catch (error) {
      console.error('Giriş hatası:', error.message);
    }
  };

  const handleLogout = () => {
    // Perform logout operation
    logout();
    navigate('/login'); // Çıkış yapıldığında kullanıcıyı login sayfasına yönlendirelim
  };

  return (
    <div className="login-form-container">
      <h2 className="login-heading">Giriş Yap</h2>
      <div className="login-input-group">
        <label htmlFor="username">Kullanıcı Adı:</label>
        <input
          type="text"
          id="username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="login-input-group">
        <label htmlFor="password">Şifre:</label>
        <input
          type="password"
          id="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-button" onClick={handleLogin}>Giriş Yap</button>
      <button className="logout-button" onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
};

export default LoginForm;
