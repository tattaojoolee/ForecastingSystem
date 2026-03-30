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
        <Card className="border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-700 dark:text-green-300">Next Month Growth</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{initialGrowth}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 dark:text-green-300">
              Expected change from {lastHistorical.month} {lastHistorical.year}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-700 dark:text-blue-300">12-Month Growth</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Calendar className="w-6 h-6 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{overallGrowth}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Total growth over forecast period
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-700 dark:text-purple-300">Avg Monthly Tests</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <FlaskConical className="w-6 h-6 text-purple-500" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{avgPredicted.totalTests.toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Average across all predictions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Predictions Table */}
      <Card className="shadow-xl border-2 border-purple-100 dark:border-purple-900">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Detailed Forecast Results
          </CardTitle>
          <CardDescription>
            Predicted test volumes for the next 12 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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