import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface ActivationFunction {
  name: string;
  formula: string;
  description: string;
  function: (x: number) => number;
  derivative: (x: number) => number;
  color: string;
  range: { min: number; max: number };
}

const activationFunctions: ActivationFunction[] = [
  {
    name: 'ReLU',
    formula: 'f(x) = max(0, x)',
    description: 'Most popular activation. Simple and effective. Helps with vanishing gradient problem.',
    function: (x: number) => Math.max(0, x),
    derivative: (x: number) => x > 0 ? 1 : 0,
    color: '#3B82F6',
    range: { min: -2, max: 2 },
  },
  {
    name: 'Sigmoid',
    formula: 'f(x) = 1 / (1 + e^(-x))',
    description: 'Outputs between 0 and 1. Good for binary classification output layers.',
    function: (x: number) => 1 / (1 + Math.exp(-x)),
    derivative: (x: number) => {
      const sig = 1 / (1 + Math.exp(-x));
      return sig * (1 - sig);
    },
    color: '#10B981',
    range: { min: -6, max: 6 },
  },
  {
    name: 'Tanh',
    formula: 'f(x) = (e^x - e^(-x)) / (e^x + e^(-x))',
    description: 'Outputs between -1 and 1. Zero-centered, which helps with optimization.',
    function: (x: number) => Math.tanh(x),
    derivative: (x: number) => 1 - Math.tanh(x) ** 2,
    color: '#8B5CF6',
    range: { min: -4, max: 4 },
  },
  {
    name: 'Leaky ReLU',
    formula: 'f(x) = x if x > 0, else 0.01x',
    description: 'Variation of ReLU that allows small negative values. Prevents dead neurons.',
    function: (x: number) => x > 0 ? x : 0.01 * x,
    derivative: (x: number) => x > 0 ? 1 : 0.01,
    color: '#F59E0B',
    range: { min: -2, max: 2 },
  },
  {
    name: 'Linear',
    formula: 'f(x) = x',
    description: 'No activation. Used in output layer for regression tasks.',
    function: (x: number) => x,
    derivative: (x: number) => 1,
    color: '#EF4444',
    range: { min: -2, max: 2 },
  },
  {
    name: 'Softplus',
    formula: 'f(x) = ln(1 + e^x)',
    description: 'Smooth approximation of ReLU. Always positive with smooth gradient.',
    function: (x: number) => Math.log(1 + Math.exp(x)),
    derivative: (x: number) => 1 / (1 + Math.exp(-x)),
    color: '#EC4899',
    range: { min: -4, max: 4 },
  },
];

export const ActivationVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedFunction, setSelectedFunction] = useState<ActivationFunction>(activationFunctions[0]);
  const [showDerivative, setShowDerivative] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [compareFunctions, setCompareFunctions] = useState<string[]>([activationFunctions[0].name]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.selectAll('*').remove();

    const functionsToPlot = compareMode 
      ? activationFunctions.filter(f => compareFunctions.includes(f.name))
      : [selectedFunction];

    // Find the appropriate range for all functions
    const xMin = Math.min(...functionsToPlot.map(f => f.range.min));
    const xMax = Math.max(...functionsToPlot.map(f => f.range.max));

    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([-2, 2])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add grid
    const xGrid = d3.axisBottom(xScale)
      .tickSize(innerHeight)
      .tickFormat(() => '');

    const yGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(xGrid);

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(yGrid);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('fill', '#374151')
      .style('text-anchor', 'middle')
      .text('Input (x)');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -innerHeight / 2)
      .attr('fill', '#374151')
      .style('text-anchor', 'middle')
      .text('Output f(x)');

    // Add zero lines
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#9CA3AF')
      .attr('stroke-width', 1);

    g.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#9CA3AF')
      .attr('stroke-width', 1);

    // Plot functions
    functionsToPlot.forEach((func) => {
      const data = d3.range(xMin, xMax, 0.01).map(x => ({
        x,
        y: func.function(x),
        dy: func.derivative(x),
      }));

      // Main function line
      const line = d3.line<{ x: number; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', func.color)
        .attr('stroke-width', compareMode ? 2 : 3)
        .attr('d', line)
        .attr('opacity', compareMode ? 0.8 : 1);

      // Derivative line (if enabled)
      if (showDerivative && !compareMode) {
        const derivativeLine = d3.line<{ x: number; dy: number }>()
          .x(d => xScale(d.x))
          .y(d => yScale(d.dy))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', func.color)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.6)
          .attr('d', derivativeLine);
      }

      // Add function label in compare mode
      if (compareMode) {
        const lastPoint = data[data.length - 1];
        g.append('text')
          .attr('x', xScale(lastPoint.x) - 5)
          .attr('y', yScale(lastPoint.y))
          .attr('fill', func.color)
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(func.name);
      }
    });

    // Interactive point
    if (!compareMode) {
      const outputValue = selectedFunction.function(inputValue);
      const derivativeValue = selectedFunction.derivative(inputValue);

      // Vertical line at input
      g.append('line')
        .attr('x1', xScale(inputValue))
        .attr('x2', xScale(inputValue))
        .attr('y1', yScale(0))
        .attr('y2', yScale(outputValue))
        .attr('stroke', selectedFunction.color)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.5);

      // Point on function
      g.append('circle')
        .attr('cx', xScale(inputValue))
        .attr('cy', yScale(outputValue))
        .attr('r', 6)
        .attr('fill', selectedFunction.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // Point on derivative (if shown)
      if (showDerivative) {
        g.append('circle')
          .attr('cx', xScale(inputValue))
          .attr('cy', yScale(derivativeValue))
          .attr('r', 5)
          .attr('fill', selectedFunction.color)
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('opacity', 0.7);
      }

      // Value labels
      g.append('text')
        .attr('x', xScale(inputValue) + 10)
        .attr('y', yScale(outputValue) - 10)
        .attr('fill', selectedFunction.color)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`f(${inputValue.toFixed(2)}) = ${outputValue.toFixed(3)}`);

      if (showDerivative) {
        g.append('text')
          .attr('x', xScale(inputValue) + 10)
          .attr('y', yScale(derivativeValue) - 10)
          .attr('fill', selectedFunction.color)
          .attr('font-size', '11px')
          .attr('opacity', 0.7)
          .text(`f'(${inputValue.toFixed(2)}) = ${derivativeValue.toFixed(3)}`);
      }
    }

  }, [selectedFunction, showDerivative, inputValue, compareMode, compareFunctions]);

  const toggleCompareFunction = (name: string) => {
    if (compareFunctions.includes(name)) {
      setCompareFunctions(compareFunctions.filter(f => f !== name));
    } else {
      setCompareFunctions([...compareFunctions, name]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Activation Functions Visualizer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization */}
        <div>
          <svg ref={svgRef} className="w-full h-auto" />
          
          {!compareMode && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Value: {inputValue.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={selectedFunction.range.min}
                  max={selectedFunction.range.max}
                  step="0.1"
                  value={inputValue}
                  onChange={(e) => setInputValue(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showDerivative}
                    onChange={(e) => setShowDerivative(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show Derivative</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Controls and Information */}
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCompareMode(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !compareMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setCompareMode(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                compareMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Compare
            </button>
          </div>

          {/* Function Selection */}
          {!compareMode ? (
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Function</h3>
              <div className="space-y-2">
                {activationFunctions.map((func) => (
                  <motion.div
                    key={func.name}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedFunction(func)}
                    className={`p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                      selectedFunction.name === func.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold" style={{ color: func.color }}>
                        {func.name}
                      </span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {func.formula}
                      </code>
                    </div>
                    <p className="text-xs text-gray-600">{func.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Functions to Compare</h3>
              <div className="space-y-2">
                {activationFunctions.map((func) => (
                  <label
                    key={func.name}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={compareFunctions.includes(func.name)}
                      onChange={() => toggleCompareFunction(func.name)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-medium" style={{ color: func.color }}>
                        {func.name}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">{func.formula}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Legend for derivative */}
          {showDerivative && !compareMode && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-blue-500 mr-2"></div>
                  <span>Function f(x)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-blue-500 mr-2 border-dashed border-b-2 border-blue-500"></div>
                  <span>Derivative f'(x)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};