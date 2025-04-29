import React, { useEffect, useState } from 'react';
import '../lib/style.css';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {
  noDataSet, createGradient, makeyGridlines, toolOut, toolMove, wrap2,
} from '../lib/utils';

let animation = false;
const BarChart2 = React.memo((props) => {
  const { id, data, lable } = props;
  // eslint-disable-next-line no-unused-vars
  const [colorId, setColorId] = useState(Math.random());
  setTimeout(() => {
    animation = false;
  }, 2000);
  const chart = () => {
    const color = [
      '#36cbab',
      '#EC9CE3',
      '#38A6FC',
      '#3CF9DF',
      '#5380BE',
      '#FB6D89',
      '#015E7B',
      '#183F81',
      '#FC577B',
      '#1892F8',
    ];
    const element = document.getElementById(id);
    setTimeout(() => {
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data && data.length > 0) {
        const dataSet = [...data];
        const h = element && element.clientHeight && element.clientHeight !== null
          ? element.clientHeight
          : 0;
        const w = element && element.clientWidth && element.clientWidth !== null
          ? element.clientWidth
          : 0;
        if (h > 0 && w > 0) {
          const margin = {
            top: 5, right: 20, bottom: 50, left: 50,
          };
          const width = w - margin.right - margin.left;
          const height = h - margin.top - margin.bottom;

          let maxval = 0;
          dataSet.forEach((ele) => {
            maxval = ele.value > maxval ? ele.value : maxval;
          });
          const colors = d3.scaleOrdinal().range(color);
          const content = d3
            .select(`#${id}`)
            .append('div')
            .attr('id', `${id}_cc`);
          const svg = content
            .append('svg')
            .on('mouseout', toolOut)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'horizontalBar_Svg')
            .append('g')
            .attr(
              'transform',
              `translate(${margin.left},${margin.top})`,
            );
          const x = d3
            .scaleBand()
            .range([0, width])
            .domain(data.map((d) => d.key))
            .padding(0.7);

          const max = maxval + 2;
          const y = d3
            .scaleLinear()
            .domain([0, max])
            .range([height, 0]);

          const bar = svg
            .selectAll('.newBarChart')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'newBarChart');

          bar
            .attr('x', (d) => x(d.key))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .transition()
            .duration(animation ? 2000 : 0)
            .ease(d3.easeLinear)
            .attr('y', (d) => y(d.value))
            .attr('height', (d) => height - y(d.value))
            .delay((d, i) => (animation ? i * 300 : 0))
            .style('fill', `url(#${colorId}gradient)`)
            .style('cursor', 'pointer')
            .style('fill-opacity', '0.8');

          bar
            .on('mousemove', (d) => {
              toolMove({
                key: d.key,
                value: d.value,
                x: d3.event.pageX + 5,
                y: d3.event.pageY + 7,
              });
            })
            .on('mouseout', () => {
              toolOut();
            });
          const defs = svg.append('defs');
          createGradient(defs, colorId, colors, {
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%',
          });
          const xx = svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

          xx.selectAll('text')
            // .attr("transform", "translate(-10,0)rotate(-45)")
            .attr('class', 'newBarXaxis overflow')
            .call(wrap2);

          xx.selectAll('.tick')
            .select('line')
            .remove();
          svg
            .append('text')
            .attr('transform', `translate(${(width - 50) / 2} ,${h - 5})`)
            .attr('class', 'newBarXlable')
            .style('text-anchor', 'middle')
            .text(
              lable.xlable
                ? lable.xlable.charAt(0).toUpperCase() + lable.xlable.slice(1)
                : '',
            );

          const yy = svg.append('g').call(
            d3
              .axisLeft(y)
              .ticks(5)
              .tickFormat((d) => {
                if (d % 1 === 0) {
                  return d;
                }
                return '';
              }),
          );
          yy.selectAll('.tick')
            .select('line')
            .remove();

          yy.selectAll('text').attr('class', 'newBarYaxis');
          svg
            .append('text')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - height / 2)
            .attr('dy', '1em')
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
            .call(
              makeyGridlines(y)
                .tickSize(-width)
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
      animation = false;
    };
  }, []);
  return null;
});
BarChart2.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  lable: PropTypes.oneOfType([PropTypes.object]),
};

BarChart2.defaultProps = {
  id: null,
  data: [],
  lable: {},
};
export default BarChart2;
