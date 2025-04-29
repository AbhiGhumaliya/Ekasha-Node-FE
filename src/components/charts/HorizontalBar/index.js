import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import '../lib/style.css';
import {
  wrap2, createGradient, makexGridline, noDataSet, toolOut, toolMove, sizeChart,
} from '../lib/utils';

let animation = false;

const HorizontalBar = React.memo((props) => {
  const { id, data, lable } = props;

  setTimeout(() => {
    animation = false;
  }, 2000);

  const chart = () => {
    const color = ['#38A6FC', '#36cbab', '#EC9CE3', '#3CF9DF', '#5380BE', '#FB6D89', '#015E7B', '#183F81', '#FC577B', '#1892F8'];
    const element = document.getElementById(id);
    setTimeout(() => {
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data && data.length > 0) {
        const dataSet = [...data];
        const size = sizeChart(id);
        if (size.h > 0 && size.w > 0) {
          const margin = {
            top: 5, right: 20, bottom: 50, left: 60,
          };
          const width = size.w - margin.right - margin.left;
          const height = size.h - margin.top - margin.bottom;

          const colors = d3.scaleOrdinal().range(color);
          let maxval = 0;
          dataSet.forEach((ele) => {
            maxval = ele.value > maxval ? ele.value : maxval;
          });
          const max = maxval + 2;

          // Add X axis
          const x = d3
            .scaleLinear()
            .range([0, width])
            .domain([0, max]);

          // Add Y axis
          const y = d3
            .scaleBand()
            .domain(data.map((d) => d.key))
            .range([height, 0])
            .padding(0.5);

          const content = d3
            .select(`#${id}`)
            .append('div')
            .attr('id', `${id}_cc`);
          const svg = content
            .append('svg')
            .on('mouseout', toolOut)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'line_Svg')
            .append('g')
            .attr(
              'transform',
              `translate(${margin.left},${margin.top})`,
            );

          svg
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .on('mousemove', (d) => {
              const rightSpace = document.body.clientWidth - d3.event.pageX;
              const PageX = d3.event.pageX + 3;
              toolMove({
                key: d.key,
                value: d.value,
                x: rightSpace < 100 ? PageX - 90 : PageX,
                y: d3.event.pageY + 10,
                tool: rightSpace < 100 ? 'right' : 'left',
              });
            })
            .on('mouseout', () => {
              toolOut();
            })
            .attr('width', () => x(0))
            .attr('y', (d) => y(d.key))
            .attr('height', y.bandwidth())
            .style('fill', `url(#${id}gradient)`)
            .style('fill-opacity', '0.8')
            .style('cursor', 'pointer')
            .transition()
            .duration((d, i) => (animation ? 1000 - 100 * i : 0))
            .delay((d, i) => (animation ? 900 + 100 * i : 0))
            .attr('width', (d) => x(d.value));

          const defs = svg.append('defs');
          createGradient(defs, id, colors, {
            x1: '0%',
            y1: '50%',
            x2: '100%',
            y2: '10%',
          });

          const xx = svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(
              d3
                .axisBottom(x)
                .ticks(5),
            );
          xx.selectAll('text').attr('class', 'newBarYaxis');

          xx.selectAll('.tick')
            .select('line')
            .remove();

          svg
            .append('text')
            .attr('transform', `translate(${(width - 10) / 2} ,${size.h - 10})`)
            .attr('class', 'newBarXlable')
            .style('text-anchor', 'middle')
            .text(
              lable.xlable
                ? lable.xlable.charAt(0).toUpperCase()
                + lable.xlable.slice(1)
                : '',
            );

          const yy = svg.append('g').call(d3.axisLeft(y));

          yy.selectAll('.tick')
            .select('line')
            .remove();

          yy.selectAll('text')
            .attr('class', 'newBarXaxis')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .call(wrap2);

          svg
            .append('text')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - height / 2)
            .attr('dy', '0.8em')
            .attr('class', 'newBarYlable')
            .style('text-anchor', 'middle')
            .text(
              lable.ylable
                ? lable.ylable.charAt(0).toUpperCase()
                + lable.ylable.slice(1)
                : '',
            );

          svg
            .append('g')
            .attr('class', 'grid')
            .style('opacity', '0.1')
            .attr('transform', `translate(0,${height})`)
            .call(
              makexGridline(x)
                .tickSize(-height)
                .tickFormat(''),
            )
            .select('path')
            .style('opacity', 0);
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 200);
  };
  chart();

  useEffect(() => {
    animation = true;
    chart();
    window.addEventListener('resize', chart);
    return () => {
      toolOut();
      window.removeEventListener('resize', chart);
    };
  }, []);

  return null;
});

HorizontalBar.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  lable: PropTypes.oneOfType([PropTypes.object]),
};

HorizontalBar.defaultProps = {
  id: '',
  data: [],
  lable: {},
};

export default HorizontalBar;
