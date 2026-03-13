import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TestData } from './data-input-form';
import { TrendingUp, Calendar, FlaskConical } from 'lucide-react';

interface PredictionDisplayProps {
  predictions: TestData[];
  historicalData: TestData[];
}

export function PredictionDisplay({ predictions, historicalData }: PredictionDisplayProps) {
  // Calculate growth rates
  const lastHistorical = historicalData[historicalData.length - 1];
  const firstPrediction = predictions[0];
  const lastPrediction = predictions[predictions.length - 1];
  
  const initialGrowth = ((firstPrediction.totalTests - lastHistorical.totalTests) / lastHistorical.totalTests * 100).toFixed(1);
  const overallGrowth = ((lastPrediction.totalTests - lastHistorical.totalTests) / lastHistorical.totalTests * 100).toFixed(1);
  
  // Calculate average monthly values
  const avgPredicted = {
    totalTests: Math.round(predictions.reduce((sum, p) => sum + p.totalTests, 0) / predictions.length),
    cbc: Math.round(predictions.reduce((sum, p) => sum + p.cbc, 0) / predictions.length),
    urinalysis: Math.round(predictions.reduce((sum, p) => sum + p.urinalysis, 0) / predictions.length),
    fecalysis: Math.round(predictions.reduce((sum, p) => sum + p.fecalysis, 0) / predictions.length)
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next Month Growth</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              {initialGrowth}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Expected change from {lastHistorical.month} {lastHistorical.year}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>12-Month Growth</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              {overallGrowth}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total growth over forecast period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Monthly Tests</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-500" />
              {avgPredicted.totalTests.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Average across all predictions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Predictions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Forecast Results</CardTitle>
          <CardDescription>
            Predicted test volumes for the next 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left">Month/Year</th>
                  <th className="p-3 text-right">Total Tests</th>
                  <th className="p-3 text-right">CBC</th>
                  <th className="p-3 text-right">Urinalysis</th>
                  <th className="p-3 text-right">Fecalysis</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-3">
                      {pred.month} {pred.year}
                    </td>
                    <td className="p-3 text-right">
                      {pred.totalTests.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-green-600">
                      {pred.cbc.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-blue-600">
                      {pred.urinalysis.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-purple-600">
                      {pred.fecalysis.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 bg-muted/50">
                  <td className="p-3">
                    <strong>Average</strong>
                  </td>
                  <td className="p-3 text-right">
                    <strong>{avgPredicted.totalTests.toLocaleString()}</strong>
                  </td>
                  <td className="p-3 text-right text-green-600">
                    <strong>{avgPredicted.cbc.toLocaleString()}</strong>
                  </td>
                  <td className="p-3 text-right text-blue-600">
                    <strong>{avgPredicted.urinalysis.toLocaleString()}</strong>
                  </td>
                  <td className="p-3 text-right text-purple-600">
                    <strong>{avgPredicted.fecalysis.toLocaleString()}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
