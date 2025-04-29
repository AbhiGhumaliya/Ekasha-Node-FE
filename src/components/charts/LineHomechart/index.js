/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-inner-declarations */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import '../lib/style.css';
import { convertData } from '../lib/DataConver';
import {
  makeyGridlines, toolMove, toolOut, noDataSet, sizeChart,
} from '../lib/utils';

const HomelineChart = React.memo((props) => {
  const {
    data, id, kpiStatus,
  } = props;

  const color = ['#38A6FC', '#3CF9DF', '#FB6D89', '#EC9CE3', '#5380BE', '#015E7B', '#183F81', '#FC577B', '#FF8273', '#1892F8'];

  const chart = () => {
    const element = document.getElementById(id);
    setTimeout(() => {
      if (data && data.length > 0) {
        const obj = convertData([...data]);
        if (element && element.innerHTML !== '') {
          element.innerHTML = '';
        }
        const size = sizeChart(id);
        const margin = {
          top: 5,
          right: 40,
          bottom: 30,
          left: 40,
        };
        if (size.h > 0 && size.w > 0) {
          const selectorHeight = 32;
          const marginOverview = {
            top: 30, right: 25, bottom: 20, left: 40,
          };

          const width = size.w - margin.left - margin.right;
          const heightOverview = 80 - marginOverview.top - marginOverview.bottom;
          const colors = d3.scaleOrdinal().range(color);
          obj.tmp.sort((a, b) => b.key - a.key);
          const maxLength = d3.max(
            obj.tmp.map((d) => d.key.length),
          );
          const barWidth = maxLength * 5.7;
          const numBars = Math.round(width / barWidth);
          const isScrollDisplayed = barWidth * obj.tmp.length > width;
          const height = size.h - margin.top - margin.bottom - selectorHeight;
          const highestValue = obj.tmp.reduce((maxItem, itemData) => (
            itemData.value > maxItem ? itemData.value : maxItem), obj.tmp[0].value);
          const tick = obj.tmp.length > 5 ? (obj.tmp.length < 10 ? obj.tmp.length > highestValue
            ? highestValue : obj.tmp.length : 8) : 5;

          const x = d3
            .scalePoint()
            .domain(
              obj.tmp.slice(0, (numBars + 1)).map((d) => d.key),
            )
            .range([0, width], 0.2);
          const maxval = d3.max(obj.tmp, (d) => d.value);
          const max = tick === maxval ? maxval : maxval + maxval / tick;
          const y = d3.scaleLinear().domain([0, max]).range([height, 0]);

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
            .attr('class', 'line_Svg')
            .append('g')
            .attr(
              'transform',
              `translate(${margin.left},${margin.top})`,
            );

          const xx = svg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

          xx.selectAll('text')
            .attr('class', kpiStatus === false ? 'kpiNewLineXaxis' : 'newLineXaxis')
            .style('text-anchor', 'middle');

          xx.selectAll('.tick').select('line').remove();

          const yy = svg
            .append('g')
            .attr('class', 'y axis')
            .call(yAxis.ticks(max > 5 ? tick : Math.floor(max)).tickFormat(d3.format(max > 1000 ? '.2s' : '.0f')));
          yy.selectAll('text').attr('class', kpiStatus === false ? 'kpiNewLineYaxis' : 'newLineYaxis');
          yy.selectAll('.tick').select('line').remove();

          svg
            .append('g')
            .attr('class', 'grid')
            .style('opacity', '0.1')
            .call(
              makeyGridlines(y).tickSize(-width).tickFormat('').ticks(tick),
            )
            .select('path');
          const linech = svg.append('g');

          linech
            .append('path')
            .datum(obj.tmp.slice(0, numBars + 1))
            .attr('id', `${id}linePath`)
            .attr('fill', 'none')
            .attr('stroke-width', '1.5px')
            .style('clip-path', `url(#${id}clip)`)
            .attr('stroke', kpiStatus === false ? '#9778FF' : (d, i) => colors(i))
            .attr(
              'd',
              d3
                .line()
                .curve(kpiStatus ? d3.curveLinear : d3.curveMonotoneX)
                .x((d) => x(d.key))
                .y((d) => y(d.value)),
            );

          svg
            .append('g')
            .selectAll(`#${id}rectag`)
            .data(obj.tmp.slice(0, numBars + 1))
            .enter()
            .append('circle')
            .attr('class', 'rectag')
            .attr('id', `${id}rectag`)
            .style('clip-path', `url(#${id}clip)`)
            .style('display', 'block')
            .attr('fill', (d) => colors(d))
            .attr('cx', (d) => x(d.key))
            .attr('cy', (d) => y(d.value))
            .attr('r', 2)
            .on('mousemove', function (d, i) {
              d3.select(this).style('cursor', 'pointer');
              const MoveX = d3.event.pageX + 3;
              toolMove({
                key: d.key,
                value: d.value,
                x: i === obj.tmp.slice(0, numBars + 1).length - 1
                  ? MoveX - (kpiStatus === false ? 110 : 140) : MoveX,
                y: d3.event.pageY + 10,
                tool: i === obj.tmp.slice(0, numBars + 1).length - 1 ? 'right' : 'left',
              });
            })
            .on('mouseout', function () {
              d3.select(this).style('cursor', 'default');
              toolOut();
            });

          linech
            .selectAll(`#${id}rectag`)
            .data(obj.tmp.slice(0, numBars + 1))
            .enter()
            .append('circle')
            .attr('class', 'rectag')
            .attr('id', `${id}rect`)
            .style('clip-path', `url(#${id}clip)`)
            .style('display', 'block')
            .attr('r', 6)
            .attr('fill', 'transparent')
            .attr('cx', (d) => x(d.key))
            .attr('cy', (d) => y(d.value))

            .on('mousemove', function (d, i) {
              d3.select(this).style('cursor', 'pointer');
              const PageX = d3.event.pageX + 3;
              toolMove({
                key: d.key,
                value: d.value,
                x: i === obj.tmp.slice(0, numBars + 1).length - 1
                  ? PageX - (kpiStatus === false ? 110 : 140) : PageX,
                y: d3.event.pageY + 10,
                tool: i === obj.tmp.slice(0, numBars + 1).length - 1 ? 'right' : 'left',
              });
            })

            .on('mouseout', function () {
              d3.select(this).style('cursor', 'default');
              toolOut();
            });
          if (isScrollDisplayed) {
            const xOverview = d3
              .scalePoint()
              .domain(
                data.map((d) => d.key),
              )
              .range([0, (width - 5)], 0.2);

            const yOverview = d3
              .scaleLinear()
              .range([heightOverview, 0])
              .domain(y.domain());

            const li = svg.append('g').attr('class', 'brushli');

            li.append('path')
              .attr('class', 'harsh')
              .attr(
                'transform',
                `translate(1.9, ${height + marginOverview.bottom + 6})`,
              )
              .datum(obj.tmp)
              .attr('fill', 'none')
              .attr('stroke', kpiStatus === false ? '#9778FF' : (d, i) => colors(i))
              .attr(
                'd',
                d3
                  .line()
                  .curve(kpiStatus ? d3.curveLinear : d3.curveMonotoneX)
                  .x((d) => xOverview(d.key))
                  .y((d) => yOverview(d.value)),
              );

            var displayed = d3
              .scaleQuantize()
              .domain([0, width])
              .range(d3.range(data.length));

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
                Math.round(parseFloat(numBars * width) / (data.length)),
              )
              .attr('pointer-events', 'all')
              .attr('cursor', 'ew-resize')
              // eslint-disable-next-line no-use-before-define
              .call(d3.drag().on('drag', display));
          }
          function display() {
            const xax = parseInt(d3.select(this).attr('x'));
            const lineBrushXposition = document.getElementById(`${id}linebrush`).getAttribute('x');
            if (parseInt(lineBrushXposition) === xax) {
              const nx = xax + d3.event.dx;
              const w = parseInt(d3.select(this).attr('width'));

              if (nx < 0 || nx + w > width) return;

              d3.select(this).attr('x', nx);

              const f = displayed(x);
              const nf = displayed(nx);

              if (f === nf) return;

              const newData = data.slice(nf, nf + (numBars + 1));
              x.domain(
                newData.map((d) => d.key),
              );
              const bsx = svg.select('.x.axis').call(xAxis);
              bsx
                .selectAll('text')
                .attr('class', 'newLineXaxis')
                .style('text-anchor', 'middle');

              bsx.selectAll('.tick').select('line').remove();

              d3.select(`#${id}linePath`)
                .datum(newData)
                .attr('fill', 'none')
                .style('clip-path', `url(#${id}clip)`)
                .attr(
                  'd',
                  d3
                    .line()
                    .curve(kpiStatus ? d3.curveLinear : d3.curveMonotoneX)
                    .x((d) => x(d.key))
                    .y((d) => y(d.value)),
                );
              svg.selectAll(`#${id}rectag`).remove();

              svg
                .append('g')
                .selectAll(`#${id}rectag`)
                .data(newData)
                .enter()
                .append('circle')
                .attr('id', `${id}rectag`)
                .attr('class', 'rectag')
                .style('clip-path', `url(#${id}clip)`)
                .style('display', 'block')
                .attr('fill', (d) => colors(d))
                .attr('cx', (d) => x(d.key))
                .attr('cy', (d) => y(d.value))
                .attr('r', 2)
                .on('mousemove', function (d, i) {
                  const circleX = d3.event.pageX + 3;
                  toolMove({
                    key: d.key,
                    value: d.value,
                    x: i === newData.slice(0, numBars + 1).length - 1
                      ? circleX - (kpiStatus === false ? 110 : 140) : circleX,
                    y: d3.event.pageY + 10,
                    tool: i === obj.tmp.slice(0, numBars + 1).length - 1 ? 'right' : 'left',
                  });
                  d3.select(this).style('cursor', 'pointer');
                })
                .on('mouseout', function () {
                  d3.select(this).style('cursor', 'default');
                  toolOut();
                });

              linech.selectAll(`#${id}rectag`).remove();
              linech
                .selectAll(`#${id}rectag`)
                .data(newData)
                .enter()
                .append('circle')
                .attr('class', 'rectag')
                .attr('id', `${id}rectag`)
                .style('clip-path', `url(#${id}clip)`)
                .style('display', 'block')
                .attr('r', 6)
                .style('cursor', 'default')
                .attr('fill', 'transparent')
                .attr('cx', (d) => x(d.key))
                .attr('cy', (d) => y(d.value))
                .on('mousemove', function (d, i) {
                  d3.select(this).style('cursor', 'pointer');
                  // eslint-disable-next-line no-shadow
                  const x = d3.event.pageX + 3;
                  toolMove({
                    key: d.key,
                    value: d.value,
                    x: i === newData.slice(0, numBars + 1).length - 1
                      ? x - (kpiStatus === false ? 110 : 140) : x,
                    y: d3.event.pageY + 10,
                    tool: i === obj.tmp.slice(0, numBars + 1).length - 1 ? 'right' : 'left',
                  });
                })
                .on('mouseout', function () {
                  d3.select(this).style('cursor', 'default');
                  toolOut();
                });
            }
          }
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 10);
  };

  chart();

  useEffect(() => {
    window.addEventListener('resize', chart);
    return () => {
      toolOut();
      window.removeEventListener('resize', chart);
    };
  }, []);

  useEffect(() => {
    chart();
  }, [data]);

  return (null);
});

HomelineChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]),
  id: PropTypes.string,
  kpiStatus: PropTypes.bool,
};

HomelineChart.defaultProps = {
  data: [],
  id: '',
  kpiStatus: null,
};

export default HomelineChart;
