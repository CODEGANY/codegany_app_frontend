import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Brain, Loader2 } from 'lucide-react';
import { useAISummary } from '../../hooks/useAISummary';

/**
 * A card component that displays AI-generated summaries based on provided data
 * 
 * @param {Object} props Component props
 * @param {string} props.title Card title
 * @param {string} props.description Description of the card
 * @param {Object} props.data Data to analyze
 * @returns {JSX.Element} AI summary card component
 */
const AISummaryCard = ({ title, description, data }) => {
  const { summary, isGenerating, generateSummary } = useAISummary();
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateSummary = async () => {
    await generateSummary(data);
    setHasGenerated(true);
  };

  // Reset state when data changes
  useEffect(() => {
    setHasGenerated(false);
  }, [data]);

  return (
    <Card className="mb-6 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Analyse des données en cours...
            </p>
          </div>
        ) : hasGenerated ? (
          <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
            {summary || "Aucune analyse disponible. Veuillez réessayer."}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Cliquez sur le bouton ci-dessous pour générer une analyse IA</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              {hasGenerated ? 'Régénérer l\'analyse' : 'Générer une analyse'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISummaryCard;