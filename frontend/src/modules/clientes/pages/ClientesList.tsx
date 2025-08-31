/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Table, Form, InputGroup, Button } from 'react-bootstrap';
import { useClientes, useDeleteCliente } from '../hooks/useClientes';
import { useQueryClient } from 'react-query';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuthStore } from '../../../core/stores/auth.store';

export default function ClientesList() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { data, isLoading } = useClientes(page, 10, q);
  const qc = useQueryClient();
  const del = useDeleteCliente();
  const role = useAuthStore((s) => s.role);

  const handleDelete = async (id: number) => {
    if (!confirm('Confirmar exclusão?')) return;
    await del.mutateAsync(id);
    qc.invalidateQueries('clientes');
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Clientes</h4>
        <LinkContainer to="/clientes/novo">
          <Button>Novo Cliente</Button>
        </LinkContainer>
      </div>

      <InputGroup className="mb-3" style={{ maxWidth: 380 }}>
        <Form.Control
          placeholder="Buscar..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button onClick={() => setPage(1)}>Buscar</Button>
      </InputGroup>

      <Table striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((c: any) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>{c.cpf}</td>
              <td>{c.email ?? '-'}</td>
              <td>{c.telefone ?? '-'}</td>
              <td className="text-end">
                <LinkContainer to={`/clientes/${c.id}`}>
                  <Button size="sm" className="me-2">
                    Editar
                  </Button>
                </LinkContainer>
                {role === 'GERENTE' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Excluir
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex gap-2">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>
        <Button
          disabled={data?.meta && page >= data.meta.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </Button>
      </div>
    </>
  );
}
