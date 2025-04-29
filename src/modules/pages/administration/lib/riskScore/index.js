import React, {
  useEffect, useState, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RiskScoreWrapper } from './style';
import ZsButton from '../../../../../components/forms/button';
import ZsToggle from '../../../../../components/forms/toggle';
import ZsInput from '../../../../../components/forms/input';
import { ZsSpin } from '../../../../../components/Spin';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../components/NoData';
import Toaster from '../../../../../components/toaster';
import { TimeFilContext } from '../../../../containers/TimeFilterContext';

let subscribe;

const RiskScoreConfiguration = (props) => {
  const { getRiskScoreAction, updateRiskScoreAction, fakeRiskScoreAction } = props;

  const [tableLoading, setTableLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [riskScoreData, setRiskScoreData] = useState([]);
  const [riskScoreValue, setRiskScoreValue] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const {
    customerID,
  } = useContext(TimeFilContext);

  const riskColors = {
    Reputation: '#cd9a46',
    'User Criticality': '#0990bf',
    'Alert Criticality': '#52c0bf',
    'Asset Vulnerability': '#99bd45',
    'Asset Criticality': '#f16075',
  };

  // *** response of api call start *** //
  const GetRiskScoreRes = useSelector((state) => (
    state.RiskScore.GetRiskScoreResponse ? state.RiskScore.GetRiskScoreResponse : {}
  ));

  const UpdateRiskScoreRes = useSelector((state) => (
    state.RiskScore.UpdateRiskScoreResponse ? state.RiskScore.UpdateRiskScoreResponse : {}
  ));

  const riskScoreOnChangeHandler = useCallback((value, index, type) => {
    const riskScoreValueSet = JSON.parse(JSON.stringify(riskScoreValue));
    setValueEdited(true);
    setErrorMsg(false);
    if (type === 'input') {
      riskScoreValueSet[index].size = value;
    } else if (type === 'toggle') {
      riskScoreValueSet[index].flag = value;
    }
    setRiskScoreValue(riskScoreValueSet);
  }, [riskScoreValue]);

  const editRiskScoreHandler = useCallback(() => {
    if (!PermissionRO('administration', 'riskScore').write) {
      Toaster({ title: "You don't have permission.", type: 'error' });
    } else {
      setValueEdited(false);
      setEditStatus(true);
    }
  }, []);

  const onCancelHandler = useCallback((data) => {
    setEditStatus(false);
    setRiskScoreValue(data);
    setErrorMsg(false);
  }, [riskScoreValue]);

  const submitRiskScoreHandler = useCallback(() => {
    const flaggedItems = riskScoreValue.filter((item) => item.flag);
    const totalSize = flaggedItems.reduce((acc, item) => acc + item.size, 0);

    if (totalSize === 100 || flaggedItems.length === 0) {
      updateRiskScoreAction(riskScoreValue);
      setSubmitLoading(true);
    } else {
      setErrorMsg(true);
    }
  }, [riskScoreValue]);

  const onRiskScoredataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.status && dataRes.module === 'riskScore' && dataRes.operation === 'update') {
      if (dataRes.data.length !== 0 && dataRes.data[0].customerID === localStorage.getItem('customerID')) {
        setRiskScoreData(dataRes.data);
        setRiskScoreValue(dataRes.data);
      }
    }
  };

  useEffect(() => {
    getRiskScoreAction(localStorage.getItem('customerID'));
  }, [customerID]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onRiskScoredataReceived);
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
    if (GetRiskScoreRes.status && GetRiskScoreRes.status === true) {
      setRiskScoreData(GetRiskScoreRes.data);
      setRiskScoreValue(GetRiskScoreRes.data);
      setTableLoading(false);
      fakeRiskScoreAction();
    } else if (GetRiskScoreRes.status === false) {
      setRiskScoreData([]);
      setTableLoading(false);
      fakeRiskScoreAction();
    }
  }, [GetRiskScoreRes]);

  useEffect(() => {
    if (UpdateRiskScoreRes.status && UpdateRiskScoreRes.status === true) {
      setSubmitLoading(false);
      setEditStatus(false);
      fakeRiskScoreAction();
    } else if (UpdateRiskScoreRes.status === false) {
      setSubmitLoading(false);
      fakeRiskScoreAction();
    }
  }, [UpdateRiskScoreRes]);

  // Check user read permission for SLA module
  if (!PermissionRO('administration', 'riskScore').read) {
    return <NoData id="Administration_Risk_Score_No_Permission" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <RiskScoreWrapper id="Administration_Risk_Score_Wrapper">
      <div className="mainRiskBody">
        {tableLoading && <ZsSpin id="AdministrationRiskScoreLoading" />}
        {!tableLoading && (
        <>
          <div className="topTableTitle">
            <div className="tableTitle">Risk score factors weightage configuration</div>
            <div className="wrapButton">
              {editStatus ? (
                <>
                  <ZsButton
                    id="Administration_Risk_Score_Save_Btn"
                    title="Save"
                    className="riskSuccessBtn"
                    loading={submitLoading}
                    disabled={!valueEdited}
                    style={{
                      minWidth: '70px', height: '30px', lineHeight: 0, fontSize: '13px',
                    }}
                    type="primary"
                    key="saveBtn"
                    onClick={() => submitRiskScoreHandler()}
                  />
                  <ZsButton
                    id="Administration_Risk_Score_Cancel_Btn"
                    title="Cancel"
                    style={{
                      minWidth: '70px', height: '30px', lineHeight: 0, fontSize: '13px',
                    }}
                    type="primary"
                    key="cancelBtn"
                    onClick={() => onCancelHandler(riskScoreData)}
                  />
                </>
              ) : (
                <ZsButton
                  id="Administration_Risk_Score_Edit_Btn"
                  title="Edit"
                  style={{
                    minWidth: '70px',
                    height: '30px',
                    lineHeight: 0,
                    fontSize: '13px',
                    opacity: PermissionRO('administration', 'riskScore').write ? 1 : 0.4,
                  }}
                  type="primary"
                  key="editBtn"
                  onClick={() => editRiskScoreHandler()}
                />

              )}
            </div>
          </div>
          <div className="topContent">
            <div className="riskTitle">Score Factor</div>
            <div className="riskTitle2">Weightage Percentage</div>
          </div>
          <div className="bodyContent">
            {riskScoreData.length !== 0 && riskScoreData.map((d, i) => (
              <div className="bodyRow">
                <div className="rowtitle">
                  <div style={{ marginRight: '5px', color: riskColors[d.type] }}>{d.type}</div>
                  <div style={{ marginRight: '5px', marginTop: '3px' }}>{d.description}</div>
                </div>
                <div
                  className="rowValue"
                  style={{
                    opacity: riskScoreValue[i].flag ? 1 : 0.4,
                    pointerEvents: editStatus && riskScoreValue[i].flag ? 'auto' : 'none',
                  }}
                >
                  <ZsInput
                    id={`Administration_Risk_Score_Input_${i}`}
                    inputtype="numeric"
                    value={riskScoreValue[i].size}
                    maxLength="three"
                    style={{
                      background: editStatus ? '#1E1E1F' : '#0b0d0f',
                      width: '50px',
                      height: '25px',
                      lineHeight: 0,
                    }}
                    onChange={(e) => {
                      if (e > 0) {
                        riskScoreOnChangeHandler(e, i, 'input');
                      }
                    }}
                  />
                </div>
                <div
                  className="rowStatus"
                  style={{
                    opacity: editStatus ? 1 : 0.4,
                    pointerEvents: editStatus ? 'auto' : 'none',
                  }}
                >
                  <ZsToggle
                    id={`Administration_RiskScore_Toggle_Switch_Icon_${i}`}
                    value={riskScoreValue[i].flag}
                    onChange={(e) => riskScoreOnChangeHandler(e, i, 'toggle')}
                  />
                </div>
              </div>
            ))}
            {errorMsg && editStatus && (
              <div className="errorMsg">Please adjust the risk score weightage to ensure the total is 100%.</div>
            )}
          </div>
          <div className="tableDesc">
            Ekasha uses the following factors to calculate the incident risk score, with a total
            weightage of 100%. You can enable or disable each factor as needed. Ensure that the
            total percentage of all enabled factors equals 100% for accurate risk assessment.
          </div>
        </>
        )}
      </div>
    </RiskScoreWrapper>
  );
};
RiskScoreConfiguration.propTypes = {
  getRiskScoreAction: PropTypes.func,
  updateRiskScoreAction: PropTypes.func,
  fakeRiskScoreAction: PropTypes.func,
};

RiskScoreConfiguration.defaultProps = {
  getRiskScoreAction: null,
  updateRiskScoreAction: null,
  fakeRiskScoreAction: null,
};
export default RiskScoreConfiguration;
