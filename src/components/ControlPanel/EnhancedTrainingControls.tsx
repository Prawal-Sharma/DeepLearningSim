import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Tooltip } from '../Tooltip/Tooltip';

export const EnhancedTrainingControls: React.FC = () => {
  const {
    isTraining,
    isPaused,
    currentEpoch,
    totalEpochs,
    trainingSpeed,
    pauseTraining,
    resumeTraining,
    stopTraining,
    setTrainingSpeed,
  } = useStore();

  const speeds = [
    { value: 0.5, label: '0.5x', description: 'Slow - Better for learning' },
    { value: 1, label: '1x', description: 'Normal speed' },
    { value: 2, label: '2x', description: 'Fast' },
    { value: 5, label: '5x', description: 'Very fast' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Training Controls</h3>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {!isTraining ? (
          <Tooltip content="Start training from the beginning">
            <button
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              disabled
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </Tooltip>
        ) : isPaused ? (
          <Tooltip content="Resume training">
            <button
              onClick={resumeTraining}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </Tooltip>
        ) : (
          <Tooltip content="Pause training">
            <button
              onClick={pauseTraining}
              className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </button>
          </Tooltip>
        )}

        <Tooltip content="Stop training">
          <button
            onClick={stopTraining}
            className={`p-3 rounded-full transition-colors ${
              isTraining
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isTraining}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        </Tooltip>

        <Tooltip content="Step forward one epoch">
          <button
            className={`p-3 rounded-full transition-colors ${
              isTraining && !isPaused
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isTraining && isPaused
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isTraining || !isPaused}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5v14l7-7-7-7zm9 0v14h2V5h-2z" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Speed Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Training Speed
        </label>
        <div className="flex space-x-2">
          {speeds.map((speed) => (
            <Tooltip key={speed.value} content={speed.description}>
              <button
                onClick={() => setTrainingSpeed(speed.value)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  trainingSpeed === speed.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {speed.label}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {isTraining && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Training Progress</span>
            <span>{currentEpoch} / {totalEpochs} epochs</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className={`h-3 rounded-full ${
                  isPaused ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(currentEpoch / totalEpochs) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white font-medium">PAUSED</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div
            className={`h-3 w-3 rounded-full ${
              !isTraining
                ? 'bg-gray-400'
                : isPaused
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-green-500 animate-pulse'
            }`}
          />
          <span className="text-sm text-gray-600">
            {!isTraining
              ? 'Ready to train'
              : isPaused
              ? 'Training paused'
              : `Training at ${trainingSpeed}x speed`}
          </span>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300">Space</kbd>
            <span className="ml-2">Play/Pause</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300">Esc</kbd>
            <span className="ml-2">Stop</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300">→</kbd>
            <span className="ml-2">Step Forward</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300">1-4</kbd>
            <span className="ml-2">Change Speed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};