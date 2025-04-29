/* eslint-disable no-inner-declarations */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import '../lib/style.css';
import { convertData } from '../lib/DataConver';
import {
  makeyGridlines, createGradient, toolMove, toolOut, noDataSet,
  sizeChart,
} from '../lib/utils';

let animation = false;

const HomeBarChart = React.memo((props) => {
  const { id, data } = props;

  setTimeout(() => {
    animation = false;
  }, 2000);

  const chart = () => {
    const color = ['#38A6FC', '#3CF9DF', '#FB6D89', '#EC9CE3', '#5380BE', '#015E7B', '#183F81', '#FC577B', '#FF8273', '#1892F8'];
    const element = document.getElementById(id);

    setTimeout(() => {
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data && data.length > 0) {
        const dataSet = [...data];
        const obj = convertData(dataSet);
        obj.tmp.forEach((d, i) => {
          if (d.key === '' || d.key === null) {
            obj.tmp.splice(i, 1);
          }
        });
        const size = sizeChart(id);
        const margin = {
          top: 5,
          right: 10,
          bottom: 30,
          left: 30,
        };

        if (size.h > 0 && size.w > 0) {
          const selectorHeight = 30;
          const marginOverview = {
            top: 30, right: 10, bottom: 20, left: 30,
          };

          const width = size.w - margin.left - margin.right;
          const height = size.h - margin.top - margin.bottom - selectorHeight;
          const heightOverview = 80 - marginOverview.top - marginOverview.bottom;
          const colors = d3.scaleOrdinal().range(color);

          obj.tmp.sort((a, b) => b.key - a.key);
          const maxLength = d3.max(
            obj.tmp.map((d) => d.key.length),
          );
          const barWidth = maxLength * 6;
          const numBars = Math.round(width / barWidth);
          const isScrollDisplayed = barWidth * obj.tmp.length > width;
          const tick = obj.tmp.length > 5 ? (obj.tmp.length < 10 ? obj.tmp.length : 8) : 5;

          const x = d3
            .scaleBand()
            .domain(
              obj.tmp.slice(0, numBars).map((d) => d.key),
            )
            .range([0, width])
            .padding(0.65);
          const maxval = d3.max(obj.tmp, (d) => d.value);
          const max = maxval + maxval / tick;
          const y = d3
            .scaleLinear()
            .domain([0, max])
            .range([height, 0]);

          const xAxis = d3.axisBottom(x);
          const yAxis = d3.axisLeft(y);

          const content = d3
            .select(`#${id}`)
            .append('div')
            .attr('id', `${id}_cc`);
          const svg = content
            .append('svg')
            .on('mouseout', toolOut)
            .attr('width', width + margin.left + margin.right)
            .attr(
              'height',
              height + margin.top + margin.bottom + selectorHeight,
            )
            .attr('class', 'horizontalBar_Svg')
            .append('g')
            .attr(
              'transform',
              `translate(${margin.left},${margin.top})`,
            );
          const xx = svg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`)
            .style('text-transform', 'capitalize')
            .call(xAxis);

          xx.selectAll('text')
            .attr('class', 'newLineXaxis')
            .style('text-transform', 'capitalize')
            .style('text-anchor', 'middle');

          xx.selectAll('.tick')
            .select('line')
            .remove();

          const yy = svg
            .append('g')
            .attr('class', 'y axis')
            .call(yAxis.ticks(tick).tickFormat(d3.format(max > 1000 ? '.2s' : '')));

          yy.selectAll('text')
            .attr('class', 'newLineYaxis')
            .style('text-transform', 'capitalize');

          yy.selectAll('.tick')
            .select('line')
            .remove();

          svg
            .append('g')
            .attr('class', 'grid')
            .style('opacity', '0.1')
            .call(
              makeyGridlines(y)
                .tickSize(-width)
                .tickFormat('')
                .ticks(tick),
            )
            .select('path')
            .style('opacity', 0);

          const linech = svg.append('g');
          const defs = svg.append('defs');
          createGradient(defs, id, colors, {
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%',
          });

          linech
            .selectAll(`#${id}bar`)
            .data(obj.tmp.slice(0, numBars))
            .enter()
            .append('rect')
            .attr('id', `${id}bar`)
            .style('fill', `url(#${id}gradient)`)
            .style('cursor', 'pointer')
            .style('clip-path', `url(#${id}clip)`)
            .on('mousemove', (d) => (toolMove({
              key: d.key, value: d.value, x: d3.event.pageX + 3, y: d3.event.pageY + 10,
            })))
            .on('mouseout', toolOut)
            .attr('x', (d) => x(d.key))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .transition()
            .duration(animation ? 750 : 0)
            .attr('y', (d) => y(d.value))
            .attr('height', (d) => height - y(d.value))
            .delay((d, i) => (animation ? i * 300 : 0));

          let displayed;

          if (isScrollDisplayed) {
            const xOverview = d3
              .scaleBand()
              .domain(
                obj.tmp.map((d) => d.key),
              )
              .range([0, width])
              .padding(0.3);

            const yOverview = d3
              .scaleLinear()
              .range([heightOverview, 0])
              .domain(y.domain());

            const li = svg.append('g').attr('class', 'brushli');

            li.selectAll('.bar')
              .data(obj.tmp)
              .enter()
              .append('rect')
              .attr(
                'transform',
                `translate(0, ${height + marginOverview.bottom + 5})`,
              )
              .attr('class', 'bar')
              .style('fill', `url(#${id}gradient)`)
              .style('clip-path', `url(#${id}clip)`)
              .attr('x', (d) => xOverview(d.key))
              .attr('width', xOverview.bandwidth())
              .attr('y', (d) => yOverview(d.value))
              .attr('height', (d) => heightOverview - yOverview(d.value));

            displayed = d3
              .scaleQuantize()
              .domain([0, width])
              .range(d3.range(obj.tmp.length));

            svg
              .append('rect')
              .attr(
                'transform',
                `translate(0, ${height + marginOverview.bottom + 5})`,
              )
              .attr('class', 'mover')
              .attr('x', 0)
              .attr('y', 0)
              .attr('id', `${id}linebrush`)
              .attr('height', selectorHeight)
              .attr(
                'width',
                Math.round(parseFloat(numBars * width) / obj.tmp.length),
              )
              .attr('pointer-events', 'all')
              .attr('cursor', 'ew-resize')
              // eslint-disable-next-line no-use-before-define
              .call(d3.drag().on('drag', display));

            function display() {
              const xax = parseInt(d3.select(this).attr('x'));
              const lineBrushXposition = document.getElementById(`${id}linebrush`).getAttribute('x');
              if (parseInt(lineBrushXposition) === xax) {
                const nx = xax + d3.event.dx;
                const ww = parseInt(d3.select(this).attr('width')) - 10;

                if (nx < 0 || nx + ww > width) return;

                d3.select(this).attr('x', nx);

                const f = displayed(x);
                const nf = displayed(nx);

                if (f === nf) return;

                const newData = obj.tmp.slice(nf, nf + numBars);
                x.domain(
                  newData.map((d) => d.key),
                );
                const bsx = svg.select('.x.axis').call(xAxis);
                bsx
                  .selectAll('text')
                  .attr('class', 'newLineXaxis')
                  .style('text-anchor', 'middle');

                bsx
                  .selectAll('.tick')
                  .select('line')
                  .remove();
                d3.selectAll(`#${id}bar`).remove();

                linech
                  .selectAll(`#${id}bar`)
                  .data(newData)
                  .enter()
                  .append('rect')
                  .attr('id', `${id}bar`)
                  .style('fill', `url(#${id}gradient)`)
                  .attr('x', (d) => x(d.key))
                  .attr('width', x.bandwidth())
                  .attr('y', (d) => y(d.value))
                  .attr('height', (d) => height - y(d.value))
                  .on('mousemove', (d) => (toolMove({
                    key: d.key, value: d.value, x: d3.event.pageX + 3, y: d3.event.pageY + 10,
                  })))
                  .on('mouseout', toolOut);
              }
            }
          }
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 0);
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

HomeBarChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
};

HomeBarChart.defaultProps = {
  id: '',
  data: [],
};

export default HomeBarChart;
