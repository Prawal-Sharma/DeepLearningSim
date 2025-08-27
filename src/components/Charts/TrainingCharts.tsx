import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

interface ChartData {
  epoch: number;
  loss: number;
  accuracy: number;
  val_loss?: number;
  val_accuracy?: number;
}

export const TrainingCharts: React.FC = () => {
  const { currentEpoch, loss, accuracy, isTraining } = useStore();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'both' | 'loss' | 'accuracy'>('both');

  useEffect(() => {
    if (currentEpoch > 0) {
      setChartData(prev => {
        const newData = [...prev];
        const existingIndex = newData.findIndex(d => d.epoch === currentEpoch);
        
        if (existingIndex >= 0) {
          newData[existingIndex] = {
            ...newData[existingIndex],
            loss,
            accuracy: accuracy * 100,
          };
        } else {
          newData.push({
            epoch: currentEpoch,
            loss,
            accuracy: accuracy * 100,
          });
        }
        
        return newData;
      });
    }
  }, [currentEpoch, loss, accuracy]);

  useEffect(() => {
    if (!isTraining && chartData.length > 0) {
      // Training stopped, keep the data
    } else if (!isTraining) {
      // Reset when starting new training
      setChartData([]);
    }
  }, [isTraining]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">Epoch {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(4)}
              {entry.name.includes('ccuracy') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!isTraining && chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Training Metrics</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Start training to see metrics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Training Metrics</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMetric('both')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              selectedMetric === 'both'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Both
          </button>
          <button
            onClick={() => setSelectedMetric('loss')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              selectedMetric === 'loss'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Loss
          </button>
          <button
            onClick={() => setSelectedMetric('accuracy')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              selectedMetric === 'accuracy'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Accuracy
          </button>
        </div>
      </div>

      {selectedMetric === 'both' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Loss</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="epoch" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="loss"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#lossGradient)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Accuracy (%)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="epoch" stroke="#6B7280" />
                <YAxis stroke="#6B7280" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#accuracyGradient)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedMetric === 'loss' && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="epoch" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="loss"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {selectedMetric === 'accuracy' && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="epoch" stroke="#6B7280" />
            <YAxis stroke="#6B7280" domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={300}
              name="Accuracy (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {isTraining && (
        <div className="mt-4 flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Training in progress...</span>
        </div>
      )}
    </motion.div>
  );
};