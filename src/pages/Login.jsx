import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link 
} from '@mui/material';

import api from '../service/api';

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
          const response = await api.post('/usuarios/login', {
            login: login, 
            senha: senha 
          });
          
          const token = response.data.token; 
          
          localStorage.setItem('authToken', token);
          
          navigate('/dashboard'); 

        } catch (error) {
          console.error('Erro no login:', error);
          alert('Email ou senha inválidos!');
        }

  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
        <Typography component="h1" variant="h4" gutterBottom>
          Finance
        </Typography>
        <Typography component="h2" variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Controle suas finanças
        </Typography>

        <Typography component="h1" variant="h5">
          Login
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            autoComplete="login"
            autoFocus
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained" 
            sx={{ mt: 3, mb: 2 }} 
          >
            Entrar
          </Button>
          
          <Link component={RouterLink} to="/cadastro" variant="body2">
            {"Não tem uma conta? Cadastre-se"}
          </Link>
          
        </Box>
      </Box>
    </Container>
  );
}

export default Login;