import React from 'react';
import { LayerConfig } from '../../modules/NeuralNetwork/NeuralNetwork';
import { Tooltip } from '../Tooltip/Tooltip';

interface AdvancedLayerConfigProps {
  layer: LayerConfig;
  onChange: (layer: LayerConfig) => void;
  onRemove: () => void;
  index: number;
}

export const AdvancedLayerConfig: React.FC<AdvancedLayerConfigProps> = ({
  layer,
  onChange,
  onRemove,
  index,
}) => {
  const handleTypeChange = (type: LayerConfig['type']) => {
    const newLayer: LayerConfig = { ...layer, type };
    
    // Set default values based on layer type
    switch (type) {
      case 'dense':
        newLayer.units = layer.units || 10;
        newLayer.activation = layer.activation || 'relu';
        break;
      case 'dropout':
        newLayer.rate = layer.rate || 0.2;
        delete newLayer.units;
        delete newLayer.activation;
        break;
      case 'batchNormalization':
        newLayer.momentum = layer.momentum || 0.99;
        newLayer.epsilon = layer.epsilon || 0.001;
        delete newLayer.units;
        delete newLayer.activation;
        break;
      case 'conv2d':
        newLayer.filters = layer.filters || 32;
        newLayer.kernelSize = layer.kernelSize || 3;
        newLayer.activation = layer.activation || 'relu';
        delete newLayer.units;
        break;
      case 'maxPooling2d':
        newLayer.poolSize = layer.poolSize || 2;
        delete newLayer.units;
        delete newLayer.activation;
        break;
      case 'flatten':
        delete newLayer.units;
        delete newLayer.activation;
        break;
    }
    
    onChange(newLayer);
  };

  const layerType = layer.type || 'dense';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Layer {index + 1}</h3>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Layer Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layer Type
        </label>
        <select
          value={layerType}
          onChange={(e) => handleTypeChange(e.target.value as LayerConfig['type'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dense">Dense (Fully Connected)</option>
          <option value="dropout">Dropout</option>
          <option value="batchNormalization">Batch Normalization</option>
          <option value="conv2d">Convolution 2D</option>
          <option value="maxPooling2d">Max Pooling 2D</option>
          <option value="flatten">Flatten</option>
        </select>
      </div>

      {/* Layer-specific configurations */}
      {layerType === 'dense' && (
        <>
          <div className="mb-4">
            <Tooltip content="Number of neurons in this layer">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units
              </label>
            </Tooltip>
            <input
              type="number"
              value={layer.units || 10}
              onChange={(e) => onChange({ ...layer, units: parseInt(e.target.value) || 1 })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <Tooltip content="Activation function to apply">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activation
              </label>
            </Tooltip>
            <select
              value={layer.activation || 'relu'}
              onChange={(e) => onChange({ ...layer, activation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relu">ReLU</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
              <option value="linear">Linear</option>
              <option value="softmax">Softmax</option>
              <option value="elu">ELU</option>
              <option value="selu">SELU</option>
            </select>
          </div>
        </>
      )}

      {layerType === 'dropout' && (
        <div className="mb-4">
          <Tooltip content="Fraction of input units to drop (0-1)">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dropout Rate
            </label>
          </Tooltip>
          <input
            type="number"
            value={layer.rate || 0.2}
            onChange={(e) => onChange({ ...layer, rate: parseFloat(e.target.value) || 0.2 })}
            min="0"
            max="1"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Randomly sets input units to 0 during training
          </p>
        </div>
      )}

      {layerType === 'batchNormalization' && (
        <>
          <div className="mb-4">
            <Tooltip content="Momentum for the moving average">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Momentum
              </label>
            </Tooltip>
            <input
              type="number"
              value={layer.momentum || 0.99}
              onChange={(e) => onChange({ ...layer, momentum: parseFloat(e.target.value) || 0.99 })}
              min="0"
              max="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <Tooltip content="Small float added to variance to avoid dividing by zero">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Epsilon
              </label>
            </Tooltip>
            <input
              type="number"
              value={layer.epsilon || 0.001}
              onChange={(e) => onChange({ ...layer, epsilon: parseFloat(e.target.value) || 0.001 })}
              min="0.00001"
              step="0.0001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500">
            Normalizes inputs to have zero mean and unit variance
          </p>
        </>
      )}

      {layerType === 'conv2d' && (
        <>
          <div className="mb-4">
            <Tooltip content="Number of output filters in the convolution">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filters
              </label>
            </Tooltip>
            <input
              type="number"
              value={layer.filters || 32}
              onChange={(e) => onChange({ ...layer, filters: parseInt(e.target.value) || 32 })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <Tooltip content="Size of the convolution kernel">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kernel Size
              </label>
            </Tooltip>
            <input
              type="number"
              value={Array.isArray(layer.kernelSize) ? layer.kernelSize[0] : layer.kernelSize || 3}
              onChange={(e) => onChange({ ...layer, kernelSize: parseInt(e.target.value) || 3 })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding
            </label>
            <select
              value={layer.padding || 'valid'}
              onChange={(e) => onChange({ ...layer, padding: e.target.value as 'valid' | 'same' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="valid">Valid (no padding)</option>
              <option value="same">Same (preserve dimensions)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activation
            </label>
            <select
              value={layer.activation || 'relu'}
              onChange={(e) => onChange({ ...layer, activation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relu">ReLU</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="tanh">Tanh</option>
              <option value="linear">Linear</option>
            </select>
          </div>
        </>
      )}

      {layerType === 'maxPooling2d' && (
        <>
          <div className="mb-4">
            <Tooltip content="Size of the pooling window">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pool Size
              </label>
            </Tooltip>
            <input
              type="number"
              value={Array.isArray(layer.poolSize) ? layer.poolSize[0] : layer.poolSize || 2}
              onChange={(e) => onChange({ ...layer, poolSize: parseInt(e.target.value) || 2 })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding
            </label>
            <select
              value={layer.padding || 'valid'}
              onChange={(e) => onChange({ ...layer, padding: e.target.value as 'valid' | 'same' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="valid">Valid (no padding)</option>
              <option value="same">Same (preserve dimensions)</option>
            </select>
          </div>
          <p className="text-xs text-gray-500">
            Downsamples by taking the maximum value in each window
          </p>
        </>
      )}

      {layerType === 'flatten' && (
        <p className="text-xs text-gray-500">
          Flattens the input into a 1D array
        </p>
      )}

      {/* Input Shape (only for first layer) */}
      {index === 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Tooltip content="Shape of the input data">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Shape
            </label>
          </Tooltip>
          <input
            type="text"
            value={layer.inputShape?.join(', ') || ''}
            onChange={(e) => {
              const shape = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
              onChange({ ...layer, inputShape: shape.length > 0 ? shape : undefined });
            }}
            placeholder="e.g., 28, 28, 1 for images"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};