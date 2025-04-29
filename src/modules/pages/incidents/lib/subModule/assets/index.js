/* eslint-disable no-unused-vars */
import React, {
  useState, useEffect, useRef, useMemo, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { debounce } from 'lodash';
import ZsButton from '../../../../../../components/forms/button';
import { ekashaPermission, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import { AssetsWrapper } from './style';
import NoData from '../../../../../../components/NoData';
import Toaster from '../../../../../../components/toaster';
import ZsSelect from '../../../../../../components/forms/select';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { ZsSpin } from '../../../../../../components/Spin';
import ExpandableTable from '../../../../../../components/table/ExpandableTable';
import { getIncidentAssetsColumns } from './IncidentAssetsTableColumns';
import { debounceFunc } from '../../../../../../helpers/envData';
import ZsInput from '../../../../../../components/forms/input';

let subscribe;

const Assets = (props) => {
  const {
    getAllAssetesStatus, fakeAssetsIncidentAction, IncidentId, getAllIncidentAssetsAction,
    fakeActionAssets, assignToIncident, removeAassignToIncident, getAssetData, selectIncident,
    fakeActionUser, getCountryCodeAction,
  } = props;

  const [newSelect, setNewSelect] = useState(false);
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectData, setSelectData] = useState({});
  const [assignAssetName, setAssignAssetName] = useState('');
  const [assetsData, setAssetsData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [countryCodeList, setCountryCodeList] = useState([]);
  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({
    incidentId: IncidentId, page: 0, pageData: 30, searchText: '',
  });
  const [rowkey, setRowkey] = useState([]);
  const [listLoad, setListLoad] = useState(false);
  const currentPageRef = useRef(0);

  const disableAddedField = React.useMemo(() => assetsData?.map(
    (obj) => obj.token,
  ), [assetsData]);

  const GetAllAssetsRes = useSelector((state) => (state.Assets.GetAllIncidentAssetsResponse || {}));
  const AssignToIncidentResponse = useSelector((state) => (
    state.IncAssets.AssignToIncidentResponse || {}));
  const GetAllAssetsStatusRes = useSelector((state) => (
    state.IncAssets.GetAllAssetsStatusResponse || {}));
  const RemoveAssignToIncidentRes = useSelector((state) => (
    state.IncAssets.RemoveAssignToIncidentResponse || {}));
  const GetAssetsDataRes = useSelector((state) => (
    state.IncAssets.GetAssetsDataResponse || {}));
  const CountryCodeGetAllRes = useSelector((state) => (
    state.User.CountryCodeGetAllResponse ? state.User.CountryCodeGetAllResponse : {}
  ));

  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setAssetsData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState;
      return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllAssetesStatus({
        incidentId: IncidentId, page: 0, pageData: 30, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  }, [searchText]);

  const removeAssignedAssetSock = (dataRes) => {
    if (dataRes.status) {
      if (parseInt(dataRes.data.incidentId) === IncidentId) {
        setAssetsData((prevState) => prevState.filter((e) => e.token !== dataRes.data.token && dataRes.data.customerID === localStorage.getItem('customerID')));
        setTotalCount((prevState) => prevState - (dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0));
        getTableDataCall();
      }
    }
  };

  const assetsUpdateSock = (dataRes) => {
    if (dataRes.status) {
      setAssetsData((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.assetToken);
        if (index !== -1) {
          const a = prevState;
          a[index] = dataRes.data;
          return [...a];
        }
        return prevState;
      });
      setSelectedAsset((prevState) => {
        const a = { ...prevState };
        if (a.token === dataRes.data.assetToken) {
          a.data = dataRes.data;
        }
        return { ...a.data };
      });
    }
  };

  const assetUpdateStatusAssignSock = (dataRes) => {
    if (dataRes.status) {
      setAssetsData((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.token);
        if (index !== -1) {
          const a = prevState;
          a[index].assetStatus = dataRes.data.status;
          return [...a];
        }
        return prevState;
      });
    }
  };

  const onAssetsdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'asset') {
      switch (dataRes.operation) {
        case 'removeAssignedAsset':
          removeAssignedAssetSock(dataRes);
          break;
        case 'assetAssgnToIncident':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentId) === IncidentId) {
              // add
              let searchTemp = '';
              setSearchText((pre) => { searchTemp = pre; return pre; });
              setAssetsData((prevState) => {
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                && dataRes.data?.hostName?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                    && dataRes.data.customerID === localStorage.getItem('customerID')) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((pre) => pre
              + (dataRes.data?.hostName?.toLowerCase()?.includes(searchTemp?.toLowerCase())
                                    && dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0));
            }
          }
          break;
        case 'assetUpdateStatusAssign':
          assetUpdateStatusAssignSock(dataRes);
          break;
        case 'update':
          assetsUpdateSock(dataRes);
          break;
        default:
      }
    }
  };

  const columns = useMemo(() => (
    getIncidentAssetsColumns(
      selectIncident, IncidentId, setSelectData, setDeleteModal,
    )
  ), [IncidentId]);

  const expand = useCallback((ee, evals) => {
    setRowkey([]);
    if (ee === true) {
      getAssetData({ assetToken: evals.token, incidentId: IncidentId, customerID: localStorage.getItem('customerID') });
      // setCountryCodeList([]);
      setRowkey([]);
    }
    if (ee === false) {
      setSelectedAsset({});
      setRowkey([]);
    }
  }, [setRowkey]);

  const renderMethod = useCallback(() => {
    if (selectedAsset !== undefined && rowkey.length !== 0) {
      return (
        <div className="assetDetail" style={{ borderTop: '4px solid #17191b', padding: '15px 15px' }}>
          <div className="overviewTitle">
            <div>Host Details</div>
          </div>
          <div className="dataBlock">
            <div className="left">
              <div className="dataKey">Hostname</div>
              <div className="dataValue">
                {selectedAsset.hostName || ' - '}
              </div>
            </div>
            <div className="right">
              <div className="dataKey">Description</div>
              <div className="dataValue">
                {selectedAsset.description || ' - '}
              </div>
            </div>
          </div>
          <div className="dataBlock">
            <div className="left" style={{ display: 'flex' }}>
              <div className="wrap">
                <div className="dataKey">IP</div>
                <div className="dataValue">
                  {selectedAsset.ip || ' - '}
                </div>
              </div>
              <div className="wrap">
                <div className="dataKey">MAC Address</div>
                <div className="dataValue">
                  {selectedAsset.macAddress || ' - '}
                </div>
              </div>
            </div>
            <div className="right" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="wrap">
                <div className="dataKey">Alternative Interface</div>
                <div className="dataValue">
                  {selectedAsset.alternateInterface || ' - '}
                </div>
              </div>
              <div className="wrap">
                <div className="dataKey">Asset Status</div>
                <div className="dataValue">
                  {selectedAsset.assetStatus && selectedAsset.assetStatus === true ? 'Active' : ' Deactive' || ' - '}
                </div>
              </div>
            </div>
          </div>
          <div className="dataBlock">
            <div className="left">
              <div className="dataKey">Categories</div>
              <div className="dataValue">
                {selectedAsset.categories || ' - '}
              </div>
            </div>
            <div className="right" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="wrap">
                <div className="dataKey">Location</div>
                <div className="dataValue">
                  {selectedAsset.locationName || ' - '}
                </div>
              </div>
              <div className="wrap">
                <div className="dataKey">Asset Criticality</div>
                <div className="dataValue" style={{ textTransform: 'capitalize' }}>
                  {selectedAsset.assetCriticality || ' - '}
                </div>
              </div>
            </div>
          </div>
          <div className="subBlock">
            <div className="overviewTitle">
              <div>Owner Details</div>
            </div>
            <div className="dataBlock">
              <div className="subPart">
                <div className="dataKey">Owner</div>
                <div className="dataValue" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>
                  {selectedAsset.assetOwner || ' - '}
                </div>
              </div>
              <div className="subPart">
                <div className="dataKey">Owner Designation</div>
                <div className="dataValue">
                  {selectedAsset.ownerDesignation || ' - '}
                </div>
              </div>
              <div className="subPart">
                <div className="dataKey">Owner Department</div>
                <div className="dataValue">
                  {selectedAsset.ownerDepartment || ' - '}
                </div>
              </div>
            </div>
            <div className="dataBlock">
              <div className="subPart">
                <div className="dataKey">Created By</div>
                <div className="dataValue">
                  {selectedAsset.createdBy || ' - '}
                </div>
              </div>
              <div className="subPart">
                <div className="dataKey">Owner Contact Number</div>
                <div className="dataValue">
                  {selectedAsset.ownerNumber
                  && selectedAsset.countryToken && countryCodeList.length > 0
                    ? (
                      <>
                        <img alt=" " height={15} width={25} src={`data:image/png+xml;base64,${countryCodeList.filter((d) => d.value === selectedAsset.countryToken)[0].countryflag}`} />
                        {' '}
                        <span style={{ marginLeft: '15px' }}>{selectedAsset.ownerNumber}</span>
                      </>
                    )
                    : '-'}
                </div>
              </div>
              <div className="subPart">
                <div className="dataKey">Created Time</div>
                <div className="dataValue">
                  {selectedAsset.createdTime ? moment(selectedAsset.createdTime).format('Do MMMM YYYY,  HH:mm:ss') : ' - '}
                </div>
              </div>
            </div>
            <div className="dataBlock">
              <div className="emailPart">
                <div className="dataKey">Owner Email</div>
                <div className="dataValue">
                  {selectedAsset.ownerEmail || ' - '}
                </div>
              </div>
            </div>
            <div className="subContent">
              <div className="overviewTitle">
                <div>Zone Details</div>
              </div>
              <div className="dataBlock">
                <div className="left">
                  <div className="dataKey">Zone Name</div>
                  <div className="dataValue">
                    {selectedAsset.zoneName || ' - '}
                  </div>
                </div>
                <div className="right">
                  <div className="dataKey">Zone Location</div>
                  <div className="dataValue">
                    {selectedAsset.zoneLocation || ' - '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }, [selectedAsset]);

  const setSearchTerm = debounce((searchValue) => {
    getAllAssetesStatus({
      incidentId: IncidentId,
      page: 0,
      pageData: 30,
      customerID: localStorage.getItem('customerID'),
      searchText: searchValue,
    });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    currentPageRef.current = 0;
    debounceFunc(() => setSearchTerm(val));
  }, [setSearchTerm]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAssetsData([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('incidents', 'incidentAssets').read) {
        getAllAssetesStatus({
          incidentId: IncidentId, page: 0, pageData: 30, searchText: '', customerID: localStorage.getItem('customerID'),
        });
        getCountryCodeAction();
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

  useEffect(() => {
    if (IncidentId > 0) {
      setDataLoading(true);
    }
  }, [IncidentId]);

  useEffect(() => {
    if (GetAllAssetsStatusRes.status) {
      if (GetAllAssetsStatusRes.data && GetAllAssetsStatusRes.data.assetData) {
        if (GetAllAssetsStatusRes.data.currentPage !== errorName.page) {
          setErrorName({ ...errorName, page: GetAllAssetsStatusRes.data.currentPage });
          setAssetsData([...assetsData, ...GetAllAssetsStatusRes.data.assetData]);
        } else {
          setAssetsData([...GetAllAssetsStatusRes.data.assetData]);
        }
      }
      setDataLoading(false);
      setListLoad(false);
      setTotalCount(GetAllAssetsStatusRes.data?.TotalCount || 0);
      setTotalPage(GetAllAssetsStatusRes.data?.totalPages || 0);
      fakeAssetsIncidentAction();
    } else if (GetAllAssetsStatusRes.status === false) {
      setListLoad(false);
      setAssetsData([]);
      setDataLoading(false);
      fakeAssetsIncidentAction();
    }
  }, [GetAllAssetsStatusRes]);

  useEffect(() => {
    if (GetAssetsDataRes.status) {
      setSelectedAsset(GetAssetsDataRes.data);
      setRowkey([GetAssetsDataRes.data.token]);
      fakeAssetsIncidentAction();
    } else if (GetAssetsDataRes.status === false) {
      Toaster({ title: GetAssetsDataRes.operation ? GetAssetsDataRes.operation : GetAssetsDataRes.message, type: 'error' });
      setSelectedAsset({});
      fakeAssetsIncidentAction();
    }
  }, [GetAssetsDataRes]);

  useEffect(() => {
    window.addEventListener('mousedown', (e) => {
      if (newSelect) {
        if (document.getElementById('pMenuOpen')) {
          if (!document.getElementById('pMenuOpen').contains(e.target)) {
            setAssignAssetName('');
            setNewSelect(false);
          }
        }
      }
    });
  }, [newSelect]);

  useEffect(() => {
    if (CountryCodeGetAllRes.status) {
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
      setAllAssets(GetAllAssetsRes.data);
      setNewSelect(true);
      fakeActionAssets();
    } else if (GetAllAssetsRes.status === false) {
      setAllAssets([]);
      Toaster({ title: 'Administration asset data not found.', type: 'error' });
      fakeActionAssets();
    }
  }, [GetAllAssetsRes]);

  useEffect(() => {
    if (AssignToIncidentResponse.status) {
      setNewSelect(false);
      setLoading(false);
      setAssignAssetName('');
      fakeAssetsIncidentAction();
    } else if (AssignToIncidentResponse.status === false) {
      setNewSelect(false);
      setLoading(false);
      setAssignAssetName('');
      fakeAssetsIncidentAction();
    }
  }, [AssignToIncidentResponse]);

  useEffect(() => {
    if (RemoveAssignToIncidentRes.status) {
      setSubmitLoading(false);
      setSelectData({});
      setDeleteModal(false);
      fakeAssetsIncidentAction();
    } else if (RemoveAssignToIncidentRes.status === false) {
      setSubmitLoading(false);
      setSelectData({});
      setDeleteModal(false);
      fakeAssetsIncidentAction();
    }
  }, [RemoveAssignToIncidentRes]);

  const nextPage = (preTotal) => {
    const nextPageNumber = currentPageRef.current + 1;
    if (nextPageNumber <= preTotal) {
      getAllAssetesStatus({
        pageData: 30,
        incidentId: IncidentId,
        page: nextPageNumber,
        customerID: localStorage.getItem('customerID'),
        searchText,
      });
      currentPageRef.current = nextPageNumber;
    }
  };

  const scroll = () => {
    let previousCount = 0;
    let previousAssetsData = [];
    let previousTotalPage = 0;
    setTotalPage((pre) => {
      previousTotalPage = pre;
      return pre;
    });
    setTotalCount((pre) => {
      previousCount = pre;
      return pre;
    });
    setAssetsData((pre) => {
      previousAssetsData = pre;
      return pre;
    });
    const tableContent = document.querySelector('.ant-table-wrapper');
    if (tableContent !== null && listLoad === false) {
      tableContent.addEventListener('scroll', () => {
        if (
          tableContent.scrollTop + tableContent.offsetHeight >= tableContent.scrollHeight - 50
          && tableContent.scrollTop > 0
          && previousCount > previousAssetsData.length
        ) {
          setListLoad(true);
          nextPage(previousTotalPage);
        }
      });
    }
  };

  useEffect(() => {
    scroll();
  }, [GetAllAssetsStatusRes]);

  if (!PermissionRO('incidents', 'incidentAssets').read) {
    return <NoData id="PermissionRO_Incident_Assets" data-test="PermissionRO_Incident_Assets" message="You don't have permission to access this page" />;
  }
  return (
    <AssetsWrapper id="incident_assets_ekasha_wrapper" data-test="incident_assets_ekasha_wrapper">
      <div className="newBtn">
        <ZsInput
          inputtype="search"
          id="Incident_Assets_searchBox"
          placeholdertext="Search.."
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <ZsButton
          id="asset_assign"
          data-test="incident_assets_assign_getALL"
          className="actionAddBtn"
          style={{ float: 'right', opacity: loading || !PermissionRO('incidents', 'incidentAssets').write ? '0.4' : '1' }}
          type="primary"
          loading={loading}
          title={loading ? 'Allocating' : '+ Allocate'}
          onClick={() => {
            if (PermissionRO('incidents', 'incidentAssets').write && !loading) {
              if (newSelect === false) {
                if (selectIncident.status === 'Closed') {
                  Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
                } else {
                  getAllIncidentAssetsAction();
                }
                return;
              }
              setNewSelect(false);
            } else {
              Toaster({ title: "You don't have permission.", type: 'error' });
            }
          }}
        />
        {newSelect && (
          <div id="pMenuOpen" style={{ zIndex: 99 }} className={newSelect ? 'pMenu pMenuOpen' : 'pMenu'}>
            <ZsSelect
              id="iAssets_search"
              label="Select Asset :"
              data-test="assets_select_and_assign"
              className="selectAsstes"
              placeholder="Select"
              selecttype="normal"
              value={assignAssetName || null}
              onChange={(e) => setAssignAssetName(e)}
              data={allAssets}
              dataAlreadyAdded={disableAddedField}
            />
            <ZsButton
              id="asset_assign1"
              data-test="assign_to_incident"
              style={{ marginTop: 20, float: 'right' }}
              type="primary"
              title="OK"
              disabled={!assignAssetName}
              onClick={() => {
                if (assignAssetName) {
                  setNewSelect(!newSelect);
                  setLoading(true);
                  assignToIncident({ incidentId: IncidentId, token: assignAssetName, customerID: localStorage.getItem('customerID') });
                }
              }}
            />
          </div>
        )}
      </div>
      {dataLoading && (
        <div style={{ height: 'calc(100% - 50px)' }}>
          <ZsSpin id="IncidentAssetsLoading" className="incidentSpinner" />
        </div>
      )}
      {assetsData && assetsData.length > 0 && !dataLoading && (
        <div className="tableWrapper">
          <ExpandableTable
            expanded
            columns={columns}
            expandedRowKeys={rowkey}
            rowKey="token"
            id="assets_incident_table"
            data-test="assets_incident_table"
            expandedTable={() => renderMethod()}
            onExpand={(expanded, record) => expand(expanded, record)}
            dataSource={assetsData}
            pagination={false}
            expandIconColumnIndex={6}
            expandIcon={(
              { expanded, onExpand, record },
            ) => (
              <Icons
                iconTooltipType="normal"
                iconTooltipTitle={record.assetStatus ? (!expanded ? 'Expand' : 'Collapse') : 'Disable'}
                type={expanded ? 'arrowUp' : 'arrowDown'}
                style={{ opacity: record.assetStatus ? 1 : 0.4 }}
                id={`Assets_Expand_incident_${record.token}`}
                data-test="expand_table_assets"
                icontype="globle"
                onClick={
                    record.assetStatus
                      ? (e) => onExpand(record, e, expanded)
                      : () => { }
                  }
              />
            )}
          />
          {listLoad && <div className="loadMore" />}
        </div>
      )}
      {assetsData && assetsData.length === 0 && !dataLoading && <NoData style={{ height: 'calc(100% - 50px)' }} />}

      <div className="incidentFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Asset(s)</span>
      </div>

      <ZsModal
        visible={deleteModal}
        modaltype="confirm"
        msg="Are you sure you want to Deallocate this asset ?"
        title="Warning"
        type={false}
        data-test="assets_delete_incident"
        loading={submitLoading}
        onOk={() => { removeAassignToIncident(selectData); setSubmitLoading(true); }}
        onCancel={() => { setSubmitLoading(false); setSelectData({}); setDeleteModal(false); }}
      />
    </AssetsWrapper>
  );
};
Assets.propTypes = {
  getCountryCodeAction: PropTypes.func,
  fakeActionUser: PropTypes.func,
  getAllAssetesStatus: PropTypes.func,
  fakeAssetsIncidentAction: PropTypes.func,
  getAllIncidentAssetsAction: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  assignToIncident: PropTypes.func,
  removeAassignToIncident: PropTypes.func,
  getAssetData: PropTypes.func,
  IncidentId: PropTypes.number,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

Assets.defaultProps = {
  getCountryCodeAction: null,
  fakeActionUser: null,
  getAllAssetesStatus: null,
  fakeAssetsIncidentAction: null,
  getAllIncidentAssetsAction: null,
  fakeActionAssets: null,
  assignToIncident: null,
  removeAassignToIncident: null,
  getAssetData: null,
  IncidentId: -1,
  selectIncident: {},
};
export default Assets;
