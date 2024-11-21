import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/esm/Button';
import './Navbar.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ permissions }) => {
    const id = localStorage.getItem('number');
    const store = localStorage.getItem('store');
    const token = localStorage.getItem('token');
    const {role} = jwtDecode(token);
    const navigate = useNavigate();

    console.log(permissions)
    const handleClick = (name) => {
        navigate(`/admin/statistics/${name}`);
    }
    return (
        <div>
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand
                    onClick={() => navigate(`/admin/statistics/${store}`)}
                    style={{display: 'inline-block', width: '100%', margin: '0', color: '#fff', cursor: 'pointer'}}>
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
                            <Button onClick={() => navigate(`/admin/store`)} style={{width: '100%'}}>
                                <img src="/logos/store.png" alt="" />{' '}
                                Tienda
                            </Button>
                            {/* <Button href="/admin/profiles">
                                <img src="/logos/profile.png" alt="" />{' '}
                                Perfiles
                            </Button> */}
                            <Button onClick={() => navigate(`/admin/car`)} style={{width: '100%'}}>
                                <img src="/logos/car.png" alt="" />{' '}
                                Carritos
                            </Button>
                            <Button onClick={() => navigate(`/admin/products`)} style={{width: '100%'}}>
                                <img src="/logos/products.png" alt="" />{' '}
                                Productos
                            </Button>
                            {/* <Button href="/admin/control">
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
                        <Navbar.Brand onClick={() => navigate(`/admin/users`)} style={{color: '#fff', cursor: 'pointer'}}>
                            <img src="/logos/users.png" alt="" />{' '}
                            Usuarios
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            )}
            {permissions.includes('sales_view') && (
                <Navbar className="side-nav-bar">
                    <Container>
                        <Navbar.Brand onClick={() => navigate(`/admin/sales`)} style={{color: '#fff', cursor: 'pointer'}}>
                            <img src="/logos/sales.png" alt="" />{' '}
                            Ventas
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            )}
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand onClick={() => navigate(`/admin/reports`)} style={{color: '#fff', cursor: 'pointer'}}>
                        <img src="/logos/reports.png" alt="" />{' '}
                        Reportes
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand onClick={() => navigate(`/admin/help`)} style={{color: '#fff', cursor: 'pointer'}}>
                        <img src="/logos/help.png" alt="" />{' '}
                        Ayuda
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar className="side-nav-bar">
                <Container>
                    <Navbar.Brand onClick={() => navigate(`/admin/about`)} style={{color: '#fff', cursor: 'pointer'}}>
                        <img src="/logos/about.png" alt="" />{' '}
                        Acerca de
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavBar;