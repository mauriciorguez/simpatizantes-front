import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [url] = useState("http://localhost:5000");
  const [url] = useState("https://simpatizantes-back.onrender.com");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (!user) {
          setUser(decoded);
          getUser(decoded.email);
        }
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
      }
    }
    // eslint-disable-next-line
  }, [user]);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      if (!user) {
        setUser(decoded);
        getUser(decoded.email);
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getUser = (email) => {
    fetch(url + '/api/getUserByEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Usuario obtenido:', data);
        setUser(prevState => ({ ...prevState, ...data }));
      })
      .catch(error => console.error('Error al obtener el usuario:', error));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, url }}>
      {children}
    </AuthContext.Provider>
  );
};
