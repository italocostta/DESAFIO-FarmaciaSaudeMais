import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../core/api/queryClient';

import RequireAuth from '../core/guards/RequireAuth';
import RequireRole from '../core/guards/RequireRole';

import AppLayout from '../ui/layout/AppLayout';
import HomePage from '../ui/pages/HomePage';

import LoginPage from '../modules/auth/pages/LoginPage';

import ClientesList from '../modules/clientes/pages/ClientesList';
import ClienteFormPage from '../modules/clientes/pages/ClienteFormPage';

import FuncionariosList from '../modules/funcionarios/pages/FuncionariosList';
import FuncionarioFormPage from '../modules/funcionarios/pages/FuncionarioFormPage';

import RemediosList from '../modules/remedios/pages/RemediosList';
import RemedioFormPage from '../modules/remedios/pages/RemedioFormPage';

import UsuariosList from '../modules/usuarios/pages/UsuariosList';
import UsuarioFormPage from '../modules/usuarios/pages/UsuarioFormPage';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* área autenticada */}
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            {/* Home (index = "/") */}
            <Route index element={<HomePage />} />

            {/* Clientes - todos os papéis podem criar/listar/editar */}
            <Route
              path="clientes"
              element={
                <RequireRole roles={['GERENTE', 'ATENDENTE', 'FARMACEUTICO']}>
                  <ClientesList />
                </RequireRole>
              }
            />
            <Route
              path="clientes/novo"
              element={
                <RequireRole roles={['GERENTE', 'ATENDENTE', 'FARMACEUTICO']}>
                  <ClienteFormPage />
                </RequireRole>
              }
            />
            <Route
              path="clientes/:id"
              element={
                <RequireRole roles={['GERENTE', 'ATENDENTE', 'FARMACEUTICO']}>
                  <ClienteFormPage />
                </RequireRole>
              }
            />

            {/* Funcionários - somente GERENTE */}
            <Route
              path="funcionarios"
              element={
                <RequireRole roles={['GERENTE']}>
                  <FuncionariosList />
                </RequireRole>
              }
            />
            <Route
              path="funcionarios/novo"
              element={
                <RequireRole roles={['GERENTE']}>
                  <FuncionarioFormPage />
                </RequireRole>
              }
            />
            <Route
              path="funcionarios/:id"
              element={
                <RequireRole roles={['GERENTE']}>
                  <FuncionarioFormPage />
                </RequireRole>
              }
            />

            {/* Remédios - GERENTE e FARMACÊUTICO */}
            <Route
              path="remedios"
              element={
                <RequireRole roles={['GERENTE', 'FARMACEUTICO']}>
                  <RemediosList />
                </RequireRole>
              }
            />
            <Route
              path="remedios/novo"
              element={
                <RequireRole roles={['GERENTE', 'FARMACEUTICO']}>
                  <RemedioFormPage />
                </RequireRole>
              }
            />
            <Route
              path="remedios/:id"
              element={
                <RequireRole roles={['GERENTE', 'FARMACEUTICO']}>
                  <RemedioFormPage />
                </RequireRole>
              }
            />

            {/* ---- Usuários (apenas GERENTE) ---- */}
            <Route
              path="usuarios"
              element={
                <RequireRole roles={['GERENTE']}>
                  <UsuariosList />
                </RequireRole>
              }
            />
            <Route
              path="usuarios/novo"
              element={
                <RequireRole roles={['GERENTE']}>
                  <UsuarioFormPage />
                </RequireRole>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
