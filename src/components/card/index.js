/* eslint-disable react/prop-types */
import { Card } from 'antd';
import React from 'react';
import { ZsCardWrapper } from './styles';

const ZsCard = (props) => {
  const {
    children, style, cardClass, headerContent,
    headerStyle, footerContent, outerStyle,
  } = props;

  return (
    <>
      <ZsCardWrapper style={outerStyle}>
        <Card
          title={headerContent ? (
            <div className="zsCardHeader" style={headerStyle}>
              {headerContent}
            </div>
          ) : ''}
          style={outerStyle}
          className={cardClass}
        >
          <div className="zsCardBody" style={style}>
            {children}
          </div>

          {footerContent ? (
            <div className="zsCardFooter">
              {footerContent}
            </div>
          ) : null}
        </Card>
      </ZsCardWrapper>
    </>
  );
};

export default ZsCard;
