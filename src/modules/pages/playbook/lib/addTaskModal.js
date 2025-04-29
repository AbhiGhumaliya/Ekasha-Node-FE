/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { BlockTypes } from './PlaybookWrapper';
import ZsModal from '../../../../components/modal';
import Icons from '../../../../components/icons';
import PlaybookBlock from './Playbook/PlaybookBlock';
import PlaybookActionBlock from './PlaybookAction/playbookActionBlock';
import { EkashaAPIBlock } from './EkashaAPI/EkashaAPIBlock';
import PlaybookDecisions from './Decisions/PlaybookDecisions';
import PlaybookTitle from './Title/PlaybookTitle';

const AddTaskModal = (props) => {
  const {
    closeModal, addTitleInPlayground, fakePlaybookActionAPI,
    getActionsDeviceListAPI, getActionTokenAPI,
    addDecisionInPlayground, addApiInPlayground,
    addPlaybookInPlayground, fakeActionIncidentActionAPI,
    addActionInPlayground, fakeActionAppsAPI, getAllConfiguredActionAPI,
    getActionsListAPI, getListAssetAPI,
    getActionsAPI, getByAppAPI, fetchFieldsForDetailsAPI, fakeActionPanelAPI,
    ekashaAPIGetActionAPI, match, getNewAllPlaybookBlockActionAPI,
    GetApprovalDataActionAPI, setSelectBox, setValueEdited,
    taskDrawerOpen, setTaskDrawerOpen, filedSuggestionList,
    getAllListDataActionAPI, fakeListDataActionAPI,
    GetOwnerActionAPI, fakeIncidentActionAPI,
  } = props;
  const [subDrawer, setSubDrawer] = useState(false);
  const [actionTaskType, setActionTaskType] = useState('');
  const [blockType, setBlockType] = useState('');
  const [playbookType, setPlaybookType] = useState(false);
  const [allConfigureDevice, setAllConfigureDevice] = useState([]);
  const [allAction, setAllAction] = useState([]);
  const [deviceListLoading, setDeviceListLoading] = useState(false);
  const [fieldsModel, setFieldsModel] = useState(false);
  const [backBtnStatus, setBackBtnStatus] = useState(false);
  const [playbookData, setPlaybookData] = useState({
    note: {},
  });
  const [selectPlaybookToken, setSelectPlaybookToken] = useState('');
  const [playbookBlockType, setPlaybookBlockType] = useState('new');
  const [playbookNoteStatus, setPlaybookNoteStatus] = useState(false);
  const [playbookValueEdited, setPlaybookValueEdited] = useState(true);
  const [titleLoading, setTitleLoading] = useState(false);
  const [fieldType, setFieldType] = useState('incident');

  // redux state
  const OpenAllPlaybook = useSelector(
    (state) => (state.PlayBook.OpenAllPlaybook || {}),
  );
  const EditTitleTask = useSelector(
    (state) => (state.PlayBook.EditTitleTask || {}),
  );
  const EditActionTask = useSelector(
    (state) => (state.PlayBook.EditActionTask || {}),
  );
  const EditConditionTask = useSelector(
    (state) => (state.PlayBook.EditConditionTask || {}),
  );
  const EditPlaybookTask = useSelector(
    (state) => (state.PlayBook.EditPlaybookTask || {}),
  );
  const EditApiTask = useSelector(
    (state) => (state.PlayBook.EditApiTask || {}),
  );

  const GetAllConfiguresRes = useSelector(
    (state) => (state.APPS.GetAllConfiguresResponse || {}),
  );
  const GetActionListRes = useSelector(
    (state) => (state.IncdentAction.GetActionListResponse || {}),
  );

  useEffect(() => {
    if (EditPlaybookTask !== undefined && EditPlaybookTask.type === 'EDIT_PLAYBOOK_TASK') {
      setTimeout(() => {
        setPlaybookType(true);
        setActionTaskType('edit');
        setPlaybookBlockType('edit');
        setPlaybookValueEdited(true);
        setPlaybookData(EditPlaybookTask.payload.data);
        setSelectPlaybookToken(EditPlaybookTask.payload.data.scriptarguments.playbook);
        if (EditPlaybookTask.payload.addNotes) {
          setPlaybookNoteStatus(true);
        } else {
          setPlaybookNoteStatus(false);
        }
        fakePlaybookActionAPI();
      }, 150);
    }
  }, [EditPlaybookTask]);

  useEffect(() => {
    if (GetAllConfiguresRes && GetAllConfiguresRes.status) {
      setAllConfigureDevice(GetAllConfiguresRes.data);
      setDeviceListLoading(false);
      fakeActionAppsAPI();
    } else if (GetAllConfiguresRes.status === false) {
      setDeviceListLoading(false);
      fakeActionAppsAPI();
    }
  }, [GetAllConfiguresRes]);

  useEffect(() => {
    if (GetActionListRes && GetActionListRes.status) {
      setAllAction(GetActionListRes.data);
      setDeviceListLoading(false);
      fakeActionIncidentActionAPI();
    } else if (GetActionListRes.status === false) {
      setDeviceListLoading(false);
      fakeActionIncidentActionAPI();
    }
  }, [GetActionListRes]);

  useEffect(() => {
    if (OpenAllPlaybook.type === 'OPEN_TASK_MODAL') {
      setValueEdited(true);
      setTaskDrawerOpen(true);
      setActionTaskType('new');
      setPlaybookBlockType('new');
      if (OpenAllPlaybook.payload !== undefined) {
        setSubDrawer(true);
        setBlockType(OpenAllPlaybook.payload);
      }
    }
  }, [OpenAllPlaybook]);

  const taskDrawerClose = () => {
    setFieldType('incident');
    setPlaybookType(false);
    setTaskDrawerOpen(false);
    setFieldsModel(false);
    setAllConfigureDevice([]);
    setAllAction([]);
    setSubDrawer(false);
    setPlaybookData({
      note: {},
    });
    setPlaybookNoteStatus(false);
    setBlockType('');
    setSelectBox(false);
    setTitleLoading(false);
    closeModal();
  };

  const opnSubDrawer = (type) => {
    if (type === 'action') {
      getAllConfiguredActionAPI();
      getActionsListAPI();
      setDeviceListLoading(true);
    }
    setPlaybookType(false);
    if (type === 'playbook') {
      setSelectPlaybookToken('');
      setPlaybookType(true);
    }
    if (type === 'conditional') {
      setBackBtnStatus(false);
    }
    setSubDrawer(true);
    setBlockType(type);
  };
  function myFunc(obj, prop) {
    return obj.reduce((acc, item) => {
      const key = item[prop];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key] = item;
      return acc;
    }, {});
  }
  const addTaskToGraph = (type, data) => {
    if (type === 'action') {
      addActionInPlayground(data);
    } else if (type === 'api') {
      addApiInPlayground(data);
    } else if (type === 'playbook') {
      addPlaybookInPlayground(data);
    } else if (type === 'conditional') {
      const conData = data;
      const editData = [];
      Object.keys(conData.scriptarguments).forEach((element) => {
        editData.push(conData.scriptarguments[element]);
      });
      const groupedStudent = myFunc(editData, 'condition');
      conData.fieldsData = data.fieldsData;
      conData.valuesData = data.valuesData;
      conData.scriptarguments = groupedStudent;
      addDecisionInPlayground(conData);
    } else if (type === 'title') {
      addTitleInPlayground(data);
    }
    taskDrawerClose();
  };

  return (
    <ZsModal
      modaltype="simple"
      title={(subDrawer === false || playbookType) ? 'Block type' : ' '}
      onHide={() => taskDrawerClose()}
      data-test="create_playbook_modal"
      className="playbookSimpleModal"
      mask={false}
      show={taskDrawerOpen}
      centered
      style={{ width: '515px', marginRight: (fieldsModel || playbookType) ? '285px' : '0' }}
    >
      <div className="bodyContent">
        {(subDrawer === false || playbookType) && (
          <div className="innerBody" style={{ opacity: playbookBlockType === 'edit' ? 0.4 : 1, pointerEvents: playbookBlockType === 'edit' ? 'none' : 'auto' }}>
            <BlockTypes>
              <div className="blockTypeTitle">Execute actions</div>
              <div className="blockCont">
                <div
                  id="AddTaskModal_executeActions"
                  className="blockBody"
                  onClick={() => opnSubDrawer('action')}
                >
                  <Icons type="actionBlock" icontype="globle" className="blockIcn" />
                  <span className="blockName">Action</span>
                </div>
                <div
                  id="AddTaskModal_Actions"
                  className={playbookType ? 'blockBody selected' : 'blockBody'}
                  onClick={() => opnSubDrawer('playbook')}
                >
                  <Icons icontype="globle" type="playbookBlock" className="blockIcn" />
                  <span className="blockName">Playbook</span>
                </div>
                <div
                  id="AddTaskModal_Playbook"
                  className="blockBody"
                  onClick={() => opnSubDrawer('api')}
                >
                  <Icons icontype="globle" type="apiBlock" className="blockIcn" />
                  <span className="blockName">Ekasha API</span>
                </div>
              </div>
            </BlockTypes>
            <BlockTypes>
              <div className="blockTypeTitle">Process filter</div>
              <div className="blockCont">
                <div
                  id="AddTaskModal_processFilter"
                  className="blockBody"
                  onClick={() => opnSubDrawer('conditional')}
                >
                  <Icons icontype="globle" type="decisionBlock" className="blockIcn" />
                  <span className="blockName">Decisions</span>
                </div>
              </div>
            </BlockTypes>
            <BlockTypes>
              <div className="blockTypeTitle">Section title</div>
              <div className="blockCont">
                <div
                  id="AddTaskModal_sectionTitle"
                  className="blockBody"
                  onClick={() => opnSubDrawer('title')}
                >
                  <Icons icontype="globle" type="playbookTitle" className="blockIcn" />
                  <span className="blockName">Title</span>
                </div>
              </div>
            </BlockTypes>
          </div>
        )}

        {subDrawer && !playbookType && (
        <div className="innerBody">
          {blockType === 'action' ? (
            <PlaybookActionBlock
              allConfigureDevice={allConfigureDevice}
              allAction={allAction}
              deviceListLoading={deviceListLoading}
              setBlockType={setBlockType}
              setSubDrawer={setSubDrawer}
              getActionsDeviceListAPI={getActionsDeviceListAPI}
              fakeActionIncidentActionAPI={fakeActionIncidentActionAPI}
              setDeviceListLoading={setDeviceListLoading}
              getActionTokenAPI={getActionTokenAPI}
              getListAssetAPI={getListAssetAPI}
              fakeActionAppsAPI={fakeActionAppsAPI}
              fieldsModel={fieldsModel}
              setFieldsModel={setFieldsModel}
              getActionsAPI={getActionsAPI}
              getByAppAPI={getByAppAPI}
              setAllAction={setAllAction}
              fakeActionPanelAPI={fakeActionPanelAPI}
              fetchFieldsForDetailsAPI={fetchFieldsForDetailsAPI}
              EditActionTask={EditActionTask}
              fakePlaybookActionAPI={fakePlaybookActionAPI}
              addTask={addTaskToGraph}
              actionTaskType={actionTaskType}
              setActionTaskType={setActionTaskType}
              GetApprovalDataActionAPI={GetApprovalDataActionAPI}
              filedSuggestionList={filedSuggestionList}
              setFieldType={setFieldType}
              fieldType={fieldType}
            />
          ) : null}

          {blockType === 'api' ? (
            <EkashaAPIBlock
              setSubDrawer={setSubDrawer}
              ekashaAPIGetActionAPI={ekashaAPIGetActionAPI}
              fakePlaybookActionAPI={fakePlaybookActionAPI}
              getAllListDataActionAPI={getAllListDataActionAPI}
              GetOwnerActionAPI={GetOwnerActionAPI}
              fakeIncidentActionAPI={fakeIncidentActionAPI}
              fakeListDataActionAPI={fakeListDataActionAPI}
              getActionsAPI={getActionsAPI}
              fakeActionIncidentActionAPI={fakeActionIncidentActionAPI}
              fetchFieldsForDetailsAPI={fetchFieldsForDetailsAPI}
              fakeActionPanelAPI={fakeActionPanelAPI}
              fieldsModel={fieldsModel}
              setFieldsModel={setFieldsModel}
              EditApiTask={EditApiTask}
              addTask={addTaskToGraph}
              actionTaskType={actionTaskType}
              setActionTaskType={setActionTaskType}
              filedSuggestionList={filedSuggestionList}
              setFieldType={setFieldType}
              fieldType={fieldType}
            />
          ) : null}

          {blockType === 'conditional' ? (
            <PlaybookDecisions
              setSubDrawer={setSubDrawer}
              fakeActionPanelAPI={fakeActionPanelAPI}
              fetchFieldsForDetailsAPI={fetchFieldsForDetailsAPI}
              fieldsModel={fieldsModel}
              setFieldsModel={setFieldsModel}
              addTask={addTaskToGraph}
              filedSuggestionList={filedSuggestionList}
              setFieldType={setFieldType}
              fieldType={fieldType}
              EditConditionTask={EditConditionTask}
              fakePlaybookActionAPI={fakePlaybookActionAPI}
              setBackBtnStatus={setBackBtnStatus}
              backBtnStatus={backBtnStatus}
            />
          ) : null}

          {blockType === 'title' ? (
            <PlaybookTitle
              addTask={addTaskToGraph}
              EditTitleTask={EditTitleTask}
              actionTaskType={actionTaskType}
              setActionTaskType={setActionTaskType}
              fakePlaybookActionAPI={fakePlaybookActionAPI}
              setSubDrawer={setSubDrawer}
              setTitleLoading={setTitleLoading}
              titleLoading={titleLoading}
              {...props}
            />
          ) : null}
        </div>
        )}

        {playbookType && (
          <div>
            {blockType === 'playbook' ? (
              <PlaybookBlock
                setPlaybookType={setPlaybookType}
                setSubDrawer={setSubDrawer}
                getNewAllPlaybookBlockActionAPI={getNewAllPlaybookBlockActionAPI}
                fakePlaybookActionAPI={fakePlaybookActionAPI}
                addTask={addTaskToGraph}
                taskDrawerClose={taskDrawerClose}
                EditPlaybookTask={EditPlaybookTask}
                playbookData={playbookData}
                setPlaybookData={setPlaybookData}
                setSelectPlaybookToken={setSelectPlaybookToken}
                selectPlaybookToken={selectPlaybookToken}
                playbookBlockType={playbookBlockType}
                playbookNoteStatus={playbookNoteStatus}
                setPlaybookNoteStatus={setPlaybookNoteStatus}
                playbookValueEdited={playbookValueEdited}
                setPlaybookValueEdited={setPlaybookValueEdited}
                match={match}
              />
            ) : null}
          </div>
        )}
      </div>
    </ZsModal>
  );
};
AddTaskModal.propTypes = {
  closeModal: PropTypes.func,
  addTitleInPlayground: PropTypes.func,
  fakePlaybookActionAPI: PropTypes.func,
  addDecisionInPlayground: PropTypes.func,
  addApiInPlayground: PropTypes.func,
  addPlaybookInPlayground: PropTypes.func,
  addActionInPlayground: PropTypes.func,
  fakeActionAppsAPI: PropTypes.func,
  getAllConfiguredActionAPI: PropTypes.func,
  getActionsListAPI: PropTypes.func,
  fakeActionIncidentActionAPI: PropTypes.func,
  getActionsDeviceListAPI: PropTypes.func,
  getActionTokenAPI: PropTypes.func,
  getListAssetAPI: PropTypes.func,
  getActionsAPI: PropTypes.func,
  getByAppAPI: PropTypes.func,
  fetchFieldsForDetailsAPI: PropTypes.func,
  fakeActionPanelAPI: PropTypes.func,
  ekashaAPIGetActionAPI: PropTypes.func,
};

AddTaskModal.defaultProps = {
  closeModal: null,
  addTitleInPlayground: null,
  fakePlaybookActionAPI: null,
  addDecisionInPlayground: null,
  addApiInPlayground: null,
  addPlaybookInPlayground: null,
  addActionInPlayground: null,
  fakeActionAppsAPI: null,
  getAllConfiguredActionAPI: null,
  getActionsListAPI: null,
  fakeActionIncidentActionAPI: null,
  getActionsDeviceListAPI: null,
  getActionTokenAPI: null,
  getListAssetAPI: null,
  getActionsAPI: null,
  getByAppAPI: null,
  fetchFieldsForDetailsAPI: null,
  fakeActionPanelAPI: null,
  ekashaAPIGetActionAPI: null,
};
export default AddTaskModal;
