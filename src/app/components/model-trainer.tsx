import * as tf from '@tensorflow/tfjs';
import { TestData } from './data-input-form';

/**
 * Preprocesses the historical data for TensorFlow model training.
 * Normalizes the data to improve model performance.
 */
export function preprocessData(data: TestData[]) {
  // Extract features (totalTests, cbc, urinalysis, fecalysis)
  const features = data.map(d => [d.totalTests, d.cbc, d.urinalysis, d.fecalysis]);
  
  // Calculate min and max for normalization
  const mins = [0, 0, 0, 0];
  const maxs = [0, 0, 0, 0];
  
  for (let i = 0; i < 4; i++) {
    mins[i] = Math.min(...features.map(f => f[i]));
    maxs[i] = Math.max(...features.map(f => f[i]));
  }
  
  // Normalize data
  const normalized = features.map(f => 
    f.map((val, i) => (val - mins[i]) / (maxs[i] - mins[i] + 1))
  );
  
  return { normalized, mins, maxs, original: features };
}

/**
 * Creates and trains a TensorFlow.js sequential model for time series forecasting.
 * Uses a simple LSTM-like architecture with dense layers.
 */
export async function trainModel(data: TestData[], onProgress?: (epoch: number, loss: number) => void) {
  const { normalized, mins, maxs } = preprocessData(data);
  
  // Create sequences for time series prediction
  const sequenceLength = Math.min(3, data.length - 1);
  const xs: number[][] = [];
  const ys: number[][] = [];
  
  for (let i = 0; i < normalized.length - sequenceLength; i++) {
    xs.push(normalized.slice(i, i + sequenceLength).flat());
    ys.push(normalized[i + sequenceLength]);
  }
  
  // Convert to tensors
  const xTensor = tf.tensor2d(xs);
  const yTensor = tf.tensor2d(ys);
  
  // Create model
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ 
        inputShape: [sequenceLength * 4], 
        units: 32, 
        activation: 'relu',
        kernelInitializer: 'heNormal'
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ 
        units: 16, 
        activation: 'relu' 
      }),
      tf.layers.dense({ 
        units: 4 
      })
    ]
  });
  
  // Compile model
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });
  
  // Train model
  await model.fit(xTensor, yTensor, {
    epochs: 100,
    batchSize: Math.min(2, xs.length),
    validationSplit: 0.2,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress && logs) {
          onProgress(epoch, logs.loss as number);
        }
      }
    }
  });
  
  // Cleanup tensors
  xTensor.dispose();
  yTensor.dispose();
  
  return { model, mins, maxs, sequenceLength };
}

/**
 * Generates predictions for future months using the trained model.
 */
export async function predictFuture(
  model: tf.LayersModel,
  historicalData: TestData[],
  mins: number[],
  maxs: number[],
  sequenceLength: number,
  monthsToPredict: number = 12
) {
  const { normalized } = preprocessData(historicalData);
  const predictions: TestData[] = [];
  
  // Use the last sequenceLength data points as starting point
  let currentSequence = [...normalized.slice(-sequenceLength)];
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lastData = historicalData[historicalData.length - 1];
  let currentMonthIndex = months.indexOf(lastData.month);
  let currentYear = lastData.year;
  
  for (let i = 0; i < monthsToPredict; i++) {
    // Prepare input tensor
    const inputData = currentSequence.flat();
    const inputTensor = tf.tensor2d([inputData]);
    
    // Make prediction
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predArray = await prediction.array() as number[][];
    
    // Denormalize prediction
    const denormalized = predArray[0].map((val, idx) => 
      val * (maxs[idx] - mins[idx] + 1) + mins[idx]
    );
    
    // Move to next month
    currentMonthIndex = (currentMonthIndex + 1) % 12;
    if (currentMonthIndex === 0) currentYear++;
    
    predictions.push({
      month: months[currentMonthIndex],
      year: currentYear,
      totalTests: Math.round(denormalized[0]),
      cbc: Math.round(denormalized[1]),
      urinalysis: Math.round(denormalized[2]),
      fecalysis: Math.round(denormalized[3])
    });
    
    // Update sequence for next prediction
    currentSequence.push(predArray[0]);
    currentSequence.shift();
    
    // Cleanup
    inputTensor.dispose();
    prediction.dispose();
  }
  
  return predictions;
}
