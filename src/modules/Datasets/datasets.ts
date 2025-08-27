export interface Dataset {
  name: string;
  description: string;
  data: {
    inputs: number[][];
    outputs: number[][];
  };
  type: 'classification' | 'regression';
}

function generateXORData(samples: number = 100): { inputs: number[][], outputs: number[][] } {
  const inputs: number[][] = [];
  const outputs: number[][] = [];
  
  for (let i = 0; i < samples; i++) {
    const x = Math.random() > 0.5 ? 1 : 0;
    const y = Math.random() > 0.5 ? 1 : 0;
    const xor = x ^ y;
    
    inputs.push([x + (Math.random() - 0.5) * 0.1, y + (Math.random() - 0.5) * 0.1]);
    outputs.push([xor]);
  }
  
  return { inputs, outputs };
}

function generateCirclesData(samples: number = 200): { inputs: number[][], outputs: number[][] } {
  const inputs: number[][] = [];
  const outputs: number[][] = [];
  
  for (let i = 0; i < samples / 2; i++) {
    const r = Math.random() * 0.5;
    const theta = Math.random() * 2 * Math.PI;
    inputs.push([r * Math.cos(theta), r * Math.sin(theta)]);
    outputs.push([1]);
  }
  
  for (let i = 0; i < samples / 2; i++) {
    const r = 0.7 + Math.random() * 0.3;
    const theta = Math.random() * 2 * Math.PI;
    inputs.push([r * Math.cos(theta), r * Math.sin(theta)]);
    outputs.push([0]);
  }
  
  return { inputs, outputs };
}

function generateSpiralData(samples: number = 200): { inputs: number[][], outputs: number[][] } {
  const inputs: number[][] = [];
  const outputs: number[][] = [];
  const n = samples / 2;
  
  for (let i = 0; i < n; i++) {
    const r = i / n * 5;
    const theta = 1.75 * i / n * 2 * Math.PI;
    const x = r * Math.cos(theta) + (Math.random() - 0.5) * 0.1;
    const y = r * Math.sin(theta) + (Math.random() - 0.5) * 0.1;
    inputs.push([x, y]);
    outputs.push([0]);
  }
  
  for (let i = 0; i < n; i++) {
    const r = i / n * 5;
    const theta = 1.75 * i / n * 2 * Math.PI + Math.PI;
    const x = r * Math.cos(theta) + (Math.random() - 0.5) * 0.1;
    const y = r * Math.sin(theta) + (Math.random() - 0.5) * 0.1;
    inputs.push([x, y]);
    outputs.push([1]);
  }
  
  return { inputs, outputs };
}

function generateLinearData(samples: number = 100): { inputs: number[][], outputs: number[][] } {
  const inputs: number[][] = [];
  const outputs: number[][] = [];
  
  for (let i = 0; i < samples; i++) {
    const x = Math.random() * 10 - 5;
    const y = 2 * x + 3 + (Math.random() - 0.5) * 2;
    inputs.push([x]);
    outputs.push([y]);
  }
  
  return { inputs, outputs };
}

function generateQuadraticData(samples: number = 100): { inputs: number[][], outputs: number[][] } {
  const inputs: number[][] = [];
  const outputs: number[][] = [];
  
  for (let i = 0; i < samples; i++) {
    const x = Math.random() * 10 - 5;
    const y = 0.5 * x * x - 2 * x + 1 + (Math.random() - 0.5) * 2;
    inputs.push([x]);
    outputs.push([y]);
  }
  
  return { inputs, outputs };
}

export const datasets: Dataset[] = [
  {
    name: 'XOR Problem',
    description: 'Classic XOR logic gate - a simple non-linear classification problem',
    data: generateXORData(),
    type: 'classification'
  },
  {
    name: 'Circles',
    description: 'Two concentric circles - tests radial decision boundaries',
    data: generateCirclesData(),
    type: 'classification'
  },
  {
    name: 'Spiral',
    description: 'Two interleaved spirals - a challenging non-linear classification',
    data: generateSpiralData(),
    type: 'classification'
  },
  {
    name: 'Linear Regression',
    description: 'Simple linear relationship - y = 2x + 3',
    data: generateLinearData(),
    type: 'regression'
  },
  {
    name: 'Quadratic Regression',
    description: 'Quadratic relationship - y = 0.5x² - 2x + 1',
    data: generateQuadraticData(),
    type: 'regression'
  }
];

export function normalizeData(data: number[][]): { normalized: number[][], min: number[], max: number[] } {
  const numFeatures = data[0].length;
  const min = new Array(numFeatures).fill(Infinity);
  const max = new Array(numFeatures).fill(-Infinity);
  
  data.forEach(sample => {
    sample.forEach((value, i) => {
      if (value < min[i]) min[i] = value;
      if (value > max[i]) max[i] = value;
    });
  });
  
  const normalized = data.map(sample =>
    sample.map((value, i) => {
      const range = max[i] - min[i];
      return range === 0 ? 0 : (value - min[i]) / range;
    })
  );
  
  return { normalized, min, max };
}