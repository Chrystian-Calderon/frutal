import { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { verifyTokenRequest } from '../api/user.api';

const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

const verifyToken = async (token) => {
    try {
        const response = await verifyTokenRequest(token);
        if (!response.data.ok) throw new Error('Token inválido');
        return true;
      } catch (error) {
        return false;
      }
}

const ProtectedRoute = ({ children }) => {
    const [isAuthtenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        (async () => {
            if (token) {
                const isValid = await verifyToken(token);
                setIsAuthenticated(isValid);
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        })();
    }, [token]);
    
    if (isLoading) {
        return <p>Cargando...</p>;
    }

    if (!isAuthtenticated) return <Navigate to="/login" state={{error: 'Hubo un problema con tu sesión. Inicia sesión nuevamente para continuar'}} />
    if (isTokenExpired(token)) return <Navigate to="/login" state={{error: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'}} />

    return children;
}

export default ProtectedRoute;