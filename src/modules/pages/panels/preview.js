import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart, RingChart, HalfRing, HalfPie, BarChart2, HorizontalBar, StackedBarChart,
  AreaChart, LineChart, TableChart, FunnelChart,
  Dendogram,
} from '../../../components/charts';
import { PanelWrapper } from './lib/panelWrapper';
import Icons from '../../../components/icons';
import { ZsSpin } from '../../../components/Spin';

const PreviewPanelModal = React.memo((props) => {
  const elee = document.getElementById('GH25OrPRiview_cc');
  if (elee) {
    if (elee.innerHTML !== '') {
      elee.innerHTML = '';
    }
  }
  const {
    newPanelPreviewModal, setNewPanelPreviewModal, panelsView, panelsViewLoadind,
  } = props;

  const PreviewChart = useCallback((data, id) => {
    const ele = document.getElementById(`${id}`);
    if (ele) {
      if (ele.innerHTML !== '') {
        ele.innerHTML = '';
      }
    }
    switch (data.panelType) {
      case 'pieChart':
        return <PieChart id={id} data={data.data} />;
      case 'ringChart':
        return <RingChart id={id} data={data.data} chartType="customDash" />;

      case 'halfRingChart':
        return <HalfRing id={id} data={data.data} />;

      case 'halfPieChart':
        return <HalfPie id={id} data={data.data} />;

      case 'barChart':
        return (
          <BarChart2
            id={id}
            data={data.data}
            lable={{ xlable: data.xLabel, ylable: data.yLabel }}
          />
        );

      case 'horizontalBarChart':
        return (
          <HorizontalBar
            id={id}
            data={data.data}
            lable={{ xlable: data.xLabel, ylable: data.yLabel }}
          />
        );

      case 'stackedBarChart':
        return (
          <StackedBarChart
            id={id}
            data={data.data}
            lable={{ xlable: data.xLabel, ylable: data.yLabel }}
          />
        );

      case 'areaChart':
        return (
          <AreaChart
            id={id}
            data={data.data}
            lable={{ xlable: data.xLabel, ylable: data.yLabel }}
          />
        );
      case 'funnelChart':
        return (
          <FunnelChart
            id={id}
            data={data.data}
          />
        );

      case 'lineChart':
        return (
          <LineChart
            id={id}
            data={data.data}
            lable={{ xlable: data.xLabel, ylable: data.yLabel }}
          />
        );

      case 'dendrogramChart':
        return <Dendogram id={id} data={data.data} />;

      case 'table':
        return <TableChart id={id} data={data.data} />;
      default:
        return null;
    }
  }, []);
  return (
    <PanelWrapper id="panel_priview_chart" data-test="priview_chart">
      <div className={newPanelPreviewModal ? 'showMePrieView newPanelArea' : 'newPanelArea'}>
        <div className="innerDiv">
          <div className="headerContentPanel">
            <div className="headerTextPanel">Preview Panel</div>
            <div id="Ppreview_close" className="headerTextPanel closeBtn">
              <Icons
                icontype="globle"
                id="panel_icon_view_open"
                type="close"
                className="closeIcon"
                style={{ cursor: 'pointer', height: '27px', marginTop: '8px' }}
                onClick={() => setNewPanelPreviewModal(false)}
              />
            </div>
          </div>
          <div className="bodyContentPanel previewPanelModel">
            {
              panelsViewLoadind ? <ZsSpin id="pannelChartLoading" />
                : (
                  <>
                    <div
                      id="GH25OrPreview"
                      style={{
                        width: '93%',
                        height: '91%',
                        // margin: '0px -9px',
                        // overflow: 'hidden auto',
                        position: 'absolute',
                      }}
                    />
                    {newPanelPreviewModal && panelsView?.data?.length > 0 ? PreviewChart(panelsView, 'GH25OrPreview') : (
                      <span style={{
                        fontSize: '14px', color: '#333333', top: '50%', margin: '0', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute',
                      }}
                      >
                        Preview not available
                      </span>
                    )}
                  </>
                )
            }
          </div>
        </div>
      </div>
    </PanelWrapper>
  );
});
PreviewPanelModal.propTypes = {
  newPanelPreviewModal: PropTypes.bool,
  panelsViewLoadind: PropTypes.bool,
  setNewPanelPreviewModal: PropTypes.func,
  panelsView: PropTypes.oneOfType([PropTypes.any]),
};

PreviewPanelModal.defaultProps = {
  newPanelPreviewModal: false,
  panelsViewLoadind: false,
  setNewPanelPreviewModal: null,
  panelsView: [],
};
export default PreviewPanelModal;
