import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import { getStoreDataRequest, updateStoreRequest } from '../../api/store.api';
import { useForm } from 'react-hook-form';

function Store() {
  const [dataStore, setDataStore] = useState([]);
  const nameStore = localStorage.getItem('storeName');
  const store = localStorage.getItem('number');
  const token = localStorage.getItem('token');
  const {_id} = jwtDecode(token);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    (async () => {
      const response = await getStoreDataRequest(store);
      const data = response.data;
      setDataStore(data);

      reset({
        storeName: data.name || '',
        contact: data.telephone || '',
        address: data.address || '',
      });
    })()
  }, [store]);

  const onSubmit = async (data) => {
    try {
      const response = await updateStoreRequest(store, data);
      reset();
      window.location.reload();
    } catch (error) {
      console.log(error)
        const result = error.response.data;
    }
  };

  if (!dataStore) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className='mx-5'>
      <div className="row mb-3 mt-3">
        <div className="d-flex justify-content-center" style={{gap: "10px"}}>
          <img
            src="/logos/store.png"
            alt=""
          />{' '}Tienda
        </div>
      </div>
      <div className='d-flex justify-content-between mt-2'>
        <div style={{width: '200px', height: '200px'}}>
          <img src={`/store/${nameStore}.png`} alt="" style={{width: '100%', height: '100%'}} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-50">
          <div className="mb-3">
            <label htmlFor="storeName" className="form-label">Nombre de la tienda</label>
            <input
              id="storeName"
              type="text"
              className={`form-control ${errors.storeName ? 'is-invalid' : ''}`}
              defaultValue={dataStore.name || ''}
              {...register('storeName', { required: 'El nombre de la tienda es obligatorio' })}
            />
            {errors.storeName && <div className="invalid-feedback">{errors.storeName.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="contact" className="form-label">Contacto</label>
            <input
              id="contact"
              type="text"
              className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
              defaultValue={dataStore.contact || ''}
              {...register('contact', {
                required: 'El contacto es obligatorio',
                pattern: {
                  value: /^[0-9]{7,10}$/,
                  message: 'El contacto debe ser un número válido (7 a 10 dígitos)',
                },
              })}
            />
            {errors.contact && <div className="invalid-feedback">{errors.contact.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Dirección</label>
            <input
              id="address"
              type="text"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              defaultValue={dataStore.address || ''}
              {...register('address', { required: 'La dirección es obligatoria' })}
            />
            {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
      </div>
    </div>
  )
}

export default Store;