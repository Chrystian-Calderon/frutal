import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { getDistributorNameRequest } from '../../api/distributor.api';
import { getProductsAdditions, getProductsNameRequest } from '../../api/products.api';
import { getSaleRequest, updateSaleRequest } from '../../api/sales.api';
import { useNavigate, useLocation } from 'react-router-dom';

const formatDate = (date) => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Añade el 0 delante si es necesario
    const day = String(date.getDate()).padStart(2, '0');        // Añade el 0 delante si es necesario
    
    return `${year}-${month}-${day}`;
  };

const EditSale = () => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [productsData, setProductsData] = useState([]);
    const [distributorsData, setDistributorsData] = useState([]);
    const [saleData, setSaleData] = useState([]);
    const [additions, setAdditions] = useState([]);
    const [totals, setTotals] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [payment, setPayment] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            const id = location.state.id;
            const response = await getSaleRequest(id);
            const data = await response.data;
            setSaleData(data);
        })()
    }, [])

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

    const onFormSubmit = async (data) => {
        try {
            const id = location.state.id;
            const response = await updateSaleRequest(id, data);

            navigate('/admin/sales');
            reset();
        } catch (error) {
            // const result = error.response.data;
            // console.log(result);
            console.log(error)
        }
    };

    useEffect(() => {
        if (saleData) {
            setValue('date', formatDate(saleData.date));
            setValue('product', saleData.idProduct);
            setValue('distributor', saleData.idDistributor);
            setValue('due', saleData.amountPaid);
            setValue('paid', saleData.total - saleData.amountPaid);
            setValue('total', saleData.total);
            additions.forEach((addition, index) => {
                const saleProduct = saleData.addition_products?.[index];
            
                if (saleProduct && addition.name === saleProduct.name) {
                    setValue(`additions.${index}.total`, saleProduct.price);
                }
            });
        }
    }, [saleData, setValue, additions]);

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

    useEffect(() => {
        (async () => {
            const response = await getProductsAdditions();
            const data = await response.data;
            setAdditions(data);
            setTotals(Array(data.length).fill(0));
        })();
    }, []);

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

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
                <Col>
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
                        <Form.Select defaultValue={saleData.idProduct || ""} {...register('product')} onChange={handleProductChange}>
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
                            type='number'
                            {...register(`additions.${index}.quantity`)}
                            defaultValue={saleData.addition_products?.find(ap => ap.name === addition.name)?.quantity ?? addition.quantity}
                            placeholder='Cantidad'
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                        <Form.Control
                            type='number'
                            {...register(`additions.${index}.total`)}
                            defaultValue={saleData.addition_products?.find(ap => ap.name === addition.name)?.price.toFixed(2) ?? addition.price}
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

                    {selectedProduct ? (
                        <Form.Group>
                            <Form.Label htmlFor="total">Total</Form.Label>
                            <Form.Control
                                type="number"
                                {...register('total')}
                                value={selectedProduct.price.toFixed(2)}
                                readOnly
                            />
                        </Form.Group>
                    ) : (
                        <Form.Group>
                            <Form.Label htmlFor="total">Total</Form.Label>
                            <Form.Control
                                type="number"
                                {...register('total')}
                                value={saleData.total || ''}
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

export default EditSale;