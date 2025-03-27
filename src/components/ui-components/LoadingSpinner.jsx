import { Loader2 } from "lucide-react";

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} [props.size] - Size of the spinner (sm, md, lg)
 * @param {string} [props.text] - Text to display below spinner
 */
const LoadingSpinner = ({ size = "md", text }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${spinnerSize} animate-spin text-primary`} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;