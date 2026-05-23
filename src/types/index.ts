export interface WeatherSummary {
  location: string;
  provider: string;
  currentTempC: number | null;
  maxTempC: number | null;
  minTempC: number | null;
  humidity: number | null;
  condition: string;
}

export interface PowerSummary {
  consumerId: string;
  flatNumber: string;
  date: string | null;
  gridUnits: number | null;
  dgUnits: number | null;
  totalUnits: number | null;
}

export interface MonthlyUsageDay {
  date: string;
  gridUnits: number | null;
  dgUnits: number | null;
  totalUnits: number | null;
}

export interface MonthlyUsageSummary {
  consumerId: string;
  flatNumber: string;
  month: string;
  days: MonthlyUsageDay[];
}

export interface AnalysisResult {
  status: 'normal' | 'hot-day' | 'high-usage' | 'dg-used' | 'unknown';
  observations: string[];
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface PowerCastAlert {
  code: string;
  severity: AlertSeverity;
  title: string;
  message: string;
}

export interface AlertsSummary {
  date: string | null;
  alerts: PowerCastAlert[];
  hasAlerts: boolean;
}

export interface DailySummary {
  weather: WeatherSummary;
  power: PowerSummary;
  analysis: AnalysisResult;
  alerts: AlertsSummary;
}
