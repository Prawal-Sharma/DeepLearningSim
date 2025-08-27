import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { datasets } from '../../modules/Datasets/datasets';
import { useToast } from '../Toast/ToastProvider';
import { Tooltip } from '../Tooltip/Tooltip';
import { DatasetVisualizer } from '../DatasetVisualizer/DatasetVisualizer';
import * as tf from '@tensorflow/tfjs';

export const TrainingPanel: React.FC = () => {
  const {
    network,
    isTraining,
    startTraining,
    stopTraining,
    updateTrainingMetrics,
    currentEpoch,
    loss,
    accuracy,
  } = useStore();

  const [selectedDataset, setSelectedDataset] = useState(0);
  const [epochs, setEpochs] = useState(100);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(0.01);
  const { showToast } = useToast();

  const handleStartTraining = async () => {
    if (!network) {
      showToast('Please build a network first', 'warning');
      return;
    }

    const dataset = datasets[selectedDataset];
    startTraining();
    showToast(`Starting training on ${dataset.name} dataset`, 'info');

    try {
      const xTrain = tf.tensor2d(dataset.data.inputs);
      const yTrain = tf.tensor2d(dataset.data.outputs);

      await network.train(xTrain, yTrain, {
        epochs,
        batchSize,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            updateTrainingMetrics({
              epoch: epoch + 1,
              loss: logs?.loss as number,
              accuracy: logs?.acc as number,
            });
          },
        },
      });

      xTrain.dispose();
      yTrain.dispose();
      showToast('Training completed successfully!', 'success');
    } catch (error) {
      console.error('Training error:', error);
      showToast('Training failed. Please check your network configuration.', 'error');
      stopTraining();
    }
  };

  const handleStopTraining = () => {
    stopTraining();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Training Control Panel</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dataset
          </label>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTraining}
          >
            {datasets.map((dataset, index) => (
              <option key={index} value={index}>
                {dataset.name} - {dataset.description}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Epochs
            </label>
            <input
              type="number"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value))}
              min="1"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTraining}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Size
            </label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              min="1"
              max="256"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTraining}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Rate
            </label>
            <input
              type="number"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              step="0.001"
              min="0.0001"
              max="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTraining}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          {!isTraining ? (
            <button
              onClick={handleStartTraining}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Training
            </button>
          ) : (
            <button
              onClick={handleStopTraining}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Training
            </button>
          )}
        </div>

        {isTraining && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Training Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Epoch:</span>
                <span className="text-sm font-medium">{currentEpoch} / {epochs}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentEpoch / epochs) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loss:</span>
                <span className="text-sm font-medium">{loss.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accuracy:</span>
                <span className="text-sm font-medium">{(accuracy * 100).toFixed(2)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      </div>
      
      {/* Dataset Visualization */}
      {datasets[selectedDataset].type === 'classification' && (
        <DatasetVisualizer 
          datasetIndex={selectedDataset} 
          showDecisionBoundary={!isTraining && currentEpoch > 0}
        />
      )}
    </div>
  );
};