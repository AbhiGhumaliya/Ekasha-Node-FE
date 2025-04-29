import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import Icons from '../../../../../../components/icons';
import NoData from '../../../../../../components/NoData';
import ZsSelect from '../../../../../../components/forms/select';
import { WorkbookWrapper } from './style';
import ZsModal from '../../../../../../components/modal';
import Toaster from '../../../../../../components/toaster';
import { PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../components/Spin';

let subscribe;

const Workbook = React.memo((props) => {
  const {
    IncidentId, getAssignedWorkbookAction, fakeWorkbookAction,
    getAllWorbookAction, assignWorkbook, deleteAssignedAction, selectIncident,
  } = props;

  const [iWorkbook, setiWorkbook] = useState({});
  const [assignWorkbookName, setAssignWorkbookName] = useState('');
  const [newOne, setNewOne] = useState(false);
  const [loadingNodata, setLoadingNoData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPhase, setOpenPhase] = useState('');
  const [selectedWorkbook, setSelectedWorkbook] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allWorkbooks, setAllWorkbooks] = useState([]);
  // permission read

  // api Response in const

  const GetAssignedWorkbookRes = useSelector(
    (state) => (state.IncidentWorkbook.GetAssignedWorkbookResponse || {}),
  );
  const GetAllIncidentWrokbookResponse = useSelector(
    (state) => (state.IncidentWorkbook.GetAllIncidentWrokbookResponse || {}),
  );
  const AssingedWorkbookRes = useSelector(
    (state) => (state.IncidentWorkbook.AssingedWorkbookResponse || {}),
  );
  const DeleteAssignedWorkbookRes = useSelector(
    (state) => (state.IncidentWorkbook.DeleteAssignedWorkbookResponse || {}),
  );

  const assignedToTokenSock = (dataRes) => {
    if (dataRes.status) {
      const newData = dataRes.data;
      if (IncidentId === parseInt(newData.incidentId)) {
        setAssignWorkbookName(newData.assignedBy);
        const xy = JSON.parse(newData.workbookdata);
        const d = [];

        xy.forEach((e, i) => {
          d.push({ ...e, token: e.name + i });
        });
        setiWorkbook((prevState) => {
          if (dataRes.data.customerID === localStorage.getItem('customerID')) {
            return ({ data: d, workbookName: newData.workbookName, ...prevState });
          }
          return prevState;
        });
        setSelectedWorkbook(newData.token);
        setLoadingNoData(false);
      }
    }
  };
  // socket Method

  const onWorkbookDataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'workbook') {
      switch (dataRes.operation) {
        case 'assignedToToken':
          assignedToTokenSock(dataRes);
          break;
        case 'removeAssign':
          if (dataRes.status) {
            if (IncidentId === parseInt(dataRes.data.incidentId) && dataRes.data.customerID === localStorage.getItem('customerID')) {
              setiWorkbook({});
            }
          }
          break;
        case 'workbookDeleteAssign':
          if (dataRes.status) {
            dataRes.data.forEach((e) => {
              if (IncidentId === parseInt(e.incidentId) && e.customerID === localStorage.getItem('customerID')) {
                setiWorkbook({});
              }
            });
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (IncidentId > 0) {
      setLoadingNoData(true);
      setSelectedWorkbook(null);
      setiWorkbook({});
      setNewOne(false);
      getAssignedWorkbookAction(IncidentId, localStorage.getItem('customerID'));
    }
  }, []);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onWorkbookDataReceived);
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
    setLoadingNoData(true);
  }, [IncidentId]);

  const DeleteConfirm = () => {
    setLoading(true);
    setAssignWorkbookName('');
    setOpenPhase('');
    deleteAssignedAction(IncidentId, localStorage.getItem('customerID'));
  };

  // AssignedWorkbook Response handle

  useEffect(() => {
    if (GetAssignedWorkbookRes.status === true) {
      if (GetAssignedWorkbookRes.data) {
        const xy = GetAssignedWorkbookRes.data;
        setAssignWorkbookName(xy.assignedBy);
        if (xy.workbookData) {
          if (xy.workbookData.length > 0) {
            const d = [];
            xy.workbookData.forEach((e, i) => {
              d.push({ ...e, token: e.name + i });
            });
            const iWorkbook1 = { data: d, workbookName: xy.workbookName };
            setiWorkbook(iWorkbook1);
            setLoadingNoData(false);
          }
        }
      }
      fakeWorkbookAction();
    } else if (GetAssignedWorkbookRes.status === false) {
      setLoadingNoData(false);
      setAssignWorkbookName('');
      setiWorkbook([]);
      fakeWorkbookAction();
    }
  }, [GetAssignedWorkbookRes]);

  // GetAllWorkbook Response handle

  useEffect(() => {
    if (GetAllIncidentWrokbookResponse.status === true) {
      if (GetAllIncidentWrokbookResponse.data) {
        setAllWorkbooks(GetAllIncidentWrokbookResponse.data);
        fakeWorkbookAction();
      }
    } else if (GetAllIncidentWrokbookResponse.status === false) {
      setAllWorkbooks([]);
      fakeWorkbookAction();
    }
  }, [GetAllIncidentWrokbookResponse]);

  // assignWorkbook Response handle

  useEffect(() => {
    if (AssingedWorkbookRes.status === true) {
      setLoading(false);
      fakeWorkbookAction();
    } else if (AssingedWorkbookRes.status === false) {
      setLoading(false);
      fakeWorkbookAction();
    }
  }, [AssingedWorkbookRes]);

  // deleteAssignedWorkbook Response Handle

  useEffect(() => {
    if (DeleteAssignedWorkbookRes && DeleteAssignedWorkbookRes.status === true) {
      setiWorkbook({});
      setLoading(false);
      setOpenDeleteModal(false);
      setSelectedWorkbook(null);
      fakeWorkbookAction();
    } else if (DeleteAssignedWorkbookRes && DeleteAssignedWorkbookRes.status === false) {
      setLoading(false);
      setOpenDeleteModal(false);
      fakeWorkbookAction();
    }
  }, [DeleteAssignedWorkbookRes]);

  useEffect(() => {
    window.addEventListener('mousedown', (e) => {
      if (newOne) {
        if (document.getElementById('pMenuOpen2')) {
          if (!document.getElementById('pMenuOpen2').contains(e.target)) {
            setSelectedWorkbook(null);
            setNewOne(false);
          }
        }
      }
    });
  }, [newOne]);

  const assignNewWorkbookHandlar = useCallback(() => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setNewOne(!newOne);
      getAllWorbookAction();
    }
  }, [selectIncident]);

  const deleteIncidentWorkbook = useCallback(() => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setOpenDeleteModal(true);
    }
  }, [selectIncident]);

  // permission read
  if (!PermissionRO('incidents', 'incidentWorkbook').read) {
    return <NoData id="dont_have_pr_workbook" data-test="dont_have_pr_workbook" message="You don't have permission to access this page" />;
  }

  return (
    <WorkbookWrapper id="incident_workbook_wrapper" data-test="incident_workbook_wrapper">
      {!iWorkbook.workbookName
        ? (
          <div className="newBtn">
            <ZsButton
              id="workbook_assign"
              style={{ float: 'right', opacity: loading || !PermissionRO('incidents', 'incidentWorkbook').write ? '0.4' : '1' }}
              type="primary"
              className="actionAddBtn"
              data-test="workbook_create_assign"
              title={loading ? 'Assigning' : '+ Assign'}
              loading={loading}
              onClick={() => (PermissionRO('incidents', 'incidentWorkbook').write ? assignNewWorkbookHandlar() : Toaster({ title: "You don't have permission.", type: 'error' }))}
            />
            {newOne ? (
              <div id="pMenuOpen2" className={newOne ? 'pMenu pMenuOpen' : 'pMenu'}>
                <ZsSelect
                  id="Iworkbook_search"
                  label="Select workbook :"
                  data={allWorkbooks}
                  placeholder="Select"
                  selecttype="normal"
                  data-test="workbook_select"
                  value={selectedWorkbook || null}
                  onChange={(e) => {
                    setSelectedWorkbook(e);
                  }}
                />
                <ZsButton
                  id="workbook_assign1"
                  style={{ marginTop: 45, float: 'right' }}
                  type="primary"
                  title="OK"
                  disabled={!selectedWorkbook}
                  data-test="workbook_ok"
                  onClick={() => {
                    if (selectedWorkbook) {
                      assignWorkbook({
                        wToken: selectedWorkbook,
                        incidentId: IncidentId,
                        customerID: localStorage.getItem('customerID'),
                      });
                      setNewOne(false);
                      setSelectedWorkbook(null);
                      setLoading(true);
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
        )
        : null}

      { iWorkbook.workbookName ? (
        <div className="pTitle flexSpace">
          <div style={{ wordBreak: 'break-all', marginRight: '10px' }}>{iWorkbook.workbookName}</div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <span style={{ color: 'rgb(78, 139, 255)', whiteSpace: 'nowrap', fontSize: '12px' }}>
              Assigned By :
            </span>
            <div style={{
              display: 'flex', margin: '0 10px', fontSize: '12px',
            }}
            >
              <div className="userPic">{assignWorkbookName?.charAt(0)}</div>
              <div style={{ whiteSpace: 'nowrap', marginLeft: '5px' }}>{assignWorkbookName}</div>
            </div>
            <Icons
              id="workbookIcon_delete"
              icontype="globle"
              type="delete"
              style={{ cursor: 'pointer', marginRight: '10px', opacity: PermissionRO('incidents', 'incidentWorkbook').write ? 1 : 0.4 }}
              data-test="delete_assign"
              onClick={() => (PermissionRO('incidents', 'incidentWorkbook').write ? deleteIncidentWorkbook() : Toaster({ title: "You don't have permission.", type: 'error' }))}
            />
          </div>
        </div>
      ) : null }
      <div style={{ overflow: 'auto', height: 'calc(100vh - 366px)' }}>
        {iWorkbook.data
        && !loadingNodata
        && iWorkbook.data.length > 0 && iWorkbook.data.map((d, ii) => (
          <div key={d.token} className="boxWb">
            <div className={d.token === openPhase ? 'workbookData openBox' : 'workbookData'}>
              <div className="srNo">
                <span style={{ borderRight: '2px solid #17191b', fontSize: '14px', padding: 12 }}>
                  Phase
                  {' '}
                  {ii + 1}
                </span>
              </div>
              <div className="otherData">
                <span style={{ textTransform: 'unset', overflow: 'hidden', width: '100%' }}>
                  <div
                    id="Incident_WOrkBookName"
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'wrap',
                      marginTop: '1px',
                      color: '#4e8bff',
                    }}
                  >
                    {d.name}
                  </div>
                  <div
                    id="Incident_WOrkBookName"
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'wrap',
                      marginTop: '1px',
                      color: 'rgb(164, 169, 175)',
                      fontStyle: 'italic',
                    }}
                  >
                    {d.description}
                  </div>
                </span>
                <div
                  style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    width: '5%',
                    height: '0%',
                    marginLeft: '9px',
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginRight: '15px',
                      width: '0%',
                      height: '0%',
                    }}
                  >
                    <Icons
                      iconTooltipType="normal"
                      iconTooltipTitle={openPhase === d.token ? 'Collapse' : 'Expand'}
                      style={{ cursor: 'pointer', height: 0 }}
                      icontype="common"
                      id="expand_icon"
                      data-test="expand_icon"
                      type={
                          openPhase === d.token
                            ? 'arrowUp'
                            : 'arrowDown'
                        }
                      onClick={() => setOpenPhase(openPhase === d.token ? '' : d.token)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {d.token === openPhase ? (
              <div className="innerTaskBox">
                <div style={{
                  height: '35px', fontSize: '14px', fontWeight: 'bold', color: 'white',
                }}
                >
                  Tasks
                  {' '}
                </div>
                {d.tasks.map((l, i) => (
                  <div key={i} className="singleTask" id={`singleTask_${i}`} data-test="open_second" onClick={() => setOpenPhase(d.token)}>
                    <div className="upperData">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Name :</span>
                          <div style={{ wordBreak: 'break-all', padding: '0px 34px', color: '#4e8bff' }}>{l.name}</div>
                        </div>
                        {/* <div style={{ width: "33%" }}>Due: {l.taskDueDate}</div> */}
                      </div>
                      <div style={{ display: 'flex', marginTop: '10px' }}>
                        <div style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                          <span>Description :</span>
                        </div>
                        <div style={{
                          wordBreak: 'break-all',
                          width: 'fit-content',
                          padding: '0px 5px',
                          color: '#a4a9af',
                          fontStyle: 'italic',
                        }}
                        >
                          {l.description}
                        </div>
                      </div>
                    </div>
                    <div className="hiddenData" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      {/* {l.actionList.length > 0 ? ( */}
                      <div className="actPb" style={{ width: '49%' }}>
                        {/* {l.actionList.length > 0 ? ( */}
                        <div className="titleHead">
                          <Icons type="action" icontype="common" className="ecIcon" />
                          Actions

                        </div>
                        {/* ) : null} */}
                        <div className="workbook_left_part">
                          <div style={{
                            display: 'flex', flexWrap: 'wrap', height: '120px', overflow: 'auto', alignContent: 'baseline',
                          }}
                          >
                            {l.actionList.length > 0
                              ? l.actionList.map((t, j) => (
                                <div className="innerData innerData__bgAct" key={j} style={{ background: t.type === 'action' ? 'rgb(255, 204, 99,.5)' : 'rgb(66, 112, 183, .5)' }}>
                                  <Icons
                                    id={`Incident_Workook_Preview_Action_API_Icon${j}`}
                                    data-test="ekasha_remove_field"
                                    icontype="common"
                                    type={t.type === 'action' ? 'actionBlock' : 'apiBlock'}
                                    style={{ lineHeight: '5px', cursor: 'pointer' }}
                                  />
                                  <div style={{ wordBreak: 'break-all', marginLeft: '5px' }}>{t.name || t.actionName}</div>
                                </div>
                              ))
                              : (
                                <NoData size="noDataSmall" style={{ position: 'relative' }} />
                              )}
                          </div>
                        </div>
                      </div>
                      {/* ) : null} */}
                      {/* {l.playbooks.length > 0 ? ( */}
                      <div className="actPb" style={{ width: '49%' }}>
                        <div className="titleHead">
                          <Icons type="playbooksWB" icontype="common" className="ecIcon" />
                          Playbooks
                        </div>
                        <div className="workbook_left_part">
                          <div style={{
                            display: 'flex', flexWrap: 'wrap', height: '120px', overflow: 'auto', alignContent: 'baseline',
                          }}
                          >
                            {l.playbooks.length > 0
                              ? l.playbooks.map((t, j) => (
                                <div className="innerData innerData__bgPlb" key={j}>
                                  <Icons
                                    id={`Incident_Workook_Preview_Playbook_Icon${j}`}
                                    data-test="ekasha_remove_field"
                                    icontype="common"
                                    type="playbooksWB"
                                    style={{ lineHeight: '5px', cursor: 'pointer' }}
                                  />
                                  <div style={{ wordBreak: 'break-all', marginLeft: '5px' }}>{t.name}</div>
                                </div>
                              ))
                              : (
                                <NoData size="noDataSmall" style={{ position: 'relative' }} />
                              )}
                          </div>
                        </div>
                      </div>
                      {/* ) : null} */}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {!loadingNodata && !iWorkbook.workbookName && (
        <NoData
          data-test="incident_workbook_nodata"
          style={{ height: '90%', position: 'initial' }}
        />
      )}

      {loadingNodata === true
        ? <ZsSpin id="IncidentWorkbookLoading" />
        : null}

      <ZsModal
        visible={openDeleteModal}
        modaltype="confirm"
        msg="Are you sure you want to delete this workbook ?"
        title="Warning"
        id="delete_assign_modal"
        data-test="delete_assign_modal"
        loading={loading}
        onOk={DeleteConfirm}
        onCancel={() => {
          setOpenDeleteModal(false);
        }}
      />
    </WorkbookWrapper>
  );
});

Workbook.propTypes = {
  getAssignedWorkbookAction: PropTypes.func,
  fakeWorkbookAction: PropTypes.func,
  getAllWorbookAction: PropTypes.func,
  assignWorkbook: PropTypes.func,
  deleteAssignedAction: PropTypes.func,
  IncidentId: PropTypes.number,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
  ]),
};

Workbook.defaultProps = {
  getAssignedWorkbookAction: null,
  fakeWorkbookAction: null,
  getAllWorbookAction: null,
  assignWorkbook: null,
  deleteAssignedAction: null,
  IncidentId: 0,
  selectIncident: {},
};
export default Workbook;
