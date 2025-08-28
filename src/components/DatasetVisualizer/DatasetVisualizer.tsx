import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { datasets } from '../../modules/Datasets/datasets';
import { useStore } from '../../store/useStore';
import * as tf from '@tensorflow/tfjs';

interface DatasetVisualizerProps {
  datasetIndex: number;
  showDecisionBoundary?: boolean;
  interactive?: boolean;
}

const DatasetVisualizerComponent: React.FC<DatasetVisualizerProps> = ({
  datasetIndex,
  showDecisionBoundary = false,
  interactive = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { network, isTraining } = useStore();
  const [customData, setCustomData] = useState<{ inputs: number[][], outputs: number[][] }>({ 
    inputs: [], 
    outputs: [] 
  });
  const [selectedClass, setSelectedClass] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, class: number } | null>(null);

  const dataset = datasetIndex === -1 && customData.inputs.length > 0 
    ? { data: customData, type: 'classification' as const }
    : datasets[datasetIndex];

  useEffect(() => {
    if (!svgRef.current || !dataset) return;

    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.selectAll('*').remove();

    // Find data bounds
    const allX = dataset.data.inputs.map(d => d[0]);
    const allY = dataset.data.inputs.map(d => d[1] || 0);
    const xExtent = d3.extent(allX) as [number, number];
    const yExtent = d3.extent(allY) as [number, number];

    // Add padding to extents
    const xPadding = (xExtent[1] - xExtent[0]) * 0.1;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add decision boundary if network is trained
    if (showDecisionBoundary && network && !isTraining) {
      const resolution = 50;
      const xStep = innerWidth / resolution;
      const yStep = innerHeight / resolution;

      const predictions: number[][] = [];
      const points: [number, number][] = [];

      for (let i = 0; i <= resolution; i++) {
        predictions[i] = [];
        for (let j = 0; j <= resolution; j++) {
          const x = xScale.invert(i * xStep);
          const y = yScale.invert(j * yStep);
          points.push([x, y]);
        }
      }

      // Get predictions for all points
      tf.tidy(() => {
        const input = tf.tensor2d(points);
        const output = network.predict(input);
        const values = output.arraySync() as number[][];
        
        let idx = 0;
        for (let i = 0; i <= resolution; i++) {
          for (let j = 0; j <= resolution; j++) {
            predictions[i][j] = values[idx][0];
            idx++;
          }
        }
      });

      // Create contour plot for decision boundary
      const contourData = d3.contours()
        .size([resolution + 1, resolution + 1])
        .thresholds([0.5])
        (predictions.flat());

      g.append('g')
        .attr('class', 'decision-boundary')
        .selectAll('path')
        .data(contourData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath(d3.geoIdentity().scale(xStep)))
        .attr('fill', 'none')
        .attr('stroke', '#8B5CF6')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.6);

      // Add gradient background for probability
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'probability-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#EF4444')
        .attr('stop-opacity', 0.1);

      gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', '#FFFFFF')
        .attr('stop-opacity', 0.1);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#3B82F6')
        .attr('stop-opacity', 0.1);
    }

    // Add axes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('fill', '#374151')
      .style('text-anchor', 'middle')
      .text('X');

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -innerHeight / 2)
      .attr('fill', '#374151')
      .style('text-anchor', 'middle')
      .text('Y');

    // Add grid
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisBottom(xScale)
        .tickSize(innerHeight)
        .tickFormat(() => '')
      );

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      );

    // Plot data points
    const pointsGroup = g.append('g').attr('class', 'data-points');

    const points = pointsGroup.selectAll('circle')
      .data(dataset.data.inputs.map((input, i) => ({
        x: input[0],
        y: input[1] || 0,
        class: dataset.data.outputs[i][0]
      })))
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', d => d.class > 0.5 ? '#3B82F6' : '#EF4444')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1)
      .attr('opacity', 0.8)
      .on('mouseenter', (event, d) => {
        setHoveredPoint(d);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('opacity', 1);
      })
      .on('mouseleave', (event) => {
        setHoveredPoint(null);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 5)
          .attr('opacity', 0.8);
      });

    // Add click handler for interactive mode
    if (interactive) {
      svg.on('click', (event) => {
        const [mouseX, mouseY] = d3.pointer(event, g.node());
        const x = xScale.invert(mouseX);
        const y = yScale.invert(mouseY);

        setCustomData(prev => ({
          inputs: [...prev.inputs, [x, y]],
          outputs: [...prev.outputs, [selectedClass]]
        }));
      });
    }

    // Animate points on mount
    points
      .attr('r', 0)
      .transition()
      .duration(500)
      .delay((_, i) => i * 5)
      .attr('r', 5);

  }, [dataset, showDecisionBoundary, network, isTraining, customData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Dataset Visualization
        </h3>
        {interactive && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Click to add points:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedClass(0)}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center space-x-1 ${
                  selectedClass === 0
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Class 0</span>
              </button>
              <button
                onClick={() => setSelectedClass(1)}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center space-x-1 ${
                  selectedClass === 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Class 1</span>
              </button>
              {customData.inputs.length > 0 && (
                <button
                  onClick={() => setCustomData({ inputs: [], outputs: [] })}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          className="w-full h-auto cursor-crosshair"
          style={{ maxHeight: '400px' }}
        />
        
        {hoveredPoint && (
          <div
            className="absolute bg-gray-900 text-white p-2 rounded-lg text-xs pointer-events-none"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            <div>X: {hoveredPoint.x.toFixed(3)}</div>
            <div>Y: {hoveredPoint.y.toFixed(3)}</div>
            <div>Class: {hoveredPoint.class > 0.5 ? 1 : 0}</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Class 1</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Class 0</span>
        </div>
        {showDecisionBoundary && (
          <div className="flex items-center">
            <div className="w-4 h-1 bg-purple-500 mr-2" style={{ borderTop: '2px dashed' }}></div>
            <span className="text-sm text-gray-600">Decision Boundary</span>
          </div>
        )}
      </div>

      {interactive && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Interactive Mode:</strong> Click on the plot to add new data points. 
            Train your network to see how it learns to classify your custom dataset!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export const DatasetVisualizer = React.memo(DatasetVisualizerComponent);