/* eslint-disable max-len */
import React, {
  useEffect, useState, useMemo, useCallback, lazy, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { AssetsWrapper } from './style';
import ZoneEkasha from '../../../../containers/administration/ZoneEkasha';
import ZsTabs from '../../../../../components/tabs';
import ZsTable from '../../../../../components/table';
import NoData from '../../../../../components/NoData';
import ZsToggle from '../../../../../components/forms/toggle';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import Toaster from '../../../../../components/toaster';
import Icons from '../../../../../components/icons';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../../../components/modal';
import { ZsSpin } from '../../../../../components/Spin';
import { getAssetsTableColumns } from './AssetTableColumns';
import {
  debounceFunc, getTableHeight, retryLazy, scrollToError,
} from '../../../../../helpers/envData';
import ZsInput from '../../../../../components/forms/input';
import { RegexList } from '../../../../../helpers/lib/RegexList';

let subscribe;

const CreateAssets = lazy(() => retryLazy(() => import('./lib/createAssets')));

const Assets = React.memo((props) => {
  const {
    getAllAssetsAction, fakeActionAssets, changeAssetsStatusAction, deleteAssetsAction,
    insertAssetsAction, getSingleAssetAction, updateAssetsAction,
    InsertAssetsFileAction, fakeActionUser, getCountryCodeAction,
  } = props;

  // local state
  const [loading, setLoading] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState('Asset_Directory');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [assetsFiles, setAssetsFiles] = useState([]);
  const [values, setValues] = useState({ assetStatus: true });

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // modal state
  const [deleteAssets, setDeleteAssets] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assetModelLoading, setAssetModelLoading] = useState(false);
  const [createAssets, setCreateAssets] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [modaltype, setModaltype] = useState(null);
  const [individually, setIndividually] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [countryCodeList, setCountryCodeList] = useState([]);

  // redux state
  const GetAllAssetsRes = useSelector((state) => (state.Assets.GetAllAssetsResponse || {}));
  const InsertAssetsRes = useSelector((state) => (state.Assets.InsertAssetsResponse || {}));
  const UpdateAssetsRes = useSelector((state) => (state.Assets.UpdateAssetsResponse || {}));
  const DeleteAssetsRes = useSelector((state) => (state.Assets.DeleteAssetsResponse || {}));
  const InsertAssetsFileRes = useSelector((state) => (state.Assets.InsertAssetsFileResponse || {}));
  const ChangeAssetsStatusRes = useSelector(
    (state) => (state.Assets.ChangeAssetsStatusResponse || {}),
  );
  const CountryCodeGetAllRes = useSelector((state) => (
    state.User.CountryCodeGetAllResponse || {}
  ));

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    setValues((prevValues) => ({
      ...prevValues,
      [fieldType]: value,
    }));
  }, []);

  // modal close
  const closeHandler = useCallback(() => {
    setSubmited(false);
    setAssetsFiles([]);
    setSubmitLoading(false);
    setIndividually(false);
    setAssetModelLoading(false);
    setCreateAssets(false);
    setModaltype(null);
    setSelectedRowKeys([]);
    setValueEdited(false);
    setSelectedRows([]);
    setValues({});
    setDeleteAssets(false);
  }, []);

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(() => {
    let rowsLength;
    let totalRows;
    setAssetsList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    });
    setTotalCount((prevState) => { totalRows = prevState; return prevState; });
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllAssetsAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  // select row
  const onSelect = useCallback((record) => {
    if ((selectedRowKeys.indexOf(record.token) === -1 || selectedRowKeys.length === 0)) {
      setSelectedRows((prevState) => [record, ...prevState]);
      setSelectedRowKeys((prevState) => [record.token, ...prevState]);
    } else {
      setSelectedRows((prevState) => (prevState.filter((e) => e.token !== record.token)));
      setSelectedRowKeys((prevState) => (prevState.filter((token) => token !== record.token)));
    }
  }, [selectedRowKeys]);

  const onSelectAll = useCallback((record) => {
    assetsList.forEach((e) => {
      if (record) {
        const index = selectedRowKeys.indexOf(e.token);
        if (index === -1) {
          setSelectedRows((prevState) => [e, ...prevState]);
          setSelectedRowKeys((prevState) => [e.token, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter((pre) => pre.token !== e.token)));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.token)));
      }
    });
  }, [assetsList, selectedRowKeys]);

  const selectDeselectAll = useCallback((type) => {
    assetsList.forEach((e) => {
      if (type === 'selectAll') {
        const index = selectedRowKeys.indexOf(e.token);
        if (index === -1) {
          setSelectedRowKeys((prevState) => [e.token, ...prevState]);
          setSelectedRows((prevState) => [e, ...prevState]);
        }
      } else {
        setSelectedRows((prevState) => (prevState.filter((pre) => pre.token !== e.token)));
        setSelectedRowKeys((prevState) => (prevState.filter((tokens) => tokens !== e.token)));
      }
    });
  }, [assetsList, selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  const deleteModal = useCallback((i) => {
    setSelectedRowKeys([i.token]);
    setSelectedRows([i]);
    setDeleteAssets(true);
  }, []);

  const deleteRowModal = useCallback(() => {
    setDeleteAssets(true);
  }, []);

  const createModal = useCallback((type) => {
    setModaltype(type);
    setCreateAssets(true);
    if (type === 'new') {
      setValues({ assetStatus: true });
    }
  }, []);

  const submitModal = useCallback(() => {
    scrollToError();
    setSubmited(true);
    const requiredFields = ['hostName', 'ip', 'subnetMask'];
    const regexChecks = {
      hostName: RegexList.hostname,
      ip: RegexList.privateIp,
      subnetMask: RegexList.numberOnly,
    };

    const isMissingRequiredField = requiredFields.some((field) => !values[field]);
    const isInvalidRegex = !Object.keys(regexChecks).every(
      (field) => values[field] && regexChecks[field].test(values[field]),
    );
    const isInvalidSubnetMask = !(parseInt(values.subnetMask) > 0
    && parseInt(values.subnetMask) <= 32);

    if (isMissingRequiredField || isInvalidRegex || isInvalidSubnetMask) {
      return;
    }

    const {
      macAddress,
      staticAddressing,
      alternateInterface,
      ownerEmail,
      ownerNumber,
      countryToken,
    } = values;

    if (
      (macAddress && !RegexList.macAddress.test(macAddress))
      || (staticAddressing && !RegexList.ip.test(staticAddressing))
      || (alternateInterface && !RegexList.privateIp.test(alternateInterface))
      || (ownerEmail && !RegexList.email.test(ownerEmail))
      || (ownerNumber && (!RegexList.contactNumber.test(ownerNumber) || !countryToken))
      || (countryToken && !ownerNumber)
    ) {
      return;
    }

    if (modaltype === 'new') {
      insertAssetsAction(values);
    } else {
      updateAssetsAction(values);
    }
    setSubmitLoading(true);
  }, [modaltype, values]);

  // assets file import
  const ImportFile = useCallback((fileList) => {
    const file = assetsFiles;
    fileList.forEach((e) => {
      file.push(e.originFileObj);
    });
    setAssetsFiles(file);
    setSubmitLoading(true);
    InsertAssetsFileAction(assetsFiles);
  }, [assetsFiles]);

  // Next Page Function
  const nextPage = useCallback(() => {
    if (errorName.page < totalPage - 1) {
      getAllAssetsAction({ ...errorName, page: errorName.page + 1, searchText });
    }
  }, [errorName, totalPage, searchText]);

  const setSearchTerm = debounce((searchValue) => {
    if (activeDetailTab === 'Asset_Directory') {
      getAllAssetsAction({ pageData: 30, page: 0, searchText: searchValue });
    }
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName, activeDetailTab]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAssetsList([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  const assetUpdateStatusAssignSock = useCallback((dataRes) => {
    if (dataRes.status) {
      setAssetsList((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.token);
        if (index !== -1) {
          const a = prevState;
          a[index].assetStatus = dataRes.data.status;
          return [...a];
        }
        return prevState;
      });
    }
  }, []);

  const assetUpdateSock = useCallback((dataRes) => {
    if (dataRes.status) {
      setAssetsList((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.token);
        if (index !== -1) {
          const a = prevState;
          a[index] = dataRes.data;
          return [...a];
        }
        return prevState;
      });
    }
  }, []);

  const assetAddSock = useCallback((dataRes) => {
    if (dataRes.status) {
      let searchTemp = '';
      setSearchText((pre) => { searchTemp = pre; return pre; });
      if (!(Array.isArray(dataRes.data))) {
        setAssetsList((prevState) => {
          if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
          && dataRes.data?.hostName?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
            return [dataRes.data, ...prevState];
          }
          return prevState;
        });
        setTotalCount((pre) => pre
        + (dataRes.data?.hostName?.toLowerCase()?.includes(searchTemp?.toLowerCase()) ? 1 : 0));
      } else {
        const filteredData = dataRes.data.filter(
          (e) => e.hostName?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
        );
        setAssetsList((prevState) => [...filteredData, ...prevState]);
        setTotalCount((prevState) => prevState + filteredData.length);
      }
    }
  }, []);

  const assetDeleteSock = useCallback((dataRes) => {
    if (dataRes.status) {
      setAssetsList((prevState) => prevState.filter((e) => !dataRes.data.includes(e.token)));
      setTotalCount((prevState) => prevState - dataRes.data.length);
      getTableDataCall();
      setSelectedRowKeys(
        (prevState) => prevState?.filter((d) => !dataRes.data.includes(d)),
      );
      setSelectedRows(
        (prevState) => prevState.filter((d) => !dataRes.data.includes(d.token)),
      );
    }
  }, []);

  // socket res get
  const onAssetsdataReceived = useCallback((payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'asset') {
      switch (dataRes.operation) {
        case 'assetUpdateStatusAssign':
          assetUpdateStatusAssignSock(dataRes);
          break;
        case 'update':
          assetUpdateSock(dataRes);
          break;
        case 'add':
          assetAddSock(dataRes);
          break;
        case 'delete':
          assetDeleteSock(dataRes);
          break;
        default:
          break;
      }
    }
  }, []);

  useEffect(() => {
    getCountryCodeAction();
  }, []);

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setErrorName({ page: 0, pageData: 30, searchText: '' });
  }, [activeDetailTab]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onAssetsdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // render page
  useEffect(() => {
    setSearchText('');
    if (activeDetailTab === 'Asset_Directory') {
      setLoading(true);
      getAllAssetsAction(errorName);
    }
  }, [activeDetailTab, ekashaPermission.aclData]);

  useEffect(() => {
    if (CountryCodeGetAllRes.status && CountryCodeGetAllRes.status === true) {
      if (CountryCodeGetAllRes.data.length > 0) {
        CountryCodeGetAllRes.data.forEach((element, i) => {
          CountryCodeGetAllRes.data[i].value = `${element.countryName} - ${element.countryCode}`;
          CountryCodeGetAllRes.data[i].name = element.countryName;
        });
        setCountryCodeList(CountryCodeGetAllRes.data);
      }
      fakeActionUser();
    } else if (CountryCodeGetAllRes.status === false) {
      setCountryCodeList([]);
      fakeActionUser();
    }
  }, [CountryCodeGetAllRes]);

  useEffect(() => {
    if (GetAllAssetsRes.status) {
      if (GetAllAssetsRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllAssetsRes.data.number });
        setAssetsList([...assetsList, ...GetAllAssetsRes.data.content]);
      } else {
        setAssetsList([...GetAllAssetsRes.data.content]);
      }
      setLoading(false);
      setTotalCount(GetAllAssetsRes.data.totalElements);
      setTotalPage(GetAllAssetsRes.data.totalPages);
      fakeActionAssets();
    } else if (GetAllAssetsRes.status === false) {
      setLoading(false);
      fakeActionAssets();
    }
  }, [GetAllAssetsRes]);

  useEffect(() => {
    if (ChangeAssetsStatusRes.status) {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      fakeActionAssets();
    } else if (ChangeAssetsStatusRes.status === false) {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      fakeActionAssets();
    }
  }, [ChangeAssetsStatusRes]);

  useEffect(() => {
    if (DeleteAssetsRes.status) {
      fakeActionAssets();
      closeHandler();
    } else if (DeleteAssetsRes.status === false) {
      setSubmitLoading(false);
      fakeActionAssets();
    }
  }, [DeleteAssetsRes]);

  useEffect(() => {
    if (UpdateAssetsRes.status) {
      fakeActionAssets();
      closeHandler();
    } else if (UpdateAssetsRes.status === false) {
      setSubmitLoading(false);
      fakeActionAssets();
    }
  }, [UpdateAssetsRes]);

  useEffect(() => {
    if (InsertAssetsRes.status) {
      fakeActionAssets();
      closeHandler();
    } else if (InsertAssetsRes.status === false) {
      setSubmitLoading(false);
      fakeActionAssets();
    }
  }, [InsertAssetsRes]);

  useEffect(() => {
    if (InsertAssetsFileRes.status) {
      fakeActionAssets();
      closeHandler();
    } else if (InsertAssetsFileRes.status === false) {
      setSubmitLoading(false);
      setAssetsFiles([]);
      fakeActionAssets();
    }
  }, [InsertAssetsFileRes]);

  const columns = useMemo(() => (getAssetsTableColumns(
    selectedRowKeys, assetsList, onSelect, onSelectAll, createModal,
    setAssetModelLoading, getSingleAssetAction, deleteModal, changeAssetsStatusAction,
  )), [selectedRowKeys, assetsList]);

  return (
    <AssetsWrapper data-test="Administration_Assets_Wrapper">
      <div className="headerAsset">
        <ZsTabs
          id="Administration_Assets_Tabs"
          data-test="Administration_Assets_Tabs"
          className="AssetsTab"
          scrollbtn
          tabType="box"
          defaultSetActiveTab={activeDetailTab}
          onTabClick={(e) => setActiveDetailTab(e)}
          items={[
            {
              key: 'Asset_Directory',
              label: 'Asset Directory',
            },
            {
              key: 'Asset_zone',
              label: 'Asset Zone',
            },
          ]}
        />
        {(PermissionRO('administration', 'assets').read || PermissionRO('administration', 'assets').write) && activeDetailTab === 'Asset_Directory' && (
          <div className="addAction">
            {PermissionRO('administration', 'assets').read && (
            <ZsInput
              inputtype="search"
              id="Administration_Assets_searchBox"
              placeholdertext="Search for Hostname"
              value={searchText || ''}
              onChange={(e) => searchChange(e.target.value)}
              searchclear={rptSearchClear}
            />
            )}
            {PermissionRO('administration', 'assets').read && (
            <Icons
              id="Admin_add_Assets_Btn"
              icontype="globle"
              type="addNewButtonSmall"
              data-test="Admin_add_Assets_Btn"
              style={{ cursor: 'pointer', opacity: PermissionRO('administration', 'assets').write ? 1 : 0.4 }}
              onClick={PermissionRO('administration', 'assets').write
                ? (() => { createModal('new'); })
                : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            />
            )}
          </div>
        )}
      </div>
      {activeDetailTab === 'Asset_zone' && (
        <ZoneEkasha />
      )}
      {!PermissionRO('administration', 'assets').read
        ? <NoData data-test="PermissionRO_Assets_Modue" message="You don't have permission to access this page" />
        : activeDetailTab === 'Asset_Directory' && (
          loading
            ? (
              <div style={{ height: getTableHeight([], 98) }}>
                <ZsSpin id="Admin_Assets_Table_Loading" />
              </div>
            ) : !loading && assetsList.length > 0
              ? (
                <div style={{ height: getTableHeight([], 98) }}>
                  <ZsTable
                    data-test="ekasha_Administration_Assets_Table"
                    id="ekasha_Administration_Assets_Table"
                    rule={selectedRows.length > 0}
                    rowSelection={rowSelection}
                    dataSource={assetsList}
                    columns={columns}
                    rowKey="token"
                    pagination={false}
                    horizontal
                    totalCount={totalCount}
                    nextPage={nextPage}
                    selectedRows={selectedRowKeys}
                  />
                </div>
              )
              : !loading && (
                <NoData
                  id="Admin_Assets_NoData_in_Table"
                  data-test="Admin_Assets_NoData_in_Table"
                  style={{ height: getTableHeight([], 98) }}
                />
              )
        )}
      {deleteAssets && (
        <ZsModal
          id="Administration_Delete_Assets_Modal"
          data-test="Administration_Delete_Assets_Modal"
          open={deleteAssets}
          className="deleteUserModal"
          modaltype="confirm"
          msg="Are you sure to delete this asset (s) ?"
          title="Warning"
          type={false}
          loading={submitLoading}
          onOk={() => {
            deleteAssetsAction(selectedRowKeys); setSubmitLoading(true);
          }}
          onCancel={() => {
            setSubmitLoading(false); setDeleteAssets(false); closeHandler();
          }}
        />
      )}
      {createAssets && (
        <Suspense fallback={false}>
          <CreateAssets
            data-test="Assets_Create_modal"
            createAssets={createAssets}
            assetModelLoading={assetModelLoading}
            countryCodeList={countryCodeList}
            modaltype={modaltype}
            closeModal={closeHandler}
            submitLoading={submitLoading}
            valueEdited={valueEdited}
            individually={individually}
            setIndividually={setIndividually}
            submitModal={submitModal}
            values={values}
            setValueEdited={setValueEdited}
            ImportFile={ImportFile}
            setValues={setValues}
            setData={setData}
            submited={submited}
            setSubmited={setSubmited}
            setAssetModelLoading={setAssetModelLoading}
            setSelectedRowKeys={setSelectedRowKeys}
            createModal={createModal}
            fakeActionAssets={fakeActionAssets}
          />
        </Suspense>
      )}
      {activeDetailTab === 'Asset_Directory' && (
      <div className="bottomOptions">
        {selectedRows.length === 1 && (
          <div
            style={{ display: 'flex' }}
            id="administration_asset_statusAllBtn"
            data-test="administration_asset_statusAllBtn"
            className="btmOption"
            onClick={
              !PermissionRO('administration', 'assets').write
                ? () => Toaster({ title: "You don't have permission.", type: 'error' }) : () => changeAssetsStatusAction(selectedRows[0])
            }
          >
            <div style={{ display: 'flex' }}>
              <ZsToggle
                data-test={`user_Status_${selectedRows[0].token}`}
                className={(PermissionRO('administration', 'assets').write) ? 'Enabled' : 'Disabled'}
                style={{ opacity: PermissionRO('administration', 'assets').write ? 1 : 0.4 }}
                value={selectedRows[0].assetStatus}
              />
            </div>
            <div style={{ marginLeft: '8px', marginTop: '2px' }}>
              {selectedRows.length > 0 && selectedRows[0].assetStatus ? 'Disable' : 'Enable'}
            </div>
          </div>
        )}
        {selectedRowKeys.length > 0 && assetsList.length > 0
         && !(assetsList.map((e) => e.token).every((e) => selectedRowKeys.includes(e))) && (
         <div
           id="administration_asset_selectAllBtn"
           data-test="administration_asset_selectAllBtn"
           className="btmOption"
           onClick={() => selectDeselectAll('selectAll')}
         >
           <Icons style={{ top: '3px', position: 'relative' }} icontype="common" type="selectAll" className="btmIcon" />
           Select All
         </div>
        )}
        {assetsList.length > 0 && selectedRowKeys.length > 0 && (
          <div
            id="administration_asset_deselectAllBtn"
            data-test="administration_asset_deselectAllBtn"
            className="btmOption"
            onClick={() => selectDeselectAll('deselectAll')}
          >
            <Icons icontype="common" style={{ top: '3px', position: 'relative' }} type="selectAll" className="btmIcon" />
            Deselect All
          </div>
        )}
        {assetsList.length > 0 && selectedRowKeys.length > 0 && (
          <div
            id="administration_asset_deleteAllBtn"
            data-test="administration_asset_deleteAllBtn"
            className="btmOption"
            onClick={
              (PermissionRO('administration', 'assets').delete)
                ? () => { deleteRowModal(); }
                : () => Toaster({ title: "You don't have permission.", type: 'error' })
            }
          >
            <Icons
              style={{ marginRight: '10px', position: 'relative', top: '4px' }}
              type="delete"
              icontype="globle"
              className="btmIcon"
            />
            Delete
          </div>
        )}
        <div className="totalCounts">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">Assets Directory(s)</span>
        </div>
      </div>
      )}
    </AssetsWrapper>
  );
});

Assets.propTypes = {
  fakeActionUser: PropTypes.func,
  getCountryCodeAction: PropTypes.func,
  getAllAssetsAction: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  changeAssetsStatusAction: PropTypes.func,
  deleteAssetsAction: PropTypes.func,
  insertAssetsAction: PropTypes.func,
  getSingleAssetAction: PropTypes.func,
  updateAssetsAction: PropTypes.func,
  InsertAssetsFileAction: PropTypes.func,
};

Assets.defaultProps = {
  fakeActionUser: null,
  getCountryCodeAction: null,
  getAllAssetsAction: null,
  fakeActionAssets: null,
  changeAssetsStatusAction: null,
  deleteAssetsAction: null,
  insertAssetsAction: null,
  getSingleAssetAction: null,
  updateAssetsAction: null,
  InsertAssetsFileAction: null,
};

export default Assets;
