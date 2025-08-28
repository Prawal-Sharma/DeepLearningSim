import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { NetworkBuilder } from './components/NetworkBuilder/NetworkBuilder'
import { NetworkVisualizer } from './components/Visualizer/NetworkVisualizer'
import { TrainingPanel } from './components/ControlPanel/TrainingPanel'
import { WelcomeModal } from './components/WelcomeModal/WelcomeModal'
import { ToastProvider } from './components/Toast/ToastProvider'
import { Tooltip } from './components/Tooltip/Tooltip'
import { TrainingCharts } from './components/Charts/TrainingCharts'
import { EnhancedTrainingControls } from './components/ControlPanel/EnhancedTrainingControls'
import { TutorialSystem } from './components/Tutorial/TutorialSystem'
import { ConceptCards } from './components/Education/ConceptCards'
import { ActivationVisualizer } from './components/Education/ActivationVisualizer'
import { ModelManager } from './components/ModelManager/ModelManager'
import { DatasetManager } from './components/DatasetManager/DatasetManager'
import { HyperparameterTuner } from './components/HyperparameterTuner/HyperparameterTuner'
import { useStore } from './store/useStore'

function App() {
  const [activeView, setActiveView] = useState<'builder' | 'training' | 'visualizer' | 'learn' | 'models' | 'data'>('builder')
  const [showWelcome, setShowWelcome] = useState(false)
  const { isTraining, isPaused, pauseTraining, resumeTraining, stopTraining, setTrainingSpeed } = useStore()

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setShowWelcome(true)
      localStorage.setItem('hasVisited', 'true')
    }
  }, [])

  // Keyboard shortcuts
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    switch (e.key) {
      case ' ':
        e.preventDefault()
        if (isTraining) {
          if (isPaused) resumeTraining()
          else pauseTraining()
        }
        break
      case 'Escape':
        if (isTraining) stopTraining()
        break
      case '1':
        setTrainingSpeed(0.5)
        break
      case '2':
        setTrainingSpeed(1)
        break
      case '3':
        setTrainingSpeed(2)
        break
      case '4':
        setTrainingSpeed(5)
        break
    }
  }, [isTraining, isPaused, pauseTraining, resumeTraining, stopTraining, setTrainingSpeed])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
        
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Deep Learning Simulator
                </h1>
                <Tooltip content="Click here to see the welcome guide again">
                  <button
                    onClick={() => setShowWelcome(true)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
              <nav className="flex space-x-2">
              <button
                onClick={() => setActiveView('builder')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'builder'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  <span>Builder</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('training')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'training'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Training</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('visualizer')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'visualizer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Visualizer</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('learn')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'learn'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Learn</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('models')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'models'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span>Models</span>
                </div>
              </button>
              <button
                onClick={() => setActiveView('data')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === 'data'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Data</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeView === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetworkBuilder />
            <NetworkVisualizer />
          </div>
        )}
        
        {activeView === 'training' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrainingPanel />
              </div>
              <EnhancedTrainingControls />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkVisualizer />
              <TrainingCharts />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HyperparameterTuner />
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Hyperparameter Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">📊</span>
                    <span><strong>Grid Search:</strong> Exhaustive but thorough - tests all combinations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">🎲</span>
                    <span><strong>Random Search:</strong> Faster exploration of hyperparameter space</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">📈</span>
                    <span><strong>Sensitivity:</strong> See how each parameter affects performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">🤖</span>
                    <span><strong>Auto-Tune:</strong> Uses proven effective combinations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">💡</span>
                    <span><strong>Tip:</strong> Start with Auto-Tune, then refine with Grid Search</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'visualizer' && (
          <div className="space-y-6">
            <NetworkVisualizer />
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Understanding Neural Networks</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  This visualization shows how data flows through a neural network. Each circle represents a neuron, 
                  and the lines between them represent weighted connections.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Forward Propagation:</strong> Data flows from left to right, being transformed at each layer</li>
                  <li><strong>Weights:</strong> Blue lines show positive weights, red lines show negative weights</li>
                  <li><strong>Activation Functions:</strong> Each neuron applies a function to its input (ReLU, Sigmoid, etc.)</li>
                  <li><strong>Backpropagation:</strong> During training, errors flow backward to update weights</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeView === 'learn' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-2">Learn Deep Learning</h2>
              <p className="text-lg opacity-90">
                Explore interactive tutorials, understand key concepts, and visualize how neural networks work
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConceptCards />
              <ActivationVisualizer />
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Start Small</h4>
                  <p className="text-sm text-blue-700">
                    Begin with simple networks (2-3 layers) and gradually increase complexity
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Experiment</h4>
                  <p className="text-sm text-green-700">
                    Try different activation functions and see how they affect learning
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Observe Patterns</h4>
                  <p className="text-sm text-purple-700">
                    Watch how loss decreases and accuracy improves during training
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'models' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModelManager />
              <div className="space-y-4">
                <NetworkVisualizer />
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Model Management Guide</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span><strong>Save Models:</strong> Store your trained models in browser storage for later use</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span><strong>Export Models:</strong> Download models as JSON or TensorFlow.js format</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      <span><strong>Compare Models:</strong> Select up to 3 models to compare their performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span><strong>Load Models:</strong> Restore saved models to continue training or testing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'data' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-2">Dataset Management</h2>
              <p className="text-lg opacity-90">
                Upload CSV data, draw custom datasets, or generate synthetic patterns for training
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DatasetManager onDatasetSelect={() => {
                // Dataset is now automatically saved to store when "Use for Training" is clicked
                // This callback is kept for backward compatibility
              }} />
              <div className="space-y-4">
                <NetworkVisualizer />
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Data Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">📊</span>
                      <span><strong>CSV Upload:</strong> Import your existing datasets in CSV format</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-500 mr-2">🎨</span>
                      <span><strong>Draw Mode:</strong> Click to add points for different classes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">🔧</span>
                      <span><strong>Preprocessing:</strong> Normalize and augment your data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-500 mr-2">🧬</span>
                      <span><strong>Synthetic Data:</strong> Generate spiral, cluster, or moon patterns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Tutorial System Overlay */}
      <TutorialSystem />
      </div>
    </ToastProvider>
  )
}

export default App