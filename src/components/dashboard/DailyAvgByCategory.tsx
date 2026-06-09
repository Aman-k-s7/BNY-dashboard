import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useDailyAvgByCategory } from "@/hooks/use-dashboard-data";
import type { DashboardFilters } from "@/lib/dashboard";


const COLORS = ["hsl(155,43%,21%)", "hsl(38,92%,50%)", "hsl(200,70%,50%)", "hsl(270,60%,55%)", "hsl(0,84%,60%)", "hsl(160,60%,40%)", "hsl(30,80%,55%)", "hsl(50,80%,50%)", "hsl(180,60%,40%)", "hsl(310,60%,50%)", "hsl(20,80%,50%)", "hsl(240,60%,55%)"];

interface Props { filters: DashboardFilters; }

export default function DailyAvgByCategory({ filters }: Props) {
  const { data = [], isLoading } = useDailyAvgByCategory(filters);

  if (isLoading) {
    return (
      <div className="chart-card animate-pulse">
        <div className="h-5 w-56 bg-muted rounded mb-4" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="chart-card flex items-center justify-center h-40 text-sm text-muted-foreground">
        No category data available for the selected filters.
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="text-base font-semibold text-foreground">Daily Average Waste by Category</h3>
      <p className="text-xs text-muted-foreground mt-1 mb-4">Average kg wasted per active day, per food category.</p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} unit=" kg" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={130} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 4 }}
            formatter={(value: number, _name: string, props) => [
              `${value.toLocaleString()} kg/day (total: ${props.payload.total.toLocaleString()} kg)`,
              "Avg Daily",
            ]}
          />
          <Bar dataKey="avg_daily" radius={[0, 3, 3, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
