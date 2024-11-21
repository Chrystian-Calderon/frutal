import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { createIcecreamRequest, getIcecreamRequest, updateIcecreamRequest } from "../../api/products.api";

function ProductIcecream() {
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
        (async () => {
            try {
              const response = await getIcecreamRequest(id);
              const { name, capacity, type, price } = response.data;
              setValue("name", name);
              setValue("capacity", capacity);
              setValue("type", type);
              setValue("price", price);
            } catch (error) {
              console.error("Error fetching icecream data:", error);
            }
        })();
    } else {
      reset();
    }
  }, [id, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await updateIcecreamRequest(id, data)
        alert("Helado actualizado con éxito");
      } else {
        await createIcecreamRequest(data);
        alert("Helado creado con éxito");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al guardar el helado");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Helado" : "Nuevo Helado"}</h2>
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

        <Form.Group className="mb-3" controlId="capacity">
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la capacidad"
            {...register("capacity", { required: "La capacidad es obligatoria" })}
          />
          {errors.capacity && (
            <Form.Text className="text-danger">{errors.capacity.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="type">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
                {...register("type", {
                required: "El tipo es obligatorio",
                validate: (value) =>
                    value !== "seleccionar" || "Debe seleccionar un tipo válido",
                })}
            >
                <option value="seleccionar">Seleccionar tipo</option>
                <option value="plancha">Plancha</option>
                <option value="lata">Lata</option>
            </Form.Select>
            {errors.type && <Form.Text className="text-danger">{errors.type.message}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el precio"
            {...register("price", { required: "El precio es obligatorio" })}
          />
          {errors.price && <Form.Text className="text-danger">{errors.price.message}</Form.Text>}
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

export default ProductIcecream;