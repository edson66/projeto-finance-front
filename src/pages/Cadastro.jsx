import React, { useState, useEffect } from 'react';
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

const RegraSenhaItem = ({ valido, texto }) => (
  <Typography 
    variant="body2" 
    color={valido ? 'success.main' : 'error.main'}
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 0.5 
    }}
  >
    {valido ? '✓' : '✗'} {texto}
  </Typography>
);


function Cadastro() {
  const navigate = useNavigate();
  

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [regrasSenha, setRegrasSenha] = useState({
    maiuscula: false,
    minuscula: false,
    numero: false,
    especial: false
  });

  useEffect(() => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    
    const temEspecial = /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(senha);

    setRegrasSenha({
      maiuscula: temMaiuscula,
      minuscula: temMinuscula,
      numero: temNumero,
      especial: temEspecial
    });
  }, [senha]);

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    
    const todasRegrasValidas = Object.values(regrasSenha).every(Boolean);
    if (!todasRegrasValidas) {
      alert('A senha não atende a todos os requisitos.');
      return;
    }

    try {
      await api.post('/usuarios/cadastro', {
        login: login, 
        senha: senha 
      });
      
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/'); 

    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error.response && error.response.status === 400) {
        alert(`Erro: ${error.response.data.message || 'Este login já está em uso.'}`);
      } else {
        alert('Não foi possível realizar o cadastro.');
      }
    }
  };

  const senhasDiferentes = senha !== confirmarSenha && confirmarSenha.length > 0;

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
          Criar sua conta
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            autoComplete="username"
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
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          
          <Box sx={{ mt: 1, mb: 1, pl: 0.5 }}>
            <RegraSenhaItem valido={regrasSenha.minuscula} texto="Pelo menos 1 letra minúscula" />
            <RegraSenhaItem valido={regrasSenha.maiuscula} texto="Pelo menos 1 letra maiúscula" />
            <RegraSenhaItem valido={regrasSenha.numero} texto="Pelo menos 1 número" />
            <RegraSenhaItem valido={regrasSenha.especial} texto="Pelo menos 1 caractere especial (!@#...)" />
          </Box>
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirmar Senha"
            type="password"
            id="confirm-password"
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            error={senhasDiferentes}
            helperText={senhasDiferentes ? 'As senhas não coincidem' : ''}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained" 
            sx={{ mt: 3, mb: 2 }} 
          >
            Cadastrar
          </Button>
          
          <Link component={RouterLink} to="/" variant="body2">
            {"Já tem uma conta? Faça login"}
          </Link>
          
        </Box>
      </Box>
    </Container>
  );
}

export default Cadastro;