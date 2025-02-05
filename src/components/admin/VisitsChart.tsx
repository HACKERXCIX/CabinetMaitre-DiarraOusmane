
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VisitsChartProps {
  data: {
    name: string;
    visits: number;
  }[];
  title: string;
}

const VisitsChart = ({ data, title }: VisitsChartProps) => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('day');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="space-x-2">
            <Button 
              variant={timeframe === 'day' ? 'default' : 'outline'}
              onClick={() => setTimeframe('day')}
              size="sm"
            >
              Jour
            </Button>
            <Button 
              variant={timeframe === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeframe('week')}
              size="sm"
            >
              Semaine
            </Button>
            <Button 
              variant={timeframe === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeframe('month')}
              size="sm"
            >
              Mois
            </Button>
            <Button 
              variant={timeframe === 'year' ? 'default' : 'outline'}
              onClick={() => setTimeframe('year')}
              size="sm"
            >
              Année
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitsChart;
