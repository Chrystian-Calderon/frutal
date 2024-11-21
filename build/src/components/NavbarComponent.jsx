import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const NavbarComponent = () => {
    const navigate = useNavigate();
    const noNavbarRoutes = ['/products', '/catalog', '/constact'];
    return (
        <div className='d-flex justify-content-between px-3' style={{position: 'relative'}}>
            <div></div>
            <div style={{width: '100px', height: '100px', position: 'absolute', zIndex: '3'}}>
                <img src="/logos/logo.jpeg" alt="logo" style={{width: '100%', height: '100%', borderRadius: '50%'}}/>
            </div>
            <Navbar>
                <Container>
                    <Nav>
                        <Nav.Link onClick={() => navigate('/')}>Inicio</Nav.Link>
                        <Nav.Link onClick={() => navigate('/products')}>Productos</Nav.Link>
                        <Nav.Link onClick={() => navigate('/catalog')}>Catalogo</Nav.Link>
                        <Nav.Link onClick={() => navigate('/contact')}>Contacto</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className='d-flex align-items-center'>
                {!noNavbarRoutes.includes(location.pathname) && <Button variant="primary" onClick={() => navigate('/login')}>Acceder</Button>}
            </div>
        </div>
    );
}

export default NavbarComponent;