import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { deleteProductRequest, getProductsRequest } from '../../api/products.api';
import { useNavigate } from 'react-router-dom';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const recordsPerPage = 6;
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredProducts.slice(indexOfFirstRecord, indexOfLastRecord);

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
        const fetchProducts = async () => {
            try {
                const response = await getProductsRequest();
                console.log(response.data)
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este producto?");
    if (confirm) {
      try {
        await deleteProductRequest(id);
        setProducts((prev) => prev.filter((product) => product.idProduct !== id));
        alert("Producto eliminado correctamente");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error al eliminar el producto");
      }
    }
  };


  return (
    <div className="container mt-4">
        <div className="row mb-3">
            <div className="d-flex justify-content-center" style={{gap: "10px"}}>
            <img
                src="/logos/products.png"
                alt=""
                />{' '}Productos
            </div>
        </div>
      <div className="d-flex justify-content-between align-items-center mb-3" style={{gap: '20px'}}>
        <div className='d-flex align-items-center' style={{gap: '10px', width: '40%'}}>
            Buscar:
            <Form.Control
                type="text"
                placeholder="Buscar producto por nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className='d-flex'>
          <Button onClick={() => navigate("/admin/newIcecream")} className="me-2">
            Añadir Helado
          </Button>
          <Button onClick={() => navigate("/admin/newAddition")}>Añadir galleta</Button>
        </div>
      </div>
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
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRecords.map((product, index) => (
                        <tr key={product.idProduct}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.typeProduct === "cream_icecream" ? "Helado" : "Galleta"}</td>
                        <td>
                            <Button
                            variant="info"
                            onClick={() =>
                                navigate(
                                `/admin/edit${
                                    product.typeProduct === "cream_icecream" ? "Icecream" : "Addition"
                                }/${product.idProduct}`
                                )
                            }
                            className="me-2"
                            >
                            Editar
                            </Button>
                            <Button
                            variant="danger"
                            onClick={() => handleDelete(product.idProduct)}
                            >
                            Eliminar
                            </Button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    </div>
  );
}
export default ProductList;
