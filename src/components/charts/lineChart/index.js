/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import '../lib/style.css';
import { convertData, Converter } from '../lib/DataConver';
import {
  noDataSet, makeyGridlines, sizeChart, toolMove, toolOut, wrap2,
} from '../lib/utils';

const LineChart = React.memo((props) => {
  const {
    id, data, lable, kpiStatus, kpiLineColor, type, kpiLegend, chartSizeChange,
  } = props;

  const [mount, setMount] = useState(true);
  const chart = (animation) => {
    const color = ['#36cbab', '#EC9CE3', '#38A6FC', '#3CF9DF', '#5380BE', '#FB6D89', '#015E7B', '#183F81', '#FC577B', '#1892F8'];
    const element = document.getElementById(id);
    setTimeout(() => {
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data && data.length > 0) {
        const dataSet = [...data];
        dataSet.sort((a, b) => {
          if (a.key > b.key) {
            return 1;
          }
          return -1;
        });
        const obj = convertData(dataSet);
        if (kpiStatus) {
          obj?.tmp?.sort((a, b) => {
            const yearA = parseInt(a.key.split(',')[1].trim());
            const yearB = parseInt(b.key.split(',')[1].trim());
            return yearA - yearB;
          });
        }

        const numBars = 6;
        const size = sizeChart(id);
        if (size.h > 0 && size.w > 0) {
          const margin = {
            top: 10,
            right: kpiStatus ? 0 : -10,
            bottom: kpiStatus ? 25 : 70,
            left: kpiStatus ? 30 : 50,
          };
          const width = size.w - margin.left - margin.right;
          const height = size.h - margin.top - margin.bottom;
          const colors = d3.scaleOrdinal().range(color);
          let x; let
            y;
          let maxval = 0;
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
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

          const Ytooltip = content.append('div').attr('class', 'Ytooltip');
          const Xtooltip = content.append('div').attr('class', 'Ytooltip');

          const formate = d3.format(',.0f');
          const focus = svg.append('g');
          if (obj.single === true) {
            let maxval1 = 0;
            obj.tmp.forEach((ddd) => {
              maxval1 = maxval < ddd.value ? ddd.value : maxval1;
            });

            x = d3
              .scalePoint()
              .domain(obj.tmp.map((el) => el.key))
              .range([0, width - margin.left - margin.right]);

            x.invert = (function () {
              const domain = x.domain();
              const range = x.range();
              const scale = d3
                .scaleQuantize()
                .domain(range)
                .range(domain);
              return function (x) {
                return scale(x);
              };
            }());
            let maximum = obj.tmp.map((el) => el.value)[0];
            obj.tmp.map((el) => el.value).forEach((d) => {
              if (d > maximum) {
                maximum = d; // new maximum
              }
            });
            const y = d3
              .scaleLinear()
              .domain([0, maxval + maximum + 10])
              .range([height, 0]);

            const line = d3
              .line()
              .curve(d3.curveMonotoneX)
              .x((d) => x(d.key))
              .y((d) => y(d.value));

            svg
              .append('path')
              .attr('d', line(obj.tmp))
              .style('stroke', kpiStatus && kpiLineColor ? kpiLineColor : (d, i) => d3.rgb(colors(i)).brighter(0.2))
              .style('fill', 'none')
              .attr('class', 'line');

            const totalLength = svg
              .selectAll('path')
              .node()
              .getTotalLength();

            svg
              .selectAll('path')
              .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(animation ? 2000 : 0)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0);

            const xx = svg
              .append('g')
              .attr('transform', `translate(0,${height})`)
              .call(d3.axisBottom(x));

            xx.selectAll('text')
              .attr('class', `${kpiLegend ? 'kpiNewLineXaxis' : 'newLineXaxis overflow'}`)
              .call(wrap2);

            xx.selectAll('.tick')
              .select('line')
              .remove();

            svg
              .append('text')
              .attr('class', 'newLineXLable')
              .attr(
                'transform',
                `translate(${(width - margin.left - margin.right) / 2} ,${height + margin.left + margin.top})`,
              )
              .style('text-anchor', 'middle')
              .text(
                lable.xlable
                  ? lable.xlable.charAt(0).toUpperCase()
                  + lable.xlable.slice(1)
                  : '',
              );

            const tick = obj.tmp.length > 5
              ? obj.tmp.length < 10
                ? obj.tmp.length
                : 8
              : 5;
            const yy = svg.append('g').call(d3.axisLeft(y).ticks(tick).tickFormat((d) => `${d}${type === 'day' ? 'd' : type === 'hour' ? 'h' : type === 'minute' ? 'm' : ''}`));

            yy.selectAll('text').attr('class', kpiStatus ? 'kpiNewLineYaxis' : 'newLineYaxis');
            yy.selectAll('.tick')
              .select('line')
              .remove();

            svg
              .append('text')
              .attr('class', 'newLineYLable')
              .attr(
                'transform',
                `translate(${-(margin.left / 1.3)
                },${(height / 2)
                })rotate(-90)`,
              )
              .style('text-anchor', 'middle')
              .text(
                lable.ylable
                  ? lable.ylable.charAt(0).toUpperCase()
                  + lable.ylable.slice(1)
                  : '',
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
              .style('display', kpiStatus ? 'block' : 'none')
              .attr('fill', () => colors(0))
              .attr('cx', (d) => x(d.key))
              .attr('cy', (d) => y(d.value))
              .attr('r', 2)
              .on('mousemove', function (d) {
                d3.select(this).style('cursor', 'pointer');
                const rightSpace = document.body.clientWidth - d3.event.pageX;
                const PageX = d3.event.pageX + 3;
                toolMove({
                  key: d.key,
                  value: d.value,
                  x: rightSpace < 100 ? PageX - 100 : PageX,
                  tool: rightSpace < 100 ? 'right' : 'left',
                  y: d3.event.pageY + 10,
                  time: d.keyForVal,
                  type,
                });
              })
              .on('mouseout', function () {
                d3.select(this).style('cursor', 'default');
                toolOut();
              });
            svg
              .append('g')
              .selectAll(`#${id}rectag`)
              .data(obj.tmp.slice(0, numBars + 1))
              .enter()
              .append('circle')
              .attr('class', 'rectag')
              .attr('id', `${id}rectag`)
              .style('clip-path', `url(#${id}clip)`)
              .style('display', kpiStatus ? 'block' : 'none')
              .style('cursor', 'pointer')
              .attr('fill', 'transparent')
              .attr('cx', (d) => x(d.key))
              .attr('cy', (d) => y(d.value))
              .attr('r', 6)
              .on('mousemove', function (d) {
                d3.select(this).style('cursor', 'pointer');
                const rightSpace = document.body.clientWidth - d3.event.pageX;
                const PageX = d3.event.pageX + 3;
                toolMove({
                  key: d.key,
                  value: d.value,
                  x: rightSpace < 100 ? PageX - 100 : PageX,
                  tool: rightSpace < 100 ? 'right' : 'left',
                  y: d3.event.pageY + 10,
                  time: d.keyForVal,
                  type,
                });
              })
              .on('mouseout', function () {
                d3.select(this).style('cursor', 'default');
                toolOut();
              });
            svg
              .append('g')
              .attr('class', 'grid')
              .style('opacity', '0.1')
              .call(
                makeyGridlines(y)
                  .tickSize(-(width - margin.left - margin.right))
                  .tickFormat(''),
              );
          } else {
            const conData = Converter(obj.finalData);
            const xkey = [];
            conData.forEach((d) => {
              d.forEach((ddd) => {
                if (xkey.indexOf(ddd.name) === -1) {
                  xkey.push(ddd.name);
                }
                maxval = maxval < ddd.value ? ddd.value : maxval;
              });
            });

            x = d3
              .scalePoint()
              .domain(xkey.map((el) => el))
              .range([0, width - margin.right - margin.left]);

            x.invert = (function () {
              const domain = x.domain();
              const range = x.range();
              const scale = d3
                .scaleQuantize()
                .domain(range)
                .range(domain);
              return function (x) {
                return scale(x);
              };
            }());

            y = d3
              .scaleLinear()
              .domain([0, maxval + 2])
              .range([height, 0]);

            focus
              .append('path')
              .attr('id', `${id}firstli`)
              .attr('class', 'MouseLine');

            focus
              .append('path')
              .attr('id', `${id}secondli`)
              .attr('class', 'MouseLine');

            const chart = svg
              .selectAll('.line')
              .data(conData)
              .enter()
              .append('g')
              .attr('class', 'line');

            chart
              .append('path')
              .style('fill', 'none')
              .style('stroke', (d, i) => d3.rgb(colors(i)).brighter(0.2))
              .style('opacity', '1')
              .style('stroke-linejoin', 'round')
              .style('stroke-miterlimit', 2)
              .style('stroke-width', 0.6)
              .style('stroke-linecap', 'round')
              .style('filter', `url(#${id}glow)`)
              .attr('d', (d) => d3
                .line()
                .curve(d3.curveMonotoneX)
                .x((d) => x(d.name))
                .y((d) => y(d.value))(d));

            const totalLength = chart
              .selectAll('path')
              .node()
              .getTotalLength();

            chart
              .selectAll('path')
              .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(animation ? 2000 : 0)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0);

            chart
              .append('path')
              .style('fill', 'none')
              .style('stroke', (d, i) => colors(i))
              .style('stroke-width', 6)
              .style('opacity', '0')
              .attr('d', (d) => d3
                .line()
                .curve(d3.curveCatmullRom)
                .x((d) => x(d.name))
                .y((d) => y(d.value))(d))
              .on('mousemove', function (d, i) {
                const xy = d3.mouse(this);
                // const l = x.invert(xy[0]);
                const p = y.invert(xy[1]);
                const ny = y(p);
                const ybreaks = 20;
                const xbreaks = width - 80;

                focus
                  .select('circle')
                  .attr('cx', xy[0])
                  .attr('cy', xy[1])
                  .style('opacity', '1');

                d3.select(`#${id}firstli`)
                  .style('opacity', '1')
                  .attr('d', () => {
                    const d = `M${xy[0]},${height} ${xy[0]},${ny}`;
                    return d;
                  });
                d3.select(`#${id}secondli`)
                  .style('opacity', '1')
                  .attr('d', () => {
                    const d = `M${xy[0]},${ny} ${0},${xy[1]}`;
                    return d;
                  });

                Ytooltip.html(`<span>${formate(p)}</span>`)
                  .style('background', colors(i))
                  .style('visibility', 'visible')
                  .style(
                    'border-radius',
                    xy[1] > ybreaks ? '5px 5px 0px 0px' : '0px 0px 5px 5px',
                  );

                Ytooltip.style(
                  'top',
                  `${xy[1] > ybreaks ? xy[1] + 0 : xy[1] + 67}px`,
                ).style('left', `${margin.left + 25}px`);

                Xtooltip.html(`<span>${d[i].key}</span>`)
                  .style('background', colors(i))
                  .style('visibility', 'visible')
                  .style(
                    'border-radius',
                    xy[0] < xbreaks ? '0px 8px 8px 0px' : '8px 0px 0px 8px',
                  );

                Xtooltip.style('top', `${height + 25}px`).style(
                  'left',
                  `${xy[0] < xbreaks
                    ? xy[0] + margin.left + 15
                    : xy[0] + 46 - (d[i].key.length * 4 + 10)}px`,
                );
              })
              .on('mouseout', (d, i) => {
                d3.select(`#${id}line${i}`).style('stroke-width', '1');
                focus.select('circle').style('opacity', '0');
                d3.select(`#${id}firstli`).style('opacity', '0');
                d3.select(`#${id}secondli`).style('opacity', '0');

                Ytooltip.style('visibility', 'hidden');
                Xtooltip.style('visibility', 'hidden');
              });

            const xx = svg
              .append('g')
              .attr('transform', `translate(0,${height})`)
              .call(d3.axisBottom(x));

            xx.selectAll('text')
              .attr('class', kpiStatus ? 'kpiNewLineXaxis overflow' : 'newLineXaxis overflow')
              .call(wrap2);

            xx.selectAll('.tick')
              .select('line')
              .remove();

            svg
              .append('text')
              .attr('class', 'newLineXLable')
              .attr(
                'transform',
                `translate(${(width - margin.left - margin.right) / 2} ,${height + margin.left + margin.top})`,
              )
              .style('text-anchor', 'middle')
              .text(
                lable.xlable
                  ? lable.xlable.charAt(0).toUpperCase()
                  + lable.xlable.slice(1)
                  : '',
              );

            const yy = svg.append('g').call(d3.axisLeft(y).ticks(5).tickFormat((d) => {
              if (d % 1 === 0) {
                return d;
              }
              return '';
            }));

            yy.selectAll('text').attr('class', 'newLineYaxis');
            yy.selectAll('.tick')
              .select('line')
              .remove();

            svg
              .append('text')
              .attr('class', 'newLineYLable')
              .attr(
                'transform',
                `translate(${-(margin.left / 1.3)
                },${(height) / 2
                })rotate(-90)`,
              )
              .style('text-anchor', 'middle')
              .text(
                lable.ylable
                  ? lable.ylable.charAt(0).toUpperCase()
                  + lable.ylable.slice(1)
                  : '',
              );

            /* Grid Line */
            svg
              .append('g')
              .attr('class', 'newLineYGrid')
              .style('opacity', '0.1')
              .call(
                makeyGridlines(y)
                  .tickSize(-(width - margin.left - margin.right))
                  .tickFormat(''),
              );

            const filter = svg
              .append('defs')
              .append('filter')
              .attr('id', `${id}glow`);
            filter
              .append('feGaussianBlur')
              .attr('stdDeviation', '0.5')
              .attr('result', 'coloredBlur');
            const feMerge = filter.append('feMerge');
            feMerge.append('feMergeNode').attr('in', 'coloredBlur');
            feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
          }
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 200);
  };
  chart();

  useEffect(() => {
    setMount(true);
    chart(true);
    setTimeout(() => {
      setMount(false);
    }, 2000);

    window.addEventListener('resize', () => chart());
    return () => {
      toolOut();
      window.removeEventListener('resize', () => chart());
    };
  }, []);

  useEffect(() => {
    if (mount === false) {
      chart(mount);
    }
  }, [data, chartSizeChange]);
  return null;
});

LineChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  lable: PropTypes.oneOfType([PropTypes.object]),
  kpiStatus: PropTypes.bool,
  kpiLineColor: PropTypes.string,
  type: PropTypes.string,
  kpiLegend: PropTypes.bool,
  chartSizeChange: PropTypes.bool,
};

LineChart.defaultProps = {
  id: '',
  data: [],
  lable: {},
  kpiStatus: false,
  kpiLineColor: '',
  type: '',
  kpiLegend: false,
  chartSizeChange: false,
};

export default LineChart;
