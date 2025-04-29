import React, {
  useEffect, useState, useMemo, useCallback,
  lazy,
  Suspense,
} from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsInput from '../../../../../components/forms/input';
import Icons from '../../../../../components/icons';
import ZsModal from '../../../../../components/modal';
import NoData from '../../../../../components/NoData';
import ZsTable from '../../../../../components/table';
import Toaster from '../../../../../components/toaster';
import { stompClient } from '../../../../../helpers/lib/SocketHandlers';
import { ekashaPermission, PermissionRO } from '../../../../../helpers/lib/StorageHandlers';
import { TemplateWrapper } from './style';
import {
  debounceFunc, getTableHeight, retryLazy, scrollToError,
} from '../../../../../helpers/envData';
import { ZsSpin } from '../../../../../components/Spin';
import { getTemplateColumns } from './templateTableColumns';

let subscribe;

const CreateTemplate = lazy(() => retryLazy(() => import('./lib/createTemplate')));

const Template = React.memo((props) => {
  const {
    getAllTemplateDataAction, createTemplateAction, fakeActionTemplate, deleteTemplateAction,
    getOneTemplateAction, updateTemplateAction, cloneTemplateAction, fetchFieldsForDetails,
    fakeActionPanel,
  } = props;

  // page read check
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState(false);
  const [cloneModal, setCloneModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [valueEdited, setValueEdited] = useState(true);
  const [modalType, setModalType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newConformModal, setNewConformModal] = useState(false);
  const [defaults, setDefaults] = useState(false);
  const [templateModelLoading, setTemplateModelLoading] = useState(false);
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [id, setId] = useState('');
  const [templateList, setTemplateList] = useState([]);
  const [displayField, setDisplayField] = useState([]);

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  const [templateData, setTemplateData] = useState(
    [
      {
        category: '',
        categoryData: [
          {
            field: '',
            value: '',
          },
        ],
      },
    ],
  );
  const [errorStatus, setErrorStatus] = useState(
    [
      {
        categoryError: false,
        errorData: [
          {
            fieldError: false,
            valueError: false,
          },
        ],
      },
    ],
  );

  const GetAllTemplateRes = useSelector((state) => (state.Template.GetAllTemplateResponse || {}));
  const AddTemplateRes = useSelector((state) => (state.Template.AddTemplateResponse || {}));
  const CloneTemplateRes = useSelector((state) => (state.Template.CloneTemplateResponse || {}));
  const UpdateTemplateRes = useSelector((state) => (state.Template.UpdateTemplateResponse || {}));
  const DeleteTemplateRes = useSelector((state) => (state.Template.DeleteTemplateResponse || {}));
  const FatchFieldsDetailsRes = useSelector((state) => (
    state.Panel.FatchFieldsDetailsResponse || {}
  ));

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setTemplateList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState;
      return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getAllTemplateDataAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  const closeHandler = useCallback(() => {
    const obj = [
      {
        category: '',
        categoryData: [
          {
            field: '',
            value: '',
          },
        ],
      },
    ];
    const errorObj = [
      {
        categoryError: false,
        errorData: [
          {
            fieldError: false,
            valueError: false,
          },
        ],
      },
    ];
    setModalType('');
    setName('');
    setModalVisible(false);
    setValueEdited(true);
    setSubmitted(false);
    setSubmitLoading(false);
    setTemplateModelLoading(false);
    setTemplateData(obj);
    setErrorStatus(errorObj);
  }, []);

  const createNewTemplateModal = (type) => {
    setDefaults(false);
    setModalVisible(true);
    setModalType(type);
  };

  const editTemplateListHandler = (i) => {
    setTemplateModelLoading(true);
    getOneTemplateAction(i);
    setId(i);
    setModalType('edit');
    setModalVisible(true);
  };

  const cloneTemplateListHandler = (i, tempName) => {
    setId(i);
    setName(tempName);
    setCloneModal(true);
    setModalType('clone');
  };

  const deleteTemplateHandler = (i) => {
    setDeleteTemplate(true);
    setId(i);
  };

  const setSearchTerm = debounce((searchValue) => {
    getAllTemplateDataAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = (val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  };

  const rptSearchClear = () => {
    setSearchText('');
    setTemplateList([]);
    debounceFunc(() => setSearchTerm(''));
  };

  const submitTemplate = () => {
    setSubmitted(true);
    scrollToError();
    let check = false;
    templateData.forEach((element, i) => {
      element.categoryData.forEach((element2, j) => {
        if (element.category === '' || element2.field === '') {
          if (element.category === '') {
            errorStatus[i].categoryError = true;
          }
          if (element2.field === '') {
            errorStatus[i].errorData[j].fieldError = true;
          }
          check = true;
        } else {
          errorStatus[i].categoryError = false;
          errorStatus[i].errorData[j].fieldError = false;
        }
        setErrorStatus([...errorStatus]);
      });
    });
    if (name === '') {
      return;
    }
    if (check) {
      return;
    }
    setSubmitLoading(true);
    const dd = {};
    dd.name = name;
    dd.templateData = templateData;
    if (modalType === 'new') {
      createTemplateAction(dd);
    } else if (modalType === 'edit') {
      dd.token = id;
      updateTemplateAction(dd);
    }
  };

  const onTemplatedataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'template') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setTemplateList((prevState) => {
              if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
              && dataRes.data?.name?.toLowerCase().includes(searchTemp?.toLowerCase())) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
            setTotalCount((pre) => pre
            + (dataRes.data?.name?.toLowerCase().includes(searchTemp?.toLowerCase()) ? 1 : 0));
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setTemplateList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
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
            if (!dataRes.data.name?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setTemplateList((prevState) => prevState.filter((e) => e.token !== dataRes.data));
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
  const nextPage = () => {
    getAllTemplateDataAction({ ...errorName, page: errorName.page + 1 });
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('administration', 'template').read) {
        getAllTemplateDataAction({ pageData: 30, page: 0, searchText: '' });
        fetchFieldsForDetails('incident');
        setLoading(true);
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
        subscribe = stompClient.subscribe('/topic/broadcast', onTemplatedataReceived);
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
    if (FatchFieldsDetailsRes && FatchFieldsDetailsRes.status === true) {
      if (FatchFieldsDetailsRes.data) {
        setDisplayField(FatchFieldsDetailsRes.data);
        fakeActionPanel();
      }
    } else if (FatchFieldsDetailsRes.status === false) {
      fakeActionPanel();
    }
  }, [FatchFieldsDetailsRes]);

  useEffect(() => {
    if (GetAllTemplateRes.status) {
      if (GetAllTemplateRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllTemplateRes.data.number });
        setTemplateList([...templateList, ...GetAllTemplateRes.data.content]);
      } else {
        setTemplateList([...GetAllTemplateRes.data.content]);
      }
      setLoading(false);
      setTotalCount(GetAllTemplateRes.data.totalElements);
      fakeActionTemplate();
    } else if (GetAllTemplateRes.status === false) {
      setTemplateList([]);
      setLoading(false);
      fakeActionTemplate();
    }
  }, [GetAllTemplateRes]);

  useEffect(() => {
    if (AddTemplateRes.status) {
      closeHandler();
      fakeActionTemplate();
    } else if (AddTemplateRes.status === false) {
      setSubmitLoading(false);
      fakeActionTemplate();
    }
  }, [AddTemplateRes]);

  useEffect(() => {
    if (CloneTemplateRes.status) {
      setName('');
      setNewName('');
      setCloneModal(false);
      setNewConformModal(false);
      setSubmitLoading(false);
      setId('');
      fakeActionTemplate();
    } else if (CloneTemplateRes.status === false) {
      setSubmitLoading(false);
      if (CloneTemplateRes.code === 409) {
        setNewConformModal(true);
      }
      fakeActionTemplate();
    }
  }, [CloneTemplateRes]);

  useEffect(() => {
    if (UpdateTemplateRes.status) {
      closeHandler();
      fakeActionTemplate();
    } else if (UpdateTemplateRes.status === false) {
      setSubmitLoading(false);
      fakeActionTemplate();
    }
  }, [UpdateTemplateRes]);

  useEffect(() => {
    if (DeleteTemplateRes.status) {
      setId('');
      setSubmitLoading(false);
      setDeleteTemplate(false);
      fakeActionTemplate();
    } else if (DeleteTemplateRes.status === false) {
      setSubmitLoading(false);
      fakeActionTemplate();
    }
  }, [DeleteTemplateRes]);

  useEffect(() => {
    if (newConformModal) {
      setTimeout(() => {
        if (document.getElementById('Admin_Template_Conform_Modal_Template_Name')) {
          document.getElementById('Admin_Template_Conform_Modal_Template_Name').focus();
        }
      }, 500);
    }
  }, [newConformModal]);

  const openConformModel = (sts, msg, act, cls, typ) => (
    <>
      <ZsModal
        visible={sts}
        modaltype="confirm"
        msg={msg}
        title="Warning"
        type={typ !== 'delete'}
        id="Admin_Template_Conform_Modal"
        className="BackupConfirm"
        loading={submitLoading}
        onOk={() => {
          if (newConformModal && newName === '') {
            setSubmitted(true);
            return;
          }
          act();
          setSubmitLoading(true);
        }}
        onCancel={() => {
          cls();
          setNewConformModal(false);
          setSubmitLoading(false);
          setId('');
          setName('');
          setSubmitted(false);
          setNewName('');
        }}
      >
        {newConformModal && (
          <>
            <div style={{ display: 'flex', marginTop: '9px' }}>
              <div
                className="icon"
                style={{
                  cursor: 'pointer', width: '10px', height: '10px',
                }}
              >
                <Icons
                  icontype="common"
                  type="csv"
                />
              </div>
              <div style={{
                marginLeft: '9px', color: '#4c8cec', fontWeight: 'bold', fontSize: '12px', marginTop: '2px',
              }}
              >
                {name}
              </div>
            </div>
            <ZsInput
              inputtype="normal"
              label="Template Name"
              requiredentry
              id="Admin_Template_Conform_Modal_Template_Name"
              placeholdertext="Enter template name"
              maxLength="normal"
              width="60%"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setValueEdited(false); }}
              error={submitted && newName === ''}
              errormsg="Template name required."
            />
          </>
        )}
      </ZsModal>
    </>
  );

  // colunms of table
  const columns = useMemo(() => (
    getTemplateColumns(editTemplateListHandler, cloneTemplateListHandler, deleteTemplateHandler)
  ), []);

  if (!PermissionRO('administration', 'template').read) {
    return <NoData id="Admin_Template_No_Permission" style={{ position: 'absolute' }} message="You don't have permission to access this page" />;
  }

  return (
    <TemplateWrapper id="Administration_Template_Module_Wrapper">
      <div className="addAction">
        <ZsInput
          inputtype="search"
          id="Admin_Template_Search_Box"
          placeholdertext="Search for Template Name"
          value={searchText || ''}
          onChange={(e) => searchChange(e.target.value)}
          searchclear={rptSearchClear}
        />
        <Icons
          icontype="globle"
          type="addNewButtonSmall"
          id="Admin_Template_Add_Button"
          onClick={
          PermissionRO('administration', 'template').write
            ? () => createNewTemplateModal('new')
            : () => Toaster({ title: "You don't have permission.", type: 'error' })
          }
          style={{ cursor: PermissionRO('administration', 'template').write ? 'pointer' : 'default', opacity: PermissionRO('administration', 'template').write ? 1 : 0.4 }}
        />
      </div>
      {loading && (
        <div style={{ height: 'calc(100% - 90px)' }}>
          <ZsSpin id="AdminTemplateLoading" />
        </div>
      )}
      {!loading && templateList.length === 0 && (
        <NoData
          id="Admin_Template_No_Data"
          style={{ height: 'calc(100% - 90px)' }}
        />
      )}
      {!loading && templateList.length !== 0 && (
        <>
          <div style={{ height: getTableHeight([], 90) }}>
            <ZsTable
              id="Admin_Template_Table"
              columns={columns}
              dataSource={templateList}
              rowKey="token"
              pagination={false}
              displayType="block"
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        </>
      )}
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Template(s)</span>
      </div>
      {deleteTemplate
        && openConformModel(deleteTemplate, 'Are you sure to delete this template?', () => deleteTemplateAction(id), () => setDeleteTemplate(false), 'delete')}
      {cloneModal
        && openConformModel(cloneModal, 'Are you sure to clone this template?', () => cloneTemplateAction(newConformModal ? newName : `copy_${name}`, id), () => setCloneModal(false), 'clone')}
      {modalVisible && (
        <Suspense fallback={false}>
          <CreateTemplate
            modalType={modalType}
            templateModelLoading={templateModelLoading}
            setModalType={setModalType}
            templateData={templateData}
            setTemplateData={setTemplateData}
            submitTemplate={submitTemplate}
            setName={setName}
            setErrorStatus={setErrorStatus}
            errorStatus={errorStatus}
            name={name}
            submitLoading={submitLoading}
            closeHandler={closeHandler}
            submitted={submitted}
            valueEdited={valueEdited}
            displayField={displayField}
            setValueEdited={setValueEdited}
            modalVisible={modalVisible}
            defaults={defaults}
            setTemplateModelLoading={setTemplateModelLoading}
            setModalVisible={setModalVisible}
            fakeActionTemplate={fakeActionTemplate}
            setDefaults={setDefaults}
          />
        </Suspense>
      )}
    </TemplateWrapper>
  );
});

Template.propTypes = {
  getAllTemplateDataAction: PropTypes.func,
  createTemplateAction: PropTypes.func,
  fakeActionTemplate: PropTypes.func,
  deleteTemplateAction: PropTypes.func,
  getOneTemplateAction: PropTypes.func,
  updateTemplateAction: PropTypes.func,
  cloneTemplateAction: PropTypes.func,
  fetchFieldsForDetails: PropTypes.func,
  fakeActionPanel: PropTypes.func,
};

Template.defaultProps = {
  getAllTemplateDataAction: null,
  createTemplateAction: null,
  fakeActionTemplate: null,
  deleteTemplateAction: null,
  getOneTemplateAction: null,
  updateTemplateAction: null,
  cloneTemplateAction: null,
  fetchFieldsForDetails: null,
  fakeActionPanel: null,
};
export default Template;
