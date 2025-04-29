import React, {
  useState, useEffect, useMemo, lazy, Suspense, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import ZsTable from '../../../../../../components/table';
import NoData from '../../../../../../components/NoData';
import ZsModal from '../../../../../../components/modal';
import { ekashaPermission, PermissionRO } from '../../../../../../helpers/lib/StorageHandlers';
import { ReferencesWrapper } from './style';
import ZsButton from '../../../../../../components/forms/button';
import Toaster from '../../../../../../components/toaster';
import FilePreview from './lib/previewFile';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { ZsSpin } from '../../../../../../components/Spin';
import { getIncidentReferancesColumns } from './IncidentReferancesTableColumns';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../../helpers/envData';
import ZsInput from '../../../../../../components/forms/input';

let subscribe;

const AddFilesModal = lazy(() => retryLazy(() => import('./lib/addFile')));

const References = React.memo((props) => {
  const {
    getFilesData, fakeFilesAction, MarkAsEvidenceAction, fakeEvidenceAction,
    deleteFilesAction, IncidentId, filePreview, selectIncident,
  } = props;

  const [referencesList, setReferencesList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [mimeType, setMimeType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [deleteToken, setDeleteToken] = useState('');

  const [itemDesc, setItemDesc] = useState({});
  const [deleteFile, setDeleteFile] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [preViewFileOpen, setPreViewFileOpen] = useState(false);
  const [addFilesModal, setAddFilesModal] = useState(false);
  // Pagination

  const [totalPage, setTotalPage] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({
    incidentId: IncidentId, page: 0, pageData: 30, searchText: '',
  });

  const GetAllFilesRes = useSelector((state) => (state.References.GetAllFilesResponse || {}));
  const DeleteFileRes = useSelector((state) => (state.References.DeleteFileResponse || {}));
  const AddFileRes = useSelector((state) => (state.References.AddFileResponse || {}));
  const MarkAsEvidenceRes = useSelector((state) => (state.Evidence.MarkAsEvidenceResponse || {}));
  const PreviewFileRes = useSelector((state) => (state.Evidence.PreviewFileResponse || {}));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setReferencesList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getFilesData({
        incidentId: IncidentId, page: 0, pageData: 30, searchText, customerID: localStorage.getItem('customerID'),
      });
    }
  }, [searchText]);

  const onFilesdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'file') {
      switch (dataRes.operation) {
        case 'upload':
          if (dataRes.status && dataRes.data.length > 0
            && parseInt(dataRes.data[0].incidentId) === IncidentId) {
            // upload
            let searchTemp;
            setSearchText((pre) => { searchTemp = pre; return pre; });
            const filterdData = dataRes.data.filter((e) => e.fileName?.toLowerCase()?.includes(searchTemp?.toLowerCase()) && e.customerID === localStorage.getItem('customerID'));
            setReferencesList((prevState) => [...filterdData, ...prevState]);
            setTotalCount((prevState) => prevState + filterdData.length);
          }
          break;
        case 'deleteFile':
          if (dataRes.status) {
            // delete
            setReferencesList((prevState) => prevState.filter((e) => !dataRes.data.token.includes(e.token) && dataRes.data.customerID === localStorage.getItem('customerID')));
            setTotalCount((prevState) => prevState - (dataRes.data.customerID === localStorage.getItem('customerID') ? dataRes.data.token.length : 0));
            getTableDataCall();
          }
          break;
        case 'updateFileStatus':
          if (dataRes.status) {
            setReferencesList((prevState) => {
              const a = prevState;
              const updateIndex = a.findIndex((e) => e.token === dataRes.data.token);
              if (updateIndex !== -1) {
                a[updateIndex].evidence = dataRes.data.evidence;
                return [...a];
              }
              return [...a];
            });
          }
          break;
        default:
          break;
      }
    }
  };

  const addFileModal = useCallback(() => {
    setAddFilesModal(true);
  }, []);

  const preview = useCallback((e) => {
    filePreview({
      fileName: e.fileName,
      incidentId: IncidentId,
      token: e.token,
    });
    setItemDesc(e);
    setPreViewFileOpen(true);
    setPreviewLoading(true);
  }, [setItemDesc]);

  const closePreview = useCallback(() => {
    setPreViewFileOpen(false);
  }, [setPreViewFileOpen]);

  const deleteFiles = useCallback(() => {
    let preToken = '';
    setDeleteToken((prevState) => {
      preToken = prevState;
      return prevState;
    });
    deleteFilesAction(preToken, IncidentId, localStorage.getItem('customerID'));
    setSubmitLoading(true);
  }, [IncidentId]);

  const markAsEvidanceHandler = (object) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      MarkAsEvidenceAction({
        incidentId: IncidentId, type: 'file', typeViseData: object, eDataToken: object.token, customerID: localStorage.getItem('customerID'),
      });
    }
  };

  const deletFileClickFunction = useCallback((token) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      setDeleteFile(true);
      setDeleteToken(token);
    }
  }, [selectIncident]);

  // columns
  const columns = useMemo(() => (
    getIncidentReferancesColumns(
      downloadFileAction, preview, IncidentId, markAsEvidanceHandler, deletFileClickFunction,
    )
  ), [IncidentId]);

  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getFilesData({
        incidentId: IncidentId,
        page: errorName.page + 1,
        pageData: 30,
        searchText,
        customerID: localStorage.getItem('customerID'),
      });
    }
  };

  const setSearchTerm = debounce((searchValue) => {
    getFilesData({
      incidentId: IncidentId,
      searchText:
      searchValue,
      page: 0,
      pageData: 30,
      customerID: localStorage.getItem('customerID'),
    });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [setSearchTerm]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setReferencesList([]);
    debounceFunc(() => setSearchTerm(''));
  }, [setSearchTerm]);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('incidents', 'references').read) {
        getFilesData({
          incidentId: IncidentId, page: 0, pageData: 30, searchText: '', customerID: localStorage.getItem('customerID'),
        });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onFilesdataReceived);
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
      setListLoading(true);
    }
  }, [IncidentId]);

  useEffect(() => {
    if (MarkAsEvidenceRes.status || MarkAsEvidenceRes.status === false) {
      fakeEvidenceAction();
    }
  }, [MarkAsEvidenceRes]);

  useEffect(() => {
    if (GetAllFilesRes.status) {
      if (GetAllFilesRes.data && GetAllFilesRes.data.content) {
        if (GetAllFilesRes.data.number !== errorName.page) {
          setErrorName({ ...errorName, page: GetAllFilesRes.data.number });
          setReferencesList([...referencesList, ...GetAllFilesRes.data.content]);
        } else {
          setReferencesList([...GetAllFilesRes.data.content]);
        }
      } else {
        setReferencesList([]);
      }
      setListLoading(false);
      setTotalCount(GetAllFilesRes.data.totalElements);
      setTotalPage(GetAllFilesRes.data.totalPages);
      fakeFilesAction();
    } else if (GetAllFilesRes.status === false) {
      setReferencesList([]);
      setListLoading(false);
      fakeFilesAction();
    }
  }, [GetAllFilesRes]);

  useEffect(() => {
    if (DeleteFileRes.status) {
      setSubmitLoading(false);
      setDeleteToken('');
      // setSelectedRowKeys([]);
      setDeleteFile(false);
      fakeFilesAction();
    } else if (DeleteFileRes.status === false) {
      setSubmitLoading(false);
      setDeleteToken('');
      // setSelectedRowKeys([]);
      setDeleteFile(false);
      fakeFilesAction();
    }
  }, [DeleteFileRes]);

  useEffect(() => {
    if (AddFileRes.status) {
      setAddFilesModal(false);
      setSubmitLoading(false);
      fakeFilesAction();
    } else if (AddFileRes.status === false) {
      setSubmitLoading(false);
      fakeFilesAction();
    }
  }, [AddFileRes]);

  useEffect(() => {
    if (PreviewFileRes.status) {
      if (PreviewFileRes.data.bytes.length > 0) {
        setFileUrl(`data:${PreviewFileRes.data.mimType};base64,${PreviewFileRes.data.bytes}`);
      } else {
        setFileUrl(PreviewFileRes.data.bytes);
      }
      const data = { ...itemDesc };
      data.fileSize = PreviewFileRes.data.fileSize;
      setItemDesc(data);
      setMimeType(PreviewFileRes.data.mimType);
      setFilename(PreviewFileRes.data.fileName);
      setPreviewLoading(false);
      fakeEvidenceAction();
    } else if (PreviewFileRes.status === false) {
      setFileUrl('');
      setMimeType('');
      setFilename('PreviewFileRes.fileName');
      setPreviewLoading(false);
      fakeEvidenceAction();
    }
  }, [PreviewFileRes]);

  if (!PermissionRO('incidents', 'references').read) {
    return <NoData id="PermissionRO_Incident_Files" data-test="PermissionRO_Incident_Files" message="You don't have permission to access this page" />;
  }

  return (
    <ReferencesWrapper id="References_Wrapper" data-test="References_Wrapper">
      <div className="newBtn">
        <ZsInput
          inputtype="search"
          id="Incident_Reference_searchBox"
          placeholdertext="Search for File Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <ZsButton
          id="file_add_modal_button"
          className="actionAddBtn"
          data-test="incident_files_Add"
          style={{ opacity: PermissionRO('incidents', 'references').write ? 1 : 0.4 }}
          type="primary"
          title="+ Upload"
          onClick={() => (PermissionRO('incidents', 'references').write
            ? selectIncident.status === 'Closed'
              ? Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' })
              : addFileModal()
            : Toaster({ title: "You don't have permission.", type: 'error' }))}
        />
      </div>
      {preViewFileOpen && (
        <FilePreview
          closePreview={() => closePreview()}
          fileUrl={fileUrl}
          data-test="perView_Modal_Ref"
          mimeType={mimeType}
          itemDesc={itemDesc}
          filename={filename}
          download="file/downloadFile"
          token={itemDesc.token}
          previewLoading={previewLoading}
        />
      )}
      {listLoading && (
        <div style={{ height: 'calc(100% - 62px)' }}>
          <ZsSpin id="IncidentReferencesLoading" className="incidentSpinner" />
        </div>
      )}
      {!listLoading && referencesList && referencesList.length !== 0 && (
        <div style={{ height: getTableHeight([], 62) }}>
          <ZsTable
            data-test="File_List_Table"
            id="fileListTable"
            columns={columns}
            dataSource={referencesList}
            rowKey="token"
            pagination={false}
            incidentColors
            totalCount={totalCount}
            nextPage={nextPage}
            // rowSelection={rowSelection}
            // rule={selectedRowKeys.length > 0}
            // selectedRows={selectedRowKeys}
          />
        </div>
      )}
      {!listLoading && referencesList && referencesList.length === 0 && <NoData style={{ height: 'calc(100% - 62px)' }} />}
      <div className="bottomOptions">
        <div className="totalCounts">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">Referance(s)</span>
        </div>
      </div>
      <ZsModal
        open={deleteFile}
        className="deleteFileModal"
        modaltype="confirm"
        msg="Are you sure to delete this file (s) ?"
        title="Warning"
        type={false}
        data-test="delete_file_Modal"
        loading={submitLoading}
        onOk={() => {
          deleteFiles();
        }}
        onCancel={() => { setSubmitLoading(false); setDeleteFile(false); setDeleteToken(''); }}
      />
      {addFilesModal && (
        <Suspense fallback={false}>
          <AddFilesModal
            show={addFilesModal}
            submitLoading={submitLoading}
            setSubmitLoading={setSubmitLoading}
            close={setAddFilesModal}
            {...props}
          />
        </Suspense>
      )}
    </ReferencesWrapper>
  );
});

References.propTypes = {
  getFilesData: PropTypes.func,
  fakeFilesAction: PropTypes.func,
  MarkAsEvidenceAction: PropTypes.func,
  fakeEvidenceAction: PropTypes.func,
  downloadFileAction: PropTypes.func,
  deleteFilesAction: PropTypes.func,
  filePreview: PropTypes.func,
  IncidentId: PropTypes.number,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

References.defaultProps = {
  getFilesData: null,
  fakeFilesAction: null,
  MarkAsEvidenceAction: null,
  fakeEvidenceAction: null,
  downloadFileAction: null,
  deleteFilesAction: null,
  filePreview: null,
  IncidentId: -1,
  selectIncident: {},
};
export default References;
