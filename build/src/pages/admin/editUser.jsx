import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getUserRequest, updateUserRequest } from "../../api/user.api";
import { getProfileRequest } from "../../api/profile.api";
import { getStoreNameRequest } from "../../api/store.api";

function EditUser() {
    const { register, handleSubmit, setValue, formState: {errors}, reset } = useForm();

    const [userData, setUserData] = useState([]);
    const [profileData, setProfileData] = useState([]);
    const [storeListData, setStoreListData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            const id = location.state.idPerson;
            const response = await getUserRequest(id);
            const data = await response.data;
            console.log(data);
            setUserData(data);
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const response = await getProfileRequest();
            const data = await response.data;
            console.log(data);
            setProfileData(data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await getStoreNameRequest();
            const data = await response.data;
            console.log(data);
            setStoreListData(data);
        })();
    }, []);

    useEffect(() => {
        if (userData) {
            setValue('name', userData.name_user);
            setValue('lastname', userData.lastname);
            setValue('username', userData.username);
            setValue('cellular', userData.cellular);
            setValue('email', userData.email);
            setValue('profile', userData.idProfile);
            setValue('store', userData.idStore);
        }
    }, [userData, setValue]);

    const onSubmit = async (data) => {
        try {
            const id = location.state.idPerson;
            const response = await updateUserRequest(id, data);
            console.log(response.data);
            navigate('/admin/users');
            reset();
        } catch (error) {
            const result = error.response.data;
            console.log(result);
        }
    };
    return (
        <div className="p-2">
            <h1>Editar usuario</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col>
                            <Form.Group>
                                <Form.Label htmlFor="name">Nombre</Form.Label>
                                <Form.Control type="text" {...register('name', {
                                    required: {
                                        value: true,
                                        message: "Nombre es requerido"
                                    },
                                    pattern: {
                                        value: /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/,
                                        message: "No se permiten caracteres especiales"
                                    }
                                    }
                                )} />
                            </Form.Group>
                            <Form.Group className='m-2'>
                                {errors.name && <span style={{color: 'var(--color-red)'}}>{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="username">Nombre de usuario</Form.Label>
                                <Form.Control type="text" {...register('username', {
                                    required: {
                                        value: true,
                                        message: "Nombre de usuario necesario"
                                    },
                                    min: {
                                        value: 6,
                                        message: "Debe ser más de 6 caracteres"
                                    }
                                })} />
                            </Form.Group>
                            <Form.Group className='m-2'>
                                {errors.username && <span style={{color: 'var(--color-red)'}}>{errors.username.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="lastname">Apellidos</Form.Label>
                                <Form.Control type="text" {...register('lastname', {
                                    required: {
                                        value: true,
                                        message: "Apellidos necesarios"
                                    },
                                    pattern: {
                                        value: /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/,
                                        message: "No se permiten caracteres especiales"
                                    }
                                })} />
                            </Form.Group>
                            <Form.Group className='m-2'>
                                {errors.lastname && <span style={{color: 'var(--color-red)'}}>{errors.lastname.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="password">Nueva contraseña (opcional)</Form.Label>
                                <Form.Control type="password" {...register('password')} />
                            </Form.Group>
                            <Form.Group className='m-2'>
                                {errors.password && <span style={{color: 'var(--color-red)'}}>{errors.password.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="cellular">Celular</Form.Label>
                                <Form.Control type="text" {...register('cellular', {
                                    required: {
                                        value: true,
                                        message: "Num. celular necesario"
                                    },
                                    min: {
                                        value: 8,
                                        message: "Numero no valido"
                                    },
                                    pattern: {
                                        value: /^[0-9,$]*$/,
                                        message: "Deben ser solo números"
                                    }
                                })} />
                            </Form.Group>
                            <Form.Group className='m-2'>
                                {errors.cellular && <span style={{color: 'var(--color-red)'}}>{errors.cellular.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="profile">Asignar perfil</Form.Label>
                                <Form.Select 
                                    defaultValue=""
                                    option={profileData}
                                    {...register('profile', {
                                    required: {
                                        value: true,
                                        message: "Debe seleccionar un perfil"
                                    }
                                })}>
                                    <option value="" disabled hidden></option>
                                    {profileData.map((profile, index) => (
                                        <option key={index} value={profile.id}>{profile.role}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='m-2'>
                                {errors.profile && <span style={{color: 'var(--color-red)'}}>{errors.profile.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="email">Correo electrónico (Opcional)</Form.Label>
                                <Form.Control type="email" {...register('email', {
                                    pattern: {
                                        value: /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/,
                                        message: "Correo electrónico no valido"
                                    }
                                })} />
                            </Form.Group>
                            <Form.Group className='m-2'>
                                {errors.email && <span style={{color: 'var(--color-red)'}}>{errors.email.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Label htmlFor="store">Asignar tienda (Opcional)</Form.Label>
                            <Form.Select 
                                defaultValue="" 
                                option={storeListData}
                                {...register('store')}>
                                <option value="" disabled hidden></option>
                                {storeListData.map((store, index) => (
                                    <option key={index} value={store.idStore}>{store.name}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Button type="submit">Guardar</Button>
                </Form>
        </div>
    )
}

export default EditUser;