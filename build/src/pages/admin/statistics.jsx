import React, { useState, useEffect } from 'react';
import {SalesChart} from '../../components/admin/SalesChart';

import { getSalesDateRequest } from '../../api/sales.api';

import Button from 'react-bootstrap/esm/Button';

function Statistics() {
    const id = localStorage.getItem('number');
    const [timePeriod, setTimePeriod] = useState('1d');
    const [salesData, setSalesData] = useState([]);


    useEffect(() => {
        const fetchSalesData = async () => {

            const response = await getSalesDateRequest(timePeriod);
            const data = await response.data;
            setSalesData(data);
        };

        fetchSalesData();
    }, [timePeriod]);

    return (
        <div className='p-2'>
            <div className="d-flex justify-content-center align-items-center mb-2">
                <img src="/logos/statistics.png" alt="" />{' '}Estadisticas
            </div>
            <div className='border p-2'>
                <div className='d-flex justify-content-between'>
                    <h3>Ventas de la tienda</h3>
                    <div className='d-flex' style={{gap: '5px'}}>
                        <Button onClick={() => setTimePeriod('1d')}>1D</Button>
                        <Button onClick={() => setTimePeriod('5d')}>5D</Button>
                        <Button onClick={() => setTimePeriod('1m')}>1M</Button>
                        <Button onClick={() => setTimePeriod('6m')}>6M</Button>
                        <Button onClick={() => setTimePeriod('1a')}>1A</Button>
                    </div>
                </div>
                <div>
                    {salesData.length > 0 ? (
                        <SalesChart salesData={salesData} />
                    ) : (
                        <p>Loading sales data...</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Statistics;