/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { Table, Button, InputGroup, Form, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useFuncionarios, useDeleteFuncionario } from '../hooks/useFuncionarios';
import { useUsuarios } from '../../usuarios/hooks/useUsuarios';
import { useAuthStore, AuthState } from '../../../core/stores/auth.store';
import { useQueryClient } from 'react-query';

export default function FuncionariosList() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const qc = useQueryClient();

  const role = useAuthStore((s: AuthState) => s.role);
  const { data: funcsData, isLoading } = useFuncionarios(page, 10, q);
  const { data: usersData } = useUsuarios(1, 1000, '');
  const del = useDeleteFuncionario();

  const funcionarios = funcsData?.data ?? [];
  const meta = funcsData?.meta;

  // Mapa funcionarioId -> cargo/role (considera funcionarioId OU funcionario.id)
  const cargoByFuncionarioId = useMemo(() => {
    const rows = usersData?.data ?? [];
    const map = new Map<number, string>();
    for (const u of rows) {
      const fid = (u as any)?.funcionarioId ?? (u as any)?.funcionario?.id;
      if (fid) map.set(Number(fid), (u as any).role);
    }
    return map;
  }, [usersData]);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Funcionários</h4>
        {role === 'GERENTE' && (
          <LinkContainer to="/funcionarios/novo">
            <Button>Novo Funcionário</Button>
          </LinkContainer>
        )}
      </div>

      <InputGroup className="mb-3" style={{ maxWidth: 420 }}>
        <Form.Control
          placeholder="Buscar por nome, CPF..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button onClick={() => setPage(1)}>Buscar</Button>
      </InputGroup>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Admissão</th>
            <th>Salário</th>
            <th>Cargo</th> {/* <- renomeado */}
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((f: any) => {
            const cargo = cargoByFuncionarioId.get(f.id) ?? '—';
            return (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.nome}</td>
                <td>{f.cpf}</td>
                <td>{f.email}</td>
                <td>{f.dataAdmissao?.slice?.(0, 10) ?? String(f.dataAdmissao)}</td>
                <td>
                  {Number(f.salario).toLocaleString('pt-BR', {
                    style: 'currency', currency: 'BRL',
                  })}
                </td>
                <td>
                  {cargo === '—' ? '—' : (
                    <Badge bg={cargo === 'GERENTE' ? 'primary' : cargo === 'FARMACEUTICO' ? 'success' : 'secondary'}>
                      {cargo}
                    </Badge>
                  )}
                </td>
                <td className="text-end">
                  {role === 'GERENTE' && (
                    <LinkContainer to={`/funcionarios/${f.id}`}>
                      <Button size="sm" className="me-2">Editar</Button>
                    </LinkContainer>
                  )}
                  {role === 'GERENTE' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        if (!confirm('Excluir este funcionário?')) return;
                        await del.mutateAsync(f.id);
                        qc.invalidateQueries('funcionarios');
                      }}
                    >
                      Excluir
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {meta && (
        <div className="d-flex gap-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Anterior
          </Button>
          <Button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>
            Próxima
          </Button>
        </div>
      )}
    </>
  );
}
