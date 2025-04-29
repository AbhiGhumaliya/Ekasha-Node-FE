import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Icons from '../../../components/icons';
import EkashaDropdown from '../../../components/drop_down';
import { RiskWeightageWrapper } from './lib/IncidentsWrapper';
import RiskWeightageChart from '../../../components/charts/riskWeightageChart';
import Tree from './tree';
import { severityColor } from '../../../helpers/envData';

const RiskWeightage = React.memo((props) => {
  const {
    riskWeightageVar, setRiskWeightageVar, positionFixed, selectedIncident, type,
    selectRiskWeight, riskWeightageData,
  } = props;
  const randomID = Math.random();

  // const [treeViewData, setTreeViewData] = useState({});
  // const chartData = [
  //   {
  //     value: 20,
  //     key: 'Lookup',
  //   },
  //   {
  //     value: 15,
  //     key: 'User',
  //   },
  //   {
  //     value: 10,
  //     key: 'Vulnerability',
  //   },
  //   {
  //     value: 20,
  //     key: 'Alert Criticality',
  //   },
  //   {
  //     value: 20,
  //     key: 'Asset',
  //   },
  // ];
  // const treeData = {
  //   Lookup: {
  //     abuseIPDB: {
  //       Score: 100,
  //     },
  //     Score: 39,
  //     otx: {
  //       domain: {
  //         Score: 0,
  //       },
  //       hash: {
  //         Score: 0,
  //       },
  //       ip: {
  //         Score: 50,
  //       },
  //       Score: 12,
  //       url: {
  //         Score: 0,
  //       },
  //     },
  //     virusTotal: {
  //       domain: {
  //         Score: 0,
  //         harmless: {
  //           Score: 0,
  //         },
  //         malicious: {
  //           Score: 0,
  //         },
  //         suspicious: {
  //           Score: 0,
  //         },
  //       },
  //       hash: {
  //         harmless: {
  //           Score: 0,
  //         },
  //         Score: 0,
  //         malicious: {
  //           Score: 0,
  //         },
  //         suspicious: {
  //           Score: 0,
  //         },
  //       },
  //       ip: {
  //         harmless: {
  //           Score: 52,
  //         },
  //         Score: 19,
  //         malicious: {
  //           Score: 9,
  //         },
  //         suspicious: {
  //           Score: 3,
  //         },
  //       },
  //       url: {
  //         harmless: {
  //           Score: 0,
  //         },
  //         malicious: {
  //           Score: 0,
  //         },
  //         suspicious: {
  //           Score: 0,
  //         },
  //         Score: 0,
  //       },
  //       Score: 5,
  //     },
  //   },
  //   'Alert Criticality': {
  //     severityScore: {
  //       Score: 75,
  //     },
  //     Score: 15,
  //   },
  //   'Asset Criticality': {
  //     Score: 0,
  //   },
  //   'Asset Vulnerability': {
  //     Score: 0,
  //   },
  //   'User Criticality': {
  //     Score: 0,
  //     destinationUserScore: {
  //       Score: 0,
  //     },
  //     sourceUserScore: {
  //       Score: 0,
  //     },
  //   },
  // };
  // const fackData = {
  //   Lookup: {
  //     Lookup: [{
  //       sourceAddress: {
  //         abuse: {
  //           score: 100,
  //         },
  //         otx: {
  //           score: 18,
  //         },
  //         score: 7.0,
  //         virusTotal: {
  //           score: 19.7,
  //         },
  //       },
  //     }, {
  //       sourceAddress: {
  //         score: 1.0,
  //         virusTotal: {
  //           score: 19.7,
  //         },
  //       },
  //     }],
  //     score: 8,
  //   },
  //   'User Criticality': {
  //     destinationUserScore: {
  //       score: 100,
  //     },
  //     score: 10.0,
  //   },
  // };

  // const fackData2 = {
  //   Lookup: {
  //     Lookup: [
  //       {
  //         sourceAddress: {
  //           abuse: {
  //             abuseScore: {
  //               score: 0,
  //             },
  //           },
  //           otx: {
  //             otxScore: {
  //               score: 0,
  //             },
  //           },
  //           score: 0,
  //           virusTotal: {
  //             virusTotalScore: {
  //               score: 0,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         sourceAddress: {
  //           abuse: {
  //             abuseScore: {
  //               score: 100,
  //             },
  //           },
  //           otx: {
  //             otxScore: {
  //               score: 16,
  //             },
  //           },
  //           score: 14,
  //           virusTotal: {
  //             virusTotalScore: {
  //               score: 19.7,
  //             },
  //           },
  //         },
  //       },
  //     ],
  //     score: {
  //       score: 14,
  //     },
  //   },
  //   'Alert Criticality': {
  //     severityScore: {
  //       score: 0,
  //     },
  //     score: 0,
  //   },
  //   'Asset Criticality': {
  //     score: 0,
  //   },
  //   'User Criticality': {
  //     score: 0,
  //     sourceUserScore: {
  //       score: 0,
  //     },
  //     destinationUserScore: {
  //       score: 0,
  //     },
  //   },
  //   'Asset Vulnerability': {
  //     score: 0,
  //   },
  // };

  const weightageStatus = () => {
    if (riskWeightageData !== undefined && riskWeightageData?.length !== 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (document.getElementsByClassName('vis-timeline').length > 0) {
        if (document.getElementsByClassName('vis-timeline')[0].contains(e.target)) {
          setRiskWeightageVar(false);
        }
      }
    });
    return () => {
      window.addEventListener('click', null);
    };
  }, []);

  // useEffect(() => {
  //   setTreeViewData(treeData);
  // }, []);

  return (
    <EkashaDropdown
      triggerType="click"
      visible={riskWeightageVar}
      className="IncidentRiskWeightage"
      onVisibleChange={(e) => { setRiskWeightageVar(e); }}
      showContent={(
        <RiskWeightageWrapper>
          <div className="riskBody">
            <div className="riskTopContent">
              <div className="riskTopContentLeft" style={{ color: severityColor[weightageStatus() ? riskWeightageData[0]?.weightageSeverity.toLowerCase() : ''] }}>{weightageStatus() ? riskWeightageData[0]?.weightageSeverity : '-'}</div>
              <div className="riskTopContentRight">
                <div id="Incident_Risk_Weightage" style={{ height: '100%', width: '100%' }}>
                  {weightageStatus() && (
                    <RiskWeightageChart
                      data={riskWeightageData[1]?.chart}
                      severityStatus={weightageStatus() ? riskWeightageData[0]?.weightageSeverity.toLowerCase() : ''}
                      riskWeightageTotal={weightageStatus() ? riskWeightageData[0]?.riskweightage : ''}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="riskBottomContent">
              <div className="riskBottomContentBody">
                {weightageStatus() && (
                  <Tree data={riskWeightageData[2]?.weightagePreview} randomID={randomID} />
                )}
              </div>
            </div>
          </div>
        </RiskWeightageWrapper>
      )}
    >
      {type === 'IncidentList' ? (
        <div
          id="incidentList_Risk_Weight_Icon"
          className="incidentRiskWeightIcon"
          onClick={(e) => {
            setRiskWeightageVar(!riskWeightageVar);
            positionFixed(e, 'icon', selectedIncident);
          }}
        >
          <span style={{ lineHeight: '20px' }}>
            <div className="menuData">
              <Icons
                icontype="common"
                type="riskWeightage"
              />
            </div>
          </span>
          <span
            className="headerPartRhtPortion"
            style={{
              color: '#ffffff',
              letterSpacing: '1.44px',
            }}
          >
            <div className="menuData">
              <span
                style={{ userSelect: 'none', paddingRight: '7px' }}
              >
                {selectRiskWeight || 0}
              </span>
            </div>
          </span>
        </div>
      ) : (
        <Icons
          id="Incident_Overview_Details_RiskWeightage_Info_Icon"
          type="infoCircle"
          icontype="globle"
          className="riskWeightagInfo"
          onClick={(e) => {
            setRiskWeightageVar(!riskWeightageVar);
            positionFixed(e, 'icon', selectedIncident);
          }}
        />
      )}
    </EkashaDropdown>
  );
});

RiskWeightage.propTypes = {
  riskWeightageVar: PropTypes.bool,
  setRiskWeightageVar: PropTypes.func,
  positionFixed: PropTypes.func,
  selectedIncident: PropTypes.string,
  type: PropTypes.string,
  selectRiskWeight: PropTypes.string,
  riskWeightageData: PropTypes.oneOfType([PropTypes.any]),
};

RiskWeightage.defaultProps = {
  riskWeightageVar: false,
  setRiskWeightageVar: null,
  positionFixed: null,
  selectedIncident: '',
  type: '',
  selectRiskWeight: '',
  riskWeightageData: {},
};
export default RiskWeightage;
