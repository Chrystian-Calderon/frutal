import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { deleteCarRequest, getCarsRequest } from "../../api/car";

function Car() {
  const [carList, setCarList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarList = async () => {
      try {
        const response = await getCarsRequest();
        setCarList(response.data);
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };

    fetchCarList();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este carrito?");
    if (confirm) {
      try {
        await deleteCarRequest(id);
        setCarList((prev) => prev.filter((car) => car.code !== id));
        alert("Carrito eliminado correctamente");
      } catch (error) {
        console.error("Error deleting cart:", error);
        alert("Error al eliminar el carrito");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Carritos</h2>
        <Button onClick={() => navigate("/admin/newCart")}>Nuevo Carrito</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Distribuidor Asociado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carList.map((car, index) => (
            <tr key={car.id}>
              <td>{index + 1}</td>
              <td>{car.code}</td>
              <td>{car.state}</td>
              <td>{car.name || "Sin asignar"}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => navigate(`/admin/editCart/${car.code}`)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(car.code)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Car;
