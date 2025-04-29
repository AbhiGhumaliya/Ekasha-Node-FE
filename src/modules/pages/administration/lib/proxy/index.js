/* eslint-disable max-len */
import React, {
  useEffect, useState, useMemo, useCallback, Suspense,
} from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icons from '../../../../../components/icons';
import ZsModal from '../../../../../components/modal';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import NewProxy from './lib/NewProxy';
import { ProxyWrapper } from './style';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import NoData from '../../../../../components/NoData';
import { ZsSpin } from '../../../../../components/Spin';
import { getProxyColumns } from './proxyTableColumns';
import { debounceFunc, encryptPassword, getTableHeight } from '../../../../../helpers/envData';
import ZsInput from '../../../../../components/forms/input';
import { RegexList } from '../../../../../helpers/lib/RegexList';

let subscribe;

const Proxy = React.memo((props) => {
  const {
    getAllProxyAction, fakeActionProxy, deleteProxyAction,
    addProxyAction, getSingleProxyAction, updateProxyAction,
  } = props;

  const [fetchLoading, setFetchLoading] = useState(true);
  const [allProxyData, setAllProxyData] = useState([]);
  const [values, setValues] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectProxyToken, setSelectProxyToken] = useState();
  const [valueEdited, setValueEdited] = useState(false);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [proxyType, setProxyType] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [proxyModelLoading, setProxyModelLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  // Pagination

  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // check user permission read
  if (!PermissionRO('administration', 'proxy').read) {
    return <NoData style={{ position: 'absolute' }} data-test="ekasha_proxy_nodata" message="You don't have permission to access this page" />;
  }

  // *** response of api call start *** //
  const GetAllProxyRes = useSelector((state) => (
    state.Proxy.GetAllProxyResponse ? state.Proxy.GetAllProxyResponse : {}
  ));

  const DeleteProxyRes = useSelector((state) => (
    state.Proxy.ProxyDeleteResponse ? state.Proxy.ProxyDeleteResponse : {}
  ));

  const AddProxyRes = useSelector((state) => (
    state.Proxy.AddProxyResponse ? state.Proxy.AddProxyResponse : {}
  ));

  const UpdateProxyRes = useSelector((state) => (
    state.Proxy.UpdateProxyResponse ? state.Proxy.UpdateProxyResponse : {}
  ));
    // *** response of api call end *** //

  const deleteProxyHandler = useCallback((token) => {
    setSelectProxyToken(token);
    setOpenDeleteModal(true);
  }, []);

  const modalTypeProxy = useCallback((type) => {
    setProxyType(type);
    setOpenNewModal(true);
  }, []);
  const editProxyHandler = useCallback((token) => {
    setProxyModelLoading(true);
    modalTypeProxy('edit');
    getSingleProxyAction(token);
  }, []);

  const handleClose = useCallback(() => {
    setValues({});
    setSubmitLoading(false);
    setProxyModelLoading(false);
    setOpenNewModal(false);
    setSelectProxyToken({});
    setSubmited(false);
    setValueEdited(false);
  }, []);

  const setSearchTerm = debounce((searchValue) => {
    getAllProxyAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAllProxyData([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    setValues((prevValues) => ({ ...prevValues, [fieldType]: value }));
  }, []);

  const nextPage = useCallback(() => {
    getAllProxyAction({ ...errorName, page: errorName.page + 1 });
  }, [errorName]);

  const onFinish = useCallback(() => {
    setSubmited(true);
    const proxyData = { ...values };
    const requiredFields = ['host', 'port', 'username', 'password'];
    const regexChecks = {
      port: RegexList.port,
      host: RegexList.hostname,
    };
    if (
      requiredFields.some((field) => !proxyData[field])
        || !Object.keys(regexChecks).every((field) => regexChecks[field].test(proxyData[field]))
        || proxyData.port > 65536
    ) {
      return;
    }
    setSubmitLoading(true);
    proxyData.password = encryptPassword(proxyData.password);
    if (proxyType === 'new') {
      addProxyAction(proxyData);
    } else if (proxyType === 'edit') {
      updateProxyAction(proxyData);
    }
  }, [values, proxyType]);

  const getTableDataCall = useCallback(() => {
    setAllProxyData((prevState) => {
      const rowsLength = prevState.length;
      if (totalCount > rowsLength && rowsLength < 15) {
        getAllProxyAction({ page: 0, pageData: 30, searchText });
      }
      return [...prevState];
    });
  }, [totalCount, searchText]);

  const onProxyDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'proxy') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((pre) => {
              setAllProxyData((prevState) => {
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1 && dataRes.data?.host?.toLowerCase()?.includes(pre?.toLowerCase())) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((prev) => prev + (dataRes.data?.host?.toLowerCase().includes(pre?.toLowerCase()) ? 1 : 0));
              return pre;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setSearchText((pre) => {
              setAllProxyData((prevState) => {
                const index = prevState.findIndex((e) => e.token === dataRes.data.token);
                if (index !== -1) {
                  const a = prevState;
                  a[index] = dataRes.data;
                  const filterData = a.filter((d) => d.host?.toLowerCase()?.includes(pre?.toLowerCase()));
                  return filterData;
                }
                return prevState;
              });
              if (!dataRes.data.host?.toLowerCase()?.includes(pre?.toLowerCase())) {
                setTotalCount((prevS) => prevS - 1);
              }
              return pre;
            });
          }
          break;
        case 'delete':
          setAllProxyData((prevState) => prevState.filter((e) => e.token !== dataRes.data));
          setTotalCount((prevState) => prevState - 1);
          getTableDataCall();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'proxy').read) {
        getAllProxyAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onProxyDataRecieved);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // getAllProxy response handler
  useEffect(() => {
    if (GetAllProxyRes.status) {
      if (GetAllProxyRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllProxyRes.data.number });
        setAllProxyData([...allProxyData, ...GetAllProxyRes.data.content]);
      } else {
        setAllProxyData([...GetAllProxyRes.data.content]);
      }
      setFetchLoading(false);
      setTotalCount(GetAllProxyRes.data.totalElements);
      setTotalPage(GetAllProxyRes.data.totalPages);
      fakeActionProxy();
    } else if (GetAllProxyRes.status === false) {
      setAllProxyData([]);
      setFetchLoading(false);
      fakeActionProxy();
    }
  }, [GetAllProxyRes]);

  // deleteProxy response handler
  useEffect(() => {
    if (DeleteProxyRes.status && DeleteProxyRes.status === true) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionProxy();
    } else if (DeleteProxyRes.status === false) {
      setOpenDeleteModal(false);
      setDeleteLoading(false);
      fakeActionProxy();
    }
  }, [DeleteProxyRes]);

  // AddProxy response handlers
  useEffect(() => {
    if (AddProxyRes.status) {
      handleClose();
      setSubmitLoading(false);
      fakeActionProxy();
    } else if (AddProxyRes.status === false) {
      setSubmitLoading(false);
      fakeActionProxy();
    }
  }, [AddProxyRes]);

  // updateProxy response handler
  useEffect(() => {
    if (UpdateProxyRes.status) {
      handleClose();
      setSubmitLoading(false);
      fakeActionProxy();
    } else if (UpdateProxyRes.status === false) {
      setSubmitLoading(false);
      fakeActionProxy();
    }
  }, [UpdateProxyRes]);

  const columns = useMemo(() => (
    getProxyColumns(editProxyHandler, deleteProxyHandler)
  ), [editProxyHandler, deleteProxyHandler]);

  return (
    <ProxyWrapper data-test="ekasha_proxy_module">
      <div className="addAction">
        <ZsInput
          inputtype="search"
          id="Administration_Proxy_searchBox"
          placeholdertext="Search for Host"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <Icons
          icontype="globle"
          type="addNewButtonSmall"
          id="ekasha_proxy_add_btn"
          data-test="ekasha_proxy_add_btn"
          onClick={PermissionRO('administration', 'proxy').write ? () => modalTypeProxy('new') : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'proxy').write ? 1 : 0.4 }}
        />
      </div>
      {!fetchLoading ? (
        <>
          {allProxyData.length > 0 ? (
            <>
              <div style={{ height: getTableHeight([], 90) }}>
                <ZsTable
                  data-test="ekasha_proxy_table"
                  id="proxyListTable"
                  columns={columns}
                  dataSource={allProxyData}
                  rowKey="token"
                  pagination={false}
                  displayType="block"
                  totalCount={totalCount}
                  nextPage={nextPage}
                />
              </div>
            </>
          ) : (
            <NoData
              id="Admin_Ekasha_Proxy_NoData"
              data-test="proxy_nodata"
              style={{ height: 'calc(100% - 90px)' }}
            />
          )}
          {openDeleteModal && (
            <ZsModal
              visible={openDeleteModal}
              modaltype="confirm"
              msg="Are you sure to delete this proxy ?"
              title="Warning"
              data-test="ekasha_proxy_delete_modal"
              className="ProxyDeleteConfirm"
              loading={deleteLoading}
              onOk={() => {
                deleteProxyAction(selectProxyToken); setDeleteLoading(true);
              }}
              onCancel={() => {
                setOpenDeleteModal(false);
              }}
            />
          )}
          {openNewModal && (
          <Suspense fallback={null}>
            <NewProxy
              visible={openNewModal}
              onHide={handleClose}
              proxyType={proxyType}
              proxyModelLoading={proxyModelLoading}
              onFinish={onFinish}
              values={values}
              setData={setData}
              valueEdited={valueEdited}
              submitLoading={submitLoading}
              setSubmited={setSubmited}
              submited={submited}
              setValues={setValues}
              setProxyModelLoading={setProxyModelLoading}
              fakeActionProxy={fakeActionProxy}
              setOpenNewModal={setOpenNewModal}
              setProxyType={setProxyType}
            />
          </Suspense>
          )}
        </>
      ) : (
        <div style={{ height: 'calc(100% - 90px)' }}>
          <ZsSpin id="AdminProxyLoading" />
        </div>
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Proxy Configuration(s)</span>
      </div>
    </ProxyWrapper>
  );
});

Proxy.propTypes = {
  getAllProxyAction: PropTypes.func,
  fakeActionProxy: PropTypes.func,
  deleteProxyAction: PropTypes.func,
  addProxyAction: PropTypes.func,
  getSingleProxyAction: PropTypes.func,
  updateProxyAction: PropTypes.func,
};

Proxy.defaultProps = {
  getAllProxyAction: null,
  fakeActionProxy: null,
  deleteProxyAction: null,
  addProxyAction: null,
  getSingleProxyAction: null,
  updateProxyAction: null,
};
export default Proxy;
