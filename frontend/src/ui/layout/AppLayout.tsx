import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore, AuthState } from '../../core/stores/auth.store';
import { menuVisible } from '../../core/auth/acl';

export default function AppLayout() {
  const nav = useNavigate();
  const { role, nome, email, logout, bootstrap } = useAuthStore(
    (s: AuthState) => s,
  );

  // reidrata caso recarregue a página
  if (!email && !role) bootstrap();
  const displayName = nome || email || 'Usuário';
  const visible = menuVisible(role ?? undefined);

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>SaudeMais</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              {/* Clientes sempre visível */}
              {visible.includes('clientes') && (
                <LinkContainer to="/clientes">
                  <Nav.Link>Clientes</Nav.Link>
                </LinkContainer>
              )}
              {visible.includes('funcionarios') && (
                <LinkContainer to="/funcionarios">
                  <Nav.Link>Funcionários</Nav.Link>
                </LinkContainer>
              )}
              {visible.includes('remedios') && (
                <LinkContainer to="/remedios">
                  <Nav.Link>Remédios</Nav.Link>
                </LinkContainer>
              )}
              {visible.includes('usuarios') && (
                <LinkContainer to="/usuarios">
                  <Nav.Link>Usuários</Nav.Link>
                </LinkContainer>
              )}
            </Nav>

            <div className="d-flex align-items-center gap-3">
              {/* Identificação do usuário */}
              <div className="text-end">
                <div className="fw-semibold">{displayName}</div>
                {role && (
                  <Badge
                    bg={
                      role === 'GERENTE'
                        ? 'primary'
                        : role === 'FARMACEUTICO'
                          ? 'success'
                          : 'secondary'
                    }
                  >
                    {role}
                  </Badge>
                )}
              </div>
              <Button
                variant="link"
                onClick={() => {
                  logout();
                  nav('/login');
                }}
              >
                Sair
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Outlet />
      </Container>
    </>
  );
}
