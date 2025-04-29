/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import Icons from '../icons';
import { NoDataWrapper } from './style';

const NoData = (props) => {
  const {
    id, message, showNew = false, opacities, size, isLink = false, ...rest
  } = props;
  return (
    <NoDataWrapper style={{
      ...props.style,
    }}
    >
      <div id={id}>
        <div style={{
          transform: 'translate(-50%, -50%)', top: '50%', left: '50%', position: 'absolute', textAlign: 'center',
        }}
        >
          <Icons icontype="common" type={size || 'noData'} />
          <div style={{
            fontSize: size ? '13px' : '14px', color: '#363a3e', opacity: '0.51', paddingTop: '3px', fontWeight: 'bold', letterSpacing: '-0.36px',
          }}
          >
            {message || 'Nothing to see here !'}
          </div>
          {showNew ? (
            <div
              {...rest}
              className="lineHover"
              style={{
                fontSize: '13.5px', color: '#007bff', paddingTop: '3px', fontWeight: 'normal', letterSpacing: '-0.36px', display: 'inline-grid', opacity: opacities,
              }}
            >
              <span style={{
                color: '#007bff', cursor: 'pointer', marginRight: '15px', marginBottom: '2px',
              }}
              >
                Add new
              </span>
              <span className="pluseIconStyle">
                +
              </span>
            </div>
          ) : null}
          {isLink ? (
            <div
              {...rest}
              style={{
                fontSize: '13.5px', paddingTop: '3px', fontWeight: 'normal', letterSpacing: '-0.36px',
              }}
            >
              <Link style={{ color: '#007bff', cursor: 'pointer', marginRight: '15px' }} target="_blank" to={{ pathname: isLink }}>Add new  </Link>
              {' '}
              <span
                className="plusButton"
                style={{
                  position: 'absolute', fontSize: '22.5px', top: '60px', right: '30px', color: '#007bff', cursor: 'default',
                }}
              >
                +
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </NoDataWrapper>
  );
};

export default NoData;
