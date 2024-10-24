import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey } from 'd3-sankey';
import { getData } from "./data";

type SankeyNetworkTokenProps = {
  url: string;
};

export default function SankeyNetworkToken({ url }: SankeyNetworkTokenProps) {
  const svgRef = useRef();

  useEffect(() => {
    getData(url).then((({ data, leftNodes: ln, rightNodes: rn, leftNodesLength, rightNodesLength }) => {
      const svgWidth = 350;
      const svgHeight = Math.max(leftNodesLength, rightNodesLength) * 100 + 50;

      const svg = d3.select(svgRef.current)
          .attr('width', svgWidth)
          .attr('height', svgHeight);

      // guideline in the middle
      svg.append('line')
          .attr('x1', svgWidth / 2)
          .attr('y1', 25)
          .attr('x2', svgWidth / 2)
          .attr('y2', svgHeight)
          .attr('stroke', 'rgba(0,0,0,0.72)')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '5,5')
          .style('opacity', 0.33);  // Adjusted to 0.33 opacity

      const sankey = d3Sankey()
          .nodeWidth(50)  // Increased node width to 50 units
          .nodePadding(15)  // Maintain padding between nodes
          .extent([[50, 50], [300, svgHeight - 50]]);  // Adjusted extent to bring nodes closer to the center

      let { nodes, links } = sankey({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d)),
      });

      // Adjust the x-positions of nodes to ensure left nodes are on the left and right nodes on the right
      nodes.forEach(node => {
        if (ln.some(leftNode => leftNode.id === node.id)) {
          // This is a left node, set x-position to be on the left side
          node.x0 = 50; // Fixed x-position for left nodes
          node.x1 = node.x0 + 50;
        } else if (rn.some(rightNode => rightNode.id === node.id)) {
          // This is a right node, set x-position to be on the right side
          node.x0 = svgWidth - 100; // Fixed x-position for right nodes
          node.x1 = node.x0 + 50;
        }
      });

      // Calculate positions for the labels based on node positions
      const networkLabelX = nodes.find(d => d.id === ln[0].id).x0 + 25;  // Find the x-position of the first network node and center the label
      const tokensLabelX = nodes.find(d => d.id === rn[0].id).x0 + 25;   // Find the x-position of the first token node and center the label

      // Add labels "Network" and "Tokens" above the chart as column labels
      svg.append('text')
          .attr('x', networkLabelX)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .text('Network');

      svg.append('text')
          .attr('x', tokensLabelX)
          .attr('y', 30)
          .attr('text-anchor', 'middle')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .text('Tokens');

      // Adjust the y positions of left-side nodes (AA, BB, CC)
      const leftNodes = nodes.filter(d => ln.map(({ id }) => id).includes(d.id));
      leftNodes.forEach((node, index) => {
        node.y0 = 60 + index * 100;  // Adjust y0 to stack the nodes properly
        node.y1 = node.y0 + 90;  // Node height remains the same
      });

      // Adjust the y positions of right-side nodes (NA, NB, NC, ND)
      const rightNodes = nodes.filter(d => rn.map(({ id }) => id).includes(d.id));
      rightNodes.forEach((node, index) => {
        node.y0 = 60 + index * 100;  // Adjust y0 to align with the left-side nodes
        node.y1 = node.y0 + 90;  // Node height remains the same
      });

      // Group nodes and labels together
      const nodeGroup = svg.append('g')
          .selectAll('g')
          .data(nodes)
          .enter().append('g')
          .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
          .on('mouseover', handleMouseOver)
          .on('mouseout', handleMouseOut);

      // Draw the nodes
      nodeGroup.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('height', 90)  // Node height remains the same
          .attr('width', 50)  // Node width set to 50 units
          .attr('fill', d => d.color = "rgba(124,240,10,0)")

      // Add labels (image + text) directly on top of the nodes
      nodeGroup.each(function (d) {
        const g = d3.select(this);

        // Add image centered horizontally within the node
        g.append('image')
            .attr('xlink:href', d.img)
            .attr('width', 45)  // Image size
            .attr('height', 45)
            .attr('x', 2.5)  // Center the image horizontally within the node
            .attr('y', 5);  // Position image near the top of the node

        // Add text below the image, also centered
        g.append('text')
            .attr('x', 25)  // Center the text horizontally within the node
            .attr('y', 75)  // Position text near the bottom of the node
            .attr('text-anchor', 'middle')
            .attr('fill', '#000')
            .attr('font-size', '15px')  // Font size
            .text(d.id);
      });

      // Custom link generator to converge all links at a single point vertically aligned with target node
      const linkPath = d3.linkHorizontal()
          .source(d => [d.source.x1, ((d.source.y1 + d.source.y0) / 2) - 15])
          .target(d => [d.target.x0, ((d.target.y1 + d.target.y0) / 2) - 15])  // Converge to the center of the target node
          .x(d => d[0])
          .y(d => d[1]);

      // Draw the links with uniform height
      const linkGroup = svg.append('g')
          .attr('fill', 'none')
          .selectAll('path')
          .data(links)
          .enter().append('path')
          .attr('d', linkPath)
          .attr('stroke', d => "rgba(0,0,0,0.87)")
          .attr('stroke-width', 5)  // Link width remains the same
          .attr('class', 'link')
          .style('stroke-opacity', 0);  // Initially visible for clarity

      function handleMouseOver(event, node) {
        linkGroup
            .filter(l => l.source === node || l.target === node)
            .style('stroke-opacity', 0.7);  // Show links on hover
      }

      function handleMouseOut(event, node) {
        linkGroup
            .style('stroke-opacity', 0);  // Hide links when not hovering
      }

    }))
  }, []);

  return <svg ref={svgRef}></svg>;
}
