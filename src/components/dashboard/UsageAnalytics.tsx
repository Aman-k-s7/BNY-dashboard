import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

import { useUsageAnalytics } from "@/hooks/use-dashboard-data";
import type { DashboardFilters } from "@/lib/dashboard";
import { Activity, CalendarDays, ScanLine, Cpu } from "lucide-react";


interface Props { filters: DashboardFilters; }

const MEAL_COLORS = ["hsl(155,43%,21%)", "hsl(38,92%,50%)", "hsl(200,70%,50%)", "hsl(270,60%,55%)", "hsl(0,84%,60%)"];
const TYPE_COLORS = ["hsl(155,43%,21%)", "hsl(38,92%,50%)", "hsl(200,70%,50%)", "hsl(270,60%,55%)", "hsl(0,84%,60%)", "hsl(160,60%,40%)", "hsl(30,80%,55%)", "hsl(50,80%,50%)"];

export default function UsageAnalytics({ filters }: Props) {
  const { data, isLoading } = useUsageAnalytics(filters);

  if (isLoading) {
    return (
      <div className="chart-card animate-pulse space-y-4">
        <div className="h-5 w-40 bg-muted rounded" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-muted rounded" />)}
        </div>
        <div className="h-48 bg-muted rounded" />
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    { label: "Total Scans", value: data.total_scans.toLocaleString(), icon: ScanLine, color: "text-primary" },
    { label: "Active Days", value: data.active_days.toLocaleString(), icon: CalendarDays, color: "text-primary" },
    { label: "Scans / Day", value: data.scans_per_day.toLocaleString(), icon: Activity, color: "text-accent" },
    { label: "Devices", value: data.total_devices.toLocaleString(), icon: Cpu, color: "text-primary" },
  ];

  return (
    <div className="chart-card space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Usage Analytics</h3>
        <p className="text-xs text-muted-foreground mt-1">Scan activity and usage patterns for the selected period.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card flex items-center gap-3">
            <div className={`${kpi.color} shrink-0`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
              <p className="text-lg font-bold leading-tight text-foreground">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Scans by meal */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Scans by Meal</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.by_meal} margin={{ top: 4, right: 12, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} formatter={(v: number) => [v.toLocaleString(), "Scans"]} />
              <Bar dataKey="scans" radius={[3, 3, 0, 0]}>
                {data.by_meal.map((_, i) => <Cell key={i} fill={MEAL_COLORS[i % MEAL_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scans by waste type */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Scans by Waste Type</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.by_waste_type} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} formatter={(v: number) => [v.toLocaleString(), "Scans"]} />
              <Bar dataKey="scans" radius={[0, 3, 3, 0]}>
                {data.by_waste_type.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
