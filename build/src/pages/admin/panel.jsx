import { useState, useEffect } from "react";

import { getStoreListRequest, getStoreMonthDayRequest, getStoreSalesRequest } from "../../api/store.api";

import {SalesBarsChart} from '../../components/admin/SalesChart';
import NavBarHeader from "../../components/admin/NavBarHeader";
import Carrousel from "../../components/admin/carrousel";
import SelectComponent from "../../components/admin/Select.component";
import MonthlyReportStores from "../../components/admin/monthlyReportStores";
import { jwtDecode } from "jwt-decode";
import { getUserStoreRequest } from "../../api/user.api";

function Panel() {
    const [salesData, setSalesData] = useState([]);
    const [storeData, setStoreData] = useState([]);
    const currentDate = new Date();
    const initialMonth = currentDate.getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const token = localStorage.getItem('token');
    const {_id, role, stores} = jwtDecode(token);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getUserStoreRequest(_id);
            const data = await response.data;
            setUserData(data);
        })()
    }, [_id]);

    useEffect(() => {
        const fetchStoreData = async () => {
            if (selectedMonth !== null) {
                let response;
                if (role == "Administrador" || role == 'Gerente') {
                    response = await getStoreMonthDayRequest({month: selectedMonth});
                } else {
                    response = await getStoreSalesRequest({month: selectedMonth});
                }
                const data = await response.data;
                setStoreData(data);
            }
        };

        fetchStoreData();
    }, [selectedMonth]);

    useEffect(() => {
        const fetchSalesData = async () => {
            if (selectedMonth !== null) {
                const response = await getStoreListRequest({month: selectedMonth});
                const data = await response.data;
                setSalesData(data);
            }
        };

        fetchSalesData();
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const months = [
        { value: '01', label: 'Enero' },
        { value: '02', label: 'Febrero' },
        { value: '03', label: 'Marzo' },
        { value: '04', label: 'Abril' },
        { value: '05', label: 'Mayo' },
        { value: '06', label: 'Junio' },
        { value: '07', label: 'Julio' },
        { value: '08', label: 'Agosto' },
        { value: '09', label: 'Septiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' },
    ];

    return (
        <div>
            <NavBarHeader username={userData.username} storeOn={false} />
            <div className="p-2">
                <h2>Tiendas</h2>
                <Carrousel storeData={storeData} role={role} id={_id} stores={stores}/>
                <div className="border p-2">
                    <div className="d-flex justify-content-between">
                        <h4>Ventas del mes</h4>
                        <div className="d-flex" style={{gap: "20px"}}>
                            <SelectComponent datas={months} selected={selectedMonth} handleChange={handleMonthChange} />
                            <MonthlyReportStores month={selectedMonth} />
                        </div>
                    </div>
                    <div>
                    {salesData.length > 0 ? (
                        <SalesBarsChart salesData={salesData} />
                        ) : 'sin datos'
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Panel;