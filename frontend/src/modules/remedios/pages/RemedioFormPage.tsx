/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Alert } from 'react-bootstrap';
import { useRemedio, useSaveRemedio } from '../hooks/useRemedios';

const emptyToUndef = (v: any) => (v === '' ? undefined : v);

const schema = Yup.object({
  nomeComercial: Yup.string().min(2).max(120).required('Obrigatório'),
  principioAtivo: Yup.string().min(2).max(120).required('Obrigatório'),
  fabricante: Yup.string().transform(emptyToUndef).min(2).max(120).optional(),
  preco: Yup.number().min(0.01).required('Obrigatório'),
  receitaObrigatoria: Yup.boolean().required('Obrigatório'),
  estoque: Yup.number().min(0).required('Obrigatório'),
});

export default function RemedioFormPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useRemedio(id);
  const save = useSaveRemedio();

  const defaults = { nomeComercial:'', principioAtivo:'', fabricante:'', preco:0, receitaObrigatoria:false, estoque:0 };
  const initial = { ...defaults, ...(id && data ? data : {}) };

  if (id && isLoading && !data) return <div>Carregando...</div>;

  return (
    <Card className="p-4">
      <h5 className="mb-3">{id ? 'Editar Remédio' : 'Novo Remédio'}</h5>
      <Formik
        enableReinitialize
        initialValues={initial}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const payload = {
              ...values,
              fabricante: values.fabricante || undefined,
              preco: Number(values.preco),
              estoque: Number(values.estoque),
              // Field select/checkbox pode vir como string: coagir para boolean
              receitaObrigatoria: typeof values.receitaObrigatoria === 'string'
                ? values.receitaObrigatoria === 'true'
                : Boolean(values.receitaObrigatoria),
            };
            await save.mutateAsync({ ...payload, id: id ? Number(id) : undefined });
            nav('/remedios');
          } catch (e: any) {
            const resp = e?.response;
            const msg =
              resp?.data?.error?.message ||
              resp?.data?.error ||
              resp?.data?.message ||
              (resp?.status === 403
                ? 'Você não tem permissão para salvar remédios (requer FARMACÊUTICO).'
                : 'Erro ao salvar remédio');
            setStatus(msg);
            console.error('Salvar remédio falhou:', resp?.data || e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="row g-3">
            {status && <Alert variant="warning">{String(status)}</Alert>}

            <div className="col-md-6"><label>Nome comercial</label><Field name="nomeComercial" className="form-control"/><div className="text-danger"><ErrorMessage name="nomeComercial"/></div></div>
            <div className="col-md-6"><label>Princípio ativo</label><Field name="principioAtivo" className="form-control"/><div className="text-danger"><ErrorMessage name="principioAtivo"/></div></div>
            <div className="col-md-6"><label>Fabricante</label><Field name="fabricante" className="form-control"/><div className="text-danger"><ErrorMessage name="fabricante"/></div></div>
            <div className="col-md-3"><label>Preço</label><Field name="preco" type="number" step="0.01" className="form-control"/><div className="text-danger"><ErrorMessage name="preco"/></div></div>
            <div className="col-md-3"><label>Estoque</label><Field name="estoque" type="number" className="form-control"/><div className="text-danger"><ErrorMessage name="estoque"/></div></div>
            <div className="col-12">
              <label className="me-2">Receita obrigatória?</label>
              <Field as="select" name="receitaObrigatoria" className="form-select" style={{ maxWidth: 200 }}>
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </Field>
              <div className="text-danger"><ErrorMessage name="receitaObrigatoria"/></div>
            </div>

            <div className="col-12 d-flex gap-2">
              <Button type="submit" disabled={isSubmitting}>Salvar</Button>
              <Button variant="secondary" onClick={()=>nav('/remedios')}>Cancelar</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
