import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import Button from 'react-bootstrap/esm/Button';
import { getStoreComparationSalesRequest, getStoreSalesForProductsRequest, getStoreSalesTotalsRequest } from '../../api/store.api';

const MonthlyReportStores = ({ month }) => {
    const [dataGeneral, setDataGeneral] = useState([]);
    const [dataSalesProducts, setDataSalesProducts] = useState([]);
    const [dataComparationSales, setDataComparationSales] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getStoreSalesTotalsRequest({month: month});
            const result = await response.data;
            setDataGeneral(result);
        })();
    }, [month]);
    useEffect(() => {
        (async () => {
            const response = await getStoreSalesForProductsRequest({month: month});
            const result = await response.data;
            setDataSalesProducts(result);
        })();
    }, [month]);
    useEffect(() => {
        (async () => {
            const response = await getStoreComparationSalesRequest({month: month});
            const result = await response.data;
            setDataComparationSales(result);
        })();
    }, [month]);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Reporte Mensual de Ventas por Tiendas', 20, 20);
        doc.setFontSize(12);
        doc.text("Para el mes de noviembre del 2024", 20, 30);
        doc.setFontSize(14);
        doc.text("Resumen general de ventas por tienda", 20, 35);

        if (dataGeneral.length > 0 && dataSalesProducts.length > 0 && dataComparationSales.length > 0) {
            let tableColumn = ["Tiendas", "Ventas totales (Bs)"];
            let tableRows = dataGeneral.map(item => [
                item.name,
                item.sales_month,
            ]);
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
            });

            let y = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(14);
            doc.text("Desglose de ventas por producto y tienda", 20, y);
            tableColumn = ["Tiendas", "Helados (Bs)", "Barquillo (Bs)", "Cono (Bs)", "Canasta (Bs)", "Estrella (Bs)"];
            tableRows = dataSalesProducts.map(item => [
                item.storeName,
                item.totalIcecream,
                item.totalBarquillo,
                item.totalCono,
                item.totalCanasta,
                item.totalEstrella,
            ]);
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: y + 5,
            });

            // y = doc.lastAutoTable.finalY + 10;
            // tableColumn = ["Tiendas", "Total (Bs)", "Cantidad vendida"];
            // tableRows = dataSalesProducts.map(item => [
            //     item.storeName,
            //     item.
            // ]);

            doc.save('reporte_dinamico.pdf');
        } else {
            // Si no hay datos
            doc.text('No hay datos disponibles', 14, 30);
            doc.save('reporte_vacio.pdf');
        }
    };

    return (
        <Button onClick={generatePDF}>Reporte mensual</Button>
    );
};

export default MonthlyReportStores;