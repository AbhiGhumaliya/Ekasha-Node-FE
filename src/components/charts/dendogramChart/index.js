import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { noDataSet, toolMove, toolOut } from '../lib/utils';
import '../lib/style.css';

const Dendogram = (props) => {
  const [loading, setLoading] = useState(false);
  const colorStatic = [
    '#38A6FC',
    '#3CF9DF',
    '#FB6D89',
    '#EC9CE3',
    '#5380BE',
    '#015E7B',
    '#183F81',
    '#FC577B',
    '#FF8273',
    '#1892F8',
  ];
  const gradientStatic = [
    '#ADDDFE',
    '#4F8CFA',
    '#FED3A8',
    '#656BF4',
    '#7720F5',
    '#0084AD',
    '#5650D3',
    '#EE2F23',
    '#FD6982',
    '#1892F8',
  ];

  const createchart = () => {
    const element = document.getElementById(`${props.id}`);
    if (element !== null) {
      element.innerHTML = '';
    }
    const dfd = document.getElementById(props.id);
    const h = dfd ? dfd.clientHeight : 0;
    const w = dfd ? dfd.clientWidth : 0;

    const margin = {
      top: 10, left: 20, right: 25, bottom: 10,
    };
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;

    const svg = d3
      .select(`#${props.id}`)
      .append('svg')
      .on('mouseout', toolOut)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const color = d3.scaleOrdinal(colorStatic);
    const gradientc = d3.scaleOrdinal(gradientStatic);
    const data2 = props.data[0];

    const cluster = d3.cluster().size([height, width]);

    const root = d3.hierarchy(data2, (d) => d.children);
    cluster(root);

    function elbow(d) {
      return (
        `M${d.source.y
        },${d.source.x
        }V${d.target.x
        }H${d.target.y}`
      );
    }
    svg
      .selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr('id', (d, i) => `path${i}`)
      .attr('d', elbow)
      .attr('fill', 'none')
      .attr('stroke', '#535960');

    const node = svg
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('dy', '.4em')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);
    function mouseover(d) {
      const rightSpace = document.body.clientWidth - d3.event.pageX;
      const PageX = d3.event.pageX + 3;
      toolMove({
        key: d.data.key,
        value: d.data.value,
        x: rightSpace < 100 ? PageX - 90 : PageX,
        y: d3.event.pageY + 10,
        tool: rightSpace < 100 ? 'right' : 'left',
      });
      d3.select(this).attr('r', 10);
    }
    function mousemove(d) {
      const rightSpace = document.body.clientWidth - d3.event.pageX;
      const PageX = d3.event.pageX + 3;
      toolMove({
        key: d.data.key,
        value: d.data.value,
        x: rightSpace < 100 ? PageX - 90 : PageX,
        y: d3.event.pageY + 10,
        tool: rightSpace < 100 ? 'right' : 'left',
      });
      d3.select(this).attr('r', 10);
    }
    function toolOut2() {
      d3.select(this).attr('r', 7);
      toolOut();
    }
    node
      .append('circle')
      .attr('r', 7)
      .style('fill', (el) => `url(#${props.id}gradent-${el.data.colname})`)
      .attr('class', 'DendoCircle')
      .attr('id', (d, i) => `select${i}`)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', toolOut2);

    node
      .append('text')
      .attr('dx', '-20')
      .attr('dy', '-15')
      .attr('class', 'DendoText')
      .text((d) => d.data.key);

    const bgGradient = svg
      .append('g')
      .selectAll('linearGradient')
      .data(root.descendants())
      .enter()
      .append('linearGradient')
      .attr('id', (d) => `${props.id}gradent-${d.data.colname}`)
      .attr('gradientTransform', () => `rotate(${90})`);

    bgGradient
      .append('stop')
      .attr('stop-color', (d, i) => d3.rgb(color(i)))
      .attr('offset', '0%');
    bgGradient
      .append('stop')
      .attr('stop-color', (d, i) => d3.rgb(gradientc(i)))
      .attr('offset', '100%');
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 100);
    if (loading === true) {
      setLoading(false);
    }
    const conId = `${props.id}_cc`;
    const el = document.getElementById(conId);
    if (el !== null) {
      el.innerHTML = '';
    }
    if (props.data !== undefined && Array.isArray(props.data) && props.data.length > 0) {
      if (Object.entries(props.data[0]).length !== 0) {
        if (el !== null) {
          el.innerHTML = noDataSet(props.id);
        }
      } else if (el !== null) {
        el.innerHTML = noDataSet(props.id);
      }
    }
    window.addEventListener('resize', createchart);
    return () => {
      toolOut();
      window.removeEventListener('resize', createchart);
    };
  }, []);

  createchart();

  return <></>;
};
Dendogram.propTypes = {
  id: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array]),
};

Dendogram.defaultProps = {
  id: '',
  data: [],
};

export default Dendogram;
