import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import '../lib/style.css';
import './style.css';
import { Redirect } from 'react-router-dom';
import { noDataSet } from '../lib/utils';
import { nFormatter } from '../../../helpers/envData';

let animation = false;
const HorzontalBarHomeChart = React.memo((props) => {
  const {
    id, data, type, kpiStatus,
  } = props;
  const dd = [
    {
      key: 'Low',
      value: 0,
      color: 'rgb(113, 191, 70, .6)',
      gradient: 'rgb(113, 191, 70, .6)',
    },
    {
      key: 'High',
      value: 0,
      color: 'rgb(243, 109, 68, .6)',
      gradient: 'rgb(243, 109, 68, .6)',
    },
    {
      key: 'Moderate',
      value: 0,
      color: 'rgb(250, 191, 19, .6)',
      gradient: 'rgb(250, 191, 19, .6)',
    },
    {
      key: 'Medium',
      value: 0,
      color: 'rgb(250, 191, 19, .6)',
      gradient: 'rgb(250, 191, 19, .6)',
    },
    {
      key: 'Critical',
      value: 0,
      color: 'rgb(237, 30, 43,.6)',
      gradient: 'rgb(237, 30, 43,.6)',
    },
  ];
  const dataArrayKeys = data.map((item) => item.key);
  const differences = kpiStatus ? dd.filter((item) => !dataArrayKeys.includes(item.key)) : [];

  const data1 = [...data, ...differences];

  const [redirect, setRedirect] = useState(false);
  const [Filter, setFilter] = useState(null);

  const onClick = (d) => {
    setRedirect(true);
    setFilter(d);
  };
  setTimeout(() => {
    animation = false;
  }, 2000);

  const chart = () => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element && element.innerHTML !== '') {
        element.innerHTML = '';
      }
      if (data1 && data.length > 0) {
        const dataSet = [...data1];
        dataSet.forEach((ele, i) => {
          switch (ele.key) {
            case 'Critical':
              ele.color = kpiStatus ? 'rgb(237, 30, 43,.6)' : '#FF565A';
              ele.gradient = kpiStatus ? 'rgb(237, 30, 43,.6)' : '#ED1F24';
              break;
            case 'High':
              ele.color = kpiStatus ? 'rgb(243, 109, 68, .6)' : '#F47F4E';
              ele.gradient = kpiStatus ? 'rgb(243, 109, 68, .6)' : '#FC682B';
              break;
            case 'Low':
              ele.color = kpiStatus ? 'rgb(113, 191, 70, .6)' : '#E9EEA9';
              ele.gradient = kpiStatus ? 'rgb(113, 191, 70, .6)' : '#FFFF73';
              break;
            case 'Moderate':
              ele.color = kpiStatus ? 'rgb(250, 191, 19, .6)' : '#FFE579';
              ele.gradient = kpiStatus ? 'rgb(250, 191, 19, .6)' : '#FFD217';
              break;
            case 'Medium':
              ele.color = kpiStatus ? 'rgb(250, 191, 19, .6)' : '#FFE579';
              ele.gradient = kpiStatus ? 'rgb(250, 191, 19, .6)' : '#FFD217';
              break;
            case 'undefined':
              ele.color = '#4cffed';
              ele.gradient = '#29ffe9';
              break;
            default:
              data.splice(i, 1);
              break;
          }
        });
        data1.sort((a, b) => b.key - a.key);
        let total = 0;
        data1.forEach((ele) => {
          total += ele.value;
        });
        const content = d3
          .select(`#${id}`)
          .append('div')
          .attr('id', `${id}_cc`)
          .style('height', '100%')
          .style('overflow', kpiStatus ? 'inherit' : 'hidden');

        const leg = content
          .append('div')
          .style('width', '100%').style('height', '100%');

        if (!kpiStatus) {
          const cm = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
          const listrul = content
            .append('div')
            .attr('class', 'test')
            .style('padding', '8px 2px 0px 0px')
            .style('position', 'absolute')
            .style('top', '42px')
            .style('width', 'calc(100% - 79px)');

          listrul
            .append('ul')
            .attr('class', 'ruler')
            .selectAll('li')
            .data(cm)
            .enter()
            .append('li')
            .attr('class', 'cm');
        }

        const mainDiv = leg.append('div').attr('class', 'mainDiv').style('height', '100%').style('margin-top', '10px');
        const second = mainDiv.append('div').attr('class', 'content2');

        const list = second.append('div').attr('class', 'bar-graph')
          .style('display', kpiStatus ? 'grid' : 'block')
          .style('align-items', kpiStatus ? 'center' : 'baseline')
          .style('height', '100%');
        const entries = list
          .selectAll('div')
          .data(data1)
          .enter()
          .append('div')
          .attr('id', (d, i) => `selectli${i}`)
          .attr('class', 'liofprogress')
          .style('border-bottom', kpiStatus ? 'none' : '1px solid #282d31')
          .style('padding', kpiStatus ? '0px 0px' : '11px 0px')
          .style('height', kpiStatus ? '36px' : '65px');
        let ent;
        if (kpiStatus) {
          const divs1 = entries.append('div')
            .style('width', '100%').style('display', 'flex').style('justify-content', 'space-between')
            .style('height', '12px');
          ent = divs1;
        } else {
          ent = entries;
        }

        ent
          .append('p')
          .html((d) => `${d.key}`)
          .attr('class', 'pforhedar')
          .attr('id', (d, i) => `pforhedar${i}`)
          .style('cursor', type === 'home' ? 'pointer' : '')
          .on('click', (d) => onClick(d.key))
          .on('mouseover', (d, i) => {
            d3.select(`#pforhedar${i}`)
              .style('text-decoration', kpiStatus ? 'none' : 'underline');
          })
          .on('mouseout', (d, i) => {
            d3.select(`#pforhedar${i}`)
              .style('text-decoration', 'none');
          });

        const divs = entries.append('div').attr('class', 'bar-wrap');
        let divs2;
        if (kpiStatus) {
          const divs1 = divs.append('div').style('background', '#2D343E')
            .style('width', '100%').style('height', '6px')
            .style('border-radius', '10px')
            .style('margin-top', '8px');
          divs2 = divs1;
        } else {
          divs2 = divs;
        }
        divs2
          .append('span')
          .attr('class', 'bar-fill')
          .style('margin-bottom', kpiStatus ? '11px' : '0px')
          .style(
            'background',
            (d) => `linear-gradient(to left, ${d.color} 0%, ${d.gradient} 100%`,
          )
          .style('width', 0)
          .transition()
          .duration(animation ? 2000 : 0)
          .ease(d3.easeLinear)
          .style('width', (d) => `${(d.value * 100) / total}%`)
          .delay((d, i) => (animation ? i * 300 : 0));
        if (!kpiStatus) {
          divs
            .append('span')
            .attr('class', 'FlotingPer')
            .style('position', kpiStatus ? 'unset' : 'absolute')
            .style('width', kpiStatus ? '6%' : 'auto')
            .style('margin', (d) => ((d.value * 100) / total > 95 ? '-11px 0px 0px -47px' : null))
            .html((d) => `${d3.format('.1f')((d.value * 100) / total)}%`)
            .style('color', (d) => d.color);
        }
        ent
          .append('p')
          .html((d) => `${nFormatter(d.value)}`)
          .attr('class', 'barCounte')
          .attr('id', (d, i) => `pforhedar${i}`)
          .style('color', 'rgb(249, 152, 38)');
        // .style('margin-top', '5px');
        // ent
        //   .append('text')
        //   .text(0)
        //   .attr('class', 'barCounte')
        //   .attr('id', (d, i) => `pforhedar${i}`)
        //   .style('color', kpiStatus ? '#F99826' : (d) => d.color)
        //   .style('margin-top', kpiStatus ? '0px' : '5px')
        //   .transition()
        //   .duration(2000)
        //   .tween('text', (d) => {
        //     const interpolateValue = d3.interpolate(0, d.value);
        //     return function (t) {
        //       d3.select(this).text(nFormatter(interpolateValue(t)));
        //     };
        //   });
      } else if (element) {
        element.innerHTML = noDataSet(id);
      }
    }, 0);
  };

  chart();

  useEffect(() => {
    animation = true;
    chart();
    window.addEventListener('resize', chart);
    return () => {
      window.removeEventListener('resize', chart);
    };
  }, []);

  if (redirect === true && Filter && type === 'home') {
    return (
      <Redirect
        to={{
          pathname: '/zeronsec/incidents/Timeline',
          type: 'Severity',
          search: `severity:${Filter}`,
        }}
      />
    );
  } return null;
});

HorzontalBarHomeChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
  type: PropTypes.string,
  kpiStatus: PropTypes.bool,
};

HorzontalBarHomeChart.defaultProps = {
  id: null,
  data: [],
  type: 'home',
  kpiStatus: false,
};

export default HorzontalBarHomeChart;
