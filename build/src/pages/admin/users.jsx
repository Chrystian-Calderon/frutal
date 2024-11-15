import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { getUsersRequest } from "../../api/user.api";

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/esm/Button";

function Users() {
    const [usersData, setUsersData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const recordsPerPage = 5;

    const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = usersData.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(usersData.length / recordsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const fetchUsersData = async () => {
            const response = await getUsersRequest();
            const data = await response.data;
            console.log(data);
            setUsersData(data);
        };

        fetchUsersData();
    }, []);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/admin/newUser');
    };

    const editClick = (id) => {
        const data = {
            idPerson: id
        };
        navigate('/admin/editUser', {state: data});
    };
    
    const deleteClick = (id) => {
        alert("Eliminar" + id);
    }

    return (
        <>
            <Container className="py-3">
                <div className="d-flex justify-content-center align-items-center mb-2">
                    <img src="/logos/users.png" alt="" />{' '}Usuarios
                </div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <span>Buscar  </span>
                        <Form className="d-flex">
                            <Form.Control
                            type="search"
                            placeholder="Buscar usuario"
                            className="me-2"
                            aria-label="Search"
                            />
                        </Form>
                    </div>
                    <div>
                        <Button onClick={handleClick}>Nuevo usuario</Button>
                    </div>
                </div>
                <div className="p-2 mt-4" style={{backgroundColor: 'var(--color-columbia-blue)', borderRadius: '7px'}}>
                    <div className="d-flex justify-content-between">
                        <h3>Usuarios</h3>
                        <div>
                            <span>Página {currentPage + 1} de {totalPages}</span>
                        </div>
                        <div>
                            <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                                &lt; {/* Botón de izquierda */}
                            </button>
                            <span>{currentPage + 1}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                                &gt; {/* Botón de derecha */}
                            </button>
                        </div>
                    </div>
                    <Table responsive style={{borderRadius: '5px'}}>
                        <thead>
                            <tr>
                                <td>N°</td>
                                <td>Usuario</td>
                                <td>Tienda</td>
                                <td>Celular</td>
                                <td>Email</td>
                                <td>Acciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((user, index) => (
                                    <tr key={user.idPerson}>
                                        <td>{indexOfFirstRecord + index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{(user.name) ? user.name : 'Sin asignar'}</td>
                                        <td>{user.cellular}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <div className="d-flex justify-content-around" style={{width: '100%'}}>
                                                <Button className="btn btn-info" onClick={() => editClick(user.idPerson)}>Editar</Button>
                                                <Button className="btn btn-danger" onClick={() => deleteClick(user.idPerson)}><FontAwesomeIcon icon={faTrash} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    )
}

export default Users;