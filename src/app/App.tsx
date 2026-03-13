import { useState } from 'react';
import { DataInputForm, TestData } from './components/data-input-form';
import { trainModel, predictFuture } from './components/model-trainer';
import { PredictionDisplay } from './components/prediction-display';
import { DataVisualization } from './components/data-visualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Brain, Database, LineChart as LineChartIcon, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Laboratory Diagnostic Forecasting System</h1>
          </div>
          <p className="text-muted-foreground">
            CCS112 - Application Development and Emerging Technologies | 
            MamatayHealthyLab Diagnostics Center
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Data Input Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl">Step 1: Input Historical Data</h2>
          </div>
          <DataInputForm onDataSubmit={handleDataSubmit} />
        </section>

        {/* Training Progress */}
        {isTraining && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 animate-pulse" />
                Training Model...
              </CardTitle>
              <CardDescription>
                TensorFlow.js is processing your data and training the neural network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={trainingProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Progress: {trainingProgress}%
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {modelTrained && !isTraining && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Model Training Complete</AlertTitle>
            <AlertDescription className="text-green-600">
              Successfully trained the forecasting model and generated predictions for the next 12 months.
            </AlertDescription>
          </Alert>
        )}

        {/* Predictions Section */}
        {predictions.length > 0 && historicalData.length > 0 && (
          <>
            <section>
              <div className="flex items-center gap-2 mb-4">
                <LineChartIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl">Step 2: Review Predictions</h2>
              </div>
              <PredictionDisplay 
                predictions={predictions} 
                historicalData={historicalData}
              />
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <LineChartIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl">Step 3: Analyze Visualizations</h2>
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
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>How to use this forecasting system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4>1. Input Historical Data</h4>
                <p className="text-sm text-muted-foreground">
                  Enter your laboratory test data manually or upload a CSV/TXT file. 
                  The system needs at least 2 months of data to train the model.
                </p>
              </div>
              <div className="space-y-2">
                <h4>2. Train the Model</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Process Data & Train Model" to start training the TensorFlow.js neural network.
                  The model learns patterns from your historical data.
                </p>
              </div>
              <div className="space-y-2">
                <h4>3. View Predictions</h4>
                <p className="text-sm text-muted-foreground">
                  Once training is complete, the system will display predictions for the next 12 months,
                  including detailed forecasts for CBC, Urinalysis, and Fecalysis tests.
                </p>
              </div>
              <div className="space-y-2">
                <h4>4. Analyze Trends</h4>
                <p className="text-sm text-muted-foreground">
                  Review the interactive charts showing historical data (solid lines) and 
                  future forecasts (dashed lines) with clear visual distinction.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Faculty: Joseph D. Cartagenas | Powered by React & TensorFlow.js
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;