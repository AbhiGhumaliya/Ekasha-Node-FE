import React, {
  useState, useEffect, lazy, Suspense, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { RuleEngineWrapper } from './lib/RuleEnineWrapper';
import { ekashaPermission, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import Icons from '../../../components/icons';
import NoData from '../../../components/NoData';
import Toaster from '../../../components/toaster';
import ZsTable from '../../../components/table';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import ZsButton from '../../../components/forms/button';
import { ZsSpin } from '../../../components/Spin';
import { debounceFunc, getTableHeight, retryLazy } from '../../../helpers/envData';
import { getRuleEngineTableColumns } from './RuleEngineTableColumns';
import ZsInput from '../../../components/forms/input';

let subscribe;

const RuleEngineModal = lazy(() => retryLazy(() => import('./lib/newRuleModal')));
const DeleteRuleModel = lazy(() => retryLazy(() => import('./lib/deleteRuleModel')));
const UpdateRuleModel = lazy(() => retryLazy(() => import('./lib/updateRuleModel')));

const RuleEngine = React.memo((props) => {
  const {
    getRuleDataAction, fakeActionRuleAction, ruleStatusAction, ruleDeleteAction,
    GetOwnerAction, fakeActionAssets, fakeActionIntegration,
    getAllFieldsAction, fakeIncidentAction, ruleInsertAction, updatePosition,
    ruleOneAction, ruleUpdateAction, getAllIntegrationRule,
  } = props;

  const [loading, setLoading] = useState(true);
  const [ruleModelLoading, setRuleModelLoading] = useState(false);
  const [ruleEngineList, setRuleEngineList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [defaultRuleToken, setDefaultRuleToken] = useState('');

  // modal state
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [rawMove, setRawMove] = useState(false);
  const [modalType, setModalType] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [positionUpdtConform, setPositionUpdtConform] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [totalPage, setTotalPage] = useState([]);
  const [errorName, setErrorName] = useState({ page: 0, pageData: 30, searchText: '' });

  // check user permission read
  if (!PermissionRO('ruleEngine').read) {
    return <NoData data-test="PermissionRO_Rule_Engine_No_Data" message="You don't have permission to access this page" />;
  }

  // redux state
  const GetAllRuleListRes = useSelector(
    (state) => (state.RuleEngines.GetAllRuleListResponse || {}),
  );
  const RuleEngineGetOneRes = useSelector(
    (state) => (state.RuleEngines.RuleEngineGetOneResponse || {}),
  );
  const RuleEngineDeleteRes = useSelector(
    (state) => (state.RuleEngines.RuleEngineDeleteResponse || {}),
  );
  const RuleEngineStatusRes = useSelector(
    (state) => (state.RuleEngines.RuleEngineStatusResponse || {}),
  );
  const RuleEnginePositionUpdtRes = useSelector(
    (state) => (state.RuleEngines.RuleEnginePositionUpdtResponse || {}),
  );

  // Table Delete rows get data when scroll disappear
  const getTableDataCall = useCallback(async () => {
    let rowsLength; let totalRows;
    await Promise.resolve(setRuleEngineList((prevState) => {
      rowsLength = prevState.length;
      return [...prevState];
    }));
    await Promise.resolve(setTotalCount((prevState) => {
      totalRows = prevState; return prevState;
    }));
    if (totalRows > rowsLength && rowsLength < 15) {
      getRuleDataAction({ page: 0, pageData: 30, searchText });
    }
  }, [searchText]);

  // Table rows Select, DeselectAll and SelectAll Funacation
  const onSelect = useCallback((record) => {
    if (rawMove) {
      setPositionList([...positionList]);
    } else {
      setPositionList([...ruleEngineList]);
    }
    if (selectedRowKeys.length === 0 || selectedRowKeys.indexOf(record.token) === -1) {
      setSelectedRows((prevState) => [record, ...prevState]);
      setSelectedRowKeys((prevState) => [record.token, ...prevState]);
    } else {
      setSelectedRows((prevState) => (prevState.filter((e) => e.token !== record.token)));
      setSelectedRowKeys((prevState) => (prevState.filter((token) => token !== record.token)));
    }
  }, [rawMove, positionList, ruleEngineList, selectedRowKeys]);

  const onSelectAll = useCallback((record) => {
    ruleEngineList.forEach((e) => {
      if (record) {
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
  }, [ruleEngineList, selectedRowKeys]);

  const selectDeselectAll = useCallback((type) => {
    ruleEngineList.forEach((e) => {
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
  }, [ruleEngineList, selectedRowKeys]);

  // Table Rows Move and Position Update
  const moveRow = useCallback((value, type) => {
    setRawMove(true);
    const moveData = [...positionList];
    const index = moveData.findIndex((e) => e.token === value.token);
    if (type === 'down' && index !== -1 && index < moveData.length - 1) {
      const el = moveData[index];
      moveData[index] = moveData[index + 1];
      moveData[index + 1] = el;
    } else if (type === 'up' && index > 0) {
      const el = moveData[index];
      moveData[index] = moveData[index - 1];
      moveData[index - 1] = el;
    }
    setPositionList([...moveData]);
  }, [positionList]);

  const moveReset = useCallback(() => {
    setPositionList([...ruleEngineList]);
    setRawMove(false);
    selectDeselectAll('deselectAll');
  }, [ruleEngineList, selectedRowKeys]);

  const updatePosi = useCallback(() => {
    const pData = [];
    setSubmitLoading(true);
    positionList.forEach((d, i) => {
      const a = { token: d.token, position: i + 1 };
      pData.push(a);
    });
    updatePosition(pData);
  }, [positionList]);

  // Table Search Func
  const setSearchTerm = debounce((searchValue) => {
    getRuleDataAction({ pageData: 30, page: 0, searchText: searchValue });
  }, 300);

  const searchChange = useCallback((val) => {
    setSearchText(val);
    setErrorName({ ...errorName, page: 0 });
    debounceFunc(() => setSearchTerm(val));
  }, [errorName]);

  const rptSearchClear = useCallback(() => {
    setSearchText('');
    setPositionList([]);
    setRuleEngineList([]);
    debounceFunc(() => setSearchTerm(''));
  }, []);

  // Delete Model Func
  const deleteModalFun = useCallback((objToken) => {
    setDeleteModal(true);
    setSelectedRowKeys([objToken]);
  }, []);

  // Create Model Func
  const createModalFun = useCallback((type, token) => {
    if (PermissionRO('ruleEngine').write) {
      if (type === 'new') {
        setCreateModal(true);
        setModalType('new');
        GetOwnerAction();
        getAllIntegrationRule(localStorage.getItem('customerID'));
        setSelectedRowKeys([]);
        setSelectedRows([]);
      } else {
        setModalType(type);
        ruleOneAction(token);
        setCreateModal(true);
        setRuleModelLoading(true);
      }
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, []);

  // Next Page Load Func
  const nextPage = () => {
    if (errorName.page < totalPage - 1) {
      getRuleDataAction({
        page: errorName.page + 1, searchText, pageData: 30,
      });
    }
  };

  // socket res get
  const onRuledataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incidentRule') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setRuleEngineList((prevState) => {
              if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
              && dataRes.data?.ruleName?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
            setTotalCount((pre) => pre
            + (dataRes.data?.ruleName?.toLowerCase()?.includes(searchTemp?.toLowerCase()) ? 1 : 0));
          }
          break;
        case 'updatePosition':
          if (dataRes.status) {
            setRuleEngineList(() => [...dataRes.data]);
          }
          break;
        case 'update':
          if (dataRes.status) {
            let searchTemp = '';
            setSearchText((pre) => { searchTemp = pre; return pre; });
            setRuleEngineList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.token);
              const a = prevState;
              if (index !== -1) {
                a[index] = dataRes.data;
                const filterData = a.filter(
                  (d) => d.ruleName?.toLowerCase()?.includes(searchTemp?.toLowerCase()),
                );
                return filterData;
              }
              return prevState;
            });
            if (!dataRes.data.ruleName?.toLowerCase()?.includes(searchTemp?.toLowerCase())) {
              setTotalCount((prevS) => prevS - 1);
            }
          }
          break;
        case 'updateStatus':
          if (dataRes.status) {
            setRuleEngineList((prevState) => {
              const a = prevState;
              const i = prevState.findIndex((e) => e.token === dataRes.data.ruleToken);
              if (i !== -1) {
                a[i].status = dataRes.data.ruleStatus;
                return [...a];
              }
              return prevState;
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setRuleEngineList(
              (prevState) => prevState.filter((e) => !dataRes.data.includes(e.token)),
            );
            setTotalCount((prevState) => prevState - dataRes.data.length);
            getTableDataCall();
            setSelectedRowKeys(
              (prevState) => prevState.filter((d) => !dataRes.data.includes(d)),
            );
            setSelectedRows(
              (prevState) => prevState.filter((d) => !dataRes.data.includes(d.token)),
            );
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('ruleEngine').read) {
        getRuleDataAction({ pageData: 30, page: 0, searchText: '' });
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
        subscribe = stompClient.subscribe('/topic/broadcast', onRuledataReceived);
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
    if (GetAllRuleListRes.status) {
      if (GetAllRuleListRes.data.number !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllRuleListRes.data.number });
        setRuleEngineList([...ruleEngineList, ...GetAllRuleListRes.data.content]);
      } else {
        setRuleEngineList([...GetAllRuleListRes.data.content]);
      }
      setLoading(false);
      const filterData = GetAllRuleListRes.data.content.filter((d) => d.isDefault === true);
      setDefaultRuleToken(filterData[0]?.token);
      setTotalCount(GetAllRuleListRes.data.totalElements);
      setTotalPage(GetAllRuleListRes.data.totalPages);
      fakeActionAssets();
    } else if (GetAllRuleListRes.status === false) {
      setRuleEngineList([]);
      setDefaultRuleToken('');
      setLoading(false);
      fakeActionAssets();
    }
  }, [GetAllRuleListRes]);

  useEffect(() => {
    if (RuleEnginePositionUpdtRes.status) {
      setRuleEngineList(RuleEnginePositionUpdtRes.data);
      setSubmitLoading(false);
      setPositionUpdtConform(false);
      setRawMove(false);
      selectDeselectAll('deselectAll');
      fakeActionRuleAction();
    } else if (RuleEnginePositionUpdtRes.status === false) {
      setRuleEngineList([]);
      setSubmitLoading(false);
      fakeActionRuleAction();
    }
  }, [RuleEnginePositionUpdtRes]);

  useEffect(() => {
    if (RuleEngineStatusRes.status) {
      fakeActionRuleAction();
    } else if (RuleEngineStatusRes.status === false) {
      fakeActionRuleAction();
    }
  }, [RuleEngineStatusRes]);

  useEffect(() => {
    if (RuleEngineDeleteRes.status) {
      setSubmitLoading(false);
      fakeActionRuleAction();
    } else if (RuleEngineDeleteRes.status === false) {
      setSubmitLoading(false);
      fakeActionRuleAction();
    }
  }, [RuleEngineDeleteRes]);

  useEffect(() => {
    if (RuleEngineGetOneRes.status) {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      // fakeActionRuleAction();
    } else if (RuleEngineGetOneRes.status === false) {
      setModalType('new');
      setCreateModal(false);
      setRuleModelLoading(false);
      fakeActionRuleAction();
    }
  }, [RuleEngineGetOneRes]);

  // row select
  const rowSelection = {
    selectedRowKeys,
    onSelect,
    onSelectAll,
  };

  // table columns
  const columns = useMemo(() => (getRuleEngineTableColumns(
    selectedRowKeys, rawMove ? positionList : ruleEngineList, onSelect, onSelectAll,
    ruleStatusAction, createModalFun, deleteModalFun,
  )), [selectedRowKeys, positionList, ruleEngineList]);

  return (
    <RuleEngineWrapper data-test="RuleEngine_Wrapper">
      {loading && <ZsSpin id="RuleTableLoading" />}
      <div className="headerRule">
        <div className="addAction" style={{ display: 'flex' }}>
          {rawMove ? (
            <>
              <div style={{ marginRight: '10px' }}>
                <ZsButton
                  id="rule_position_reset_BTN"
                  className="cancelPosition"
                  title="Reset"
                  onClick={() => moveReset()}
                />
              </div>
              <div>
                <ZsButton id="rule_position_update_BTN" className="savePosition" title="Save" loading={loading} onClick={() => setPositionUpdtConform(true)} />
              </div>
            </>
          ) : (
            <>
              <ZsInput
                inputtype="search"
                id="rule_engine_searchBox"
                placeholdertext="Search for Rule Name"
                value={searchText || ''}
                style={{ marginTop: '-4px' }}
                onChange={(e) => searchChange(e.target.value)}
                searchclear={rptSearchClear}
              />
              <Icons
                id="Rule_Engine_Add_Button_Icon"
                data-test="Rule_Engine_Add_Button_Icon"
                icontype="globle"
                type="addNewButtonSmall"
                style={{ opacity: PermissionRO('ruleEngine').write ? 1 : 0.4, cursor: 'pointer', marginTop: '-1px' }}
                onClick={() => createModalFun('new')}
              />
            </>
          )}
        </div>
      </div>
      {!loading && ruleEngineList.length === 0 && (
        <NoData
          id="Rule_Engine_No_Data_in_Table"
          data-test="Rule_Engine_No_Data_in_Table"
          style={{ height: getTableHeight([], 97) }}
        />
      )}
      {!loading && ruleEngineList.length !== 0 && (
        <div style={{ height: getTableHeight([], 97) }}>
          <ZsTable
            data-test="ekasha_rule_engine_table"
            id="ekasha_rule_engine_table"
            rule={selectedRows.length > 0}
            rowSelection={rowSelection}
            dataSource={rawMove ? positionList : ruleEngineList}
            columns={columns}
            rowKey="token"
            pagination={false}
            displayType="block"
            changeColors
            totalCount={totalCount}
            nextPage={nextPage}
            selectedRows={selectedRowKeys}
          />
        </div>
      )}
      <div className="bottomOptions">
        {selectedRows.length === 1 && totalCount > 1 && (
          <>
            <div
              style={{
                display: 'flex', marginRight: '10px', borderRadius: '4px', background: '#141516', padding: '0px 10px',
              }}
              id="rull_rowDown"
              data-test="rull_rowDown"
              className="btmOption"
              onClick={!PermissionRO('ruleEngine').write
                ? () => Toaster({ title: "You don't have permission.", type: 'error' }) : () => moveRow(selectedRows[0], 'down')}
            >
              <Icons icontype="common" style={{ marginTop: '3px' }} type="downArrowNormal" />
            </div>
            <div
              style={{
                display: 'flex', marginRight: '35px', borderRadius: '4px', background: '#141516', padding: '0px 10px',
              }}
              id="rule_rowUp"
              data-test="rule_rowUp"
              className="btmOption"
              onClick={!PermissionRO('ruleEngine').write
                ? () => Toaster({ title: "You don't have permission.", type: 'error' }) : () => moveRow(selectedRows[0], 'up')}
            >
              <Icons icontype="common" style={{ marginTop: '3px' }} type="upArrowNormal" />
            </div>
          </>
        )}
        {ruleEngineList.length > 0 && selectedRows.length > 0
          && selectedRows.length !== ruleEngineList.length && (
            <div
              id="ruleEngine_selectAllBtn"
              data-test="ruleEngine_selectAllBtn"
              className="btmOption"
              onClick={() => selectDeselectAll('selectAll')}
            >
              <Icons style={{ top: '3px', position: 'relative' }} icontype="common" type="selectAll" className="btmIcon" />
              Select All
            </div>
        )}
        {ruleEngineList.length > 0 && selectedRows.length > 0 && (
          <>
            <div
              id="ruleEngine_deselectAllBtn"
              data-test="ruleEngine_deselectAllBtn"
              className="btmOption"
              onClick={() => selectDeselectAll('deselectAll')}
            >
              <Icons icontype="common" style={{ top: '3px', position: 'relative' }} type="selectAll" className="btmIcon" />
              Deselect All
            </div>
            <div
              id="ruleEngine_deleteAllBtn"
              data-test="ruleEngine_deleteAllBtn"
              className="btmOption"
              onClick={(PermissionRO('ruleEngine').delete)
                ? selectedRowKeys.includes(defaultRuleToken) ? () => Toaster({ title: 'Deselect the default rule.', type: 'error' }) : () => setDeleteModal(true)
                : () => Toaster({ title: "You don't have permission.", type: 'error' })}
            >
              <Icons
                style={{ marginRight: '10px', position: 'relative', top: '4px' }}
                type="delete"
                icontype="globle"
                className="btmIcon"
              />
              Delete
            </div>
          </>
        )}
        <div className="totalCounts">
          <span className="counts">{totalCount}</span>
          <span className="moduleName">Rule(s)</span>
        </div>
      </div>

      {deleteModal && (
        <Suspense fallback={null}>
          <DeleteRuleModel
            deleteModal={deleteModal}
            submitLoading={submitLoading}
            setDeleteModal={setDeleteModal}
            ruleDeleteAction={ruleDeleteAction}
            setSelectedRowKeys={setSelectedRowKeys}
            selectedRowKeys={selectedRowKeys}
            setSelectedRows={setSelectedRows}
            setSubmitLoading={setSubmitLoading}
          />
        </Suspense>
      )}
      {positionUpdtConform && (
        <Suspense fallback={null}>
          <UpdateRuleModel
            positionUpdtConform={positionUpdtConform}
            submitLoading={submitLoading}
            updatePosi={updatePosi}
            setSelectedRowKeys={setSelectedRowKeys}
            setSelectedRows={setSelectedRows}
            setPositionUpdtConform={setPositionUpdtConform}
            setSubmitLoading={setSubmitLoading}
          />
        </Suspense>

      )}
      {createModal && (
        <Suspense fallback={false}>
          <RuleEngineModal
            show={createModal}
            closeBtn={setCreateModal}
            getAllFieldsAction={getAllFieldsAction}
            GetOwnerAction={GetOwnerAction}
            getAllIntegrationRule={getAllIntegrationRule}
            loading={submitLoading}
            ruleModelLoading={ruleModelLoading}
            setRuleModelLoading={setRuleModelLoading}
            type={modalType}
            fakeActionOwnerAction={fakeActionAssets}
            fakeIncidentAction={fakeIncidentAction}
            ruleUpdateAction={ruleUpdateAction}
            ruleInsertAction={ruleInsertAction}
            fakeActionIntegration={fakeActionIntegration}
            fakeActionRuleAction={fakeActionRuleAction}
            ruleEngineList={ruleEngineList}
          />
        </Suspense>
      )}
    </RuleEngineWrapper>
  );
});
RuleEngine.propTypes = {
  getAllIntegrationRule: PropTypes.func,
  getRuleDataAction: PropTypes.func,
  fakeActionRuleAction: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  ruleStatusAction: PropTypes.func,
  ruleDeleteAction: PropTypes.func,
  GetOwnerAction: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  fakeActionIntegration: PropTypes.func,
  getAllFieldsAction: PropTypes.func,
  ruleInsertAction: PropTypes.func,
  updatePosition: PropTypes.func,
  ruleOneAction: PropTypes.func,
  ruleUpdateAction: PropTypes.func,
};

RuleEngine.defaultProps = {
  getAllIntegrationRule: null,
  getRuleDataAction: null,
  fakeActionRuleAction: null,
  fakeActionAssets: null,
  ruleUpdateAction: null,
  ruleStatusAction: null,
  ruleDeleteAction: null,
  GetOwnerAction: null,
  fakeIncidentAction: null,
  fakeActionIntegration: null,
  getAllFieldsAction: null,
  ruleInsertAction: null,
  updatePosition: null,
  ruleOneAction: null,
};
export default RuleEngine;
