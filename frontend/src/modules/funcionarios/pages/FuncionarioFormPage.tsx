/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Alert } from 'react-bootstrap';
import { useFuncionario, useSaveFuncionario } from '../hooks/useFuncionarios';

const schema = Yup.object({
  nome: Yup.string().min(2).max(120).required('Obrigatório'),
  cpf: Yup.string().length(11, 'CPF deve ter 11 dígitos').required('Obrigatório'),
  salario: Yup.number().min(0, 'Inválido').required('Obrigatório'),
  dataAdmissao: Yup.string().required('Obrigatório'),
  email: Yup.string().email('Email inválido').min(5).max(120).required('Obrigatório'),
});

export default function FuncionarioFormPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useFuncionario(id);
  const save = useSaveFuncionario();

  // ⚠️ Sem CARGO nos defaults
  const defaults = { nome: '', cpf: '', salario: 0, dataAdmissao: '', email: '' };
  const initial = { ...defaults, ...(id && data ? data : {}) };

  if (id && isLoading && !data) return <div>Carregando...</div>;

  return (
    <Card className="p-4">
      <h5 className="mb-3">{id ? 'Editar Funcionário' : 'Novo Funcionário'}</h5>

      <Formik
        enableReinitialize
        initialValues={initial}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await save.mutateAsync({
              ...values,
              salario: Number(values.salario),
              id: id ? Number(id) : undefined,
            });
            nav('/funcionarios');
          } catch (e: any) {
            const resp = e?.response;
            const msg =
              resp?.data?.error?.message ||
              resp?.data?.error ||
              resp?.data?.message ||
              'Erro ao salvar funcionário';
            setStatus(msg);
            console.error('Salvar funcionário falhou:', resp?.data || e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="row g-3">
            {status && <Alert variant="warning">{String(status)}</Alert>}

            <div className="col-md-6">
              <label>Nome</label>
              <Field name="nome" className="form-control" />
              <div className="text-danger"><ErrorMessage name="nome" /></div>
            </div>

            <div className="col-md-6">
              <label>CPF</label>
              <Field name="cpf" className="form-control" />
              <div className="text-danger"><ErrorMessage name="cpf" /></div>
            </div>

            <div className="col-md-3">
              <label>Salário</label>
              <Field name="salario" type="number" step="0.01" className="form-control" />
              <div className="text-danger"><ErrorMessage name="salario" /></div>
            </div>

            <div className="col-md-3">
              <label>Admissão</label>
              <Field name="dataAdmissao" type="date" className="form-control" />
              <div className="text-danger"><ErrorMessage name="dataAdmissao" /></div>
            </div>

            <div className="col-md-6">
              <label>Email</label>
              <Field name="email" type="email" className="form-control" />
              <div className="text-danger"><ErrorMessage name="email" /></div>
            </div>

            <div className="col-12 d-flex gap-2">
              <Button type="submit" disabled={isSubmitting}>Salvar</Button>
              <Button variant="secondary" onClick={() => nav('/funcionarios')}>Cancelar</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
