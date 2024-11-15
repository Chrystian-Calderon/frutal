import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

const NavBarHeader = ({ username, storeOn }) => {
    const store = storeOn ? localStorage.getItem('storeName') : null;
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };
    return (
        <Navbar className="header-nav" style={{height: '56px'}}>
            <div className='d-flex justify-content-between align-items-center px-4' style={{width: '100%'}}>
                <NavDropdown title={username} id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/admin/panel">Panel</NavDropdown.Item>
                    <NavDropdown.Item href="#salir" onClick={handleLogout}>Cerrar session</NavDropdown.Item>
                </NavDropdown>
                {store ?
                    <Navbar.Brand href="#home" style={{color: '#fff'}}>
                        <img
                        alt=""
                        src={`/store/${store}.png`}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        />{' ' + store}
                    </Navbar.Brand>
                    : ''}
            </div>
        </Navbar>
    )
}

export default NavBarHeader