import { create } from 'zustand';
import { NeuralNetwork, NetworkConfig, LayerConfig } from '../modules/NeuralNetwork/NeuralNetwork';

interface NetworkState {
  network: NeuralNetwork | null;
  networkConfig: NetworkConfig;
  isTraining: boolean;
  trainingHistory: any[];
  currentEpoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  
  setNetwork: (config: NetworkConfig) => void;
  updateLayer: (index: number, layer: LayerConfig) => void;
  addLayer: (layer: LayerConfig) => void;
  removeLayer: (index: number) => void;
  startTraining: () => void;
  stopTraining: () => void;
  updateTrainingMetrics: (metrics: { epoch?: number; loss?: number; accuracy?: number }) => void;
  resetNetwork: () => void;
}

const defaultNetworkConfig: NetworkConfig = {
  layers: [
    { units: 2, activation: 'relu', inputShape: [2] },
    { units: 4, activation: 'relu' },
    { units: 1, activation: 'sigmoid' }
  ],
  optimizer: 'adam',
  loss: 'binaryCrossentropy',
  learningRate: 0.01
};

export const useStore = create<NetworkState>((set, get) => ({
  network: null,
  networkConfig: defaultNetworkConfig,
  isTraining: false,
  trainingHistory: [],
  currentEpoch: 0,
  totalEpochs: 0,
  loss: 0,
  accuracy: 0,

  setNetwork: (config) => {
    const network = new NeuralNetwork(config);
    set({ network, networkConfig: config });
  },

  updateLayer: (index, layer) => {
    const { networkConfig } = get();
    const newLayers = [...networkConfig.layers];
    newLayers[index] = layer;
    const newConfig = { ...networkConfig, layers: newLayers };
    const network = new NeuralNetwork(newConfig);
    set({ network, networkConfig: newConfig });
  },

  addLayer: (layer) => {
    const { networkConfig } = get();
    const newLayers = [...networkConfig.layers, layer];
    const newConfig = { ...networkConfig, layers: newLayers };
    const network = new NeuralNetwork(newConfig);
    set({ network, networkConfig: newConfig });
  },

  removeLayer: (index) => {
    const { networkConfig } = get();
    const newLayers = networkConfig.layers.filter((_, i) => i !== index);
    const newConfig = { ...networkConfig, layers: newLayers };
    const network = new NeuralNetwork(newConfig);
    set({ network, networkConfig: newConfig });
  },

  startTraining: () => {
    set({ isTraining: true, currentEpoch: 0 });
  },

  stopTraining: () => {
    const { network } = get();
    if (network) {
      network.stopTraining();
    }
    set({ isTraining: false });
  },

  updateTrainingMetrics: (metrics) => {
    set((state) => ({
      ...state,
      currentEpoch: metrics.epoch ?? state.currentEpoch,
      loss: metrics.loss ?? state.loss,
      accuracy: metrics.accuracy ?? state.accuracy,
    }));
  },

  resetNetwork: () => {
    const { network } = get();
    if (network) {
      network.dispose();
    }
    set({
      network: null,
      networkConfig: defaultNetworkConfig,
      isTraining: false,
      trainingHistory: [],
      currentEpoch: 0,
      totalEpochs: 0,
      loss: 0,
      accuracy: 0,
    });
  },
}));