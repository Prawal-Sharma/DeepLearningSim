import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import { useStore } from '../../store/useStore';
import { useToast } from '../Toast/ToastProvider';
import { Tooltip } from '../Tooltip/Tooltip';

interface SavedModel {
  id: string;
  name: string;
  timestamp: Date;
  layers: any[];
  metrics: {
    loss: number;
    accuracy?: number;
  };
  config: {
    learningRate: number;
    epochs: number;
    batchSize: number;
  };
  architecture: string;
}

export const ModelManager: React.FC = () => {
  const [savedModels, setSavedModels] = useState<SavedModel[]>(() => {
    const stored = localStorage.getItem('savedModels');
    return stored ? JSON.parse(stored) : [];
  });
  const [modelName, setModelName] = useState('');
  const [selectedModel, setSelectedModel] = useState<SavedModel | null>(null);
  const [compareModels, setCompareModels] = useState<SavedModel[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { network, layers, trainingMetrics, loadNetwork } = useStore();
  const { showToast } = useToast();

  const saveModel = async () => {
    if (!network || !modelName.trim()) {
      showToast('Please enter a model name', 'warning');
      return;
    }

    try {
      // Save the model weights to IndexedDB
      if (network.model) {
        await network.model.save(`indexeddb://${modelName}`);
      }

      const newModel: SavedModel = {
        id: Date.now().toString(),
        name: modelName,
        timestamp: new Date(),
        layers: layers,
        metrics: {
          loss: trainingMetrics.loss[trainingMetrics.loss.length - 1] || 0,
          accuracy: trainingMetrics.accuracy[trainingMetrics.accuracy.length - 1],
        },
        config: {
          learningRate: network.config.learningRate || 0.01,
          epochs: trainingMetrics.epoch || 0,
          batchSize: network.config.batchSize || 32,
        },
        architecture: layers.map(l => `${l.type}(${l.units})`).join(' → '),
      };

      const updatedModels = [...savedModels, newModel];
      setSavedModels(updatedModels);
      localStorage.setItem('savedModels', JSON.stringify(updatedModels));
      
      showToast(`Model "${modelName}" saved successfully!`, 'success');
      setModelName('');
    } catch (error) {
      showToast('Failed to save model', 'error');
      console.error('Save error:', error);
    }
  };

  const loadModel = async (model: SavedModel) => {
    try {
      // Load the model from IndexedDB
      const loadedModel = await tf.loadLayersModel(`indexeddb://${model.name}`);
      
      // Update the store with the loaded model
      loadNetwork({
        model: loadedModel,
        config: {
          learningRate: model.config.learningRate,
          batchSize: model.config.batchSize,
        },
      }, model.layers);
      
      showToast(`Model "${model.name}" loaded successfully!`, 'success');
      setSelectedModel(model);
    } catch (error) {
      showToast('Failed to load model', 'error');
      console.error('Load error:', error);
    }
  };

  const deleteModel = async (model: SavedModel) => {
    try {
      // Remove from IndexedDB
      const modelInfo = await tf.io.listModels();
      const modelPath = `indexeddb://${model.name}`;
      if (modelInfo[modelPath]) {
        await tf.io.removeModel(modelPath);
      }

      // Remove from saved models
      const updatedModels = savedModels.filter(m => m.id !== model.id);
      setSavedModels(updatedModels);
      localStorage.setItem('savedModels', JSON.stringify(updatedModels));
      
      showToast(`Model "${model.name}" deleted`, 'info');
    } catch (error) {
      showToast('Failed to delete model', 'error');
      console.error('Delete error:', error);
    }
  };

  const exportModel = async (format: 'json' | 'tfjs') => {
    if (!network) {
      showToast('No model to export', 'warning');
      return;
    }

    try {
      if (format === 'json') {
        // Export as JSON (weights only)
        if (!network.model) {
          showToast('No model to export', 'warning');
          return;
        }
        const weights = network.model.getWeights();
        const weightsData = await Promise.all(
          weights.map(async w => ({
            shape: w.shape,
            data: Array.from(await w.data()),
          }))
        );
        
        const modelData = {
          architecture: layers,
          weights: weightsData,
          config: network.config,
          exportDate: new Date().toISOString(),
        };
        
        const blob = new Blob([JSON.stringify(modelData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `model-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Model exported as JSON', 'success');
      } else {
        // Export as TensorFlow.js format
        if (network.model) {
          await network.model.save('downloads://my-model');
        }
        showToast('Model exported in TensorFlow.js format', 'success');
      }
    } catch (error) {
      showToast('Failed to export model', 'error');
      console.error('Export error:', error);
    }
  };

  const importModel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const modelData = JSON.parse(text);
      
      // Validate model data
      if (!modelData.architecture || !modelData.weights) {
        throw new Error('Invalid model file');
      }
      
      // Reconstruct the model
      // This is a simplified version - would need more complex logic for full reconstruction
      showToast('Model import functionality in development', 'info');
    } catch (error) {
      showToast('Failed to import model', 'error');
      console.error('Import error:', error);
    }
  };

  const toggleCompareModel = (model: SavedModel) => {
    if (compareModels.some(m => m.id === model.id)) {
      setCompareModels(compareModels.filter(m => m.id !== model.id));
    } else if (compareModels.length < 3) {
      setCompareModels([...compareModels, model]);
    } else {
      showToast('Maximum 3 models can be compared', 'warning');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Model Manager</h2>
      
      {/* Save Model Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Save Current Model</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Enter model name..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Tooltip content="Save the current model to browser storage">
            <button
              onClick={saveModel}
              disabled={!network || !modelName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Export/Import Section */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => exportModel('json')}
          disabled={!network}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportModel('tfjs')}
          disabled={!network}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Export TFJS
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          Import Model
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importModel}
          className="hidden"
        />
      </div>

      {/* Saved Models List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-3">Saved Models</h3>
        {savedModels.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No saved models yet</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {savedModels.map((model) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                  selectedModel?.id === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${
                  compareModels.some(m => m.id === model.id) ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{model.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(model.timestamp).toLocaleDateString()} at{' '}
                      {new Date(model.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Architecture: {model.architecture}
                    </p>
                    <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                      <span>Loss: {model.metrics.loss.toFixed(4)}</span>
                      {model.metrics.accuracy && (
                        <span>Accuracy: {(model.metrics.accuracy * 100).toFixed(1)}%</span>
                      )}
                      <span>Epochs: {model.config.epochs}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Tooltip content="Compare this model">
                      <button
                        onClick={() => toggleCompareModel(model)}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                          compareModels.some(m => m.id === model.id) ? 'bg-purple-200' : ''
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip content="Load this model">
                      <button
                        onClick={() => loadModel(model)}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete this model">
                      <button
                        onClick={() => deleteModel(model)}
                        className="p-2 rounded hover:bg-red-100 transition-colors text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Model Comparison */}
      {compareModels.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Model Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  {compareModels.map(model => (
                    <th key={model.id} className="text-left py-2 px-4">{model.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Architecture</td>
                  {compareModels.map(model => (
                    <td key={model.id} className="py-2 px-4 text-sm">{model.architecture}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Loss</td>
                  {compareModels.map(model => (
                    <td key={model.id} className="py-2 px-4">{model.metrics.loss.toFixed(4)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Accuracy</td>
                  {compareModels.map(model => (
                    <td key={model.id} className="py-2 px-4">
                      {model.metrics.accuracy ? `${(model.metrics.accuracy * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Epochs</td>
                  {compareModels.map(model => (
                    <td key={model.id} className="py-2 px-4">{model.config.epochs}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Learning Rate</td>
                  {compareModels.map(model => (
                    <td key={model.id} className="py-2 px-4">{model.config.learningRate}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 font-medium">Batch Size</td>
                  {compareModels.map(model => (
                    <td key={model.id} className="py-2 px-4">{model.config.batchSize}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setCompareModels([])}
            className="mt-3 text-sm text-purple-600 hover:text-purple-700"
          >
            Clear Comparison
          </button>
        </div>
      )}
    </div>
  );
};