import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { useToast } from '../Toast/ToastProvider';

interface HyperparameterRange {
  learningRate: { min: number; max: number; step: number };
  batchSize: { min: number; max: number; step: number };
  epochs: { min: number; max: number; step: number };
  layers: { min: number; max: number };
  neurons: { min: number; max: number; step: number };
  dropout: { min: number; max: number; step: number };
}

interface TuningResult {
  id: string;
  params: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    layers: number;
    neurons: number[];
    dropout?: number;
  };
  metrics: {
    loss: number;
    accuracy?: number;
    trainingTime: number;
  };
  score: number;
}

export const HyperparameterTuner: React.FC = () => {
  const [tuningMode, setTuningMode] = useState<'grid' | 'random' | 'sensitivity' | 'auto'>('grid');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TuningResult[]>([]);
  const [bestResult, setBestResult] = useState<TuningResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentExperiment, setCurrentExperiment] = useState<string>('');
  const sensitivityChartRef = useRef<SVGSVGElement>(null);
  
  const { setNetwork } = useStore();
  const { showToast } = useToast();

  // Default hyperparameter ranges
  const [ranges, setRanges] = useState<HyperparameterRange>({
    learningRate: { min: 0.001, max: 0.1, step: 0.01 },
    batchSize: { min: 16, max: 128, step: 16 },
    epochs: { min: 50, max: 200, step: 50 },
    layers: { min: 2, max: 5 },
    neurons: { min: 4, max: 64, step: 4 },
    dropout: { min: 0, max: 0.5, step: 0.1 },
  });

  // Generate grid search combinations
  const generateGridSearchCombinations = (): any[] => {
    const combinations: any[] = [];
    
    for (let lr = ranges.learningRate.min; lr <= ranges.learningRate.max; lr += ranges.learningRate.step) {
      for (let bs = ranges.batchSize.min; bs <= ranges.batchSize.max; bs += ranges.batchSize.step) {
        for (let ep = ranges.epochs.min; ep <= ranges.epochs.max; ep += ranges.epochs.step) {
          for (let layers = ranges.layers.min; layers <= ranges.layers.max; layers++) {
            const neurons = [];
            for (let i = 0; i < layers; i++) {
              neurons.push(Math.floor(Math.random() * (ranges.neurons.max - ranges.neurons.min) / ranges.neurons.step) * ranges.neurons.step + ranges.neurons.min);
            }
            combinations.push({
              learningRate: lr,
              batchSize: bs,
              epochs: ep,
              layers,
              neurons,
              dropout: Math.random() * ranges.dropout.max,
            });
          }
        }
      }
    }
    
    return combinations;
  };

  // Generate random search combinations
  const generateRandomSearchCombinations = (count: number): any[] => {
    const combinations: any[] = [];
    
    for (let i = 0; i < count; i++) {
      const layers = Math.floor(Math.random() * (ranges.layers.max - ranges.layers.min + 1)) + ranges.layers.min;
      const neurons = [];
      for (let j = 0; j < layers; j++) {
        neurons.push(Math.floor(Math.random() * (ranges.neurons.max - ranges.neurons.min) / ranges.neurons.step) * ranges.neurons.step + ranges.neurons.min);
      }
      
      combinations.push({
        learningRate: Math.random() * (ranges.learningRate.max - ranges.learningRate.min) + ranges.learningRate.min,
        batchSize: Math.floor(Math.random() * (ranges.batchSize.max - ranges.batchSize.min) / ranges.batchSize.step) * ranges.batchSize.step + ranges.batchSize.min,
        epochs: Math.floor(Math.random() * (ranges.epochs.max - ranges.epochs.min) / ranges.epochs.step) * ranges.epochs.step + ranges.epochs.min,
        layers,
        neurons,
        dropout: Math.random() * ranges.dropout.max,
      });
    }
    
    return combinations;
  };

  // Simulate training with given hyperparameters
  const simulateTraining = async (params: any): Promise<TuningResult> => {
    // This is a simulation - in real implementation, you would actually train the model
    const startTime = Date.now();
    
    // Simulate training delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Calculate simulated metrics based on hyperparameters
    const baseScore = 0.5;
    const lrScore = params.learningRate > 0.01 && params.learningRate < 0.05 ? 0.2 : 0;
    const bsScore = params.batchSize >= 32 && params.batchSize <= 64 ? 0.1 : 0;
    const layerScore = params.layers >= 3 && params.layers <= 4 ? 0.15 : 0;
    const dropoutScore = params.dropout > 0.1 && params.dropout < 0.3 ? 0.05 : 0;
    
    const score = baseScore + lrScore + bsScore + layerScore + dropoutScore + (Math.random() * 0.2 - 0.1);
    const loss = 1 - score + (Math.random() * 0.2 - 0.1);
    
    return {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      params,
      metrics: {
        loss,
        accuracy: Math.max(0, Math.min(1, score)),
        trainingTime: Date.now() - startTime,
      },
      score,
    };
  };

  // Run hyperparameter tuning
  const runTuning = async () => {
    setIsRunning(true);
    setResults([]);
    setBestResult(null);
    setProgress(0);

    let combinations: any[] = [];
    
    switch (tuningMode) {
      case 'grid':
        combinations = generateGridSearchCombinations();
        showToast(`Starting grid search with ${combinations.length} combinations`, 'info');
        break;
      case 'random':
        combinations = generateRandomSearchCombinations(20);
        showToast(`Starting random search with 20 combinations`, 'info');
        break;
      case 'sensitivity':
        // For sensitivity analysis, we vary one parameter at a time
        combinations = generateSensitivityCombinations();
        showToast('Starting sensitivity analysis', 'info');
        break;
      case 'auto':
        combinations = generateAutoCombinations();
        showToast('Starting auto-tuning with smart suggestions', 'info');
        break;
    }

    const allResults: TuningResult[] = [];
    
    for (let i = 0; i < combinations.length; i++) {
      setCurrentExperiment(`Testing combination ${i + 1}/${combinations.length}`);
      setProgress((i / combinations.length) * 100);
      
      const result = await simulateTraining(combinations[i]);
      allResults.push(result);
      setResults([...allResults]);
      
      // Update best result
      if (!bestResult || result.score > bestResult.score) {
        setBestResult(result);
      }
    }
    
    setProgress(100);
    setIsRunning(false);
    setCurrentExperiment('');
    showToast(`Tuning complete! Best score: ${bestResult?.score.toFixed(3)}`, 'success');
  };

  // Generate combinations for sensitivity analysis
  const generateSensitivityCombinations = (): any[] => {
    const combinations: any[] = [];
    const baseParams = {
      learningRate: 0.01,
      batchSize: 32,
      epochs: 100,
      layers: 3,
      neurons: [16, 8, 4],
      dropout: 0.2,
    };

    // Vary learning rate
    for (let lr = ranges.learningRate.min; lr <= ranges.learningRate.max; lr += ranges.learningRate.step) {
      combinations.push({ ...baseParams, learningRate: lr });
    }

    // Vary batch size
    for (let bs = ranges.batchSize.min; bs <= ranges.batchSize.max; bs += ranges.batchSize.step) {
      combinations.push({ ...baseParams, batchSize: bs });
    }

    // Vary epochs
    for (let ep = ranges.epochs.min; ep <= ranges.epochs.max; ep += ranges.epochs.step) {
      combinations.push({ ...baseParams, epochs: ep });
    }

    return combinations;
  };

  // Generate smart auto-tuning combinations
  const generateAutoCombinations = (): any[] => {
    // These are commonly effective hyperparameter combinations
    return [
      { learningRate: 0.001, batchSize: 32, epochs: 100, layers: 3, neurons: [64, 32, 16], dropout: 0.2 },
      { learningRate: 0.01, batchSize: 64, epochs: 150, layers: 4, neurons: [128, 64, 32, 16], dropout: 0.3 },
      { learningRate: 0.005, batchSize: 32, epochs: 200, layers: 3, neurons: [32, 16, 8], dropout: 0.1 },
      { learningRate: 0.001, batchSize: 16, epochs: 100, layers: 2, neurons: [64, 32], dropout: 0.25 },
      { learningRate: 0.01, batchSize: 128, epochs: 50, layers: 5, neurons: [256, 128, 64, 32, 16], dropout: 0.4 },
    ];
  };

  // Visualize sensitivity analysis
  useEffect(() => {
    if (tuningMode === 'sensitivity' && results.length > 0 && sensitivityChartRef.current) {
      const svg = d3.select(sensitivityChartRef.current);
      const width = 600;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      svg.attr('viewBox', `0 0 ${width} ${height}`);
      svg.selectAll('*').remove();

      // Group results by parameter
      const parameterGroups = {
        learningRate: results.filter(r => r.params.batchSize === 32 && r.params.epochs === 100),
        batchSize: results.filter(r => r.params.learningRate === 0.01 && r.params.epochs === 100),
        epochs: results.filter(r => r.params.learningRate === 0.01 && r.params.batchSize === 32),
      };

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create scales
      const xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, innerWidth]);

      const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);

      // Add axes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      g.append('g')
        .call(d3.axisLeft(yScale));

      // Plot lines for each parameter
      const colors = { learningRate: '#3b82f6', batchSize: '#10b981', epochs: '#f59e0b' };
      
      Object.entries(parameterGroups).forEach(([param, data]) => {
        if (data.length > 0) {
          const line = d3.line<TuningResult>()
            .x((_, i) => xScale(i / (data.length - 1)))
            .y(d => yScale(d.score));

          g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colors[param as keyof typeof colors])
            .attr('stroke-width', 2)
            .attr('d', line);
        }
      });

      // Add legend
      const legend = g.append('g')
        .attr('transform', `translate(${innerWidth - 100}, 20)`);

      Object.entries(colors).forEach(([param, color], i) => {
        const item = legend.append('g')
          .attr('transform', `translate(0, ${i * 20})`);

        item.append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', color);

        item.append('text')
          .attr('x', 15)
          .attr('y', 9)
          .attr('font-size', '12px')
          .text(param);
      });
    }
  }, [results, tuningMode]);

  // Apply best result to network
  const applyBestResult = () => {
    if (!bestResult) {
      showToast('No results to apply', 'warning');
      return;
    }

    // Create layer configuration from best result
    const layers = bestResult.params.neurons.map((units, index) => ({
      type: 'dense' as const,
      units,
      activation: index === bestResult.params.neurons.length - 1 ? 'sigmoid' : 'relu',
      inputShape: index === 0 ? [2] : undefined,
    }));

    // Add dropout layers if specified
    if (bestResult.params.dropout && bestResult.params.dropout > 0) {
      const layersWithDropout: any[] = [];
      layers.forEach((layer, index) => {
        layersWithDropout.push(layer);
        if (index < layers.length - 1) {
          layersWithDropout.push({
            type: 'dropout',
            rate: bestResult.params.dropout,
          });
        }
      });
    }

    setNetwork({
      layers,
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      learningRate: bestResult.params.learningRate,
    });

    showToast('Best hyperparameters applied to network!', 'success');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Hyperparameter Tuner</h2>

      {/* Mode Selection */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setTuningMode('grid')}
          disabled={isRunning}
          className={`py-2 px-4 rounded-md font-medium transition-colors ${
            tuningMode === 'grid'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Grid Search
        </button>
        <button
          onClick={() => setTuningMode('random')}
          disabled={isRunning}
          className={`py-2 px-4 rounded-md font-medium transition-colors ${
            tuningMode === 'random'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Random Search
        </button>
        <button
          onClick={() => setTuningMode('sensitivity')}
          disabled={isRunning}
          className={`py-2 px-4 rounded-md font-medium transition-colors ${
            tuningMode === 'sensitivity'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Sensitivity
        </button>
        <button
          onClick={() => setTuningMode('auto')}
          disabled={isRunning}
          className={`py-2 px-4 rounded-md font-medium transition-colors ${
            tuningMode === 'auto'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Auto-Tune
        </button>
      </div>

      {/* Mode Description */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">
          {tuningMode === 'grid' && 'Grid Search'}
          {tuningMode === 'random' && 'Random Search'}
          {tuningMode === 'sensitivity' && 'Sensitivity Analysis'}
          {tuningMode === 'auto' && 'Auto-Tuning'}
        </h3>
        <p className="text-sm text-gray-600">
          {tuningMode === 'grid' && 'Systematically tests all combinations of hyperparameters within specified ranges.'}
          {tuningMode === 'random' && 'Randomly samples hyperparameter combinations for faster exploration.'}
          {tuningMode === 'sensitivity' && 'Analyzes how each hyperparameter affects model performance independently.'}
          {tuningMode === 'auto' && 'Uses pre-selected effective hyperparameter combinations based on best practices.'}
        </p>
      </div>

      {/* Parameter Ranges (for grid and random search) */}
      {(tuningMode === 'grid' || tuningMode === 'random') && (
        <div className="mb-6 space-y-4">
          <h3 className="font-semibold">Parameter Ranges</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Learning Rate
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={ranges.learningRate.min}
                  onChange={(e) => setRanges({
                    ...ranges,
                    learningRate: { ...ranges.learningRate, min: parseFloat(e.target.value) }
                  })}
                  step="0.001"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={ranges.learningRate.max}
                  onChange={(e) => setRanges({
                    ...ranges,
                    learningRate: { ...ranges.learningRate, max: parseFloat(e.target.value) }
                  })}
                  step="0.001"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Size
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={ranges.batchSize.min}
                  onChange={(e) => setRanges({
                    ...ranges,
                    batchSize: { ...ranges.batchSize, min: parseInt(e.target.value) }
                  })}
                  step="8"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={ranges.batchSize.max}
                  onChange={(e) => setRanges({
                    ...ranges,
                    batchSize: { ...ranges.batchSize, max: parseInt(e.target.value) }
                  })}
                  step="8"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Epochs
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={ranges.epochs.min}
                  onChange={(e) => setRanges({
                    ...ranges,
                    epochs: { ...ranges.epochs, min: parseInt(e.target.value) }
                  })}
                  step="10"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={ranges.epochs.max}
                  onChange={(e) => setRanges({
                    ...ranges,
                    epochs: { ...ranges.epochs, max: parseInt(e.target.value) }
                  })}
                  step="10"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dropout Rate
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={ranges.dropout.min}
                  onChange={(e) => setRanges({
                    ...ranges,
                    dropout: { ...ranges.dropout, min: parseFloat(e.target.value) }
                  })}
                  step="0.05"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={ranges.dropout.max}
                  onChange={(e) => setRanges({
                    ...ranges,
                    dropout: { ...ranges.dropout, max: parseFloat(e.target.value) }
                  })}
                  step="0.05"
                  className="flex-1 px-2 py-1 border rounded-md text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isRunning && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{currentExperiment}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={runTuning}
        disabled={isRunning}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          isRunning
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {isRunning ? 'Running...' : 'Start Tuning'}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Results</h3>
          
          {/* Best Result */}
          {bestResult && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-green-800">Best Configuration</h4>
                  <div className="mt-2 text-sm space-y-1">
                    <p>Learning Rate: {bestResult.params.learningRate.toFixed(4)}</p>
                    <p>Batch Size: {bestResult.params.batchSize}</p>
                    <p>Epochs: {bestResult.params.epochs}</p>
                    <p>Architecture: {bestResult.params.neurons.join(' → ')} neurons</p>
                    {bestResult.params.dropout && bestResult.params.dropout > 0 && <p>Dropout: {bestResult.params.dropout.toFixed(2)}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-800">
                    {(bestResult.score * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-600">Score</p>
                  <button
                    onClick={applyBestResult}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    Apply to Network
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sensitivity Chart */}
          {tuningMode === 'sensitivity' && (
            <div className="mb-4">
              <svg ref={sensitivityChartRef} className="w-full" />
            </div>
          )}

          {/* Results Table */}
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left">LR</th>
                  <th className="px-2 py-1 text-left">Batch</th>
                  <th className="px-2 py-1 text-left">Epochs</th>
                  <th className="px-2 py-1 text-left">Layers</th>
                  <th className="px-2 py-1 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 20).map((result) => (
                  <tr key={result.id} className="border-t">
                    <td className="px-2 py-1">{result.params.learningRate.toFixed(4)}</td>
                    <td className="px-2 py-1">{result.params.batchSize}</td>
                    <td className="px-2 py-1">{result.params.epochs}</td>
                    <td className="px-2 py-1">{result.params.layers}</td>
                    <td className="px-2 py-1 font-medium">
                      {(result.score * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};