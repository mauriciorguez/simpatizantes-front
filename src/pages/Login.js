import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, url } = useAuth(); // Accede al login desde el contexto

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isRegister ? 'register' : 'login';

    try {
      const res = await fetch(`${url}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          setSuccess('Usuario registrado exitosamente. Ya puedes iniciar sesión.');
          setIsRegister(false);
          setEmail('');
          setPassword('');
        } else {
          login(data.token); // Llamamos al método login del contexto con el token
          navigate('/');
          onLogin();
        }
      } else {
        setError(data.message || 'Error en la operación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  useEffect(() => {
    fetch(url + '/api/getUsers')
      .then(res => res.json())
      .then(data => console.log('Usuarios:', data));
      // eslint-disable-next-line
  }, []);


  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f2f2f2',
        p: 2
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 360 }}>
        <Typography variant="h6" gutterBottom>
          {isRegister ? 'Registrarse' : 'Iniciar sesión'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ backgroundColor: '#019f84e6' }}
          >
            {isRegister ? 'Registrarse' : 'Entrar'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <Link component="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
