import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { createCarRequest, getCarRequest, updateCarRequest } from "../../api/car";
import { getDistributorNameRequest } from "../../api/distributor.api";

function CartForm() {
  const [distributorsData, setDistributorsData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      const fetchCart = async () => {
        try {
          const response = await getCarRequest(id);
          console.log(response)
          const { code, state, idPerson } = response.data;
          setValue("code", code);
          setValue("state", state);
          setValue("idPerson", idPerson || "");
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };

      fetchCart();
    } else {
      reset();
    }
  }, [id, setValue, reset]);

  useEffect(() => {
    (async () => {
        const response = await getDistributorNameRequest();
        const data = await response.data;
        setDistributorsData(data);
    })()
  }, []);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await updateCarRequest(id, data);
        alert("Carrito actualizado con éxito");
      } else {
        await createCarRequest(data);
        alert("Carrito creado con éxito");
      }
      navigate("/admin/car");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al guardar el carrito");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Carrito" : "Nuevo Carrito"}</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="code">
          <Form.Label>Código</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el código del carrito"
            {...register("code", { required: "El código es obligatorio" })}
          />
          {errors.code && (
            <Form.Text className="text-danger">{errors.code.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="state">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el estado del carrito"
            {...register("state", { required: "El estado es obligatorio" })}
          />
          {errors.state && (
            <Form.Text className="text-danger">{errors.state.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="idPerson">Distribuidores</Form.Label>
          <Form.Select defaultValue="" {...register('idPerson')}>
            <option value="" disabled></option>
            {distributorsData.map((distributor, index) => (
              <option key={index} value={distributor.id}>
                {distributor.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/")}
        >
          Cancelar
        </Button>
      </Form>
    </div>
  );
}

export default CartForm;