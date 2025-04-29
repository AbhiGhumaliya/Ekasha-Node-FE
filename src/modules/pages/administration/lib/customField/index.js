import React, {
  useEffect, useMemo, useState, lazy, Suspense,
  useCallback,
} from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import NoData from '../../../../../components/NoData';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { CustomFieldWrapper } from './style';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../../../components/modal';
import { ZsSpin } from '../../../../../components/Spin';
import { debounceFunc, getTableHeight, retryLazy } from '../../../../../helpers/envData';
import { getCustomFieldColumns } from './CustomFieldTableColumns';
import Icons from '../../../../../components/icons';
import ZsInput from '../../../../../components/forms/input';

let subscribe;

const CreateCustomField = lazy(() => retryLazy(() => import('./lib/createCustomField')));
const PreviewCustomField = lazy(() => retryLazy(() => import('./lib/previewCustomField')));

const CustomField = (props) => {
  const {
    getCustomField, fakeCustomField, deleteCustomField, addCustomField, previewCustomField,
    singleCustomField, updateCustomField, insertCustomAction,
  } = props;

  const [submitted, setSubmitted] = useState(false);
  const [valueEdited, setValueEdited] = useState(true);
  const [addNew, setAddNew] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModelLoading, setEditModelLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [selectRow, setSelectRow] = useState('');
  const [enrichPreview, setEnrichPreview] = useState('');
  const [allFields, setAllFields] = useState([]);
  const [assetsFiles, setAssetsFiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  if (!PermissionRO('administration', 'customField').read) {
    return <NoData data-test="Administration_Custom_Field_No_Permission" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  const GetAllCustomRes = useSelector((state) => (state.CustomField.GetAllCustomResponse || {}));
  const DeleteCustomRes = useSelector((state) => (state.CustomField.DeleteCustomResponse || {}));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setAllFields((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prev) => {
      totalRows = prev; return prev;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getCustomField({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  const openAddField = useCallback((type) => {
    setValueEdited(true);
    setSubmitted(false);
    setAddNew(type);
  }, []);

  const PreviewCustomFields = useCallback((token) => {
    if (enrichPreview === '') {
      setPreviewData({});
      setPreviewModal(true);
      setPreviewLoading(true);
      setEnrichPreview(token);
      previewCustomField(token);
    }
  }, [enrichPreview]);

  const ImportFile = useCallback((fileList) => {
    const file = assetsFiles;
    fileList.forEach((e) => {
      file.push(e.originFileObj);
    });
    setAssetsFiles(file);
    setSubmitLoading(true);
    setLoading(true);
    insertCustomAction(assetsFiles[0]);
  }, [assetsFiles]);

  const setSearchTerm = debounce((searchValue) => {
    getCustomField({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setAllFields([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  // Next Page Function
  const nextPage = useCallback(() => {
    getCustomField({
      page: errorName.page + 1, searchText, pageData: 30,
    });
  }, [errorName, searchText]);

  const onFielddataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'customField') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setSearchText((pre) => {
              if (!(Array.isArray(dataRes.data))) {
                setAllFields((prevState) => {
                  if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                  && dataRes.data?.displayName?.toLowerCase()?.includes(pre?.toLowerCase())) {
                    return [dataRes.data, ...prevState];
                  }
                  return prevState;
                });
                setTotalCount((prev) => prev + (dataRes.data?.hostName?.toLowerCase()
                  ?.includes(pre?.toLowerCase()) ? 1 : 0));
              } else {
                const filteredData = dataRes.data
                  .filter((e) => e.displayName?.toLowerCase()?.includes(pre?.toLowerCase()));
                setAllFields((prevState) => [...filteredData, ...prevState]);
                setTotalCount((prevState) => prevState + filteredData.length);
              }
              return pre;
            });
          }
          break;
        case 'update':
          if (dataRes.status) {
            setSearchText((pre) => {
              setAllFields((prevState) => {
                const index = prevState.findIndex((e) => e.token === dataRes.data.token);
                if (index !== -1) {
                  const a = prevState;
                  a[index] = dataRes.data;
                  const filterData = a.filter(
                    (d) => d.displayName?.toLowerCase()?.includes(pre?.toLowerCase()),
                  );
                  return filterData;
                }
                return prevState;
              });
              if (!dataRes.data.displayName?.toLowerCase()?.includes(pre?.toLowerCase())) {
                setTotalCount((prevS) => prevS - 1);
              }
              return pre;
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setAllFields((prevState) => {
              const filterData = prevState.filter((e) => e.token !== dataRes.data);
              return filterData;
            });
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
      if (PermissionRO('administration', 'customField').read) {
        setLoading(true);
        getCustomField({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onFielddataReceived);
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
    if (GetAllCustomRes.status) {
      if (GetAllCustomRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllCustomRes.data.number });
        setAllFields([...allFields, ...GetAllCustomRes.data.content]);
      } else {
        setAllFields([...GetAllCustomRes.data.content]);
      }
      setLoading(false);
      setLoadings(false);
      setTotalCount(GetAllCustomRes.data.totalElements);
      fakeCustomField();
    } else if (GetAllCustomRes.status === false) {
      setAllFields([]);
      setLoading(false);
      setLoadings(false);
      fakeCustomField();
    }
  }, [GetAllCustomRes]);

  useEffect(() => {
    if (DeleteCustomRes.status) {
      setSelectRow('');
      setDeleteModal(false);
      setSubmitLoading(false);
      fakeCustomField();
    } else if (DeleteCustomRes.status === false) {
      setSelectRow('');
      setDeleteModal(false);
      setSubmitLoading(false);
      fakeCustomField();
    }
  }, [DeleteCustomRes]);

  const columns = useMemo(() => (getCustomFieldColumns(
    openAddField, PreviewCustomFields, setSelectRow, setDeleteModal, setEditModelLoading,
    singleCustomField,
  )), []);

  return (
    <CustomFieldWrapper data-test="Administration_Custom_Field_Wrapper">
      <div className="addAction">
        <ZsInput
          inputtype="search"
          id="Administration_CustomField_searchBox"
          placeholdertext="Search for Field Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <Icons
          id="Administration_Custom_Field_Add_Button"
          icontype="globle"
          type="addNewButtonSmall"
          data-test="Administration_Custom_Field_Add_Button"
          className="addIncidentIcon"
          style={{ float: 'right', cursor: 'pointer', opacity: PermissionRO('administration', 'customField').write ? 1 : 0.4 }}
          onClick={PermissionRO('administration', 'customField').write ? () => openAddField('new') : () => Toaster({ title: "You don't have permission.", type: 'error' })}
        />
      </div>
      {loadings && (
        <div style={{ height: 'calc(100% - 90px)' }}>
          <ZsSpin id="AdminCustomFieldLoading" />
        </div>
      )}
      {allFields.length > 0 && !loadings ? (
        <div style={{ height: getTableHeight([], 90) }}>
          <ZsTable
            data-test="Administration_Custom_Field_Table"
            id="Administration_Custom_Field_Table"
            columns={columns}
            dataSource={allFields}
            rowKey="token"
            pagination={false}
            displayType="block"
            totalCount={totalCount}
            nextPage={nextPage}
          />
        </div>
      ) : !loadings && (
        <NoData
          id="Administration_Custom_Field_NoData"
          style={{ height: 'calc(100% - 90px)' }}
          data-test="Administration_Custom_Field_NoData"
        />
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Custom Field(s)</span>
      </div>
      {deleteModal && (
        <ZsModal
          data-test="Administration_Custom_Field_delete_modal"
          open={deleteModal}
          className="deleteUserModal"
          modaltype="confirm"
          msg="Are you sure to delete this custom Field ?"
          title="Warning"
          type={false}
          loading={submitLoading}
          onOk={() => {
            deleteCustomField(selectRow); setSubmitLoading(true);
          }}
          onCancel={() => {
            setSelectRow(''); setDeleteModal(false); setSubmitLoading(false);
          }}
        />
      )}
      <Suspense fallback={false}>
        <CreateCustomField
          openAddField={openAddField}
          updateCustomField={updateCustomField}
          addCustomField={addCustomField}
          addNew={addNew}
          setAddNew={setAddNew}
          submitted={submitted}
          setEditModelLoading={setEditModelLoading}
          editModelLoading={editModelLoading}
          setSubmitted={setSubmitted}
          loading={loading}
          setLoading={setLoading}
          submitLoading={submitLoading}
          setSubmitLoading={setSubmitLoading}
          fakeCustomField={fakeCustomField}
          setValueEdited={setValueEdited}
          valueEdited={valueEdited}
          ImportFile={ImportFile}
          setAssetsFiles={setAssetsFiles}
        />
      </Suspense>
      {previewModal && (
        <Suspense fallback={false}>
          <PreviewCustomField
            previewModal={previewModal}
            previewLoading={previewLoading}
            setPreviewModal={setPreviewModal}
            previewData={previewData}
            setPreviewData={setPreviewData}
            setPreviewLoading={setPreviewLoading}
            setEnrichPreview={setEnrichPreview}
            fakeCustomField={fakeCustomField}
          />
        </Suspense>
      )}
    </CustomFieldWrapper>
  );
};
CustomField.propTypes = {
  getCustomField: PropTypes.func,
  fakeCustomField: PropTypes.func,
  deleteCustomField: PropTypes.func,
  addCustomField: PropTypes.func,
  previewCustomField: PropTypes.func,
  singleCustomField: PropTypes.func,
  updateCustomField: PropTypes.func,
  insertCustomAction: PropTypes.func,
};

CustomField.defaultProps = {
  getCustomField: null,
  fakeCustomField: null,
  deleteCustomField: null,
  addCustomField: null,
  previewCustomField: null,
  singleCustomField: null,
  updateCustomField: null,
  insertCustomAction: null,
};
export default CustomField;
