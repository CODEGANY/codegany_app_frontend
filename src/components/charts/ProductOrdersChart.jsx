import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Fonction pour générer une couleur aléatoire
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.5) % 360; // Angle d'or pour une meilleure distribution
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};
const fetchMaterialStats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      throw new Error('Token d\'authentification manquant');
    }

    console.log('Envoi requête avec token:', token);
    
    const response = await axios({
      method: 'post',
      url: `${API_URL}/api/v1/materials/order-stats`,
      data: { token },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Réponse API:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Erreur fetchMaterialStats:', error.response || error);
    throw new Error(error.response?.data?.detail || 'Erreur de connexion au serveur');
  }
};

export function ProductOrdersChart() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['materialOrderStats'],
    queryFn: fetchMaterialStats,
    retry: 2,
    staleTime: 300000,
  });

  console.log('État du composant:', { stats, isLoading, error });

  if (isLoading) {
    return (
      <div className="w-full max-w-sm p-4 flex justify-center items-center">
        <span className="text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-sm p-4 flex flex-col gap-2 justify-center items-center">
        <span className="text-destructive font-medium">
          {error.message || 'Erreur de chargement'}
        </span>
        <span className="text-xs text-muted-foreground">
          Veuillez réessayer plus tard
        </span>
      </div>
    );
  }

  if (!stats?.length) {
    return (
      <div className="w-full max-w-sm p-4 text-center">
        <span className="text-muted-foreground">
          Aucune donnée disponible
        </span>
      </div>
    );
  }
  
  const chartData = {
    labels: stats.map(item => item.material_name),
    datasets: [{
      data: stats.map(item => item.order_count),
      backgroundColor: generateColors(stats.length),
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { 
          font: { size: 11 },
          color: 'rgb(var(--foreground))'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true
  };

  return (
    <div className="w-full max-w-sm p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Matériels les plus commandés
      </h3>
      <Pie data={chartData} options={options} />
    </div>
  );
}