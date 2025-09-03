/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { useRemedios, useDeleteRemedio } from '../hooks/useRemedios';
import { useQueryClient } from 'react-query';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuthStore } from '../../../core/stores/auth.store';

export default function RemediosList() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { data, isLoading } = useRemedios(page, 10, q);
  const del = useDeleteRemedio();
  const qc = useQueryClient();
  const role = useAuthStore((s) => s.role);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Remédios</h4>
        {/* Topo: criar remédio = GERENTE ou FARMACÊUTICO */}
        {(role === 'GERENTE' || role === 'FARMACEUTICO') && (
          <LinkContainer to="/remedios/novo">
            <Button>Novo Remédio</Button>
          </LinkContainer>
        )}
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
            <th>Princípio</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Receita?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((r: any) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nomeComercial}</td>
              <td>{r.principioAtivo}</td>
              <td>{Number(r.preco).toFixed(2)}</td>
              <td>{r.estoque}</td>
              <td>{r.receitaObrigatoria ? 'Sim' : 'Não'}</td>
              <td className="text-end">
                {/* Editar: GERENTE ou FARMACÊUTICO */}
                {(role === 'GERENTE' || role === 'FARMACEUTICO') && (
                  <LinkContainer to={`/remedios/${r.id}`}>
                    <Button size="sm" className="me-2">
                      Editar
                    </Button>
                  </LinkContainer>
                )}
                {/* Excluir: só GERENTE */}
                {role === 'GERENTE' && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      if (!confirm('Excluir?')) return;
                      await del.mutateAsync(r.id);
                      qc.invalidateQueries('remedios');
                    }}
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
