/* eslint-disable react/prop-types */
import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Dropdown } from 'antd';
import { RingChart } from '../../../../../../../components/charts';
import Icons from '../../../../../../../components/icons';
import NoData from '../../../../../../../components/NoData';
import ZsTooltip from '../../../../../../../components/tooltip';
import { getTimeFilterData } from '../../../../../../../helpers/envData';
import { TimeFilContext } from '../../../../../../containers/TimeFilterContext';
import { AttributeAnalysisWrapper } from '../style';
import { AppContext } from './context';
import ZsCard from '../../../../../../../components/card';
import ProcessRelation from './ProcessRelation';
import { clearLocalData, convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';
import { ZsSpin } from '../../../../../../../components/Spin';

const AttributeAnalysis = React.memo((props) => {
  const {
    match, changeAttributeAnalysisAction, fakeAttributeAnalysisAction, fakeActionDashboard,
    fetchFieldsForDetails, fakeActionPanel, changeFieldAttributeAnalysisAction,
  } = props;

  const { fieldType } = match.params;
  const fieldValue = decodeURIComponent(window.location.hash.split(`${match.params.fieldType}/`)[1]);

  const [incidentData, setIncidentData] = useState([]);
  const [incidentsStatus, setIncidentsStatus] = useState([]);
  const [fatchFieldRes, setFatchFieldRes] = useState([]);
  const [closeStatusData, setCloseStatusData] = useState([]);
  const [analysisMainData, setAnalysisMainData] = useState([fieldType]);

  const [id, setId] = useState('');
  const [analysisData, setAnalysisData] = useState([]);
  const [refreshLoad, setRefreshLoad] = useState(false);
  const [AttributeData, setAttributeData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [chartLoadingData, setChartLoadingData] = useState(false);
  const [networkChartFullScreen, setNetworkChartFullScreen] = useState(true);

  const [incidentFilter, setIncidentFilter] = useState([]);
  const [atributeStatus, setAtributeStatus] = useState(false);

  const {
    timeFilData,
  } = useContext(TimeFilContext);

  const changeAttributeAnalysisRes = useSelector((state) => (
    state.AttributeAnalysis.ChangeAttributeAnalysisResponse) || {});
  const ChangeFieldAttributeAnalysisRes = useSelector((state) => (
    state.AttributeAnalysis.ChangeFieldAttributeAnalysisResponse) || {});
  const TimeFilterUpdate = useSelector((state) => (state.Dashboard.TimeFilterUpdate || {}));
  const FatchFieldsRes = useSelector((state) => (state.Panel.FatchFieldsDetailsResponse || {}));

  const removeFilter = useCallback((val) => {
    setIncidentFilter((pre) => pre.filter((s) => s.value !== val));
  }, []);

  const extrafieldtypename = useCallback((ename) => {
    const extrafieldname = fatchFieldRes.filter((eve) => (ename === eve.value));
    if (extrafieldname.length > 0) {
      return extrafieldname[0].name;
    }
    return ename;
  }, [fatchFieldRes]);

  const changeAttributeAnalysis = () => {
    setLoadingData(true);
    setChartLoadingData(true);
    const data = {};
    data.attributeField = fieldType;
    data.attributeValue = fieldValue;
    data.timeFilter = JSON.parse(getTimeFilterData(timeFilData));
    data.filter = incidentFilter;
    data.processFields = analysisMainData;
    changeAttributeAnalysisAction(data);
  };

  const viewMoreData = (i) => {
    setId(i);
    const ele = document.getElementById(`wrap_${i}`);
    const ele2 = document.getElementById(`viewWrap_${i}`);
    setId((pre) => pre);
    const preEle = document.getElementById(`wrap_${id}`);
    const preEle2 = document.getElementById(`viewWrap_${id}`);
    const incidentId = document.getElementById(`incident_Id_${i}`);
    const incidentName = document.getElementById(`incident_Name_${i}`);
    const incidentCloseTime = document.getElementById(`incident_Close_Time_${i}`);
    const incidentReasons = document.getElementById(`incident_Reasons_${i}`);
    const incidentRootCauses = document.getElementById(`incident_root_Causes_${i}`);
    const incidentId2 = document.getElementById(`incident_Id_${id}`);
    const incidentName2 = document.getElementById(`incident_Name_${id}`);
    const incidentCloseTime2 = document.getElementById(`incident_Close_Time_${id}`);
    const incidentReasons2 = document.getElementById(`incident_Reasons_${id}`);
    const incidentRootCauses2 = document.getElementById(`incident_root_Causes_${id}`);
    const idSpan = document.getElementById(`idSpan_${i}`);
    const idSpan2 = document.getElementById(`idSpan_${id}`);
    const nameSpan = document.getElementById(`nameSpan_${i}`);
    const nameSpan2 = document.getElementById(`nameSpan_${id}`);
    const closeTimeSpan = document.getElementById(`closeTimeSpan_${i}`);
    const closeTimeSpan2 = document.getElementById(`closeTimeSpan_${id}`);
    const reasonsSpan = document.getElementById(`reasonsSpan_${i}`);
    const reasonsSpan2 = document.getElementById(`reasonsSpan_${id}`);
    const rootCausesSpan = document.getElementById(`rootCausesSpan_${i}`);
    const rootCausesSpan2 = document.getElementById(`rootCausesSpan_${id}`);
    const closeCommentSpan = document.getElementById(`closeCommentSpan_${i}`);
    const closeCommentSpan2 = document.getElementById(`closeCommentSpan_${id}`);

    const closeComment = document.getElementById(`incident_close_Comment_${i}`);
    const closeComment2 = document.getElementById(`incident_close_Comment_${id}`);

    if (ele && ele2) {
      if (ele.style.height === '108px') {
        ele.style.height = '40px';
        ele.style.display = 'flex';
        incidentId.style.width = '8%';
        incidentName.style.width = '35%';
        incidentCloseTime.style.width = '17%';
        incidentReasons.style.width = '9%';
        incidentRootCauses.style.width = '9%';
        ele2.style.marginTop = '0';
        ele2.style.marginRight = '0';
        ele2.innerText = 'View More';
        idSpan.style.display = 'none';
        nameSpan.style.display = 'none';
        closeTimeSpan.style.display = 'none';
        reasonsSpan.style.display = 'none';
        rootCausesSpan.style.display = 'none';
        closeCommentSpan.style.display = 'none';
        closeComment.style.display = 'none';
        closeComment.style.width = '0%';
      } else {
        ele.style.height = '108px';
        ele.style.display = 'block';
        incidentId.style.width = '20%';
        incidentId.style.float = 'left';
        incidentName.style.width = '80%';
        incidentName.style.float = 'right';
        ele2.style.float = 'right';
        ele2.style.width = '10%';
        incidentCloseTime.style.float = 'left';
        incidentCloseTime.style.width = '30%';
        incidentReasons.style.float = 'left';
        incidentReasons.style.width = '30%';
        incidentRootCauses.style.float = 'left';
        incidentRootCauses.style.width = '30%';
        ele2.style.marginTop = '-100px';
        ele2.style.marginRight = '18.5px';
        ele2.innerText = 'View Less';
        idSpan.style.display = 'block';
        nameSpan.style.display = 'block';
        closeTimeSpan.style.display = 'block';
        reasonsSpan.style.display = 'block';
        rootCausesSpan.style.display = 'block';
        closeCommentSpan.style.display = 'block';
        closeComment.style.display = 'flex';
        closeComment.style.width = '100%';
      }
    }
    if (preEle && preEle2 && id !== '' && id !== i) {
      preEle.style.height = '40px';
      preEle.style.display = 'flex';
      incidentId2.style.width = '8%';
      incidentName2.style.width = '35%';
      incidentCloseTime2.style.width = '17%';
      incidentReasons2.style.width = '9%';
      incidentRootCauses2.style.width = '9%';
      preEle2.innerText = 'View More';
      preEle2.style.marginTop = '0';
      preEle2.style.marginRight = '0';
      idSpan2.style.display = 'none';
      nameSpan2.style.display = 'none';
      closeTimeSpan2.style.display = 'none';
      reasonsSpan2.style.display = 'none';
      rootCausesSpan2.style.display = 'none';
      closeCommentSpan2.style.display = 'none';
      closeComment2.style.display = 'none';
      closeComment2.style.width = '0%';
    }
  };

  useEffect(() => {
    fetchFieldsForDetails('incident');
    const storageHandler = () => {
      if (JSON.parse(localStorage.getItem('U_TOKENS')) === null) {
        clearLocalData();
      }
    };
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  useEffect(() => {
    changeAttributeAnalysis();
  }, [incidentFilter]);

  useEffect(() => {
    if (FatchFieldsRes.status) {
      setFatchFieldRes(FatchFieldsRes.data);
      fakeActionPanel();
    } else if (FatchFieldsRes.status === false) {
      fakeActionPanel();
    }
  }, [FatchFieldsRes]);

  useEffect(() => {
    if (ChangeFieldAttributeAnalysisRes && ChangeFieldAttributeAnalysisRes.status === true) {
      setChartLoadingData(false);
      if (ChangeFieldAttributeAnalysisRes.data) {
        setAnalysisData(ChangeFieldAttributeAnalysisRes.data);
        setRefreshLoad(false);
      }
      fakeAttributeAnalysisAction();
    } else if (ChangeFieldAttributeAnalysisRes.status === false) {
      setAttributeData([]);
      fakeAttributeAnalysisAction();
    }
  }, [ChangeFieldAttributeAnalysisRes]);

  useEffect(() => {
    if (changeAttributeAnalysisRes && changeAttributeAnalysisRes.status === true) {
      setLoadingData(false);
      setChartLoadingData(false);
      if (changeAttributeAnalysisRes.data) {
        setAttributeData(changeAttributeAnalysisRes.data);
        setIncidentData(changeAttributeAnalysisRes.data[3].incidentListData);
        setIncidentsStatus(changeAttributeAnalysisRes.data[4].analysisData);
        setCloseStatusData(changeAttributeAnalysisRes.data[5].closeIncidentListData);
        setAnalysisData(changeAttributeAnalysisRes.data[6]);
        setRefreshLoad(false);
        setAtributeStatus(true);
      }
      fakeAttributeAnalysisAction();
    } else if (changeAttributeAnalysisRes.status === false) {
      setAttributeData([]);
      fakeAttributeAnalysisAction();
    }
  }, [changeAttributeAnalysisRes]);

  useEffect(() => {
    if (atributeStatus) {
      setChartLoadingData(true);
      const data = {};
      data.attributeField = fieldType;
      data.attributeValue = fieldValue;
      data.timeFilter = JSON.parse(getTimeFilterData(timeFilData));
      data.filter = incidentFilter;
      data.processFields = analysisMainData;
      changeFieldAttributeAnalysisAction(data);
    }
  }, [analysisMainData]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME') {
      changeAttributeAnalysis();
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  const IncidentTableCell = ({
    field,
    value,
    width,
    showPrefix,
    incidentFilters,
    setIncidentFilters,
    isDateTime,
  }) => {
    const handleFilterClick = (operator) => {
      const a = [...incidentFilters];
      const index = a.findIndex((s) => s.value === value);
      if (index === -1 || a.length === 0) {
        setIncidentFilters([...a, { field, value, operator }]);
      } else {
        a[index].operator = operator;
        setIncidentFilters([...a]);
      }
    };

    const displayValue = isDateTime
      ? convertTimeBaseTimeZoneFunction(new Date(value))
      : showPrefix ? `#${value}` : value;

    return (
      <div style={{ height: '40px', width }}>
        <div className="endPointData" style={{ width: '100%' }}>
          <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
            <ZsTooltip
              autoRight
              title={displayValue}
              ids={`Incident_Attribute_${field}_${value}`}
              style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {isDateTime ? (
                <div
                  className="overflowText"
                  style={{ marginLeft: '3px' }}
                  id={`Incident_Attribute_${field}_${value}`}
                >
                  {displayValue}
                </div>
              ) : (
                <Dropdown
                  id={`Incident_Overview_Attribute_Analysis_${field}_Dropdown`}
                  trigger={['hover']}
                  overlayStyle={{
                    width: '60px',
                    minWidth: '50px',
                    background: '#222528',
                    boxShadow: '0 2px 15px 0 rgba(15, 15, 19, 0.5)',
                  }}
                  placement="bottomLeft"
                  overlay={(
                    <div className="menuDropdown bordered">
                      <>
                        <div style={{
                          width: '22px',
                          paddingTop: '6px',
                          background: '#191b1b',
                          height: '22px',
                        }}
                        >
                          <Icons
                            id={`Incident_Overview_Attribute_Analysis_${field}_Dropdown_Plus_Filter`}
                            type="plusFilter"
                            icontype="globle"
                            onClick={() => handleFilterClick('eq')}
                            className="copyIncidentData"
                          />
                        </div>
                        <div style={{
                          width: '22px',
                          marginLeft: '5px',
                          paddingTop: '6px',
                          background: '#16191a',
                          height: '22px',
                        }}
                        >
                          <Icons
                            id={`Incident_Overview_Attribute_Analysis_${field}_Dropdown_Minus_Filter`}
                            type="minusFilter"
                            icontype="globle"
                            onClick={() => handleFilterClick('!eq')}
                            className="copyIncidentData"
                          />
                        </div>
                      </>
                    </div>
                  )}
                >
                  <div
                    className="overflowText"
                    id={`Incident_Attribute_${field}_${value}`}
                  >
                    {displayValue}
                  </div>
                </Dropdown>
              )}
            </ZsTooltip>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AttributeAnalysisWrapper id="Incident_Overview_Attribute_Analysis_Wrapper" className="fullScreen2">
      <AppContext.Provider value={{
        analysisData, analysisMainData, setAnalysisMainData,
      }}
      >
        <div className="mainBody">
          <div className="headerBody">
            <div className="bodyHeader">
              <div className="headerTitle">Attribute:</div>
              <div style={{ paddingLeft: '5px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{extrafieldtypename(fieldType.split('.keyword')[0])}</div>
              <div style={{ paddingLeft: '5px' }}>=</div>
              <ZsTooltip
                autoRight
                title={fieldValue || ''}
                ids={`attrValue_${fieldValue}`}
                style={{
                  paddingLeft: '5px',
                  width: 'calc(100% - 250px)',
                }}
              >
                <div
                  style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  id={`attrValue_${fieldValue}`}
                >
                  {fieldValue}
                </div>
              </ZsTooltip>
            </div>
            <div className="bodySubHeader">
              <div className="bodySubHeaderContent">
                {incidentFilter && incidentFilter.map((d) => (
                  <span className="tags" key={d.value}>
                    <span id={`create_Rule_tags${d.value}`} data-test="ekasha_edit_field" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {d.field === 'incidentId' && (<span>IncidentId</span>)}
                      {d.field === 'incidentName' && (<span>incidentName</span>)}
                      {d.field === 'status' && (<span>incidentStatus</span>)}
                      {d.field === 'assignedToName' && (<span>Assigned</span>)}
                      {' '}
                      {d.operator === 'eq' ? '=' : '!='}
                      {' '}
                      {d.value}
                    </span>
                    <Icons
                      id={`Incident_Overview_Attribute_Analysis_Remove_Filter_${d.value}`}
                      data-test="ekasha_remove_field"
                      icontype="globle"
                      type="close"
                      style={{ marginLeft: '6px', marginTop: '-2px', cursor: 'pointer' }}
                      onClick={() => removeFilter(d.value)}
                    />
                  </span>
                ))}
              </div>
              <div style={{ width: '50px' }}>
                <ZsTooltip autoRight subType="iconTool" title="Refresh">
                  <div
                    id="Incident_Overview_Attribute_Analysis_Refresh_Button"
                    className="refreshArtifact"
                    onClick={() => { setRefreshLoad(true); changeAttributeAnalysis(); }}
                  >
                    <div>
                      <Icons
                        icontype="common"
                        type="ReFresh"
                        data-test="artifact_refresh_btn"
                        className={refreshLoad ? 'spinnerRestart' : null}
                        style={{
                          cursor: 'pointer', position: 'relative', top: '2.5px', opacity: 1,
                        }}
                      />
                    </div>
                  </div>
                </ZsTooltip>
              </div>
            </div>
          </div>
          <div className="centerBody">
            <div className="bodyContent">
              <div className="boxContent">
                <ZsCard
                  cardClass="iByStatus"
                  title
                  headerContent={
                    <div className="endPointData">Incidents</div>
                  }
                  style={{ height: '280px' }}
                >
                  <div className="tablecontentHeader">
                    <div style={{ width: '16%', paddingLeft: '9px' }}>Incident ID</div>
                    <div style={{ width: '31%', paddingLeft: '6px' }}>Incident Name</div>
                    <div style={{ width: '16%' }}>Status</div>
                    <div style={{ width: '31%', marginRight: '1px' }}>Incident Created Time</div>
                  </div>
                  {loadingData ? (
                    <span className="endPointData">
                      <span className="eName overflowText">
                        <ZsSpin id="attributeChartLoading" />
                      </span>
                    </span>
                  )
                    : (
                      <div className="zsCardBody">
                        {incidentData.length > 0
                          ? (incidentData.map((d, i) => (
                            <div className="tablecontent" key={i}>
                              <div className="zsBox">
                                <IncidentTableCell
                                  field="incidentId"
                                  value={d.incidentId}
                                  width="15%"
                                  showPrefix
                                  incidentFilters={incidentFilter}
                                  setIncidentFilters={setIncidentFilter}
                                />
                                <IncidentTableCell
                                  field="incidentName"
                                  value={d.incidentName}
                                  width="30%"
                                  incidentFilters={incidentFilter}
                                  setIncidentFilters={setIncidentFilter}
                                />
                                <IncidentTableCell
                                  field="status"
                                  value={d.incidentStatus}
                                  width="15%"
                                  incidentFilters={incidentFilter}
                                  setIncidentFilters={setIncidentFilter}
                                />
                                <IncidentTableCell
                                  field="incidentCreatedTime"
                                  value={d.incidentCreatedTime}
                                  width="31%"
                                  isDateTime
                                />
                              </div>
                            </div>
                          ))) : <NoData style={{ position: 'revert', top: '92px' }} />}
                      </div>
                    )}
                </ZsCard>
              </div>
              <div className="boxContent" style={{ width: '12%', background: 'transparent', padding: 0 }}>
                <div className="box" style={{ marginTop: '0px' }}>
                  <div className="boxTitle">Total Incidents</div>
                  <div className="boxTitleCount">{AttributeData && AttributeData[2] && AttributeData[2].totalIncidentData ? AttributeData[2].totalIncidentData : '0'}</div>
                </div>
                <div className="box">
                  <div className="boxTitle">Open Incidents</div>
                  <div className="boxTitleCount">{AttributeData && AttributeData[1] && AttributeData[1].openIncidentData ? AttributeData[1].openIncidentData : '0'}</div>
                </div>
                <div className="box">
                  <div className="boxTitle">Closed Incidents</div>
                  <div className="boxTitleCount">{AttributeData && AttributeData[0] && AttributeData[0].closeIncidentData ? AttributeData[0].closeIncidentData : '0'}</div>
                </div>
              </div>
              <div className="boxContent">
                <ZsCard
                  cardClass="iByStatus"
                  headerContent={(
                    <span className="endPointData">
                      <span>Top Analysts</span>
                    </span>
                  )}
                  style={{ height: '280px', width: '100%', paddingRight: '10px' }}
                >
                  {loadingData
                    && (
                      <div>
                        <ZsSpin id="attributeChartLoading1" />
                      </div>
                    )}
                  {
                    !loadingData && incidentsStatus.length === 0
                    && (
                      <div>
                        <NoData style={{ position: 'revert' }} />
                      </div>
                    )
                  }
                  {
                    !loadingData && incidentsStatus.length !== 0
                    && (
                      <div id="iByStatus_Attribute_Analysis" style={{ height: '100%', width: 'calc(100% - 2px)' }}>
                        <RingChart
                          id="iByStatus_Attribute_Analysis"
                          data={incidentsStatus}
                          subType="attributeAnalysis"
                          incidentFilter={incidentFilter}
                          setIncidentFilter={setIncidentFilter}
                        />
                      </div>
                    )
                  }
                </ZsCard>
              </div>
            </div>
            <ProcessRelation
              setAnalysisMainData={setAnalysisMainData}
              analysisMainData={analysisMainData}
              fetchFieldsRes={fatchFieldRes}
              analysisData={analysisData}
              AttributeData={AttributeData}
              networkChartFullScreen={networkChartFullScreen}
              setNetworkChartFullScreen={setNetworkChartFullScreen}
              chartLoadingData={chartLoadingData}
            />
            <div className="bodyFooter" style={{ display: networkChartFullScreen ? 'block' : 'none' }}>
              <div className="bodyFooterTitle">Closed Incidents Summery</div>
              <div className="bodyFooterContent">
                <div className="bodyFooterContentHeader">
                  <div style={{ width: '8%' }}>Incident ID</div>
                  <div style={{ width: '35%' }}>Incident Name</div>
                  <div style={{ width: '17%' }}>Close Time</div>
                  <div style={{ width: '9%' }}>Reasons</div>
                  <div style={{ width: '9%' }}>Root Causes</div>
                  <div style={{ width: '10%' }} />
                </div>
                <div className="bodyFooterContentData">
                  {
                    loadingData ? (
                      <span className="endPointData">
                        <span className="eName overflowText">
                          <div style={{ position: 'relative', top: '50%' }}>
                            <ZsSpin id="attributeChartLoading2" />
                          </div>
                        </span>
                      </span>
                    )
                      : closeStatusData && closeStatusData.length > 0
                        ? closeStatusData.map((d, i) => (
                          <div className="wrap" id={`wrap_${i}`}>
                            <div id={`incident_Id_${i}`} style={{ width: '8%', height: '30px', display: 'flex' }}>
                              <span id={`idSpan_${i}`} className="titleText">Incident Id: </span>
                              <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
                                <ZsTooltip
                                  autoRight
                                  title={`#${d.incidentId}`}
                                  ids={`Closed_Incident_Attribute_incidentId_${d.incidentId}`}
                                  style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                                >
                                  <div className="titleContent" id={`Closed_Incident_Attribute_incidentId_${d.incidentId}`}>
                                    #
                                    {d.incidentId}
                                  </div>
                                </ZsTooltip>
                              </div>
                            </div>
                            <div id={`incident_Name_${i}`} style={{ width: '35%', height: '30px', display: 'flex' }}>
                              <span id={`nameSpan_${i}`} className="titleText">Incident Name: </span>
                              <div style={{ textTransform: 'unset', overflow: 'hidden' }}>
                                <ZsTooltip
                                  autoRight
                                  title={`#${d.incidentName}`}
                                  ids={`Closed_Incident_Attribute_incidentName_${d.incidentName}`}
                                  style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                                >
                                  <div className="titleContent" id={`Closed_Incident_Attribute_incidentName_${d.incidentName}`}>
                                    {d.incidentName}
                                  </div>
                                </ZsTooltip>
                              </div>
                            </div>
                            <div id={`incident_Close_Time_${i}`} style={{ width: '17%', height: '30px', display: 'flex' }}>
                              <span id={`closeTimeSpan_${i}`} className="titleText">Close Time: </span>
                              <span className="titleContent" style={{ paddingLeft: '3px' }}>{convertTimeBaseTimeZoneFunction(new Date(d.closedTime))}</span>
                            </div>
                            <div id={`incident_Reasons_${i}`} style={{ width: '9%', height: '30px', display: 'flex' }}>
                              <span id={`reasonsSpan_${i}`} className="titleText">Reasons: </span>
                              <span className="titleContent" style={{ paddingLeft: '4px' }}>{d.reason}</span>
                            </div>
                            <div id={`incident_root_Causes_${i}`} style={{ width: '9%', height: '30px', display: 'flex' }}>
                              <span id={`rootCausesSpan_${i}`} className="titleText">Root Causes: </span>
                              <span className="titleContent" style={{ paddingLeft: '6px' }}>{d.rootCause}</span>
                            </div>
                            <div id={`incident_close_Comment_${i}`} style={{ display: 'none', height: '40px' }}>
                              <span id={`closeCommentSpan_${i}`} className="titleText">Close Comment: </span>
                              <span>{d.comment}</span>
                            </div>
                            <div
                              className="viewWrap"
                              id={`viewWrap_${i}`}
                              onClick={() => viewMoreData(i)}
                            >
                              View More
                            </div>
                          </div>
                        )) : <NoData style={{ position: 'relative' }} />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContext.Provider>
    </AttributeAnalysisWrapper>
  );
});
AttributeAnalysis.propTypes = {
  changeAttributeAnalysisAction: PropTypes.func,
  changeFieldAttributeAnalysisAction: PropTypes.func,
  fakeAttributeAnalysisAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  fetchFieldsForDetails: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  match: PropTypes.oneOfType([PropTypes.object]),
};

AttributeAnalysis.defaultProps = {
  changeAttributeAnalysisAction: null,
  changeFieldAttributeAnalysisAction: null,
  fakeAttributeAnalysisAction: null,
  fakeActionDashboard: null,
  fetchFieldsForDetails: null,
  fakeActionPanel: null,
  match: null,
};
export default AttributeAnalysis;
