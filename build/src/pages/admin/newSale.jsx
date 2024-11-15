import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';

import { getDistributorNameRequest } from '../../api/distributor.api';
import { getProductsAdditions, getProductsNameRequest } from '../../api/products.api';
import { createSaleRequest } from '../../api/sales.api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const NewSale = () => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [productsData, setProductsData] = useState([]);
    const [distributorsData, setDistributorsData] = useState([]);
    const [additions, setAdditions] = useState([]);
    const [totals, setTotals] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [payment, setPayment] = useState(0);

    const token = localStorage.getItem('token');
    const {_id} = jwtDecode(token);
    const store = localStorage.getItem('number');
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
          const response = await getProductsNameRequest();
          const data = await response.data;
          setProductsData(data);
        })()
    }, []);
 
    useEffect(() => {
        (async () => {
            const response = await getDistributorNameRequest();
            const data = await response.data;
            setDistributorsData(data);
        })()
    }, []);

    useEffect(() => {
        (async () => {
            const response = await getProductsAdditions();
            const data = await response.data;
            setAdditions(data);
            setTotals(Array(data.length).fill(0));
        })();
    }, []);

    const handleQuantityChange = (index, quantity) => {
        const price = additions[index].unitprice;
        const total = quantity * price;

        setTotals((prevTotals) => {
            const newTotals = [...prevTotals];
            newTotals[index] = total;
            return newTotals;
        });

        setValue(`additions.${index}.quantity`, quantity);
        setValue(`additions.${index}.total`, total);
    };

    const handleTotalChange = (index, total) => {
        setTotals((prevTotals) => {
            const newTotals = [...prevTotals];
            newTotals[index] = parseFloat(total) || 0;
            return newTotals;
        });

        setValue(`additions.${index}.total`, parseFloat(total) || 0);
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = productsData.find(p => p.idProduct == productId);

        if (product) {
            setSelectedProduct(product);
            setValue('product', productId);
            setValue('total', product.price);
            setPayment(0);
            setValue('paid', product.price);
        }
    };

    const handlePaymentChange = (e) => {
        const paymentValue = parseFloat(e.target.value) || 0;
        setPayment(paymentValue);
        const total = watch('total');
        const debt = total - paymentValue;
        setValue('paid', debt);
    };

    const onFormSubmit = async (data) => {
        console.log(data);
        try {
            const response = await createSaleRequest(data);
            navigate('/admin/sales');
            reset();
        } catch (error) {
            // const result = error.response.data;
            // console.log(result);
            console.log(error)
        }
    };

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
                <Col>
                    <input 
                        type="hidden" 
                        value={_id} 
                        {...register('idUser')}
                    />
                    <input 
                        type="hidden" 
                        value={store} 
                        {...register('idStore')}
                    />
                    <Form.Group>
                        <Form.Label htmlFor="date">Fecha</Form.Label>
                        <Form.Control type="date" {...register('date', {
                            required: {
                                value: true,
                                message: "La fecha es obligatoria"
                            }
                        })} />
                        {errors.fecha && <span style={{ color: 'var(--color-red)' }}>{errors.fecha.message}</span>}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="product">Seleccionar Producto</Form.Label>
                        <Form.Select defaultValue="" onChange={handleProductChange}>
                            <option value="" disabled>Seleccione un producto</option>
                            {productsData.map((producto, index) => (
                                <option key={index} value={producto.idProduct}>
                                    {producto.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="distributor">Distribuidores</Form.Label>
                        <Form.Select defaultValue="" {...register('distributor')}>
                            <option value="" disabled></option>
                            {distributorsData.map((distributor, index) => (
                                <option key={index} value={distributor.id}>
                                    {distributor.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {additions.map((addition, index) => {
                    return (<Form.Group key={index} className='d-flex align-items-center' style={{gap: '10px'}}>
                        <Form.Label>{addition.name}</Form.Label>
                        <Form.Control
                            type='hidden'
                            {...register(`additions.${index}.id`)}
                            defaultValue={addition.idProduct}
                        />
                        <Form.Control
                            type='text'
                            {...register(`additions.${index}.quantity`)}
                            placeholder='Cantidad'
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                        <Form.Control
                            type='text'
                            value={totals[index] ? totals[index].toFixed(2) : 0}
                            onChange={(e) => handleTotalChange(index, e.target.value)}
                            placeholder="Total"
                        />
                    </Form.Group>)
                    })}
                    
                </Col>

                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="due">Pago</Form.Label>
                        <Form.Control
                            type="number"
                            {...register('due', {
                                required: {
                                    value: true,
                                    message: "El pago es obligatorio"
                                },
                                validate: value => value >= 0 || "El pago no puede ser negativo"
                            })}
                            onChange={handlePaymentChange}
                            value={payment}
                        />
                        {errors.pago && <span style={{ color: 'var(--color-red)' }}>{errors.pago.message}</span>}
                    </Form.Group>

                    {/* Deuda */}
                    <Form.Group>
                        <Form.Label htmlFor="paid">Deuda</Form.Label>
                        <Form.Control
                            type="number"
                            {...register('paid', {
                                required: {
                                    value: true,
                                    message: "La deuda es obligatoria"
                                },
                                validate: value => value >= 0 || "La deuda no puede ser negativa"
                            })}
                        />
                        {errors.deuda && <span style={{ color: 'var(--color-red)' }}>{errors.deuda.message}</span>}
                    </Form.Group>

                    {selectedProduct && (
                        <Form.Group>
                            <Form.Label htmlFor="total">Total</Form.Label>
                            <Form.Control
                                type="number"
                                {...register('total')}
                                value={selectedProduct.price.toFixed(2)}
                                readOnly
                            />
                        </Form.Group>
                    )}
                </Col>
            </Row>

            <Button type="submit" className="mt-3">Guardar</Button>
        </Form>
    );
};

export default NewSale;