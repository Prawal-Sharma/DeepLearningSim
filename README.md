# Deep Learning Simulator

An comprehensive educational platform for learning deep learning through interactive visualizations, hands-on tutorials, and real-time experimentation.

## 🎯 Features

### Core Functionality
- **Interactive Network Builder**: Design custom neural networks with drag-and-drop simplicity
- **Real-time Visualization**: Watch your network architecture come to life with D3.js graphics
- **Live Training**: See weights update and data flow through the network in real-time
- **Dataset Visualization**: Interactive 2D plots showing data points and decision boundaries
- **Pre-built Datasets**: Train on XOR, circles, spirals, linear, and quadratic problems

### Educational Features 🆕
- **Interactive Tutorial System**: Step-by-step guided lessons for beginners
- **Concept Cards**: Comprehensive explanations of deep learning concepts
- **Activation Function Visualizer**: Interactive graphs showing how different activation functions work
- **Mathematical Formulas**: See the math behind neural networks
- **Learning Hub**: Dedicated space for educational content and exploration

### Advanced Controls
- **Pause/Resume Training**: Stop and continue training at any point
- **Variable Speed Training**: Control training speed (0.5x to 5x)
- **Keyboard Shortcuts**: Space (pause/resume), Esc (stop), 1-4 (speed control)
- **Custom Dataset Creation**: Click to add your own data points
- **Real-time Metrics**: Live loss and accuracy charts with Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Prawal-Sharma/DeepLearningSim.git
cd DeepLearningSim
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **React** with TypeScript for the UI
- **TensorFlow.js** for neural network computations
- **D3.js** for network visualization
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Zustand** for state management
- **Framer Motion** for animations

## 📚 How to Use

### 1. Network Builder Tab
- Add or remove layers using the intuitive interface
- Adjust neurons per layer (1-128)
- Select activation functions (ReLU, Sigmoid, Tanh, Linear, Softmax)
- Configure optimizer (Adam, SGD, RMSprop) and loss function
- Use network presets for quick start

### 2. Training Tab
- Select from 5 pre-built datasets or create your own
- Configure training parameters (epochs, batch size, learning rate)
- Use advanced controls:
  - ⏸️ Pause/Resume training
  - 🎚️ Adjust training speed (0.5x - 5x)
  - ⌨️ Keyboard shortcuts for quick control
- Watch real-time metrics and visualizations:
  - Loss and accuracy charts
  - Dataset visualization with decision boundaries
  - Network weight updates

### 3. Visualizer Tab
- See complete network architecture
- Interactive neuron information on hover
- Color-coded connections (blue = positive, red = negative weights)
- Real-time animation during training

### 4. Learn Tab 🆕
- **Interactive Tutorials**: Follow step-by-step guides
  - "Build Your First Neural Network"
  - "Understanding Backpropagation"
  - "Activation Functions Explained"
- **Concept Cards**: Click to explore deep learning concepts
  - Neurons, weights, biases
  - Forward/backward propagation
  - Gradient descent and optimizers
  - Overfitting and regularization
- **Activation Function Visualizer**:
  - Interactive graphs for 6 activation functions
  - Compare multiple functions side-by-side
  - See derivatives and understand gradients

## 🎓 Educational Concepts

This simulator helps you understand:

- **Neural Network Architecture**: How layers and neurons connect
- **Forward Propagation**: How data flows through the network
- **Backpropagation**: How errors are used to update weights
- **Activation Functions**: ReLU, Sigmoid, Tanh, and their effects
- **Gradient Descent**: How the network learns from data
- **Overfitting/Underfitting**: The balance between complexity and generalization

## 📊 Available Datasets

- **XOR Problem**: Classic non-linear classification
- **Circles**: Radial decision boundary classification
- **Spiral**: Complex non-linear classification
- **Linear Regression**: Simple linear relationship
- **Quadratic Regression**: Non-linear regression

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🎮 Keyboard Shortcuts

- **Space**: Pause/Resume training
- **Esc**: Stop training
- **1-4**: Set training speed (0.5x, 1x, 2x, 5x)

## 📈 Version History

### v2.0 - Educational Update
- Added comprehensive Learn tab with tutorials and concept explanations
- Interactive activation function visualizer
- Step-by-step tutorial system
- Concept cards with detailed explanations
- Mathematical formula displays

### v1.5 - Sprint 1 Complete
- Enhanced training controls (pause/resume, speed control)
- Dataset visualization with decision boundaries
- Real-time training charts
- Interactive dataset creation
- Keyboard shortcuts

### v1.0 - Initial Release
- Basic network builder
- Training with pre-built datasets
- Network visualization
- Welcome modal and onboarding

## 📄 License

This project is licensed under the MIT License.