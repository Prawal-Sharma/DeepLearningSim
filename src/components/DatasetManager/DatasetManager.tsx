import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useToast } from '../Toast/ToastProvider';

interface DataPoint {
  x: number;
  y: number;
  label: number;
}

interface Dataset {
  name: string;
  data: DataPoint[];
  features: number;
  classes: number;
  type: 'classification' | 'regression';
}

interface DatasetManagerProps {
  onDatasetSelect: (dataset: Dataset) => void;
}

export const DatasetManager: React.FC<DatasetManagerProps> = ({ onDatasetSelect }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'draw' | 'preprocess'>('upload');
  const [uploadedData, setUploadedData] = useState<DataPoint[]>([]);
  const [drawnData, setDrawnData] = useState<DataPoint[]>([]);
  const [currentClass, setCurrentClass] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { showToast } = useToast();

  // Preprocessing options
  const [normalizeData, setNormalizeData] = useState(true);
  const [shuffleData, setShuffleData] = useState(true);
  const [trainTestSplit, setTrainTestSplit] = useState(0.8);
  const [augmentationEnabled, setAugmentationEnabled] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0.1);

  // Parse CSV file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      // Skip headers line - we know the format is x,y,label
      lines[0].split(',').map(h => h.trim());
      
      const data: DataPoint[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => parseFloat(v.trim()));
        if (values.length >= 2) {
          data.push({
            x: values[0],
            y: values[1],
            label: values[2] || 0,
          });
        }
      }

      setUploadedData(data);
      showToast(`Loaded ${data.length} data points from CSV`, 'success');
    } catch (error) {
      showToast('Failed to parse CSV file', 'error');
      console.error('CSV parse error:', error);
    }
  };

  // Initialize drawing canvas
  useEffect(() => {
    if (activeTab === 'draw' && svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = 400;
      const height = 400;

      svg.attr('viewBox', `0 0 ${width} ${height}`);
      
      // Clear previous elements
      svg.selectAll('*').remove();

      // Add background
      svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#f9fafb')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 2);

      // Add grid
      const gridSize = 20;
      for (let i = gridSize; i < width; i += gridSize) {
        svg.append('line')
          .attr('x1', i)
          .attr('x2', i)
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', '#e5e7eb')
          .attr('stroke-width', 0.5);
      }
      for (let i = gridSize; i < height; i += gridSize) {
        svg.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', i)
          .attr('y2', i)
          .attr('stroke', '#e5e7eb')
          .attr('stroke-width', 0.5);
      }

      // Scale functions
      const xScale = d3.scaleLinear().domain([0, width]).range([-1, 1]);
      const yScale = d3.scaleLinear().domain([0, height]).range([1, -1]);

      // Draw existing points
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      drawnData.forEach(point => {
        svg.append('circle')
          .attr('cx', ((point.x + 1) / 2) * width)
          .attr('cy', ((1 - point.y) / 2) * height)
          .attr('r', 5)
          .attr('fill', colors[point.label % colors.length])
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
      });

      // Handle click to add points
      svg.on('click', function(event) {
        if (!isDrawing) return;
        
        const [x, y] = d3.pointer(event);
        const newPoint: DataPoint = {
          x: xScale(x),
          y: yScale(y),
          label: currentClass,
        };

        setDrawnData([...drawnData, newPoint]);
        
        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 0)
          .attr('fill', colors[currentClass % colors.length])
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .transition()
          .duration(200)
          .attr('r', 5);
      });
    }
  }, [activeTab, drawnData, currentClass, isDrawing]);

  // Normalize data
  const normalizeDataPoints = (data: DataPoint[]): DataPoint[] => {
    if (!normalizeData || data.length === 0) return data;

    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    return data.map(point => ({
      x: (point.x - xMin) / (xMax - xMin) * 2 - 1,
      y: (point.y - yMin) / (yMax - yMin) * 2 - 1,
      label: point.label,
    }));
  };

  // Shuffle data
  const shuffleDataPoints = (data: DataPoint[]): DataPoint[] => {
    if (!shuffleData) return data;
    
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Add noise for augmentation
  const augmentData = (data: DataPoint[]): DataPoint[] => {
    if (!augmentationEnabled) return data;

    const augmented: DataPoint[] = [...data];
    data.forEach(point => {
      for (let i = 0; i < 2; i++) {
        augmented.push({
          x: point.x + (Math.random() - 0.5) * noiseLevel,
          y: point.y + (Math.random() - 0.5) * noiseLevel,
          label: point.label,
        });
      }
    });
    return augmented;
  };

  // Process and select dataset
  const processAndSelectDataset = () => {
    let data = activeTab === 'upload' ? uploadedData : drawnData;
    
    if (data.length === 0) {
      showToast('No data to process', 'warning');
      return;
    }

    // Apply preprocessing
    data = normalizeDataPoints(data);
    data = augmentData(data);
    data = shuffleDataPoints(data);

    const dataset: Dataset = {
      name: activeTab === 'upload' ? 'Uploaded Dataset' : 'Custom Drawn Dataset',
      data,
      features: 2,
      classes: Math.max(...data.map(d => d.label)) + 1,
      type: 'classification',
    };

    onDatasetSelect(dataset);
    showToast(`Dataset prepared with ${data.length} points`, 'success');
  };

  // Generate synthetic datasets
  const generateSyntheticDataset = (type: string) => {
    let data: DataPoint[] = [];

    switch (type) {
      case 'spiral':
        for (let i = 0; i < 100; i++) {
          const t = (i / 100) * 4 * Math.PI;
          const r = t / (4 * Math.PI) * 0.8;
          data.push({
            x: r * Math.cos(t),
            y: r * Math.sin(t),
            label: 0,
          });
          data.push({
            x: -r * Math.cos(t),
            y: -r * Math.sin(t),
            label: 1,
          });
        }
        break;

      case 'clusters':
        const centers = [
          { x: -0.5, y: -0.5, label: 0 },
          { x: 0.5, y: -0.5, label: 1 },
          { x: 0, y: 0.5, label: 2 },
        ];
        centers.forEach(center => {
          for (let i = 0; i < 50; i++) {
            data.push({
              x: center.x + (Math.random() - 0.5) * 0.4,
              y: center.y + (Math.random() - 0.5) * 0.4,
              label: center.label,
            });
          }
        });
        break;

      case 'moons':
        for (let i = 0; i < 100; i++) {
          const angle = (i / 100) * Math.PI;
          data.push({
            x: Math.cos(angle) * 0.5,
            y: Math.sin(angle) * 0.5,
            label: 0,
          });
          data.push({
            x: Math.cos(angle) * 0.5 + 0.25,
            y: Math.sin(angle) * 0.5 - 0.5,
            label: 1,
          });
        }
        break;
    }

    setDrawnData(data);
    showToast(`Generated ${type} dataset with ${data.length} points`, 'success');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dataset Manager</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Upload CSV
        </button>
        <button
          onClick={() => setActiveTab('draw')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'draw'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Draw Dataset
        </button>
        <button
          onClick={() => setActiveTab('preprocess')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'preprocess'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Preprocess
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 mb-2">Upload a CSV file with your data</p>
            <p className="text-sm text-gray-500 mb-4">Format: x, y, label (optional)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Choose File
            </button>
          </div>
          
          {uploadedData.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                Loaded {uploadedData.length} data points
              </p>
              <p className="text-sm text-green-600">
                Features detected: x, y{uploadedData[0].label !== undefined && ', label'}
              </p>
            </div>
          )}

          {/* Sample CSV Template */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Sample CSV Format:</h3>
            <pre className="bg-gray-100 p-3 rounded-md text-sm">
{`x,y,label
0.5,0.3,0
-0.2,0.8,1
0.1,-0.5,0
...`}
            </pre>
          </div>
        </div>
      )}

      {/* Draw Tab */}
      {activeTab === 'draw' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsDrawing(!isDrawing)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDrawing
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isDrawing ? 'Drawing Mode ON' : 'Drawing Mode OFF'}
              </button>
              <button
                onClick={() => setDrawnData([])}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Points: {drawnData.length}
            </div>
          </div>

          {/* Class Selection */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm font-medium">Select Class:</span>
            {[0, 1, 2, 3].map(cls => (
              <button
                key={cls}
                onClick={() => setCurrentClass(cls)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  currentClass === cls ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                style={{
                  backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][cls],
                  borderColor: 'white',
                }}
              />
            ))}
          </div>

          {/* Drawing Canvas */}
          <div className="border rounded-lg overflow-hidden">
            <svg ref={svgRef} className="w-full cursor-crosshair" />
          </div>

          {/* Synthetic Dataset Generators */}
          <div>
            <h3 className="font-semibold mb-2">Generate Synthetic Dataset:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => generateSyntheticDataset('spiral')}
                className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              >
                Spiral
              </button>
              <button
                onClick={() => generateSyntheticDataset('clusters')}
                className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              >
                Clusters
              </button>
              <button
                onClick={() => generateSyntheticDataset('moons')}
                className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm"
              >
                Moons
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preprocess Tab */}
      {activeTab === 'preprocess' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={normalizeData}
                onChange={(e) => setNormalizeData(e.target.checked)}
                className="mr-3"
              />
              <div>
                <span className="font-medium">Normalize Data</span>
                <p className="text-sm text-gray-500">Scale features to [-1, 1] range</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={shuffleData}
                onChange={(e) => setShuffleData(e.target.checked)}
                className="mr-3"
              />
              <div>
                <span className="font-medium">Shuffle Data</span>
                <p className="text-sm text-gray-500">Randomize data order for better training</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={augmentationEnabled}
                onChange={(e) => setAugmentationEnabled(e.target.checked)}
                className="mr-3"
              />
              <div>
                <span className="font-medium">Data Augmentation</span>
                <p className="text-sm text-gray-500">Add noisy copies to increase dataset size</p>
              </div>
            </label>
          </div>

          {augmentationEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Noise Level: {noiseLevel.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Train/Test Split: {(trainTestSplit * 100).toFixed(0)}% / {((1 - trainTestSplit) * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="0.9"
              step="0.05"
              value={trainTestSplit}
              onChange={(e) => setTrainTestSplit(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Data Summary */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-2">Data Summary</h3>
            <div className="text-sm space-y-1">
              <p>Source: {uploadedData.length > 0 ? 'CSV Upload' : drawnData.length > 0 ? 'Hand Drawn' : 'No data'}</p>
              <p>Original Points: {Math.max(uploadedData.length, drawnData.length)}</p>
              {augmentationEnabled && (
                <p>After Augmentation: ~{Math.max(uploadedData.length, drawnData.length) * 3} points</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={processAndSelectDataset}
        disabled={uploadedData.length === 0 && drawnData.length === 0}
        className="w-full mt-6 py-3 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Apply Dataset to Network
      </motion.button>
    </div>
  );
};