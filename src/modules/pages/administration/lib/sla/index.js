import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { SlaWrapper } from './style';
import ZsButton from '../../../../../components/forms/button';
import ZsInput from '../../../../../components/forms/input';
import ZsSelect from '../../../../../components/forms/select';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../components/NoData';
import { severityColor } from '../../../../../helpers/envData';
import Icons from '../../../../../components/icons';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../components/Spin';
import { TimeFilContext } from '../../../../containers/TimeFilterContext';

let subscribe;

const Sla = React.memo((props) => {
  const {
    findAllSlaAction, updateSlaAction, fakeActionSla,
    findAllRiskWeightageAction, fakeRiskWeightageAction, updateRiskWeightageAction,
  } = props;

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState({
    SLA: false,
    Risk: false,
  });
  const [editStatus, setEditStatus] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [slaListData, setSlaListData] = useState([]);
  const [slaListValue, setSlaListValue] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [riskEditStatus, setRiskEditStatus] = useState(false);
  const [riskWeightageData, setRiskWeightageData] = useState([]);
  const [riskWeightageValue, setRiskWeightageValue] = useState([]);
  const [riskValueEdited, setRiskValueEdited] = useState(false);
  const [riskSubmitLoading, setRiskSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    customerID,
  } = useContext(TimeFilContext);

  const FindAllSlaRes = useSelector((state) => (state.Sla.FindAllSlaResponse || {}));
  const UpdateSlaRes = useSelector((state) => (state.Sla.UpdateSlaResponse || {}));
  const FindAllRiskWeightageRes = useSelector((state) => (
    state.RiskWeightage.FindAllRiskWeightageResponse || {}));
  const UpdateRiskWeightageRes = useSelector((state) => (
    state.RiskWeightage.UpdateRiskWeightageResponse || {}));

  const validateRanges = () => {
    // Check if any range is outside 1-100
    // for (const severity in riskWeightageValue) {
    //   if (riskWeightageValue[severity].min < 1 || riskWeightageValue[severity].max > 100) {
    //     return 'All ranges must be between 1 and 100';
    //   }
    // }
    // Check if ranges overlap or are in incorrect order
    if (riskWeightageValue[0].min <= riskWeightageValue[1].max
            || riskWeightageValue[1].min <= riskWeightageValue[2].max
            || riskWeightageValue[2].min <= riskWeightageValue[3].max) {
      return 'Ranges must not overlap and must be in descending order of severity';
    }

    // Check if min is greater than max for any range
    // eslint-disable-next-line no-restricted-syntax
    for (const severity in riskWeightageValue) {
      if (riskWeightageValue[severity].min > riskWeightageValue[severity].max) {
        return `${riskWeightageValue[severity].severity} severity: Min value cannot be greater than max value`;
      }
    }

    if (riskWeightageValue[0].max !== 100) {
      return 'Critical severity value must be 100';
    }
    if (riskWeightageValue[3].min !== 1) {
      return 'Low severity value must be 1';
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < riskWeightageValue.length; i++) {
      const { severity } = riskWeightageValue[i];
      const range = riskWeightageValue[i];

      // if (range.min < 1 || range.max > 100 || range.min > range.max) {
      //   return `Invalid range for ${severity} severity`;
      // }

      if (i < riskWeightageValue.length - 1) {
        const nextRange = riskWeightageValue[i + 1];
        if (range.min !== nextRange.max + 1) {
          return `Gap or overlap between ${severity} and ${riskWeightageValue[i + 1].severity} severities`;
        }
      }
    }

    return ''; // No errors
  };

  const SLAOnChangeHandler = useCallback((value, index, type) => {
    const slaListValueSet = JSON.parse(JSON.stringify(slaListValue));
    setValueEdited(true);
    slaListValueSet[index][type] = value;
    setSlaListValue(slaListValueSet);
  }, [slaListValue]);

  const submitSLAHandler = useCallback(() => {
    setSubmitLoading(true);
    updateSlaAction(slaListValue);
  }, [slaListValue]);

  const editSLAHandler = useCallback(() => {
    if (!PermissionRO('administration', 'sla').write) {
      Toaster({ title: "You don't have permission.", type: 'error' });
    } else {
      setValueEdited(false);
      setEditStatus(true);
    }
  }, []);

  const onCancelSLAHandler = useCallback((data) => {
    setEditStatus(false);
    setSlaListValue(data);
  }, []);

  const RiskOnChangeHandler = useCallback((value, index, type) => {
    const riskWeightageValueSet = JSON.parse(JSON.stringify(riskWeightageValue));
    setRiskValueEdited(true);
    riskWeightageValueSet[index][type] = value;
    setRiskWeightageValue(riskWeightageValueSet);
  }, [riskWeightageValue]);

  const submitRiskHandler = useCallback(() => {
    if (!errorMsg) {
      setRiskSubmitLoading(true);
      updateRiskWeightageAction(riskWeightageValue);
    }
  }, [riskWeightageValue, errorMsg]);

  const editRiskHandler = useCallback(() => {
    if (!PermissionRO('administration', 'sla').write) {
      Toaster({ title: "You don't have permission.", type: 'error' });
    } else {
      setRiskValueEdited(false);
      setRiskEditStatus(true);
    }
  }, []);

  const onCancelRiskHandler = useCallback((data) => {
    setRiskEditStatus(false);
    setRiskWeightageValue(data);
  }, []);

  const onSlaAndRiskdataReceived = useCallback((payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.status && dataRes.module === 'sla' && dataRes.operation === 'update') {
      if (dataRes.data.length !== 0 && dataRes.data[0].customerID === localStorage.getItem('customerID')) {
        setSlaListData(dataRes.data);
        setSlaListValue(dataRes.data);
      }
    }
    if (dataRes.status && dataRes.module === 'riskWeightage' && dataRes.operation === 'update') {
      if (dataRes.data.length !== 0 && dataRes.data[0].customerID === localStorage.getItem('customerID')) {
        setRiskWeightageData(dataRes.data);
        setRiskWeightageValue(dataRes.data);
      }
    }
  }, []);

  useEffect(() => {
    if (riskWeightageValue.length !== 0) {
      const validationError = validateRanges();
      setErrorMsg(validationError);
    }
  }, [riskWeightageValue]);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'sla').read) {
        setLoading(true);
        findAllSlaAction(localStorage.getItem('customerID'));
        findAllRiskWeightageAction(localStorage.getItem('customerID'));
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      setSlaListData([]);
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData, customerID]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onSlaAndRiskdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    if (FindAllSlaRes.status) {
      setSlaListData(FindAllSlaRes.data);
      setSlaListValue(FindAllSlaRes.data);
      setTableLoading((prev) => ({ ...prev, SLA: true }));
      fakeActionSla();
    } else if (FindAllSlaRes.status === false) {
      setSlaListData([]);
      setTableLoading({ ...tableLoading, SLA: false });
      fakeActionSla();
    }
  }, [FindAllSlaRes]);

  useEffect(() => {
    if (UpdateSlaRes.status) {
      setSubmitLoading(false);
      setEditStatus(false);
      fakeActionSla();
    } else if (UpdateSlaRes.status === false) {
      setSubmitLoading(false);
      fakeActionSla();
    }
  }, [UpdateSlaRes]);

  useEffect(() => {
    if (FindAllRiskWeightageRes.status) {
      setRiskWeightageData(FindAllRiskWeightageRes.data);
      setRiskWeightageValue(FindAllRiskWeightageRes.data);
      setTableLoading((prev) => ({ ...prev, Risk: true }));
      fakeRiskWeightageAction();
    } else if (FindAllRiskWeightageRes.status === false) {
      setRiskWeightageData([]);
      setTableLoading({ ...tableLoading, Risk: false });
      fakeRiskWeightageAction();
    }
  }, [FindAllRiskWeightageRes]);

  useEffect(() => {
    if (UpdateRiskWeightageRes.status) {
      setRiskSubmitLoading(false);
      setRiskEditStatus(false);
      fakeRiskWeightageAction();
    } else if (UpdateRiskWeightageRes.status === false) {
      setRiskSubmitLoading(false);
      fakeRiskWeightageAction();
    }
  }, [UpdateRiskWeightageRes]);

  useEffect(() => {
    if (tableLoading.SLA && tableLoading.Risk) {
      setLoading(false);
    }
  }, [tableLoading]);

  if (!PermissionRO('administration', 'sla').read) {
    return <NoData id="Administration_SLA_No_Permission" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <SlaWrapper id="Administration_SLA_Wrapper">
      {loading && <ZsSpin id="AdministrationSLALoading" />}
      {!loading && (
        <>
          <div className="IncidentSeverity">
            <div className="topTableTitle">
              <div className="tableTitle">SLA configuration per incident severity</div>
              <div className="wrapButton">
                {editStatus ? (
                  <>
                    <ZsButton
                      id="Administration_SLA_Save_Btn"
                      title="Save"
                      className="riskSuccessBtn"
                      loading={submitLoading}
                      disabled={!valueEdited}
                      style={{
                        minWidth: '70px', height: '30px', lineHeight: 0, fontSize: '13px',
                      }}
                      type="primary"
                      key="saveBtn"
                      onClick={() => submitSLAHandler()}
                    />
                    <ZsButton
                      id="Administration_SLA_Cancel_Btn"
                      title="Cancel"
                      style={{
                        minWidth: '70px', height: '30px', lineHeight: 0, fontSize: '13px',
                      }}
                      type="primary"
                      key="cancelBtn"
                      onClick={() => onCancelSLAHandler(slaListData)}
                    />
                  </>
                ) : (
                  <ZsButton
                    id="Administration_SLA_Edit_Btn"
                    title="Edit"
                    style={{
                      minWidth: '70px',
                      height: '30px',
                      lineHeight: 0,
                      fontSize: '13px',
                      opacity: PermissionRO('administration', 'sla').write ? 1 : 0.4,
                    }}
                    type="primary"
                    key="editBtn"
                    onClick={() => editSLAHandler()}
                  />

                )}
              </div>
            </div>
            <div className="topContent">
              <div className="rowIndex" />
              <div className="slaLeftTitle">Severity Level</div>
              <div className="slaRightTitle">Target Resolution Time</div>
            </div>
            <div className="bodyContent">
              {slaListData.length !== 0 && slaListData.map((d, i) => (
                <div className="bodyRow">
                  <div className="rowIndex">{i + 1}</div>
                  <div className="rowtitle">
                    <div className="rowWrapTitle">
                      <Icons
                        id="incidentList_Common_Icon"
                        icontype="common"
                        type={d.severity.toLowerCase()}
                        className="tIcon"
                      />
                      <div style={{ marginLeft: '5px', color: severityColor[d.severity.toLowerCase()] }}>{d.severity}</div>
                    </div>
                    <div style={{ marginRight: '5px', marginTop: '3px' }}>{d.description}</div>
                  </div>
                  <div className="rowValue">
                    <div>
                      {editStatus ? (
                        <ZsInput
                          id={`Administration_SLA_Resolve_Time_Input_${i}`}
                          inputtype="numeric"
                          value={slaListValue[i].resolveTime}
                          maxLength="three"
                          onChange={(e) => {
                            if (e > 0) {
                              SLAOnChangeHandler(e, i, 'resolveTime');
                            }
                          }}
                          style={{
                            width: '45px',
                            height: '25px',
                            lineHeight: 0,
                          }}
                        />
                      ) : (
                        <div style={{ color: '#fff' }}>{slaListValue[i].resolveTime}</div>
                      )}
                    </div>
                    <div
                      style={{
                        marginLeft: editStatus ? '10px' : '5px',
                      }}
                    >
                      {editStatus ? (
                        <ZsSelect
                          id={`Administration_SLA_Unit_Select_${i}`}
                          selecttype="normal"
                          value={slaListValue[i].unit}
                          onChange={(e) => SLAOnChangeHandler(e, i, 'unit')}
                          style={{
                            width: '120px',
                            height: '25px',
                            lineHeight: 0,
                          }}
                          data={[
                            { name: 'Minutes', value: 'Minutes' },
                            { name: 'Hours', value: 'Hours' },
                            { name: 'Days', value: 'Days' },
                          ]}
                        />
                      ) : (
                        <div style={{ color: '#fff' }}>{slaListValue[i].unit}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="tableDesc">
              Configure the SLA for each incident severity level. The corresponding
              SLA will be displayed in the incident details, showing the targeted
              due timeframe. Any changes in SLA configuration will apply only to new incidents.
            </div>
          </div>
          <div className="RiskSeverity" style={{ marginTop: '30px' }}>
            <div className="topTableTitle">
              <div className="tableTitle">Incident severity per risk weightage</div>
              <div className="wrapButton">
                {riskEditStatus ? (
                  <>
                    <ZsButton
                      id="Administration_Risk_Weightage_Save_Btn"
                      title="Save"
                      className="riskSuccessBtn"
                      loading={riskSubmitLoading}
                      disabled={!riskValueEdited}
                      style={{
                        minWidth: '70px', height: '30px', lineHeight: 0, fontSize: '13px',
                      }}
                      type="primary"
                      key="saveBtn"
                      onClick={() => submitRiskHandler()}
                    />
                    <ZsButton
                      id="Administration_Risk_Weightage_Cancel_Btn"
                      title="Cancel"
                      style={{
                        minWidth: '70px', height: '30px', lineHeight: 0, fontSize: '13px',
                      }}
                      type="primary"
                      key="cancelBtn"
                      onClick={() => onCancelRiskHandler(riskWeightageData)}
                    />
                  </>
                ) : (
                  <ZsButton
                    id="Administration_Risk_Weightage_Edit_Btn"
                    title="Edit"
                    style={{
                      minWidth: '70px',
                      height: '30px',
                      lineHeight: 0,
                      fontSize: '13px',
                      opacity: PermissionRO('administration', 'sla').write ? 1 : 0.4,
                    }}
                    type="primary"
                    key="editBtn"
                    onClick={() => editRiskHandler()}
                  />

                )}
              </div>
            </div>
            <div className="topContent">
              <div className="rowIndex" />
              <div className="slaLeftTitle">Severity Level</div>
              <div className="slaRightTitle">Severity Range</div>
            </div>
            <div className="bodyContent">
              {riskWeightageData.length !== 0 && riskWeightageData.map((d, i) => (
                <div className="bodyRow">
                  <div className="rowIndex">{i + 1}</div>
                  <div className="rowtitle">
                    <div className="rowWrapTitle">
                      <div
                        style={{ color: severityColor[d.severity.toLowerCase()] }}
                      >
                        {d.severity}
                      </div>
                    </div>
                    <div style={{ marginRight: '5px', marginTop: '3px' }}>{d.description}</div>
                  </div>
                  <div className="rowValue">
                    <div>
                      {riskEditStatus ? (
                        <div style={{ display: 'flex' }}>
                          <ZsInput
                            id={`Administration_Risk_Weightage_Min_Input_${i}`}
                            inputtype="numeric"
                            value={riskWeightageValue[i].min}
                            maxLength="three"
                            onChange={(e) => {
                              if (e > 0 && e <= 100) {
                                RiskOnChangeHandler(e, i, 'min');
                              }
                            }}
                            style={{
                              width: '45px',
                              height: '25px',
                              lineHeight: 0,
                            }}
                          />
                          <ZsInput
                            id={`Administration_Risk_Weightage_Max_Input_${i}`}
                            inputtype="numeric"
                            value={riskWeightageValue[i].max}
                            maxLength="three"
                            onChange={(e) => {
                              if (e > 0 && e <= 100) {
                                RiskOnChangeHandler(e, i, 'max');
                              }
                            }}
                            style={{
                              width: '45px',
                              height: '25px',
                              lineHeight: 0,
                              marginLeft: '10px',
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{ color: '#fff' }}>
                          {riskWeightageValue[i].min}
                          {' '}
                          -
                          {' '}
                          {riskWeightageValue[i].max}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {errorMsg && (
              <div className="errorMsg">{errorMsg}</div>
              )}
            </div>
            <div className="tableDesc">
              Ekasha can assign incident severity based on the defined risk weightage score range.
            </div>
          </div>
        </>
      )}
    </SlaWrapper>
  );
});
Sla.propTypes = {
  findAllSlaAction: PropTypes.func,
  updateSlaAction: PropTypes.func,
  fakeActionSla: PropTypes.func,
  findAllRiskWeightageAction: PropTypes.func,
  updateRiskWeightageAction: PropTypes.func,
  fakeRiskWeightageAction: PropTypes.func,
};

Sla.defaultProps = {
  findAllSlaAction: null,
  updateSlaAction: null,
  fakeActionSla: null,
  findAllRiskWeightageAction: null,
  updateRiskWeightageAction: null,
  fakeRiskWeightageAction: null,
};
export default Sla;
