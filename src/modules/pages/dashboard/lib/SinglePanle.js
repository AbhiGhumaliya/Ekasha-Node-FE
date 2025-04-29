/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icons from '../../../../components/icons';
import NoData from '../../../../components/NoData';
import {
  PieChart, RingChart, HalfRing, HalfPie, BarChart2, HorizontalBar,
  StackedBarChart, AreaChart, LineChart, Dendogram, TableChart,
  FunnelChart,
} from '../../../../components/charts';
import ZsModal from '../../../../components/modal';
import { PermissionRO } from '../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../components/toaster';
import { ZsSpin } from '../../../../components/Spin';
import EkashaDropdown from '../../../../components/drop_down';
import ZsTooltip from '../../../../components/tooltip';
import { IdelTimerContext } from '../../../containers/TimeFilterContext';

const SinglePanle = React.memo((props) => {
  const {
    parentDash, j, singlePanle, deleteChart, deleteBtn,
    panelsData, setIntervalStatus, setDeleteModal, chartSizeChange,
    panelDrawerClose,
  } = props;
  const { resetIdelTimer } = useContext(IdelTimerContext);

  const [yLabel, setYLabel] = useState('');
  const [xLabel, setXLabel] = useState('');
  const [status, setStatus] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [data, setData] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (panelsData) {
      if (panelsData.id === singlePanle.panelToken) {
        setStatus(true);
        setData([...panelsData.data]);
        setTitle(panelsData.title);
        setType(panelsData.panelType);
        setXLabel(panelsData.xLabel);
        setYLabel(panelsData.yLabel);
      }
    } else if (panelsData === null) {
      setStatus(false);
    }
  }, [panelsData]);
  useEffect(() => {
    const interval = setInterval(() => {
      resetIdelTimer();
      if (j === 0) {
        setIntervalStatus(true);
      }
    }, parentDash.interval * 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getPanelOpt = (dName, dToken, pToken) => (
    <div id={`${dToken}-${pToken}`} className="overflowWrap">
      <EkashaDropdown
        triggerType="click"
        visible={dropdownVisible}
        onVisibleChange={(visible) => setDropdownVisible(visible)}
        showContent={(
          <div className="overflowOptions">
            <div
              className="singleOption"
              data-test="delete_modal_open"
              id="delete_modal_open"
              onClick={PermissionRO('home', 'dashboard').delete ? () => { setDeleteModal(true); setDropdownVisible(false); } : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            >
              <Icons className="optIcon" icontype="globle" type="deletedash" />
              <span className="optName">Delete</span>
            </div>
          </div>
        )}
      >
        <div
          id="cardHeaderIcn"
          onClick={() => {
            deleteBtn(deleteChart === `${dToken},${pToken}` ? '' : `${dToken},${pToken}`);
            panelDrawerClose();
          }}
          className="cardHeaderIcn"
          data-test="delete_chart_panel_dnd"
        >
          <Icons icontype="common" type="overflowEllipsis" />
        </div>
      </EkashaDropdown>
    </div>
  );
  // get chart by its type
  const getChart = (typeChart, id, dataChart, lable) => {
    switch (typeChart) {
      case 'pieChart':
        return <PieChart id={id} data={dataChart} />;

      case 'ringChart':
        return <RingChart id={id} data={dataChart} chartType="customDash" />;

      case 'halfRingChart':
        return <HalfRing id={id} data={dataChart} />;

      case 'halfPieChart':
        return <HalfPie id={id} data={dataChart} />;

      case 'barChart':
        return <BarChart2 id={id} data={dataChart} lable={lable} />;

      case 'horizontalBarChart':
        return <HorizontalBar id={id} data={dataChart} lable={lable} />;

      case 'stackedBarChart':
        return <StackedBarChart id={id} data={dataChart} lable={lable} />;

      case 'areaChart':
        return (
          <AreaChart
            id={id}
            data={dataChart}
            lable={lable}
          />
        );

      case 'lineChart':
        return (
          <LineChart
            id={id}
            data={dataChart}
            lable={lable}
            chartSizeChange={chartSizeChange}
          />
        );

      case 'dendrogramChart':
        return <Dendogram id={id} data={dataChart} />;
      case 'funnelChart':
        return <FunnelChart id={id} data={dataChart} />;

      case 'table':
        return <TableChart id={id} data={dataChart} />;
      default:
    }
    return null;
  };
  // clear panel or return loading
  const clrChart = (id, typeLoading) => {
    let a = '';
    if (id && typeLoading === 'loading') {
      a = (
        <span className="emptyContent">
          <ZsSpin id="singleChartLoading" />
        </span>
      );
    }
    if (id && typeLoading === 'clear') {
      a = (
        <span className="emptyContent">
          <NoData />
        </span>
      );
    }
    return a;
  };

  // getPanelBody
  const getPanelBody = (id) => {
    if (status === true) {
      const lable = { xlable: xLabel, ylable: yLabel };
      if (data === null || data === undefined || data.length === 0) {
        return clrChart(id, 'clear');
      }
      return getChart(type, id, data, lable);
    }
    if (data === null || data === undefined || data.length === 0) {
      return clrChart(id, 'clear');
    }
    return clrChart(id, 'loading');
  };

  return (
    <div
      id={singlePanle.panelToken}
      style={{ height: '100%', width: '100%', padding: '2px 4px' }}
      className=""
    >
      <div className="rItemHead" style={{ cursor: 'default' }}>
        <ZsTooltip autoRight title={title || 'Panel Name'} ids={`Dashboard_Panel_GridBox_panel_Name_${title || 'Panel Name'}`}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Dashboard_Panel_GridBox_panel_Name_${title || 'Panel Name'}`}>{title || 'Panel Name'}</div>
        </ZsTooltip>
        {getPanelOpt(parentDash.dashName, parentDash.token, singlePanle.panelToken)}
      </div>

      <div
        className="rItemBody"
        style={{ height: 'calc(100% - 42px)' }}
        id={`Dash2panel${singlePanle.panelToken}${parentDash.token}`}
      >
        <div
          id={`Dash2panel${singlePanle.panelToken}${parentDash.token}_cc`}
          style={{ height: '100%', overflow: 'hidden scroll' }}
        >
          {getPanelBody(`Dash2panel${singlePanle.panelToken}${parentDash.token}`)}
        </div>
      </div>
    </div>
  );
});
SinglePanle.propTypes = {
  parentDash: PropTypes.oneOfType([PropTypes.any]),
  j: PropTypes.oneOfType([PropTypes.any]),
  singlePanle: PropTypes.oneOfType([PropTypes.any]),
  deleteChart: PropTypes.string,
  deleteBtn: PropTypes.func,
  panelsData: PropTypes.oneOfType([PropTypes.any]),
  setIntervalStatus: PropTypes.func,
};

SinglePanle.defaultProps = {
  parentDash: null,
  j: null,
  singlePanle: null,
  deleteChart: '',
  deleteBtn: null,
  panelsData: null,
  setIntervalStatus: null,
};
export default SinglePanle;
