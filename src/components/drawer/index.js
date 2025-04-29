/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './style.css';

const ZsDrawer = (props) => {
  const {
    children, show, style = {}, modalClass, id, mask,
  } = props;
  const stl = {};
  if (show) {
    stl.right = '0';
    stl.width = '286px';
  } else {
    stl.right = '0';
    stl.width = '0px';
  }
  return (
    <ZsDrawerBody ids={id} {...props}>
      <div className={show && mask ? 'backmask' : ''}>
        <div id={id} className={`${modalClass} zSDrawerWrap`} style={stl}>
          <div style={style} className={show ? 'zsDrawer drawerShow' : 'zsDrawer drawerClose'}>
            <div className="zsDrawerBody">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ZsDrawerBody>
  );
};

const ZsDrawerBody = (props) => {
  const { children } = props;
  const [el, setEl] = useState(document.createElement('div'));
  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);
  return ReactDOM.createPortal(
    children,
    el,
  );
};
ZsDrawer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
  style: PropTypes.oneOfType([PropTypes.any]),
  show: PropTypes.bool,
  mask: PropTypes.bool,
  modalClass: PropTypes.string,
  id: PropTypes.string,
};

ZsDrawer.defaultProps = {
  children: null,
  style: null,
  show: false,
  mask: false,
  modalClass: null,
  id: null,
};
export default ZsDrawer;
