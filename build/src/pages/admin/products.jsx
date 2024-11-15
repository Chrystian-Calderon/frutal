import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from "react-bootstrap/esm/Button";

import { getProductsRequest } from '../../api/products.api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '', stock: 0 });
    const [currentPage, setCurrentPage] = useState(0);

    const recordsPerPage = 6;
    const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);

    const totalPages = Math.ceil(products.length / recordsPerPage);

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
        (async () => {
            try {
                const response = await getProductsRequest();
                const data = response.data;
                setProducts(data);
            } catch (error) {
                console.error('Error al obtener productos', error);
            }
        })();
    }, []);

    const createProduct = async () => {
        try {
            await axios.post('http://localhost:5000/api/products', newProduct);
            fetchProducts();
        } catch (error) {
            console.error('Error al crear producto', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error al eliminar producto', error);
        }
    };

    return (
        <div>
            <h2>Lista de Productos</h2>
            <input type="text" placeholder="Nombre" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input type="number" placeholder="Precio" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <input type="text" placeholder="Descripción" onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            <input type="number" placeholder="Stock" onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
            <button onClick={createProduct}>Crear Producto</button>

            <div className="row">
                <div className="col mx-2 p-2" style={{backgroundColor: 'var(--color-columbia-blue)', borderRadius: '7px'}}>
                    <div className="d-flex justify-content-between">
                        <h5>Ventas</h5>
                        <div></div>
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
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((product, key) => (
                                <tr key={product.idProduct}>
                                    <td>{indexOfFirstRecord + key + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <div className="d-flex justify-content-around" style={{width: '100%'}}>
                                            <Button className="btn btn-info" onClick={() => editClick(product.idProduct)}>Editar</Button>
                                            <Button className="btn btn-danger" onClick={() => deleteClick(product.idProduct)}><FontAwesomeIcon icon={faTrash} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
