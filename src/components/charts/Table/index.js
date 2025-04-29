import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './style.css';
import { noDataSet } from '../lib/utils';

const TableChart = React.memo((props) => {
  const { id, data } = props;

  const chart = () => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data && data.length > 0) {
        const dataSet = [...data];
        const h = element && element.clientHeight && element.clientHeight !== null
          ? element.clientHeight
          : 0;
        const w = element && element.clientWidth && element.clientWidth !== null
          ? element.clientWidth
          : 0;
        if (h > 0 && w > 0) {
          const values = [];
          const allhd = [];

          dataSet.forEach((ele) => {
            const x = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const [key, value] of Object.entries(ele)) {
              if (allhd.indexOf(key) === -1) {
                allhd.push(key);
              }
              x.push(value);
            }
            values.push(x);
          });
          const content = d3
            .select(`#${id}`)
            .append('div')
            .style('overflow', 'hidden scroll')
            .style('height', '100%')
            .attr('class', 'scrollstyle')
            .attr('id', `${id}_cc`);

          const table = content
            .append('table')
            .attr('cellpadding', '8')
            .attr('class', 'TableChart');

          table
            .append('thead')
            .append('tr')
            .attr('class', 'TableHeder')
            .selectAll('th')
            .data(allhd.map((dl) => dl))
            .enter()
            .append('th')
            .html((d) => d);

          table
            .append('tbody')
            .attr('class', 'TableBody')
            .selectAll('th')
            .data(values.map((dl) => dl))
            .enter()
            .append('tr')
            .attr('class', 'TableTR')
            .selectAll('td')
            .data((d) => d)
            .enter()
            .append('td')
            .attr('class', 'TableData')
            .html((d) => d);
        }
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 0);
  };
  chart();

  useEffect(() => {
    chart();
    window.addEventListener('resize', chart);
    return () => {
      window.removeEventListener('resize', chart);
    };
  }, []);

  return null;
});

TableChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
};

TableChart.defaultProps = {
  id: '',
  data: [],
};

export default TableChart;
