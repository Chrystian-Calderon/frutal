import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import NavBarHeader from "../../components/admin/NavBarHeader";
import NavBar from '../../components/admin/Navbar';
import useUserPermissions from '../../components/admin/permissions';
import { jwtDecode } from 'jwt-decode';
import { getUserStoreRequest } from '../../api/user.api';
import { useEffect, useState } from 'react';

function Admin() {
    const token = localStorage.getItem('token');
    const {_id} = jwtDecode(token);
    const permissions = useUserPermissions(token);
    const userPermissions = permissions?.permission
    ? permissions.permission.split(',').map(p => p.trim())
    : [];
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getUserStoreRequest(_id);
            const data = await response.data;
            setUserData(data);
        })()
    }, [_id]);

    const location = useLocation();
    const noNavbarRoutes = ['/admin/panel'];
    return (
        <>
            {!noNavbarRoutes.includes(location.pathname) && <NavBarHeader username={userData.username} storeOn={true} />}
            <Container fluid style={{height: noNavbarRoutes.includes(location.pathname) ? '100vh' : 'calc(100vh - 56px)', width: '100vw'}} className='d-flex p-0'>
                {!noNavbarRoutes.includes(location.pathname) && (
                    <div style={{width: '250px'}} className="side-nav">
                        <NavBar permissions={userPermissions} />
                    </div>
                )}
                <div style={{width: noNavbarRoutes.includes(location.pathname) ? '100%' : 'calc(100vw - 250px)'}}>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </Container>
        </>
    )
}

export default Admin;