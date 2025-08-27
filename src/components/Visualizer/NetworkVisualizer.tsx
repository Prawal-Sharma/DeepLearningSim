import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

interface Neuron {
  id: string;
  layer: number;
  index: number;
  x: number;
  y: number;
  value?: number;
  activation?: string;
}

interface Connection {
  source: string;
  target: string;
  weight: number;
}

export const NetworkVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { networkConfig, isTraining } = useStore();
  const [hoveredNeuron, setHoveredNeuron] = useState<Neuron | null>(null);

  useEffect(() => {
    if (!svgRef.current || !networkConfig) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    svg.attr('viewBox', `0 0 ${width} ${height}`);
    svg.selectAll('*').remove();

    const layerCount = networkConfig.layers.length;
    const layerSpacing = (width - margin.left - margin.right) / (layerCount - 1);

    const newNeurons: Neuron[] = [];
    const newConnections: Connection[] = [];

    networkConfig.layers.forEach((layer, layerIndex) => {
      const neuronCount = layer.units || 1;
      const neuronSpacing = (height - margin.top - margin.bottom) / (neuronCount + 1);

      for (let i = 0; i < neuronCount; i++) {
        const neuron: Neuron = {
          id: `layer-${layerIndex}-neuron-${i}`,
          layer: layerIndex,
          index: i,
          x: margin.left + layerIndex * layerSpacing,
          y: margin.top + (i + 1) * neuronSpacing,
          activation: layer.activation,
        };
        newNeurons.push(neuron);
      }
    });

    for (let layerIndex = 0; layerIndex < layerCount - 1; layerIndex++) {
      const currentLayer = newNeurons.filter(n => n.layer === layerIndex);
      const nextLayer = newNeurons.filter(n => n.layer === layerIndex + 1);

      currentLayer.forEach((source) => {
        nextLayer.forEach((target) => {
          newConnections.push({
            source: source.id,
            target: target.id,
            weight: Math.random() * 2 - 1,
          });
        });
      });
    }


    const g = svg.append('g');

    const connectionGroup = g.append('g').attr('class', 'connections');
    const neuronGroup = g.append('g').attr('class', 'neurons');
    const labelGroup = g.append('g').attr('class', 'labels');

    const connectionLines = connectionGroup
      .selectAll('line')
      .data(newConnections)
      .enter()
      .append('line')
      .attr('x1', d => {
        const source = newNeurons.find(n => n.id === d.source);
        return source ? source.x : 0;
      })
      .attr('y1', d => {
        const source = newNeurons.find(n => n.id === d.source);
        return source ? source.y : 0;
      })
      .attr('x2', d => {
        const target = newNeurons.find(n => n.id === d.target);
        return target ? target.x : 0;
      })
      .attr('y2', d => {
        const target = newNeurons.find(n => n.id === d.target);
        return target ? target.y : 0;
      })
      .attr('stroke', d => d.weight > 0 ? '#3B82F6' : '#EF4444')
      .attr('stroke-width', d => Math.abs(d.weight) * 2)
      .attr('stroke-opacity', 0.3);

    neuronGroup
      .selectAll('circle')
      .data(newNeurons)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 15)
      .attr('fill', '#1E40AF')
      .attr('stroke', '#1E3A8A')
      .attr('stroke-width', 2)
      .on('mouseenter', (event, d) => {
        setHoveredNeuron(d);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 20)
          .attr('fill', '#2563EB');
      })
      .on('mouseleave', (event) => {
        setHoveredNeuron(null);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 15)
          .attr('fill', '#1E40AF');
      });

    networkConfig.layers.forEach((_, layerIndex) => {
      const x = margin.left + layerIndex * layerSpacing;
      labelGroup
        .append('text')
        .attr('x', x)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#374151')
        .text(
          layerIndex === 0
            ? 'Input'
            : layerIndex === layerCount - 1
            ? 'Output'
            : `Hidden ${layerIndex}`
        );
    });

    if (isTraining) {
      const pulseAnimation = () => {
        connectionLines
          .transition()
          .duration(1000)
          .attr('stroke-opacity', 0.7)
          .transition()
          .duration(1000)
          .attr('stroke-opacity', 0.3)
          .on('end', pulseAnimation);
      };
      pulseAnimation();
    }

  }, [networkConfig, isTraining]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Network Visualization</h2>
      
      <div className="relative">
        <svg
          ref={svgRef}
          className="w-full h-auto"
          style={{ maxHeight: '500px' }}
        />
        
        {hoveredNeuron && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bg-gray-900 text-white p-2 rounded-lg text-sm pointer-events-none"
            style={{
              left: hoveredNeuron.x,
              top: hoveredNeuron.y - 40,
              transform: 'translateX(-50%)',
            }}
          >
            <div>Layer: {hoveredNeuron.layer}</div>
            <div>Neuron: {hoveredNeuron.index + 1}</div>
            <div>Activation: {hoveredNeuron.activation}</div>
          </motion.div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Positive Weight</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Negative Weight</span>
        </div>
      </div>
    </div>
  );
};