import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowUpRight } from 'lucide-react';
import { Progress } from '../ui/progress';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - Title of the card
 * @property {string} value - Main value to display
 * @property {string} [trend] - Trend indicator value (e.g. "+18%")
 * @property {string} [trendLabel] - Additional label for the trend
 * @property {boolean} [trendUp] - Whether the trend is positive (up) or negative (down)
 * @property {number} [progress] - Progress percentage if card should show a progress bar
 * @property {React.ReactNode} icon - Icon to display
 * @property {string} [className] - Additional CSS class names
 */

/**
 * A card component displaying statistics with optional trends and progress bars
 * @param {StatsCardProps} props - Component props
 */
const StatsCard = ({ 
  title, 
  value, 
  trend, 
  trendLabel, 
  trendUp, 
  progress, 
  icon, 
  className 
}) => {
  return (
    <Card className={`hover:shadow-md transition-all duration-300 ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {progress !== undefined && (
          <>
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progress}% du budget annuel
            </p>
          </>
        )}
        
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={`${trendUp ? 'text-emerald-500' : 'text-rose-500'} font-medium flex items-center`}>
              {trend} <ArrowUpRight className="h-3 w-3 ml-1" />
            </span>
            {trendLabel && <span className="ml-1">{trendLabel}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;