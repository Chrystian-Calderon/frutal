import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";

import { deleteSaleRequest, getSalesRequest } from '../../api/sales.api';
import { getProductsNameRequest } from "../../api/products.api";
import SelectComponent from "../../components/admin/Select.component";

function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [searchDistributor, setSearchDistributor] = useState("");
  const number = localStorage.getItem('number');

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchDistributor(event.target.value);
  };

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
    const fetchSalesData = async () => {
      const response = await getSalesRequest(number);
      const data = await response.data;
      console.log(data)
      setSalesData(data);
    };

    fetchSalesData();
  }, [number]);

  useEffect(() => {
    (async () => {
      const response = await getProductsNameRequest();
      const data = await response.data;
      setProductsData(data);
    })()
  }, []);

  const groupedSales = salesData.reduce((acc, current) => {
    const existingSale = acc.find(sale => sale.idSale === current.idSale);

    if (existingSale) {
        existingSale.addition_products.push({
            name: current.addition_product,
            quantity: current.quantity,
            price: current.price
        });
    } else {
        acc.push({
            idSale: current.idSale,
            name_user: current.name_user,
            date: current.date,
            name_product: current.name_product,
            addition_products: [{
                name: current.addition_product,
                quantity: current.quantity,
                price: current.price
            }],
            distributor_name: current.distributor_name,
            total: current.total,
            amountPaid: current.amountPaid
        });
    }
    return acc;
  }, [salesData]);

  const filteredSales = groupedSales.filter(sale => 
    (selectedProduct === "" || sale.name_product === selectedProduct) && 
    (searchDistributor === "" || sale.distributor_name.toLowerCase().includes(searchDistributor.toLowerCase()))
  );

  const recordsPerPage = 5;
  const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSales.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSales.length / recordsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const datas = productsData.map((product) => ({
    value: product.id,
    label: product.name
  }));

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/admin/newSale');
  };

  const editClick = (id) => {
    const data = {
        id: id
    };
    navigate('/admin/editSale', {state: data});
};

  const deleteClick = async (id) => {
    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar el elemento con ID ${id}?`);

    if (confirmed) {
      try {
        const response = await deleteSaleRequest(id);

        if (response.ok) {
          alert("Elemento eliminado correctamente");
        } else {
          alert("Error al eliminar el elemento");
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Error al eliminar el elemento");
      }
    }
}

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="d-flex justify-content-center" style={{gap: "10px"}}>
          <img
            src="/logos/sales.png"
            alt=""
          />{' '}Ventas
        </div>
      </div>

      {/* Segundo div: Buscador y botones a la derecha */}
      <div className="row mb-3 d-flex justify-content-between">
        <div className="col d-flex align-items-center">
          Buscar: 
          <input
            type="text"
            className="form-control"
            placeholder="Buscar distribuidor"
            value={searchDistributor}
            onChange={handleSearchChange}
            style={{margin: '0 10px'}}
          />
          <SelectComponent datas={datas} selected={selectedProduct} handleChange={handleProductChange} />
        </div>
        <div className="col-auto d-flex justify-content-end">
          <Button onClick={handleClick}>Nueva venta</Button>
        </div>
      </div>

      {/* Tercer div: Tabla */}
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
                <th>Usuario</th>
                <th>Distribuidor</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Galletas</th>
                <th>Pago</th>
                <th>Deuda</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {salesData && salesData.length > 0 ? (currentRecords.map((sales, key) => (
                <tr key={sales.idSale}>
                  <td>{indexOfFirstRecord + key + 1}</td>
                  <td>{sales.name_user}</td>
                  <td>{sales.distributor_name}</td>
                  <td>{formatDate(sales.date)}</td>
                  <td>{sales.name_product}</td>
                  <td>
                  <Form.Group controlId="productSelect">
                    <Form.Control as="select">
                        <option value="">Galletas</option>
                        {sales.addition_products.map((item, index) => (
                            <option key={index} value={item.name}>{item.name + ' ' + item.quantity + 'unid. a ' + item.price + 'Bs'}</option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  </td>
                  <td>{sales.amountPaid}</td>
                  <td>{(sales.total - sales.amountPaid)}</td>
                  <td>{sales.total}</td>
                  <td>
                    <div className="d-flex justify-content-around" style={{width: '100%'}}>
                      <Button className="btn btn-info" onClick={() => editClick(sales.idSale)}>Editar</Button>
                      <Button className="btn btn-danger" onClick={() => deleteClick(sales.idSale)}><FontAwesomeIcon icon={faTrash} /></Button>
                    </div>
                  </td>
                </tr>
              ))) : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;