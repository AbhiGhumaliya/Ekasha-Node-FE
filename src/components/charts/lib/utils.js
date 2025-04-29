/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
import * as d3 from 'd3';

export const makeyGridlines = (y) => d3.axisLeft(y);
export const makexGridline = (x) => d3.axisBottom(x);
export const wrap2 = (text) => {
  text.each(function () {
    const text = d3.select(this);
    const words = text.text();
    d3.select(text.parentNode).attr('id', 'true');
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy'));
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', 0)
      .attr('y', y)
      .attr('dy', `${dy}em`);
    if (words.length > 8) {
      const tx1 = `${words.substring(0, 8)}..`;
      tspan.text(tx1);
      tspan = tx1;
    } else {
      tspan.text(words);
    }
  });
};
export const overflowTest = (text) => {
  text.each(function (c, i) {
    const text = d3.select(this);
    text
      .text(null)
      .append('foreignObject')
      .attr('class', 'foreignObject')
      .attr('width', 480)
      .attr('height', 500)
      .append('xhtml:body')
      .attr('class', 'bodyBar')
      .html(`<div class="textover">${c}</div>`);
  });
};
export const createGradient = (element, id, colors, position) => {
  const redRradient = element
    .append('svg:linearGradient')
    .attr('id', `${id}gradient`)
    .attr('x1', position.x1)
    .attr('y1', position.y1)
    .attr('x2', position.x2)
    .attr('y2', position.y2)
    .attr('spreadMethod', 'pad');

  redRradient
    .append('svg:stop')
    .attr('offset', '30%')
    .attr('stop-color', (d, i) => d3.rgb(colors(i)).brighter(0.8))
    .attr('stop-opacity', 1);

  redRradient
    .append('svg:stop')
    .attr('offset', '100%')
    .attr('stop-color', (d, i) => d3.rgb(colors(i)))
    .attr('stop-opacity', 1);
};
export const arcGradient = (tag, data, id, startId, colors) => {
  const bgGradient = tag
    .append('g')
    .selectAll('linearGradient')
    .data(data)
    .enter()
    .append('linearGradient')
    .attr('id', (d, i) => `${id}${startId}${i}`)
    .attr('gradientTransform', () => `rotate(${90})`);

  bgGradient
    .append('stop')
    .attr('stop-color', (d, i) => d3.rgb(colors(i)).brighter(1))
    .attr('offset', '0%');

  bgGradient
    .append('stop')
    .attr('stop-color', (d, i) => colors(i))
    .attr('offset', '50%');
  bgGradient
    .append('stop')
    .attr('stop-color', (d, i) => d3.rgb(colors(i)).darker(0.5))
    .attr('offset', '100%');
};
export const arcLegend = (
  id,
  content,
  height,
  width,
  data,
  color,
  pieArc,
  arcOver,
) => {
  const colors = d3.scaleOrdinal().range(color);
  const leg = content
    .append('div')
    .attr('class', 'li-content scrollstyle')
    .attr('id', `${id}contenter`)
    .style('height', `${height}px`)
    .style('width', `${width}px`)
    .append('div')
    .attr('class', 'li-items');

  const list = leg.append('ul');
  const entries = list
    .selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .attr('id', (d, i) => `${id}focus_${i}`)
    .attr('class', 'ringli')
    .style('text-align', 'left')
    .on('mouseover', (d, i) => {
      d3.select(`#${id}NewRingchart${i}`)
        .transition()
        .duration(500)
        .attr('d', arcOver);
    })
    .on('mouseout', (d, i) => {
      d3.select(`#${id}NewRingchart${i}`)
        .transition()
        .duration(500)
        .attr('d', pieArc);
      d3.select(`#${id}focus_${i}`).style('background-color', null);
    });

  const test = entries.append('span')
    .style('width', 'calc(100% - 30px)')
    .style('display', 'inline-flex')
    .style('align-items', 'center');
  test
    .append('span')
    .html('&#9679;')
    .style('font-size', '18px')
    .style('color', (d, i) => colors(i));

  test
    .append('span')
    .style('margin-left', '12px')
    .style('font-size', '11px')
    .style('text-transform', 'capitalize')
    .style('overflow', 'hidden')
    .style('text-overflow', 'ellipsis')
    .style('white-space', 'nowrap')
    .html((d) => `${d.key}`);
  entries
    .append('span')
    .style('margin-top', '4px')
    .style('float', 'right')
    .style('font-size', '13px')
    .style('color', (d, i) => colors(i))
    .html((d) => `${d.value}`);
};
const divTool = d3.select('#HDS_Tooltip');
export const toolMove = (props) => {
  const {
    key, value, x, y, time, type, tool,
  } = props;
  const toolConverter = (value) => {
    if (type === 'day') {
      if (time === 'minute') {
        return value * 1440;
      }
      if (time === 'hour') {
        return value * 24;
      }
      return value;
    }
    if (type === 'hour') {
      if (time === 'minute') {
        return value * 60;
      }
      return value;
    }
    return value;
  };
  divTool
    .style('display', 'block')
    .style('width', 'fit-content')
    .style('max-width', '400px')
    .style('border-top-left-radius', tool === 'right' ? '25px' : '0px')
    .style('border-top-right-radius', tool === 'right' ? '0px' : '25px')
    .html(`${key} : ${toolConverter(value)}${time ? time.charAt(0) : ''}`)
    .style('top', `${y}px`)
    .style('left', `${x}px`)
    .style('z-index', '99999999');
};
export const toolOut = () => {
  divTool.style('display', 'none');
};
const Nodata = `
<div class="nodatas">
<span class='nodatasSvg'>
<svg width="42" height="39" viewBox="0 0 42 39">
<path fill="#363A3E" fillRule="evenodd" d="M1.917 22.254l3.879-1.066.223.8 3.924-1.065.446 1.555 9.897-2.666v7.062l-7.266 11.15 1.515.976 6.599-10.217L27.733 39l1.515-.977-7.222-11.149v-7.551l9.586-2.577.268 1.065L42 16.612 37.451 0l-9.317 4.086.268 1.066-21.223 5.73.446 1.556L3.7 13.503l.223.8L0 15.368l1.917 6.886zM36.293 2.443l3.433 12.615-6.51.8-2.942-10.75 6.019-2.665zM28.891 6.84l2.23 8.172-19.53 5.33-2.228-8.172L28.89 6.84zm-20.82 7.33l1.382 5.062-2.229.622-1.383-5.063 2.23-.622zM4.37 16.034l.937 3.465-2.14.578-.981-3.466 2.184-.577z" opacity=".507"/>
</svg>
<span>
<div class='nodatasText' style='color:#363A3E;'>Nothing to see here!</div>
<div>
`;
export const noDataSet = (props) => {
  const element = d3.select(`#${props}`);
  if (Nodata) {
    return element.innerHTML = Nodata;
  }
  return element.innerHTML = '<span class="nodatas">No data...</span>';
};

export const sizeChart = (props) => {
  const size = document.getElementById(props);
  let h; let
    w;
  if (size && size.clientWidth && size.clientHeight !== null) {
    h = size.clientHeight;
    w = size.clientWidth;
  }
  return { h, w };
};
