import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { getSalesReportRequest } from "../../api/sales.api";
import SelectComponent from "../../components/admin/Select.component";
import Form from "react-bootstrap/Form"
import { getStoreNameRequest } from "../../api/store.api";

function Reports() {
    const [timePeriod, setTimePeriod] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const currentDate = new Date();
    const initialMonth = currentDate.getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedStore, setSelectedStore] = useState("");
    const [storeListData, setStoreListData] = useState([]);

    // useEffect(() => {
    //     const fetchSalesData = async () => {

    //         const response = await getSalesReportRequest(timePeriod);
    //         const data = await response.data;
    //         setSalesData(data);
    //     };

    //     fetchSalesData();
    // }, [timePeriod]);

    useEffect(() => {
        (async () => {
            const response = await getStoreNameRequest();
            const data = await response.data;
            setStoreListData(data);
        })();
    }, []);

    const fetchDataByMonth = async () => {
        try {
            const response = await getSalesReportRequest(selectedStore, undefined ,selectedMonth);
            const result = await response.data;
            console.log(result)
            setSalesData(result); // Asegúrate de usar setSalesData aquí
        } catch (error) {
            console.error("Error al obtener datos por mes:", error);
        }
    };
    
    const fetchDataByTimePeriod = async () => {
        try {
            const response = await getSalesReportRequest(selectedStore, timePeriod, undefined);
            const result = await response.data; // Cambiado a .data
            setSalesData(result); // Asegúrate de usar setSalesData aquí
        } catch (error) {
            console.error("Error al obtener datos por periodo de tiempo:", error);
        }
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleStoreChange = (event) => {
        setSelectedStore(event.target.value);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Ventas", 20, 10);
    
        doc.autoTable({
          head: [["#", "Usuario", "Distribuidor", "Fecha", "Productos", "Galletas", "Pago", "Deuda", "Total"]],
          body: salesData.map((sales, key) => [
            key + 1,
            sales.name_user,
            sales.distributor_name,
            formatDate(sales.date),
            sales.name_product,
            sales.addition_product,
            sales.amountPaid,
            sales.total - sales.amountPaid,
            sales.total
          ]),
        });
    
        doc.save("reporte_ventas.pdf");
      };
    
      const exportToExcel = () => {
        const excelData = salesData.map((sales, key) => ({
          "#": key + 1,
          Usuario: sales.name_user,
          Distribuidor: sales.distributor_name,
          Fecha: formatDate(sales.date),
          Productos: sales.name_product,
          Galletas: sales.addition_product,
          Pago: sales.amountPaid,
          Deuda: sales.total - sales.amountPaid,
          Total: sales.total
        }));
    
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reporte de Ventas");
        XLSX.writeFile(wb, "reporte_ventas.xlsx");
      };

    return (
        <div className='p-2'>
            <div className="d-flex justify-content-center align-items-center mb-2">
                <img src="/logos/reports.png" alt="" />{' '}Reportes
            </div>
            <div>
                <div className="d-flex">
                    <div className="d-flex">
                        Buscar: 
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar cliente"
                        />
                    </div>
                    <SelectComponent datas={months} selected={selectedMonth} handleChange={handleMonthChange} />
                    <Form.Select value={selectedStore} onChange={handleStoreChange} className="ms-2">
                        <option value="" disabled hidden>Seleccionar tienda</option>
                        {storeListData.map((store, index) => (
                            <option key={index} value={store.idStore}>{store.name}</option>
                        ))}
                    </Form.Select>
                    <Button onClick={fetchDataByMonth}>Mostrar</Button>
                </div>
                <div>
                    <Button variant="secondary" onClick={exportToPDF} className="ms-2">Exportar PDF</Button>
                    <Button variant="success" onClick={exportToExcel} className="ms-2">Exportar Excel</Button>
                </div>
            </div>
            <div className='border p-2'>
                <div className='d-flex justify-content-between'>
                    <h3>Ventas de la tienda</h3>
                    <div className='d-flex' style={{gap: '5px'}}>
                        {["1D", "5D", "1M", "6M", "1A"].map((period, index) => (
                            <Button key={index} onClick={() => { setTimePeriod(period); fetchDataByTimePeriod(); }}>
                                {period}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    {salesData.length > 0 ? (
                        <Table striped bordered hover>
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
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((sales, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{sales.name_user}</td>
                                        <td>{sales.distributor_name}</td>
                                        <td>{formatDate(sales.date)}</td>
                                        <td>{sales.name_product}</td>
                                        <td>{sales.addition_product}</td>
                                        <td>{sales.amountPaid}</td>
                                        <td>{sales.total - sales.amountPaid}</td>
                                        <td>{sales.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Cargando datos de ventas...</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Reports;