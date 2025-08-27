# Deep Learning Simulator

An interactive web-based Deep Learning Simulator that provides intuitive visual insights into neural networks and deep learning concepts.

## 🎯 Features

- **Interactive Network Builder**: Design custom neural networks by adding/removing layers and neurons
- **Real-time Visualization**: See your neural network architecture with D3.js-powered graphics
- **Live Training**: Watch weights update and data flow through the network during training
- **Pre-built Datasets**: Train on classic problems like XOR, circles, spirals, and regression tasks
- **Educational Content**: Learn about forward propagation, backpropagation, activation functions, and more

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

4. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **React** with TypeScript for the UI
- **TensorFlow.js** for neural network computations
- **D3.js** for network visualization
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Zustand** for state management
- **Framer Motion** for animations

## 📚 How to Use

### Network Builder
1. Navigate to the "Builder" tab
2. Add or remove layers using the interface
3. Adjust neurons per layer
4. Select activation functions for each layer
5. Configure optimizer and loss function

### Training
1. Switch to the "Training" tab
2. Select a dataset from the dropdown
3. Configure training parameters (epochs, batch size, learning rate)
4. Click "Start Training" and watch the network learn
5. Monitor loss and accuracy in real-time

### Visualizer
1. Go to the "Visualizer" tab
2. See the complete network architecture
3. Hover over neurons for details
4. Blue connections represent positive weights
5. Red connections represent negative weights

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

## 📄 License

This project is licensed under the MIT License.