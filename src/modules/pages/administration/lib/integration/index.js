import React, {
  lazy, Suspense,
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Icons from '../../../../../components/icons';
import ZsModal from '../../../../../components/modal';
import NoData from '../../../../../components/NoData';
import Toaster from '../../../../../components/toaster';
import ZsTooltip from '../../../../../components/tooltip';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import {
  ekashaPermission, integrationData, PermissionRO, setintegrationData,
} from '../../../../../helpers/lib/StorageHandlers';
import { IntegrationWrapper } from './style';
import { ZsSpin } from '../../../../../components/Spin';
import {
  debounceFunc, encryptPassword, onScrollIncList, retryLazy,
} from '../../../../../helpers/envData';
import ZsInput from '../../../../../components/forms/input';
import { RegexList } from '../../../../../helpers/lib/RegexList';
import { TimeFilContext } from '../../../../containers/TimeFilterContext';

const NewIntegration = lazy(() => retryLazy(() => import('./lib/newIntegration')));
const PreviewIntegration = lazy(() => retryLazy(() => import('./lib/previewIntegration')));

let subscribe;

const Integration = React.memo((props) => {
  const {
    getAllIntegration, fakeActionIntegration, getSingleIntegration, deleteIntegrationAction,
    getAllFieldsAction, addIntegrationAction, updateIntegrationAction,
  } = props;

  const typeList = [
    { name: 'TCP', value: 'tcp' },
    { name: 'UDP', value: 'udp' },
    { name: 'RabbitMQ', value: 'rabbit' },
    { name: 'Backup Server', value: 'backupServer' },
  ];
  const [loadingNodata, setLoadingNoData] = useState(true);
  const [integration, setIntegration] = useState([]);
  const [integrationType, setIntegrationType] = useState();
  const [openPreview, setOpenPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [integrationToken, setIntegrationToken] = useState();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [singleIntegration, setSingleIntegration] = useState({
    intr: 1,
    intervalUnit: 'MINUTE',
    schedulingStatus: true,
    configuration: {},
  });
  const [allFieldsList, setAllFieldList] = useState([]);
  const [singlePreview, setSinglePreview] = useState({});
  const [loading, setLoading] = useState(false);
  const [singleField, setSingleField] = useState({ key: '', value: '' });
  const [jsonFields, setjsonFields] = useState([]);
  const [nameBindError, setNameBindError] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText });
  const [listLoad, setListLoad] = useState(false);
  const outerRef = useRef(null);

  const {
    customerID,
  } = useContext(TimeFilContext);

  // *** response of api call start *** //
  const GetAllIntegration = useSelector((state) => (
    state.Integration.GetAllIntegration ? state.Integration.GetAllIntegration : {}
  ));

  const GetSingleIntegrationRes = useSelector((state) => (
    state.Integration.GetSingleIntegration ? state.Integration.GetSingleIntegration : {}
  ));

  const DeleteIntegrationRes = useSelector((state) => (
    state.Integration.DeleteIntegrationResponse ? state.Integration.DeleteIntegrationResponse : {}
  ));

  const getAllFieldsActionRes = useSelector((state) => (
    state.Integration.GetAllFieldsResponse ? state.Integration.GetAllFieldsResponse : {}
  ));

  const AddIntegrationRes = useSelector((state) => (
    state.Integration.AddIntegrationResponse ? state.Integration.AddIntegrationResponse : {}
  ));

  const UpdateIntegrationRes = useSelector((state) => (
    state.Integration.UpdateIntegrationResponse ? state.Integration.UpdateIntegrationResponse : {}
  ));

  const openPreviewModal = useCallback((type, data) => {
    if (type === 'preview') {
      setOpenPreview(true);
      setPreviewLoading(true);
      setIntegrationType(type);
      getSingleIntegration(data.token, localStorage.getItem('customerID'));
    }
  }, []);

  const handlePreviewClose = useCallback(() => {
    setOpenPreview(false);
    setPreviewLoading(false);
    setSinglePreview({});
  }, []);

  const handleClose = useCallback(() => {
    setOpenAddModal(false);
    setValueEdited(false);
    setSingleIntegration({
      intr: 1,
      intervalUnit: 'MINUTE',
      schedulingStatus: true,
      configuration: {},
    });
    setIntegration((pre) => {
      const data = JSON.parse(JSON.stringify(pre));
      const inde = data.findIndex((i) => i.token === integrationData.token);
      if (inde !== -1) {
        data[inde].configuration = JSON.stringify(integrationData.config);
      }
      return pre;
    });
    setSinglePreview({});
    setLoading(false);
    setjsonFields([]);
    setSingleField({ key: '', value: '' });
    setIntegrationType('new');
    setSubmitted(false);
  }, [integrationData]);

  const openIntegrationModal = useCallback((type, data) => {
    setOpenAddModal(true);
    setIntegrationType(type);
    if (type === 'edit') {
      getAllFieldsAction(localStorage.getItem('customerID'));
      if (data.mappings) {
        let str = data.mappings;
        str = str.split(',');
        const tempAr = [];
        str.forEach((e) => {
          const x = e.split(':');
          tempAr.push({ key: x[0], value: x[1] });
        });
        setjsonFields(tempAr);
      }
      if (data.medium === 'backupServer' && typeof data.configuration === 'string') {
        setintegrationData(JSON.parse(data.configuration), data.token);
        data.configuration = JSON.parse(data.configuration);
      }
      setSingleIntegration(JSON.parse(JSON.stringify(data)));
    }
  }, []);

  const setConfigration = useCallback((e, type) => {
    setValueEdited(true);
    const singleIntegration1 = { ...singleIntegration };
    const { configuration } = singleIntegration1;
    configuration[type] = e.target.value;
    singleIntegration1.intr = 1;
    singleIntegration1.intervalUnit = 'MINUTE';
    setSingleIntegration(singleIntegration1);
  }, [singleIntegration]);

  const setData = useCallback((e, type, fields) => {
    setValueEdited(true);
    const singleIntegration1 = { ...singleIntegration };
    if (type === 'mappings') {
      const singleField1 = { ...singleField };
      singleField1[fields] = e.target.value;
      setSingleField(singleField1);
    } else if (type === 'medium') {
      if (e.value !== '') {
        const jsonFields1 = [];
        setjsonFields(jsonFields1);
        singleIntegration1[type] = e.value;
        singleIntegration1.source = null;
        singleIntegration1.folderName = '';
        if (singleIntegration1.medium !== 'backServer') {
          singleIntegration1.configuration = {};
        }
        singleIntegration1.intr = 1;
        singleIntegration1.intervalUnit = 'MINUTE';
        if (singleIntegration1.medium !== 'backupServer') {
          singleIntegration1.type = 'cef';
        }
      }
    } else if (type === 'source') {
      singleIntegration1[type] = e.target.value;
    } else if (type === 'type') {
      if (e.target.value === true) {
        singleIntegration1[type] = 'cef';
      } else {
        getAllFieldsAction(localStorage.getItem('customerID'));
        singleIntegration1[type] = 'json';
      }
      setSingleIntegration(singleIntegration1);
    } else {
      singleIntegration1[type] = e.target.value;
    }
    setSingleIntegration(singleIntegration1);
  }, [singleIntegration]);

  const setJsonFields = useCallback(() => {
    const jsonFields1 = [...jsonFields];
    if (singleField.key !== '' && singleField.value !== '') {
      if (jsonFields1.findIndex((e) => e.value === singleField.value
        && e.key === singleField.key) === -1) {
        jsonFields1.push(singleField);
      }
      jsonFields1.forEach((d) => {
        if (d.key === 'incidentName') {
          setNameBindError(false);
        }
      });
    }
    const str = [];
    jsonFields1.forEach((e) => {
      str.push(`${e.key}:${e.value}`);
    });

    const singleIntegration2 = { ...singleIntegration };
    singleIntegration2.mappings = str.toString();
    setjsonFields(jsonFields1);
    setSingleIntegration(singleIntegration2);
    setSingleField({ key: '', value: '' });
  }, [valueEdited, jsonFields, singleField, singleIntegration]);

  const removeMe = useCallback((index) => {
    const jsonFields2 = [...jsonFields];
    if (jsonFields2.findIndex((e) => e.key === 'incidentName') === -1) {
      setNameBindError(true);
    }
    jsonFields2.splice(index, 1);

    const str = [];
    jsonFields2.forEach((e) => {
      str.push(`${e.key}:${e.value}`);
    });

    const singleIntegration3 = { ...singleIntegration };
    singleIntegration3.mappings = str.toString();
    if (integrationType === 'edit') setValueEdited(true);
    setjsonFields(jsonFields2);
    setSingleIntegration(singleIntegration3);
  }, [jsonFields, singleIntegration]);

  const submit = useCallback(() => {
    setSubmitted(true);
    const {
      configName, source, type, medium, configuration,
    } = singleIntegration;

    if (medium !== 'backupServer') {
      if (!(configName && type && source && medium)) {
        return;
      }
    }
    if (medium === 'backupServer') {
      if (!configuration) {
        return;
      }
      if (!(configName && configuration.ip && configuration.path && configuration.userName
        && configuration.password && medium)) {
        return;
      }
      if (!(RegexList.ip.test(configuration.ip))
        || !(/((?:[a-zA-Z]:){0,1}(?:[\\/][\w.]+){1,})$/.test(configuration.path))) {
        return;
      }
    }
    if (type === 'json' && medium !== 'backupServer') {
      const { mappings } = singleIntegration;
      if (!(mappings)) {
        return;
      }
      if (jsonFields.findIndex((e) => e.key === 'incidentName') === -1) {
        setNameBindError(true);
        return;
      }
    }
    setLoading(true);
    if (integrationType === 'new') {
      singleIntegration
        .configuration.password = encryptPassword(singleIntegration.configuration.password);
      singleIntegration.customerID = localStorage.getItem('customerID');
      addIntegrationAction(singleIntegration);
    }
    if (integrationType !== 'new') {
      // data.configuration = JSON.parse(data.configuration);
      if (medium !== 'backupServer') {
        singleIntegration.configuration = {};
      }
      if (medium === 'backupServer') {
        delete singleIntegration.type;
      }
      singleIntegration
        .configuration.password = encryptPassword(singleIntegration.configuration.password);
      singleIntegration.customerID = localStorage.getItem('customerID');
      updateIntegrationAction(singleIntegration);
    }
  }, [singleIntegration, jsonFields, integrationType]);

  const integrationUpdateSock = (dataRes) => {
    if (dataRes.status) {
      let searchTemp;
      setSearchText((pre) => { searchTemp = pre; return pre; });
      setIntegration((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.token && e.customerID === localStorage.getItem('customerID'));
        if (index !== -1) {
          const a = prevState;
          a[index] = dataRes.data;
          const filterData = JSON.parse(JSON.stringify(a)).filter(
            (d) => d.configName?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
          );
          return searchTemp !== undefined ? JSON.parse(JSON.stringify(filterData)) : a;
        }
        return JSON.parse(JSON.stringify(prevState));
      });
      if (!dataRes.data.configName?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
        setTotalCount((prevS) => prevS - 1);
      }
    }
  };

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setIntegration((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllIntegration({
        page: 0, pageData: 30, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  }, [searchText]);

  // ** Socket Update Start ** //
  const onIntegrationkDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'integration') {
      console.log(dataRes, '.....');
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((currentSearchText) => {
              setIntegration((prevState) => {
                const searchTerm = (currentSearchText || '').toLowerCase();
                if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.configName?.toLowerCase()?.includes(searchTerm)
                  && dataRes.data.customerID === localStorage.getItem('customerID')) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });

              setTotalCount((pre) => pre + (dataRes.data?.configName?.toLowerCase()
                ?.includes((currentSearchText || '').toLowerCase()) ? 1 : 0));

              return currentSearchText;
            });
          }
          break;

        case 'update':
          integrationUpdateSock(dataRes);
          break;

        case 'delete':
          if (dataRes.status) {
            setIntegration((prevState) => prevState.filter((e) => e.token !== dataRes.data));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall();
          }
          break;
        default:
          break;
      }
    }
  };

  // Next Page Function
  const nextPage = useCallback(() => {
    getAllIntegration({ ...errorName, page: errorName.page + 1, customerID: localStorage.getItem('customerID') });
  }, [errorName]);

  const setSearchTerm = debounce((searchValue) => {
    getAllIntegration({
      pageData: 30, page: 0, searchText: searchValue, customerID: localStorage.getItem('customerID'),
    });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setIntegration([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'integration').read) {
        getAllIntegration({
          pageData: 30, page: 0, searchText: '', customerID: localStorage.getItem('customerID'),
        });
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData, customerID]);

  // ** Socket Update End ** //
  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onIntegrationkDataRecieved);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  // getIntegrationList response handler
  useEffect(() => {
    if (GetAllIntegration.status) {
      if (GetAllIntegration.data.currentPage !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllIntegration.data.currentPage });
        setIntegration([...integration, ...GetAllIntegration.data.totalElement]);
      } else {
        setIntegration([...GetAllIntegration.data.totalElement]);
      }
      setLoadingNoData(false);
      setTotalCount(GetAllIntegration.data.totalCount);
      setTotalPage(GetAllIntegration.data.totalPages);
      fakeActionIntegration();
    } else if (GetAllIntegration.status === false) {
      setIntegration([]);
      setLoadingNoData(false);
      fakeActionIntegration();
    }
  }, [GetAllIntegration]);

  // getSingleIntegration response handler
  useEffect(() => {
    if (GetSingleIntegrationRes.status) {
      setSinglePreview(GetSingleIntegrationRes.data);
      setPreviewLoading(false);
      fakeActionIntegration();
    } else if (GetSingleIntegrationRes.status === false) {
      setOpenPreview(false);
      setPreviewLoading(false);
      fakeActionIntegration();
    }
  }, [GetSingleIntegrationRes]);

  // deleteIntegration response handler
  useEffect(() => {
    if (DeleteIntegrationRes.status) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionIntegration();
    } else if (DeleteIntegrationRes.status === false) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionIntegration();
    }
  }, [DeleteIntegrationRes]);

  // getAllFields response handler
  useEffect(() => {
    if (getAllFieldsActionRes.status) {
      setAllFieldList(getAllFieldsActionRes.data);
      fakeActionIntegration();
    } else if (getAllFieldsActionRes.status === false) {
      setDeleteLoading(false);
      setOpenDeleteModal(false);
      fakeActionIntegration();
    }
  }, [getAllFieldsActionRes]);

  // AddIntegration response handler
  useEffect(() => {
    if (AddIntegrationRes.status) {
      handleClose();
      fakeActionIntegration();
    } else if (AddIntegrationRes.status === false) {
      setLoading(false);
      fakeActionIntegration();
    }
  }, [AddIntegrationRes]);

  // UpdateIntegration. response handler
  useEffect(() => {
    if (UpdateIntegrationRes.status) {
      handleClose();
      fakeActionIntegration();
    } else if (UpdateIntegrationRes.status === false) {
      setLoading(false);
      fakeActionIntegration();
    }
  }, [UpdateIntegrationRes]);

  const importImages = (filename) => {
    switch (filename) {
      case 'email':
        return (
          <img src={require('../../../../../assets/images/integrationImages/email.svg').default} alt={filename} />
        );
      case 'rabbit':
        return (
          <img src={require('../../../../../assets/images/integrationImages/rabbit.svg').default} alt={filename} />
        );
      case 'tcp':
        return (
          <img src={require('../../../../../assets/images/integrationImages/tcp.svg').default} alt={filename} />
        );
      case 'udp':
        return (
          <img src={require('../../../../../assets/images/integrationImages/udp.svg').default} alt={filename} />
        );
      case 'backupserver':
        return (
          <img src={require('../../../../../assets/images/integrationImages/backup.svg').default} alt={filename} />
        );
      default:
        return null;
    }
  };

  const integrationTopContent = (i) => (
    <div className="topContent">
      <div style={{ opacity: PermissionRO('administration', 'integration').write ? '1' : '0.4' }}>
        <Icons
          id={`ekasha_integration_edit_btn${i}`}
          type="edit"
          icontype="globle"
          data-test="ekasha_integration_edit_btn"
          onClick={PermissionRO('administration', 'integration').write
            ? () => openIntegrationModal('edit', integration[i])
            : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          className="btmIcn"
          style={{
            cursor: 'pointer', position: 'relative', right: '25px',
          }}
        />
      </div>
      <div style={{ marginLeft: '5px' }}>
        <Icons
          id={`ekasha_integration_preview_btn${i}`}
          type="eyeOpen"
          icontype="common"
          data-test="ekasha_integration_preview_btn"
          onClick={() => openPreviewModal('preview', integration[i])}
          className="btmIcn"
          style={{
            cursor: 'pointer', position: 'relative', right: '14px',
          }}
        />
      </div>
      <div style={{ opacity: PermissionRO('administration', 'integration').delete ? '1' : '0.4' }}>
        <Icons
          id={`ekasha_integration_delete_btn${i}`}
          type="delete"
          icontype="globle"
          data-test="ekasha_integration_delete_btn"
          onClick={PermissionRO('administration', 'integration').delete ? () => { setOpenDeleteModal(true); setIntegrationToken(integration[i].token); } : () => Toaster({ title: "You don't have permission.", type: 'error' })}
          style={{ cursor: 'pointer' }}
          className="btmIcn"
        />
      </div>
    </div>
  );

  if (!PermissionRO('administration', 'integration').read) {
    return <NoData id="ekasha_integration_nodata" style={{ position: 'absolute' }} data-test="ekasha_integration_nodata" message="You don't have permission to access this page" />;
  }

  return (
    <IntegrationWrapper id="ekasha_integration_wrapper">
      {loadingNodata && <ZsSpin id="mainRouteLoading" />}
      {(
        <div style={{
          display: 'flex', justifyContent: 'end', position: 'relative', margin: '10px 1px', paddingRight: '14px', top: '13px',
        }}
        >
          <ZsInput
            inputtype="search"
            id="Administration_Integration_searchBox"
            placeholdertext="Search for Config Name"
            value={searchText || ''}
            onChange={(e) => searchChange(e.target.value)}
            searchclear={rptSearchClear}
          />
          <Icons
            id="Admin_integration_Add_btn"
            icontype="globle"
            className="addIncidentIcon"
            type="addNewButtonSmall"
            data-test="ekasha_integration_add_btn"
            onClick={PermissionRO('administration', 'integration').write
              ? () => openIntegrationModal('new')
              : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            style={{
              cursor: 'pointer', opacity: PermissionRO('administration', 'integration').write ? 1 : 0.4,
            }}
          />
        </div>
      )}
      {integration.length < 1 && !loadingNodata
        ? !loadingNodata && (
          <NoData
            id="Admin_integration_Nodata_of_Table"
            style={{ height: 'calc(100% - 1px)' }}
          />
        )
        : !loadingNodata && (
          <div className="bodyPart" data-test="ekasha_integration_list">
            <div className="iBodyOption" id="ekasha_integration_list" ref={outerRef} onScroll={() => onScrollIncList(outerRef, nextPage, listLoad, setListLoad, totalCount, integration?.length)}>
              <div className="integra">
                {integration.map((d, i) => (
                  <div key={i} className="integraBox">
                    <div style={{ marginTop: '3px' }}>
                      <div style={{ marginLeft: '5px', fontSize: '14px', textTransform: d.medium === 'tcp' || d.medium === 'udp' ? 'uppercase' : 'capitalize' }} className="dName">{d.medium === 'rabbit' ? 'RabbitMQ' : d.medium}</div>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '40px' }}>
                      <div className="pBodyImg">
                        {importImages(d.medium.toLowerCase())}
                      </div>
                      <div className="fType">
                        <div className="fName">
                          <ZsTooltip
                            autoRight
                            ids={`Integration_config_name_${d.configName}`}
                            style={{ textOverflow: 'ellipsis', overflow: 'hidden', padding: '3px 0' }}
                            title={d.configName}
                          >
                            <div className="SourceName" id={`Integration_config_name_${d.configName}`} style={{ color: '#3575bb', fontSize: '18px', height: '20px' }}>{d.configName}</div>
                          </ZsTooltip>
                        </div>
                        {d.medium !== 'backupServer' && (
                          <div className="fName">
                            <div style={{ padding: '3px 0' }}>Source :</div>
                            <ZsTooltip
                              autoRight
                              ids={`Integration_source_name_${d.source}`}
                              style={{ textOverflow: 'ellipsis', overflow: 'hidden', padding: '3px 0' }}
                              title={d.source}
                            >
                              <div className="SourceName" id={`Integration_source_name_${d.source}`} style={{ color: '#3575bb', padding: '3px' }}>
                                {d.source}
                              </div>
                            </ZsTooltip>
                          </div>
                        )}
                        {d.medium !== 'backupServer' && (
                          <div className="fName">
                            Type :
                            &nbsp;
                            <span style={{ color: '#3575bb', textTransform: 'uppercase' }}>{d.type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {integrationTopContent(i)}
                  </div>
                ))}
              </div>
              <div>{listLoad && <div data-test="ekashaPaginationLoaded" className="loadMore" />}</div>
            </div>
          </div>
        )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Integration(s)</span>
      </div>
      {openDeleteModal && (
        <ZsModal
          id="Admin_ekasha_integration_delete_modal"
          open={openDeleteModal}
          modaltype="confirm"
          msg="Are you sure to delete this integration ?"
          title="Warning"
          data-test="ekasha_integration_delete_modal"
          className="ProxyDeleteConfirm"
          loading={deleteLoading}
          onOk={() => {
            deleteIntegrationAction(integrationToken, localStorage.getItem('customerID'));
            setDeleteLoading(true);
          }}
          onCancel={() => {
            setOpenDeleteModal(false);
          }}
        />
      )}
      {openPreview
        && (
          <Suspense fallback={null}>
            <PreviewIntegration
              visible={openPreview}
              previewLoading={previewLoading}
              onHide={handlePreviewClose}
              type={integrationType}
              singlePreviewIntegration={singlePreview}
            />
          </Suspense>
        )}
      {openAddModal && (
        <Suspense fallback={null}>
          <NewIntegration
            handleClose={handleClose}
            typeList={typeList}
            type={integrationType}
            show={openAddModal}
            singleIntegration={singleIntegration}
            setData={setData}
            loading={loading}
            submitted={submitted}
            valueEdited={valueEdited}
            submit={submit}
            jsonFields={jsonFields}
            ruleIntegrationFields={allFieldsList}
            setJsonFields={setJsonFields}
            removeMe={removeMe}
            nameBindError={nameBindError}
            singleField={singleField}
            setConfigration={setConfigration}
          />
        </Suspense>
      )}

    </IntegrationWrapper>
  );
});

Integration.propTypes = {
  getAllIntegration: PropTypes.func,
  fakeActionIntegration: PropTypes.func,
  getSingleIntegration: PropTypes.func,
  deleteIntegrationAction: PropTypes.func,
  getAllFieldsAction: PropTypes.func,
  addIntegrationAction: PropTypes.func,
  updateIntegrationAction: PropTypes.func,
};

Integration.defaultProps = {
  getAllIntegration: null,
  fakeActionIntegration: null,
  getSingleIntegration: null,
  deleteIntegrationAction: null,
  getAllFieldsAction: null,
  addIntegrationAction: null,
  updateIntegrationAction: null,
};
export default Integration;
