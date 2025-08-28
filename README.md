# 🧠 Deep Learning Simulator

A comprehensive, interactive educational platform for learning deep learning concepts through hands-on experimentation, real-time visualization, and guided tutorials. Build, train, and understand neural networks directly in your browser!

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/Prawal-Sharma/DeepLearningSim)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)](https://reactjs.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22.0-ff6f00.svg)](https://www.tensorflow.org/js)

## 🎯 Overview

The Deep Learning Simulator is an educational tool designed to make deep learning accessible and understandable for learners at all levels. Through interactive visualizations and hands-on experimentation, users can:

- Build neural networks with an intuitive visual interface
- Watch training happen in real-time with animated visualizations
- Understand complex concepts through interactive tutorials and explanations
- Experiment with different architectures, datasets, and hyperparameters
- Learn by doing with immediate visual feedback

## ✨ Key Features

### 🏗️ Neural Network Builder
- **Visual Architecture Design**: Drag-and-drop interface for building networks
- **Advanced Layer Types**: 
  - Dense (Fully Connected) layers
  - Convolutional layers (Conv2D)
  - Pooling layers (MaxPooling2D)
  - Dropout for regularization
  - Batch Normalization
  - Flatten layers for CNN-to-Dense transitions
- **Flexible Configuration**: Customize neurons, activation functions, optimizers, and loss functions
- **Network Presets**: Quick-start templates for common architectures (XOR, Classifier, Deep Network, Linear Regression)

### 📊 Advanced Training Capabilities
- **Real-time Visualization**: Watch weights update and gradients flow during training
- **Interactive Controls**:
  - Pause/Resume training at any point
  - Variable speed control (0.5x to 5x)
  - Keyboard shortcuts for quick control
- **Live Metrics**: Real-time loss and accuracy charts
- **Decision Boundaries**: Visualize how your model classifies data in 2D space

### 🗂️ Dataset Management
- **Pre-built Datasets**: XOR, Circles, Spirals, Linear, Quadratic patterns
- **Custom Data Creation**:
  - Upload CSV files
  - Draw datasets interactively with mouse
  - Generate synthetic patterns (spirals, clusters, moons)
- **Data Preprocessing**:
  - Normalization and standardization
  - Train/test splitting
  - Data augmentation with noise
  - Feature shuffling

### 💾 Model Management
- **Save & Load Models**: Persist trained models in browser storage
- **Export Capabilities**:
  - JSON format for portability
  - TensorFlow.js format for production use
- **Model Comparison**: Compare up to 3 models side-by-side
- **Version History**: Track model performance over time

### 🔧 Hyperparameter Optimization
- **Grid Search**: Exhaustive search through parameter combinations
- **Random Search**: Efficient exploration of hyperparameter space
- **Sensitivity Analysis**: Visualize impact of each parameter
- **Auto-Tuning**: Intelligent preset combinations for quick optimization
- **Visual Results**: Interactive charts showing optimization progress

### 🎓 Educational Components
- **Interactive Tutorials**:
  - "Build Your First Neural Network"
  - "Understanding Backpropagation"
  - "Mastering Activation Functions"
- **Concept Cards**: In-depth explanations of:
  - Neurons and Weights
  - Forward/Backward Propagation
  - Gradient Descent
  - Overfitting/Underfitting
  - Optimizers (Adam, SGD, RMSprop)
  - Loss Functions
  - Regularization Techniques
- **Activation Function Visualizer**:
  - Interactive graphs for 6+ activation functions
  - Compare mode for side-by-side analysis
  - Derivative visualization
  - Real-time value calculations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Quick Installation

```bash
# Clone the repository
git clone https://github.com/Prawal-Sharma/DeepLearningSim.git
cd DeepLearningSim

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks and modern patterns |
| **TypeScript** | Type safety and better developer experience |
| **TensorFlow.js** | Neural network computations in the browser |
| **D3.js** | Advanced data visualizations and network graphs |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling framework |
| **Zustand** | Lightweight state management |
| **Framer Motion** | Smooth animations and transitions |
| **Recharts** | Beautiful charts for training metrics |

## 📖 User Guide

### 🏗️ Building Your First Network

1. **Start with the Builder Tab**
   - Click "Add Layer" to add layers to your network
   - Configure each layer:
     - **Type**: Dense, Conv2D, Dropout, etc.
     - **Neurons/Units**: Number of neurons (1-128)
     - **Activation**: ReLU, Sigmoid, Tanh, Linear, Softmax
   - Use presets for quick start (XOR, Classifier, Deep Network)

2. **Choose Your Dataset (Data Tab)**
   - Select pre-built datasets (XOR, Circles, Spirals)
   - Upload your own CSV data
   - Draw custom datasets with mouse clicks
   - Generate synthetic patterns

3. **Configure Training (Training Tab)**
   - Set hyperparameters:
     - **Epochs**: Number of training iterations (10-1000)
     - **Batch Size**: Samples per update (1-128)
     - **Learning Rate**: Step size for optimization (0.001-1.0)
   - Select optimizer (Adam, SGD, RMSprop)
   - Choose loss function (MSE, Cross-Entropy)

4. **Train and Monitor**
   - Click "Start Training" to begin
   - Watch real-time metrics and visualizations
   - Use controls:
     - **Space**: Pause/Resume
     - **Esc**: Stop training
     - **1-4**: Adjust speed

5. **Save Your Model**
   - Go to Models tab
   - Click "Save Current Model"
   - Export to JSON or TensorFlow.js format

### 🎯 Advanced Usage

#### Hyperparameter Optimization
1. Navigate to the Training tab
2. Open Hyperparameter Tuner panel
3. Choose optimization method:
   - **Grid Search**: Test all combinations systematically
   - **Random Search**: Sample random combinations
   - **Sensitivity Analysis**: Analyze parameter impact
   - **Auto-Tune**: Use intelligent presets
4. Configure parameter ranges
5. Run optimization and apply best parameters

#### Model Comparison
1. Train multiple models with different configurations
2. Save each model in the Models tab
3. Select up to 3 models to compare
4. View side-by-side performance metrics

#### Custom Dataset Creation
1. Go to Data tab
2. Select "Draw Mode"
3. Choose class (0 or 1)
4. Click on canvas to add points
5. Apply preprocessing (normalization, augmentation)
6. Split into train/test sets

## 🎓 Learning Path

### Beginner
1. Complete the Welcome Tour
2. Build a simple XOR classifier
3. Explore activation functions in Learn tab
4. Read concept cards about neurons and weights

### Intermediate
1. Try the "Understanding Backpropagation" tutorial
2. Experiment with different optimizers
3. Use hyperparameter tuning
4. Create custom datasets

### Advanced
1. Build CNN architectures with Conv2D layers
2. Implement dropout for regularization
3. Use batch normalization
4. Export models for production use

## 🔧 Configuration

### Network Architecture Limits
- **Layers**: 1-10 layers
- **Neurons per layer**: 1-128
- **Dropout rate**: 0.0-0.9
- **Conv2D filters**: 1-64
- **Kernel size**: 1-7

### Training Parameters
- **Epochs**: 10-1000
- **Batch size**: 1-128
- **Learning rate**: 0.0001-1.0
- **Training speed**: 0.5x-5x

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Training doesn't converge** | Lower learning rate, increase epochs |
| **Model overfits** | Add dropout layers, reduce network size |
| **Browser crashes** | Reduce batch size, use fewer neurons |
| **Visualizations lag** | Lower training speed, use Chrome/Firefox |
| **Can't save models** | Check browser storage permissions |

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Pause/Resume training |
| **Esc** | Stop training |
| **1** | Set speed to 0.5x |
| **2** | Set speed to 1x |
| **3** | Set speed to 2x |
| **4** | Set speed to 5x |

## 📊 Supported Datasets

### Pre-built Datasets
1. **XOR**: Classic non-linear classification problem
2. **Circles**: Concentric circles classification
3. **Spirals**: Interleaved spiral patterns
4. **Linear**: Simple linear regression
5. **Quadratic**: Polynomial regression

### Custom Datasets
- **CSV Format**: Features in columns, labels in last column
- **Supported types**: Classification and regression
- **Max size**: 10,000 samples

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

## 📈 Roadmap

### Upcoming Features
- [ ] Mobile responsive design
- [ ] Dark mode support
- [ ] Export to Python/Keras
- [ ] Collaborative learning
- [ ] Advanced optimizers (AdaGrad, Nadam)
- [ ] More activation functions
- [ ] 3D network visualization
- [ ] Real-time collaboration

## 🙏 Acknowledgments

- TensorFlow.js team for the amazing library
- React team for the powerful framework
- D3.js community for visualization tools
- All contributors and testers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Prawal-Sharma/DeepLearningSim/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Prawal-Sharma/DeepLearningSim/discussions)
- **Email**: prawal.sharma@example.com

---

Built with ❤️ for the deep learning community