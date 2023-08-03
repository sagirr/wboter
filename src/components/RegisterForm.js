import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RegisterForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // Kayıt işlemi için backend'e POST isteği gönder
      const response = await axios.post('http://localhost:3008/register', {
        username: username,
        password: password
      });

      console.log(response); // Başarılı yanıt gelirse { message: 'OK' } olmalı

      // Kullanıcıyı oturum açmış gibi işaretle ve ana sayfaya yönlendir
      await login(username);
      navigate('/message');
    } catch (error) {
        console.error('Kayıt hatası:', error.message);
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <input
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Kayıt Ol</button>
    </div>
  );
};

export default RegisterForm;
