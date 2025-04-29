/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './map.css';
import moment from 'moment-timezone';
import selectedLocation from './source.gif';
import { ZsSpin } from '../Spin';

const TimezoneMap = (props) => {
  const {
    selectedTimeZone, hoverCountery, selectRegion, timeZoneMapData, setData, svgHeight, svgWidth,
    newtimeZoneData,
  } = props;
  const [hoverCounteryData, setHoverCounteryData] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectRegionData, setSelectRegionData] = useState('');
  const [selectedTimeZoneData, setSelectedTimeZoneData] = useState([]);

  const setTooltip = (data) => {
    let message = 'Select timezone';
    if (data.timezoneId) {
      message = moment().tz(data.timezoneId).format('dddd, D MMMM YYYY, h:mm a');
    }
    d3.select('.Maptooltip').text(message);
  };

  const renderMap = (seleTimeZone) => {
    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [svgWidth, svgHeight]])
      .on('zoom', zoomed);

    const projection = d3.geoEquirectangular()
      .center([-8, -5]) // long and lat starting position
      .rotate([10, 0]);

    const path = d3.geoPath()
      .projection(projection);

    const svg = d3.select('#Map-container').append('svg')
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`).style('z-index', 1);
    svg.call(zoom);

    const g = svg.append('g');
    g.selectAll('path')
      .data(newtimeZoneData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('id', (d) => (d.properties.sovereignt === seleTimeZone.countryName ? `country-on-${d.properties.sovereignt}` : `country-${d.properties.sovereignt}`))
      .attr('class', demo)
      .on('mousemove', function (d) {
        d3.selectAll('.country').classed('country-on', false);
        d3.select(this).classed('country-on', true);

        d3.selectAll(`.timezoneId${d.properties.sovereignt}`).style('fill', 1);
        d3.selectAll(`.timezoneId${d.properties.sovereignt}`).classed('selectPath', true);
      })
      .on('mouseout', () => {
        d3.selectAll('.country').classed('country-on', false);
        d3.selectAll('.timezone').classed('selectPath', false);
      });
    d3.selectAll('.timezone-on').style('fill-opacity', 1);

    const locations = g.selectAll('circle')
      .data(timeZoneMapData.filter((d) => d.country !== 'UTC'))
      .enter()
      .append('circle')
      .attr('cy', (d) => (projection([d.lng, d.lat])[1] ? projection([d.lng, d.lat])[1] : 0))
      .attr('r', 1.5)
      .attr('cx', (d) => (projection([d.lng, d.lat])[0] ? projection([d.lng, d.lat])[0] : 0))
      .attr('id', (d) => (d.country === seleTimeZone.countryName ? `timezone-on${d.country}` : `timezone${d.country}`))
      .attr('class', (d) => (d.country === seleTimeZone.countryName
        ? d.city === seleTimeZone.city
          ? `timezone selectedTimezone timezoneId${d.country}`
          : `timezone timezone-on timezoneId${d.country}`
        : `timezone timezoneId${d.country}`));

    const tooltip = d3.select('#Map-container').append('div')
      .attr('class', 'tooltip tId')
      .attr('id', 'toolTipId')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('padding', '5px 10px');
    const tooltipId = document.getElementsByClassName('tId');
    locations.on('mousemove', (d) => {
      d3.select('.Maptooltip').text(moment().tz(d.timezone).format('dddd, D MMMM YYYY, h:mm a'));
      d3.selectAll(`#country-${d.country}`).classed('country-on', true);
      d3.selectAll(`.timezoneId${d.country}`).classed('selectPath', true);
      tooltip.style('opacity', 0.9)
        .style('color', '#ffffff')
        .style('z-index', 10)
        .style('display', 'block')
        .style('visibility', 'visible')
        .text(`${d.country} | ${d.city}`)
        .style('left', `${(d3.event.layerX - tooltipId[0].clientHeight) + 20}px`)
        .style('top', `${d3.event.layerY + 20}px`);
    });

    locations.on('mouseout', (d) => {
      setTooltip(seleTimeZone);
      d3.selectAll(`#country-${d.country}`).classed('country-on', false);
      d3.selectAll(`.timezoneId${d.country}`).classed('selectPath', false);
      tooltip.style('opacity', '0');
    });
    const locations1 = g.selectAll('country')
      .data(timeZoneMapData.filter((eve) => (eve.city === seleTimeZone.city && eve.city !== 'UTC')))
      .enter()
      .append('svg:image')
      .attr('xlink:href', selectedLocation)
      .attr('x', (d) => projection([d.lng, d.lat])[0] - 10.5)
      .attr('y', (d) => projection([d.lng, d.lat])[1] - 21.5)
      .attr('width', `${25}px`) // set icon size
      .attr('height', `${25}px`);

    locations1.on('mousemove', (d) => {
      d3.select('.Maptooltip').text(moment().tz(d.timezone).format('dddd, D MMMM YYYY, h:mm a'));
      d3.selectAll('.path').classed('path-on', false);
      d3.select(`#path${d.country}`).classed('path-on', true);
      d3.selectAll(`#country${d.country}`).style('fill-opacity', 1);
      d3.selectAll('.path').style('fill-opacity', 0.2);
      d3.selectAll('.path').style('stroke-opacity', 0.2);
    });

    locations1.on('mouseout', (d) => {
      d3.select('.Maptooltip').text(moment().tz(d.timezone).format('dddd, D MMMM YYYY, h:mm a'));
      d3.selectAll('.path').classed('path', true);
      d3.selectAll(`#country${d.country}`).style('fill-opacity', 0);
      d3.selectAll('.path').style('fill-opacity', 1);
      d3.selectAll('.path').style('stroke-opacity', 1);
    });

    const clickTimezone = (data) => {
      setData({ countryName: data.country, timezoneId: data.timezone, city: data.city });
    };

    locations.on('click', (data) => {
      clickTimezone(data);
    });

    function demo(d) {
      if (d.properties.sovereignt === seleTimeZone.countryName) {
        return 'country selectedCountry';
      } if (d.properties.sovereignt === hoverCounteryData) {
        return 'country countryHover';
      } if (!selectRegionData.includes('/') && !hoverCounteryData) {
        const a = timeZoneMapData.filter((e) => e.timezone.split('/')[0] === selectRegionData);
        const b = a.findIndex((e) => e.country === d.properties.sovereignt);

        if (b !== -1) {
          return 'country regionHover';
        }
        return 'country';
      }
      return 'country';
    }
    function zoomed() {
      const { transform } = d3.event;
      g.attr('transform', d3.event.transform);
      svg.attr('stroke-width', 2 / transform.k);
      locations.transition()
        .duration(500)
        .attr('r', ((1.5 / transform.k) >= 1.2 ? 1.5 : 2.5) / transform.k);

      locations1
        .transition()
        .duration(500)
        .attr('x', (d) => projection([d.lng, d.lat])[0] - (10.5 / transform.k))
        .attr('y', (d) => projection([d.lng, d.lat])[1] - (21.5 / transform.k))
        .attr('width', `${25 / transform.k}px`) // set icon size
        .attr('height', `${25 / transform.k}px`);
    }
  };

  const reRenderMap = (data) => {
    const el = document.getElementById('Map-container');

    if (el !== null) {
      el.innerHTML = '';
    }

    if (newtimeZoneData.length !== 0) {
      renderMap(data);
    }
  };

  useEffect(() => {
    setSelectedTimeZoneData(selectedTimeZone);
    setHoverCounteryData(hoverCountery);
    reRenderMap(selectedTimeZone);
    setTooltip(selectedTimeZone);
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 480);
  }, []);

  useEffect(() => {
    if (selectedTimeZone.timezoneId !== selectedTimeZoneData.timezoneId
      || hoverCounteryData !== hoverCountery || selectRegionData !== selectRegion) {
      setSelectedTimeZoneData(selectedTimeZone);
      setHoverCounteryData(hoverCountery);
      setSelectRegionData(selectRegion);
    }
    reRenderMap(selectedTimeZone);
  }, [selectRegion, hoverCountery, selectedTimeZone]);

  return (
    <div style={{ height: '100%' }}>
      <div id="mainDivContainer" style={{ height: 'calc(100% - 40px)' }}>
        <div id="Map-container" className={loading ? 'notImgMapBack' : 'imageMapBack'} style={{ height: '100%' }} />
        {loading && <ZsSpin id="AdminTimezoneLoading" />}
      </div>
      <div
        id="Map-container1"
        style={{
          height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div className="Maptooltip" />
      </div>
    </div>
  );
};
TimezoneMap.propTypes = {
  hoverCountery: PropTypes.string,
  setData: PropTypes.func,
  svgHeight: PropTypes.number,
  svgWidth: PropTypes.number,
  selectedTimeZone: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  timeZoneMapData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  selectRegion: PropTypes.string,
  newtimeZoneData: PropTypes.oneOfType([
    PropTypes.array,
  ]),
};

TimezoneMap.defaultProps = {
  hoverCountery: '',
  setData: null,
  svgHeight: 500,
  svgWidth: 1000,
  selectedTimeZone: {},
  timeZoneMapData: [],
  selectRegion: '',
  newtimeZoneData: [],
};
export default TimezoneMap;
