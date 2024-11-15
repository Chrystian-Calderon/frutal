// SalesChart.js
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const formatDate = (dateString) => {
    const date = new Date(dateString); // Convierte la cadena a un objeto Date

    // Extrae día, mes y año
    const day = String(date.getDate()).padStart(2, '0');   // Asegura que tenga 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes es 0-indexado
    const year = String(date.getFullYear()).slice(2);      // Extrae los últimos 2 dígitos del año

    return `${day}-${month}-${year}`;  // Retorna la fecha en formato dd-mm-yy
}

const SalesChart = ({ salesData }) => {
    
    const data = {
        labels: salesData.map((sale) => formatDate(sale.date)), // Fechas de ventas
        datasets: [
            {
                label: 'Ventas',
                data: salesData.map((sale) => sale.total), // Valores totales de ventas
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Curva suave para la línea
            },
            // {
            //     label: 'Deben',
            //     data: salesData.map((sale) => sale.paid), // Valores pagados
            //     borderColor: 'rgba(153, 102, 255, 1)',
            //     backgroundColor: 'rgba(153, 102, 255, 0.2)',
            //     borderWidth: 2,
            //     fill: true,
            //     tension: 0.4,
            // },
            // {
            //     label: 'Pago adelantado',
            //     data: salesData.map((sale) => sale.due), // Valores pendientes
            //     borderColor: 'rgba(255, 99, 132, 1)',
            //     backgroundColor: 'rgba(255, 99, 132, 0.2)',
            //     borderWidth: 2,
            //     fill: true,
            //     tension: 0.4,
            // }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Ventas'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
};

const SalesBarsChart = ({salesData}) => {
    const backgroundColors = salesData.map(() => 'rgba(75, 192, 192, 0.2)');
    const borderColors = salesData.map(() => 'rgba(75, 192, 192, 1)');
    const data = {
        labels: salesData.map((store) => store.name),
        datasets: [
            {
                label: 'Ventas',
                data: salesData.map((store) => store.sales),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }
        ]
    };
    
    const options = {
        responsive: true,
        animation: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            },
            x: {
                ticks: {color: 'blue'}
            }
        }
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    )
};

export {SalesChart, SalesBarsChart};
