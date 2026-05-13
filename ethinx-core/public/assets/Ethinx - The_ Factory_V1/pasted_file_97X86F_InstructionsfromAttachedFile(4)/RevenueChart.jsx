import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function RevenueChart({ data, title = 'Revenue Projection' }) {
  const chartData = {
    labels: data.map(d => `Week ${d.week}`),
    datasets: [
      {
        label: 'Projected MRR',
        data: data.map(d => d.revenue),
        borderColor: '#FF6B35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: '#FF6B35',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
          font: { size: 12, weight: 'bold' },
        },
      },
      title: {
        display: true,
        text: title,
        color: '#fff',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FF6B35',
        bodyColor: '#fff',
        borderColor: '#FF6B35',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: '#fff',
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#fff' },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export function UsersChart({ data, title = 'User Growth' }) {
  const chartData = {
    labels: data.map(d => `Week ${d.week}`),
    datasets: [
      {
        label: 'Total Users',
        data: data.map(d => d.users),
        backgroundColor: '#0F3A7D',
        borderColor: '#FF6B35',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
          font: { size: 12, weight: 'bold' },
        },
      },
      title: {
        display: true,
        text: title,
        color: '#fff',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FF6B35',
        bodyColor: '#fff',
        borderColor: '#FF6B35',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#fff' },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#fff' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export function ConversionChart({ data, title = 'Free-to-Pro Conversion' }) {
  const chartData = {
    labels: data.map(d => `Week ${d.week}`),
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: data.map(d => (d.conversion * 100).toFixed(1)),
        borderColor: '#FF6B35',
        backgroundColor: 'rgba(255, 107, 53, 0.2)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#FF6B35',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
          font: { size: 12, weight: 'bold' },
        },
      },
      title: {
        display: true,
        text: title,
        color: '#fff',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FF6B35',
        bodyColor: '#fff',
        borderColor: '#FF6B35',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            return context.parsed.y + '%';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: '#fff',
          callback: function(value) {
            return value + '%';
          },
        },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#fff' },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
