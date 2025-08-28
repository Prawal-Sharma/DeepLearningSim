# 📚 Deep Learning Simulator - User Guide

Welcome to the Deep Learning Simulator! This comprehensive guide will walk you through every feature and help you master deep learning concepts through hands-on experimentation.

## Table of Contents
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [Step-by-Step Tutorials](#step-by-step-tutorials)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Getting Started

### First Time Setup

When you first open the Deep Learning Simulator, you'll be greeted with a welcome modal that provides:
- Quick tour of the interface
- Network presets for immediate experimentation
- Links to tutorials and documentation

### Understanding the Interface

The simulator is organized into 6 main tabs:

1. **Builder**: Design your neural network architecture
2. **Training**: Configure and run training sessions
3. **Visualizer**: See your network structure in real-time
4. **Learn**: Access tutorials and educational content
5. **Models**: Manage saved models
6. **Data**: Create and manage datasets

## Core Concepts

### What is a Neural Network?

A neural network is a computational model inspired by the human brain. It consists of:
- **Neurons**: Basic processing units
- **Layers**: Groups of neurons
- **Weights**: Connections between neurons
- **Activation Functions**: Non-linear transformations

### Key Terms

- **Epoch**: One complete pass through the training data
- **Batch Size**: Number of samples processed before updating weights
- **Learning Rate**: How much to adjust weights during training
- **Loss**: Measure of prediction error
- **Accuracy**: Percentage of correct predictions

## Step-by-Step Tutorials

### Tutorial 1: Your First Neural Network

**Goal**: Build a network to solve the XOR problem

1. **Navigate to Builder Tab**
   - Click "Use Preset" and select "XOR Network"
   - This creates a 2-3-1 network (2 inputs, 3 hidden neurons, 1 output)

2. **Understand the Architecture**
   - Input layer: Takes two binary values (0 or 1)
   - Hidden layer: 3 neurons with ReLU activation
   - Output layer: 1 neuron with sigmoid activation

3. **Go to Training Tab**
   - Dataset is already set to XOR
   - Default parameters:
     - Epochs: 100
     - Batch Size: 4
     - Learning Rate: 0.1

4. **Start Training**
   - Click "Start Training"
   - Watch the loss decrease
   - Observe decision boundary forming

5. **Interpret Results**
   - Loss should approach 0
   - Accuracy should reach ~100%
   - Decision boundary should separate the four XOR points correctly

### Tutorial 2: Classification with Custom Data

**Goal**: Create a custom dataset and train a classifier

1. **Navigate to Data Tab**
   - Select "Draw Mode"
   - Choose Class 0 (blue)
   - Click to add points in bottom-left area
   - Switch to Class 1 (red)
   - Click to add points in top-right area

2. **Build a Classifier Network**
   - Go to Builder tab
   - Add layers: Input → Dense(8) → Dense(4) → Dense(1)
   - Set activations: ReLU → ReLU → Sigmoid

3. **Configure Training**
   - Set epochs to 200
   - Learning rate: 0.01
   - Optimizer: Adam

4. **Train and Evaluate**
   - Start training
   - Watch decision boundary evolve
   - Aim for clear separation between classes

### Tutorial 3: Preventing Overfitting

**Goal**: Learn to use dropout and regularization

1. **Create a Complex Network**
   - Build: Input → Dense(64) → Dense(32) → Dense(16) → Dense(1)
   - Use ReLU activations

2. **Train Without Regularization**
   - Use spiral dataset
   - Train for 500 epochs
   - Note the overfitting (training accuracy > test accuracy)

3. **Add Dropout Layers**
   - Switch to Advanced Mode in Builder
   - Add Dropout(0.2) after first Dense layer
   - Add Dropout(0.3) after second Dense layer

4. **Retrain and Compare**
   - Train again with same parameters
   - Observe more stable test accuracy
   - Decision boundary should be smoother

## Advanced Features

### Hyperparameter Optimization

The Hyperparameter Tuner helps find optimal training parameters:

#### Grid Search
- Systematically tests all combinations
- Best for small parameter spaces
- Example ranges:
  - Learning Rate: [0.001, 0.01, 0.1]
  - Batch Size: [16, 32, 64]
  - Dropout: [0.1, 0.2, 0.3]

#### Random Search
- Randomly samples parameter combinations
- More efficient for large spaces
- Set number of trials (e.g., 20)

#### Sensitivity Analysis
- Shows impact of each parameter
- Helps identify critical parameters
- Visual heatmap representation

#### Auto-Tune
- Uses proven parameter combinations
- Quick optimization for common problems
- One-click application

### Building CNNs (Convolutional Neural Networks)

For image-like data, use convolutional layers:

1. **Architecture Pattern**:
   ```
   Input → Conv2D(32) → MaxPooling2D → Conv2D(64) → MaxPooling2D → Flatten → Dense(128) → Dense(10)
   ```

2. **Key Parameters**:
   - Filters: Number of feature detectors (8-64)
   - Kernel Size: Size of filter (3x3 or 5x5)
   - Stride: Step size for sliding window
   - Padding: 'same' or 'valid'

### Model Management

#### Saving Models
1. Train your model
2. Go to Models tab
3. Click "Save Current Model"
4. Enter descriptive name
5. Model saved to browser storage

#### Exporting Models
- **JSON Format**: Human-readable, good for analysis
- **TensorFlow.js Format**: Ready for production deployment

#### Model Comparison
1. Select up to 3 saved models
2. Click "Compare"
3. View side-by-side metrics:
   - Architecture differences
   - Training performance
   - Final accuracy/loss

### Custom Dataset Upload

#### CSV Format Requirements
```csv
feature1,feature2,label
0.5,1.2,0
0.7,0.8,1
...
```

#### Preprocessing Options
- **Normalization**: Scale features to [0,1]
- **Standardization**: Zero mean, unit variance
- **Augmentation**: Add noise for robustness
- **Shuffle**: Randomize sample order

## Best Practices

### Network Design

1. **Start Simple**
   - Begin with 2-3 layers
   - Add complexity gradually
   - Monitor for overfitting

2. **Layer Sizing**
   - Funnel architecture: Decreasing neurons
   - Example: 64 → 32 → 16 → 8

3. **Activation Functions**
   - Hidden layers: ReLU (most common)
   - Output layer:
     - Binary classification: Sigmoid
     - Multi-class: Softmax
     - Regression: Linear

### Training Configuration

1. **Learning Rate**
   - Start with 0.01
   - Decrease if loss oscillates
   - Increase if learning is too slow

2. **Batch Size**
   - Smaller (8-32): More updates, noisier
   - Larger (64-128): Smoother, faster per epoch
   - Memory constraints apply

3. **Epochs**
   - Monitor validation loss
   - Stop when validation loss increases (overfitting)
   - Use early stopping mentally

### Debugging Training Issues

| Problem | Symptoms | Solutions |
|---------|----------|-----------|
| **Not Learning** | Loss stays constant | Increase learning rate, check data |
| **Oscillating Loss** | Loss jumps around | Decrease learning rate |
| **Overfitting** | Train acc >> Test acc | Add dropout, reduce network size |
| **Underfitting** | Both accuracies low | Increase network size, train longer |
| **Exploding Gradients** | Loss becomes NaN | Lower learning rate, add batch norm |

## Common Patterns

### Binary Classification
```
Architecture: Input → Dense(16) → Dense(8) → Dense(1, sigmoid)
Loss: Binary Crossentropy
Optimizer: Adam
Learning Rate: 0.01
```

### Multi-class Classification
```
Architecture: Input → Dense(32) → Dense(16) → Dense(num_classes, softmax)
Loss: Categorical Crossentropy
Optimizer: Adam
Learning Rate: 0.001
```

### Regression
```
Architecture: Input → Dense(32) → Dense(16) → Dense(1, linear)
Loss: Mean Squared Error
Optimizer: RMSprop
Learning Rate: 0.001
```

### Deep Network with Regularization
```
Architecture: 
  Input → 
  Dense(128, relu) → Dropout(0.3) → 
  Dense(64, relu) → Dropout(0.2) → 
  Dense(32, relu) → 
  Dense(output)
```

## Troubleshooting

### Common Issues and Solutions

#### "Training is too slow"
- Increase learning rate slightly
- Reduce network size
- Use smaller batch size
- Increase training speed (2x or 5x)

#### "Loss is NaN or Infinity"
- Learning rate too high
- Numerical instability
- Try normalizing input data
- Add batch normalization

#### "Can't achieve good accuracy"
- Network too simple for problem
- Need more training data
- Try different architecture
- Use hyperparameter tuning

#### "Browser becomes unresponsive"
- Reduce batch size
- Use fewer neurons
- Lower training speed
- Close other tabs

#### "Models won't save"
- Check browser storage quota
- Clear old models
- Try different browser
- Enable cookies/storage

### Performance Tips

1. **Use Chrome or Firefox** for best performance
2. **Close unnecessary tabs** to free memory
3. **Start with small networks** and scale up
4. **Use batch sizes of 32 or 64** for efficiency
5. **Monitor memory usage** in browser dev tools

## Keyboard Shortcuts Reference

| Shortcut | Action | Context |
|----------|--------|---------|
| **Space** | Pause/Resume | During training |
| **Esc** | Stop training | During training |
| **1** | Speed 0.5x | During training |
| **2** | Speed 1x | During training |
| **3** | Speed 2x | During training |
| **4** | Speed 5x | During training |

## Learning Resources

### Recommended Learning Path

1. **Week 1**: Master basics
   - Complete all tutorials
   - Experiment with presets
   - Read concept cards

2. **Week 2**: Explore architectures
   - Try different layer combinations
   - Compare activation functions
   - Understand overfitting

3. **Week 3**: Advanced techniques
   - Use hyperparameter tuning
   - Build CNNs
   - Create custom datasets

4. **Week 4**: Real applications
   - Upload real data
   - Export trained models
   - Optimize performance

### External Resources

- **Courses**:
  - Fast.ai Practical Deep Learning
  - Andrew Ng's Deep Learning Specialization
  - MIT 6.034 Artificial Intelligence

- **Books**:
  - "Deep Learning" by Goodfellow, Bengio, Courville
  - "Neural Networks and Deep Learning" by Michael Nielsen
  - "Hands-On Machine Learning" by Aurélien Géron

- **Papers**:
  - "ImageNet Classification with Deep CNNs" (AlexNet)
  - "Dropout: A Simple Way to Prevent Overfitting"
  - "Adam: A Method for Stochastic Optimization"

## Tips for Educators

### Classroom Usage

1. **Demonstration Mode**
   - Use projector/screen share
   - Slow down training speed
   - Pause to explain concepts

2. **Student Exercises**
   - Provide specific architectures to build
   - Set accuracy targets
   - Compare student solutions

3. **Assessment Ideas**
   - Design network for given problem
   - Explain why certain choices work
   - Debug failing networks

### Lesson Plans

#### Lesson 1: Introduction to Neural Networks (45 min)
- Welcome tour (5 min)
- Neuron concept explanation (10 min)
- Build first network together (15 min)
- Students experiment with XOR (15 min)

#### Lesson 2: Training and Optimization (45 min)
- Loss functions explained (10 min)
- Gradient descent visualization (10 min)
- Hyperparameter effects demo (10 min)
- Student optimization challenge (15 min)

#### Lesson 3: Overfitting and Regularization (45 min)
- Overfitting demonstration (10 min)
- Dropout explanation (10 min)
- Comparison with/without regularization (10 min)
- Students apply to spiral dataset (15 min)

## FAQ

**Q: How do I know if my model is good?**
A: Look for high accuracy (>90% for simple problems), low loss (<0.1), and similar train/test performance.

**Q: Why does my loss increase sometimes?**
A: This can happen due to high learning rate, bad initialization, or mini-batch variance. It's normal for small fluctuations.

**Q: Can I use this for real projects?**
A: Yes! Export your trained models in TensorFlow.js format for web deployment or JSON for analysis.

**Q: What's the maximum network size?**
A: Practical limits are ~10 layers and ~128 neurons per layer due to browser memory constraints.

**Q: How do I cite this tool?**
A: Use: "Deep Learning Simulator (2024). Interactive Educational Platform. https://github.com/Prawal-Sharma/DeepLearningSim"

---

Happy Learning! 🚀