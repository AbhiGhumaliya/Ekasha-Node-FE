/* eslint-disable no-shadow */
/* eslint-disable no-inner-declarations */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import '../lib/style.css';
import $ from 'jquery';
import { convertData } from '../lib/DataConver';
import {
  noDataSet, makeyGridlines, toolMove, toolOut, sizeChart, wrap2,
} from '../lib/utils';

let animation = false;
const StackedBarChart = React.memo((props) => {
  const { id, lable, data } = props;

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
        const newobj = JSON.parse(JSON.stringify(obj));
        const size = sizeChart(id);
        if (size.h > 0 && size.w > 0) {
          const margin = {
            top: 5, right: 20, bottom: 50, left: 50,
          };
          const width = size.w - margin.left - margin.right;
          const height = size.h - margin.top - margin.bottom - 37;
          const colors = d3.scaleOrdinal().range(color);

          const content = d3
            .select(`#${id}`)
            .append('div')
            .attr('id', `${id}_cc`);
          const svg = content
            .append('svg')
            .on('mouseout', toolOut)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.bottom + margin.top)
            .attr('class', 'line_Svg')
            .append('g')
            .attr('id', `${id}selectg`)
            .attr(
              'transform',
              `translate(${margin.left},${margin.top})`,
            );
          function create(width1, height, colors, obj) {
            const Gradient = true;
            const conData = [];
            if (obj.single) {
              let ab = '{';
              obj.tmp.forEach((d) => {
                ab += `"${[d.key]}":${d.value},}`;
                ab = ab.substring(0, ab.length - 1);
              });
              ab = `${ab.substring(0, ab.lastIndexOf(','))}}`;
              conData.push({ ...JSON.parse(ab) });
            } else {
              obj.finalData.forEach((d) => {
                let ab = '{';
                d.value.forEach((el) => {
                  ab += `"${[el.key]}":${el.value},}`;
                  ab = ab.substring(0, ab.length - 1);
                });
                ab = `${ab.substring(0, ab.lastIndexOf(','))}}`;
                conData.push({ key: d.key, ...JSON.parse(ab) });
              });
            }
            const ele = document.getElementById(`${id}selectg`);
            if (ele) {
              if (ele.innerHTML !== '') {
                ele.innerHTML = '';
              }
            }
            const stack = d3.stack().keys(obj.single ? obj.tmp.map((d) => d.key) : obj.allKeys);
            const series = stack(conData);

            const xScale = d3
              .scaleBand()
              .domain(obj.single ? 'k' : obj.finalData.map((d) => d.key))
              .range([0, width1])
              .paddingInner(0.6)
              .paddingOuter(0.2);

            let maxval = 0;
            series[0].forEach((d) => {
              let sum = 0;
              Object.keys(d.data).forEach((dd) => {
                if (dd !== 'key') {
                  sum += d.data[dd];
                }
              });
              maxval = maxval < sum ? sum : maxval;
            });
            const max = maxval + 10;
            const yScale = d3
              .scaleLinear()
              .domain([0, max])
              .range([height - margin.top, 0]);

            const bars = svg.append('g').attr('class', 'bars').style('transform', `translate('1px',${width / 40}px)`);

            const groups = bars
              .selectAll('g')
              .data(series)
              .enter()
              .append('g')
              .attr(
                'fill',
                Gradient === true
                  ? (d) => `url(#${id}gradient-${d.index})`
                  : (d, i) => colors(i),
              )
              .attr('id', (d, i) => `${id}stcselect${i}`);

            groups
              .selectAll('rect')
              .data((d) => d)
              .enter()
              .append('rect')
              .attr('x', (d) => xScale(d.data.key))
              .attr('y', () => yScale(0))
              .style('cursor', 'pointer')
              .attr('width', xScale.bandwidth())
              .on('mousemove', (d) => {
                const rightSpace = document.body.clientWidth - d3.event.pageX;
                const PageX = d3.event.pageX + 3;
                toolMove({
                  key: d.data.key,
                  value: d[1] - d[0],
                  x: rightSpace < 100 ? PageX - 90 : PageX,
                  y: d3.event.pageY + 10,
                  tool: rightSpace < 100 ? 'right' : 'left',
                });
              })
              .on('mouseout', () => toolOut())
              .transition()
              .duration(animation ? 1000 : 0)
              .ease(d3.easeLinear)
              .attr('y', (d) => yScale(d[1]))
              .attr('height', (d) => yScale(d[0]) - yScale(d[1]));
            const xx = svg
              .append('g')
              .attr(
                'transform',
                `translate(${0},${height - margin.top})`,
              )
              .call(
                d3
                  .axisBottom(xScale)
                  .tickPadding(4)
                  .tickSizeInner(5)
                  .tickSizeOuter(6),
              );
            xx.selectAll('text').attr('class', 'StBarXaxis overflow').style('text-anchor', 'middle').call(wrap2);

            xx.selectAll('.tick').select('line').remove();

            svg
              .append('text')
              .attr(
                'transform',
                `translate(${(width1 - margin.left - margin.right) / 2
                } ,${height + margin.bottom
                })`,
              )
              .attr('class', 'StBarXlable')
              .style('text-anchor', 'middle')
              .text(
                lable.xlable
                  ? lable.xlable.charAt(0).toUpperCase()
                  + lable.xlable.slice(1)
                  : '',
              );

            const form = max > 1000 ? '.0f' : ''; // Use '.0f' to remove decimal places for smaller numbers
            const yy = svg
              .append('g')
              .call(
                d3
                  .axisLeft(yScale)
                  .tickFormat(d3.format(form))
                  .tickPadding(2)
                  .tickSizeOuter(6),
              );
            yy.selectAll('text').attr('class', 'StBarYaxis');
            yy.selectAll('.tick').select('line').remove();

            svg
              .append('text')
              .attr('y', 0 - margin.left)
              .attr('x', 0 - (height + margin.top + margin.bottom) / 2)
              .style('transform', 'rotate(-90deg)')
              .attr('dy', '1em')
              .attr('class', 'StBarYlable')
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
              .style('pointer-events', 'none')
              .style('opacity', '0.1')
              .call(
                makeyGridlines(yScale).tickSize(-width1).tickFormat(''),
              )
              .select('path')
              .style('opacity', 0);
            const gradient = svg
              .append('g')
              .selectAll('g')
              .data(series)
              .enter()
              .append('defs')
              .append('linearGradient')
              .attr('id', (d) => `${id}gradient-${d.index}`)
              .attr('x1', '0%')
              .attr('y1', '0%')
              .attr('x2', '0%')
              .attr('y2', '100%');

            gradient
              .append('stop')
              .attr('offset', '0%')
              .attr('stop-color', (d, i) => d3.rgb(colors(i)).brighter(0));
            gradient
              .append('stop')
              .attr('offset', '100%')
              .attr('stop-color', (d, i) => d3.rgb(colors(i)).darker(2));
          }
          create(width, height, colors, obj);

          const leg = content
            .append('div')
            .attr('class', 'scroll-tabs listh-content scrollstyle')
            .style('text-align', 'center')
            .style('width', `${width + margin.left + margin.right}px`)
            .append('div')
            .attr('class', 'listh-list');

          const list = leg.append('ul');
          const entries = list
            .selectAll('li')
            .data(obj.single ? obj.tmp.map((d) => d.key) : obj.allKeys)
            .enter()
            .append('li')
            .attr('id', (d, i) => `selectli${i}`)
            .attr('class', 'offbutton')
            .attr('id', (d, i) => `${id}strlist${i}`)
            .on('click', (d, i) => {
              if (!obj.single && d3.select(`#${id}strlist${i}`).classed('offbutton')) {
                d3.select(`#${id}strlist${i}`)
                  .classed('offbutton', false)
                  .style('border', () => `1px solid ${colors(i)}`)
                  .style('padding', '1px 0px 1px 5px')
                  .classed('nutral', true);
              } else if (!obj.single) {
                d3.select(`#${id}strlist${i}`)
                  .classed('nutral', false)
                  .style('border', '')
                  .style('padding', '1px 0px 1px 5px')
                  .classed('offbutton', true);
              }
              if (obj.single) {
                obj.tmp.forEach((k, p) => {
                  if (d === k.key) {
                    if (k.value > 0) {
                      k.value = 0;
                    } else {
                      k.value = obj.tmp[p].value;
                    }
                  }
                  // k.value.forEach((el, l) => {
                  // });
                });
              } else {
                newobj.finalData.forEach((k, p) => {
                  k.value.forEach((el, l) => {
                    if (d === el.key) {
                      if (el.value > 0) {
                        el.value = 0;
                      } else {
                        el.value = obj.finalData[p].value[l].value;
                      }
                    }
                  });
                });
              }
              create(width, height, colors, newobj);
            });

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
            .html((d) => `${d}`);

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

StackedBarChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  lable: PropTypes.oneOfType([PropTypes.object]),
};

StackedBarChart.defaultProps = {
  id: null,
  data: [],
  lable: {},
};

export default StackedBarChart;
