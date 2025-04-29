import { debounce } from 'lodash';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ZsButton from '../../../../../../components/forms/button';
import ZsRadio from '../../../../../../components/forms/radio';
import Icons from '../../../../../../components/icons';
import ZsModal from '../../../../../../components/modal';
import ZsSelect from '../../../../../../components/forms/select';
import NoData from '../../../../../../components/NoData';
import ZsInput from '../../../../../../components/forms/input';
import ZsTable from '../../../../../../components/table';
import Toaster from '../../../../../../components/toaster';
import {
  convertTimeBaseTimeZoneFunction, ekashaPermission, PermissionRO,
} from '../../../../../../helpers/lib/StorageHandlers';
import { EvidancePreviewWrapper, EvidenceWrapper, EvidenseModelWrapper } from './style';
import { RegexList } from '../../../../../../helpers/lib/RegexList';
import FileUpload from '../../../../../../components/file_upload';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import FilePreview from '../references/lib/previewFile';
import { ZsSpin } from '../../../../../../components/Spin';
import { getEvidenceColumns } from './EvidenceTableColumns';
import { debounceFunc, getTableHeight } from '../../../../../../helpers/envData';

let subscribe;

const Evidence = React.memo((props) => {
  const {
    IncidentId, getAllEvidenceAction, fakeEvidenceAction, filePreview,
    deleteEvidenceAction, createEvidenceAction, cyberMRIAssetAction,
    submitCyberMRIAction, getEvidenceFilessize, selectIncident,
  } = props;

  const [loadingNodata, setLoadingNoData] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteEviToken, setDeleteEviToken] = useState('');
  const [openEvidence, setOpenEvidence] = useState(false);
  const [typeViseData, setTypeViseData] = useState({
    key: 'IP',
    file: [],
    type: 'IP',
    name: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileSizeData, setFileSizeData] = useState('');
  const [noteDes, setNoteDes] = useState('');
  const [onChngeState, setOnChangeState] = useState(false);
  const [onClick, setOnClick] = useState(false);
  const [fileStatus, setFileStatus] = useState([]);
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [sizeTest, setSizeTest] = useState(false);
  const [evidenceData, setEvidenceData] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const [itemDesc, setItemDesc] = useState({});

  // cyberMRI State's
  const [loadingCyberMri, setLoadingCyberMri] = useState(false);
  const [cyberMRIData, setCyberMRIData] = useState({
    assetToken: '',
    // machineName: '',
    fileToken: '',
    keyName: '',
    apiUrl: '',
  });
  const [submittedCyberMRI, setSubmittedCyberMRI] = useState(false);
  const [showCyber, setShowCyber] = useState(false);
  const [cyberAsset, setCyberAsset] = useState([]);

  // previewFile State
  const [previewFile, setPreviewFile] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  // Pagination
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({
    incidentId: IncidentId, page: 0, pageData: 30, searchText: '',
  });

  const GetAllEvidenceRes = useSelector((state) => (state.Evidence.GetAllEvidenceResponse || {}));
  const GetCyberMriAssetRes = useSelector(
    (state) => (state.Evidence.GetCyberMriAssetResponse || {}),
  );
  const DeleteEvidenceRes = useSelector((state) => (state.Evidence.DeleteEvidenceResponse || {}));
  const CreateEvidenceRes = useSelector((state) => (state.Evidence.CreateEvidenceResponse || {}));
  const PreviewFileRes = useSelector((state) => (state.Evidence.PreviewFileResponse || {}));
  const SizeFileRes = useSelector((state) => (state.Evidence.GetFileSizeResponse || {}));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setEvidenceData((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllEvidenceAction({
        incidentId: IncidentId, page: 0, pageData: 30, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  }, [searchText]);

  const onEvidenceDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'evidence') {
      switch (dataRes.operation) {
        case 'delete':
          if (dataRes.status) {
            setEvidenceData((prevState) => prevState.filter((e) => dataRes.data !== e.token));
            setTotalCount((prevState) => prevState - 1);
            getTableDataCall();
          }
          break;
        case 'update':
          if (dataRes.status) {
            let tempIndex = -1;
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setEvidenceData((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              tempIndex = index;
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data;
                const filterData = a.filter(
                  (d) => d.name?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
                );
                return filterData;
              }
              return prevState;
            });
            if (!dataRes.data.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())
              && tempIndex !== -1) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'create':
          if ((dataRes.data && dataRes.data.length > 0)
            && parseInt(dataRes.data[0]?.incidentId) === parseInt(IncidentId)) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            const filterData = dataRes.data.filter((d) => d.name?.toLowerCase().includes(searchTemp?.toLowerCase()) && d.customerID === localStorage.getItem('customerID'));
            setEvidenceData((prevState) => {
              if (filterData.length !== 0) {
                return [...filterData, ...prevState];
              }
              return prevState;
            });
            setTotalCount((pre) => pre + filterData.length);
          }
          break;
        case 'add':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentId) === IncidentId) {
              setEvidenceData((prevState) => {
                if (dataRes.data.customerID === localStorage.getItem('customerID')) {
                  return [dataRes.data, ...prevState];
                }
                return prevState;
              });
              setTotalCount((pre) => pre + (dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0));
            }
          }
          break;
        case 'remove':
          if (dataRes.status) {
            if (parseInt(dataRes.data.incidentId) === IncidentId) {
              setEvidenceData((prevState) => {
                const filteredData = prevState.filter((e) => e.eDataToken !== dataRes.data.token);
                return filteredData;
              });
              setTotalCount((prevState) => prevState - (dataRes.data.customerID === localStorage.getItem('customerID') ? 1 : 0));
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const getCommand = (e, command) => {
    e.preventDefault();
    document.execCommand(command, false, '');
  };

  const setNewData = useCallback((e, type) => {
    if (e.target.value !== ' ') {
      const typeViseData1 = { ...typeViseData };
      setValueEdited(true);
      typeViseData1[type] = e.target.value;
      setTypeViseData(typeViseData1);
    }
  }, [typeViseData]);

  let j = 0;
  const addFile = useCallback((e) => {
    j += 1;
    const typeWiseData = { ...typeViseData };
    const onlyFiles = files;
    const filesDat = filesData;
    const fileS = fileStatus;
    onlyFiles.unshift(e.file);
    filesDat.unshift(e.file);
    fileS.unshift(undefined);
    setFiles([...onlyFiles]);
    setFilesData([...filesDat]);
    setFileStatus([...fileS]);
    if (j === e.fileList.length) {
      setOnClick(true);
      setOnChangeState(true);
      j = 0;
    }
    typeWiseData.file = [...onlyFiles];
    setTypeViseData(typeWiseData);
  }, [typeViseData, files, filesData, fileStatus]);

  const openFileUpload = useCallback((e) => {
    const m = document.getElementById('fileuploadModal');
    m.click();
    setOnClick(true);
    const filesSet = files;
    const typeViseDatas = { ...typeViseData };
    const fileStatusSet = fileStatus;
    filesSet.splice(e, 1);
    fileStatusSet.splice(e, 1);
    setFiles([...filesSet]);
    setFileStatus([...fileStatusSet]);
    typeViseDatas.file.splice(e, 1);
    setTypeViseData(typeViseDatas);
  }, [typeViseData, files, fileStatus]);

  const removeFile = useCallback((index) => {
    const typeViseData1 = { ...typeViseData };
    typeViseData1.file.splice(index, 1);
    setTypeViseData(typeViseData1);
    const dataList = files;
    dataList.splice(index, 1);
    setFiles([...dataList]);
    const fileStatusSet = fileStatus;
    fileStatusSet.splice(index, 1);
    setFileStatus([...fileStatusSet]);
  }, [typeViseData, files, fileStatus]);

  const setData = (e, field, type, key) => {
    const typeViseData1 = { ...typeViseData };
    setValueEdited(true);
    if (type === 'select') {
      setSubmitted(false);
      typeViseData1[field] = e;
      typeViseData1.name = '';
      typeViseData1.file = [];
      setFiles([]);
      setFilesData([]);
      setFileStatus([]);
    } else if (key === 'URL') {
      if (!new RegExp(/(\s)/).test(e.target.value)) {
        typeViseData1[field] = e.target.value;
      }
    } else {
      typeViseData1[field] = e.target.value;
    }
    setTypeViseData(typeViseData1);
  };

  const openCyberMRIAction = useCallback((key) => {
    const cyberMRIData1 = { ...cyberMRIData };
    if (key.type === 'file') {
      cyberMRIData1.keyName = 'fileToken';
      cyberMRIData1.apiUrl = 'submitFileToCyberMri';
    }
    if (key.type === 'hash') {
      cyberMRIData1.keyName = 'hash';
      cyberMRIData1.apiUrl = 'lookupHashToCyberMri';
    }
    if (key.type === 'URL') {
      cyberMRIData1.keyName = 'url';
      cyberMRIData1.apiUrl = 'lookupUrlToCyberMri';
    }
    setCyberMRIData(cyberMRIData1);
    cyberMRIAssetAction();
    setShowCyber(true);
    setSubmittedCyberMRI(false);
  }, [cyberMRIData]);

  const setCyberData = useCallback((e, type) => {
    const cyberMRIData2 = { ...cyberMRIData };
    cyberMRIData2[type] = e;
    setCyberMRIData(cyberMRIData2);
  }, [cyberMRIData]);

  const addCyberMRI = useCallback(() => {
    setSubmittedCyberMRI(true);
    const cyberMRIData3 = { ...cyberMRIData };
    if (cyberMRIData3.assetToken === '') return;
    setLoadingCyberMri(true);
  }, [cyberMRIData]);

  const preview = useCallback((e) => {
    if (e.type === 'note' || e.type === 'URL' || e.type === 'hash' || e.type === 'IP' || e.type === 'domain') {
      setShowPopover(true);
      setItemDesc(e);
    } else if (e.type === 'file') {
      setPreviewFile(true);
      setPreviewLoading(true);
      filePreview({ fileName: e.name, incidentId: e.incidentId, token: e.eDataToken });
      setItemDesc(e);
    }
  }, [itemDesc]);

  const setNoteDescription = useCallback((e) => {
    setValueEdited(true);
    if (e.target.innerHTML === '&nbsp;') {
      document.getElementsByClassName('editArea')[0].innerText = '';
      setNoteDes('');
      e.preventDefault();
    }
    if (e.target.innerText.length <= 650) {
      setNoteDes(e.target.innerText);
    } else {
      e.preventDefault();
    }
  }, [itemDesc]);

  const onKeyDwn = useCallback((e) => {
    const maxLength = 650;
    if (document.getElementsByClassName('editArea')[0]?.innerText.length >= maxLength && e.keyCode !== 8) {
      e.preventDefault();
    }
    if (document.getElementsByClassName('editArea')[0]?.innerText.length >= 649 && e.keyCode === 13) {
      e.preventDefault();
    }
  }, [itemDesc]);

  const onPaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain');
    document.execCommand('insertText', false, text);
    const maxLength = 650;
    const currentTextLength = document.getElementsByClassName('editArea')[0].innerText?.length;
    if ((currentTextLength === maxLength || currentTextLength > maxLength)) {
      document.getElementsByClassName('editArea')[0].innerText = document.getElementsByClassName('editArea')[0].innerText?.substring(0, maxLength);
      setNoteDes(document.getElementsByClassName('editArea')[0].innerText);
    }
    if (document.getElementsByClassName('editArea')[0].innerText?.split('')[0].trim() === '') {
      document.getElementsByClassName('editArea')[0].innerText = '';
      setNoteDes('');
    }
  }, [itemDesc]);

  const submit = useCallback(() => {
    setSubmitted(true);
    const typeViseData2 = { ...typeViseData };
    if (typeViseData2.type === 'note') {
      const x = document.getElementById('noteDesc').innerHTML;
      if (!(x === 'Enter description')) {
        typeViseData2.description = x;
        setTypeViseData(typeViseData2);
      }
      if ((typeViseData2.name && typeViseData2.description)) {
        createEvidenceAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID'), data: typeViseData2 });
      }
    } else if (typeViseData2.type === 'file') {
      if (typeViseData2.file.length > 0) {
        createEvidenceAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID'), data: typeViseData2 });
        setLoading(true);
      }
    } else if (typeViseData2.type === 'IP') {
      if ((new RegExp(RegexList.ip).test(typeViseData2.name))) {
        createEvidenceAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID'), data: typeViseData2 });
        setLoading(true);
      }
    } else if (typeViseData2.type === 'hash') {
      if ((new RegExp(RegexList.hash).test(typeViseData2.name))) {
        createEvidenceAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID'), data: typeViseData2 });
        setLoading(true);
      }
    } else if (typeViseData.type === 'URL') {
      if ((new RegExp(RegexList.url).test(typeViseData.name))) {
        createEvidenceAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID'), data: typeViseData2 });
        setLoading(true);
      }
    } else if (typeViseData2.type === 'domain') {
      if ((new RegExp(RegexList.domain).test(typeViseData2.name))) {
        createEvidenceAction({ incidentId: IncidentId, customerID: localStorage.getItem('customerID'), data: typeViseData2 });
        setLoading(true);
      }
    }
    // else if (!(typeViseData2.name)) {
    //   setLoading(false);
    // } else {
    //   createEvidenceAction(
    //   { incidentId: IncidentId,
    // customerID: localStorage.getItem('customerID'), data: typeViseData2 });
    //   setLoading(true);
    // }
  }, [typeViseData]);

  const handleCloseEvidence = useCallback(() => {
    setLoading(false);
    setNoteDes('');
    setOpenEvidence(false);
    setSubmitted(false);
    setValueEdited(false);
    setFiles([]);
    setTypeViseData({
      key: 'IP',
      file: [],
      type: 'IP',
      name: '',
      description: '',
    });
    setFileStatus([]);
  }, [typeViseData]);

  const closeCyberMRIAction = useCallback(() => {
    setShowCyber(false);
    setSubmittedCyberMRI(false);
    setLoadingCyberMri(false);
    setCyberMRIData({
      assetToken: '',
      // machineName: '',
      fileToken: '',
      keyName: '',
      apiUrl: '',
    });
  }, [cyberMRIData]);
  // previewFile Method

  const closePreview = useCallback(() => {
    setPreviewFile(false);
    setMimeType('');
    setFileUrl('');
    setFileName('');
    setPreviewLoading(false);
  }, [cyberMRIData]);

  const cyberMriFunction = useCallback((Obj) => {
    openCyberMRIAction(Obj);
    setCyberData(Obj.token, 'fileToken');
  }, [cyberMRIData]);

  const deleteEvidence = useCallback((ObjToken) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setDeleteModal(true);
      setDeleteEviToken(ObjToken);
    }
  }, [selectIncident]);

  // columns
  const columns = useMemo(() => (
    getEvidenceColumns(preview, cyberMriFunction, deleteEvidence)
  ), [preview, cyberMriFunction, deleteEvidence]);

  // Next Page Function
  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getAllEvidenceAction({
        incidentId: IncidentId,
        page: errorName.page + 1,
        pageData: 30,
        searchText,
        customerID: localStorage.getItem('customerID'),
      });
    }
  };

  const setSearchTerm = debounce((searchValue) => {
    getAllEvidenceAction({
      incidentId: IncidentId,
      searchText: searchValue,
      page: 0,
      pageData: 30,
      customerID: localStorage.getItem('customerID'),
    });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setEvidenceData([]);
    debounceFunc(() => setSearchTerm(''));
  }, [errorName]);

  useEffect(() => {
    setLoadingNoData(true);
  }, [IncidentId]);

  useEffect(() => {
    if (onChngeState && onClick) {
      setSizeTest(true);
      if (files.length > 0) {
        getEvidenceFilessize(filesData);
      }
      setOnClick(false);
    }
    setOnChangeState(false);
  }, [onChngeState, onClick]);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('incidents', 'evidence').read) {
        getAllEvidenceAction({
          incidentId: IncidentId, page: 0, pageData: 30, searchText: '', customerID: localStorage.getItem('customerID'),
        });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onEvidenceDataRecieved);
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
    if (SizeFileRes.status) {
      const x = [...fileStatus];
      SizeFileRes.data.forEach((e, i) => {
        if (files.length !== 0 && e.fileName === files[i].name) {
          if (e.status) {
            x[i] = true;
          } else {
            setFileSizeData(e.size);
            x[i] = false;
          }
        }
      });
      setSizeTest(false);
      setFileStatus(x);
      setFilesData([]);
      fakeEvidenceAction();
    } else if (SizeFileRes.status === false) {
      fakeEvidenceAction();
    }
  }, [SizeFileRes, files]);

  useEffect(() => {
    if (GetAllEvidenceRes.status) {
      if (GetAllEvidenceRes.data.currentPage !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllEvidenceRes.data.currentPage });
        setEvidenceData([...evidenceData, ...GetAllEvidenceRes.data.totalElement]);
      } else {
        setEvidenceData([...GetAllEvidenceRes.data.totalElement]);
      }
      setLoadingNoData(false);
      setTotalCount(GetAllEvidenceRes.data?.totalCount || 0);
      setTotalPage(GetAllEvidenceRes.data.totalPages);
      fakeEvidenceAction();
    } else if (GetAllEvidenceRes.status === false) {
      setEvidenceData([]);
      setLoadingNoData(false);
      fakeEvidenceAction();
    }
  }, [GetAllEvidenceRes]);

  useEffect(() => {
    if (GetCyberMriAssetRes.status) {
      if (GetCyberMriAssetRes.data) {
        setCyberAsset(GetCyberMriAssetRes.data);
      }
      fakeEvidenceAction();
    } else if (GetCyberMriAssetRes.status === false) {
      setCyberAsset([]);
      fakeEvidenceAction();
    }
  }, [GetCyberMriAssetRes]);

  useEffect(() => {
    if (DeleteEvidenceRes.status) {
      setDeleteLoading(false);
      setDeleteModal(false);
      fakeEvidenceAction();
    } else if (DeleteEvidenceRes.status === false) {
      setDeleteLoading(false);
      setDeleteModal(false);
      fakeEvidenceAction();
    }
  }, [DeleteEvidenceRes]);

  useEffect(() => {
    if (CreateEvidenceRes.status) {
      handleCloseEvidence();
      fakeEvidenceAction();
    } else if (CreateEvidenceRes.status === false) {
      handleCloseEvidence();
      fakeEvidenceAction();
    }
  }, [CreateEvidenceRes]);

  useEffect(() => {
    if (PreviewFileRes.status) {
      if (PreviewFileRes.data.bytes.length > 0) {
        setFileUrl(`data:${PreviewFileRes.data.mimType};base64,${PreviewFileRes.data.bytes}`);
      } else {
        setFileUrl(PreviewFileRes.data.bytes);
      }
      setMimeType(PreviewFileRes.data.mimType);
      setFileName(PreviewFileRes.data.fileName);
      setPreviewLoading(false);
      fakeEvidenceAction();
    } else if (PreviewFileRes.status === false) {
      setFileUrl('');
      setMimeType('');
      setFileName('PreviewFileRes.fileName');
      setPreviewLoading(false);
      fakeEvidenceAction();
    }
  }, [PreviewFileRes]);

  const addEvidanceHandler = () => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setOpenEvidence(true);
    }
  };

  useEffect(() => {
    if (openEvidence) {
      setTimeout(() => {
        if (document.getElementById('iEvidence_value')) {
          document.getElementById('iEvidence_value').focus();
        }
      }, 500);
    }
  }, [openEvidence]);

  if (!PermissionRO('incidents', 'evidence').read) {
    return <NoData id="dont_have_pr_evidence" data-test="dont_have_pr_evidence" message="You don't have permission to access this page" />;
  }

  return (
    <EvidenceWrapper id="ekasha_evidence_wrapper" data-test="ekasha_evidence_wrapper">
      <div className="newBtn">
        <ZsInput
          inputtype="search"
          id="Incident_Evidence_searchBox"
          placeholdertext="Search for Detail"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <ZsButton
          id="evidence_create"
          className="actionAddBtn"
          data-test="evidence_create_btn"
          type="primary"
          onClick={() => (PermissionRO('incidents', 'evidence').write ? addEvidanceHandler() : Toaster({ title: "You don't have permission.", type: 'error' }))}
          style={{ float: 'right', opacity: PermissionRO('incidents', 'evidence').write ? 1 : 0.4 }}
          title="+ Evidence"
        />
      </div>

      {loadingNodata && (
        <div style={{ height: 'calc(100% - 62px)' }}>
          <ZsSpin id="IncidentEvidenceLoading" className="incidentSpinner" />
        </div>
      )}

      {previewFile && (
        <FilePreview
          closePreview={closePreview}
          fileUrl={fileUrl}
          mimeType={mimeType}
          filename={fileName}
          itemDesc={itemDesc}
          download="evidence/downloadEvidence"
          token={itemDesc.eDataToken}
          previewLoading={previewLoading}
        />
      )}

      {!loadingNodata && evidenceData && evidenceData.length !== 0 && (
        <div style={{ height: getTableHeight([], 62) }}>
          <ZsTable
            data-test="evidence_table"
            id="evidenceListTable"
            columns={columns}
            dataSource={evidenceData}
            rowKey="token"
            pagination={false}
            incidentColors
            totalCount={totalCount}
            nextPage={nextPage}
          />
        </div>
      )}
      {!loadingNodata && evidenceData && evidenceData.length === 0 && (
        <NoData
          data-test="evidence_nodata"
          style={{ height: 'calc(100% - 62px)' }}
        />
      )}

      <div className="incidentFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Evidence(s)</span>
      </div>

      {/* delete Modal */}
      <ZsModal
        // visible={deleteModal}
        open={deleteModal}
        modaltype="confirm"
        msg="Are you sure to delete this Evidence ?"
        title="Warning"
        data-test="delete_evidence_modal"
        loading={deleteLoading}
        onOk={() => {
          deleteEvidenceAction(deleteEviToken, IncidentId, localStorage.getItem('customerID'));
          setDeleteLoading(true);
        }}
        onCancel={() => {
          setDeleteModal(false);
        }}
      />

      {/* preview Modal */}
      <ZsModal
        show={showPopover}
        modaltype="simple"
        centered
        id="preview_evidence_modal"
        data-test="preview_evidence_modal"
        onHide={() => setShowPopover(false)}
        title="Evidence Preview"
        className="previewEvidence"
      >
        <EvidancePreviewWrapper>
          <div className="previewBody">
            <div className="previewWrap" style={{ textTransform: 'capitalize' }}>
              <div className="previewLeftPart">Type</div>
              <div className="previewRightPart">{itemDesc.type}</div>
            </div>
            <div className="previewWrap">
              <div className="previewLeftPart">{itemDesc.type !== 'note' ? 'Value' : 'Note Name'}</div>
              <div className="previewRightPart">
                <div className="previewRightPartBody" style={{ width: itemDesc.type === 'URL' ? '412px' : '430px' }}>
                  <div className="previewValue" style={{ width: itemDesc.type === 'URL' ? '403px' : '430px' }}>{itemDesc.name}</div>
                </div>
                <div>
                  {itemDesc.type === 'URL' && (
                    <Icons
                      iconTooltipType="normal"
                      iconTooltipTitle="Copy"
                      id="preview_URL_copy"
                      type="copy2"
                      icontype="globle"
                      onClick={() => {
                        if (itemDesc.name) {
                          const dummy = document.createElement('input');
                          dummy.style.position = 'absolute';
                          document.body.appendChild(dummy);
                          dummy.setAttribute('id', 'dummy_id');
                          document.getElementById('dummy_id').value = JSON.stringify(itemDesc.name).replace(/"/g, '');
                          dummy.select();
                          document.execCommand('copy');
                          document.body.removeChild(dummy);
                          Toaster({ title: `${itemDesc.type} copied`, type: 'success' });
                        }
                      }}
                      className="copyIncidentDetail"
                    />
                  )}
                </div>
              </div>
            </div>
            {itemDesc.type === 'note' ? (
              <div className="previewWrap">
                <div className="previewLeftPart">Note Description</div>
                <div className="previewRightPart">
                  <div className="previewRightPartBody">
                    <div className="previewValue" style={{ width: itemDesc.type === 'note' ? '422px' : '430px' }} dangerouslySetInnerHTML={{ __html: itemDesc.discription }} />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="previewWrap">
              <div className="previewLeftPart">Owner</div>
              <div className="previewRightPart">{itemDesc.ownerName}</div>
            </div>
            <div className="previewWrap">
              <div className="previewLeftPart">Created Date</div>
              <div className="previewRightPart">{convertTimeBaseTimeZoneFunction(itemDesc.createdDate)}</div>
            </div>
          </div>
        </EvidancePreviewWrapper>
      </ZsModal>

      {/* create modal */}
      <ZsModal
        show={openEvidence}
        modaltype="simple"
        centered
        id="create_evidence_modal"
        data-test="create_evidence_modal"
        onHide={handleCloseEvidence}
        title="Add Evidence"
        width={520}
        className="newEvidence"
      >
        <EvidenseModelWrapper>
          <div className="bodyContent">
            <div className="innerBody">
              <div className="spacing">
                <div className="flexSpace">
                  <ZsRadio
                    id="create_ldap_status"
                    data-test="Evidence_radio"
                    style={{
                      width: '50%', position: 'relative', display: 'flex', fontSize: '12px', color: '#fff',
                    }}
                    type="fency"
                    data={[
                      { name: 'IP', value: 'IP' },
                      { name: 'Hash', value: 'hash' },
                      { name: 'URL', value: 'URL' },
                      { name: 'Domain', value: 'domain' },
                      { name: 'Notes', value: 'note' },
                      { name: 'File', value: 'file' },
                    ]}
                    onChange={(e) => setData(e.target.value, 'type', 'select')}
                    defaultV="IP"
                    statusChange
                  />
                  {submitted === true && !typeViseData.key
                    && (
                      <div style={{ fontSize: '12px', color: 'red' }}>
                        {' '}
                        Key is required
                        <sup>*</sup>
                      </div>
                    )}
                </div>
                {typeViseData.type === 'file' ? (
                  <div className="spacing">
                    <div className="dropZone">
                      <FileUpload
                        dragger
                        fixImage={false}
                        defaultImage={false}
                        showUploadList={false}
                        fileList={[]}
                        multiple
                        id="fileuploadModal"
                        type="*"
                        onChange={(e) => { addFile(e); }}
                      >
                        <Icons type="fileUpload" icontype="common" />
                      </FileUpload>
                    </div>
                    {submitted && typeViseData.file.length === 0
                      && (
                        <div className="errorMsg">
                          File required.
                          <sup>*</sup>
                        </div>
                      )}
                    <div style={{ maxHeight: '100px', overflow: 'auto', marginTop: '15px' }}>
                      {typeViseData.file.length !== 0 && typeViseData.file.map((file, index) => (
                        <div
                          className="controlLabel"
                          key={index}
                          style={{ marginTop: '15px' }}
                        >
                          <Icons
                            style={{
                              marginRight: '10px', position: 'relative', top: '2.8px',
                            }}
                            className="fileIcon"
                            id={`iFiles_${index}`}
                            icontype="common"
                            type="file"
                          />
                          {file.name}
                          {`(${file.size / 1000} KB)`}
                          {fileStatus[index] === undefined ? (
                            <Icons
                              style={{
                                marginLeft: '15px', position: 'relative', top: '1.1px',
                              }}
                              className="fileIcon loading"
                              icontype="globle"
                              type="loading"
                            />
                          ) : !fileStatus[index] ? (
                            <span style={{ marginLeft: '10px', color: '#31b16a' }}>
                              Maximum size:
                              {`(${fileSizeData / 1000} KB)`}
                              {' '}
                              <span
                                onClick={() => openFileUpload(index)}
                                id={`iFiles_try${index}`}
                                style={{
                                  marginLeft: '15px', color: '#5179d9', letterSpacing: '0.2px', fontStyle: 'oblique', cursor: 'pointer',
                                }}
                              >
                                Try again
                                {' '}
                              </span>
                              {' '}
                            </span>
                          ) : (
                            <Icons
                              type="close"
                              icontype="globle"
                              id={`iFiles_close${index}`}
                              className="btnIcon"
                              style={{
                                marginLeft: '15px', cursor: 'pointer', position: 'relative', top: '1.5px',
                              }}
                              onClick={() => removeFile(index)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {typeViseData.type === 'IP' || typeViseData.type === 'URL' || typeViseData.type === 'hash' || typeViseData.type === 'domain' ? (
                  <div className="spacing">
                    <ZsInput
                      id="iEvidence_value"
                      inputtype="normal"
                      label="Value"
                      maxLength={typeViseData.type === 'URL' ? 'twoZeroFourEight' : typeViseData.type === 'hash' ? 'oneTwoEight' : 'twoFiftyFive'}
                      value={typeViseData && typeViseData.name ? typeViseData.name : ''}
                      error={
                        submitted === true
                        && !RegexList[typeViseData.type.toLowerCase()].test(typeViseData.name)
                      }
                      errormsg={typeViseData.name === '' ? `${typeViseData.type} is required.` : `Valid ${typeViseData.type} is required.`}
                      onChange={(e) => setData(e, 'name', 'input', typeViseData.type)}
                      placeholdertext="Enter Value"
                    />
                  </div>
                ) : ''}
              </div>
              {typeViseData.type === 'note' ? (
                <div className="iNotes">
                  <div className="iNoteRight">
                    <div className="iRightHeader">
                      <div className="notesName">
                        <ZsInput
                          onChange={(e) => setNewData(e, 'name')}
                          id="notes_newName"
                          maxLength="normal"
                          style={{
                            color: '#fff',
                            border: 'transparent',
                            width: '100%',
                            paddingBottom: '5px',
                            paddingLeft: '10px',
                            height: '25px',
                            background: 'transparent',
                          }}
                          className="noteTitle"
                          value={typeViseData.name || ''}
                          placeholdertext="Enter Note Name"
                          whiteSpace={false}
                          inputtype="normal"
                          error={submitted && !typeViseData.name}
                          errormsg="Note name required."
                        />

                      </div>
                    </div>
                    <div className="iRightBody" id="toolbar">
                      <div className="editControls">
                        <div className="controlGroup">
                          <Icons id="notes_bold" data-test="notes_bold" icontype="common" type="bold" className="eControl" onClick={(e) => getCommand(e, 'bold')} />
                          <Icons id="notes_italic" data-test="incidents_notes_italic" icontype="common" type="italic" className="eControl" onClick={(e) => getCommand(e, 'italic')} />
                          <Icons id="notes_underline" data-test="notes_underline" icontype="common" type="underline" className="eControl" onClick={(e) => getCommand(e, 'underline')} />
                        </div>
                        <div className="controlGroup">
                          <Icons id="notes_justifyLeft" data-test="incidents_notes_justifyLeft" icontype="common" type="leftAlign" className="eControl" onClick={(e) => getCommand(e, 'justifyLeft')} />
                          <Icons id="notes_justifyCenter" data-test="incidents_notes_justifyCenter" icontype="common" type="centerAlign" className="eControl" onClick={(e) => getCommand(e, 'justifyCenter')} />
                          <Icons id="notes_justifyRight" data-test="incidents_notes_justifyRight" icontype="common" type="rightAlign" className="eControl" onClick={(e) => getCommand(e, 'justifyRight')} />
                        </div>
                        <div className="controlGroup" style={{ marginRight: 20 }}>
                          <Icons id="notes_indent" data-test="incidents_notes_indent" type="incIndent" icontype="common" className="eControl" onClick={(e) => getCommand(e, 'indent')} />
                          <Icons id="notes_outdent" data-test="incidents_notes_outdent" type="decIndent" icontype="common" className="eControl" onClick={(e) => getCommand(e, 'outdent')} />
                          <Icons id="notes_insertUnorderedList" data-test="incidents_notes_insertUnorderedList" type="bulletList" icontype="common" className="eControl" onClick={(e) => getCommand(e, 'insertUnorderedList')} />
                        </div>
                        <div className="controlGroup" style={{ marginRight: 0 }}>
                          (
                          {document.getElementsByClassName('editArea')[0]?.innerText !== undefined ? document.getElementsByClassName('editArea')[0]?.innerText.substring(0, 650).length : 0}
                          / 650)
                        </div>
                      </div>
                      <div
                        ref={function (e) { if (e != null) e.contentEditable = true; }}
                        className="editArea"
                        placeholder="Enter Description"
                        id="noteDesc"
                        onInput={(e) => setNoteDescription(e)}
                        onKeyDown={(e) => onKeyDwn(e)}
                        onPaste={(e) => onPaste(e)}
                        onDrop={(e) => onPaste(e)}
                        // dangerouslySetInnerHTML={{ __html: selectedNote.description || '' }}
                        dangerouslySetInnerHTML={{ __html: '' }}
                      />
                      {submitted && !noteDes
                        && (
                          <div className="errorMsg">
                            Note description required.
                            <sup>*</sup>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ) : ''}
            </div>
          </div>
          <div className="footerContent rightBtn">
            <ZsButton
              id="evidence_add"
              title="Add"
              disabled={typeViseData.type === 'file' ? (fileStatus.includes(false) || fileStatus.includes(undefined) || sizeTest) : !valueEdited}
              loading={loading}
              onClick={submit}
            />
          </div>
        </EvidenseModelWrapper>
      </ZsModal>

      {/* CyberMRI modal */}
      <ZsModal
        id="cyberMRI_modal"
        show={showCyber}
        modaltype="simple"
        centered
        title="Cyber MRI"
        onHide={closeCyberMRIAction}
      >
        <div className="bodyContent" id="cyberMRI_bodyContent">
          <div className="innerBody" style={{ height: '200px' }}>
            <div className="spacing">
              <ZsSelect
                selecttype="normal"
                id="cyberMRI_asset"
                label="Select CyberMRI Target"
                data={cyberAsset}
                value={cyberMRIData.assetToken ? cyberMRIData.assetToken : null}
                error={submittedCyberMRI && !cyberMRIData.assetToken ? 'true' : null}
                errormsg="Target CyberMRI required."
                onChange={(e) => { setCyberData(e, 'assetToken'); submitCyberMRIAction(e); }}
              />
            </div>
            {/* {assetMachine && (
            <div className="spacing" style={{ position: 'absolute', zIndex: 0, width: '90%' }}>
              <div className="controlLabel">Select OS Type for Execute this file</div>
              <ZsSelect
                id="cyberMRI_os"
                selecttype="normal"
                label="Select OS Type for Execute this file"
                data={cyberMRIMachine}
                error={submittedCyberMRI && !cyberMRIData.machineName ? 'true' : null}
                errormsg="OS Type Required."
                value={cyberMRIData.machineName ? cyberMRIData.machineName : ''}
                onChange={(e) => setCyberData(e, 'machineName')}
              />
            </div>
            )} */}
          </div>

        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '15px' }}>
          <ZsButton id="cyberMRI_add" loading={loadingCyberMri} onClick={addCyberMRI} title="Submit to CyberMRI" />
        </div>
      </ZsModal>
    </EvidenceWrapper>
  );
});
Evidence.propTypes = {
  IncidentId: PropTypes.number,
  getAllEvidenceAction: PropTypes.func,
  fakeEvidenceAction: PropTypes.func,
  filePreview: PropTypes.func,
  deleteEvidenceAction: PropTypes.func,
  createEvidenceAction: PropTypes.func,
  cyberMRIAssetAction: PropTypes.func,
  submitCyberMRIAction: PropTypes.func,
  getEvidenceFilessize: PropTypes.func,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
  ]),
};

Evidence.defaultProps = {
  IncidentId: -1,
  getAllEvidenceAction: null,
  fakeEvidenceAction: null,
  filePreview: null,
  deleteEvidenceAction: null,
  createEvidenceAction: null,
  cyberMRIAssetAction: null,
  submitCyberMRIAction: null,
  getEvidenceFilessize: null,
  selectIncident: {},
};
export default Evidence;
