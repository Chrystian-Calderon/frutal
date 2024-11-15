import { useLocation } from 'react-router-dom';

import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'

import { useForm } from "react-hook-form"
import { getLogin } from "../api/user.api";

function Login() {
    const { register, handleSubmit, formState: {errors}, reset } = useForm();
    const location = useLocation();
    const errorMessage = location.state?.error || '';

    const onSubmit = async (data) => {
        try {
            const response = await getLogin(data);

            if (response.data.result) {
                let token = response.data.token;
                localStorage.setItem('token', token);
                window.location.href = '/admin/panel';
            }
            reset();
        } catch (error) {
            const {result} = error.response.data;
            console.log(result);
        }
    };

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{height: '100vh', backgroundColor: "var(--color-columbia-blue)"}}>
            <div className='d-flex flex-column align-items-center' style={{color: 'var(--bg)'}}>
                <img src="/logos/logoUsers.png" alt="" />
                <h1 style={{fontFamily: "Roboto, sans-serif", fontWeight: "700"}}>BIENVENIDO</h1>
            </div>
            <div className="p-4" style={{border: '1px solid #000', borderRadius: '8px', backgroundColor: "var(--color-white)"}}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <InputGroup>
                        <Form.Label htmlFor="username" style={{width: "100%"}}>Usuario</Form.Label>
                        <InputGroup.Text id="addon-user"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                        <Form.Control type="text" aria-describedby="addon-user" {...register('username', {
                            required: {
                                value: true,
                                message: "Nombre es requerido"
                            }
                            }
                        )} />
                    </InputGroup>
                    <Form.Group className='m-2'>
                        {errors.username && <span style={{color: 'var(--color-red)'}}>{errors.username.message}</span>}
                    </Form.Group>
                    <InputGroup>
                        <Form.Label htmlFor="password" style={{width: "100%"}}>Contraseña</Form.Label>
                        <InputGroup.Text id="addon-user"><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                        <Form.Control type="password" {...register('password', {
                            required: {
                                value: true,
                                message: "Contraseña necesaria"
                            },
                            minLength: {
                                value: 6,
                                message: "Debe ser más de 6 caracteres de longitud"
                            }
                        })} />
                    </InputGroup>
                    <Form.Group className='m-2'>
                        {errors.password && <span style={{color: 'var(--color-red)'}}>{errors.password.message}</span>}
                    </Form.Group>
                    <Button type="submit" style={{width: "100%", backgroundColor: "var(--bg)", color: "var(--color-white)"}}>Acceder</Button>
                </Form>
            </div>
        </Container>
    )
}

export default Login;