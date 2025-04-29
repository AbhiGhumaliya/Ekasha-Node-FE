/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useState, useEffect, useMemo } from 'react';
// import moment from 'moment';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { ekashaPermission, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import PlayBookWrapper from './lib/PlaybookWrapper';
import ZsTable from '../../../components/table';
import Toaster from '../../../components/toaster';
import NoData from '../../../components/NoData';
import Icons from '../../../components/icons';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../components/modal';
import ZsTooltip from '../../../components/tooltip';
import { ZsSpin } from '../../../components/Spin';
import EkashaDropdown from '../../../components/drop_down';
import ZsInput from '../../../components/forms/input';
import ZsSelect from '../../../components/forms/select';
import PreviewPlaybook from './lib/previewPlaybook';
import { debounceFunc, getTableHeight } from '../../../helpers/envData';
import { getPlayBookTableColumns } from './PlayBookTableColumns';
import PlaybookUpdateAndDeletionModel from './lib/playbookDeletionPreview';

let subscribe;

const PlayBook = (props) => {
  const {
    getNewAllPlaybookAction, fakePlaybookAction, DeletePlaybookAction, listRunningSchedulePlaybookAction,
    fakeActionAssets, GetOwnerAction, ClonePlaybookAction, GetPlaybookAction,
  } = props;

  const [playbookList, setPlaybookList] = useState([]);
  const [playbookID, setPlaybookID] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [owner, setOwner] = useState([]);
  const [searchText, setSearchText] = useState('');
  // const [deleteModal, setDeleteModal] = useState(false);
  const [deletePreviewModal, setDeletePreviewModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cloneModal, setCloneModal] = useState(false);
  const [cloneToken, setCloneToken] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [playbookData, setPlaybookData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [deletionPreviewLoading, setDeletionPreviewLoading] = useState(false);
  const [refreshLoad, setRefreshLoad] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [errorName, setErrorName] = useState({
    page: 0,
    pageData: 30,
    search: '',
    createdBy: 'All',
    updatedBy: 'All',
  });
  const [timer, setTimer] = useState(null);

  // redux state
  const GetNewAllPlaybookRes = useSelector(
    (state) => (state.PlayBook.GetNewAllPlaybookResponse || {}),
  );
  const DeletePlaybookRes = useSelector(
    (state) => (state.PlayBook.DeletePlaybookResponse || {}),
  );
  const ClonePlaybookRes = useSelector(
    (state) => (state.PlayBook.ClonePlaybookResponse || {}),
  );
  const GetPlaybookRes = useSelector(
    (state) => (state.PlayBook.GetPlaybookResponse || {}),
  );
  const GetOwnerRes = useSelector((state) => (state.Assets.GetOwnerResponse || {}));

  useEffect(() => {
    if (GetOwnerRes.status) {
      setOwner([{ name: 'All', value: 'All' }, ...GetOwnerRes.data]);
      fakeActionAssets();
    } else if (GetOwnerRes.status === false) {
      fakeActionAssets();
    }
  }, [GetOwnerRes]);

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = () => {
    let rowsLength; let totalRows;
    setPlaybookList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    });
    setTotalCount((prevState) => { totalRows = prevState; return prevState; });
    if (totalRows > rowsLength && rowsLength < 15) {
      getNewAllPlaybookAction({
        page: 0,
        pageData: 30,
        search: '',
        createdBy: 'All',
        updatedBy: 'All',
      });
    }
  };

  const onPlaybookdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'playbook') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setErrorName((prevst) => {
              setOwner((prev) => {
                const filterData = prev?.filter((d) => d.value === prevst.createdBy);
                setPlaybookList((prevState) => {
                  if (prevState?.findIndex((e) => e.token === dataRes.data.token) === -1
                      && dataRes.data?.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                      && ((filterData[0].name !== 'All' && filterData[0].name === dataRes.data?.createdBy) || filterData[0].name === 'All')) {
                    setTotalCount([dataRes.data, ...prevState].length);
                    return [dataRes.data, ...prevState];
                  }
                  return prevState;
                });
                return prev;
              });
              return prevst;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setPlaybookList((prevState) => {
              const index = prevState.findIndex((e) => e.id === dataRes.data.id);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                const filterData = JSON.parse(JSON.stringify(a)).filter((d) => d.name?.toLowerCase()?.includes(searchTemp?.toLowerCase()));
                setTotalCount(filterData.length);
                return filterData;
              }
              return prevState;
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setPlaybookList((prevState) => prevState.filter((e) => !dataRes.data.includes(e.token)));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall();
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('playbook').read) {
        getNewAllPlaybookAction({
          page: 0,
          pageData: 30,
          search: '',
          createdBy: 'All',
          updatedBy: 'All',
        });
        GetOwnerAction();
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
        subscribe = stompClient.subscribe('/topic/broadcast', onPlaybookdataReceived);
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
    if (GetNewAllPlaybookRes.status) {
      if (!Array.isArray(GetNewAllPlaybookRes.data)) {
        if (GetNewAllPlaybookRes.data.currentPage !== errorName.page) {
          setErrorName({ ...errorName, page: GetNewAllPlaybookRes.data.currentPage });
          setPlaybookList([...playbookList, ...GetNewAllPlaybookRes.data.playbookData]);
        } else {
          setPlaybookList([...GetNewAllPlaybookRes.data.playbookData]);
        }
      } else {
        setPlaybookList([]);
      }
      setLoading(false);
      setRefreshLoad(false);
      setTotalCount(GetNewAllPlaybookRes.data?.totalCount || 0);
      setTotalPage(Math.ceil(parseInt(GetNewAllPlaybookRes.data.totalCount) / 30));
      fakePlaybookAction();
    } else if (GetNewAllPlaybookRes.status === false) {
      setPlaybookList([]);
      setRefreshLoad(false);
      setLoading(false);
      fakePlaybookAction();
    }
  }, [GetNewAllPlaybookRes]);

  useEffect(() => {
    if (DeletePlaybookRes.status) {
      setSelectedRowKeys([]);
      // setDeleteModal(false);
      setSubmitLoading(false);
      fakePlaybookAction();
    } else if (DeletePlaybookRes.status === false) {
      setSubmitLoading(false);
      fakePlaybookAction();
    }
  }, [DeletePlaybookRes]);
  useEffect(() => {
    if (ClonePlaybookRes.status) {
      setCloneModal(false);
      setSubmitLoading(false);
      fakePlaybookAction();
    } else if (ClonePlaybookRes.status === false) {
      setSubmitLoading(false);
      fakePlaybookAction();
    }
  }, [ClonePlaybookRes]);

  useEffect(() => {
    if (GetPlaybookRes.status) {
      setPlaybookData(GetPlaybookRes.data);
      setPreviewLoading(false);
      setSubmitLoading(false);
      fakePlaybookAction();
    } else if (GetPlaybookRes.status === false) {
      setSubmitLoading(false);
      setPreviewLoading(false);
      fakePlaybookAction();
    }
  }, [GetPlaybookRes]);

  const setSearchTerm = debounce((searchValue) => {
    setPlaybookList([]);
    getNewAllPlaybookAction({
      search: searchValue,
      page: 0,
      pageData: 30,
      createdBy: errorName.createdBy,
      updatedBy: errorName.updatedBy,
    });
  }, 300);

  const ownerChangeHandler = (value, type) => {
    errorName[type] = value;
    setErrorName(errorName);
    if (type === 'search') {
      setSearchText(value);
      debounceFunc(() => setSearchTerm(value));
    } else {
      getNewAllPlaybookAction(errorName);
    }
  };

  const handleDropChange = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  const rptSearchClear = () => {
    setSearchText('');
    errorName.search = '';
    setErrorName(errorName);
    setPlaybookList([]);
    debounceFunc(() => setSearchTerm(''));
  };

  const cloneModalFun = (token) => {
    setCloneToken(token);
    setCloneModal(true);
  };

  const previewModelFun = (data) => {
    GetPlaybookAction(data.id);
    setPreviewLoading(true);
    setPreviewModal(true);
  };

  const importPlaybookData = () => { };
  const exportPlaybookData = () => { };

  const addIdToLocalstorage = (url) => {
    window.open(url);
  };

  const refrashBtn = () => {
    if (!refreshLoad) {
      setRefreshLoad(true);
      setSearchText('');
      errorName.search = '';
      errorName.createdBy = 'All';
      errorName.updatedBy = 'All';
      setErrorName(errorName);
      getNewAllPlaybookAction({
        page: 0,
        pageData: 30,
        search: '',
        createdBy: 'All',
        updatedBy: 'All',
      });
    }
  };

  const deleteModelFun = (ObjId) => {
    setSelectedRowKeys([ObjId]);
    setPlaybookID(ObjId);
    listRunningSchedulePlaybookAction(ObjId, localStorage.getItem('customerID'));
    setDeletionPreviewLoading(true);
    setDeletePreviewModal(true);
  };

  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getNewAllPlaybookAction({
        page: errorName.page + 1,
        pageData: 30,
        search: '',
        createdBy: errorName.createdBy,
        updatedBy: errorName.updatedBy,
      });
      setSearchText('');
    }
  };

  const columns = useMemo(() => (getPlayBookTableColumns(addIdToLocalstorage, cloneModalFun, previewModelFun, deleteModelFun)), []);

  if (!PermissionRO('playbook').read) {
    return <NoData message="You don't have permission to access this page" />;
  }

  return (
    <PlayBookWrapper>
      {/* {loading && <ZsSpin id="PlaybookTableLoading" />} */}

      <div className="headerPlayBook">
        <div className="topSearch">
          <div className="searchContent">
            <ZsInput
              inputtype="search"
              id="Playbook_Free_Search_for_device"
              width="308px"
              placeholdertext="Search free text"
              value={errorName.search || ''}
              onChange={(e) => ownerChangeHandler(e.target.value, 'search')}
              searchclear={() => rptSearchClear()}
            />
          </div>
          <div id="userDrpMenu">
            <EkashaDropdown
              triggerType="click"
              showContent={(
                <div className="dropdown-menu outerStyleAppFilter" style={{ backgroundColor: '#0e0e0e' }}>
                  <div style={{ width: 'auto', height: 'auto', padding: '10px 15px' }}>
                    <div className="subFilter">
                      <ZsSelect
                        id="logs_type"
                        label="Created By"
                        data-test="logs_type_select"
                        value={errorName.createdBy || null}
                        onChange={(e) => ownerChangeHandler(e, 'createdBy')}
                        selecttype="normal"
                        defaultValue="All"
                        width="100%"
                        data={owner}
                      />
                    </div>
                    <div className="subFilter">
                      <ZsSelect
                        id="logs_type"
                        label="Created By"
                        data-test="logs_type_select"
                        value={errorName.updatedBy || null}
                        onChange={(e) => ownerChangeHandler(e, 'updatedBy')}
                        selecttype="normal"
                        defaultValue="All"
                        width="100%"
                        data={owner}
                      />
                    </div>
                  </div>
                </div>
              )}
            >
              <div className="filterPart" onClick={handleDropChange}>
                <Icons
                  id="incident_searchBoxIcn"
                  style={{ cursor: 'pointer' }}
                  data-test="search_click"
                  icontype="common"
                  type={filterDropdownOpen ? 'SelectUpArrow' : 'SelectArrow'}
                />
              </div>
            </EkashaDropdown>
          </div>
        </div>
        <div className="iHeaderOptions">
          <div className="refreshBtns ml">
            <ZsTooltip autoRight subType="iconTool" title="Refresh">
              <div
                className="refreshPlaybook"
                id="playbookrefreshBtn"
                onClick={refrashBtn}
              >
                <Icons
                  icontype="common"
                  type="ReFresh"
                  className={refreshLoad ? 'spinnerRestart refreshBtn' : 'refreshBtn'}
                />
              </div>
            </ZsTooltip>
          </div>
          <div
            id="Admin_ekasha_preview_lists_Import_btn"
            className={PermissionRO('playbook').write ? 'preButtonActionPermission preButtonAction ml' : 'preButtonActionPermission ml'}
            style={{ opacity: PermissionRO('playbook').write ? 1 : 0.4 }}
            onClick={PermissionRO('playbook').write ? () => importPlaybookData() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
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
            id="Admin_ekasha_preview_lists_export_btn"
            className={PermissionRO('playbook').write ? 'preButtonActionPermission preButtonAction ml' : 'preButtonActionPermission ml'}
            style={{ opacity: PermissionRO('playbook').write ? 1 : 0.4 }}
            onClick={PermissionRO('playbook').write ? () => exportPlaybookData() : () => Toaster({ title: "You don't have permission.", type: 'error' })}
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
          {PermissionRO('playbook').write
            ? (
              <div style={{ height: '27px' }} className="ml" onClick={() => addIdToLocalstorage('#/zeronsec/playbook/new/create')}>
                <Icons id="playbookIcon1_add" style={{ cursor: 'pointer' }} type="addNewButtonSmall" icontype="globle" className="tAddBtn" height={27} width={27} />
              </div>
            ) : (
              <div style={{ height: '27px' }} className="ml">
                <Icons id="playbookIcon2_add" style={{ opacity: PermissionRO('playbook').write ? 1 : 0.4 }} type="addNewButtonSmall" icontype="globle" onClick={() => Toaster({ title: "You don't have permission.", type: 'error' })} className="tAddBtn" height={27} width={27} />
              </div>
            )}
        </div>
      </div>
      {loading && (
        <div style={{ height: 'calc(100% - 95px)' }}>
          <ZsSpin id="PlaybookTableLoading" />
        </div>
      )}
      {!loading && playbookList?.length !== 0 && (
        <div style={{ height: getTableHeight([], 95) }}>
          <ZsTable
            data-test="Playbook_List_Table"
            id="playbookListTable"
            dataSource={playbookList}
            columns={columns}
            rowKey="token"
            pagination={false}
            changeColors
            displayType="block"
            totalCount={totalCount}
            nextPage={nextPage}
          />
        </div>
      )}
      {!loading && playbookList?.length < 1 && (
        <div style={{ height: 'calc(100% - 95px)' }}>
          <NoData />
        </div>
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Playbook(s)</span>
      </div>
      <ZsModal
        visible={cloneModal}
        modaltype="confirm"
        msg="Are you sure you want to clone playbook(s) ?"
        title="Warning"
        type
        loading={submitLoading}
        confirmType
        onOk={() => {
          setSubmitLoading(true);
          ClonePlaybookAction(cloneToken);
        }}
        onCancel={() => {
          setSubmitLoading(false);
          setCloneModal(false);
        }}
        closeModal={() => { setCloneModal(false); setSubmitLoading(false); }}
      />
      {previewModal && (
        <PreviewPlaybook
          previewModal={previewModal}
          setPreviewModal={setPreviewModal}
          playbookData={playbookData}
          previewLoading={previewLoading}
        />
      )}
      {deletePreviewModal && (
        <PlaybookUpdateAndDeletionModel
          playbookID={playbookID}
          modelType="Deletion"
          modelShow={deletePreviewModal}
          setModelShow={setDeletePreviewModal}
          previewLoading={deletionPreviewLoading}
          setPreviewModelLoading={setDeletionPreviewLoading}
          fakePlaybookAction={fakePlaybookAction}
          DeletePlaybookAction={DeletePlaybookAction}
          defaultScreen={1}
        />
      )}
      {/* <ZsModal
        visible={deleteModal}
        className="deletePlaybookModal"
        modaltype="confirm"
        msg="Are you sure you want to delete playbook(s) ?"
        title="Warning"
        type={false}
        data-test="deletePlaybookModal"
        loading={submitLoading}
        onOk={() => {
          setSubmitLoading(true); DeletePlaybookAction(selectedRowKeys[0]);
        }}
        onCancel={() => {
          setSubmitLoading(false); setDeleteModal(false); setSelectedRowKeys([]);
        }}
      /> */}
    </PlayBookWrapper>
  );
};

PlayBook.propTypes = {
  getNewAllPlaybookAction: PropTypes.func,
  fakePlaybookAction: PropTypes.func,
  DeletePlaybookAction: PropTypes.func,
  GetOwnerAction: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  ClonePlaybookAction: PropTypes.func,
  GetPlaybookAction: PropTypes.func,
  listRunningSchedulePlaybookAction: PropTypes.func,
};

PlayBook.defaultProps = {
  getNewAllPlaybookAction: null,
  fakePlaybookAction: null,
  DeletePlaybookAction: null,
  GetOwnerAction: null,
  fakeActionAssets: null,
  ClonePlaybookAction: null,
  GetPlaybookAction: null,
  listRunningSchedulePlaybookAction: null,
};

export default PlayBook;
