/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { severityColor } from '../../../helpers/envData';

const RiskWeightageChart = React.memo((props) => {
  const { data, severityStatus, riskWeightageTotal } = props;
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 110;
    const height = 88;
    svg.attr('width', width).attr('height', height);

    // Compute the total value
    const total = data.reduce((acc, d) => acc + d.value, 0);
    const remainingPercentage = 100 - total;

    // Adjust data to include remaining percentage
    const adjustedData = [
      ...data,
      { value: remainingPercentage, key: 'Remaining' },
    ];

    // const color = ['#cd9a46', '#52c0bf', '#99bd45', '#0990bf', '#f16075'];
    // const colors = d3.scaleOrdinal().range(color);
    const colors = {
      Reputation: '#cd9a46',
      'User Criticality': '#0990bf',
      'Alert Criticality': '#52c0bf',
      'Asset Vulnerability': '#99bd45',
      'Asset Criticality': '#f16075',
    };

    const pie = d3.pie().value((d) => d.value);
    const dataReady = pie(adjustedData);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Background arc for 100% ring
    // inner ring
    g.append('path')
      .attr('d', d3.arc()
        .innerRadius(25)
        .outerRadius(32)
        .startAngle(0)
        .endAngle(2 * Math.PI))
      .attr('fill', '#17191b');

    // Foreground arcs for data
    g.selectAll('path.foreground')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('class', 'foreground')
      .attr('d', d3.arc()
        .innerRadius(22)
        .outerRadius(35)
        .startAngle((d) => d.startAngle + Math.PI / 0.85)
        .endAngle((d) => d.endAngle + Math.PI / 0.85))
      .attr('fill', (d) => (d.data.key === 'Remaining' ? 'transparent' : colors[d.data.key]));

    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '13px')
      .attr('fill', severityColor[severityStatus])
      .attr('font-weight', 'bold')
      .text(`${riskWeightageTotal}`);
  }, [data]);
  return <svg ref={ref} />;
});
export default RiskWeightageChart;
