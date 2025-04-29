import React, { useEffect, useState } from 'react';
import SearchableReactJson from 'searchable-react-json-view';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsInput from '../../../../../../../components/forms/input';
import Icons from '../../../../../../../components/icons';
import ZsModal from '../../../../../../../components/modal';
import NoData from '../../../../../../../components/NoData';
import { ZsSpin } from '../../../../../../../components/Spin';
import ZsTabs from '../../../../../../../components/tabs';
import { convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';
import { ExecuteActionModelWrapper } from '../style';
import ZsTooltip from '../../../../../../../components/tooltip';

const PreviewAction = React.memo((props) => {
  const {
    previewResult, closeResult, executeActionResult, calculateDuration, activeDetailTab, searchData,
    tabChange, setDisplayResponse, displayResponse, loadingResult, searchActionData,
    singleActionData, setSerachEmpty, previewData, setExecuteActionResult, flatten, setPreviewData,
    setSingleActionData, setLoadingData, setLoadingResult, setLoading, fakeActionIncidentAction,
  } = props;

  const [arrowtype, setArrowtype] = useState(true);

  const GetExecutedActionRes = useSelector((state) => (
    state.IncdentAction.GetExecutedActionResponse || {}));

  const formateValue = React.useCallback((value) => {
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    return value;
  }, []);

  const highlightText = React.useCallback((text, searchTerm) => {
    if (!searchTerm) {
      return text;
    }

    try {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, index) => (regex.test(part) ? <span key={index} style={{ backgroundColor: '#fdb626' }}>{part}</span> : part));
    } catch (error) {
      return text;
    }
  }, []);

  // perview modal data
  useEffect(() => {
    if (GetExecutedActionRes.status) {
      if (GetExecutedActionRes.data) {
        const previewDatas = GetExecutedActionRes.data;
        const Index = previewDatas?.parameters.findIndex((d) => d.field === 'Body');
        if (Index !== -1) {
          const PreviewFilterData = previewDatas?.parameters[Index]
            ?.body?.templateData?.sort((obj1, obj2) => obj1.categoryIndex - obj2.categoryIndex);
          previewDatas.parameters[Index].body.templateData = PreviewFilterData;
        }
        setExecuteActionResult(previewDatas);
        if (GetExecutedActionRes.data.result !== null) {
          const dd = flatten(GetExecutedActionRes.data.result);
          setPreviewData(dd);
          setSingleActionData(GetExecutedActionRes.data.result);
        }
      } else {
        setExecuteActionResult([]);
        setSingleActionData([]);
      }
      setLoadingData(false);
      setLoadingResult(false);
      fakeActionIncidentAction();
    } else if (GetExecutedActionRes.status === false) {
      setLoading(false);
      setLoadingData(false);
      setLoadingResult(false);
      fakeActionIncidentAction();
    }
  }, [GetExecutedActionRes]);

  return (
    <ZsModal
      modaltype="simple"
      id="preview_incident_action_model"
      data="action_modal_Incident"
      show={previewResult}
      width="650px"
      title="Action Preview"
      className="actionModalPreView"
      onHide={() => closeResult()}
      centered
    >
      <ExecuteActionModelWrapper id="preview_incident_action_model_wrapper">
        {Object.keys(executeActionResult).length > 0
          ? (
            <div className="innerBody" style={{ height: '600px' }}>
              <div className={`previewTopPart ${arrowtype ? 'topArrowUp' : executeActionResult?.terminatedBy ? 'topShowTerminatedBy' : executeActionResult?.scheduledTime ? 'topShowScheduledTime' : 'topArrowDown'}`}>
                <div className="parameter">
                  <div className="fullWidth">
                    <div className="controlLabel" style={{ marginBottom: '0px' }}>
                      App Name
                    </div>
                    <div className="controlTitle">
                      <ZsTooltip title={executeActionResult.device} ids={`assetName_${executeActionResult.device}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`assetName_${executeActionResult.device}`}>{executeActionResult.device}</div>
                      </ZsTooltip>
                    </div>
                  </div>
                  <div className="fullWidth">
                    <div className="controlLabel" style={{ marginBottom: '0px' }}>
                      Action Name
                    </div>
                    <div className="controlTitle">
                      <ZsTooltip title={executeActionResult.title} ids={`Incident_Action_Title_${executeActionResult.title}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_Title_${executeActionResult.title}`}>{executeActionResult.title}</div>
                      </ZsTooltip>
                    </div>
                  </div>
                  <div className="fullWidth">
                    <div className="controlLabel" style={{ marginBottom: '0px' }}>
                      Device Name
                    </div>
                    <div className="controlTitle">
                      <ZsTooltip title={executeActionResult.asset} ids={`Incident_Action_Device_${executeActionResult.asset}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_Device_${executeActionResult.asset}`}>{executeActionResult.asset}</div>
                      </ZsTooltip>
                    </div>
                  </div>
                  <div className="fullWidth">
                    <div className="controlLabel" style={{ marginBottom: '0px' }}>
                      Executed By
                    </div>
                    <div className="controlTitle">
                      <ZsTooltip title={executeActionResult.createdBy} ids={`Incident_Action_executeBy_${executeActionResult.createdBy}`}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_executeBy_${executeActionResult.createdBy}`}>{executeActionResult.createdBy}</div>
                      </ZsTooltip>
                      {/* {executeActionResult.createdBy} */}
                    </div>
                  </div>
                  {executeActionResult?.executeTime && (
                    <div className="fullWidth">
                      <div className="controlLabel" style={{ marginBottom: '0px' }}>
                        Executed Time
                      </div>
                      <div className="controlTitle">
                        {convertTimeBaseTimeZoneFunction(executeActionResult.executeTime)}
                      </div>
                    </div>
                  )}
                  <div className="fullWidth">
                    <div className="controlLabel" style={{ marginBottom: '0px' }}>
                      Created Time
                    </div>
                    <div className="controlTitle">
                      {convertTimeBaseTimeZoneFunction(executeActionResult.createdTime)}
                    </div>
                  </div>
                  <div className="fullWidth">
                    <div className="controlLabel" style={{ marginBottom: '0px' }}>
                      Execution Time
                    </div>
                    <div className="controlTitle">
                      {calculateDuration(executeActionResult.createdTime,
                        executeActionResult.executeTime)}
                    </div>
                  </div>
                  <div className="fullWidth">
                    <div className="controlLabel" style={{ marginBottom: '0px' }}>
                      Action Status
                    </div>
                    <div style={{ display: 'flex', position: 'relative' }}>
                      <div
                        className="icons"
                        style={{ position: 'relative', top: '2px' }}
                      >
                        <Icons
                          type={executeActionResult.status}
                          icontype="globle"
                          className="btmIcn"
                        />
                      </div>
                      <span style={{ marginLeft: '10px', fontSize: '12px', lineHeight: '21px' }}>
                        {executeActionResult.status}
                      </span>
                    </div>
                  </div>
                  {executeActionResult?.terminatedBy && (
                    <div className="fullWidth">
                      <div className="controlLabel" style={{ marginBottom: '0px' }}>
                        Terminated By
                      </div>
                      <div className="controlTitle">
                        {executeActionResult.terminatedBy}
                      </div>
                    </div>
                  )}
                  {executeActionResult?.terminatedTime && (
                    <div className="fullWidth">
                      <div className="controlLabel" style={{ marginBottom: '0px' }}>
                        Terminated Time
                      </div>
                      <div className="controlTitle">
                        {convertTimeBaseTimeZoneFunction(executeActionResult.terminatedTime)}
                      </div>
                    </div>
                  )}
                  {executeActionResult?.scheduledTime && (
                    <div className="fullWidth">
                      <div className="controlLabel" style={{ marginBottom: '0px' }}>
                        Scheduled Time
                      </div>
                      <div className="controlTitle">
                        {convertTimeBaseTimeZoneFunction(executeActionResult.scheduledTime)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="colUp"
                id="preview_incident_action_expand_collapse"
                style={{ transform: arrowtype ? 'rotate(0)' : 'rotate(180deg)' }}
                onClick={() => setArrowtype(!arrowtype)}
              >
                <div>
                  <Icons
                    type="ActionArrow"
                    icontype="globle"
                  />
                </div>
              </div>
              <div style={{ marginTop: '-8px' }}>
                <ZsTabs
                  id="preview_incident_action_tabs"
                  scrollbtn={false}
                  tabType="box"
                  defaultSetActiveTab={activeDetailTab}
                  onTabClick={(e) => tabChange(e)}
                  data={[{ module: 'Result' }, { module: 'Data' }]}
                />
                {activeDetailTab === 'Result'
                  && (
                    <div className="serviceName">
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '100%' }}>
                          <ZsInput
                            inputtype="search"
                            width="100%"
                            id="preview_incident_action_search"
                            placeholdertext="Search..."
                            value={searchData || ''}
                            onChange={(e) => searchActionData(e.target.value, singleActionData)}
                            searchclear={() => setSerachEmpty(singleActionData)}
                          />
                        </div>
                        <div className="toggleData" style={{ width: '30%', cursor: 'default' }}>
                          {displayResponse
                            ? (
                              <span
                                style={{ cursor: 'default' }}
                              >
                                <div
                                  onClick={() => {
                                    setDisplayResponse(false);
                                  }}
                                  id="preview_incident_action_response_backBtn"
                                  className="backButton"
                                >
                                  <div className="arrow1" />
                                </div>
                              </span>
                            )
                            : (
                              <span
                                id="preview_incident_action_response_btn"
                                style={{ marginRight: '20px' }}
                                onClick={() => {
                                  setDisplayResponse(true);
                                }}
                              >
                                Response
                              </span>
                            )}
                        </div>
                      </div>
                      {executeActionResult?.result !== null
                        && executeActionResult?.result?.length !== 0
                        && [executeActionResult.result] && [executeActionResult.result].length > 0
                        ? (
                          <div>
                            {displayResponse
                              ? (
                                <div className={`designedData1 ${arrowtype ? 'bottomArrowUp' : executeActionResult?.terminatedBy || executeActionResult?.scheduledTime ? 'bottomTerminatedBy' : 'bottomArrowDown'}`}>
                                  <SearchableReactJson
                                    id="preview_incident_action_response_json"
                                    src={previewData}
                                    searchText={searchData}
                                    highlightSearch={searchData}
                                    highlightSearchColor="#fdb626"
                                    enableClipboard
                                    displayDataTypes={false}
                                    name="JSON"
                                    // collapsed
                                    indentWidth={1}
                                    displayObjectSize={false}
                                    theme="bright"
                                    sortKeys
                                    style={{
                                      fontSize: '13px',
                                      background: 'transparent',
                                      fontFamily: "'Open Sans',sans-serif",
                                      paddingTop: '6px',
                                    }}
                                  />
                                </div>
                              )
                              : (
                                <div className={`designedData ${arrowtype ? 'bottomArrowUp' : executeActionResult?.terminatedBy || executeActionResult?.scheduledTime ? 'bottomTerminatedBy' : 'bottomArrowDown'}`} style={{ background: '#181919' }}>
                                  {Object.keys(previewData).length !== 0 ? (
                                    <div className="wrapTable">
                                      <div className="wrapTableHeader">
                                        <div className="fieldTitle">
                                          Fields
                                        </div>
                                        <div className="fieldTitleValue">
                                          Values
                                        </div>
                                      </div>
                                      {previewData && Object.keys(previewData).map((d) => (
                                        <div className="wrapTableContent">
                                          <div className="fieldTitle">
                                            {highlightText(d, searchData)}
                                          </div>
                                          <div className="fieldTitleValue">
                                            {highlightText(
                                              formateValue(previewData[d]), searchData,
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <NoData
                                      id="preview_incident_action_no_data_result"
                                      message="No data"
                                      style={{
                                        background: !displayResponse ? '#181919' : 'transparent',
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                          </div>
                        ) : (
                          <div
                            className={arrowtype ? 'bottomArrowUp' : executeActionResult?.terminatedBy || executeActionResult?.scheduledTime ? 'bottomTerminatedBy' : 'bottomArrowDown'}
                            style={{ transition: 'all 0.5s ease 0s' }}
                          >
                            <NoData
                              id="preview_incident_action_no_data"
                              message="No data"
                              style={{
                                background: !displayResponse ? '#181919' : 'transparent',
                                marginTop: '8px',
                              }}
                            />
                          </div>
                        )}
                    </div>
                  )}
                {
                  activeDetailTab === 'Data'
                  && (
                    <>
                      {executeActionResult.parameters
                          && executeActionResult.parameters
                        ? (
                          <>
                            <div className="borderBox">
                              <div className={arrowtype ? 'borderBoxMainUp' : executeActionResult?.terminatedBy || executeActionResult?.scheduledTime ? 'borderBoxbottomTerminatedBy' : 'borderBoxMainDown'}>
                                <label className="borderBoxTitle">Parameters</label>
                                {executeActionResult.parameters
                              && executeActionResult.parameters.map((e, i) => (
                                e.type !== 'password' && e.field !== 'Body' && (
                                  <div className="fullWidth" style={{ width: '100%' }} key={i}>
                                    <div className="controlLabel" style={{ marginBottom: '0px', width: '100%', display: 'flex' }}>
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        {e.field === 'incidentId' ? 'Incident ID' : e.field}
                                        {' '}
                                        :
                                      </span>
                                      <div className="parentPreviewValue">
                                        <div className="previewValue" style={{ width: e.field === 'URL' ? '500px' : 'auto' }}>
                                          {e.field === 'TO Mail' || e.field === 'CC Mail' ? e.value.replace(/"/g, '').split(',').map((email) => email.trim() && `(${email.trim()})`).filter(Boolean)
                                            .join(' ') : e.value}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              ))}
                                {executeActionResult.parameters.filter((d) => d.field === 'Body').length === 1 && (
                                <div className="borderBox" style={{ marginTop: '15px' }}>
                                  <label className="borderBoxTitle">Body</label>
                                  {executeActionResult.parameters
                                && executeActionResult.parameters.map((e, i) => (
                                  e.field === 'Body' && (
                                    <div className="fullWidth" style={{ width: '100%' }} key={i}>
                                      <div className="bodyHeader">
                                        <div className="bodyHeaderLeft">Categorie</div>
                                        <div className="bodyHeaderCenter">Fields</div>
                                        <div className="bodyHeaderRight">Value</div>
                                      </div>
                                      <div className="bodyContent">
                                        {e?.body?.templateData?.map((d, index) => (
                                          <div key={index} className="bodyMainContent">
                                            <div className="bodyMainContentLeft">{d.category}</div>
                                            <div className="bodyMainContentCenter">
                                              {d?.categoryData?.map((j, subIndex) => (
                                                <div key={subIndex}>{j.field}</div>
                                              ))}
                                            </div>
                                            <div className="bodyMainContentRight">
                                              {d?.categoryData?.map((j, subIndex) => (
                                                <div key={subIndex}>{j.value}</div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                ))}
                                </div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <NoData
                            id="preview_incident_action_no_data_data"
                            style={{
                              height: '95%', position: 'relative', top: '150px', left: '0px',
                            }}
                          />
                        )}
                    </>
                  )
                }
              </div>
            </div>
          )
          : (
            <div className="innerBody" style={{ height: '600px', maxHeight: '600px' }}>
              {!loadingResult ? <NoData id="preview_incident_action_nothing" message="Nothing to see here" /> : <ZsSpin id="actionPreviewLoading1" />}
            </div>
          )}
      </ExecuteActionModelWrapper>
    </ZsModal>
  );
});

PreviewAction.propTypes = {
  previewResult: PropTypes.bool,
  setSingleActionData: PropTypes.func,
  setLoadingData: PropTypes.func,
  setLoadingResult: PropTypes.func,
  setLoading: PropTypes.func,
  fakeActionIncidentAction: PropTypes.func,
  setPreviewData: PropTypes.func,
  flatten: PropTypes.func,
  setExecuteActionResult: PropTypes.func,
  closeResult: PropTypes.func,
  executeActionResult: PropTypes.oneOfType([PropTypes.object]),
  calculateDuration: PropTypes.func,
  activeDetailTab: PropTypes.string,
  searchData: PropTypes.string,
  tabChange: PropTypes.func,
  setDisplayResponse: PropTypes.func,
  displayResponse: PropTypes.bool,
  loadingResult: PropTypes.bool,
  searchActionData: PropTypes.func,
  singleActionData: PropTypes.oneOfType([PropTypes.object]),
  setSerachEmpty: PropTypes.func,
  previewData: PropTypes.oneOfType([PropTypes.object]),
};

PreviewAction.defaultProps = {
  previewResult: false,
  setSingleActionData: null,
  setLoadingData: null,
  setLoadingResult: null,
  setLoading: null,
  fakeActionIncidentAction: null,
  setPreviewData: null,
  flatten: null,
  setExecuteActionResult: null,
  closeResult: null,
  executeActionResult: {},
  calculateDuration: null,
  activeDetailTab: '',
  searchData: '',
  tabChange: null,
  setDisplayResponse: null,
  displayResponse: false,
  loadingResult: false,
  searchActionData: null,
  singleActionData: {},
  setSerachEmpty: null,
  previewData: {},
};

export default PreviewAction;
