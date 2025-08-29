/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../core/api/axios';
import { useAuthStore } from '../../../core/stores/auth.store';

const schema = Yup.object({
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  password: Yup.string().required('Obrigatório'),
});

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const login = useAuthStore((s) => s.login);

  // rota de origem (quando RequireAuth redireciona pro login)
  const from = (loc.state as any)?.from || '/';

  return (
    <Card className="p-4 mx-auto" style={{ maxWidth: 420, marginTop: 64 }}>
      <h4 className="mb-3">Entrar</h4>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const { data } = await api.post('/auth/login', values);
            const token = data.access_token ?? data.token ?? data?.accessToken;
            if (!token) throw new Error('Token não encontrado');

            // salva sessão
            login({ token, user: data.user ?? null });
            localStorage.setItem('saudemais_token', token);

            // decide rota: volta para a de origem, senão por role
            const role = useAuthStore.getState().role;
            if (from && from !== '/login') {
              nav(from, { replace: true });
            } else if (role === 'FARMACEUTICO') {
              nav('/remedios', { replace: true });
            } else {
              // GERENTE ou ATENDENTE
              nav('/clientes', { replace: true });
            }
          } catch (e: any) {
            setStatus(e?.response?.data?.error ?? 'Falha na autenticação');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div className="mb-3">
              <label>Email</label>
              <Field name="email" type="email" className="form-control" />
              <div className="text-danger"><ErrorMessage name="email" /></div>
            </div>

            <div className="mb-3">
              <label>Senha</label>
              <Field name="password" type="password" className="form-control" />
              <div className="text-danger"><ErrorMessage name="password" /></div>
            </div>

            {status && <div className="text-danger mb-2">{String(status)}</div>}

            <Button type="submit" disabled={isSubmitting}>Entrar</Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
