/* eslint-disable react/prop-types */
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import PropTypes from 'prop-types';

const ZsList = (props) => {
  const {
    data = [], rowHeight, Row, className, overscanCount, ...rest
  } = props;
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={className}
            height={height}
            itemCount={data.length}
            itemSize={rowHeight || 30}
            width={width}
            itemData={data}
            style={{ scrollBehavior: 'smooth' }}
            overscanCount={overscanCount || 20}
            {...rest}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

ZsList.propTypes = {
  data: PropTypes.oneOfType([PropTypes.any]),
  Row: PropTypes.oneOfType([PropTypes.any]),
  // rowHeight: PropTypes.number,
  overscanCount: PropTypes.number,
  className: PropTypes.string,
};

ZsList.defaultProps = {
  data: [],
  className: '',
  Row: <div />,
  // rowHeight: 30,
  overscanCount: 5,
};

export default ZsList;
