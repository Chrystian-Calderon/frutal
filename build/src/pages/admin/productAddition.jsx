import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { createAdditionRequest, getAdditionRequest, updateAdditionRequest } from "../../api/products.api";

function ProductAddition() {
  const { id } = useParams(); // Para detectar si es edición
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handlePricePerPackChange = (event) => {
    const pricePerPack = parseFloat(event.target.value) || 0;
    const unitPrice = pricePerPack / 500;
    setValue("unitprice", unitPrice.toFixed(2));
  };

  useEffect(() => {
    if (id) {
      const fetchIcecream = async () => {
        try {
          const response = await getAdditionRequest(id);
          const { name, unitprice, priceperpack } = response.data;
          setValue("name", name);
          setValue("unitprice", unitprice);
          setValue("priceperpack", priceperpack);
        } catch (error) {
          console.error("Error fetching icecream data:", error);
        }
      };

      fetchIcecream();
    } else {
      reset();
    }
  }, [id, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await updateAdditionRequest(id, data);
        alert("Galleta actualizado con éxito");
      } else {
        await createAdditionRequest(data);
        alert("Galleta creado con éxito");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al guardar la galleta");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Galleta" : "Nuevo Galleta"}</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="priceperpack">
          <Form.Label>Precio del paquete</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el precio"
            {...register("priceperpack", { required: "El precio del paquete es obligatorio" })}
            onChange={handlePricePerPackChange}
          />
          {errors.price && <Form.Text className="text-danger">{errors.price.message}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="unitprice">
          <Form.Label>Precio unitario</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el precio"
            {...register("unitprice", { required: true })}
            readOnly
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate("/admin/products")}>
          Cancelar
        </Button>
      </Form>
    </div>
  );
}

export default ProductAddition;