import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import $ from 'jquery';
import {
  noDataSet, makeyGridlines, wrap2, sizeChart,
} from '../lib/utils';
import '../lib/style.css';
import './style.css';
import { convertData } from '../lib/DataConver';

const AreaChart = React.memo((props) => {
  const {
    id, data, lable,
  } = props;

  const [shouldReloadChart, setShouldReloadChart] = useState(true);

  const chart = (animation) => {
    const color = ['#579fd7', '#77cbc6', '#3eb76d', '#db9fc7', '#6c56a4', '#045f7c', '#204080', '#f0577b', '#f48174', '#4789c8', '#fabf45', '#b91f43', '#974243', '#cbb048', '#c35496', '#f49d55', '#ea5d24', '#3c543e', '#99bd45', '#f8b0b2', '#fee468'];
    const element = document.getElementById(id);
    if (element && element.innerHTML !== '') {
      element.innerHTML = '';
    }
    if (data && data.length > 0) {
      const dataSet = [...data];
      const obj = convertData(dataSet);
      const size = sizeChart(id);

      const colors = d3.scaleOrdinal().domain([1, data.length]).range(color);
      if (size.h > 0 && size.w > 0) {
        const margin = {
          top: 5, right: 35, bottom: 95, left: 70,
        };
        const width = size.w - margin.left - margin.right;
        const height = size.h - margin.top - margin.bottom;

        const content = d3
          .select(`#${id}`)
          .append('div')
          .attr('id', `${id}_cc`);

        let svg;

        let x; let
          y;
        let maxval = 0;
        if (obj.single === true) {
          dataSet.sort((a, b) => {
            if (a.key > b.key) {
              return 1;
            }
            return -1;
          });
          const highestValue = Math.max(...dataSet.map((item) => item.value));
          const firstIndexOfHighestValue = dataSet.findIndex((item) => item.value === highestValue);
          const colorForHighestValue = colors(firstIndexOfHighestValue);
          svg = content
            .append('svg')
            .attr('id', `${id}svg`)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'line_Svg')
            .append('g')
            .attr(
              'transform',
              `translate(${margin.left},${margin.top})`,
            );
          x = d3
            .scalePoint()
            .domain(obj.tmp.map((el) => el.key))
            .range([0, width - margin.right]);

          x.invert = (function () {
            const domain = x.domain();
            const range = x.range();
            const scale = d3.scaleQuantize().domain(range).range(domain);
            return function (xx) {
              return scale(xx);
            };
          }());
          obj.tmp.forEach((ddd) => {
            maxval = maxval < ddd.value ? ddd.value : maxval;
          });
          const max = maxval + 2;
          y = d3.scaleLinear().domain([0, max]).range([height, 0]);

          svg
            .append('path')
            .datum(obj.tmp)
            .style('fill', colorForHighestValue)
            .style('fill-opacity', '0.4')
            .attr(
              'd',
              d3
                .area()
                .curve(d3.curveMonotoneX)
                .x((d) => x(d.key))
                .y0(y(0))
                .y1(() => y(0)),
            )
            .transition()
            .duration(animation ? 1500 : 0)
            .attr(
              'd',
              d3
                .area()
                .curve(d3.curveMonotoneX)
                .x((d) => x(d.key))
                .y0(y(0))
                .y1((d) => y(d.value)),
            );

          svg
            .append('path')
            .data([obj.tmp])
            .style('fill', 'none')
            .style('stroke', d3.rgb(colorForHighestValue).brighter(0.1))
            .attr('stroke-width', 1)
            .attr('d', (d) => d3
              .line()
              .curve(d3.curveMonotoneX)
              .x((dd) => x(dd.key))
              .y(() => y(0))(d))
            .transition()
            .duration(animation ? 1500 : 0)
            .attr('d', (d) => d3
              .line()
              .curve(d3.curveMonotoneX)
              .x((dd) => x(dd.key))
              .y((dd) => y(dd.value))(d));

          const gradient = svg
            .append('g')
            .selectAll('g')
            .data([0])
            .enter()
            .append('defs')
            .append('linearGradient')
            .attr('id', (d, i) => `${id}area_ent-${i}`)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

          gradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-opacity', '1')
            .attr('stop-color', (d, i) => d3.rgb(colors(i)));
          gradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-opacity', '.1')
            .attr('stop-color', (d, i) => d3.rgb(colors(i)));
        } else {
          margin.bottom += 10;

          dataSet.forEach((d) => {
            d.value.sort((a, b) => {
              if (a.key > b.key) {
                return 1;
              }
              return -1;
            });
          });
          obj.allKeys.sort((a, b) => {
            if (a > b) {
              return 1;
            }
            return -1;
          });
          svg = content
            .append('svg')
            .attr('id', `${id}svg`)
            .attr('class', 'line_Svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
              'transform',
              `translate(${margin.left},${margin.top})`,
            );

          const datass = [];
          dataSet.forEach((d) => {
            d.value.forEach((j) => {
              datass.push(j);
              j.date = j.key;
              j.value = +j.value;
            });
          });
          const xkey = [];
          dataSet.forEach((d) => {
            d.value.forEach((ddd) => {
              if (xkey.indexOf(ddd.key) === -1) {
                xkey.push(ddd.key);
              }
              maxval = maxval < ddd.value ? ddd.value : maxval;
            });
          });

          x = d3
            .scalePoint()
            .domain(obj.single ? obj.tmp.map((d) => d.key) : obj.allKeys)
            .range([0, width - margin.right - margin.left + 65]);

          x.invert = (function () {
            const domain = x.domain();
            const range = x.range();
            const scale = d3
              .scaleQuantize()
              .domain(range)
              .range(domain);
            return function (xx) {
              return scale(xx);
            };
          }());

          y = d3
            .scaleLinear()
            .domain([0, maxval + 1])
            .range([height, 0]);

          dataSet.forEach((d, i) => {
            svg
              .append('path')
              .datum(
                d.value.map((v) => ({ key: v.date, value: v.value })),
              )
              .style('fill', () => `url(#${id}area_ent${i})`)
              .attr(
                'd',
                d3
                  .area()
                  .curve(d3.curveMonotoneX)
                  .x((dd) => x(dd.key))
                  .y0(y(0))
                  .y1(() => y(0)),
              )
              .transition()
              .duration(animation ? 1500 : 0)
              .ease(d3.easeLinear)
              // .delay(() => i * 200)
              .style('fill-opacity', '0.8')
              .attr(
                'd',
                d3
                  .area()
                  .curve(d3.curveMonotoneX)
                  .x((dd) => x(dd.key))
                  .y0(y(0))
                  .y1((dd) => y(dd.value)),
              );

            svg
              .append('path')
              .data([
                d.value.map((v) => ({ key: v.date, value: v.value })),
              ])
              .style('fill', 'none')
              .attr('stroke-width', 1)
              .style('stroke', () => d3.rgb(colors(i)).brighter(0.1))
              .attr('d', (dddd) => d3
                .line()
                .curve(d3.curveMonotoneX)
                .x((dd) => x(dd.key))
                .y(() => y(0))(dddd))
              .transition()
              .duration(animation ? 1500 : 0)
              .ease(d3.easeLinear)
              .attr('d', (ddd) => d3
                .line()
                .curve(d3.curveMonotoneX)
                .x((dd) => x(dd.key))
                .y((dd) => y(dd.value))(ddd));
          });
          const gradient = svg
            .append('g')
            .selectAll('g')
            .data([...Array(dataSet.length).keys()])
            .enter()
            .append('defs')
            .append('linearGradient')
            .attr('id', (_, i) => `${id}area_ent${i}`)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

          gradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-opacity', '1')
            .attr('stop-color', (d, i) => d3.rgb(colors(i)));
          gradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-opacity', '.1')
            .attr('stop-color', (d, i) => d3.rgb(colors(i)));
        }

        svg
          .append('g')
          .attr('class', 'grid')
          .style('opacity', '0.1')
          .style('pointer-events', 'none')
          .call(makeyGridlines(y).tickSize(-width + 18).tickFormat(''))
          .select('path')
          .style('opacity', 0);

        const xx = svg
          .append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x));

        xx.selectAll('text').attr('class', 'newAreaXaxis').style('text-anchor', 'middle').call(wrap2);
        xx.selectAll('.tick').select('line').remove();

        svg
          .append('text')
          .attr(
            'transform',
            `translate(${(width - margin.left - margin.right + 20) / 2} , ${height + margin.bottom - 45})`,
          )
          .attr('class', 'newAreaXlable')
          .text(
            lable.xlable
              ? lable.xlable.charAt(0).toUpperCase()
                + lable.xlable.slice(1)
              : '',
          );
        const yy = svg.append('g').call(
          d3.axisLeft(y)
            .tickFormat((d) => {
              // Use a custom formatting function to remove decimals and duplicates
              if (d % 1 === 0) {
                return d;
              }
              return '';
            })
            .ticks(5),
        );

        yy.selectAll('text').attr('class', 'newAreaYaxis');

        yy.selectAll('.tick').select('line').remove();
        svg
          .append('text')
          .attr('class', 'newAreaYlable')
          .attr(
            'transform',
            `translate(${-(margin.left / 1.3)
            },${(height / 2)
            })rotate(-90)`,
          )
          .attr('dy', '1em')
          .text(
            lable.ylable
              ? lable.ylable.charAt(0).toUpperCase()
                + lable.ylable.slice(1)
              : '',
          );
        const leg = content
          .append('div')
          .attr('class', 'scroll-tabs listh-content scrollstyle')
          .style('text-align', 'center')
          .style('position', 'absolute')
          .style('bottom', '0')
          .style('width', `${width + margin.left + margin.right}px`)
          .append('div')
          .attr('class', 'listh-list');

        const list = leg.append('ul');
        const entries = list
          .selectAll('li')
          .data(dataSet)
          .enter()
          .append('li')
          .attr('id', (d, i) => `selectli${i}`)
          .attr('class', 'offbutton')
          .style('cursor', 'default')
          .attr('id', (d, i) => `${id}strlist${i}`);

        entries
          .append('span')
          .html('&#9679;')
          .style('font-size', '20px')
          .style('color', (d, i) => colors(i));

        entries
          .append('span')
          .style('margin-left', '10px')
          .style('font-size', '11px')
          .style('text-transform', 'capitalize')
          .style('display', 'table-caption')
          .style('margin-bottom', '-2px')
          .style('padding-right', '7px')
          .html((d) => `${d.key}`);
      }
      // eslint-disable-next-line no-shadow
      $(($) => {
        $.fn.hScroll = function (amount) {
          amount = amount || 120;
          $(this).bind('DOMMouseScroll mousewheel ', function (event) {
            const oEvent = event.originalEvent;
            const direction = oEvent.detail
              ? oEvent.detail * -amount
              : oEvent.wheelDelta;
            let position = $(this).scrollLeft();
            position += direction > 0 ? -amount : amount;
            $(this).scrollLeft(position);
            event.preventDefault();
          });
        };
      });
      $(document).ready(() => {
        $('.scroll-tabs').hScroll(15); // You can pass (optionally) scrolling amount
      });
    } else if (element) {
      element.innerHTML = noDataSet(id);
    }
  };

  chart(shouldReloadChart);

  useEffect(() => {
    chart(shouldReloadChart);
    setTimeout(() => {
      setShouldReloadChart(false);
    }, 2000);
    window.addEventListener('resize', chart);
    return () => {
      window.removeEventListener('resize', chart);
    };
  }, []);

  return null;
});

AreaChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.number,
  })),
  lable: PropTypes.shape({
    xlable: PropTypes.string,
    ylable: PropTypes.string,
  }),
};

AreaChart.defaultProps = {
  id: 'areaChart',
  data: [],
  lable: {
    xlable: '',
    ylable: '',
  },
};

export default AreaChart;
