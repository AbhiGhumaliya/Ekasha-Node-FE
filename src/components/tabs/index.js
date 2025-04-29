/* eslint-disable func-names */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import $ from 'jquery';
import Icons from '../icons';
import { ZsTabsWrapper, ZsTabsWrapper2 } from './styles';

const { TabPane } = Tabs;
const ZsTabs = (props) => {
  const [show, setShow] = useState(false);
  const [shownext, setShownext] = useState(false);
  const [showprev, setShowPrev] = useState(false);
  const {
    children, scrollbtn, data, wrapClass, tabType, onTabClick,
    defaultSetActiveTab, setActiveTab, style, tabStyle, onChange, ...rest
  } = props;
  const id = `k${Math.random().toString(36).slice(2)}`;

  const updateDimensions = () => {
    const elmnt = document.querySelector(`#${id}`);
    if (elmnt !== null) {
      const tabsEle = elmnt.querySelector('.ant-tabs');
      const hasHorizontalScrollbar = tabsEle.scrollWidth > tabsEle.clientWidth;
      setShow(hasHorizontalScrollbar);
      if (tabsEle.scrollLeft === 0) {
        setShowPrev(false);
      }
      if (tabsEle.scrollLeft === tabsEle.scrollWidth - tabsEle.clientWidth) {
        setShownext(false);
      }
      if (tabsEle.scrollLeft > 0 && hasHorizontalScrollbar) {
        setShowPrev(true);
      } else {
        setShownext(true);
      }
    }
  };
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    $(($e) => {
      $e.fn.hScroll = function (amount) {
        amount = amount || 120;
        $e(this).bind('DOMMouseScroll mousewheel ', function (event) {
          const oEvent = event.originalEvent;
          const direction = oEvent.detail
            ? oEvent.detail * -amount
            : oEvent.wheelDelta;
          let position = $(this).scrollLeft();
          position += direction > 0 ? -amount : amount;
          $e(this).scrollLeft(position);
        });
      };
    });
    $(document).ready(() => {
      $('.ant-tabs').hScroll(15); // You can pass (optionally) scrolling amount
    });
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  });

  useEffect(() => {
    const update = {};
    const elmnt = document.querySelector(`#${id}`);
    if (elmnt !== null) {
      const tabsEle = elmnt.querySelector('.ant-tabs');
      const hasHorizontalScrollbar = tabsEle.scrollWidth > tabsEle.clientWidth;
      update.show = hasHorizontalScrollbar;
      setShow(update.show);
      if (tabsEle.scrollLeft >= 0 && hasHorizontalScrollbar) {
        update.showprev = true;
        setShowPrev(true);
      } else {
        update.shownext = true;
        setShownext(true);
      }
      // else if (tabsEle.scrollLeft === 0 && hasHorizontalScrollbar) {
      //   update.showprev = true;
      //   setShowPrev(true);
      //   update.shownext = true;
      //   setShownext(true);
      // }
    }
    return () => (Object.keys(update).length === 0 ? null : update);
  }, [id]);

  const scrollWinPrevious = () => {
    const tabsEle = document.querySelector(`#${id}`);
    const elmnt1 = tabsEle.getElementsByClassName('ant-tabs');
    elmnt1[0].scrollLeft -= 200;
    // if (elmnt1[0].scrollLeft === 0) {
    //   setShowPrev(false);
    // }
    if (elmnt1[0].scrollLeft < elmnt1[0].scrollWidth - elmnt1[0].clientWidth) {
      setShownext(true);
    } else {
      setShownext(false);
    }
  };

  const scrollWinNext = () => {
    const tabsEle = document.querySelector(`#${id}`);
    const elmnt2 = tabsEle.getElementsByClassName('ant-tabs');
    elmnt2[0].scrollLeft += 200;
    if (elmnt2[0].scrollLeft === elmnt2[0].scrollWidth - elmnt2[0].clientWidth) {
      setShownext(false);
      setShowPrev(true);
    } else if (elmnt2[0].scrollLeft < elmnt2[0].scrollWidth - elmnt2[0].clientWidth) {
      setShownext(true);
      setShowPrev(true);
    }
  };
  let TabWrap;
  if (tabType === 'box') {
    TabWrap = ZsTabsWrapper;
  } else {
    TabWrap = ZsTabsWrapper2;
  }
  return (
    <TabWrap
      className={wrapClass}
      style={tabStyle}
      id={id}
      data-test="EkashaTabs"
      onScroll={() => updateDimensions()}
    >
      {scrollbtn && show && showprev ? (
        <div className="pre" id="zsTabs_pre" onClick={() => scrollWinPrevious()}>
          <Icons icontype="globle" type="arrowLeft" className="preb btmIcn" />
        </div>
      ) : ''}
      {scrollbtn && show
        && shownext
        ? (
          <div className="next" id="zsTabs_next" onClick={() => scrollWinNext()}>
            <Icons icontype="globle" type="arrowRight" className="preb btmIcn" />
          </div>
        )
        : <div />}
      <Tabs
        id={id}
        activeKey={defaultSetActiveTab}
        onChange={onChange}
        onTabClick={onTabClick}
        // onSelect={(k) => setActiveTab(k)}
        style={{
          marginLeft: scrollbtn && show && showprev ? '3vh' : '', marginRight: scrollbtn && show && shownext ? '3vh' : '', display: tabType === 'box' ? '-webkit-box' : 'block', ...style,
        }}
        {...rest}
        onScroll={() => updateDimensions()}
        type="card"
      >
        {data && data.map((m) => (
          <TabPane tab={m.module} key={m.module} />
        ))}
        {children}
      </Tabs>

    </TabWrap>
  );
};

export default ZsTabs;
