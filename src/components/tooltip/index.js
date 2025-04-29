/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import TooltipWrapper from './styles';

const ZsTooltip = (props) => {
  const {
    ids, autoRight, title, titleStartText, titleEndText, highlightedText, description, subType, autoWidth,
    children, type, Types, IncidentID, interval, updateStatus, ...rest
  } = props;

  const TooltipDiv = document.getElementById('HDS_Model_Tooltip');
  const TooltipRawContent = `<div>
  ${type === 'Dashboard' ? (
    `<div style="padding: 8px;">
      <div style="display: flex;">
        <div style="width: ${Types ? '130px' : subType !== 'Incidents' ? '80px' : '150px'}">
          Name :
        </div>
        <div style="margin-left: 10px; width: 100%; word-break: break-all;">
          ${title}
        </div>
      </div>
      ${subType === 'Incidents' ? (
      `${Types ? (
        `<div style="display: flex; margin-top: 8px;">
          <div style="width: ${Types ? '130px' : '150px'};">
            Type :
          </div>
          <div style="margin-left: 10px; width: 100%; word-break: break-all;">
            ${Types}
          </div>
        </div>`
      ) : ''}
          <div style="display: flex; margin-top: 8px;">
            <div style="width: ${Types ? '130px' : '150px'};">
              ${interval ? 'Interval :' : 'Incident ID :'}
            </div>
            <div style="margin-left: 10px; width: 100%; word-break: break-all;">
              ${interval || IncidentID}
            </div>
          </div>
          <div style="display: flex; margin-top: 8px;">
            <div style="width: ${Types ? '130px' : '150px'};">
              Description :
            </div>
            <div style="margin-left: 10px; width: 100%; word-break: break-all; ">
              ${description || '-'}
            </div>
          </div>`
    ) : ''}
    </div>`
  ) : (subType === 'User'
    ? `<pre>${title.join('\n')}</pre>`
    : subType === 'notification' ? (
      `<span>
        ${titleStartText}
      <span class="highLight">
        ${highlightedText}
      </span>${titleEndText}</span>`
    ) : title)}
  </div>`;

  const showTooltip = (event) => {
    if (TooltipDiv) {
      if (autoRight) {
        const rightSpace = document.body.clientWidth - event.pageX;
        const isBottomOverflow = document.body.clientHeight < (event.pageY + TooltipDiv.clientHeight + 20);
        TooltipDiv.style.width = ((title && title.length > 65))
        || (description && description.length > 65)
          ? title.length >= 1000 && title.length <= 1500 ? '550px' : title.length > 1500 ? '650px' : '400px'
          : 'auto';
        TooltipDiv.style.whiteSpace = 'normal';
        TooltipDiv.style.wordBreak = 'break-all';
        const totalLengthText = title?.length >= 1000 && title?.length <= 1500 ? 550 : title?.length > 1500 ? 650 : ((title?.length > 65 && title?.length < 1000) || (description?.length > 65 && description?.length < 1000)) ? 400 : TooltipDiv.clientWidth;
        if (rightSpace < (totalLengthText || 400)) {
          const isRight = document.body.clientWidth < event.pageX + TooltipDiv.clientWidth + 20;
          if (subType && subType === 'iconTool') {
            TooltipDiv.style.whiteSpace = 'nowrap';
            TooltipDiv.style.borderRadius = isRight ? '15px 0 15px 15px' : '0 15px 15px 15px';
            TooltipDiv.style.transform = `translate(${event.pageX - TooltipDiv.offsetLeft - (isRight ? TooltipDiv.clientWidth : 0)}px,${event.pageY - TooltipDiv.offsetTop + (isBottomOverflow ? -TooltipDiv.clientHeight : 15)}px)`;
          } else if (subType === 'User') {
            TooltipDiv.style.borderRadius = isRight ? '15px 0 15px 15px' : '0 15px 15px 15px';
            TooltipDiv.style.transform = `translate(${event.pageX - TooltipDiv.offsetLeft - TooltipDiv.clientWidth}px,${event.pageY - TooltipDiv.offsetTop + 15}px)`;
          } else {
            TooltipDiv.style.borderRadius = isRight ? '15px 0 15px 15px' : '0 15px 15px 15px';
            TooltipDiv.style.transform = `translate(${event.pageX - TooltipDiv.offsetLeft - (isRight && TooltipDiv.clientWidth <= totalLengthText ? TooltipDiv.clientWidth : 0)}px,${event.pageY - TooltipDiv.offsetTop + 15}px)`;
          }
        } else if (isBottomOverflow) {
          TooltipDiv.style.borderRadius = '15px 15px 15px 0';
          TooltipDiv.style.transform = `translate(${event.pageX - TooltipDiv.offsetLeft + 5}px,${event.pageY - TooltipDiv.offsetTop - TooltipDiv.clientHeight}px)`;
        } else {
          TooltipDiv.style.borderRadius = '0 15px 15px 15px';
          TooltipDiv.style.transform = `translate(${event.pageX - TooltipDiv.offsetLeft + 5}px,${event.pageY - (TooltipDiv.offsetTop || 50) + 15}px)`;
        }
      } else {
        TooltipDiv.style.borderRadius = '0 15px 15px 15px';
        TooltipDiv.style.width = 'auto';
        TooltipDiv.style.transform = `translate(${event.pageX - TooltipDiv.offsetLeft + 5}px,${event.pageY - TooltipDiv.offsetTop + 15}px)`;
      }
      TooltipDiv.style.display = 'block';
      if (ids) {
        if (type === 'LineClapToolTip') {
          const isTextOverflowing = document.getElementById(ids).scrollHeight > document.getElementById(ids).clientHeight;
          if (isTextOverflowing) {
            TooltipDiv.style.display = 'block';
          } else {
            TooltipDiv.style.display = 'none';
          }
        } else if (document.getElementById(ids) !== null && document.getElementById(ids).offsetWidth < document.getElementById(ids).scrollWidth) {
          TooltipDiv.style.display = 'block';
        } else {
          TooltipDiv.style.display = 'none';
        }
      }
      TooltipDiv.innerHTML = TooltipRawContent;
      TooltipDiv.style.zIndex = 999999999999;
    }
  };
  const hideTooltip = () => {
    if (TooltipDiv) {
      TooltipDiv.style.display = 'none';
    }
  };

  useEffect(() => {
    hideTooltip();
  }, [updateStatus]);

  return (
    <TooltipWrapper
      style={{ width: autoWidth === 'IncidentTableView' ? 'auto' : '100%' }}
      onBlur={hideTooltip}
      onClick={hideTooltip}
      onMouseMove={(event) => showTooltip(event, 'move')}
      onWheel={hideTooltip}
      onMouseLeave={hideTooltip}
      {...rest}
    >
      {children}
    </TooltipWrapper>
  );
};
ZsTooltip.propTypes = {
  ids: PropTypes.string,
};
ZsTooltip.defaultProps = {
  ids: '',
};

export default ZsTooltip;
