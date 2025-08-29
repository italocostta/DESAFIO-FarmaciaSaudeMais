/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuthStore, AuthState } from '../../core/stores/auth.store';

// quais cards cada role pode ver
const visibleByRole: Record<
  NonNullable<AuthState['role']>,
  Array<'clientes' | 'funcionarios' | 'remedios' | 'usuarios'>
> = {
  GERENTE: ['clientes', 'funcionarios', 'remedios', 'usuarios'],
  FARMACEUTICO: ['clientes', 'remedios'],
  ATENDENTE: ['clientes'],
};

type CardKey = 'clientes' | 'funcionarios' | 'remedios' | 'usuarios';

const CARDS: Array<{ key: CardKey; title: string; text: string; to: string }> = [
  { key: 'clientes',     title: 'Clientes',      text: 'Gerencie os clientes da farmácia.',               to: '/clientes' },
  { key: 'funcionarios', title: 'Funcionários',  text: 'Cadastro e manutenção de funcionários.',          to: '/funcionarios' },
  { key: 'remedios',     title: 'Remédios',      text: 'Estoque e cadastro de remédios.',                 to: '/remedios' },
  { key: 'usuarios',     title: 'Usuários',      text: 'Definir acesso e cargo (role) no sistema.',       to: '/usuarios' },
];

export default function HomePage() {
  const role = useAuthStore((s: AuthState) => s.role);

  // fallback seguro: se não houver role ainda, mostra só Clientes
  const visible = role ? visibleByRole[role] : ['clientes'];
  const cards = CARDS.filter(c => visible.includes(c.key));

  return (
    <div className="d-grid gap-3">
      <h3>Bem-vindo(a) ao SaudeMais</h3>

      <Row xs={1} md={2} lg={3} className="g-3">
        {cards.map(c => (
          <Col key={c.key}>
            <Card className="p-3 h-100">
              <h5 className="mb-2">{c.title}</h5>
              <p className="text-muted">{c.text}</p>
              <LinkContainer to={c.to}>
                <Button>Entrar</Button>
              </LinkContainer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
