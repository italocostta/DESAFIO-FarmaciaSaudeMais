/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Table, Button, InputGroup, Form, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useUsuarios, useDeleteUsuario } from '../hooks/useUsuarios';
import { useQueryClient } from 'react-query';

export default function UsuariosList() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { data, isLoading } = useUsuarios(page, 20, q);
  const del = useDeleteUsuario();
  const qc = useQueryClient();

  if (isLoading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        Carregando...
      </div>
    );
  }

  const rows = data?.data ?? [];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Usuários (Roles)</h4>
        <LinkContainer to="/usuarios/novo">
          <Button>Novo Usuário</Button>
        </LinkContainer>
      </div>

      <InputGroup className="mb-3" style={{ maxWidth: 380 }}>
        <Form.Control
          placeholder="Buscar por email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button onClick={() => setPage(1)}>Buscar</Button>
      </InputGroup>

      {rows.length === 0 ? (
        <div className="alert alert-info">
          Nenhum usuário encontrado. Crie um novo usuário para vincular um funcionário e definir a role.
        </div>
      ) : (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Funcionário</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u: any) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.funcionario
                    ? `#${u.funcionario.id} - ${u.funcionario.nome}`
                    : u.funcionarioId
                    ? `#${u.funcionarioId}`
                    : '—'}
                </td>
                <td className="text-end">
                  {/* Se tiver PATCH disponível, podemos adicionar botão Editar aqui */}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      if (!confirm('Excluir este usuário de acesso?')) return;
                      await del.mutateAsync(u.id);
                      qc.invalidateQueries('usuarios');
                    }}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
