import React, {
  useState, useEffect, useMemo, useCallback, lazy, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import axios from 'axios';
import { BackupWrapper } from './style';
import { ekashaPermission, PermissionRO } from '../../../../../../../helpers/lib/StorageHandlers';
import NoData from '../../../../../../../components/NoData';
import ZsTable from '../../../../../../../components/table';
import ZsModal from '../../../../../../../components/modal';
import Toaster from '../../../../../../../components/toaster';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../../components/Spin';
import { RegexList } from '../../../../../../../helpers/lib/RegexList';
import { getBackupColumns } from '../../backupRestoreTableColumns';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../../../helpers/envData';
import ZsInput from '../../../../../../../components/forms/input';
import { instance } from '../../../../../../../configurations/redux/AxiosCall';

let subscribe;

const NewBackup = lazy(() => retryLazy(() => import('./lib/NewBackup')));

const BackupTab = React.memo((props) => {
  const {
    getAllBackupAction, getSingleBackup, addBackupAction, updateBackupAction, deleteBackupAction,
    resumeBackupAction, pauseBackupAction, getListType, fakeActionBackUp,
    openModal, setOpenModal,
  } = props;

  const [loading, setLoading] = useState(true);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [serverList, setServerList] = useState([]);
  const [selectBackupToken, setSelectBackupToken] = useState('');
  const [singleBackup, setSingleBackup] = useState({
    jobName: '',
    runType: 'adhoc',
    isMove: false,
    moveServerToken: '',
    typeData: {
      run: 'daily',
      runHour: '',
      runDay: '',
      runMonth: '',
    },
  });
  const [backupType, setBackupType] = useState('new');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [resumeBackupJob, setResumeBackupJob] = useState(false);
  const [executeBackupJob, setExecuteBackupJob] = useState(false);
  const [pauseBackupJob, setPauseBackupJob] = useState(false);
  const [backupModelLoading, setBackupModelLoading] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [backupList, setBackupList] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  const resetSingleBackup = {
    jobName: '',
    runType: 'adhoc',
    isMove: false,
    moveServerToken: '',
    typeData: {
      run: 'daily',
      runHour: '',
      runDay: '',
      runMonth: '',
    },
  };

  const GetBackupRes = useSelector((state) => (state.BackUp.GetBackupResponse || {}));
  const AddBackupRes = useSelector((state) => (state.BackUp.AddBackupResponse || {}));
  const UpdateBackupRes = useSelector((state) => (state.BackUp.UpdateBackupResponse || {}));
  const DeleteBackupRes = useSelector((state) => (state.BackUp.DeleteBackupResponse || {}));
  const ResumeBackupRes = useSelector((state) => (state.BackUp.ResumeBackupResponse || {}));
  const PauseBackupRes = useSelector((state) => (state.BackUp.PauseBackupResponse || {}));
  const GetServerBackupRes = useSelector((state) => (state.BackUp.GetServerBackupRes || {}));

  const source = axios.CancelToken.source();

  const executeBackupAction = (token) => instance({
    method: 'POST', url: `backup/backupExecution?token=${token}`, headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}`, userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken }, data: null, cancelToken: source.token,
  });

  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setBackupList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState;
      return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllBackupAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  const handleClose = useCallback(() => {
    setSubmitLoading(false);
    setOpenNewModal(false);
    setBackupModelLoading(false);
    setValueEdited(false);
    setSelectBackupToken('');
    setServerList([]);
    setSingleBackup(resetSingleBackup);
    setSubmited(false);
    setOpenModal(false);
  }, []);

  const handleBackupModal = useCallback((type) => {
    setBackupType(type);
    setOpenNewModal(true);
  }, []);

  const onEditFunction = useCallback((objectToken) => {
    setBackupType('edit');
    getSingleBackup(objectToken);
    setBackupModelLoading(true);
    setOpenNewModal(true);
  }, []);

  // Next Page Function
  const nextPage = () => {
    getAllBackupAction({ ...errorName, page: errorName.page + 1 });
  };

  const setSearchTerm = debounce((searchValue) => {
    getAllBackupAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setBackupList([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  const handleBackupDelete = useCallback((token) => {
    setSelectBackupToken(token);
    setOpenDeleteModal(true);
  }, []);

  const handleResumeBackupJob = useCallback((token) => {
    setSelectBackupToken(token);
    setResumeBackupJob(true);
  }, []);

  const handleExecuteBackupJob = useCallback((token) => {
    setSelectBackupToken('');
    setSelectBackupToken(token);
    setExecuteBackupJob(true);
  }, []);

  const handlePauseBackupJob = useCallback((token) => {
    setSelectBackupToken(token);
    setPauseBackupJob(true);
  }, []);

  const setData = useCallback((e, type, subType) => {
    setValueEdited(true);
    const singleBack = { ...singleBackup };
    const regex = RegexList.charNumOnlyWithSpace;
    if (type === 'runType') {
      singleBack.typeData.run = 'daily';
      singleBack.typeData.runHour = '';
      singleBack.typeData.runMonth = '';
      singleBack.typeData.runDay = '';
      singleBack[type] = e;
    } else if (type === 'typeData') {
      singleBack[type][subType] = e;
      if (subType === 'run') {
        singleBack.typeData.runHour = '';
        singleBack.typeData.runMonth = '';
        singleBack.typeData.runDay = '';
      }
    } else if (type === 'isMove') {
      if (e) {
        getListType();
      }
      singleBack.moveServerToken = '';
      singleBack[type] = e;
    } else if (type === 'jobName' && e) {
      if (regex.test(e)) {
        singleBack[type] = e;
      }
    } else if (e !== ' ') {
      singleBack[type] = e;
    }
    setSingleBackup(singleBack);
  }, [singleBackup]);

  const onFinish = useCallback(() => {
    const {
      jobName, runType, typeData, isMove, moveServerToken,
    } = singleBackup;
    setSubmited(true);
    if (!jobName) {
      return;
    }
    if (isMove) {
      if (!moveServerToken) {
        return;
      }
    }
    if (runType !== 'adhoc') {
      const {
        run, runDay, runHour, runMonth,
      } = typeData;
      if (run === 'daily') {
        if (!runHour) return;
      }
      if (run === 'weekly') {
        if (!(runHour && runDay)) return;
      }
      if (run === 'monthly') {
        if (!(runHour && runMonth)) return;
      }
      if (run === 'yearly') {
        if (!(runHour && runDay && runMonth)) return;
      }
    }
    if (backupType === 'new') {
      setSubmitLoading(true);
      addBackupAction(singleBackup);
    } else if (backupType === 'edit') {
      setSubmitLoading(true);
      updateBackupAction(singleBackup);
    }
  }, [singleBackup, backupType]);

  const backupConfirmSubmit = useCallback((typ, act) => {
    if (typ !== 'execute') {
      act(selectBackupToken);
      setDeleteLoading(true);
    }
    if (typ === 'execute') {
      setDeleteLoading(true);
      try {
        executeBackupAction(selectBackupToken).then((res) => res).catch((err) => err);
      } catch (error) {
        return error;
      }
      setTimeout(() => {
        setExecuteBackupJob(false);
        source.cancel('Request canceled due to user action');
        setDeleteLoading(false);
        Toaster({ title: 'Backup execution started', type: 'success' });
      }, 1000);
    }
    return null;
  }, [selectBackupToken]);

  const onBackupDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'Backup') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((pre) => {
              setBackupList((prevState) => {
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.jobName?.toLowerCase()?.includes(pre?.toLowerCase())) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((prev) => prev
              + (dataRes.data?.jobName?.toLowerCase()?.includes(pre?.toLowerCase()) ? 1 : 0));
              return pre;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setSearchText((pre) => {
              setBackupList((prevState) => {
                const index = prevState.findIndex((e) => e.token === dataRes.data.token);
                if (index !== -1) {
                  const a = prevState;
                  a[index] = dataRes.data;
                  const filterData = a.filter(
                    (d) => d.jobName?.toLowerCase()?.includes(pre?.toLowerCase()),
                  );
                  return filterData;
                }
                return prevState;
              });
              if (!dataRes.data.jobName?.toLowerCase()?.includes(pre?.toLowerCase())) {
                setTotalCount((prevS) => prevS - 1);
              }
              return pre;
            });
          }
          break;
        case 'delete':
          setBackupList((prevState) => prevState.filter((e) => e.token !== dataRes.data));
          setTotalCount((prevState) => prevState - 1);
          getTableDataCall();
          break;
        case 'jobPaush':
        case 'execute':
        case 'jobResume':
          if (dataRes.status) {
            setBackupList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              if (index !== -1) {
                const a = prevState;
                a[index].status = dataRes.data.status;
                return [...a];
              }
              return prevState;
            });
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      setOpenModal(false);
      if (PermissionRO('administration', 'backupandrestore').read) {
        getAllBackupAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onBackupDataRecieved);
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
    if (GetBackupRes.status) {
      if (GetBackupRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetBackupRes.data.number });
        setBackupList([...backupList, ...GetBackupRes.data.content]);
      } else {
        setBackupList([...GetBackupRes.data.content]);
      }
      setLoading(false);
      setTotalCount(GetBackupRes.data.totalElements);
      fakeActionBackUp();
    } else if (GetBackupRes.status === false) {
      setLoading(false);
      setBackupList([]);
      fakeActionBackUp();
    }
  }, [GetBackupRes]);

  useEffect(() => {
    if (GetServerBackupRes.status) {
      if (GetServerBackupRes.data && GetServerBackupRes.data.length > 0) {
        const data = [...serverList];
        GetServerBackupRes.data.forEach((e) => {
          data.push({ name: e.configName, value: e.token });
        });
        setServerList(data);
      }
      fakeActionBackUp();
    } else if (GetServerBackupRes.status === false) {
      setServerList([]);
      fakeActionBackUp();
    }
  }, [GetServerBackupRes]);

  useEffect(() => {
    if (AddBackupRes.status) {
      setSubmitLoading(false);
      handleClose();
      fakeActionBackUp();
    } else if (AddBackupRes.status === false) {
      setSubmitLoading(false);
      fakeActionBackUp();
    }
  }, [AddBackupRes]);

  useEffect(() => {
    if (UpdateBackupRes.status) {
      setSubmitLoading(false);
      handleClose();
      fakeActionBackUp();
    } else if (UpdateBackupRes.status === false) {
      setSubmitLoading(false);
      fakeActionBackUp();
    }
  }, [UpdateBackupRes]);

  useEffect(() => {
    if (DeleteBackupRes.status) {
      setDeleteLoading(false);
      setSelectBackupToken('');
      setOpenDeleteModal(false);
      fakeActionBackUp();
    } else if (DeleteBackupRes.status === false) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionBackUp();
    }
  }, [DeleteBackupRes]);

  useEffect(() => {
    if (ResumeBackupRes.status) {
      setDeleteLoading(false);
      setSelectBackupToken('');
      setResumeBackupJob(false);
      fakeActionBackUp();
    } else if (ResumeBackupRes.status === false) {
      setDeleteLoading(false);
      setResumeBackupJob(false);
      fakeActionBackUp();
    }
  }, [ResumeBackupRes]);

  useEffect(() => {
    if (PauseBackupRes.status) {
      setDeleteLoading(false);
      setSelectBackupToken('');
      setPauseBackupJob(false);
      fakeActionBackUp();
    } else if (PauseBackupRes.status === false) {
      setDeleteLoading(false);
      setPauseBackupJob(false);
      fakeActionBackUp();
    }
  }, [PauseBackupRes]);

  useEffect(() => {
    if (openModal === true) {
      handleBackupModal('new');
    }
  }, [openModal]);

  const openConformModel = (sts, msg, act, cls, typ) => (
    <>
      <ZsModal
        visible={sts}
        modaltype="confirm"
        msg={msg}
        title="Warning"
        type={typ !== 'delete'}
        data-test="ekasha_backup_conform_modal"
        className="BackupConfirm"
        loading={deleteLoading}
        onOk={() => {
          backupConfirmSubmit(typ, act);
        }}
        onCancel={() => {
          cls(false);
        }}
      />
    </>
  );

  // colunms of table
  const columns = useMemo(() => (getBackupColumns(
    handleBackupDelete, handleResumeBackupJob,
    handleExecuteBackupJob, handlePauseBackupJob, onEditFunction,
  )), []);

  if (!PermissionRO('administration', 'backupandrestore').read) {
    return <NoData id="Admin_Backup_Permission_RO_NoData" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <BackupWrapper style={{ height: getTableHeight([], 93) }}>
      <div className="addAction backupAddSearch">
        <ZsInput
          inputtype="search"
          id="Admin_Backup_SearchBox"
          placeholdertext="Search for Job name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
      </div>
      {!loading ? (
        backupList.length > 0
          ? (
            <ZsTable
              id="Admin_Backup_Table"
              columns={columns}
              dataSource={backupList}
              rowKey="token"
              pagination={false}
              displayType="block"
              totalCount={totalCount}
              nextPage={nextPage}
            />
          ) : (
            <NoData
              id="Admin_Backup_NoData"
              style={{ height: 'calc(100% - 1px)' }}
            />
          )
      ) : (
        <div style={{ height: 'calc(100% - 1px)' }}>
          <ZsSpin id="AdminBackupLoading" />
        </div>
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Backup(s)</span>
      </div>
      {openDeleteModal && (
        openConformModel(openDeleteModal, 'Are you sure to delete this backup job ?', () => deleteBackupAction(selectBackupToken), () => setOpenDeleteModal(false), 'delete')
      )}
      {resumeBackupJob && (
        openConformModel(resumeBackupJob, 'Are you sure to resume this backup job ?', () => resumeBackupAction(selectBackupToken), () => setResumeBackupJob(false), 'resume')
      )}
      {pauseBackupJob && (
        openConformModel(pauseBackupJob, 'Are you sure to pause this backup job ?', () => pauseBackupAction(selectBackupToken), () => setPauseBackupJob(false), 'pause')
      )}
      {executeBackupJob && (
        openConformModel(executeBackupJob, 'Are you sure to execute this backup job ?', () => executeBackupAction(selectBackupToken), () => setExecuteBackupJob(false), 'execute')
      )}
      {openNewModal && (
        <Suspense fallback={false}>
          <NewBackup
            visible={openNewModal}
            onHide={handleClose}
            backupModelLoading={backupModelLoading}
            type={backupType}
            onFinish={onFinish}
            setData={setData}
            serverList={serverList}
            singleBackup={singleBackup}
            submitLoading={submitLoading}
            valueEdited={valueEdited}
            submited={submited}
            setBackupModelLoading={setBackupModelLoading}
            setOpenNewModal={setOpenNewModal}
            fakeActionBackUp={fakeActionBackUp}
            setSingleBackup={setSingleBackup}
            getListType={getListType}
          />
        </Suspense>
      )}
    </BackupWrapper>
  );
});

BackupTab.propTypes = {
  getAllBackupAction: PropTypes.func,
  getSingleBackup: PropTypes.func,
  addBackupAction: PropTypes.func,
  updateBackupAction: PropTypes.func,
  deleteBackupAction: PropTypes.func,
  resumeBackupAction: PropTypes.func,
  pauseBackupAction: PropTypes.func,
  getListType: PropTypes.func,
  fakeActionBackUp: PropTypes.func,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
};

BackupTab.defaultProps = {
  getAllBackupAction: null,
  getSingleBackup: null,
  addBackupAction: null,
  updateBackupAction: null,
  deleteBackupAction: null,
  resumeBackupAction: null,
  pauseBackupAction: null,
  getListType: null,
  fakeActionBackUp: null,
  openModal: false,
  setOpenModal: null,
};
export default BackupTab;
