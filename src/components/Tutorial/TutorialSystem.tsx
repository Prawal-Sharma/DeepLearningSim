import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useToast } from '../Toast/ToastProvider';

export interface TutorialStep {
  id: string;
  title: string;
  content: string | React.ReactNode;
  target?: string; // CSS selector for element to highlight
  action?: () => void; // Action to perform when step is shown
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  requiresAction?: boolean; // Wait for user to complete action
  actionValidator?: () => boolean; // Check if action is complete
}

interface TutorialDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
}

const tutorials: TutorialDefinition[] = [
  {
    id: 'first-network',
    name: 'Build Your First Neural Network',
    description: 'Learn how to create and train a simple neural network',
    icon: '🏗️',
    difficulty: 'beginner',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Neural Networks!',
        content: (
          <div>
            <p className="mb-3">
              In this tutorial, you'll learn how to build and train your first neural network.
              We'll create a simple network that can solve the XOR problem.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <strong>What is XOR?</strong>
              <p className="text-sm mt-1">
                XOR (exclusive OR) outputs 1 when inputs are different, and 0 when they're the same.
                It's a classic problem that requires a neural network to solve!
              </p>
            </div>
          </div>
        ),
        position: 'center',
      },
      {
        id: 'network-builder',
        title: 'The Network Builder',
        content: 'This is where you design your neural network architecture. You can add layers, adjust neurons, and select activation functions.',
        target: '.network-builder',
        position: 'right',
      },
      {
        id: 'add-layer',
        title: 'Adding Layers',
        content: 'Neural networks learn by stacking layers. Each layer transforms the data in a different way. Click "Add Layer" to add a hidden layer.',
        target: '.add-layer-button',
        position: 'top',
        requiresAction: true,
        actionValidator: () => {
          const { networkConfig } = useStore.getState();
          return networkConfig.layers.length > 3;
        },
      },
      {
        id: 'configure-layer',
        title: 'Configure Your Layers',
        content: (
          <div>
            <p className="mb-2">Great! Now let's configure your layers:</p>
            <ul className="text-sm space-y-1">
              <li>• <strong>Neurons:</strong> More neurons = more learning capacity</li>
              <li>• <strong>Activation:</strong> ReLU is great for hidden layers</li>
              <li>• <strong>Output layer:</strong> Use sigmoid for binary classification</li>
            </ul>
          </div>
        ),
        position: 'right',
      },
      {
        id: 'training-panel',
        title: 'Training Your Network',
        content: 'Switch to the Training tab to see your network learn from data!',
        target: '.training-tab',
        position: 'bottom',
      },
      {
        id: 'select-dataset',
        title: 'Choose a Dataset',
        content: 'Select the XOR Problem dataset. This is a classic problem that demonstrates why we need neural networks.',
        target: '.dataset-selector',
        position: 'right',
      },
      {
        id: 'start-training',
        title: 'Start Training!',
        content: 'Click "Start Training" and watch your network learn! The loss should decrease as it gets better at the task.',
        target: '.start-training-button',
        position: 'top',
      },
      {
        id: 'observe-learning',
        title: 'Watch It Learn',
        content: (
          <div>
            <p className="mb-2">Amazing! Your network is learning! Notice:</p>
            <ul className="text-sm space-y-1">
              <li>• The <strong>loss</strong> decreases (network is improving)</li>
              <li>• The <strong>accuracy</strong> increases (better predictions)</li>
              <li>• The <strong>decision boundary</strong> changes shape</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              This is the magic of deep learning - the network figures out the pattern on its own!
            </p>
          </div>
        ),
        position: 'center',
      },
      {
        id: 'complete',
        title: '🎉 Congratulations!',
        content: (
          <div>
            <p className="mb-3">
              You've successfully built and trained your first neural network!
            </p>
            <p className="text-sm text-gray-600">
              You've learned:
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>✅ How to design a network architecture</li>
              <li>✅ The importance of hidden layers</li>
              <li>✅ How networks learn from data</li>
              <li>✅ What loss and accuracy mean</li>
            </ul>
            <p className="mt-3 text-sm font-medium">
              Ready for the next challenge? Try different datasets or network architectures!
            </p>
          </div>
        ),
        position: 'center',
      },
    ],
  },
  {
    id: 'understanding-backprop',
    name: 'Understanding Backpropagation',
    description: 'See how neural networks learn through backpropagation',
    icon: '🔄',
    difficulty: 'intermediate',
    steps: [
      {
        id: 'intro',
        title: 'The Learning Algorithm',
        content: (
          <div>
            <p className="mb-3">
              Backpropagation is how neural networks learn. It's like a teacher correcting 
              mistakes - the network adjusts its weights based on errors.
            </p>
            <div className="bg-purple-50 p-3 rounded-lg">
              <strong>The Process:</strong>
              <ol className="text-sm mt-1 list-decimal list-inside">
                <li>Make a prediction (forward pass)</li>
                <li>Calculate the error</li>
                <li>Send error backward through network</li>
                <li>Update weights to reduce error</li>
              </ol>
            </div>
          </div>
        ),
        position: 'center',
      },
    ],
  },
  {
    id: 'activation-functions',
    name: 'Activation Functions Explained',
    description: 'Learn why activation functions are crucial',
    icon: '📈',
    difficulty: 'beginner',
    steps: [
      {
        id: 'intro',
        title: 'Why Activation Functions?',
        content: (
          <div>
            <p className="mb-3">
              Without activation functions, neural networks could only learn linear patterns.
              Activation functions add non-linearity, allowing networks to learn complex patterns!
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-blue-50 p-2 rounded">
                <strong className="text-sm">ReLU</strong>
                <p className="text-xs">Simple and effective</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <strong className="text-sm">Sigmoid</strong>
                <p className="text-xs">Outputs 0-1 range</p>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <strong className="text-sm">Tanh</strong>
                <p className="text-xs">Outputs -1 to 1</p>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <strong className="text-sm">Softmax</strong>
                <p className="text-xs">For probabilities</p>
              </div>
            </div>
          </div>
        ),
        position: 'center',
      },
    ],
  },
];

export const TutorialSystem: React.FC = () => {
  const [activeTutorial, setActiveTutorial] = useState<TutorialDefinition | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [, setHighlightedElement] = useState<HTMLElement | null>(null);
  const { showToast } = useToast();

  const currentStep = activeTutorial?.steps[currentStepIndex];

  useEffect(() => {
    // Load completed tutorials from localStorage
    const completed = localStorage.getItem('completedTutorials');
    if (completed) {
      setCompletedTutorials(JSON.parse(completed));
    }
  }, []);

  useEffect(() => {
    // Highlight target element if specified
    if (currentStep?.target) {
      const element = document.querySelector(currentStep.target) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class
        element.classList.add('tutorial-highlight');
        
        return () => {
          element.classList.remove('tutorial-highlight');
        };
      }
    } else {
      setHighlightedElement(null);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep?.requiresAction && currentStep.actionValidator) {
      if (!currentStep.actionValidator()) {
        showToast('Please complete the required action first', 'warning');
        return;
      }
    }

    if (currentStepIndex < (activeTutorial?.steps.length || 0) - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Tutorial complete
      completeTutorial();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeTutorial = () => {
    if (activeTutorial) {
      const newCompleted = [...completedTutorials, activeTutorial.id];
      setCompletedTutorials(newCompleted);
      localStorage.setItem('completedTutorials', JSON.stringify(newCompleted));
      showToast(`Tutorial "${activeTutorial.name}" completed! 🎉`, 'success');
    }
    setActiveTutorial(null);
    setCurrentStepIndex(0);
  };

  const startTutorial = (tutorial: TutorialDefinition) => {
    setActiveTutorial(tutorial);
    setCurrentStepIndex(0);
    showToast(`Starting tutorial: ${tutorial.name}`, 'info');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Tutorial Selection Modal */}
      {!activeTutorial && (
        <div className="fixed bottom-4 left-4 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const modal = document.getElementById('tutorial-modal');
              if (modal) modal.classList.toggle('hidden');
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Tutorials</span>
          </motion.button>

          <div
            id="tutorial-modal"
            className="hidden absolute bottom-14 left-0 w-96 bg-white rounded-lg shadow-xl p-6 max-h-[500px] overflow-y-auto"
          >
            <h3 className="text-lg font-bold mb-4">Interactive Tutorials</h3>
            <div className="space-y-3">
              {tutorials.map((tutorial) => (
                <motion.div
                  key={tutorial.id}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => startTutorial(tutorial)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{tutorial.icon}</span>
                        <h4 className="font-semibold">{tutorial.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{tutorial.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(tutorial.difficulty)}`}>
                          {tutorial.difficulty}
                        </span>
                        {completedTutorials.includes(tutorial.id) && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Tutorial Overlay */}
      <AnimatePresence>
        {activeTutorial && currentStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* Backdrop with hole for highlighted element */}
            <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto" />

            {/* Tutorial Step Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`absolute bg-white rounded-lg shadow-2xl p-6 max-w-md pointer-events-auto ${
                currentStep.position === 'center' 
                  ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                  : 'top-20 right-20'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">{currentStep.title}</h3>
                <button
                  onClick={() => setActiveTutorial(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-gray-700 mb-6">
                {typeof currentStep.content === 'string' ? (
                  <p>{currentStep.content}</p>
                ) : (
                  currentStep.content
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {activeTutorial.steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentStepIndex
                          ? 'bg-purple-500'
                          : index < currentStepIndex
                          ? 'bg-purple-300'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex space-x-3">
                  {currentStepIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    {currentStepIndex === activeTutorial.steps.length - 1 ? 'Complete' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add CSS for highlighting */}
      <style>{`
        .tutorial-highlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(147, 51, 234, 0.2);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.4);
          }
        }
      `}</style>
    </>
  );
};