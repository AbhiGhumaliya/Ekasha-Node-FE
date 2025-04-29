/* eslint-disable max-len */
import React, {
  useEffect, useState, useMemo, useCallback, lazy, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import Icons from '../../../../../components/icons';
import ZsTable from '../../../../../components/table';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { CriticalUserWrapper } from './style';
import NoData from '../../../../../components/NoData';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { downloadFileAction } from '../../../../../configurations/redux/downloadFile';
import { ZsSpin } from '../../../../../components/Spin';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import { getCriticalUserTableColumns } from './CriticalUserTableColumns';
import ZsInput from '../../../../../components/forms/input';

let subscribe;

const NewCriticalUser = lazy(() => retryLazy(() => import('./lib/NewCriticalUser')));
const ImportFile = lazy(() => retryLazy(() => import('./lib/importFile')));
const DeleteCriticalUserModel = lazy(() => retryLazy(() => import('./lib/DeleteCriticalUserModel')));

const Critical = React.memo((props) => {
  const {
    getAllCriticalUserAction, addCriticalUserAction, updateCriticalUserAction, deleteCriticalUserAction,
    getSingleCriticalAction, importCriticalUserAction, fakeActionCriticalUser,
  } = props;

  const [fetchLoading, setFetchLoading] = useState(true);
  const [allCriticalUserData, setAllCriticalUserData] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [criticalModelLoading, setCriticalModelLoading] = useState(false);
  const [selectCriticalUserToken, setSelectCriticalUserToken] = useState('');
  const [criticalUserType, setCriticalUserType] = useState();
  const [openNewModal, setOpenNewModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [crticialUserDataFiles, setCriticalUserDataFiles] = useState([]);

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [values, setValues] = useState({});
  const [valueEdited, setValueEdited] = useState(false);
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText });

  if (!PermissionRO('administration', 'criticalUser').read) {
    return <NoData style={{ position: 'absolute' }} data-test="PermissionRO_Administration_CriticalUser_Module" message="You don't have permission to access this page" />;
  }

  const GetAllCriticalUserRes = useSelector((state) => (
    state.Critical.GetAllCriticalUserResponse ? state.Critical.GetAllCriticalUserResponse : {}
  ));
  const CriticalUserDeleteRes = useSelector((state) => (
    state.Critical.CriticalUserDeleteResponse ? state.Critical.CriticalUserDeleteResponse : {}
  ));
  const AddCriticalUserRes = useSelector((state) => (
    state.Critical.AddCriticalUserResponse ? state.Critical.AddCriticalUserResponse : {}
  ));
  const UpdateCriticalUserRes = useSelector((state) => (
    state.Critical.UpdateCriticalUserResponse ? state.Critical.UpdateCriticalUserResponse : {}
  ));
  const CriticalUserImportRes = useSelector((state) => (
    state.Critical.CriticalUserImportResponse ? state.Critical.CriticalUserImportResponse : {}
  ));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength;
    let totalRows;

    await Promise.resolve(setAllCriticalUserData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prev) => {
      totalRows = prev;
      return prev;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllCriticalUserAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  // Next Page Function
  const nextPage = useCallback(() => {
    getAllCriticalUserAction({ ...errorName, page: errorName.page + 1 });
  }, [errorName]);

  const onCriticalUserDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'criticalUser') {
      switch (dataRes.operation) {
        case 'importCriticalUser':
        case 'add':
          if (dataRes.status) {
            setSearchText((pre) => {
              if (dataRes.operation !== 'importCriticalUser' && !(Array.isArray(dataRes.data))) {
                setAllCriticalUserData((prevState) => {
                  if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1 && dataRes.data?.user?.toLowerCase()?.includes(pre?.toLowerCase())) {
                    return [dataRes.data, ...prevState];
                  }
                  return prevState;
                });
                setTotalCount((prev) => prev + (dataRes.data?.user?.toLowerCase()?.includes(pre?.toLowerCase()) ? 1 : 0));
              } else {
                const filterdData = dataRes.data.filter((e) => e.user?.toLowerCase()?.includes(pre?.toLowerCase()));
                setAllCriticalUserData((prevState) => [...filterdData, ...prevState]);
                setTotalCount((prevState) => prevState + filterdData.length);
              }
              return pre;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setSearchText((pre) => {
              setAllCriticalUserData((prevState) => {
                const index = prevState.findIndex((e) => e.token === dataRes.data.token);
                if (index !== -1) {
                  const a = prevState;
                  a[index] = dataRes.data;
                  const filterData = a.filter((d) => d.user?.toLowerCase()?.includes(pre?.toLowerCase()));
                  return filterData;
                }
                return prevState;
              });
              if (!dataRes.data.user?.toLowerCase()?.includes(pre?.toLowerCase())) {
                setTotalCount((prevS) => prevS - 1);
              }
              return pre;
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setAllCriticalUserData((prevState) => prevState.filter((e) => !dataRes.data.includes(e.token)));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall();
          }
          break;
        default:
          break;
      }
    }
  };

  const modalTypeCriticalUser = useCallback((type) => {
    setCriticalUserType(type);
    setOpenNewModal(true);
  }, []);

  const handleClose = useCallback(() => {
    setValues({});
    setSubmitLoading(false);
    setCriticalModelLoading(false);
    setOpenNewModal(false);
    setSelectCriticalUserToken('');
    setSubmited(false);
    setValueEdited(false);
  }, []);

  const deleteCriticalUserHandler = useCallback((token) => {
    setSelectCriticalUserToken(token);
    setOpenDeleteModal(true);
  }, []);

  const editCriticalUserHandler = useCallback((token) => {
    setSelectCriticalUserToken(token);
    modalTypeCriticalUser('edit');
    setCriticalModelLoading(true);
    getSingleCriticalAction(token);
  }, []);

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const submitData = useCallback(() => {
    setSubmited(true);
    if (!(values.user && values.description)) {
      return;
    }
    if (criticalUserType === 'new') {
      addCriticalUserAction(values);
      setSubmitLoading(true);
    } else if (criticalUserType === 'edit') {
      setSubmitLoading(true);
      values.token = selectCriticalUserToken;
      updateCriticalUserAction(values);
    }
  }, [criticalUserType, selectCriticalUserToken, values]);

  const submitImportFile = useCallback((fileList) => {
    const file = crticialUserDataFiles;
    fileList.forEach((e) => {
      file.push(e.originFileObj);
    });
    setCriticalUserDataFiles(file);
    setSubmitLoading(true);
    importCriticalUserAction(crticialUserDataFiles[0], selectCriticalUserToken);
  }, [crticialUserDataFiles, selectCriticalUserToken]);

  const exportLists = useCallback(() => {
    downloadFileAction('criticalUser/exportCriticalUser', 'CritcalUserFile.csv');
  }, []);

  const importLists = useCallback(() => {
    setImportModal(true);
  }, []);

  const setSearchTerm = debounce((searchValue) => {
    getAllCriticalUserAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAllCriticalUserData([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'criticalUser').read) {
        getAllCriticalUserAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onCriticalUserDataRecieved);
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
    if (GetAllCriticalUserRes.status) {
      if (GetAllCriticalUserRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllCriticalUserRes.data.number });
        setAllCriticalUserData([...allCriticalUserData, ...GetAllCriticalUserRes.data.content]);
      } else {
        setAllCriticalUserData([...GetAllCriticalUserRes.data.content]);
      }
      setFetchLoading(false);
      setTotalCount(GetAllCriticalUserRes.data.totalElements);
      fakeActionCriticalUser();
    } else if (GetAllCriticalUserRes.status === false) {
      setFetchLoading(false);
      fakeActionCriticalUser();
    }
  }, [GetAllCriticalUserRes]);

  useEffect(() => {
    if (AddCriticalUserRes.status) {
      handleClose();
      setSubmitLoading(false);
      fakeActionCriticalUser();
    } else if (AddCriticalUserRes.status === false) {
      setSubmitLoading(false);
      fakeActionCriticalUser();
    }
  }, [AddCriticalUserRes]);

  useEffect(() => {
    if (UpdateCriticalUserRes.status) {
      handleClose();
      setSubmitLoading(false);
      fakeActionCriticalUser();
    } else if (UpdateCriticalUserRes.status === false) {
      setSubmitLoading(false);
      fakeActionCriticalUser();
    }
  }, [UpdateCriticalUserRes]);

  useEffect(() => {
    if (CriticalUserImportRes.status) {
      setSubmitLoading(false);
      setImportModal(false);
      setCriticalUserDataFiles([]);
      fakeActionCriticalUser();
    } else if (CriticalUserImportRes.status === false) {
      setSubmitLoading(false);
      setCriticalUserDataFiles([]);
      fakeActionCriticalUser();
    }
  }, [CriticalUserImportRes]);

  useEffect(() => {
    if (CriticalUserDeleteRes.status && CriticalUserDeleteRes.status === true) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionCriticalUser();
    } else if (CriticalUserDeleteRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionCriticalUser();
    }
  }, [CriticalUserDeleteRes]);

  const columns = useMemo(() => (
    getCriticalUserTableColumns(editCriticalUserHandler, deleteCriticalUserHandler)
  ), []);

  return (
    <CriticalUserWrapper data-test="Administration_CriticalUser_Module_Wrapper">
      <div className="backButtonWrapper">
        <div className="rightHeaderPart">
          <ZsInput
            inputtype="search"
            id="Administration_CriticalUser_searchBox_Input"
            placeholdertext="Search for User"
            value={searchText || ''}
            onChange={(e) => searchChange(e.target.value)}
            searchclear={rptSearchClear}
          />
          <div
            id="Administration_CriticalUser_Import_btn"
            data-test="Administration_CriticalUser_Import_btn"
            className="preButtonAction"
            style={{ right: '157px', opacity: PermissionRO('administration', 'criticalUser').write ? 1 : 0.4 }}
            onClick={PermissionRO('administration', 'criticalUser').write ? () => importLists() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          >
            <Icons
              icontype="globle"
              type="import"
              style={{
                cursor: 'pointer', lineHeight: '30px', marginRight: '12px', marginLeft: '5px',
              }}
            />
            <div className="preHeaderBtnText">Import</div>
          </div>
          <div
            id="Administration_CriticalUser_Export_btn"
            data-test="Administration_CriticalUser_Export_btn"
            className="preButtonAction"
            onClick={() => exportLists()}
          >
            <Icons
              icontype="globle"
              type="export"
              style={{
                cursor: 'pointer', lineHeight: '30px', marginRight: '12px', marginLeft: '5px',
              }}
            />
            <div className="preHeaderBtnText">Export</div>
          </div>
          <div>
            <Icons
              id="Administration_CriticalUser_Add_btn"
              data-test="Administration_CriticalUser_Add_btn"
              icontype="globle"
              type="addNewButtonSmall"
              onClick={PermissionRO('administration', 'criticalUser').write ? () => modalTypeCriticalUser('new') : () => Toaster({ title: "You don't have permission.", type: 'error' })}
              style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'criticalUser').write ? 1 : 0.4 }}
            />
          </div>
        </div>
      </div>
      {!fetchLoading ? (
        <>
          {allCriticalUserData.length > 0 ? (
            <div style={{ height: getTableHeight([], 94) }}>
              <ZsTable
                data-test="Administration_CriticalUser_Table"
                id="Administration_CriticalUser_Table"
                dataSource={allCriticalUserData}
                columns={columns}
                rowKey="token"
                pagination={false}
                displayType="block"
                totalCount={totalCount}
                nextPage={nextPage}
              />
            </div>
          ) : (
            <NoData
              id="Administration_CriticalUser_NoData"
              data-test="Administration_CriticalUser_NoData"
              style={{ height: getTableHeight([], 94) }}
            />
          )}

          <div className="tableFooter adminTableFooter">
            <span className="counts">{totalCount}</span>
            <span className="moduleName">Critical User(s)</span>
          </div>
          {openDeleteModal && (
            <Suspense fallback={null}>
              <DeleteCriticalUserModel
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                deleteLoading={deleteLoading}
                deleteCriticalUserAction={deleteCriticalUserAction}
                selectCriticalUserToken={selectCriticalUserToken}
                setDeleteLoading={setDeleteLoading}
              />
            </Suspense>
          )}
          {openNewModal
            && (
              <Suspense fallback={null}>
                <NewCriticalUser
                  visible={openNewModal}
                  onHide={handleClose}
                  type={criticalUserType}
                  criticalModelLoading={criticalModelLoading}
                  submitData={submitData}
                  setData={setData}
                  values={values}
                  setValues={setValues}
                  valueEdited={valueEdited}
                  submitLoading={submitLoading}
                  submited={submited}
                  fakeActionCriticalUser={fakeActionCriticalUser}
                  setCriticalModelLoading={setCriticalModelLoading}
                  setOpenNewModal={setOpenNewModal}
                  modalTypeCriticalUser={modalTypeCriticalUser}
                />
              </Suspense>
            )}
          {importModal
            && (
              <Suspense fallback={null}>
                <ImportFile
                  importModal={importModal}
                  setImportModal={setImportModal}
                  submitLoading={submitLoading}
                  submitImportFile={submitImportFile}
                  setCriticalUserDataFiles={setCriticalUserDataFiles}
                />
              </Suspense>
            )}
        </>
      ) : <ZsSpin id="AdminCriticalUserLoading" />}
    </CriticalUserWrapper>
  );
});

Critical.propTypes = {
  getAllCriticalUserAction: PropTypes.func,
  getSingleCriticalAction: PropTypes.func,
  addCriticalUserAction: PropTypes.func,
  updateCriticalUserAction: PropTypes.func,
  deleteCriticalUserAction: PropTypes.func,
  importCriticalUserAction: PropTypes.func,
  fakeActionCriticalUser: PropTypes.func,
};

Critical.defaultProps = {
  getAllCriticalUserAction: null,
  getSingleCriticalAction: null,
  addCriticalUserAction: null,
  updateCriticalUserAction: null,
  deleteCriticalUserAction: null,
  importCriticalUserAction: null,
  fakeActionCriticalUser: null,
};
export default Critical;
