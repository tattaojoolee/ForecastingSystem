import { useState } from 'react';
import { DataInputForm, TestData } from './components/data-input-form';
import { trainModel, predictFuture } from './components/model-trainer';
import { PredictionDisplay } from './components/prediction-display';
import { DataVisualization } from './components/data-visualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Brain, Database, LineChart as LineChartIcon, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

/**
 * Laboratory Diagnostic Forecasting System
 * CCS112 - Application Development and Emerging Technologies
 * 
 * This application uses React and TensorFlow.js to forecast laboratory test demand.
 * It provides data input, machine learning model training, predictions, and visualizations.
 */
function App() {
  const [historicalData, setHistoricalData] = useState<TestData[]>([]);
  const [predictions, setPredictions] = useState<TestData[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelTrained, setModelTrained] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles data submission and initiates model training
   */
  const handleDataSubmit = async (data: TestData[]) => {
    setError(null);
    setIsTraining(true);
    setTrainingProgress(0);
    setModelTrained(false);
    
    try {
      // Validate data
      if (data.length < 2) {
        throw new Error('Please provide at least 2 months of historical data');
      }

      setHistoricalData(data);

      // Train the model
      const { model, mins, maxs, sequenceLength } = await trainModel(
        data,
        (epoch, loss) => {
          setTrainingProgress(Math.min(95, epoch + 1));
        }
      );

      setTrainingProgress(98);

      // Generate predictions for the next 12 months
      const futurePredictions = await predictFuture(
        model,
        data,
        mins,
        maxs,
        sequenceLength,
        12
      );

      setPredictions(futurePredictions);
      setTrainingProgress(100);
      setModelTrained(true);

      // Cleanup model
      model.dispose();
      
    } catch (err) {
      console.error('Error during training:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during training');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 animate-pulse" />
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Laboratory Diagnostic Forecasting System
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Machine Learning Time Series Prediction
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            CCS112 - Application Development and Emerging Technologies | 
            MamatayHealthyLab Diagnostics Center
          </p>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 space-y-10">
        {/* Data Input Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg shadow-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Step 1: Input Historical Data
              </h2>
              <p className="text-sm text-muted-foreground">Upload or manually enter your laboratory test records</p>
            </div>
          </div>
          <DataInputForm onDataSubmit={handleDataSubmit} />
        </section>

        {/* Training Progress */}
        {isTraining && (
          <Card className="animate-in fade-in slide-in-from-top-4 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardTitle className="flex items-center gap-2">
                <div className="relative">
                  <Brain className="w-5 h-5 animate-pulse text-blue-600" />
                  <div className="absolute inset-0 animate-ping">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                Training Model...
              </CardTitle>
              <CardDescription>
                TensorFlow.js is processing your data and training the neural network
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Progress value={trainingProgress} className="w-full h-3" />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Progress: {trainingProgress}%
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    Processing
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4 shadow-lg">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {modelTrained && !isTraining && (
          <Alert className="animate-in fade-in slide-in-from-top-4 border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-lg">
            <div className="relative">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="absolute inset-0 animate-ping opacity-75">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <AlertTitle className="text-green-600 text-lg">Model Training Complete! 🎉</AlertTitle>
            <AlertDescription className="text-green-600">
              Successfully trained the forecasting model and generated predictions for the next 12 months.
            </AlertDescription>
          </Alert>
        )}

        {/* Predictions Section */}
        {predictions.length > 0 && historicalData.length > 0 && (
          <>
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Step 2: Review Predictions
                  </h2>
                  <p className="text-sm text-muted-foreground">Machine learning forecasts for the next 12 months</p>
                </div>
              </div>
              <PredictionDisplay 
                predictions={predictions} 
                historicalData={historicalData}
              />
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-lg shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Step 3: Data Visualization
                  </h2>
                  <p className="text-sm text-muted-foreground">Interactive charts with clear distinction between historical and predicted data</p>
                </div>
              </div>
              <DataVisualization 
                historicalData={historicalData}
                predictions={predictions}
              />
            </section>
          </>
        )}

        {/* Instructions */}
        {predictions.length === 0 && !isTraining && (
          <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-lg">
            <CardHeader>
              <CardTitle>System Instructions</CardTitle>
              <CardDescription>Follow these steps to generate forecasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-blue-900 dark:text-blue-100">Input Historical Data</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Enter your laboratory test data manually or upload a CSV/TXT file. 
                    The system needs at least 2 months of data to train the model.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <div className="flex-shrink-0 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-purple-900 dark:text-purple-100">Train the Model</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Click "Process Data & Train Model" to start training the TensorFlow.js neural network.
                    The model learns patterns from your historical data.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <div className="flex-shrink-0 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-green-900 dark:text-green-100">View Predictions</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Once training is complete, the system will display predictions for the next 12 months,
                    including detailed forecasts for CBC, Urinalysis, and Fecalysis tests.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex-shrink-0 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-amber-900 dark:text-amber-100">Analyze Trends</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Review the interactive charts showing historical data (solid lines) and 
                    future forecasts (dashed lines) with clear visual distinction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t mt-12 py-8 bg-gradient-to-r from-slate-100 via-blue-100 to-purple-100 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powered by React & TensorFlow.js
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Faculty: Joseph D. Cartagenas | MamatayHealthyLab Diagnostics Center
            </p>
            <p className="text-xs text-muted-foreground">
              © 2026 CCS112 - Application Development and Emerging Technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;