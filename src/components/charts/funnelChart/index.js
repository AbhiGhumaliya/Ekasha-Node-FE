import { useEffect } from 'react';
import '../lib/style.css';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {
  noDataSet, toolOut, toolMove,
} from '../lib/utils';

const FunnelChart = (props) => {
  const { id, data } = props;

  const chart = () => {
    const color = [
      '#46B1E0',
      '#6ADBD8',
      '#FCD87E',
      '#FC8DA8',
      '#B49FF4',
      '#8CE5E2',
      '#BF60E2',
      '#46CCAC',
      '#ADC159',
      '#3DC18E',
      '#FFC673',
      '#33A6AF',
      '#C2FFFC',
      '#61AED8',
      '#D89CF6',
      '#8DDBCC',
      '#FFDAC7',
      '#46B1E0',
      '#EA9F92',
      '#7DD3B0',
    ];
    const gradient = [
      '#185AC9',
      '#0C7A74',
      '#AD7F0C',
      '#AD3A55',
      '#654FAA',
      '#44B2AF',
      '#A85ABC',
      '#008091',
      '#73871F',
      '#048B7E',
      '#BA8231',
      '#0C4B60',
      '#9399FF',
      '#0F4C75',
      '#916DD5',
      '#1D7AA2',
      '#E7989A',
      '#185AC9',
      '#AF452F',
      '#2D7359',
    ];
    const element = document.getElementById(id);
    setTimeout(() => {
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      const h = element ? element.clientHeight : 0;
      const w = element ? element.clientWidth : 0;
      const margin = {
        top: 10, left: 10, right: 10, bottom: 10,
      };
      const width = w - margin.left - margin.right;
      const height = h - margin.top - margin.bottom;

      const colors = d3.scaleOrdinal().range(color);
      const gradientc = d3.scaleOrdinal().range(gradient);
      if (data && data.length > 0) {
        const svg = d3.select(`#${id}`)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .on('mouseout', toolOut)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Variable For Funnel
        const curveHeight = 20;
        const bottomWidth = 1 / 3;
        const bottomPinch = 0;
        // Calculate the bottom left x position
        const bottomLeftX = (width - bottomWidth) / 2;

        // Change in x direction
        // Will be sharper if there is a pinch
        const dx = bottomPinch > 0
          ? bottomLeftX / (data.length - bottomPinch)
          : bottomLeftX / data.length;
        // Change in y direction
        // Curved chart needs reserved pixels to account for curvature
        const dy = (height - curveHeight) / data.length;

        const makePaths = () => {
          const paths = [];

          // Initialize starting positions
          let prevLeftX = 0;
          let prevRightX = width;
          let prevHeight = 0;

          // Initialize next positions
          let nextLeftX = 0;
          let nextRightX = 0;
          let nextHeight = 0;
          const middle = width / 2;
          prevHeight = 10;

          // Create the path definition for each funnel section
          // Remember to loop back to the beginning point for a closed path
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < data.length; i++) {
            // Calculate the position of next section
            nextLeftX = prevLeftX + dx;
            nextRightX = prevRightX - dx;
            nextHeight = prevHeight + dy;

            paths.push([
              // Top Bezier curve
              [prevLeftX, prevHeight, 'M'],
              [middle, prevHeight + (curveHeight - 10), 'Q'],
              [prevRightX, prevHeight, ''],
              // Right line
              [nextRightX, nextHeight, 'L'],
              // Bottom Bezier curve
              [nextRightX, nextHeight, 'M'],
              [middle, nextHeight + curveHeight, 'Q'],
              [nextLeftX, nextHeight, ''],
              // Left line
              [prevLeftX, prevHeight, 'L'],
            ]);

            // Set the next section's previous position
            prevLeftX = nextLeftX;
            prevRightX = nextRightX;
            prevHeight = nextHeight;
          } // End for
          return paths;
        };

        const drawTopOval = (svgPath, sectionPaths) => {
          const leftX = 0;
          const rightX = width;
          const centerX = width / 2;

          // Create path form top-most section
          const paths = sectionPaths[0];
          const path = `M${leftX},${paths[0][1]
          } S${centerX},${paths[1][1] + curveHeight
          } ${rightX},${paths[2][1]
          } M${rightX},10`
            + ` S${centerX},0`
            + ` ${leftX},10`;

          // // Draw top oval
          svgPath.append('path')
            .attr('fill', `url(#${id}gradient0)`)
            .attr('d', path);
        };

        const defs = svg.append('defs');
        const redGradient = defs.selectAll('gd')
          .data(data)
          .enter().append('svg:linearGradient')
          .attr('id', (d, i) => `${id}gradient${i}`)
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '0%')
          .attr('y2', '100%')
          .attr('spreadMethod', 'pad');

        redGradient.append('svg:stop')
          .attr('offset', '0%')
          .attr('stop-color', (d, i) => colors(i))
          .attr('stop-opacity', 1);

        redGradient.append('svg:stop')
          .attr('offset', '100%')
          .attr('stop-color', (d, i) => gradientc(i))
          .attr('stop-opacity', 1);

        const sectionPaths = makePaths();

        drawTopOval(svg, sectionPaths);

        // Add each block section
        // eslint-disable-next-line no-plusplus
        for (let i = (sectionPaths.length - 1); i >= 0; i--) {
          // Set the background color
          // let fill = color(i);
          const fill = `url(#${id}gradient${i})`;

          // Prepare data to assign to the section
          const data1 = {
            index: i,
            label: data[i].key,
            value: data[i].value,
            baseColor: gradient[i],
            fill,
          };

          // Construct path string
          const paths = sectionPaths[i];
          let pathStr = '';
          let path = [];

          // Iterate through each point

          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < paths.length; j++) {
            path = paths[j];
            pathStr += `${path[2] + path[0]},${path[1]} `;
          } // End for//

          // Draw the sections's path and append the data
          path = svg.append('path')
            .attr('fill', fill)
            .attr('d', pathStr)
            .style('cursor', 'pointer')
            .data([data1])
            .on('mousemove', (d) => {
              const rightSpace = document.body.clientWidth - d3.event.pageX;
              const PageX = d3.event.pageX + 3;
              toolMove({
                key: d.label,
                value: d.value,
                x: rightSpace < 100 ? PageX - 90 : PageX,
                y: d3.event.pageY + 7,
                tool: rightSpace < 100 ? 'right' : 'left',
              });
            })
            .on('mouseout', () => {
              toolOut();
            });
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 200);
  };

  chart();

  useEffect(() => {
    chart();
    window.addEventListener('resize', chart);
    return () => {
      toolOut();
      window.removeEventListener('resize', chart);
    };
  }, []);

  return null;
};

FunnelChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.number,
  })),
};

FunnelChart.defaultProps = {
  id: 'funnelChart',
  data: [],
};

export default FunnelChart;
