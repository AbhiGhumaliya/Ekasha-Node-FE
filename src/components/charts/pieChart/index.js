/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-inner-declarations */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import '../lib/style.css';
import { Redirect } from 'react-router-dom';
import {
  arcGradient, toolMove, toolOut, noDataSet, sizeChart,
} from '../lib/utils';

let animation = false;
const PieChart = (props) => {
  const { id, data, type } = props;
  const [Filter, setFilter] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const onClick = (d) => {
    setRedirect(true);
    setFilter(d);
  };
  setTimeout(() => {
    animation = false;
  }, 2000);

  const chart = () => {
    const color = [
      '#3d9b99', '#FBBF45', '#47E4C1', '#1EB6F9', '#7C34F2', '#A4CEE5', '#0577CC', '#2ABF6C', '#8D6FF5', '#4500A9', '#0C4EA3', '#2952FF', '#A62CB2', '#7720F5',
    ];
    const element = document.getElementById(id);
    setTimeout(() => {
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data && data.length > 0) {
        const dataSet = [...data];

        dataSet.forEach((d, i) => {
          if (d.key === '' || d.key === null) {
            data.splice(i, 1);
          }
        });
        const size = sizeChart(id);

        if (size.h > 0 && size.w > 0) {
          const margin = {
            top: 5, right: 5, bottom: 5, left: 5,
          };
          const width = size.w - margin.right - margin.left;
          const height = size.h / 1.7 - margin.top - margin.bottom + 27;

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
            .append('g')
            .attr(
              'transform',
              `translate(${(width + margin.left + margin.right) / 2},${(height + margin.bottom) / 2})`,
            );

          const config = {
            innerRadius: 0,
            outerRadius: Math.min(width, height) / 2.2,
          };
          const pie = d3.pie().value((d) => d.value);

          const PieData = pie(data);

          const pieArc = d3
            .arc()
            .innerRadius(config.innerRadius)
            .outerRadius(config.outerRadius);

          const arcOver = d3
            .arc()
            .innerRadius(config.innerRadius)
            .outerRadius(config.outerRadius + 5);

          svg
            .append('g')
            .selectAll('.NewPieChart')
            .data(PieData)
            .enter()
            .append('path')
            .attr('class', 'NewPieChart')
            .attr('id', (d, i) => `${id}NewPieChart${i}`)
            .on('mousemove', (d, i) => {
              moveTooltip(i, 200);
              const rightSpace = document.body.clientWidth - d3.event.pageX;
              const PageX = d3.event.pageX + 3;
              toolMove({
                key: d.data.key,
                value: d.data.value,
                x: rightSpace < 100 ? PageX - 110 : PageX,
                y: d3.event.pageY + 10,
                tool: rightSpace < 100 ? 'right' : 'left',
              });
              d3.select(`#${id}focuse_${i}`).style(
                'background-color',
                '#353a45',
              );
              const elem = document.getElementById(`${id}contenter`);
              elem.scrollTop = i * 41;
            })
            .on('mouseout', (d, i) => {
              toolOut();
              outTooltip(i);
              d3.select(`#${id}focuse_${i}`).style(
                'background-color',
                null,
              );
            })
            .style('fill', (d, i) => `url(#${id}grdient${i})`)
            .style('opacity', '0.8')
            .transition()
            .duration(animation ? 2000 : 0)
            .ease(d3.easeLinear)
            .attr('d', pieArc)
            .delay((d, i) => (animation ? i * 300 : 0));

          arcGradient(svg, PieData, id, 'grdient', colors);
          _legend(height - 100, data, content, color, id);
          function _legend(height1, data1, id1, colors1, id2) {
            const color1 = d3.scaleOrdinal().range(colors1);
            const leg = id1
              .append('div')
              .attr('class', 'li-content scrollstyle')
              .attr('id', `${id2}contenter`)
              .style('height', `${height1}px`)
              .style('width', '100%')
              .append('div')
              .attr('class', 'li-items');

            const list = leg.append('ul');
            const entries = list
              .selectAll('li')
              .data(data1)
              .enter()
              .append('li')
              .attr('id', (d, i) => `${id2}focuse_${i}`)
              .attr('class', 'pieli')
              .style('text-align', 'left')
              .on('mousemove', (d, i) => {
                moveTooltip(i, 500);
              })
              .on('mouseout', (d, i) => {
                outTooltip(i);
                d3.select(`#${id2}focuse_${i}`).style('background-color', null);
              });
            const test = entries.append('span')
              .style('width', 'calc(100% - 30px)')
              .style('display', 'inline-flex')
              .style('align-items', 'center');

            test
              .append('span')
              .html('&#9679;')
              .style('font-size', '18px')
              .style('color', (d, i) => color1(i));
            test
              .append('span')
              .classed('underline', true)
              .style('margin-left', '12px')
              .style('font-size', '11px')
              .style('text-transform', 'capitalize')
              .style('text-overflow', 'ellipsis')
              .style('overflow', 'hidden')
              .style('white-space', 'nowrap')
              .style('cursor', type === 'home' ? 'pointer' : '')
              .html((d) => `${d.key}`)
              // .on('mousemove', (d) => {
              //   const rightSpace = document.body.clientWidth - d3.event.pageX;
              //   const PageX = d3.event.pageX + 3;
              //   toolMove({
              //     key: d.key,
              //     value: d.value,
              //     x: rightSpace < 100 ? PageX - 110 : PageX,
              //     y: d3.event.pageY + 10,
              //     tool: rightSpace < 100 ? 'right' : 'left',
              //   });
              // })
              .on('click', (params) => onClick(params.key));

            entries
              .append('span')
              .style('margin-top', '4px')
              .style('float', 'right')
              .style('font-size', '13px')
              .style('color', (d, i) => color1(i))
              .html((d) => `${d.value}`);
          }
          function moveTooltip(i, d) {
            d3.select(`#${id}NewPieChart${i}`)
              .transition()
              .duration(d)
              .attr('d', arcOver);
          }
          function outTooltip(i) {
            d3.select(`#${id}NewPieChart${i}`)
              .transition()
              .duration(500)
              .attr('d', pieArc);
          }
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 10);
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

  if (redirect === true && Filter && type === 'home') {
    return (
      <Redirect
        to={{
          pathname: '/zeronsec/incidents/Timeline',
          type: 'killchain',
          incidentId: Filter,
          search: encodeURIComponent(`cyberKillChainStage:${Filter}`),
        }}
      />
    );
  }
  return null;
};

PieChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  type: PropTypes.string,
};

PieChart.defaultProps = {
  id: null,
  data: [],
  type: '',
};

export default PieChart;
