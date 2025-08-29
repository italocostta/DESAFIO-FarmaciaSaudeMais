import { Card, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <div className="container mt-5" style={{ maxWidth: 520 }}>
      <Card className="p-4">
        <h4 className="mb-3">Solicitar acesso</h4>
        <Alert variant="info">
          O cadastro de acesso é realizado por um <strong>GERENTE</strong> no sistema.
          Preencha seus dados para gerar uma solicitação (fluxo demonstrativo).
        </Alert>

        {/* Exemplo de formulário "falso" para futura integração */}
        <Form className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control placeholder="Seu nome" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email corporativo</Form.Label>
            <Form.Control type="email" placeholder="voce@empresa.com" />
          </Form.Group>
          <Button type="button" disabled>Enviar solicitação (em breve)</Button>
        </Form>

        <div className="d-flex gap-3">
          <Link to="/login" className="btn btn-secondary">Voltar ao login</Link>
          <Link to="/" className="btn btn-outline-primary">Ir para Home</Link>
        </div>
      </Card>
    </div>
  );
}
