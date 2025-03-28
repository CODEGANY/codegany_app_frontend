import { useState } from 'react';
import { generateDashboardSummary } from '../lib/aiSummary';
import { toast } from 'sonner';

/**
 * Hook for managing AI summary generation and state
 * @returns {Object} Functions and state for AI summaries
 */
export const useAISummary = () => {
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate an AI summary from dashboard data
   * @param {Object} dashboardData - Data to analyze
   * @returns {Promise<string>} Generated summary text
   */
  const generateSummary = async (dashboardData) => {
    if (!dashboardData) {
      toast.error('Données insuffisantes pour générer une analyse');
      return null;
    }

    try {
      setIsGenerating(true);
      const summaryText = await generateDashboardSummary(dashboardData);
      setSummary(summaryText);
      return summaryText;
    } catch (error) {
      console.error('Erreur lors de la génération du résumé AI:', error);
      toast.error('Impossible de générer l\'analyse. Veuillez réessayer.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    summary,
    isGenerating,
    generateSummary,
  };
};