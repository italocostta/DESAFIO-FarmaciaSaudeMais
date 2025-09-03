/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateUsuario, Role } from '../hooks/useUsuarios';
import { useFuncionarios } from '../../funcionarios/hooks/useFuncionarios';
import { useUsuarios } from '../hooks/useUsuarios';

type FormValues = {
  email: string;
  password: string;
  role: Role;
  funcionarioId: number | '';
};

const ROLES: Role[] = ['GERENTE', 'ATENDENTE', 'FARMACEUTICO'];

const schema = Yup.object({
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
  role: Yup.mixed<Role>().oneOf(ROLES).required('Obrigatório'),
  funcionarioId: Yup.number().typeError('Obrigatório').required('Obrigatório'),
});

export default function UsuarioFormPage() {
  const nav = useNavigate();
  const create = useCreateUsuario();

  // Busca funcionários (aumentei o limit para pegar "todos" — ajuste se necessário)
  const { data: funcionariosData, isLoading: loadingFuncs } = useFuncionarios(1, 500, '');
  const allFuncionarios = funcionariosData?.data ?? [];

  // Busca usuários existentes (se seu back ainda não tem GET, o hook já devolve lista vazia)
  const { data: usuariosData, isLoading: loadingUsers } = useUsuarios(1, 500, '');
  const usuarios = usuariosData?.data ?? [];

  // ids de funcionários já vinculados a algum usuário
  const usedFuncionarioIds = new Set<number>(
    usuarios
      .map((u: any) => u.funcionario?.id ?? u.funcionarioId)
      .filter((id: any) => typeof id === 'number')
  );

  // funcionários disponíveis (sem usuário ainda)
  const availableFuncionarios = allFuncionarios.filter((f: any) => !usedFuncionarioIds.has(f.id));

  const initialValues: FormValues = {
    email: '',
    password: '',
    role: 'ATENDENTE',
    funcionarioId: '',
  };

  if (loadingFuncs || loadingUsers) return <div>Carregando...</div>;

  return (
    <Card className="p-4">
      <h5 className="mb-3">Novo Usuário de Acesso</h5>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await create.mutateAsync({
              email: values.email,
              password: values.password,
              role: values.role as Role,
              funcionarioId: Number(values.funcionarioId),
            });
            nav('/usuarios');
          } catch (e: any) {
            const resp = e?.response;
            const msg = resp?.data?.error || resp?.data?.message || 'Erro ao criar usuário';
            setStatus(msg);
            console.error('Criar usuário falhou:', resp?.data || e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status, setFieldValue, values }) => (
          <Form className="row g-3">
            {status && <Alert variant="warning">{String(status)}</Alert>}

            <div className="col-md-6">
              <label>Funcionário</label>
              <Field
                as="select"
                name="funcionarioId"
                className="form-select"
                onChange={(e: any) => {
                  const idStr = e.target.value;
                  setFieldValue('funcionarioId', idStr);
                  const id = Number(idStr);
                  const f = availableFuncionarios.find((x: any) => x.id === id);
                  // preenche o email automaticamente (permite editar depois)
                  if (f?.email) setFieldValue('email', f.email);
                }}
              >
                <option value="">Selecione...</option>
                {availableFuncionarios.map((f: any) => (
                  <option key={f.id} value={String(f.id)}>
                    #{f.id} - {f.nome} ({f.cargo})
                  </option>
                ))}
              </Field>
              <div className="text-danger"><ErrorMessage name="funcionarioId" /></div>
              {values.funcionarioId === '' && usedFuncionarioIds.size > 0 && (
                <small className="text-muted">
                  Mostrando apenas funcionários sem usuário vinculado.
                </small>
              )}
            </div>

            <div className="col-md-6">
              <label>Role</label>
              <Field as="select" name="role" className="form-select">
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r === 'FARMACEUTICO' ? 'FARMACÊUTICO' : r}
                  </option>
                ))}
              </Field>
              <div className="text-danger"><ErrorMessage name="role" /></div>
            </div>

            <div className="col-md-6">
              <label>Email</label>
              <Field name="email" type="email" className="form-control" />
              <div className="text-danger"><ErrorMessage name="email" /></div>
            </div>

            <div className="col-md-6">
              <label>Senha</label>
              <Field name="password" type="password" className="form-control" />
              <div className="text-danger"><ErrorMessage name="password" /></div>
            </div>

            <div className="col-12 d-flex gap-2">
              <Button type="submit" disabled={isSubmitting}>Salvar</Button>
              <Button variant="secondary" onClick={() => nav('/usuarios')}>Cancelar</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
