import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Concept {
  id: string;
  title: string;
  category: 'basics' | 'architecture' | 'training' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  shortDescription: string;
  fullExplanation: React.ReactNode;
  formula?: string;
  visualExample?: React.ReactNode;
  relatedConcepts?: string[];
}

const concepts: Concept[] = [
  {
    id: 'neuron',
    title: 'Artificial Neuron',
    category: 'basics',
    difficulty: 'beginner',
    shortDescription: 'The basic building block of neural networks',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          An artificial neuron is inspired by biological neurons in the brain. It receives 
          inputs, processes them, and produces an output.
        </p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <strong>How it works:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
            <li>Receives multiple input values (x₁, x₂, ...)</li>
            <li>Multiplies each input by a weight (w₁, w₂, ...)</li>
            <li>Adds all weighted inputs together</li>
            <li>Adds a bias term (b)</li>
            <li>Applies an activation function</li>
          </ol>
        </div>
        <p className="text-sm text-gray-600">
          Think of it like a decision maker: it weighs different factors (inputs) and makes 
          a decision (output) based on their importance (weights).
        </p>
      </div>
    ),
    formula: 'output = f(Σ(wᵢ × xᵢ) + b)',
    relatedConcepts: ['weights', 'bias', 'activation-function'],
  },
  {
    id: 'weights',
    title: 'Weights & Biases',
    category: 'basics',
    difficulty: 'beginner',
    shortDescription: 'Parameters that the network learns',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          Weights and biases are the learnable parameters of a neural network. They determine 
          how the network processes information.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <strong>Weights (w)</strong>
            <p className="text-sm mt-1">
              Control the strength of connections between neurons. Like volume knobs that 
              amplify or diminish signals.
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <strong>Bias (b)</strong>
            <p className="text-sm mt-1">
              Shifts the activation threshold. Like adjusting when a neuron should "fire" 
              or activate.
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          During training, the network adjusts these values to minimize prediction errors.
        </p>
      </div>
    ),
    formula: 'z = w₁x₁ + w₂x₂ + ... + b',
    relatedConcepts: ['neuron', 'gradient-descent', 'backpropagation'],
  },
  {
    id: 'activation-function',
    title: 'Activation Functions',
    category: 'architecture',
    difficulty: 'intermediate',
    shortDescription: 'Functions that add non-linearity to networks',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          Activation functions determine whether a neuron should be activated or not. They 
          introduce non-linearity, allowing networks to learn complex patterns.
        </p>
        <div className="space-y-2">
          <div className="border-l-4 border-blue-500 pl-3">
            <strong>ReLU (Rectified Linear Unit)</strong>
            <p className="text-sm">f(x) = max(0, x) - Simple and effective</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <strong>Sigmoid</strong>
            <p className="text-sm">f(x) = 1/(1 + e⁻ˣ) - Outputs between 0 and 1</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-3">
            <strong>Tanh</strong>
            <p className="text-sm">f(x) = (eˣ - e⁻ˣ)/(eˣ + e⁻ˣ) - Outputs between -1 and 1</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 italic">
          Without activation functions, even deep networks would only learn linear relationships!
        </p>
      </div>
    ),
    relatedConcepts: ['neuron', 'forward-propagation', 'gradient-descent'],
  },
  {
    id: 'forward-propagation',
    title: 'Forward Propagation',
    category: 'training',
    difficulty: 'intermediate',
    shortDescription: 'How data flows through the network',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          Forward propagation is the process of passing input data through the network to 
          generate predictions. Data flows from input to output, layer by layer.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg">
          <strong>The Journey of Data:</strong>
          <div className="flex items-center space-x-2 mt-2">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                Input
              </div>
            </div>
            <span>→</span>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center">
                H1
              </div>
            </div>
            <span>→</span>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center">
                H2
              </div>
            </div>
            <span>→</span>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                Out
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm">
          At each layer: Output = Activation(Weights × Input + Bias)
        </p>
      </div>
    ),
    formula: 'aⁿ = f(Wⁿ × aⁿ⁻¹ + bⁿ)',
    relatedConcepts: ['neuron', 'activation-function', 'backpropagation'],
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation',
    category: 'training',
    difficulty: 'advanced',
    shortDescription: 'How networks learn from errors',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          Backpropagation is the algorithm that allows neural networks to learn. It calculates 
          how much each weight contributed to the error and adjusts them accordingly.
        </p>
        <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-3 rounded-lg">
          <strong>The Learning Process:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
            <li>Calculate error at output layer</li>
            <li>Propagate error backwards through network</li>
            <li>Calculate gradients (rate of change) for each weight</li>
            <li>Update weights in direction that reduces error</li>
          </ol>
        </div>
        <p className="text-sm text-gray-600">
          It's like a teacher marking an exam and showing where mistakes were made, so the 
          student (network) can learn and improve.
        </p>
      </div>
    ),
    formula: 'w = w - α × ∂L/∂w',
    relatedConcepts: ['gradient-descent', 'loss-function', 'learning-rate'],
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    category: 'training',
    difficulty: 'intermediate',
    shortDescription: 'Optimization algorithm for finding minimum loss',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          Gradient descent is like hiking down a mountain in the dark. You feel the slope 
          and take steps in the steepest downward direction to reach the valley (minimum loss).
        </p>
        <div className="bg-orange-50 p-3 rounded-lg">
          <strong>Types of Gradient Descent:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• <strong>Batch:</strong> Uses entire dataset (accurate but slow)</li>
            <li>• <strong>Stochastic:</strong> Uses one sample (fast but noisy)</li>
            <li>• <strong>Mini-batch:</strong> Uses small groups (balanced approach)</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600">
          The learning rate determines step size - too large and you might overshoot, 
          too small and training takes forever!
        </p>
      </div>
    ),
    formula: 'θ = θ - α∇J(θ)',
    relatedConcepts: ['backpropagation', 'learning-rate', 'optimizer'],
  },
  {
    id: 'loss-function',
    title: 'Loss Functions',
    category: 'training',
    difficulty: 'intermediate',
    shortDescription: 'Measures how wrong the predictions are',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          Loss functions quantify the difference between predicted and actual values. 
          The goal of training is to minimize this loss.
        </p>
        <div className="space-y-2">
          <div className="border-l-4 border-red-500 pl-3">
            <strong>Mean Squared Error (MSE)</strong>
            <p className="text-sm">For regression: (predicted - actual)²</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-3">
            <strong>Binary Cross-Entropy</strong>
            <p className="text-sm">For binary classification (yes/no)</p>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <strong>Categorical Cross-Entropy</strong>
            <p className="text-sm">For multi-class classification</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 italic">
          Lower loss = better predictions!
        </p>
      </div>
    ),
    relatedConcepts: ['backpropagation', 'gradient-descent', 'optimizer'],
  },
  {
    id: 'overfitting',
    title: 'Overfitting & Underfitting',
    category: 'advanced',
    difficulty: 'intermediate',
    shortDescription: 'Common training problems and solutions',
    fullExplanation: (
      <div className="space-y-3">
        <p>
          These are two common problems in machine learning that affect model performance.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 p-3 rounded-lg">
            <strong>Overfitting</strong>
            <p className="text-sm mt-1">
              Model memorizes training data instead of learning patterns. Like memorizing 
              answers instead of understanding concepts.
            </p>
            <p className="text-xs mt-2 text-red-700">
              Fix: More data, regularization, dropout
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <strong>Underfitting</strong>
            <p className="text-sm mt-1">
              Model is too simple to capture patterns. Like trying to fit a curve with 
              a straight line.
            </p>
            <p className="text-xs mt-2 text-yellow-700">
              Fix: More complex model, more features
            </p>
          </div>
        </div>
      </div>
    ),
    relatedConcepts: ['regularization', 'dropout', 'validation'],
  },
];

export const ConceptCards: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'basics', 'architecture', 'training', 'advanced'];

  const filteredConcepts = concepts.filter(concept => {
    const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory;
    const matchesSearch = concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          concept.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basics':
        return 'border-blue-500 bg-blue-50';
      case 'architecture':
        return 'border-purple-500 bg-purple-50';
      case 'training':
        return 'border-green-500 bg-green-50';
      case 'advanced':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Deep Learning Concepts</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Concept Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConcepts.map((concept) => (
            <motion.div
              key={concept.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedConcept(concept)}
              className={`border-l-4 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${getCategoryColor(concept.category)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{concept.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(concept.difficulty)}`}>
                  {concept.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600">{concept.shortDescription}</p>
              {concept.formula && (
                <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs font-mono">
                  {concept.formula}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Concept Modal */}
      <AnimatePresence>
        {selectedConcept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedConcept(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedConcept.title}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(selectedConcept.difficulty)}`}>
                        {selectedConcept.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {selectedConcept.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConcept(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedConcept.fullExplanation}

                  {selectedConcept.formula && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Mathematical Formula</h3>
                      <p className="font-mono text-lg text-center">{selectedConcept.formula}</p>
                    </div>
                  )}

                  {selectedConcept.relatedConcepts && (
                    <div>
                      <h3 className="font-semibold mb-2">Related Concepts</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedConcept.relatedConcepts.map((id) => {
                          const related = concepts.find(c => c.id === id);
                          return related ? (
                            <button
                              key={id}
                              onClick={() => setSelectedConcept(related)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                            >
                              {related.title}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};