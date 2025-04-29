/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, {
  useState, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { PlaybookNewWrapper } from './style';
import { PermissionRO, ekashaPermission } from '../../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../../components/NoData';
import ZsButton from '../../../../../../components/forms/button';
import Toaster from '../../../../../../components/toaster';
import Icons from '../../../../../../components/icons';
import ZsTable from '../../../../../../components/table';
import { ZsSpin } from '../../../../../../components/Spin';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../../../../components/modal';
import { debounceFunc, getTableHeight } from '../../../../../../helpers/envData';
import { getIncidentPlaybookActionColumns } from './IncidentPlaybookActionTableColumns';
import ZsInput from '../../../../../../components/forms/input';
import AssignPlaybookModel from './lib/assignPlaybookModel';
import PlaybookScheduleManager from './lib/playbookScheduleManager';

let subscribe;

const Playbook = (props) => {
  const {
    IncidentId, assignPlaybookAction, listAllPlaybookAction, fakeIncidentPlaybookAction,
    getNewAllPlaybookBlockAction, fakePlaybookAction, selectIncident, deletePlaybookAction,
    terminateIncidentPlaybookAction, getIncidentPlaybookAction, updateScheduleTimeIncPlaybookAction,
  } = props;

  // all playbooks for assign
  const [listPlaybooks, setListPlaybooks] = useState([]);
  const [assignPlaybookId, setAssignPlaybookId] = useState('');
  const [assignModelStatus, setAssignModelStatus] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [refreshLoad, setRefreshLoad] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleModelStatus, setScheduleModelStatus] = useState(false);
  const [singleRawData, setSingleRawData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [terminateConfirmModel, setTerminateConfirmModel] = useState(false);
  const [deleteConfirmModel, setDeleteConfirmModel] = useState(false);

  // redux state
  const AssignPlaybookRes = useSelector((state) => (
    state.IncidentPlaybook.AssignPlaybookResponse || {}));
  const ListAllPlaybookRes = useSelector((state) => (
    state.IncidentPlaybook.ListAllPlaybookResponse || {}));
  const TerminateIncidentPlaybookRes = useSelector((state) => (
    state.IncidentPlaybook.TerminateIncidentPlaybookResponse || {}));
  const DeletePlaybookRes = useSelector((state) => (
    state.IncidentPlaybook.DeletePlaybookResponse || {}));

  useEffect(() => {
    if (AssignPlaybookRes.status && AssignPlaybookRes.status === true) {
      setAssignLoading(false);
      setAssignModelStatus(false);
      setAssignPlaybookId('');
      fakeIncidentPlaybookAction();
    } else if (AssignPlaybookRes.status === false) {
      setAssignLoading(false);
      setAssignModelStatus(false);
      setAssignPlaybookId('');
      fakeIncidentPlaybookAction();
    }
  }, [AssignPlaybookRes]);
  useEffect(() => {
    if (ListAllPlaybookRes.status && ListAllPlaybookRes.status === true) {
      setListPlaybooks(ListAllPlaybookRes.data);
      setListLoading(false);
      setRefreshLoad(false);
      fakeIncidentPlaybookAction();
    } else if (ListAllPlaybookRes.status === false) {
      setListPlaybooks([]);
      setListLoading(false);
      setRefreshLoad(false);
      fakeIncidentPlaybookAction();
    }
  }, [ListAllPlaybookRes]);

  useEffect(() => {
    if (TerminateIncidentPlaybookRes.status && TerminateIncidentPlaybookRes.status === true) {
      setTerminateConfirmModel(false);
      setLoading(false);
      setSingleRawData({});
      fakeIncidentPlaybookAction();
    } else if (TerminateIncidentPlaybookRes.status === false) {
      setTerminateConfirmModel(false);
      setLoading(false);
      setSingleRawData({});
      fakeIncidentPlaybookAction();
    }
  }, [TerminateIncidentPlaybookRes]);

  useEffect(() => {
    if (DeletePlaybookRes.status && DeletePlaybookRes.status === true) {
      setDeleteConfirmModel(false);
      setLoading(false);
      setSingleRawData({});
      fakeIncidentPlaybookAction();
    } else if (DeletePlaybookRes.status === false) {
      setDeleteConfirmModel(false);
      setLoading(false);
      setSingleRawData({});
      fakeIncidentPlaybookAction();
    }
  }, [DeletePlaybookRes]);

  const onIncidentPlaybookdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incidentPlaybook') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentId) === parseInt(IncidentId)) {
              setListPlaybooks((prevState) => {
                if (dataRes.data.customerID === localStorage.getItem('customerID')) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
            }
          }
          break;
        case 'update':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentId) === parseInt(IncidentId)) {
              setListPlaybooks((prevState) => {
                const index = prevState.findIndex((e) => e.id === dataRes.data.id);
                if (index !== -1) {
                  const updatedList = [...prevState];
                  updatedList[index] = dataRes.data;
                  return updatedList;
                }
                return prevState;
              });
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setListPlaybooks((prevState) => prevState.filter((e) => !dataRes.data.playbookId.includes(e.id)));
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('incidents', 'incidentPlaybook').read) {
        listAllPlaybookAction({ incidentId: IncidentId, searchText: '', customerID: localStorage.getItem('customerID') });
        setListLoading(true);
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);

    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onIncidentPlaybookdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  const refreshPlaybookList = () => {
    if (IncidentId > 0) {
      listAllPlaybookAction({ incidentId: IncidentId, searchText, customerID: localStorage.getItem('customerID') });
      setRefreshLoad(true);
      setListLoading(true);
    }
  };

  const IncExecutePlayHandler = (data) => {
    if (PermissionRO('incidents', 'incidentPlaybook').write) {
      if (selectIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        setSingleRawData(data);
        setScheduleModelStatus(true);
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  };

  const openIncidentPlaybookPreviewTab = (url) => {
    window.open(url, url);
  };

  const reRunIconHandlar = () => {
    if (PermissionRO('incidents', 'incidentPlaybook').write) {
      if (selectIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        console.log('Click Rerun');
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  };
  const clockIconHandlar = (data) => {
    if (PermissionRO('incidents', 'incidentPlaybook').write) {
      if (selectIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        setSingleRawData(data);
        getIncidentPlaybookAction({
          incidentId: data.incidentId,
          customerID: localStorage.getItem('customerID'),
          playbookId: data.id,
        });
        setScheduleModelStatus(true);
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  };

  const deleteIconHandlar = (data) => {
    if (PermissionRO('incidents', 'incidentPlaybook').write) {
      if (selectIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        setSingleRawData(data);
        setDeleteConfirmModel(true);
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  };

  const terminateIconHandlar = (data) => {
    if (PermissionRO('incidents', 'incidentPlaybook').write) {
      if (selectIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        setSingleRawData(data);
        setTerminateConfirmModel(true);
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  };

  const setSearchTerm = debounce((searchValue) => {
    if (IncidentId > 0) {
      listAllPlaybookAction({ incidentId: IncidentId, searchText: searchValue, customerID: localStorage.getItem('customerID') });
    }
  }, 300);

  const searchChange = (val) => {
    setSearchText(val);
    debounceFunc(() => setSearchTerm(val));
  };

  const rptSearchClear = () => {
    setSearchText('');
    setListPlaybooks([]);
    if (IncidentId > 0) {
      debounceFunc(() => setSearchTerm(''));
    }
  };

  const columns = useMemo(() => (getIncidentPlaybookActionColumns(IncExecutePlayHandler, openIncidentPlaybookPreviewTab, reRunIconHandlar, clockIconHandlar, terminateIconHandlar, deleteIconHandlar)), []);

  if (!PermissionRO('incidents', 'incidentPlaybook').read) {
    return <NoData data-test="dont_have_pr_action" message="You don't have permission to access this page" />;
  }
  return (
    <PlaybookNewWrapper>
      <div className="newBtn">
        <ZsInput
          inputtype="search"
          id="Incident_Playbook_searchBox"
          placeholdertext="Search.."
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <div
          className="refreshArtifact"
          onClick={() => refreshPlaybookList()}
        >
          <div>
            <Icons
              iconTooltipType="normal"
              iconTooltipTitle="Refresh"
              icontype="common"
              type="ReFresh"
              data-test="artifact_refresh_btn"
              className={refreshLoad ? 'spinnerRestart refrashData' : 'refrashData'}
            />
          </div>
        </div>
        <ZsButton
          id="playbook_assign"
          data-test="playbook_assign"
          className="actionAddBtn"
          style={{ float: 'right', opacity: PermissionRO('incidents', 'incidentPlaybook').write ? 1 : 0.4 }}
          type="primary"
          title="+ Assign"
          onClick={() => {
            if (PermissionRO('incidents', 'incidentPlaybook').write && !assignLoading) {
              if (selectIncident.status === 'Closed') {
                Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
              } else {
                getNewAllPlaybookBlockAction();
                setAssignModelStatus(true);
              }
            } else {
              Toaster({ title: "You don't have permission.", type: 'error' });
            }
          }}
        />
      </div>
      {listLoading && (
        <div style={{ height: 'calc(100% - 62px)' }}>
          <ZsSpin id="IncidentPlaybookLoading" className="incidentSpinner" />
        </div>
      )}
      {listPlaybooks !== undefined && listPlaybooks?.length !== 0 && !listLoading
        ? (
          <div style={{ height: getTableHeight([], 62) }}>
            <ZsTable
              data-test="Incident_PlaybookAction_List_Table"
              id="incident_playbookActionListTable"
              columns={columns}
              dataSource={listPlaybooks}
              rowKey="playbookId"
              pagination={false}
              horizontal
              incidentColors
            />
          </div>
        ) : (
          !listLoading && <NoData style={{ height: 'calc(100% - 62px)' }} />
        )}
      <div className="incidentFooter">
        <span className="counts">{listPlaybooks?.length || 0}</span>
        <span className="moduleName">PlayBook(s)</span>
      </div>
      {assignModelStatus && (
        <AssignPlaybookModel
          IncidentId={IncidentId}
          assignModelStatus={assignModelStatus}
          setAssignModelStatus={setAssignModelStatus}
          assignPlaybookId={assignPlaybookId}
          setAssignPlaybookId={setAssignPlaybookId}
          assignPlaybookAction={assignPlaybookAction}
          assignLoading={assignLoading}
          setAssignLoading={setAssignLoading}
          fakePlaybookAction={fakePlaybookAction}
          listPlaybooks={listPlaybooks}
        />
      )}
      {scheduleModelStatus && (
        <PlaybookScheduleManager
          scheduleModelStatus={scheduleModelStatus}
          setScheduleModelStatus={setScheduleModelStatus}
          fakeIncidentPlaybookAction={fakeIncidentPlaybookAction}
          singleRawData={singleRawData}
          setSingleRawData={setSingleRawData}
          updateScheduleTimeIncPlaybookAction={updateScheduleTimeIncPlaybookAction}
        />
      )}
      {terminateConfirmModel && (
        <ZsModal
          id="Incident_Playbook_Terminate_Modal"
          visible={terminateConfirmModel}
          modaltype="confirm"
          msg="Are you sure to terminate this playbook?"
          title="Warning"
          type={false}
          loading={loading}
          onOk={() => {
            setLoading(true);
            terminateIncidentPlaybookAction({
              incidentId: IncidentId,
              playbookId: singleRawData.id,
              refToken: singleRawData.refToken,
              status: singleRawData.playbookStatus,
            });
          }}
          onCancel={() => {
            setLoading(false);
            setTerminateConfirmModel(false);
          }}
        />
      )}
      {deleteConfirmModel && (
        <ZsModal
          id="Incident_Playbook_Terminate_Modal"
          visible={deleteConfirmModel}
          modaltype="confirm"
          msg="Are you sure to delete this assigned playbook?"
          title="Warning"
          type={false}
          loading={loading}
          onOk={() => {
            setLoading(true);
            deletePlaybookAction({
              incidentId: IncidentId,
              playbookId: singleRawData.id,
              refToken: singleRawData.refToken,
              customerID: localStorage.getItem('customerID'),
            });
          }}
          onCancel={() => {
            setLoading(false);
            setDeleteConfirmModel(false);
          }}
        />
      )}
    </PlaybookNewWrapper>
  );
};

Playbook.propTypes = {
  IncidentId: PropTypes.number,
  assignPlaybookAction: PropTypes.func,
  listAllPlaybookAction: PropTypes.func,
  fakeIncidentPlaybookAction: PropTypes.func,
  fakePlaybookAction: PropTypes.func,
  getNewAllPlaybookBlockAction: PropTypes.func,
};

Playbook.defaultProps = {
  IncidentId: -1,
  assignPlaybookAction: null,
  listAllPlaybookAction: null,
  fakeIncidentPlaybookAction: null,
  fakePlaybookAction: null,
  getNewAllPlaybookBlockAction: null,
};

export default Playbook;
