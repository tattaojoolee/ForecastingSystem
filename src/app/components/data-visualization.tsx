import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TestData } from './data-input-form';

interface DataVisualizationProps {
  historicalData: TestData[];
  predictions: TestData[];
}

export function DataVisualization({ historicalData, predictions }: DataVisualizationProps) {
  // Combine historical and predicted data for visualization
  const combinedData = [
    ...historicalData.map(d => ({
      label: `${d.month} ${d.year}`,
      totalTests: d.totalTests,
      cbc: d.cbc,
      urinalysis: d.urinalysis,
      fecalysis: d.fecalysis,
      type: 'historical' as const
    })),
    ...predictions.map(d => ({
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
    predictedTrend.unshift({ ...lastHistorical, type: 'predicted' });
  }

  return (
    <div className="space-y-6">
      {/* Total Tests Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Total Tests Trend</CardTitle>
          <CardDescription>
            Historical data (blue) and forecast predictions (orange)
          </CardDescription>
        </CardHeader>
        <CardContent>
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
      <Card>
        <CardHeader>
          <CardTitle>Test Type Distribution</CardTitle>
          <CardDescription>
            Breakdown by test category (CBC, Urinalysis, Fecalysis)
          </CardDescription>
        </CardHeader>
        <CardContent>
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
      <Card>
        <CardHeader>
          <CardTitle>Individual Test Trends</CardTitle>
          <CardDescription>
            Separate trend lines for each test type
          </CardDescription>
        </CardHeader>
        <CardContent>
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
