import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";

import { useBainMarieAnalytics } from "@/hooks/use-dashboard-data";
import type { DashboardFilters } from "@/lib/dashboard";


const COLORS = ["hsl(155,43%,21%)", "hsl(38,92%,50%)", "hsl(200,70%,50%)", "hsl(270,60%,55%)", "hsl(0,84%,60%)", "hsl(160,60%,40%)", "hsl(30,80%,55%)", "hsl(50,80%,50%)"];

interface Props { filters: DashboardFilters; }

export default function BainMarieAnalytics({ filters }: Props) {
  const { data, isLoading } = useBainMarieAnalytics(filters);

  if (isLoading) {
    return (
      <div className="chart-card animate-pulse">
        <div className="h-5 w-48 bg-muted rounded mb-4" />
        <div className="h-48 bg-muted rounded" />
      </div>
    );
  }

  if (!data || data.total_weight === 0) {
    return (
      <div className="chart-card flex items-center justify-center h-40 text-sm text-muted-foreground">
        No Bain Marie Waste data for the selected filters.
      </div>
    );
  }

  return (
    <div className="chart-card space-y-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">Bain Marie Waste Analytics</h3>
        <p className="text-xs text-muted-foreground mt-1">Breakdown of waste recorded as Bain Marie Waste type.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Bain Marie Waste", value: `${data.total_weight.toLocaleString()} kg` },
          { label: "Daily Average", value: `${data.average_daily.toLocaleString()} kg` },
          { label: "Active Days", value: data.active_days.toString() },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Top food items */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Top Food Items</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.top_items} layout="vertical" margin={{ top: 2, right: 16, bottom: 2, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={110} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} formatter={(v: number) => [`${v} kg`, "Waste"]} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                {data.top_items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By meal */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">By Meal Type</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.by_meal} margin={{ top: 2, right: 16, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} formatter={(v: number) => [`${v} kg`, "Waste"]} />
              <Bar dataKey="value" fill="hsl(38,92%,50%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily trend */}
      {data.daily_trend.length > 1 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Daily Trend</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data.daily_trend} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} formatter={(v: number) => [`${v} kg`, "Waste"]} />
              <Line type="monotone" dataKey="value" stroke="hsl(155,43%,21%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
