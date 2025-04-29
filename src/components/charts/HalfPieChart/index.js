import { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {
  noDataSet, arcGradient, arcLegend, toolMove, toolOut,
  sizeChart,
} from '../lib/utils';
import '../lib/style.css';

let animation = false;
const HalfPie = (props) => {
  const { id, data } = props;

  setTimeout(() => {
    animation = false;
  }, 2000);

  const chart = () => {
    const color = ['#3d9b99', '#FBBF45', '#1EB6F9', '#7C34F2', '#47E4C1', '#A4CEE5', '#0577CC', '#2ABF6C', '#8D6FF5', '#4500A9', '#0C4EA3', '#2952FF', '#A62CB2', '#7720F5'];
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data && data.length > 0) {
        const dataSet = [...data];
        const size = sizeChart(id);
        if (size.h > 0 && size.w > 0) {
          const margin = {
            top: 5, right: 5, bottom: 5, left: 5,
          };
          const width = size.w - margin.right - margin.left;
          const height = size.h / 2 - margin.top - margin.bottom;
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
              `translate(${(width + margin.left + margin.right) / 2
              },${(height + margin.bottom + margin.top) / 1.5
              })`,
            );
          const config = {
            innerRadius: 0,
            outerRadius: Math.min(width, height) / 2,
          };
          const anglesRange = 0.5 * Math.PI;
          const pie = d3
            .pie()
            .value((d) => d.value)
            .startAngle(anglesRange * -1)
            .endAngle(anglesRange);

          const PieData = pie(dataSet);

          const pieArc = d3
            .arc()
            .innerRadius(config.innerRadius)
            .outerRadius(config.outerRadius);

          const arcOver = d3
            .arc()
            .innerRadius(config.innerRadius)
            .outerRadius(config.outerRadius + 7);
          svg
            .append('g')
            .selectAll('.NewRingchart')
            .data(PieData)
            .enter()
            .append('path')
            .attr('class', 'NewRingchart')
            .attr('id', (d, i) => `${id}NewRingchart${i}`)
            .on('mousemove', (d, i) => {
              toolMove({
                key: d.data.key, value: d.data.value, x: d3.event.pageX, y: d3.event.pageY + 10,
              });
              d3.select(`#${id}NewRingchart${i}`)
                .transition()
                .duration(200)
                .attr('d', arcOver);
              d3.select(`#${id}focus_${i}`).style(
                'background-color',
                '#353a45',
              );
              const elem = document.getElementById(`${id}contenter`);
              elem.scrollTop = i * 41;
            })
            .on('mouseout', (d, i) => {
              toolOut();

              d3.select(`#${id}NewRingchart${i}`)
                .transition()
                .duration(500)
                .attr('d', pieArc);
              d3.select(`#${id}focus_${i}`).style(
                'background-color',
                null,
              );
            })
            .style('opacity', '0.8')
            .attr('fill', (d, i) => `url(#${id}grdient${i})`)
            .transition()
            .ease(d3.easeLinear)
            .duration(animation ? 2000 : 0)
            .attr('d', pieArc)
            .delay((d, i) => (animation ? i * 200 : 0));

          arcGradient(svg, PieData, id, 'grdient', colors);
          arcLegend(id, content, height, width, data, color, pieArc, arcOver);
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
};

HalfPie.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
};

HalfPie.defaultProps = {
  id: null,
  data: [],
};

export default HalfPie;
