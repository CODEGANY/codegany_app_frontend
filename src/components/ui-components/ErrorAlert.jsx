import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Error alert component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {string} [props.title] - Optional title for the error
 * @param {Function} [props.onRetry] - Optional retry function
 */
const ErrorAlert = ({ message, title = "Erreur", onRetry }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col">
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium underline hover:text-destructive-foreground"
          >
            Réessayer
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;