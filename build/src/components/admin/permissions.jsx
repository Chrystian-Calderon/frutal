import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { getPermissionsRequest } from '../../api/user.api';

function useUserPermissions(token) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!token) return;

    const { _id } = jwtDecode(token);

    const fetchPermissions = async () => {
      try {
        const response = await getPermissionsRequest(_id);
        setPermissions(response.data);
      } catch (error) {
        console.error('Error obteniendo los permisos:', error);
      }
    };

    fetchPermissions();
  }, [token]);

  return permissions;
}

export default useUserPermissions;