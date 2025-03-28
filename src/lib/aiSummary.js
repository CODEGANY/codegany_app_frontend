import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service utility to generate summaries from dashboard data
 * @module aiSummary
 */

// Get API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Google Generative AI with API key
const initAI = () => {
  if (!GEMINI_API_KEY) {
    throw new Error('API key not found in environment variables. Please set VITE_GEMINI_API_KEY in .env file');
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
};

/**
 * Extracts text content from Gemini API response based on response structure
 * @param {Object} result - The API response from Gemini
 * @returns {string} Extracted text content
 */
const extractTextFromResponse = (result) => {
  console.log("Raw API response:", result);
  
  // Check if it's the newer response format with candidates
  if (result.candidates && result.candidates[0]?.content?.parts) {
    return result.candidates[0].content.parts[0].text || "";
  }
  
  // Check if it's the traditional SDK format
  if (result.response && typeof result.response.text === 'function') {
    return result.response.text();
  }
  
  // Fallback for unexpected response structure
  console.warn("Unexpected response structure, couldn't extract text");
  return "Le format de la réponse n'a pas pu être interprété correctement. Veuillez réessayer.";
};

/**
 * Generates a summary of the dashboard data using Gemini AI
 * @param {Object} dashboardData - Dashboard data to summarize
 * @returns {Promise<string>} AI-generated summary
 */
export const generateDashboardSummary = async (dashboardData) => {
  try {
    // Initialize the AI with environment variable API key
    const genAI = initAI();
    
    // Get the generative model (Gemini)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Format dashboard data for the AI prompt
    const { requestStats, orderStats, recentRequests, recentOrders } = dashboardData;
    
    // Create a prompt with the dashboard data to analyze
    const prompt = `
      En tant qu'analyste d'entreprise, analyse ces données de tableau de bord d'achat et fournit un résumé concis de 3 points clés et une tendance. 
      Voici les statistiques actuelles:
      
      DEMANDES D'ACHAT:
      - Total: ${requestStats.total}
      - En attente: ${requestStats.pending}
      - Approuvées: ${requestStats.approved}
      - Rejetées: ${requestStats.rejected}
      
      COMMANDES:
      - Total: ${orderStats.total}
      - En cours: ${orderStats.inProgress}
      - Livrées: ${orderStats.delivered}
      
      Recommande des actions à l'utilisateur basées sur ces statistiques.
      Limite ta réponse à environ 150 mots en français.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    return extractTextFromResponse(result);
  } catch (error) {
    console.error('Error generating dashboard summary:', error);
    if (!GEMINI_API_KEY) {
      return "La clé API Gemini n'est pas configurée. Veuillez configurer la variable d'environnement VITE_GEMINI_API_KEY dans le fichier .env.";
    }
    return "Impossible de générer un résumé IA pour le moment. Veuillez vérifier votre clé API ou réessayer plus tard.";
  }
};

/**
 * Generates insights about material inventory based on data
 * @param {Array} materials - Material data to analyze
 * @returns {Promise<string>} AI-generated inventory insights
 */
export const generateInventoryInsights = async (materials) => {
  try {
    // Initialize the AI with environment variable API key
    const genAI = initAI();
    
    // Get the generative model (Gemini)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    // Format materials data for the AI prompt
    const materialsData = materials.map(m => 
      `${m.name} (${m.category}): ${m.stock_available} en stock, Prix: ${m.unit_price}€`
    ).join('\n');
    
    // Create a prompt for inventory analysis
    const prompt = `
      En tant que responsable logistique, analyse ces données d'inventaire et fournit des recommandations:
      
      INVENTAIRE MATÉRIEL:
      ${materialsData}
      
      Identifie les articles potentiellement en rupture de stock et suggère des priorités de réapprovisionnement.
      Limite ta réponse à environ 100 mots en français.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    return extractTextFromResponse(result);
  } catch (error) {
    console.error('Error generating inventory insights:', error);
    if (!GEMINI_API_KEY) {
      return "La clé API Gemini n'est pas configurée. Veuillez configurer la variable d'environnement VITE_GEMINI_API_KEY dans le fichier .env.";
    }
    return "Impossible de générer une analyse d'inventaire pour le moment. Veuillez vérifier votre clé API ou réessayer plus tard.";
  }
};