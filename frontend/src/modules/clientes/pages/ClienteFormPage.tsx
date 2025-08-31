/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Alert } from 'react-bootstrap';
import { useCliente, useSaveCliente } from '../hooks/useClientes';

const emptyToUndef = (v: any) => (v === '' ? undefined : v);

const schema = Yup.object({
  nome: Yup.string().min(2).max(120).required('Obrigatório'),
  cpf: Yup.string().length(11, 'CPF deve ter 11 dígitos').required('Obrigatório'),
  telefone: Yup.string().transform(emptyToUndef).min(8).max(20).optional(),
  email: Yup.string().transform(emptyToUndef).email('Email inválido').optional(),
  endereco: Yup.string().transform(emptyToUndef).min(2).max(200).optional(),
});

export default function ClienteFormPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useCliente(id);
  const save = useSaveCliente();

  const defaults = { nome: '', cpf: '', telefone: '', email: '', endereco: '' };
  const initial = { ...defaults, ...(id && data ? data : {}) };

  if (id && isLoading && !data) return <div>Carregando...</div>;

  return (
    <Card className="p-4">
      <h5 className="mb-3">{id ? 'Editar Cliente' : 'Novo Cliente'}</h5>
      <Formik
        enableReinitialize
        initialValues={initial}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const payload = {
              ...values,
              telefone: values.telefone || undefined,
              email: values.email || undefined,
              endereco: values.endereco || undefined,
            };
            await save.mutateAsync({ ...payload, id: id ? Number(id) : undefined });
            nav('/clientes');
          } catch (e: any) {
            const resp = e?.response;
            const msg =
              resp?.data?.error?.message ||
              resp?.data?.error ||
              resp?.data?.message ||
              (resp?.status === 403
                ? 'Você não tem permissão para salvar este cliente.'
                : 'Erro ao salvar cliente');
            setStatus(msg);
            console.error('Salvar cliente falhou:', resp?.data || e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="row g-3">
            {status && (
              <div className="col-12">
                <Alert variant="warning" className="mb-2">{String(status)}</Alert>
              </div>
            )}

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

            <div className="col-md-6">
              <label>Email</label>
              <Field name="email" type="email" className="form-control" />
              <div className="text-danger"><ErrorMessage name="email" /></div>
            </div>

            <div className="col-md-6">
              <label>Telefone</label>
              <Field name="telefone" className="form-control" />
              <div className="text-danger"><ErrorMessage name="telefone" /></div>
            </div>

            <div className="col-12">
              <label>Endereço</label>
              <Field name="endereco" className="form-control" />
              <div className="text-danger"><ErrorMessage name="endereco" /></div>
            </div>

            <div className="col-12 d-flex gap-2">
              <Button type="submit" disabled={isSubmitting}>Salvar</Button>
              <Button variant="secondary" onClick={() => nav('/clientes')}>Cancelar</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
