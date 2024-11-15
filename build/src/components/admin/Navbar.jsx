import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/esm/Button';
import './Navbar.css';
import { jwtDecode } from 'jwt-decode';

const NavBar = ({ permissions }) => {
    const id = localStorage.getItem('number');
    const store = localStorage.getItem('store');
    const token = localStorage.getItem('token');
    const {role} = jwtDecode(token);

    console.log(role)
    console.log(permissions)
    const handleClick = (name) => {
        navigate(`/admin/statistics/${name}`);
    }
    return (
        <div>
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand
                    href={`/admin/statistics/${store}`}
                    style={{display: 'inline-block', width: '100%', margin: '0'}}>
                        <img src="/logos/statistics.png" alt="" />{' '}
                        Estadisticas
                    </Navbar.Brand>
                </Container>
            </Navbar>
            {role == 'Administrador' || role == 'Gerente' ? (
                <Accordion style={{borderRadius: '0'}}>
                    <Accordion.Item eventKey="0" style={{border: 'none'}}>
                        <Accordion.Header>
                            <img src="/logos/control.png" alt="" />{' '}
                            Control de tienda
                        </Accordion.Header>
                        <Accordion.Body className='p-0'>
                            <Button href="/admin/store">
                                <img src="/logos/store.png" alt="" />{' '}
                                Tienda
                            </Button>
                            {/* <Button href="/admin/profiles">
                                <img src="/logos/profile.png" alt="" />{' '}
                                Perfiles
                            </Button> */}
                            <Button href="/admin/car">
                                <img src="/logos/car.png" alt="" />{' '}
                                Carritos
                            </Button>
                            {/* <Button href="/admin/products">
                                <img src="/logos/products.png" alt="" />{' '}
                                Productos
                            </Button>
                            <Button href="/admin/control">
                                <img src="/logos/control.png" alt="" />{' '}
                                Distribuidores
                            </Button> */}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            ) : null}
            {permissions.includes('users_view') && (
                <Navbar className="side-nav-bar">
                    <Container>
                        <Navbar.Brand href="/admin/users">
                            <img src="/logos/users.png" alt="" />{' '}
                            Usuarios
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            )}
            {permissions.includes('sales_view') && (
                <Navbar className="side-nav-bar">
                    <Container>
                        <Navbar.Brand href="/admin/sales">
                            <img src="/logos/sales.png" alt="" />{' '}
                            Ventas
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            )}
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand href="/admin/reports">
                        <img src="/logos/reports.png" alt="" />{' '}
                        Reportes
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand href="/admin/help">
                        <img src="/logos/help.png" alt="" />{' '}
                        Ayuda
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand href="/admin/about">
                        <img src="/logos/about.png" alt="" />{' '}
                        Acerca de
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavBar;