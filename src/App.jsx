import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cadastro from './pages/Cadastro';
import RotaProtegida from './components/RotaProtegida';

function App() {
  return (

    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<RotaProtegida/>}>

          <Route path="/dashboard" element={<Dashboard />} />
    
      </Route>
    </Routes>
  );
}

export default App;
