/* eslint-disable vars-on-top */
/* eslint-disable block-scoped-var */
/* eslint-disable no-use-before-define */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-var */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import '../lib/style.css';
import { convertData } from '../lib/DataConver';
import {
  makeyGridlines, toolMove, toolOut, noDataSet,
  sizeChart,
} from '../lib/utils';

let animation = false;

const GroupBarChart = React.memo((props) => {
  const { id, data, KPI } = props;

  setTimeout(() => {
    animation = false;
  }, 2000);

  const chart = () => {
    const color = ['#766B33', '#337646'];
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
          let selectorHeight = 0;
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
          selectorHeight = isScrollDisplayed ? 30 : 5;

          const xScale0 = d3
            .scaleBand()
            .domain(
              obj.tmp.slice(0, numBars).map((d) => d.key),
            )
            .range([0, width])
            .padding(0.39);
          const xScale1 = d3.scaleBand();
          const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);
          xScale1.domain(['Undue', 'Overdue']).range([0, xScale0.bandwidth()]);
          yScale.domain([0, d3.max(data, (d) => (d.Overdue > d.Undue ? d.Overdue : d.Undue))]);
          const maxval = d3.max(obj.tmp, (d) => (d.Overdue > d.Undue ? d.Overdue : d.Undue));
          const max = maxval + maxval / tick;
          const xAxis = d3.axisBottom(xScale0);
          const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.0f'));

          const content = d3
            .select(`#${id}`)
            .append('div')
            .attr('id', `${id}_cc`);
          const svg = content
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr(
              'height',
              height + margin.top + margin.bottom + selectorHeight,
            )
            .attr('class', 'groupBar_Svg')
            .append('g')
            .attr(
              'transform',
              `translate(${margin.left},${margin.top - selectorHeight})`,
            );
          const xx = svg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`)
            .style('text-transform', 'capitalize')
            .call(xAxis);

          xx.selectAll('text')
            .attr('class', KPI ? 'kpiNewLineXaxis' : 'newLineXaxis')
            .style('text-transform', 'capitalize')
            .style('text-anchor', 'middle');

          xx.selectAll('.tick')
            .select('line')
            .remove();

          const yy = svg
            .append('g')
            .attr('class', 'y axis')
            .style('transform', 'translate(0, 35px)')
            .call(yAxis.ticks(max > 5 ? tick : Math.floor(max)).tickFormat(d3.format(max > 1000 ? '.2s' : '.0f')));

          yy.selectAll('text')
            .attr('class', KPI ? 'kpiNewLineYaxis' : 'newLineYaxis')
            .style('text-transform', 'capitalize');

          yy.selectAll('.tick')
            .select('line')
            .remove();

          svg
            .append('g')
            .attr('class', 'grid')
            .style('opacity', '0.1')
            .style('transform', 'translate(0, 35px)')
            .call(
              makeyGridlines(yScale)
                .tickSize(-width)
                .tickFormat('')
                .ticks(max > 5 ? tick : Math.floor(max)),
            )
            .select('path')
            .style('opacity', 0);
          const modelName = svg.selectAll('.key')
            .data(obj.tmp)
            .enter().append('g')
            .attr('class', 'key')
            .attr('transform', (d) => `translate(${xScale0(d.key) === undefined ? -90 : xScale0(d.key)},35)`);

          const linech = modelName;
          linech
            .selectAll(`#${id}Undue`)
            .data((d) => [d])
            .enter()
            .append('rect')
            .attr('id', `${id}Undue`)
            .style('fill', () => colors(2))
            .style('cursor', 'pointer')
            .style('clip-path', `url(#${id}clip)`)
            .on('mousemove', (d) => {
              const rightSpace = document.body.clientWidth - d3.event.pageX;
              const PageX = d3.event.pageX + 3;
              toolMove({
                key: d.key,
                value: d.Undue,
                x: rightSpace < 100 ? PageX - 100 : PageX,
                y: d3.event.pageY + 10,
                tool: rightSpace < 100 ? 'right' : 'left',
              });
            })
            .on('mouseout', toolOut)
            .attr('x', xScale1('Undue'))
            .attr('width', xScale1.bandwidth())
            .attr('y', height - margin.top - margin.bottom)
            .attr('height', 0)
            .transition()
            .duration(animation ? 750 : 0)
            .attr('y', (d) => yScale(d.Undue))
            .attr('height', (d) => (height - margin.top - margin.bottom - yScale(d.Undue)))
            .delay((d, i) => (animation ? i * 300 : 0));
          linech
            .selectAll(`#${id}Overdue`)
            .data((d) => [d])
            .enter()
            .append('rect')
            .attr('id', `${id}Overdue`)
            .style('fill', () => colors(1))
            .style('cursor', 'pointer')
            .style('clip-path', `url(#${id}clip)`)
            .on('mousemove', (d) => {
              const rightSpace = document.body.clientWidth - d3.event.pageX;
              const PageX = d3.event.pageX + 3;
              toolMove({
                key: d.key,
                value: d.Overdue,
                x: rightSpace < 100 ? PageX - 100 : PageX,
                y: d3.event.pageY + 10,
                tool: rightSpace < 100 ? 'right' : 'left',
              });
            })
            .on('mouseout', toolOut)
            .attr('x', xScale1('Overdue'))
            .attr('width', xScale1.bandwidth())
            .attr('y', height - margin.top - margin.bottom)
            .attr('height', 0)
            .transition()
            .duration(animation ? 750 : 0)
            .attr('y', (d) => yScale(d.Overdue))
            .attr('height', (d) => height - margin.top - margin.bottom - yScale(d.Overdue))
            .delay((d, i) => (animation ? i * 300 : 0));

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
              .domain(yScale.domain());

            const li = svg.append('g').attr('class', 'brushli');

            li.selectAll('.key')
              .data(obj.tmp)
              .enter()
              .append('rect')
              .attr(
                'transform',
                `translate(0, ${height + marginOverview.bottom + 5})`,
              )
              .attr('class', 'filed1')
              .style('fill', () => colors(1))
              .style('clip-path', `url(#${id}clip)`)
              .attr('x', (d) => xOverview(d.key))
              .attr('width', xOverview.bandwidth())
              .attr('y', (d) => yOverview(d.Overdue))
              .attr('height', (d) => heightOverview - yOverview(d.Overdue));
            li.selectAll('.key')
              .data(obj.tmp)
              .enter()
              .append('rect')
              .attr(
                'transform',
                `translate(0, ${height + marginOverview.bottom + 5})`,
              )
              .attr('class', 'filed2')
              .style('fill', () => colors(2))
              .style('clip-path', `url(#${id}clip)`)
              .attr('x', (d) => xOverview(d.key))
              .attr('width', xOverview.bandwidth())
              .attr('y', (d) => yOverview(d.Undue))
              .attr('height', (d) => heightOverview - yOverview(d.Undue));

            var displayed = d3
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
              .call(d3.drag().on('drag', display));
          }
          function display() {
            const xax = parseInt(d3.select(this).attr('x'));
            const lineBrushXposition = document.getElementById(`${id}linebrush`).getAttribute('x');
            if (parseInt(lineBrushXposition) === xax) {
              const nx = xax + d3.event.dx;
              const ww = parseInt(d3.select(this).attr('width')) - 10;

              if (nx < 0 || nx + ww > width) return;

              d3.select(this).attr('x', nx);

              const f = displayed(xScale0);
              const nf = displayed(nx);

              if (f === nf) return;

              const newData = obj.tmp.slice(nf, nf + numBars);
              xScale0.domain(
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
              d3.selectAll('.key').remove();
              const dada = svg.selectAll('.key')
                .data(newData)
                .enter().append('g')
                .attr('class', 'key')
                .attr('transform', (d) => `translate(${xScale0(d.key)},35)`);
              dada
                .selectAll(`#${id}Overdue`)
                .data((d) => [d])
                .enter()
                .append('rect')
                .attr('id', `#${id}Overdue`)
                .style('fill', () => colors(1))
                .attr('x', xScale1('Overdue'))
                .attr('width', xScale1.bandwidth())
                .attr('y', (d) => yScale(d.Overdue))
                .attr('height', (d) => height - margin.top - margin.bottom - yScale(d.Overdue))
                .on('mousemove', (d) => {
                  const rightSpace = document.body.clientWidth - d3.event.pageX;
                  const PageX = d3.event.pageX + 3;
                  toolMove({
                    key: d.key,
                    value: d.Overdue,
                    x: rightSpace < 100 ? PageX - 100 : PageX,
                    y: d3.event.pageY + 10,
                    tool: rightSpace < 100 ? 'right' : 'left',
                  });
                })
                .on('mouseout', toolOut);
              dada
                .selectAll(`#${id}Undue`)
                .data((d) => [d])
                .enter()
                .append('rect')
                .attr('id', `#${id}Undue`)
                .style('fill', () => colors(2))
                .attr('x', xScale1('Undue'))
                .attr('width', xScale1.bandwidth())
                .attr('y', (d) => yScale(d.Undue))
                .attr('height', (d) => height - margin.top - margin.bottom - yScale(d.Undue))
                .on('mousemove', (d) => {
                  const rightSpace = document.body.clientWidth - d3.event.pageX;
                  const PageX = d3.event.pageX + 3;
                  toolMove({
                    key: d.key,
                    value: d.Undue,
                    x: rightSpace < 100 ? PageX - 100 : PageX,
                    y: d3.event.pageY + 10,
                    tool: rightSpace < 100 ? 'right' : 'left',
                  });
                })
                .on('mouseout', toolOut);
            }
          }
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 0);
  };

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

GroupBarChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  KPI: PropTypes.bool,
};

GroupBarChart.defaultProps = {
  id: '',
  data: [],
  KPI: false,
};

export default GroupBarChart;
