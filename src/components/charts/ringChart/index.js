import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import '../lib/style.css';
import {
  arcGradient, toolMove, toolOut, noDataSet, sizeChart,
} from '../lib/utils';

const RingChart = (props) => {
  const {
    id, data, type, subType, chartType, incidentFilter, setIncidentFilter, // props
  } = props;

  const [redirect, setRedirect] = useState(false); // state

  let animation = false; // animation variable

  const navigateIncident = (d) => { // navigateIncident function
    toolOut();
    setRedirect(d);
  };

  const attributePlusMinus = (d, types) => { // attributePlusMinus function
    const a = [...incidentFilter];
    const index = a.findIndex((s) => s.value === d.key);
    if (index === -1 || a.length === 0) {
      setIncidentFilter([...a, { field: 'assignedToName', value: d.key, operator: types }]);
    }
    if (index !== -1) {
      a[index].operator = types;
      setIncidentFilter([...a]);
    }
  };

  const capitalizeText = (string) => { // capitalizeText function
    const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
    string.match(regex);
    return string;
  };

  /* useEffect animation hooks */
  useEffect(() => {
    animation = true;
  }, []);

  /* setTimeout after 2s animation false */
  setTimeout(() => {
    animation = false;
  }, 2000);

  /* chart function */
  const chart = () => {
    const color = ['#3d9b99', '#FBBF45', '#1EB6F9', '#7C34F2', '#A4CEE5', '#0577CC', '#2ABF6C', '#8D6FF5', '#4500A9', '#0C4EA3', '#2952FF', '#A62CB2', '#7720F5', '#47E4C1']; // color array
    const element = document.getElementById(id); // element get by id

    /* setTimeout after 200ms element element render */
    setTimeout(() => {
      /* if element is not empty, set innerHTML to empty */
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      /* if data is not empty, set dataSet to data */
      if (data && data.length > 0) {
        const dataSet = [...data];
        // size set
        const size = sizeChart(id);
        // margin set
        const margin = {
          top: 5, right: 5, bottom: 5, left: 5,
        };
        // width set
        const width = size.w - margin.right - margin.left + (subType ? 20 : 0);
        // height set
        const height = size.h / 1.6 - margin.top - margin.bottom + (subType ? 20 : 8);
        // colors set
        const colors = d3.scaleOrdinal().range(color);
        // config set
        const config = {
          innerRadius: Math.min(width, height) / (subType ? 2.1 : 2.5),
          outerRadius: Math.min(width, height) / (subType ? 2.8 : 3),
        };

        /* if height and width is greater than 0, set content */
        if (size.h > 0 && size.w > 0) {
          /* content set */
          const content = d3
            .select(`#${id}`)
            .append('div')
            .attr('id', `${id}_cc`)
            .style('display', subType && 'flex')
            .style('height', '100%');

          /* svg set */
          const svg = content
            .append('svg')
            .on('mouseout', toolOut)
            .attr('width', width + margin.left + margin.right - (subType ? 100 : 0))
            .attr('height', height + margin.top + margin.bottom + (subType ? 100 : 0))
            .append('g')
            .attr(
              'transform',
              `translate(${(width + margin.left + margin.right) / (subType ? 4.7 : 2)
              },${(height + margin.bottom) / (subType ? 1.5 : 2)
              })`,
            );
          /* pie set */
          const pie = d3.pie().value((d) => d.value);

          /* pieData set */
          const PieData = pie(dataSet);

          /* pieArc set */
          const pieArc = d3
            .arc()
            .innerRadius(config.innerRadius)
            .outerRadius(config.outerRadius);

          /* arcOver set */
          const arcOver = d3
            .arc()
            .innerRadius(config.innerRadius + 3)
            .outerRadius(config.outerRadius - 3);

          /* moveTooltip function */
          const moveTooltip = (i, d) => {
            d3.select(`#${id}NewRingchart${i}`)
              .transition()
              .duration(d)
              .attr('d', arcOver);
          };
          /* outTooltip function */
          const outTooltip = (i) => {
            d3.select(`#${id}NewRingchart${i}`)
              .transition()
              .duration(500)
              .attr('d', pieArc);
          };
          /* svg append g append path */
          svg
            .append('g')
            .selectAll('.NewRingchart')
            .data(PieData)
            .enter()
            .append('path')
            .attr('class', 'NewRingchart')
            .attr('id', (d, i) => `${id}NewRingchart${i}`)
            .style('opacity', '0.8')
            .style('fill', (d, i) => `url(#${id}grdient${i})`)
            .on('mousemove', (d, i) => {
              const rightSpace = document.body.clientWidth - d3.event.pageX;
              const PageX = d3.event.pageX + 3;
              toolMove({
                key: d.data.key,
                value: d.data.value,
                x: rightSpace < 100 ? PageX - 110 : PageX,
                y: d3.event.pageY + 10,
                tool: rightSpace < 100 ? 'right' : 'left',
              });
              moveTooltip(i, 500);
              d3.select(`#${id}focusering_${i}`).style(
                'background-color',
                subType ? '#0a0d0d' : '#353a45',
              )
                .style(
                  'border',
                  subType ? '1px solid #6f9aff' : 'none',
                )
                .style('margin-bottom', subType ? '10px' : 0);

              const elem = document.getElementById(`${id}contenter`);
              elem.scrollTop = i * 41;
            })
            .on('mouseout', (d, i) => {
              toolOut();
              outTooltip(i);
              d3.select(`#${id}focusering_${i}`).style(
                'background-color',
                subType ? '#0a0d0d' : '#17181900',
              )
                .style(
                  'border',
                  subType ? '1px solid #0a0d0d' : 'none',
                )
                .style('margin-bottom', subType ? '10px' : 0);
            })
            .transition()
            .duration(animation ? 2000 : 0)
            .ease(d3.easeLinear)
            .attr('d', pieArc)
            .delay((d, i) => (animation ? i * 300 : 0));

          /* arcGradient function */
          arcGradient(svg, PieData, id, 'grdient', colors);

          /* legendField function */
          const legendField = (height1, data1, id1, colors1, id2) => {
            const color1 = d3.scaleOrdinal().range(colors1);
            const leg = id1
              .append('div')
              .attr('class', 'li-content scrollstyle')
              .attr('id', `${id2}contenter`)
              .style('height', `${height1 + (subType ? 155 : 0)}px`)
              .style('width', '100%')
              .style('margin-right', subType ? '20px' : 0)
              .append('div')
              .attr('class', 'li-items');

            /* list set */
            const list = leg.append('ul');

            /* entries set */
            const entries = list
              .selectAll('li')
              .data(data1)
              .enter()
              .append('li')
              .attr('id', (d, i) => `${id2}focusering_${i}`)
              .attr('class', 'ringli')
              .style('text-align', 'left')
              .style('background-color', subType && '#0a0d0d')
              .style('padding', subType && '7px 13px')
              .style('line-height', subType && '22px')
              .style('margin-bottom', subType ? '10px' : 0)
              .style('border-bottom', subType ? '1px solid #0a0d0d' : '1px solid #202020')
              .on('mouseover', (d, i) => {
                moveTooltip(i, 500);
                d3.select(`#${id2}focusering_${i}`).style(
                  'border',
                  subType ? '1px solid #6f9aff' : 'none',
                )
                  .style(
                    'background-color',
                    subType ? '#0a0d0d' : null,
                  );
              })
              .on('mouseout', (d, i) => {
                outTooltip(i);
                d3.select(`#${id2}focusering_${i}`).style(
                  'background-color',
                  subType ? '#0a0d0d' : null,
                )
                  .style(
                    'border',
                    subType ? '1px solid #0a0d0d' : 'none',
                  )
                  .style(
                    'border-bottom',
                    subType ? 'none' : '1px solid #202020',
                  );
              });
            /* test set */
            const test = entries.append('span')
              .style('display', chartType === 'customDash' ? 'flex' : 'inline-flex')
              .style('width', `calc(100% - ${chartType === 'customDash' ? 0 : subType === 'attributeAnalysis' ? 75 : 35}px)`)
              .style('justify-content', chartType === 'customDash' ? 'space-between' : 'initial');
            test
              .append('span')
              .html('&#9679;')
              .style('font-size', '18px')
              .style('color', (d, i) => color1(i));

            test
              .append('span')
              .style('margin-left', '12px')
              .classed('underline', true)
              .style('font-size', '11px')
              .style('text-transform', 'capitalize')
              .style('line-height', chartType === 'customDash' ? '25px' : 'initial')
              .style('text-overflow', 'ellipsis')
              .style('white-space', 'nowrap')
              .style('overflow', 'hidden')
              .style('width', '100%')
              .style('margin-top', chartType === 'customDash' ? '3.5px' : '6px')
              .style('display', chartType === 'customDash' ? 'inline-block' : 'block')
              .style('cursor', type === 'home' ? 'pointer' : '')
              .html((d) => `${capitalizeText(d.key)}`)
              .on('click', (params) => (type === 'home' ? navigateIncident(params.key) : null))
              .on('mouseout', () => toolOut())
              .on('mousemove', (d) => {
                const rightSpace = document.body.clientWidth - d3.event.pageX;
                const PageX = d3.event.pageX + 3;
                const toolwidth = document.getElementById('HDS_Tooltip')?.clientWidth;
                toolMove({
                  key: d.key,
                  value: d.value,
                  x: rightSpace < toolwidth ? PageX - toolwidth : PageX,
                  y: d3.event.pageY + 10,
                  tool: rightSpace < toolwidth ? 'right' : 'left',
                });
              });

            /* mainEntries set */
            const mainEntries = chartType === 'customDash' ? test : entries;
            mainEntries
              .append('span')
              .style('margin-top', chartType === 'customDash' ? '5px' : '4px')
              .style('width', chartType === 'customDash' ? '25px' : 'auto')
              .style('text-align', chartType === 'customDash' ? 'end' : 'unset')
              .style('float', subType ? 'unset' : 'right')
              .style('font-size', '13px')
              .style('color', (d, i) => color1(i))
              .html((d) => (subType ? ` (${d.value})` : `${d.value}`));

            /* if subType is true, set entries */
            if (subType) {
              entries
                .append('span')
                .attr('class', 'd-flex align-self-end')
                .style('width', '20px')
                .style('cursor', 'pointer')
                .style('float', 'right')
                .style('background', '#16191a')
                .style('height', '20px')
                .style('margin-top', '3px')
                .style('padding-top', '5px')
                .style('margin-left', '5px')
                .on('click', (b) => attributePlusMinus(b, '!eq'))
                .html(`<svg id="nodeSvgMinusIcon" height="20" width="20" viewBox="0 0 45 85">
              <g>
                <path fill="#7F7F7F" d="M33.1,34.4v-3.2H50v3.2H33.1z"/>
                <g>
                  <g>
                    <path fill="#7F7F7F" fillRule:"evenodd" clipRule:"evenodd" d="M40.9,3.2c-1-1.7-3-2.8-5.2-2.8H5.9c-2.2,0-4.2,1.1-5.2,2.8c-1,1.7-0.9,3.8,0.4,5.4l16.8,21.2v9.6     c0,1.4,1.3,2.6,2.9,2.6s2.9-1.2,2.9-2.6v-9.6L40.5,8.5C41.7,7,41.9,4.9,40.9,3.2L40.9,3.2L40.9,3.2z M20.8,24.4L5.8,5.6l29.8,0     L20.8,24.4z"/>
                  </g>
                </g>
              </g>
              </svg>`);

              entries
                .append('span')
                .attr('class', 'd-flex align-self-end')
                .style('width', '20px')
                .style('cursor', 'pointer')
                .style('float', 'right')
                .style('background', '#16191a')
                .style('height', '20px')
                .style('margin-top', '3px')
                .style('padding-top', '5px')
                .on('click', (b) => attributePlusMinus(b, 'eq'))
                .html(`<svg id="nodeSvgPlusIcon" width="20" height="20" viewBox="0 0 45 85">
              <g>
                <path fill="#7F7F7F" d="M43.2,30.6H50v2.3h-6.8v7h-2.3v-7h-6.7v-2.3h6.7v-7h2.3V30.6z"/>
                <g>
                  <g>
                    <path fill="#7F7F7F" fillRule:"evenodd" clipRule:"evenodd" d="M41.6,2.8c-1-1.8-3.1-2.9-5.3-2.8H6C3.7,0,1.7,1.1,0.7,2.8c-1,1.7-0.9,3.9,0.4,5.5l17.1,21.6v9.7     c0,1.5,1.3,2.6,3,2.6c1.6,0,3-1.2,3-2.6v-9.7L41.2,8.3C42.5,6.7,42.7,4.6,41.6,2.8L41.6,2.8L41.6,2.8z M21.1,24.5L6,5.3l30.4,0     L21.1,24.5z"/>
                  </g>
                </g>
              </g>
              </svg>`);
            }
          };
          /* legendField function */
          legendField(height - 100, data, content, color, id);
        }
      } else if (element) {
        /* if element is not empty, set innerHTML to noDataSet */
        element.innerHTML = noDataSet(id);
      }
    }, 200);
  };

  /* chart function */
  chart();

  /* useEffect hooks */
  useEffect(() => {
    chart();
    window.addEventListener('resize', chart);
    window.addEventListener('mouseout', () => toolOut());
    return () => {
      toolOut();
      window.removeEventListener('resize', chart);
    };
  }, [data]);

  /* if redirect is true, return redirect */
  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: '/zeronsec/incidents/Timeline',
          search: encodeURIComponent(`status:${redirect}`),
        }}
      />
    );
  }

  /* return null */
  return null;
};

/* propTypes */
RingChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  type: PropTypes.string,
  subType: PropTypes.string,
  chartType: PropTypes.string,
  incidentFilter: PropTypes.oneOfType([PropTypes.array]),
  setIncidentFilter: PropTypes.func,
};

/* defaultProps */
RingChart.defaultProps = {
  id: null,
  data: [],
  type: null,
  subType: null,
  chartType: null,
  incidentFilter: [],
  setIncidentFilter: null,
};

export default RingChart;
