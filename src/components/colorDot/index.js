/* eslint-disable react/prop-types */
import React from 'react';

const ColorDot = (props) => {
  const { style, type, size } = props;
  let ss;
  if (style && style !== null && style !== undefined) {
    ss = style;
  }
  const color = {
    veryLow: '#86ff4c',
    low: '#ebffa9',
    moderate: '#ffdc4c',
    medium: '#ffdc4c',
    high: '#ff804c',
    critical: '#ff4c4c',
    undefined: '#4cffed',
  };
  const style1 = {
    height: size,
    width: size,
    borderRadius: '50%',
    margin: 'auto 7px',
    backgroundColor: color[type],
    ...ss,
  };
  return (
    <div style={style1} />
  );
};

export default ColorDot;
