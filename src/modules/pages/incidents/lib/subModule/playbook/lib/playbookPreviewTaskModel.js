/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ReactJson from 'react-json-view';
import ZsModal from '../../../../../../../components/modal';
import NoData from '../../../../../../../components/NoData';
import { convertTimeBaseTimeZoneFunction } from '../../../../../../../helpers/lib/StorageHandlers';
import Icons from '../../../../../../../components/icons';
import { IncPlaybookActionPreviewWrapper } from '../style';
import ZsSelect from '../../../../../../../components/forms/select';
import ZsTabs from '../../../../../../../components/tabs';
import ZsTooltip from '../../../../../../../components/tooltip';
import { ExecutionCountData } from '../../../../../../../helpers/envData';

const PlaybookPreviewTaskModel = (props) => {
  const {
    actionResult, actionModel, setActionModel,
  } = props;

  const [activeDetailTab, setActiveDetailTab] = useState('Result');
  const [displayResponse, setDisplayResponse] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [tabData, setTabData] = useState([]);
  const [selectTabData, setSelectTabData] = useState('0');

  useEffect(() => {
    const ExecutionCountDataSet = JSON.parse(JSON.stringify(ExecutionCountData));
    const data = ExecutionCountDataSet.splice(0, actionResult.length);
    setTabData(data);
  }, []);
  const calculateDuration = (start, executeTime) => {
    const created = moment(new Date(start));
    const expectedEnd = moment(new Date(executeTime));
    const total = expectedEnd.diff(created);
    if (total > 86400000) {
      return `${Math.floor((total / (1000 * 60 * 60 * 24)).toString())} Day`;
    }
    if (total > 3600000) {
      return `${Math.floor((total / (1000 * 60 * 60)).toString())} Hr.`;
    }
    if (total > 60000) {
      return `${Math.floor((total / (1000 * 60)).toString()).toString()} Min.`;
    }
    if (Math.floor((total / 1000)) > 0) {
      return `${Math.floor((total / 1000).toString())} Sec.`;
    }
    return '0 Sec.';
  };

  const tabChange = (e) => {
    setActiveDetailTab(e);
  };

  const flatten = (obj, roots = [], sep = '.') => Object
    // find props of given object
    .keys(obj)
    // return an object by iterating props
    .reduce((memo, prop) => ({
      // create a new object

      // include previously returned object
      ...memo,
      ...(Object.prototype.toString.call(obj[prop]) === '[object Object]'
        // keep working if value is an object
        ? flatten(obj[prop], roots.concat([prop]), sep)
        // include current prop and value and prefix prop with the roots
        : { [roots.concat([prop]).join(sep)]: obj[prop] }),
    }), {});
  useEffect(() => {
    if (actionResult[selectTabData]?.result !== null && actionResult[selectTabData]?.result !== undefined
      && actionResult[selectTabData]?.result?.length !== 0
      && [actionResult[selectTabData]?.result] && [actionResult[selectTabData]?.result]?.length > 0) {
      const dd = flatten(actionResult[selectTabData].result);
      setPreviewData(dd);
    }
  }, [actionResult]);

  const formateValue = (value) => {
    // if (!value) {
    //   return '';
    // }
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
  };

  return (
    <ZsModal
      modaltype="simple"
      title="Action Result"
      onHide={() => setActionModel(false)}
      data-test="create_playbook_modal"
      className="incidentplaybookPreviewModal"
      show={actionModel}
      centered
      width={650}
    >
      <IncPlaybookActionPreviewWrapper>
        <div className="innerBody" style={{ height: '620px', margin: '8px 0 0 0', overflow: 'hidden' }}>
          {actionResult.length > 1 && (
            <div style={{ margin: '0 0 10px 0' }}>
              <ZsSelect
                id="Incident_Playbook_Action_Preview_Model_Select"
                value={selectTabData || '0'}
                selecttype="normal"
                placeholder="Select"
                onChange={(e) => setSelectTabData(e)}
                data={tabData}
              />
            </div>
          )}
          <div
            className="previewTopPart"
            // style={{ height: arrowtype ? '155px' : executeActionResult?.terminatedBy ? '255px' : executeActionResult?.scheduledTime ? '250px' : '205px' }}
            style={{ height: '205px' }}
          >
            <div className="parameter">
              <div className="fullWidth">
                <div className="controlLabel" style={{ marginBottom: '0px' }}>
                  App Name
                </div>
                <div className="controlTitle">
                  <ZsTooltip title={actionResult[selectTabData].product} ids={`assetName_${actionResult[selectTabData].product}`}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`assetName_${actionResult[selectTabData].product}`}>{actionResult[selectTabData].product}</div>
                  </ZsTooltip>
                </div>
              </div>
              <div className="fullWidth">
                <div className="controlLabel" style={{ marginBottom: '0px' }}>
                  Action Name
                </div>
                <div className="controlTitle">
                  <ZsTooltip title={actionResult[selectTabData].actionName} ids={`Incident_Action_Title_${actionResult[selectTabData].actionName}`}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_Title_${actionResult[selectTabData].actionName}`}>{actionResult[selectTabData].actionName}</div>
                  </ZsTooltip>
                </div>
              </div>
              <div className="fullWidth">
                <div className="controlLabel" style={{ marginBottom: '0px' }}>
                  Device Name
                </div>
                <div className="controlTitle">
                  <ZsTooltip title={actionResult[selectTabData].assetName} ids={`Incident_Action_Device_${actionResult[selectTabData].assetName}`}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} id={`Incident_Action_Device_${actionResult[selectTabData].assetName}`}>{actionResult[selectTabData].assetName}</div>
                  </ZsTooltip>
                </div>
              </div>
              <div className="fullWidth">
                <div className="controlLabel" style={{ marginBottom: '0px' }}>
                  Executed By
                </div>
                <div className="controlTitle">
                  {actionResult[selectTabData].executeBy}
                </div>
              </div>
              {actionResult[selectTabData]?.executeTime && (
                <div className="fullWidth">
                  <div className="controlLabel" style={{ marginBottom: '0px' }}>
                    Executed Time
                  </div>
                  <div className="controlTitle">
                    {convertTimeBaseTimeZoneFunction(actionResult[selectTabData].executeTime)}
                  </div>
                </div>
              )}
              <div className="fullWidth">
                <div className="controlLabel" style={{ marginBottom: '0px' }}>
                  Created Time
                </div>
                <div className="controlTitle">
                  {convertTimeBaseTimeZoneFunction(actionResult[selectTabData].createdTime)}
                </div>
              </div>
              <div className="fullWidth">
                <div className="controlLabel" style={{ marginBottom: '0px' }}>
                  Execution Time
                </div>
                <div className="controlTitle">
                  {calculateDuration(actionResult[selectTabData].createdTime,
                    actionResult[selectTabData].executeTime)}
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
                      type={actionResult[selectTabData].status}
                      icontype="globle"
                      className="btmIcn"
                    />
                  </div>
                  <span style={{ marginLeft: '10px', fontSize: '12px', lineHeight: '21px' }}>
                    {actionResult[selectTabData].status}
                  </span>
                </div>
              </div>
              {actionResult[selectTabData]?.terminatedBy && (
                <div className="fullWidth">
                  <div className="controlLabel" style={{ marginBottom: '0px' }}>
                    Terminated By
                  </div>
                  <div className="controlTitle">
                    {actionResult[selectTabData].terminatedBy}
                  </div>
                </div>
              )}
              {actionResult[selectTabData]?.terminatedTime && (
                <div className="fullWidth">
                  <div className="controlLabel" style={{ marginBottom: '0px' }}>
                    Terminated Time
                  </div>
                  <div className="controlTitle">
                    {convertTimeBaseTimeZoneFunction(actionResult[selectTabData].terminatedTime)}
                  </div>
                </div>
              )}
              {actionResult[selectTabData]?.scheduledTime && (
                <div className="fullWidth">
                  <div className="controlLabel" style={{ marginBottom: '0px' }}>
                    Scheduled Time
                  </div>
                  <div className="controlTitle">
                    {convertTimeBaseTimeZoneFunction(actionResult[selectTabData].scheduledTime)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className="colUp"
            // style={{ transform: arrowtype ? 'rotate(0)' : 'rotate(180deg)' }}
            style={{ transform: 'rotate(0)' }}
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
              id="actionTabs"
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
                      {/* {searchData.length > 0
                              && <Icons type="error" data-test="clearSerach" className="clearSerach" style={{ right: '174px' }} icontype="common" onClick={() => setSerachEmpty()} />}
                            <ZsInput
                              id="INCIDENT_Action_RESULT_Search"
                              inputtype="normal"
                              style={{ padding: '14px', width: '95%' }}
                              placeholder="Search"
                              value={searchData || null}
                              onChange={(e) => {
                                searchActionData(e, singleActionData);
                              }}
                            /> */}
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
                              id="action_response_backBtn"
                              className="backButton"
                            >
                              <div className="arrow1" />
                            </div>
                          </span>
                        )
                        : (
                          <span
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
                  {actionResult[selectTabData]?.result !== null
                    && actionResult[selectTabData]?.result?.length !== 0
                    && [actionResult[selectTabData].result] && [actionResult[selectTabData].result].length > 0
                    ? (
                      <div>
                        {displayResponse
                          ? (
                            <div
                              className="designedData1"
                              style={{ height: actionResult.length > 1 ? '260px' : '300px' }}
                            // style={{ height: arrowtype ? '325px' : executeActionResult?.terminatedBy ? '225px' : executeActionResult?.scheduledTime ? '225px' : '275px' }}
                            >
                              <ReactJson
                                enableClipboard
                                name={false}
                                displayDataTypes={false}
                                indentWidth={1}
                                theme="bright"
                                src={[actionResult[selectTabData].result][0]}
                                style={{
                                  fontSize: '13px', background: 'transparent', fontFamily: "'Open Sans',sans-serif",
                                }}
                              />
                            </div>
                          )
                          : (
                            <div
                              className="designedData"
                              style={{
                                background: '#181919',
                                height: actionResult.length > 1 ? '260px' : '300px',
                                // height: arrowtype ? '325px' : executeActionResult?.terminatedBy ? '225px' : executeActionResult?.scheduledTime ? '225px' : '275px',
                              }}
                            >
                              <div className="wrapTable">
                                <div className="wrapTableHeader">
                                  <div className="fieldTitle">
                                    Fields
                                  </div>
                                  <div className="fieldTitleValue">
                                    Values
                                  </div>
                                </div>
                                {previewData && Object.keys(previewData).map((d, i) => (
                                  <div className="wrapTableContent" key={i}>
                                    <div className="fieldTitle" style={{ textTransform: 'capitalize' }}>
                                      {d}
                                    </div>
                                    <div className="fieldTitleValue">
                                      {formateValue(previewData[d])}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <NoData
                        message="No data"
                        style={{
                          background: !displayResponse ? '#181919' : 'transparent',
                          marginTop: '8px',
                          height: '260px',
                          // height: arrowtype ? '325px' : executeActionResult?.terminatedBy ? '225px' : executeActionResult?.scheduledTime ? '225px' : '275px',
                          position: 'relative',
                          top: '50%',
                          left: '0px',
                        }}
                      />
                    )}
                </div>
              )}
            {
              activeDetailTab === 'Data'
              && (
                <>
                  {
                    actionResult[selectTabData].requireParam
                      && actionResult[selectTabData].requireParam
                      ? (
                        <div className="borderBox">
                          <label className="borderBoxTitle">Parameters</label>
                          {actionResult[selectTabData]?.requireParam && (
                            actionResult[selectTabData].requireParam
                            && actionResult[selectTabData].requireParam.map((e, i) => (
                              <div key={i}>
                                <div className="controlLabel" style={{ marginBottom: '0px', width: '100%', display: 'flex' }}>
                                  <span style={{ width: '40%' }}>
                                    {e.actionField}
                                    {' '}
                                    :
                                  </span>
                                  <div style={{
                                    minWidth: 'auto', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis',
                                  }}
                                  >
                                    <ZsTooltip title={e.value || '-'}>
                                      {e.value || '-'}
                                    </ZsTooltip>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <NoData style={{
                          height: '95%', position: 'relative', top: '150px', left: '0px',
                        }}
                        />
                      )
                  }
                </>
              )
            }
          </div>
        </div>
      </IncPlaybookActionPreviewWrapper>
    </ZsModal>
  );
};
export default PlaybookPreviewTaskModel;
