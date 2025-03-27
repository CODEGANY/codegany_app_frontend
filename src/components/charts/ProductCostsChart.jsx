import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fetchMonthlyCosts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }

    console.log('Envoi requête avec token:', token);
    
    const response = await axios({
      method: 'post',
      url: `${API_URL}/api/v1/materials/monthly-costs`,
      data: { token },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Réponse API:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Erreur fetchMonthlyCosts:', error.response || error);
    throw new Error(error.response?.data?.detail || 'Erreur de connexion au serveur');
  }
};

export function ProductCostsChart() {
  const { data: monthlyData, isLoading, error } = useQuery({
    queryKey: ['monthlyCosts'],
    queryFn: fetchMonthlyCosts,
    retry: 2,
    staleTime: 5 * 60 * 1000
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-xl p-4 text-center">
        <span className="text-muted-foreground">Chargement des données...</span>
      </div>
    );
  }

  if (error) {
    console.error('Erreur affichage:', error);
    return (
      <div className="w-full max-w-xl p-4 text-center">
        <span className="text-destructive">{error.message}</span>
      </div>
    );
  }

  const chartData = {
    labels: monthlyData?.map(item => item.month) || [],
    datasets: [{
      label: 'Coût total des produits ($)',
      data: monthlyData?.map(item => item.cost) || [],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          color: 'rgb(var(--foreground))'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Coût : ${value.toLocaleString('fr-FR')} Ariary`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString('fr-FR')} $`
        }
      }
    },
    maintainAspectRatio: true
  };

  return (
    <div className="w-full max-w-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Dépenses Mensuelles (2024)
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}