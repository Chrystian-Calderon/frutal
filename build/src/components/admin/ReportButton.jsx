import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import Button from 'react-bootstrap/esm/Button';

const ReportButton = ({ data }) => {
    // Función para generar el PDF dinámicamente
    const generatePDF = () => {
        const doc = new jsPDF();

        // Agregar el título del reporte
        doc.setFontSize(18);
        doc.text('Reporte Dinámico', 14, 22);

        if (data.length > 0) {
            // Obtener las columnas dinámicamente de las claves del primer objeto
            const tableColumn = Object.keys(data[0]);

            // Construir las filas dinámicamente con los valores
            const tableRows = data.map(item => Object.values(item));

            // Generar la tabla usando los datos dinámicos
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 30,
            });

            // Guardar el archivo PDF
            doc.save('reporte_dinamico.pdf');
        } else {
            // Si no hay datos
            doc.text('No hay datos disponibles', 14, 30);
            doc.save('reporte_vacio.pdf');
        }
    };

    return (
        <Button onClick={generatePDF}>title</Button>
    );
};

export default ReportButton;