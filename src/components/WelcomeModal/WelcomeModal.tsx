import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { NetworkConfig } from '../../modules/NeuralNetwork/NeuralNetwork';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const networkPresets: { name: string; description: string; config: NetworkConfig; icon: string }[] = [
  {
    name: 'XOR Solver',
    description: 'Classic non-linear problem - perfect for beginners',
    icon: '🎯',
    config: {
      layers: [
        { units: 2, activation: 'relu', inputShape: [2] },
        { units: 4, activation: 'relu' },
        { units: 1, activation: 'sigmoid' }
      ],
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      learningRate: 0.01
    }
  },
  {
    name: 'Simple Classifier',
    description: 'Binary classification network for circular data',
    icon: '🔵',
    config: {
      layers: [
        { units: 2, activation: 'relu', inputShape: [2] },
        { units: 8, activation: 'relu' },
        { units: 4, activation: 'relu' },
        { units: 1, activation: 'sigmoid' }
      ],
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      learningRate: 0.01
    }
  },
  {
    name: 'Deep Network',
    description: 'Multi-layer network for complex patterns',
    icon: '🏗️',
    config: {
      layers: [
        { units: 2, activation: 'relu', inputShape: [2] },
        { units: 16, activation: 'relu' },
        { units: 8, activation: 'relu' },
        { units: 4, activation: 'relu' },
        { units: 1, activation: 'sigmoid' }
      ],
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      learningRate: 0.005
    }
  },
  {
    name: 'Linear Regression',
    description: 'Simple network for linear relationships',
    icon: '📈',
    config: {
      layers: [
        { units: 1, activation: 'linear', inputShape: [1] },
        { units: 1, activation: 'linear' }
      ],
      optimizer: 'sgd',
      loss: 'meanSquaredError',
      learningRate: 0.01
    }
  }
];

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { setNetwork } = useStore();

  const steps = [
    {
      title: 'Welcome to Deep Learning Simulator! 🧠',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Get ready to explore the fascinating world of neural networks! This interactive simulator 
            will help you understand how deep learning works through hands-on experimentation.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🏗️</div>
              <h3 className="font-semibold text-blue-900">Build</h3>
              <p className="text-sm text-blue-700">Design your own neural networks</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-green-900">Train</h3>
              <p className="text-sm text-green-700">Watch them learn in real-time</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">👁️</div>
              <h3 className="font-semibold text-purple-900">Visualize</h3>
              <p className="text-sm text-purple-700">See how data flows through</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-orange-900">Learn</h3>
              <p className="text-sm text-orange-700">Understand deep learning concepts</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'How Neural Networks Work 🔄',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <span className="text-blue-500 mr-2">→</span>
              Forward Propagation
            </h3>
            <p className="text-sm text-gray-600">
              Data flows from input to output, being transformed at each layer by weights and activation functions.
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <span className="text-purple-500 mr-2">←</span>
              Backpropagation
            </h3>
            <p className="text-sm text-gray-600">
              Errors flow backward, adjusting weights to minimize the difference between predictions and targets.
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <span className="text-green-500 mr-2">🔁</span>
              Training Loop
            </h3>
            <p className="text-sm text-gray-600">
              This process repeats many times, gradually improving the network's ability to make predictions.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Choose a Starting Point 🚀',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            Select a preset network architecture to begin, or start from scratch:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {networkPresets.map((preset, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setNetwork(preset.config);
                  onClose();
                }}
                className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{preset.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{preset.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{preset.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Start from Scratch
          </button>
        </div>
      )
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={currentStep === steps.length - 1 ? onClose : undefined}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {steps[currentStep].title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  {steps[currentStep].content}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'w-8 bg-blue-500'
                            : index < currentStep
                            ? 'w-2 bg-blue-300'
                            : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    {currentStep > 0 && currentStep < steps.length - 1 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    {currentStep < steps.length - 1 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {currentStep === 0 ? "Let's Start!" : 'Next'}
                      </motion.button>
                    )}
                    {currentStep > 0 && currentStep === steps.length - 1 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Back
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};