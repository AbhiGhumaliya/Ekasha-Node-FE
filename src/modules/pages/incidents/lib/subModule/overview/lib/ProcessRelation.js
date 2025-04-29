import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ZsCard from '../../../../../../../components/card';
import NetworkChart from '../../../../../../../components/charts/networkChart/networkChart';
import Icons from '../../../../../../../components/icons';
import NoData from '../../../../../../../components/NoData';
import { ProcessRelationWrapper } from '../style';
import { ZsSpin } from '../../../../../../../components/Spin';

const ProcessRelation = React.memo((props) => {
  const {
    fetchFieldsRes, analysisData, setIncidentFilter,
    chartLoadingData, setAnalysisMainData, analysisMainData, setNetworkChartFullScreen,
    networkChartFullScreen,
  } = props;

  const [sideCollapse, setSideCollapse] = useState(false);
  const [filterFieldData, setFilterFieldData] = useState([]);

  const fieldType = [
    { name: 'Email', value: 'email' },
    { name: 'Host/Domain', value: 'domain' },
    { name: 'Url', value: 'url' },
    { name: 'Text', value: 'text' },
    { name: 'Long', value: 'long' },
    { name: 'Double', value: 'double' },
    { name: 'Boolean', value: 'boolean' },
    { name: 'IPv4', value: 'IP' },
  ];

  useEffect(() => {
    if (fetchFieldsRes) {
      const aa = [];
      const bb = {};
      fieldType.forEach((element2) => {
        bb.type = element2.value;
        bb.field = [];
        aa.push({ ...bb });
      });

      fetchFieldsRes.forEach((element) => {
        aa.forEach((element2) => {
          if (element2.type === element.fieldType) {
            const ab = { ...element };
            element2.field.push(ab);
          }
        });
      });
      setFilterFieldData([...aa]);
    }
  }, [fetchFieldsRes]);

  const fullScreeToggle = useCallback(() => {
    setNetworkChartFullScreen((prevState) => {
      if (!prevState) {
        setSideCollapse(false);
      }
      return !prevState;
    });
  }, []);

  return (
    <ProcessRelationWrapper>
      <div className={networkChartFullScreen ? 'bodyChart' : 'bodyChart2'}>
        <div className="bodyChartTitle">
          Incidents Attributes Relations
        </div>
        <div className="ProcessRight" style={{ height: networkChartFullScreen ? '500px' : '91vh', width: '100%' }}>
          <ZsCard
            cardClass="iByStatus"
            style={{ height: networkChartFullScreen ? '500px' : '91vh', width: '100%' }}
          >
            {chartLoadingData ? (
              <span className="endPointData">
                <span className="eName overflowText">
                  <div style={{ height: '400px' }}>
                    <ZsSpin id="processChartLoading" />
                  </div>
                </span>
              </span>
            )
              : analysisData && analysisData.processFieldsData
              && analysisData.processFieldsData.length > 0
                ? (
                  <div style={{ height: networkChartFullScreen ? '500px' : '91vh', width: '100%' }}>
                    <div id="networkDiv" style={{ height: '100%', width: '100%' }} />
                    <div className="zoomBtn">
                      <Icons iconTooltipType="normal" iconTooltipTitle="Zoom in" id="zoom-in" icontype="chart" type="zoomIn" />
                      <Icons iconTooltipType="normal" iconTooltipTitle="Zoom out" id="zoom-out" icontype="chart" type="zoomOut" />
                    </div>
                    <div className="resetBtn">
                      <Icons iconTooltipType="normal" iconTooltipTitle="Zoom reset" id="zoom-reset" icontype="chart" type="chartZoomReset" />
                    </div>
                    <div className="fullScreenBtn">
                      <Icons
                        id="Incident_Overview_Process_Relation_FullScreen_Button"
                        iconTooltipType="normal"
                        iconTooltipTitle={networkChartFullScreen ? 'Full screen' : 'Normal screen'}
                        type={networkChartFullScreen ? 'fullScreen' : 'originalScreen'}
                        icontype="chart"
                        onClick={fullScreeToggle}
                      />
                    </div>
                    <NetworkChart
                      id="networkDiv"
                      sideCollapse={sideCollapse}
                      setSideCollapse={setSideCollapse}
                      analysisData={analysisData}
                      analysisMainData={analysisMainData}
                      filterFieldData={filterFieldData}
                      setAnalysisMainData={setAnalysisMainData}
                      networkChartFullScreen={networkChartFullScreen}
                      setIncidentFilter={setIncidentFilter}
                    />
                  </div>
                ) : (
                  <NoData
                    id="Incident_Overview_Process_Relation_NoData"
                    style={{ position: 'absolute', top: networkChartFullScreen ? '250px' : '400px' }}
                  />
                )}
          </ZsCard>
        </div>
      </div>
    </ProcessRelationWrapper>
  );
});

ProcessRelation.propTypes = {

  setIncidentFilter: PropTypes.func,
  setAnalysisMainData: PropTypes.func,
  fetchFieldsRes: PropTypes.oneOfType([PropTypes.array]),
  setNetworkChartFullScreen: PropTypes.func,
  chartLoadingData: PropTypes.bool,
  networkChartFullScreen: PropTypes.bool,
  analysisData: PropTypes.oneOfType([PropTypes.any]),
  analysisMainData: PropTypes.oneOfType([PropTypes.any]),
};

ProcessRelation.defaultProps = {
  setIncidentFilter: null,
  setAnalysisMainData: null,
  fetchFieldsRes: [],
  setNetworkChartFullScreen: null,
  chartLoadingData: false,
  networkChartFullScreen: true,
  analysisData: null,
  analysisMainData: null,
};
export default ProcessRelation;
