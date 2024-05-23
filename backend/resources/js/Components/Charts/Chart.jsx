import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MyBarChart({ userlabels, userlabel, userdata }) {
    const data = {
        labels: userlabels,
        datasets: [
            {
                label: userlabel,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                data: userdata,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '400px', height: '300px' }}>
            <Bar data={data} options={options} />
        </div>
    );
}
