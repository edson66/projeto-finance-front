import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Modal,
  Fade
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; 
import api from '../service/api'; 

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper', 
  border: '2px solid #000',
  boxShadow: 24,
  p: 4, 
};


function Dashboard() {
  
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataTransacao, setDataTransacao] = useState(dayjs()); 
  const [tipo, setTipo] = useState('DESPESA'); 
  const [categoria, setCategoria] = useState('OUTRO'); 

  const [dataInicioFiltro, setDataInicioFiltro] = useState(dayjs().subtract(30, 'day'));
  const [dataFimFiltro, setDataFimFiltro] = useState(dayjs());
  const [periodoSumario, setPeriodoSumario] = useState('Últimos 30 dias'); 


  const [transacoes, setTransacoes] = useState([]); 
  const [sumario, setSumario] = useState({ valorDespesas: 0, valorReceita: 0, saldo: 0 });


  const [openModal, setOpenModal] = useState(false);
  const [transacaoParaEditar, setTransacaoParaEditar] = useState(null); 

  const buscarSumarioFiltrado = async (inicio, fim) => {
    if (!inicio || !fim) {
      alert('Por favor, selecione a data de início e a data de fim para filtrar.');
      return;
    }
    const dataInicio = inicio.format('YYYY-MM-DD');
    const dataFinal = fim.format('YYYY-MM-DD');
    try {
      const response = await api.get('/sumario/por-data', {
        params: { dataInicio, dataFinal }
      });
      setSumario(response.data);
    } catch (error) {
      console.error('Erro ao filtrar sumário:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data); 
      } else {
        setSumario({ valorDespesas: 0, valorReceita: 0, saldo: 0 });
      }
    }
  };
  
  useEffect(() => {
    const buscarTransacoes = async () => {
      try {
        const response = await api.get('/transacoes'); 
        const data = response.data.content || response.data;
        const dataArray = Array.isArray(data) ? data : [];
        dataArray.sort((a, b) => new Date(b.data) - new Date(a.data));
        setTransacoes(dataArray);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
        setTransacoes([]); 
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert('Sua sessão expirou. Faça login novamente.');
        }
      }
    };
    buscarTransacoes();
    buscarSumarioFiltrado(dataInicioFiltro, dataFimFiltro);
  }, []); 

  const handleAdicionarTransacao = async (event) => {
    event.preventDefault();
    const novaTransacao = {
      descricao, valor: parseFloat(valor),
      data: dataTransacao.format('YYYY-MM-DD') + 'T00:00:00', 
      tipo, tipoCategoria: categoria
    };
    try {
      const response = await api.post('/transacoes', novaTransacao);
      const listaAtualizada = [response.data, ...transacoes];
      listaAtualizada.sort((a, b) => new Date(b.data) - new Date(a.data));
      setTransacoes(listaAtualizada);
      setDescricao(''); setValor(''); setTipo('DESPESA');
      setCategoria('OUTRO'); setDataTransacao(dayjs());
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Falha ao adicionar transação. Verifique os dados.');
    }
  };

  const handleFiltrarClick = () => {
    const textoInicio = dataInicioFiltro.format('DD/MM/YY');
    const textoFim = dataFimFiltro.format('DD/MM/YY');
    setPeriodoSumario(`de ${textoInicio} até ${textoFim}`);
    buscarSumarioFiltrado(dataInicioFiltro, dataFimFiltro);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await api.delete(`/transacoes/${id}`);
        setTransacoes(transacoes.filter(transacao => transacao.id !== id));
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
        alert('Falha ao deletar transação.');
      }
    }
  };

  const handleAbrirModalEdicao = (transacao) => {
    setTransacaoParaEditar({
      ...transacao,
      tipoCategoria: transacao.categoria?.tipoCategoria || 'OUTRO' 
    });
    setOpenModal(true);
  };

  const handleFecharModal = () => {
    setOpenModal(false);
    setTransacaoParaEditar(null);
  };


  const handleMudancaEdicao = (event) => {
    const { name, value } = event.target;
    setTransacaoParaEditar({
      ...transacaoParaEditar,
      [name]: value
    });
  };

  const handleSalvarEdicao = async (event) => {
    event.preventDefault();
    
    let dataFormatada;
    if (dayjs.isDayjs(transacaoParaEditar.data)) {
      dataFormatada = transacaoParaEditar.data.format('YYYY-MM-DD') + 'T00:00:00';
    } else {
      dataFormatada = dayjs(transacaoParaEditar.data).format('YYYY-MM-DD') + 'T00:00:00';
    }

    const payload = {
      descricao: transacaoParaEditar.descricao,
      valor: parseFloat(transacaoParaEditar.valor),
      data: dataFormatada,
      tipo: transacaoParaEditar.tipo,
      tipoCategoria: transacaoParaEditar.tipoCategoria
    };

    try {
      const response = await api.put(`/transacoes/${transacaoParaEditar.id}`, payload);

      const listaAtualizada = transacoes.map(t => 
        t.id === transacaoParaEditar.id ? response.data : t
      );

      listaAtualizada.sort((a, b) => new Date(b.data) - new Date(a.data));
      setTransacoes(listaAtualizada);

      handleFecharModal();

    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      alert('Falha ao atualizar transação.');
    }
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
      <Typography component="h1" variant="h4" gutterBottom>
        Meu Dashboard Financeiro
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Receitas ({periodoSumario}) 
            </Typography>
            <Typography variant="h4" sx={{ color: 'green' }}>
              R$ {sumario.valorReceita.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Despesas ({periodoSumario})
            </Typography>
            <Typography variant="h4" sx={{ color: 'red' }}>
              - R$ {sumario.valorDespesas.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Saldo ({periodoSumario})
            </Typography>
            <Typography variant="h4" sx={{ color: sumario.saldo >= 0 ? 'green' : 'red' }}>
              R$ {sumario.saldo.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>


      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography component="h2" variant="h6" gutterBottom>
          Filtrar Sumário
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <DatePicker 
            label="Data Início"
            value={dataInicioFiltro}
            onChange={(data) => setDataInicioFiltro(data)}
          />
          <DatePicker 
            label="Data Fim"
            value={dataFimFiltro}
            onChange={(data) => setDataFimFiltro(data)}
          />
          <Button variant="outlined" onClick={handleFiltrarClick}> 
            Filtrar
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography component="h2" variant="h6" gutterBottom>
          Adicionar Nova Transação
        </Typography>
        <Box component="form" onSubmit={handleAdicionarTransacao}>
        <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <TextField
                label="Descrição"
                fullWidth
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <TextField
                label="Valor (R$)"
                type="number"
                fullWidth
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <DatePicker
                label="Data da Transação"
                value={dataTransacao}
                onChange={(novaData) => setDataTransacao(novaData)}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-label"
                  id="tipo-select"
                  value={tipo}
                  label="Tipo"
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <MenuItem value="DESPESA">Despesa</MenuItem>
                  <MenuItem value="RECEITA">Receita</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel id="categoria-label">Categoria</InputLabel>
                <Select
                  labelId="categoria-label"
                  id="categoria-select"
                  value={categoria}
                  label="Categoria"
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <MenuItem value="ALIMENTACAO">Alimentação</MenuItem>
                  <MenuItem value="TRANSPORTE">Transporte</MenuItem>
                  <MenuItem value="MORADIA">Moradia</MenuItem>
                  <MenuItem value="OUTRO">Outro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ height: '100%' }} 
              >
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>


      <Paper sx={{ p: 2 }}>
        <Typography component="h2" variant="h6" gutterBottom>
          Minhas Transações (Todas)
        </Typography>
        
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell align="right">Valor (R$)</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="center">Ações</TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {transacoes.map((transacao) => (
                <TableRow key={transacao.id}>
                  <TableCell>{transacao.descricao}</TableCell>
                  <TableCell>{transacao.tipo}</TableCell> 
                  <TableCell>{transacao.categoria?.tipoCategoria}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ color: transacao.tipo === 'RECEITA' ? 'green' : 'red' }} 
                  >
                    {transacao.tipo === 'DESPESA' ? '-' : ''} 
                    {transacao.valor.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {dayjs(transacao.data).format('DD/MM/YYYY')}
                  </TableCell>
                  
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleAbrirModalEdicao(transacao)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(transacao.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal
        open={openModal} 
        onClose={handleFecharModal} 
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box sx={styleModal}>
            <Typography component="h2" variant="h6" gutterBottom>
              Editar Transação
            </Typography>
            
            {transacaoParaEditar && (
              <Box component="form" onSubmit={handleSalvarEdicao}>
                <Grid container spacing={2}>
                  
                  <Grid xs={12} sm={8}>
                    <TextField
                      name="descricao" 
                      label="Descrição"
                      fullWidth
                      required
                      value={transacaoParaEditar.descricao}
                      onChange={handleMudancaEdicao}
                    />
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <TextField
                      name="valor"
                      label="Valor (R$)"
                      type="number"
                      fullWidth
                      required
                      value={transacaoParaEditar.valor}
                      onChange={handleMudancaEdicao}
                    />
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <DatePicker
                      label="Data da Transação"
                      value={dayjs(transacaoParaEditar.data)} 
                      onChange={(novaData) => setTransacaoParaEditar({
                        ...transacaoParaEditar,
                        data: novaData 
                      })}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="tipo-edit-label">Tipo</InputLabel>
                      <Select
                        name="tipo"
                        labelId="tipo-edit-label"
                        value={transacaoParaEditar.tipo}
                        label="Tipo"
                        onChange={handleMudancaEdicao}
                      >
                        <MenuItem value="DESPESA">Despesa</MenuItem>
                        <MenuItem value="RECEITA">Receita</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12} sm={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="categoria-edit-label">Categoria</InputLabel>
                      <Select
                        name="tipoCategoria"
                        labelId="categoria-edit-label"
                        value={transacaoParaEditar.tipoCategoria}
                        label="Categoria"
                        onChange={handleMudancaEdicao}
                      >
                        <MenuItem value="ALIMENTACAO">Alimentação</MenuItem>
                        <MenuItem value="TRANSPORTE">Transporte</MenuItem>
                        <MenuItem value="MORADIA">Moradia</MenuItem>
                        <MenuItem value="OUTRO">Outro</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={6}>
                    <Button 
                      onClick={handleFecharModal} 
                      variant="outlined" 
                      fullWidth
                    >
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid xs={6}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                    >
                      Salvar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>

    </Container>
  );
}

export default Dashboard;