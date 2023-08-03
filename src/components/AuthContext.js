import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Sayfa yenilendiğinde kullanıcının oturum bilgilerini yerel depolamadan alalım
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username) => {
    setUser(username);
    // Kullanıcının oturum bilgilerini yerel depolamaya kaydedelim
    localStorage.setItem('user', JSON.stringify(username));
  };

  const logout = () => {
    setUser(null);
    // Kullanıcının oturum bilgilerini yerel depolamadan silelim
    localStorage.removeItem('user');
  };

  const isLoggedIn = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
