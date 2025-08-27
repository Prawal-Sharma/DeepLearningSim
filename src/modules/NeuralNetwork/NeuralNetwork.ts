import * as tf from '@tensorflow/tfjs';

export interface LayerConfig {
  type?: 'dense' | 'dropout' | 'batchNormalization' | 'conv2d' | 'maxPooling2d' | 'flatten';
  units?: number;
  activation?: string;
  inputShape?: number[];
  rate?: number; // For dropout
  filters?: number; // For conv2d
  kernelSize?: number | number[]; // For conv2d
  strides?: number | number[]; // For conv2d
  padding?: 'valid' | 'same'; // For conv2d
  poolSize?: number | number[]; // For maxPooling2d
  momentum?: number; // For batch normalization
  epsilon?: number; // For batch normalization
}

export interface NetworkConfig {
  layers: LayerConfig[];
  optimizer?: string;
  loss?: string;
  learningRate?: number;
}

export interface TrainingOptions {
  epochs: number;
  batchSize?: number;
  validationSplit?: number;
  callbacks?: {
    onEpochEnd?: (epoch: number, logs: any) => void;
    onBatchEnd?: (batch: number, logs: any) => void;
  };
}

export class NeuralNetwork {
  private model: tf.Sequential | null = null;
  private config: NetworkConfig;
  private trainingHistory: any[] = [];
  private isTraining: boolean = false;

  constructor(config: NetworkConfig) {
    this.config = config;
    this.buildModel();
  }

  private buildModel(): void {
    this.model = tf.sequential();

    this.config.layers.forEach((layerConfig, index) => {
      const layerType = layerConfig.type || 'dense';
      let layer: tf.layers.Layer;

      switch (layerType) {
        case 'dense':
          const denseOptions: any = {
            units: layerConfig.units || 1,
            activation: layerConfig.activation || 'relu',
          };
          if (index === 0 && layerConfig.inputShape) {
            denseOptions.inputShape = layerConfig.inputShape;
          }
          layer = tf.layers.dense(denseOptions);
          break;

        case 'dropout':
          const dropoutOptions: any = {
            rate: layerConfig.rate || 0.2,
          };
          if (index === 0 && layerConfig.inputShape) {
            dropoutOptions.inputShape = layerConfig.inputShape;
          }
          layer = tf.layers.dropout(dropoutOptions);
          break;

        case 'batchNormalization':
          const batchNormOptions: any = {
            momentum: layerConfig.momentum || 0.99,
            epsilon: layerConfig.epsilon || 0.001,
          };
          if (index === 0 && layerConfig.inputShape) {
            batchNormOptions.inputShape = layerConfig.inputShape;
          }
          layer = tf.layers.batchNormalization(batchNormOptions);
          break;

        case 'conv2d':
          const conv2dOptions: any = {
            filters: layerConfig.filters || 32,
            kernelSize: layerConfig.kernelSize || 3,
            strides: layerConfig.strides || 1,
            padding: layerConfig.padding || 'valid',
            activation: layerConfig.activation || 'relu',
          };
          if (index === 0 && layerConfig.inputShape) {
            conv2dOptions.inputShape = layerConfig.inputShape;
          }
          layer = tf.layers.conv2d(conv2dOptions);
          break;

        case 'maxPooling2d':
          const maxPoolingOptions: any = {
            poolSize: layerConfig.poolSize || 2,
            strides: layerConfig.strides || 2,
            padding: layerConfig.padding || 'valid',
          };
          if (index === 0 && layerConfig.inputShape) {
            maxPoolingOptions.inputShape = layerConfig.inputShape;
          }
          layer = tf.layers.maxPooling2d(maxPoolingOptions);
          break;

        case 'flatten':
          const flattenOptions: any = {};
          if (index === 0 && layerConfig.inputShape) {
            flattenOptions.inputShape = layerConfig.inputShape;
          }
          layer = tf.layers.flatten(flattenOptions);
          break;

        default:
          // Default to dense layer
          const defaultOptions: any = {
            units: layerConfig.units || 1,
            activation: layerConfig.activation || 'relu',
          };
          if (index === 0 && layerConfig.inputShape) {
            defaultOptions.inputShape = layerConfig.inputShape;
          }
          layer = tf.layers.dense(defaultOptions);
      }

      this.model!.add(layer);
    });

    const optimizer = this.getOptimizer();
    const loss = this.config.loss || 'meanSquaredError';

    this.model.compile({
      optimizer,
      loss,
      metrics: ['accuracy'],
    });
  }

  private getOptimizer(): tf.Optimizer {
    const lr = this.config.learningRate || 0.01;
    
    switch (this.config.optimizer) {
      case 'sgd':
        return tf.train.sgd(lr);
      case 'adam':
        return tf.train.adam(lr);
      case 'rmsprop':
        return tf.train.rmsprop(lr);
      default:
        return tf.train.adam(lr);
    }
  }

  async train(
    xTrain: tf.Tensor | number[][],
    yTrain: tf.Tensor | number[][],
    options: TrainingOptions
  ): Promise<tf.History> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    this.isTraining = true;

    const x = xTrain instanceof tf.Tensor ? xTrain : tf.tensor2d(xTrain);
    const y = yTrain instanceof tf.Tensor ? yTrain : tf.tensor2d(yTrain);

    const history = await this.model.fit(x, y, {
      epochs: options.epochs,
      batchSize: options.batchSize || 32,
      validationSplit: options.validationSplit || 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          this.trainingHistory.push({ epoch, ...logs });
          if (options.callbacks?.onEpochEnd) {
            options.callbacks.onEpochEnd(epoch, logs);
          }
        },
        onBatchEnd: (batch, logs) => {
          if (options.callbacks?.onBatchEnd) {
            options.callbacks.onBatchEnd(batch, logs);
          }
        },
      },
    });

    this.isTraining = false;
    
    if (!(xTrain instanceof tf.Tensor)) x.dispose();
    if (!(yTrain instanceof tf.Tensor)) y.dispose();

    return history;
  }

  predict(input: tf.Tensor | number[][]): tf.Tensor {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const x = input instanceof tf.Tensor ? input : tf.tensor2d(input);
    const prediction = this.model.predict(x) as tf.Tensor;
    
    if (!(input instanceof tf.Tensor)) x.dispose();
    
    return prediction;
  }

  getWeights(): tf.Tensor[] {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    return this.model.getWeights();
  }

  setWeights(weights: tf.Tensor[]): void {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    this.model.setWeights(weights);
  }

  getLayers(): tf.layers.Layer[] {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    return this.model.layers;
  }

  getLayerOutputs(input: tf.Tensor | number[][]): tf.Tensor[] {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const x = input instanceof tf.Tensor ? input : tf.tensor2d(input);
    const outputs: tf.Tensor[] = [];

    let currentInput = x;
    for (const layer of this.model.layers) {
      const output = layer.apply(currentInput) as tf.Tensor;
      outputs.push(output);
      currentInput = output;
    }

    if (!(input instanceof tf.Tensor)) x.dispose();

    return outputs;
  }

  stopTraining(): void {
    this.isTraining = false;
    if (this.model) {
      this.model.stopTraining = true;
    }
  }

  getTrainingHistory(): any[] {
    return this.trainingHistory;
  }

  isCurrentlyTraining(): boolean {
    return this.isTraining;
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
    }
  }

  toJSON(): any {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    return this.model.toJSON();
  }

  async save(path: string): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    await this.model.save(path);
  }

  static async load(path: string): Promise<tf.Sequential> {
    return await tf.loadLayersModel(path) as tf.Sequential;
  }
}