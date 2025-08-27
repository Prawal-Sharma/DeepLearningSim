import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { LayerConfig } from '../../modules/NeuralNetwork/NeuralNetwork';

const activationFunctions = ['relu', 'sigmoid', 'tanh', 'linear', 'softmax'];
const optimizers = ['adam', 'sgd', 'rmsprop'];
const lossFunctions = ['meanSquaredError', 'binaryCrossentropy', 'categoricalCrossentropy'];

export const NetworkBuilder: React.FC = () => {
  const {
    networkConfig,
    setNetwork,
    updateLayer,
    addLayer,
    removeLayer,
  } = useStore();

  useEffect(() => {
    setNetwork(networkConfig);
  }, []);

  const handleLayerUpdate = (index: number, field: keyof LayerConfig, value: any) => {
    const updatedLayer = { ...networkConfig.layers[index], [field]: value };
    updateLayer(index, updatedLayer);
  };

  const handleAddLayer = () => {
    const newLayer: LayerConfig = {
      units: 4,
      activation: 'relu',
    };
    addLayer(newLayer);
  };

  const handleRemoveLayer = (index: number) => {
    if (networkConfig.layers.length > 1) {
      removeLayer(index);
    }
  };

  const handleConfigUpdate = (field: string, value: any) => {
    const newConfig = { ...networkConfig, [field]: value };
    setNetwork(newConfig);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Network Architecture</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Global Settings</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Optimizer
            </label>
            <select
              value={networkConfig.optimizer || 'adam'}
              onChange={(e) => handleConfigUpdate('optimizer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {optimizers.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Loss Function
            </label>
            <select
              value={networkConfig.loss || 'meanSquaredError'}
              onChange={(e) => handleConfigUpdate('loss', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {lossFunctions.map((loss) => (
                <option key={loss} value={loss}>
                  {loss}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Learning Rate
            </label>
            <input
              type="number"
              value={networkConfig.learningRate || 0.01}
              onChange={(e) => handleConfigUpdate('learningRate', parseFloat(e.target.value))}
              step="0.001"
              min="0.0001"
              max="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Layers</h3>
        <AnimatePresence>
          {networkConfig.layers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-medium text-gray-700">
                  {index === 0 ? 'Input Layer' : index === networkConfig.layers.length - 1 ? 'Output Layer' : `Hidden Layer ${index}`}
                </h4>
                {networkConfig.layers.length > 1 && (
                  <button
                    onClick={() => handleRemoveLayer(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Neurons
                  </label>
                  <input
                    type="number"
                    value={layer.units}
                    onChange={(e) => handleLayerUpdate(index, 'units', parseInt(e.target.value))}
                    min="1"
                    max="128"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Activation
                  </label>
                  <select
                    value={layer.activation || 'relu'}
                    onChange={(e) => handleLayerUpdate(index, 'activation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {activationFunctions.map((func) => (
                      <option key={func} value={func}>
                        {func}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {index === 0 && layer.inputShape && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Input Shape
                  </label>
                  <input
                    type="text"
                    value={layer.inputShape.join(', ')}
                    onChange={(e) => {
                      const shape = e.target.value.split(',').map(s => parseInt(s.trim()));
                      handleLayerUpdate(index, 'inputShape', shape);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2 for 2D input"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <button
          onClick={handleAddLayer}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Layer
        </button>
      </div>
    </div>
  );
};