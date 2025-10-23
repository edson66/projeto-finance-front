import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { BrowserRouter } from 'react-router-dom';

const temaDark = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider theme={temaDark}>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          
          <CssBaseline /> 

          <App />

        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
    
  </React.StrictMode>
);
