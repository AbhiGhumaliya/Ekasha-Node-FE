import React from 'react';
import PropTypes from 'prop-types';

const AccordionItem = (props) => {
  const {
    isCollapsed, labelDate, handleClick, dataChildren, index, labelName, rawlogloading,
  } = props;

  const style = {
    collapsed: {
      display: 'none',
    },
    circleBgPrimary: {
      background: '#5179d9',
    },
    circleBgNormal: {
      background: '#17191b',
    },
    circleEventNone: {
      pointerEvents: 'none',
    },
    circleLoading: {
      border: '1px solid rgb(81, 121, 217)',
      borderRadius: '50%',
      borderTop: '1px solid #ffffff',
      width: '16px',
      position: 'relative',
      right: '13.6px',
      height: '16px',
      background: '#17191b',
      animation: 'circleLoading 2s linear infinite',
    },
    expanded: {
      display: 'block',
      position: 'relative',
      bottom: '15px',
    },
  };

  const setStyle = () => {
    if (!rawlogloading) {
      if (isCollapsed) {
        return style.circleBgNormal;
      }
      return style.circleBgPrimary;
    }
    if (rawlogloading && !isCollapsed) {
      return style.circleLoading;
    }
    if (rawlogloading && isCollapsed) {
      return style.circleEventNone;
    }
    return style.circleBgNormal;
  };

  return (
    <div key={index} className="warpperItem">
      <div className="wrapperIHeader">
        <div id={`wrapper_labelsIcircle${index}`} onClick={() => handleClick()} className="wrapperIcircle" style={setStyle()} />
        <div className="wrapperLabel">
          <span className="WrapperIlabelDate">{labelDate}</span>
          <span className="wrapperIlabelName">{labelName}</span>
        </div>
      </div>
      <div
        style={isCollapsed ? style.collapsed : style.expanded}
        aria-expanded={isCollapsed}
      >
        {dataChildren}
      </div>
    </div>
  );
};

AccordionItem.propTypes = {
  dataChildren: PropTypes.oneOfType([PropTypes.any]),
  handleClick: PropTypes.func,
  isCollapsed: PropTypes.bool,
  rawlogloading: PropTypes.bool,
  labelDate: PropTypes.string,
  labelName: PropTypes.string,
  index: PropTypes.number,
};

AccordionItem.defaultProps = {
  dataChildren: null,
  handleClick: null,
  isCollapsed: false,
  rawlogloading: false,
  labelDate: '',
  labelName: '',
  index: 0,
};
export default AccordionItem;
