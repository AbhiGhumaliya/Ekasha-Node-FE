/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
import React, { useContext, useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { AppContext } from '../../../modules/pages/incidents/lib/subModule/overview/lib/context';

export const colorArray1 = ['#6BC6B4', '#80ba41', '#fedc5a', '#B2DFFB', '#f68927', '#B5FE83', '#28FFBF', '#FF9292', '#085F63', '#AFB9C8', '#CCAFAF'];

const NetworkChart = React.memo((props) => {
  const {
    id, analysisData, filterFieldData, networkChartFullScreen,
  } = props;

  const {
    analysisMainData, setAnalysisMainData,
  } = useContext(AppContext);

  const chart = () => {
    let root = analysisData.processFieldsData[0];
    // initialising hierarchical data
    root = d3.hierarchy(root);
    let i = 0;
    const colors = d3.scaleOrdinal().domain([0, 1]).range(colorArray1);

    let nodeSvg; let linkSvg; let labelBgSvg; let labelSvg; let pathSvg; let nodeEnter;
    let nodeOptions; let foreignObjectBody; let fieldListDiv;
    const mainPieElement = document.getElementById(id);
    if (mainPieElement) {
      mainPieElement.innerHTML = '';
    }
    const h = mainPieElement && mainPieElement.clientHeight && mainPieElement.clientHeight !== null
      ? mainPieElement.clientHeight
      : 0;
    const w = mainPieElement && mainPieElement.clientWidth && mainPieElement.clientWidth !== null
      ? mainPieElement.clientWidth
      : 0;

    const margin = {
      top: 5, right: 5, bottom: 5, left: 5,
    };

    const width = w - margin.right - margin.left;
    const height = h - margin.top - margin.bottom;

    const zoom = d3.zoom()
      // .scaleExtent([0.5, 5])
      .on('zoom', zoomed);

    const canvas = d3.select(`#${id}`).append('svg');

    const svg = canvas
      .attr('width', width)
      .attr('height', height)
      .attr('overflow', 'hidden')
      .attr('id', 'network_svg')
      .call(zoom)
      .on('dblclick.zoom', null)
      .on('click', () => {
        const clickEventPreventIdList = ['fieldsExpand', 'nodeSvgIcon', 'searchAggreFeild'];
        const containClass = d3.event.target.id
        && clickEventPreventIdList.includes(d3.event.target.id);
        if (containClass === false) {
          removeNodeDropDown();
        }
      })
      .append('g')
      .attr('transform', 'translate(40,0)');

    const tooltip = d3.select(`#${id}`)
      .append('div')
      .attr('class', 'textTooltip')
      .style('opacity', 0)
      .style('color', 'white')
      .style('display', 'none');

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody(-1000).distanceMax(10))
      // .force('collide', d3.forceCollide(110))
      .force('collide', d3.forceCollide().radius(120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      // .force("x", d3.forceX())
      // .force("y", d3.forceY())
      .on('tick', ticked);

    const a = svg
      .append('svg:g')
      .attr('id', 'linkGroup');
    update();
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-5 -5 10 10')
      .attr('refX', '0')
      .attr('refY', '0')
      .attr('orient', 'auto')
      .attr('markerWidth', '13')
      .attr('markerHeight', '13')
      .attr('xoverflow', 'visible')
      .append('svg:circle')
      .attr('r', 4)
      .attr('fill', '#378dc6')
      .style('stroke', 'none');
    function update() {
      const nodes = flatten(root);
      const links = root.links();

      // ----------- append link START ------------------------//

      linkSvg = a.selectAll('.link')
        .data(links, (d) => d.target.id);

      pathSvg = svg.selectAll('.edgepath')
        .data(links, (d) => d.target.id);

      labelBgSvg = svg.selectAll('.edgeTextBg')
        .data(links, (d) => d.target.id);

      labelSvg = svg.selectAll('.edgelabel')
        .data(links, (d) => d.target.id);

      linkSvg.exit().remove();
      pathSvg.exit().remove();
      labelBgSvg.exit().remove();
      labelSvg.exit().remove();

      const linkEnter = linkSvg
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('marker-start', 'url(#arrowhead)')
        .style('stroke', (d) => colors(d.target.depth))
        .style('stroke-opacity', '1')
        .style('stroke-width', '1.5');

      linkSvg = linkEnter.merge(linkSvg);

      // ----------- append link END ------------------------//

      // ----------- append Node START ------------------------//

      nodeSvg = svg.selectAll('.singleNode')
        .data(nodes, (d) => d.id);

      nodeSvg.exit().remove();

      nodeEnter = nodeSvg.enter()
        .append('g')
        .attr('class', 'singleNode')
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      nodeEnter
        .append('rect')
        .attr('rx', 10)
        .attr('height', 66)
        .attr('width', 113)
        .attr('x', -56)
        .attr('y', -33)
        .attr('fill', (d) => {
          if (d.color) {
            return d.color;
          }
          d.color = colors(d.depth);
          return colors(d.depth);
        });

      const appendDiv = nodeEnter
        .append('foreignObject')
        .attr('id', (d) => `label_${d.id}`)
        .attr('class', (d) => (d.depth === 0 ? 'rootNode rootNodeMid' : ''))
        .attr('font-size', '1px')
        .attr('font-weight', 'bold ')
        .attr('font-family', 'Neue Helvetica ')
        .attr('letter-spacing', '0.58px')
        .attr('text-anchor', 'middle')
        .attr('dy', 15)
        .attr('dx', -15)
        .style('height', '66px')
        .style('width', '113px')
        .attr('x', -56)
        .attr('y', -33)
        .append('xhtml:body')
        .style('height', '66px')
        .style('width', '113px')
        .style('background', 'transparent')
        .attr('font-size', '10px')
        .append('div')
        .attr('class', 'justify-content-around d-flex flex-column h-100')
        .style('padding', '8px 10px 0');

      appendDiv
        .append('div')
        .attr('class', 'd-flex align-self-end')
        .style('width', 'fit-content')
        .style('float', 'right')
        .style('cursor', 'pointer')
        .on('click', (b) => click(b, 'node'))
        .html(` <svg width="13" id="nodeSvgIcon" height="13" viewBox="0 0 13 13" >
        <path className="settings" id="nodeSvgIconPath" fill = "#000" fillRule = "evenodd" d = "M7.047 0c.394 0 .728.282.793.67l.152.902c.317.095.624.223.918.377l.755-.537c.135-.098.295-.15.464-.15.215 0 .416.085.568.236l.809.81c.28.277.315.714.087 1.035l-.538.752c.15.282.272.578.367.885l.912.155c.388.065.671.399.666.793v1.144c0 .394-.282.728-.67.793l-.913.152c-.093.304-.218.6-.367.885l.538.755c.228.32.19.758-.087 1.035l-.81.809c-.152.152-.353.236-.567.236-.169 0-.332-.051-.467-.15l-.752-.537c-.283.15-.579.272-.886.367l-.154.912c-.066.389-.4.671-.794.671H5.925c-.394 0-.728-.282-.793-.67l-.152-.913c-.296-.093-.584-.21-.858-.353l-.763.543c-.136.098-.296.15-.464.15-.215 0-.416-.085-.568-.237l-.81-.81c-.279-.276-.314-.714-.086-1.034l.535-.744c-.152-.282-.277-.578-.372-.882L.67 7.892C.282 7.827 0 7.492 0 7.1V5.956c0-.394.282-.728.67-.793l.902-.152c.093-.307.212-.603.361-.888L1.39 3.36c-.228-.321-.19-.759.087-1.035l.812-.81c.149-.152.353-.236.567-.236.169 0 .332.051.467.15l.747.537c.283-.152.579-.277.883-.372L5.11.671C5.176.282 5.51 0 5.904 0zm.004.731H5.908c-.035 0-.065.025-.071.06L5.642 1.94c-.025.141-.13.255-.27.293-.398.103-.781.266-1.134.478-.125.073-.282.068-.402-.016L2.9 2.027c-.01-.008-.024-.014-.04-.014-.014 0-.033.003-.052.022l-.81.81c-.024.024-.026.065-.007.092l.676.95c.084.117.092.272.019.397-.209.355-.364.741-.464 1.14-.036.141-.153.248-.296.272l-1.133.19c-.035.005-.06.035-.06.07V7.1c0 .036.025.065.06.071l1.149.196c.141.024.255.13.293.268.103.4.266.782.478 1.135.073.125.068.282-.016.402l-.668.937c-.02.03-.017.068.008.092l.81.81c.018.019.04.021.051.021.014 0 .027-.005.04-.013l.951-.677c.063-.046.139-.068.212-.068.062 0 .128.016.185.049.35.2.725.355 1.113.456.138.035.245.15.269.293l.19 1.14c.005.036.035.06.07.06H7.07c.035 0 .065-.024.071-.06l.193-1.14c.021-.141.127-.258.269-.293.399-.104.782-.261 1.138-.473.124-.073.282-.068.399.016l.942.671c.01.008.024.014.04.014.014 0 .034-.003.053-.022l.809-.81c.024-.024.027-.065.008-.092l-.67-.945c-.085-.12-.09-.274-.017-.399.212-.356.37-.739.473-1.138.035-.138.15-.244.293-.268l1.14-.19c.036-.006.06-.035.06-.07h.002V5.93c0-.036-.024-.065-.06-.071l-1.14-.193c-.142-.021-.258-.127-.294-.269-.103-.399-.26-.782-.472-1.138-.074-.125-.069-.282.016-.399l.67-.942c.02-.03.017-.068-.008-.093l-.809-.809c-.02-.02-.041-.022-.052-.022-.013 0-.027.006-.04.014l-.937.673c-.12.084-.274.09-.4.016-.363-.214-.754-.374-1.164-.477-.141-.036-.248-.153-.272-.296L7.121.79c-.005-.035-.035-.06-.07-.06zM6.5 3.693c1.548 0 2.805 1.257 2.805 2.805 0 1.547-1.257 2.805-2.805 2.805-1.547 0-2.805-1.258-2.805-2.805 0-1.548 1.258-2.805 2.805-2.805zm0 .733c-1.143 0-2.072.93-2.072 2.072 0 1.143.93 2.072 2.072 2.072 1.143 0 2.072-.929 2.072-2.072s-.929-2.072-2.072-2.072z" / >
        </svg>`);

      appendDiv
        .append('div')
        .attr('class', 'nodeLabel')
        .on('mousemove', (d) => { mouseover(d.data.name, 26 - d.data.value.toString().length - 2, 'rect', d); })
        .on('mouseout', mouseout)
        .text((d) => getText(d.data.name, 26, d));

      nodeSvg = nodeEnter.merge(nodeSvg);

      // ----------- append Node END ------------------------//

      simulation
        .nodes(nodes);
      simulation.force('link')
        .links(links);
    }
    function getText(text, size, data, rule) {
      if (!rule) {
        const countLength = data.data.value.toString().length + 2;
        if (text.length > (size - countLength)) {
          return `${text.substring(0, size - countLength)}...(${data.data.value})`;
        }
        return `${text} (${data.data.value})`;
      }
      if (text.length > size) {
        return `${text.substring(0, size)}...`;
      }
      return text;
    }

    function mouseover(text, size, type) {
      const svgElement = document.getElementById('network_svg');
      const svgRect = svgElement.getBoundingClientRect();

      const mouseX = d3.event.clientX - svgRect.left;
      const mouseY = d3.event.clientY - svgRect.top;

      const top = mouseY + (type === 'rect' ? -20 : type === 'field' ? 0 : 10);
      const left = mouseX + (type === 'rect' ? 40 : 10);
      const updatedLeft = left + 160 > svgRect.width ? left - 200 : left;

      if (text.length > size) {
        tooltip.html(text)
          .style('position', 'absolute')
          .style('left', `${updatedLeft}px`)
          .style('top', `${top}px`)
          .style('color', 'white')
          .style('opacity', 1)
          .style('display', 'block');
      }
    }

    function mouseout() {
      tooltip
        .style('opacity', 0)
        .style('display', 'none');
    }

    function getLabelLineXPosition(sourcX, targetX) {
      if (targetX > sourcX) {
        if ((sourcX + 56 > targetX - 56)) {
          return sourcX;
        }
        return sourcX + 56;
      }
      if ((sourcX - 56 < targetX + 56)) {
        return sourcX;
      }
      return sourcX - 56;
    }

    function getLabelLineYPosition(sourcX, targetX, sourcY, targetY) {
      if (targetX > sourcX) {
        if ((sourcX + 56 > targetX - 56)) {
          if (sourcY > targetY) {
            return sourcY - 33;
          }
          return sourcY + 33;
        }
        return sourcY;
      }
      if ((sourcX - 56 < targetX + 56)) {
        if (sourcY > targetY) {
          return sourcY - 33;
        }
        return sourcY + 33;
      }
      return sourcY;
    }

    function ticked() {
      // linkSvg
      //   .attr("x1", (d) => getLabelLineXPosition(d.source.x, d.target.x))
      //   .attr("y1", (d) => getLabelLineYPosition(d.source.x, d.target.x, d.source.y, d.target.y))
      //   .attr("x2", (d) => d.target.x)
      //   .attr("y2", (d) => d.target.y);
      linkSvg
        .attr('x1', (d) => getLabelLineXPosition(d.target.x, d.source.x))
        .attr('y1', (d) => getLabelLineYPosition(d.target.x, d.source.x, d.target.y, d.source.y))
        .attr('x2', (d) => d.source.x)
        .attr('y2', (d) => d.source.y);
      pathSvg.attr('d', (d) => `M ${getLabelLineXPosition(d.target.x, d.source.x)} ${getLabelLineYPosition(d.target.x, d.source.x, d.target.y, d.source.y)} L ${d.source.x} ${d.source.y}`);
      nodeSvg
        .attr('transform', (d) => {
          if (nodeOptions && nodeOptions.node().id == d.id) {
            d3.select('.forenGroup').attr('transform', `translate(${d.x}, ${d.y})`);
          }
          return `translate(${d.x}, ${d.y})`;
        });
    }

    function selectAggregation(e, d) {
      const aa = [...analysisMainData];
      aa.length = d.depth + 1;
      if (e.fieldType === 'text') {
        setAnalysisMainData([...aa, `${e.value}.keyword`]);
      } else {
        setAnalysisMainData([...aa, e.value]);
      }
      d3.selectAll('.forenGroup').remove();
    }
    function removeAggregation(d) {
      const aa = [...analysisMainData];
      aa.length = d.depth + 1;
      setAnalysisMainData([...aa]);
      d3.selectAll('.forenGroup').remove();
    }

    function appendFieldListDropdown(d) {
      if (foreignObjectBody.select('.fieldContainer').node()) {
        foreignObjectBody.select('.fieldContainer').node().remove();
        document.getElementById('fieldsExpand').style.transform = 'rotate(90deg)';
      } else {
        document.getElementById('fieldsExpand').style.transform = 'rotate(270deg)';
        const fieldContainer = foreignObjectBody
          .append('div')
          .attr('class', 'fieldContainer');
        fieldContainer.append('input')
          .attr('type', 'text')
          .attr('autocomplete', 'off')
          .attr('placeholder', 'Search here...')
          .attr('class', 'searchField')
          .attr('id', 'searchAggreFeild')
          .on('input', () => {
            renderList(d3.event.target.value, d);
          });
        fieldListDiv = fieldContainer.append('div')
          .attr('class', 'fieldList')
          .on('mousewheel', () => {
            d3.event.stopPropagation();
          });
        renderList('', d);
      }
    }
    function renderList(ss, d) {
      d3.selectAll('.field').remove();
      d3.selectAll('.fieldtype').remove();
      const fields = JSON.parse(JSON.stringify(filterFieldData));
      const filteredList = fields.filter((fiel) => {
        fiel.field = fiel.field.filter((e) => e.value.toLowerCase().includes(ss.toLowerCase()));
        return fiel.field.length > 0 && fiel;
      });

      filteredList.forEach((e) => {
        fieldListDiv
          .append('div')
          .attr('class', 'fieldtype')
          .text(e.type);
        e.field.forEach((k) => {
          const isSelected = {};
          if (k.fieldType === 'text') {
            isSelected.value = analysisMainData.includes(`${k.value}.keyword`);
          } else {
            isSelected.value = analysisMainData.includes(k.value);
          }
          fieldListDiv
            .append('div')
            .attr('class', `field ${isSelected.value ? 'selected' : ''}`)
            .on('mousemove', () => mouseover(k.name, 22, 'field'))
            .on('mouseout', mouseout)
            .on('click', () => !isSelected.value && selectAggregation(k, d))
            .text(getText(k.name, 22, null, true));
        });
      });
      const searchElem = document.getElementById('searchAggreFeild');
      if (searchElem) {
        searchElem.focus();
      }
    }
    function removeNodeDropDown() {
      d3.selectAll('.forenGroup').remove();
    }

    function onClickNodeOptions(type, d) {
      if (type === 'Field') {
        appendFieldListDropdown(d);
      } else {
        if (type === 'Show child') {
          d.children = d._children;
          d._children = null;
          update();
          simulation.restart();
        }
        if (type === 'Hide child') {
          d._children = d.children;
          d.children = null;
          update();
          simulation.restart();
        }
        if (type === 'Remove child') {
          removeAggregation(d);
        }
        removeNodeDropDown();
      }
    }

    function appendNodeOptionsDropDown(data) {
      nodeOptions = svg
        .append('svg:g')
        .attr('id', data.id)
        .attr('class', 'forenGroup');

      const nodeOprionForeignObject = nodeOptions.append('foreignObject')
        .attr('class', 'nodeOptionForeign')
        .style('background', 'transparent !important')
        .style('overflow', 'visible')
        .style('width', '190px')
        .attr('x', 70)
        .attr('y', -20);

      foreignObjectBody = nodeOprionForeignObject.append('xhtml:body')
        .style('background', 'transparent')
        .append('div')
        .attr('class', 'Rectangle');

      const dropList = ['Field'];
      if (data.children || data._children !== undefined) {
        if (data.children) {
          dropList.unshift('Hide child');
          dropList.unshift('Remove child');
        } else {
          dropList.unshift('Show child');
        }
      }
      const fieldRenderHtml = (e) => `<span>${e}</span>
            <svg width='5' height='7' id="fieldsExpand" viewBox="0 0 5 7">
              <path fill="none" fillRule="evenodd" stroke="#74767e" strokeWidth=".605" d="M20 7L23.3 10.3 26.6 7" transform="rotate(-90 10.3 16.65)" />
            </svg>`;

      dropList.forEach((e) => {
        foreignObjectBody
          .append('div')
          .attr('class', 'singleProcess')
          .on('click', () => onClickNodeOptions(e, data))
          .html(e === 'Field' ? fieldRenderHtml(e) : e);
      });
    }

    function click(d) {
      d3.event.stopPropagation();
      const dropDownExist = svg.selectAll('.forenGroup').node();
      if (dropDownExist) {
        removeNodeDropDown();
        if (dropDownExist.id != d.id) {
          appendNodeOptionsDropDown(d);
        }
      } else {
        appendNodeOptionsDropDown(d);
      }
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = undefined;
      d.fy = undefined;
    }
    function zoomed() {
      svg.attr('transform', d3.event.transform);
      const rootNode = d3.selectAll('.rootNode');
      if (d3.event.transform.k > 0.99) {
        rootNode.attr('class', null);
        rootNode.attr('class', 'rootNode rootNodeLow');
      } else if (d3.event.transform.k > 0.50) {
        rootNode.attr('class', null);
        rootNode.attr('class', 'rootNode rootNodeMid');
      } else {
        rootNode.attr('class', null);
        rootNode.attr('class', 'rootNode rootNodeHigh');
      }
    }
    function zoomInClick() {
      // Smooth zooming
      zoom.scaleBy(canvas.transition().duration(100), 1.3);
    }
    function zoomOutClick() {
      // Ordinal zooming
      zoom.scaleBy(canvas.transition().duration(100), 1 / 1.3);
    }
    function zoomResetClick() {
      canvas.transition().duration(100).call(zoom.transform, d3.zoomIdentity);
    }

    d3.select('#zoom-in').on('click', zoomInClick);
    d3.select('#zoom-out').on('click', zoomOutClick);
    d3.select('#zoom-reset').on('click', zoomResetClick);

    function flatten(rootTree) {
      // hierarchical data to flat data for force layout
      const nodes = [];
      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        // eslint-disable-next-line no-plusplus
        if (!node.id) node.id = ++i;
        // eslint-disable-next-line no-plusplus
        else ++i;
        nodes.push(node);
      }
      recurse(rootTree);
      return nodes;
    }
  };

  let doit;
  function resizedw() {
    chart();
  }
  window.onresize = function () {
    clearTimeout(doit);
    doit = setTimeout(() => {
      resizedw();
    }, 500);
  };

  useEffect(() => {
    if (filterFieldData) {
      setTimeout(() => {
        chart();
        window.addEventListener('resize', chart, false);
      }, 500);
    }
  }, [networkChartFullScreen, filterFieldData, analysisData]);
  return null;
});

NetworkChart.propTypes = {
  id: PropTypes.string,
  analysisData: PropTypes.oneOfType([PropTypes.object]),
  filterFieldData: PropTypes.oneOfType([PropTypes.object]),
  networkChartFullScreen: PropTypes.bool,
};

NetworkChart.defaultProps = {
  id: 'networkChart',
  analysisData: {},
  filterFieldData: {},
  networkChartFullScreen: false,
};

export default NetworkChart;
