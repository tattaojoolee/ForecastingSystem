import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TestData } from './data-input-form';
import { TrendingUp, BarChart3, LineChart as LineChartIcon } from 'lucide-react';

interface DataVisualizationProps {
  historicalData: TestData[];
  predictions: TestData[];
}

export function DataVisualization({ historicalData, predictions }: DataVisualizationProps) {
  // Combine historical and predicted data for visualization
  const combinedData = [
    ...historicalData.map((d, idx) => ({
      id: `historical-${idx}`,
      label: `${d.month} ${d.year}`,
      totalTests: d.totalTests,
      cbc: d.cbc,
      urinalysis: d.urinalysis,
      fecalysis: d.fecalysis,
      type: 'historical' as const
    })),
    ...predictions.map((d, idx) => ({
      id: `predicted-${idx}`,
      label: `${d.month} ${d.year}`,
      totalTests: d.totalTests,
      cbc: d.cbc,
      urinalysis: d.urinalysis,
      fecalysis: d.fecalysis,
      type: 'predicted' as const
    }))
  ];

  // Prepare data for trend line chart
  const trendData = combinedData.map((d, index) => ({
    ...d,
    index: index + 1
  }));

  // Separate historical and predicted for overlay visualization
  const historicalTrend = trendData.filter(d => d.type === 'historical');
  const predictedTrend = trendData.filter(d => d.type === 'predicted');
  
  // Add connection point between historical and predicted
  if (historicalTrend.length > 0 && predictedTrend.length > 0) {
    const lastHistorical = historicalTrend[historicalTrend.length - 1];
    predictedTrend.unshift({ ...lastHistorical, id: `connection-point`, type: 'predicted' });
  }

  return (
    <div className="space-y-6">
      {/* Total Tests Trend */}
      <Card className="shadow-xl border-2 border-emerald-100 dark:border-emerald-900">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/30 dark:to-teal-900/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Total Tests Trend
          </CardTitle>
          <CardDescription>
            Historical data (blue) and forecast predictions (orange)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                data={historicalTrend}
                dataKey="totalTests" 
                stroke="#2563eb" 
                strokeWidth={2}
                name="Historical" 
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                data={predictedTrend}
                dataKey="totalTests" 
                stroke="#f97316" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted" 
                dot={{ r: 4, fill: '#f97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Test Type Distribution */}
      <Card className="shadow-xl border-2 border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Test Type Distribution
          </CardTitle>
          <CardDescription>
            Breakdown by test category (CBC, Urinalysis, Fecalysis)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="cbc" 
                fill="#10b981" 
                name="CBC"
                opacity={(entry) => entry.type === 'historical' ? 1 : 0.6}
              />
              <Bar 
                dataKey="urinalysis" 
                fill="#3b82f6" 
                name="Urinalysis"
                opacity={(entry) => entry.type === 'historical' ? 1 : 0.6}
              />
              <Bar 
                dataKey="fecalysis" 
                fill="#8b5cf6" 
                name="Fecalysis"
                opacity={(entry) => entry.type === 'historical' ? 1 : 0.6}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Test Type Trends */}
      <Card className="shadow-xl border-2 border-indigo-100 dark:border-indigo-900">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 dark:from-indigo-900/30 dark:to-violet-900/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-indigo-600" />
            Individual Test Trends
          </CardTitle>
          <CardDescription>
            Separate trend lines for each test type
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cbc" 
                stroke="#10b981" 
                strokeWidth={2}
                name="CBC"
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="urinalysis" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Urinalysis"
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="fecalysis" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Fecalysis"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}