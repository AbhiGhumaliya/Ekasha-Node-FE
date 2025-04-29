import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ZsButton from '../../../../../../components/forms/button';
import ZsInput from '../../../../../../components/forms/input';
import Icons from '../../../../../../components/icons';
import ZsTabs from '../../../../../../components/tabs';
import { NewWorkbookWrapper } from '../style';
import Toaster from '../../../../../../components/toaster';
import { scrollToError } from '../../../../../../helpers/envData';
import { ZsSpin } from '../../../../../../components/Spin';
import ZsList from '../../../../../../components/list/ZsList';
import { setNewWorkbookDataStoreData } from '../../../../../../helpers/lib/StorageHandlers';
import ZsTooltip from '../../../../../../components/tooltip';
import NoData from '../../../../../../components/NoData';

const NewWorkbook = React.memo((props) => {
  const {
    closeWorkbook, singleWorkbook, updateWorkbookAction, setWorkbookModelLoading,
    addWorkbookAction, fakeActionWorkbook, getNewAllPlaybookBlockAction,
    ekashaAPIGetAction, fakePlaybookAction, newWorkbookData, setNewWorkbookData,
    workbookModelLoading, getWorkbookListOfAction, setSingleWorkbook, openNewWorkbook,
    setFetchLoading, setOpenNewWorkbook, setOpenNewWorkbookStatus,
  } = props;

  const [actions, setActions] = useState([]);
  const [configureAction, setConfigureAction] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [actionId, setActionId] = useState('');
  const [selectedActions, setSelectedActions] = useState([]);
  const [actionModal, setActionModal] = useState(false);
  const [playbookId, setPlaybookId] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [playbookModal, setPlaybookModal] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [selectedPlaybooks, setSelectedPlaybooks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [playbookLoading, setPlaybookLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('Actions');

  const { workbookData, workbookName } = newWorkbookData;

  const AddWorkbookRes = useSelector((state) => (
    state.Workbook.AddWorkbookResponse ? state.Workbook.AddWorkbookResponse : {}
  ));

  const UpdateWorkbookRes = useSelector((state) => (
    state.Workbook.UpdateWorkbookResponse ? state.Workbook.UpdateWorkbookResponse : {}
  ));

  const GetSingleWorkbookRes = useSelector((state) => (
    state.Workbook.GetSingleWorkbookResponse ? state.Workbook.GetSingleWorkbookResponse : {}
  ));

  const GetAllEkashaAPIRes = useSelector(
    (state) => (state.PlayBook.GetAllEkashaAPIResponse || {}),
  );

  const GetNewAllPlaybookBlockRes = useSelector(
    (state) => (state.PlayBook.GetNewAllPlaybookBlockResponse || {}),
  );

  const GetWorkbookActionListResponse = useSelector((state) => (
    state.Workbook.GetWorkbookActionListResponse || {}));

  // method's use to create workbook

  const changeActiveTab = (e) => {
    setActiveDetailTab(e);
  };

  const addNewPhase = useCallback(() => {
    setSubmitted(false);
    const newWorkbookData1 = { ...newWorkbookData };
    newWorkbookData1.workbookData.push({
      name: '',
      description: '',
      collapseStatus: false,
      tasks: [
        {
          name: '',
          description: '',
          owner: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
          actions: [],
          playbooks: [],
          actionList: [],
        },
      ],
    });
    setNewWorkbookData(newWorkbookData1);
    setNewWorkbookDataStoreData(newWorkbookData1);
    // Add scroll behavior after state updates
    setTimeout(() => {
      const phases = document.querySelectorAll('.phaseDiv');
      if (phases.length > 0) {
        const lastPhase = phases[phases.length - 1];
        lastPhase?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }, [newWorkbookData]);

  const removePhase = useCallback((index) => {
    setSubmitted(false);
    const newWorkbookData2 = { ...newWorkbookData };
    newWorkbookData2.workbookData.splice(index, 1);
    setNewWorkbookData(newWorkbookData2);
    setValueEdited(true);
  }, [newWorkbookData]);

  const addNewTask = useCallback((index) => {
    const newWorkbookData3 = { ...newWorkbookData };
    newWorkbookData3.workbookData[index].tasks.push({
      name: '',
      description: '',
      owner: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
      actions: [],
      playbooks: [],
      actionList: [],
    });
    setNewWorkbookData(newWorkbookData3);
    setTimeout(() => {
      const newTaskElement = document.getElementById(`Admin_Workbook_Add_Task_Btn_${index}_${newWorkbookData3.workbookData[index].tasks.length - 1}`);
      if (newTaskElement) {
        newTaskElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }, [newWorkbookData]);

  const removeTask = useCallback((phaseIndex, taskIndex) => {
    const newWorkbookData4 = { ...newWorkbookData };
    newWorkbookData4.workbookData[phaseIndex].tasks.splice(taskIndex, 1);
    setNewWorkbookData(newWorkbookData4);
    setNewWorkbookDataStoreData(newWorkbookData4);
    setValueEdited(true);
  }, [newWorkbookData]);

  const openActionPlaybook = useCallback((id, type, closeType) => {
    if (type === 'action') {
      if (closeType !== 'close') {
        getWorkbookListOfAction();
        ekashaAPIGetAction();
      }
      setActionId(id);
      // setActions([]);
      // setConfigureAction([]);
      setActionModal(!actionModal);
      setPlaybookModal(false);
      setSelectedActions([]);
    } else {
      if (closeType !== 'close') {
        getNewAllPlaybookBlockAction();
      }
      setPlaybookId(id);
      setPlaybookModal(!playbookModal);
      setActionModal(false);
      setSelectedPlaybooks([]);
    }
  }, [newWorkbookData, actionModal, playbookModal]);

  const testTT = useCallback((pID, tID, typ) => {
    const workbookActionList = workbookData[pID].tasks[tID].actionList;
    const workbookActionList2 = workbookData[pID].tasks[tID].playbooks;
    setSelectedActions(workbookActionList);
    if (typ === 'clr') {
      setSelectedActions([]);
    }
    setSelectedPlaybooks(workbookActionList2);
    if (typ === 'clr') {
      setSelectedPlaybooks([]);
    }
  }, [workbookData]);

  const addActionsPlaybooksToArray = useCallback((a, type, category) => {
    setValueEdited(true);
    if (category === 'actions') {
      const selectedActions1 = [...selectedActions];
      if (type === 'api') {
        if (selectedActions1.findIndex((e) => e.token === a.token && e.type === type) === -1) {
          selectedActions1.push({ ...a, type, dataToken: '' });
          setSelectedActions(selectedActions1);
        } else {
          selectedActions1.splice(selectedActions1.findIndex(
            (e) => e.token === a.token && e.type === type,
          ), 1);
          setSelectedActions(selectedActions1);
        }
      } else if (selectedActions1.findIndex((e) => e.name === a && e.type === type) === -1) {
        selectedActions1.push({ name: a, type, dataToken: '' });
        setSelectedActions(selectedActions1);
      } else {
        selectedActions1.splice(selectedActions1.findIndex(
          (e) => e.name === a && e.type === type,
        ), 1);
        setSelectedActions(selectedActions1);
      }
    } else {
      const selectedPlaybooks2 = [...selectedPlaybooks];
      if (selectedPlaybooks2.findIndex((e) => e.token === a.id && e.type === type) === -1) {
        selectedPlaybooks2.push({
          name: a.name, token: a.id, type, dataToken: '',
        });
        setSelectedPlaybooks(selectedPlaybooks2);
      } else {
        selectedPlaybooks2.splice(selectedPlaybooks2.findIndex(
          (e) => e.token === a.id && e.type === type,
        ), 1);
        setSelectedPlaybooks(selectedPlaybooks2);
      }
    }
  }, [selectedActions, selectedPlaybooks]);

  const addSelectedActionsPlaybooksInData = useCallback((pIndex, tIndex, category) => {
    setValueEdited(true);
    const newWorkbookData2 = { ...newWorkbookData };

    if (category === 'actions') {
      const updatedActionList = newWorkbookData2.workbookData[pIndex].tasks[tIndex].actionList
        .filter((action) => selectedActions.find((selectedAction) => {
          if (selectedAction.type === 'api') {
            return action.token === selectedAction.token;
          }
          return action.name === selectedAction.name;
        }));
      const removedActionList = selectedActions.filter((selectedAction) => !newWorkbookData2
        .workbookData[pIndex].tasks[tIndex].actionList.find((action) => {
          if (selectedAction.type === 'api') {
            return action.token === selectedAction.token;
          }
          return action.name === selectedAction.name;
        }));

      newWorkbookData2.workbookData[pIndex].tasks[tIndex].actionList = updatedActionList
        .concat(removedActionList);
      setActionId('');
      setActionModal('');
    } else {
      const updatedPlaybooksList = newWorkbookData2.workbookData[pIndex].tasks[tIndex].playbooks
        .filter((playbook) => selectedPlaybooks.find(
          (selectedPlaybook) => playbook.token === selectedPlaybook.token,
        ));
      const removedPlaybooksList = selectedPlaybooks.filter((selectedPlaybook) => !newWorkbookData2
        .workbookData[pIndex].tasks[tIndex].playbooks.find(
          (playbook) => playbook.token === selectedPlaybook.token,
        ));

      newWorkbookData2.workbookData[pIndex].tasks[tIndex].playbooks = updatedPlaybooksList
        .concat(removedPlaybooksList);
      setPlaybookId('');
      setPlaybookModal('');
    }

    setNewWorkbookData(newWorkbookData2);
    setNewWorkbookDataStoreData(newWorkbookData2);
  }, [newWorkbookData, selectedActions, selectedPlaybooks]);

  const removeActionsFromArray = useCallback((pIndex, tIndex, aIndex, category) => {
    setValueEdited(true);
    if (category === 'actions') {
      const newWorkbookData3 = { ...newWorkbookData };
      newWorkbookData3.workbookData[pIndex].tasks[tIndex].actionList.splice(aIndex, 1);
      setNewWorkbookData(newWorkbookData3);
      setNewWorkbookDataStoreData(newWorkbookData3);
    } else {
      const newWorkbookData1 = { ...newWorkbookData };
      newWorkbookData1.workbookData[pIndex].tasks[tIndex].playbooks.splice(aIndex, 1);
      setNewWorkbookData(newWorkbookData1);
      setNewWorkbookDataStoreData(newWorkbookData1);
    }
  }, [newWorkbookData, valueEdited]);

  const setWorkbookData = useCallback((e, field, pIndex, phase, tIndex) => {
    setValueEdited(true);
    const newWorkbookData2 = { ...newWorkbookData };
    if (e !== ' ') {
      if (tIndex >= 0) {
        newWorkbookData2.workbookData[pIndex].tasks[tIndex][field] = e;
      } else if (phase) {
        newWorkbookData2.workbookData[pIndex][field] = e;
      } else {
        newWorkbookData2[field] = e;
      }
      setNewWorkbookData(newWorkbookData2);
      setNewWorkbookDataStoreData(newWorkbookData2);
    }
  }, [newWorkbookData, valueEdited]);

  const phaseCollapseHandler = useCallback((index) => {
    const newWorkbookDataSet = { ...newWorkbookData };
    newWorkbookDataSet.workbookData[index].collapseStatus = !newWorkbookDataSet
      .workbookData[index].collapseStatus;
    setNewWorkbookData(newWorkbookDataSet);
    setNewWorkbookDataStoreData(newWorkbookDataSet);
    setIsVisible(!isVisible);
  }, [newWorkbookData]);

  const saveData = useCallback(() => {
    const newWorkbookData1 = { ...newWorkbookData };
    setSubmitted(true);
    scrollToError();
    if (!newWorkbookData1.workbookName) {
      return;
    }
    let stopSubmit = false;

    newWorkbookData1.workbookData.forEach((element) => {
      const { name, description, tasks } = element;
      if (!name) {
        stopSubmit = true;
        element.collapseStatus = true;
        return;
      }
      if (!description) {
        stopSubmit = true;
        element.collapseStatus = true;
        return;
      }
      tasks.forEach((elements) => {
        if (!elements.name) {
          stopSubmit = true;
          element.collapseStatus = true;
          return;
        }
        if (!elements.description) {
          stopSubmit = true;
          element.collapseStatus = true;
        }
      });
      setNewWorkbookData(newWorkbookData1);
      setNewWorkbookDataStoreData(newWorkbookData1);
    });

    if (stopSubmit) {
      return;
    }

    setSubmitLoading(true);
    if (openNewWorkbook === 'new') {
      workbookData[0].tasks[0].owner = JSON.parse(localStorage.getItem('U_PROFILE')).fullname;
      addWorkbookAction(newWorkbookData1);
    } else {
      updateWorkbookAction(newWorkbookData1);
    }
  }, [newWorkbookData, openNewWorkbook]);

  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById('Admin_Workbook_Name_Input')) {
        document.getElementById('Admin_Workbook_Name_Input').focus();
      }
    }, 500);
  }, []);

  const getEvent = useCallback((e) => {
    if (actionModal && actionId) {
      if (document.getElementById(actionId)) {
        if (!document.getElementById(actionId).contains(e.target)) {
          setActionModal(false);
          setSelectedActions([]);
          setActionId('');
        }
      }
    }
    if (playbookModal && playbookId) {
      if (document.getElementById(playbookId)) {
        if (!document.getElementById(playbookId).contains(e.target)) {
          setPlaybookModal(false);
          setSelectedPlaybooks([]);
          setPlaybookId('');
        }
      }
    }
  }, [actionModal, playbookModal, actionId, playbookId]);

  useEffect(() => {
    window.addEventListener('mousedown', getEvent);
    return () => window.removeEventListener('mousedown', getEvent);
  }, [actionModal, playbookModal]);

  // addWorkbook response handler

  useEffect(() => {
    if (GetWorkbookActionListResponse.status) {
      setConfigureAction(GetWorkbookActionListResponse.data);
      setApiLoading(false);
      fakeActionWorkbook();
    } else if (GetWorkbookActionListResponse.status === false) {
      setConfigureAction([]);
      setApiLoading(false);
      Toaster({ title: GetWorkbookActionListResponse.message, type: 'error' });
      fakeActionWorkbook();
    }
  }, [GetWorkbookActionListResponse]);

  useEffect(() => {
    if (AddWorkbookRes.status && AddWorkbookRes.status === true) {
      setSubmitLoading(false);
      setNewWorkbookData([]);
      setNewWorkbookDataStoreData([]);
      closeWorkbook();
      fakeActionWorkbook();
    } else if (AddWorkbookRes.status === false) {
      setSubmitLoading(false);
      fakeActionWorkbook();
    }
  }, [AddWorkbookRes]);

  useEffect(() => {
    if (UpdateWorkbookRes.status && UpdateWorkbookRes.status === true) {
      setSubmitLoading(false);
      setNewWorkbookData([]);
      setNewWorkbookDataStoreData([]);
      closeWorkbook();
      fakeActionWorkbook();
    } else if (UpdateWorkbookRes.status === false) {
      setSubmitLoading(false);
      fakeActionWorkbook();
    }
  }, [UpdateWorkbookRes]);

  useEffect(() => {
    if (GetAllEkashaAPIRes.status && GetAllEkashaAPIRes.status === true) {
      setActions(GetAllEkashaAPIRes.data);
      setActionLoading(false);
      fakePlaybookAction();
    } else if (GetAllEkashaAPIRes.status === false) {
      setActions([]);
      setActionLoading(false);
      fakePlaybookAction();
    }
  }, [GetAllEkashaAPIRes]);

  useEffect(() => {
    if (GetNewAllPlaybookBlockRes.status && GetNewAllPlaybookBlockRes.status === true) {
      setPlaybooks(GetNewAllPlaybookBlockRes.data);
      setPlaybookLoading(false);
      fakePlaybookAction();
    } else if (GetNewAllPlaybookBlockRes.status === false) {
      setPlaybooks([]);
      setPlaybookLoading(false);
      fakePlaybookAction();
    }
  }, [GetNewAllPlaybookBlockRes]);

  useEffect(() => {
    if (GetSingleWorkbookRes.status && GetSingleWorkbookRes.status === true) {
      const datas = {};
      datas.token = GetSingleWorkbookRes.data.token;
      datas.workbookName = GetSingleWorkbookRes.data.workbookName;
      datas.status = GetSingleWorkbookRes.data.status;
      datas.workbookData = JSON.parse(GetSingleWorkbookRes.data.workbookdata);
      setSingleWorkbook(datas);
      setWorkbookModelLoading(false);
      fakeActionWorkbook();
    } else if (GetSingleWorkbookRes.status === false) {
      setFetchLoading(false);
      setWorkbookModelLoading(false);
      setOpenNewWorkbook('');
      setOpenNewWorkbookStatus('');
      fakeActionWorkbook();
    }
  }, [GetSingleWorkbookRes]);

  useEffect(() => {
    if (singleWorkbook && singleWorkbook.length !== 0) {
      setNewWorkbookData(singleWorkbook);
      setNewWorkbookDataStoreData(singleWorkbook);
    }
  }, [singleWorkbook]);

  const actionRow = useCallback(({ index, style }) => {
    const p = actions[index];

    return (
      <div style={{ ...style }}>
        <div
          key={p.token}
          className={selectedActions.findIndex((e) => e.token === p.token && e.type === 'api') !== -1 ? 'mainCategory mainCategorySelected' : 'mainCategory'}
        >
          <div
            id={`Admin_Workbook_Action_Select_${p.token}`}
            className="mcatHead"
            data-test="api_action"
            onClick={() => addActionsPlaybooksToArray(p, 'api', 'actions')}
          >
            <ZsTooltip
              autoRight
              title={p.actionName}
              ids={`tooltip_action_${p.token}_${index}`}
            >
              <div className="mcatName" id={`tooltip_action_${p.token}_${index}`}><abbr style={{ textDecoration: 'none', cursor: 'pointer' }}>{p.actionName}</abbr></div>
            </ZsTooltip>
          </div>
        </div>
      </div>
    );
  }, [actions, selectedActions]);

  const apiRow = useCallback(({ index, style }) => {
    const p = configureAction[index];

    return (
      <div style={{ ...style }}>
        <div
          key={p}
          className={selectedActions.findIndex((e) => e.name === p && e.type === 'action') !== -1 ? 'mainCategory mainCategorySelected' : 'mainCategory'}
        >
          <div
            id={`Admin_Workbook_Configure_Action_${index}`}
            className="mcatHead"
            data-test="configure_action"
            onClick={() => addActionsPlaybooksToArray(p, 'action', 'actions')}
          >
            <ZsTooltip autoRight title={p} ids={`tooltip_configure_${p}_${index}`}>
              <div className="mcatName" id={`tooltip_configure_${p}_${index}`}><abbr style={{ textDecoration: 'none', cursor: 'pointer' }}>{p}</abbr></div>
            </ZsTooltip>
          </div>
        </div>
      </div>
    );
  }, [configureAction, selectedActions]);

  const playbookRow = useCallback(({ index, style }) => {
    const p = playbooks[index];
    return (
      <div style={{ ...style }}>
        <div key={p.id} className={selectedPlaybooks.findIndex((e) => e.token === p.id && e.type === 'playbook') !== -1 ? 'mainCategory mainCategorySelected' : 'mainCategory'}>
          <div
            id={`Admin_Workbook_Playbook_Select_${p.id}`}
            className="mcatHead"
            data-test="select_playbook"
            onClick={() => addActionsPlaybooksToArray(p, 'playbook')}
          >
            <ZsTooltip autoRight title={p.name} ids={`tooltip_playbook_${p.id}_${index}`}>
              <div className="mcatName" id={`tooltip_playbook_${p.id}_${index}`}><abbr style={{ textDecoration: 'none', cursor: 'pointer' }}>{p.name}</abbr></div>
            </ZsTooltip>
          </div>
        </div>
      </div>
    );
  }, [playbooks, selectedPlaybooks]);

  return (
    <NewWorkbookWrapper id="Admin_New_Workbook_Wrapper">
      <div className="backButtonWrapper">
        <div className="headerLeft">
          <div id="Admin_Workbook_Back_Btn" data-test="close_workbook" onClick={closeWorkbook} className="backButton" style={{ left: '20px' }}>
            <div className="arrow1" />
          </div>
        </div>
      </div>
      {workbookModelLoading && <ZsSpin id="Admin_New_Workbook_Loading" />}
      {!workbookModelLoading && (
        <>
          <div className="phaseWrapper">

            <div className="spacing">
              <ZsInput
                id="Admin_Workbook_Name_Input"
                inputtype="normal"
                name="workbookName"
                label="Workbook Name"
                maxLength="hundred"
                requiredentry={1}
                errormsg="Enter workbook name."
                error={!!(submitted && !workbookName)}
                value={workbookName || ''}
                onChange={(e) => setWorkbookData(e.target.value, 'workbookName')}
                placeholdertext="Enter workbook name"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'end', margin: '20px 0' }}>
              <ZsButton
                id="Admin_Workbook_Add_Phase_Btn"
                type="primary"
                style={{ marginLeft: '20px', fontWeight: 'bold' }}
                data-test="add_phase"
                onClick={addNewPhase}
                title="+ Phase"
              />
            </div>
            {workbookData && workbookData.map((phase, phaseindex) => (
              <div key={`create_workbook_taskName${phaseindex}}`} className="phaseDiv">
                <div className="fieldSet" style={{ margin: '-21px 0 0 -5px', fontWeight: '600' }}>
                  Phase
                  {' '}
                  <span style={{ margin: '0 2px' }}>
                    { phaseindex + 1 }
                  </span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px', margin: '-15px',
                }}
                >
                  <div
                    id={`Admin_Workbook_Phase_Collapse_Status_${phaseindex}`}
                    className={`colUp ${phase.collapseStatus ? 'phaseExpand' : 'phaseCollapse'}`}
                    onClick={() => phaseCollapseHandler(phaseindex)}
                  >
                    <div>
                      <Icons
                        type="ActionArrow"
                        icontype="globle"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="spacing">
                    <ZsInput
                      label="Phase Name"
                      requiredentry
                      id={`Admin_Workbook_Phase_Name_Input_${phaseindex}`}
                      inputtype="normal"
                      maxLength="twoFiveZero"
                      errormsg="Phase name required."
                      error={!!(submitted && !phase.name)}
                      placeholdertext="Enter phase name"
                      data-test="ekasha_phasename"
                      value={phase.name ? phase.name : ''}
                      onChange={(e) => setWorkbookData(e.target.value, 'name', phaseindex, 'tasks')}
                    />
                  </div>

                  <div className="spacing">
                    <div style={{
                      color: '#787878', height: '0px', textAlignLast: 'right',
                    }}
                    >
                      (
                      {phase.description !== undefined ? phase.description.length : 0}
                      / 1000)
                    </div>
                    <ZsInput
                      rows={4}
                      label="Phase Description"
                      requiredentry
                      id={`Admin_Workbook_Phase_Description_Textarea_${phaseindex}`}
                      inputtype="normal"
                      textarea
                      style={{
                        border: 'none', resize: 'none', height: 'auto', width: '100%',
                      }}
                      maxLength="thousand"
                      errormsg="Phase description required."
                      error={!!(submitted && !phase.description)}
                      placeholdertext="Enter phase description"
                      data-test="ekasha_phase_description"
                      value={phase.description ? phase.description : ''}
                      onChange={(e) => setWorkbookData(e.target.value, 'description', phaseindex, 'tasks')}
                    />
                  </div>

                  {workbookData.length > 1
                    ? (
                      <div key={phaseindex} className="removePhase" id={`Admin_Workbook_Remove_Phase_${phaseindex}`} data-test="remove_phase" onClick={() => removePhase(phaseindex)}>
                        <Icons icontype="common" type="ToasterClose" className="removeIcon" />
                      </div>
                    )
                    : null}
                </div>
                {phase.tasks.map((task, taskindex) => (
                  <div key={`create_workbook_taskName${phaseindex}${taskindex}`} className={`taskContainer ${phase.collapseStatus ? '' : 'hiddenTask'}`}>
                    <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '20px' }}>
                      <ZsButton
                        id={`Admin_Workbook_Add_Task_Btn_${phaseindex}_${taskindex}`}
                        type="primary"
                        title="+ Task"
                        data-test="add_task"
                        onClick={() => addNewTask(phaseindex)}
                        style={{ marginLeft: '20px', fontWeight: 'bold' }}
                      />
                    </div>
                    <div className="taskDiv">
                      <div className="fieldSet" style={{ fontWeight: '600', marginTop: '10px' }}>
                        Task
                        {' '}
                        <span style={{ margin: '0 2px' }}>
                          { taskindex + 1 }
                        </span>
                      </div>
                      <div className="spacing">
                        {phase.tasks.length > 1
                          ? (
                            <div key={phaseindex} id={`Admin_Workbook_Remove_Task_${phaseindex}_${taskindex}`} data-test="remove_task" className="removeTask" onClick={() => removeTask(phaseindex, taskindex)}>
                              <Icons icontype="globle" type="delete" className="removeIconTask" />
                            </div>
                          )
                          : null}
                      </div>

                      <div className="spacing">
                        <ZsInput
                          id={`Admin_Workbook_Task_Name_Input_${phaseindex}_${taskindex}`}
                          inputtype="normal"
                          label="Task Name"
                          requiredentry={1}
                          maxLength="twoFiveZero"
                          errormsg="Task name required."
                          error={!!(submitted && !task.name)}
                          placeholdertext="Enter task name"
                          value={task.name ? task.name : ''}
                          data-test="ekasha_taskname"
                          onChange={(e) => setWorkbookData(e.target.value, 'name', phaseindex, 'tasks', taskindex)}
                        />
                      </div>
                      <div className="spacing">
                        <div style={{
                          color: '#787878', height: '0px', textAlignLast: 'right',
                        }}
                        >
                          (
                          {task.description !== undefined ? task.description.length : 0}
                          / 1000)
                        </div>
                        <ZsInput
                          rows={4}
                          label="Task Description"
                          requiredentry={1}
                          id={`Admin_Workbook_Task_Description_Textarea_${phaseindex}_${taskindex}`}
                          inputtype="normal"
                          textarea
                          style={{
                            border: 'none', resize: 'none', height: 'auto', width: '100%',
                          }}
                          maxLength="thousand"
                          errormsg="Task description required."
                          error={!!(submitted && !task.description)}
                          placeholdertext="Enter task description"
                          data-test="ekasha_task_description"
                          value={task.description ? task.description : ''}
                          onChange={(e) => setWorkbookData(e.target.value, 'description', phaseindex, 'tasks', taskindex)}
                        />
                      </div>
                      <div>
                        <div className="selectActDiv">
                          <div className="popWrapper">
                            <ZsButton
                              id={`Admin_Workbook_Add_Action_Btn_${phaseindex}_${taskindex}`}
                              title="+ Action"
                              data-test="open_action_module"
                              onClick={() => { openActionPlaybook(`actionWorkbookBtn${phaseindex}${taskindex}`, 'action'); testTT(phaseindex, taskindex); }}
                              style={{ fontWeight: 'bold' }}
                            />
                            <div id={`actionWorkbookBtn${phaseindex}${taskindex}`} className={actionModal && actionId === `actionWorkbookBtn${phaseindex}${taskindex}` ? 'popWrapBody popWrapBodyOpen' : 'popWrapBody'}>
                              <Icons
                                icontype="common"
                                type="ToasterClose"
                                className="closePopWrap"
                                id={`Admin_Workbook_Close_Action_Module_${phaseindex}_${taskindex}`}
                                data-test="close_action_module"
                                onClick={() => { openActionPlaybook(`actionWorkbookBtn${phaseindex}${taskindex}`, 'action', 'close'); testTT(phaseindex, taskindex, 'clr'); }}
                              />
                              <div className="title">Select Action :</div>
                              <ZsTabs
                                id="Admin_Workbook_Tabs"
                                data-test="tabs"
                                defaultSetActiveTab={activeDetailTab}
                                onTabClick={(e) => { changeActiveTab(e); }}
                                items={[
                                  {
                                    key: 'Actions',
                                    label: (
                                      <span>
                                        <Icons icontype="common" type="apiBlock" className="blockIcn" />
                                        {'  '}
                                        Actions
                                      </span>
                                    ),
                                  },
                                  {
                                    key: 'Apis',
                                    label: (
                                      <span>
                                        <Icons icontype="common" type="actionBlock" className="blockIcn" />
                                        {'  '}
                                        APIs
                                      </span>
                                    ),
                                  },
                                ]}
                              />
                              <div className="taskBody" style={{ display: activeDetailTab === 'Actions' ? 'block' : 'none' }}>
                                {actionLoading ? (
                                  <ZsSpin id="adminWorkbookAPILoading" size="middle" />
                                ) : (
                                  <>
                                    {actions.length === 0 && <NoData size="noDataSmall" />}
                                    {actions.length > 0 && (
                                    <>
                                      <ZsList
                                        id="Admin_Workbook_Action_List"
                                        data={actions}
                                        rowHeight={45}
                                        overscanCount={3}
                                        Row={actionRow}
                                      />
                                    </>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="taskBody" style={{ display: activeDetailTab === 'Apis' ? 'block' : 'none' }}>
                                {apiLoading ? (
                                  <ZsSpin id="adminWorkbookActionLoading" size="middle" />
                                ) : (
                                  <>
                                    {configureAction.length === 0 && <NoData size="noDataSmall" />}
                                    {configureAction.length > 0 && (
                                    <ZsList
                                      id="Admin_Workbook_Apis_List"
                                      data={configureAction}
                                      rowHeight={45}
                                      overscanCount={3}
                                      Row={apiRow}
                                    />
                                    )}
                                  </>
                                )}
                              </div>
                              <ZsButton
                                id={`Admin_Workbook_OK_Action_Btn_${phaseindex}_${taskindex}`}
                                style={{ marginTop: 15, float: 'right' }}
                                className="newPbtn"
                                data-test="add_action"
                                type="primary"
                                title="OK"
                                onClick={() => { addSelectedActionsPlaybooksInData(phaseindex, taskindex, 'actions'); }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="selectedList">
                          <div className="controlLabel listTitle" style={{ width: '10%', color: '#4e8bff' }}>
                            <Icons type="action" icontype="common" className="ecIcon" />
                            Actions
                          </div>
                          <div className="listBody">
                            {task.actionList.map((a, actionindex) => (
                              <div key={a.token} className="controlLabel singleItem" style={{ background: a.type === 'action' ? 'rgb(255, 204, 99,.5)' : 'rgb(66, 112, 183, .5)' }}>
                                <Icons
                                  id={`Admin_Workook_Preview_Action_API_Icon${actionindex}`}
                                  data-test="ekasha_remove_field"
                                  icontype="common"
                                  className="adminActionApiIcon"
                                  type={a.type === 'action' ? 'actionBlock' : 'apiBlock'}
                                  style={{ lineHeight: '5px', cursor: 'pointer' }}
                                />
                                <div style={{ wordBreak: 'break-all', margin: '0 5px' }}>{a.type === 'api' ? a.actionName : a.name}</div>
                                <Icons
                                  icontype="common"
                                  id={`Admin_Workbook_Remove_Action_${phaseindex}_${taskindex}_${actionindex}`}
                                  data-test="remove_action"
                                  type="ToasterClose"
                                  className="removeAct"
                                  onClick={() => removeActionsFromArray(phaseindex, taskindex, actionindex, 'actions')}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="selectActDiv">
                          <div className="popWrapper">
                            <ZsButton
                              id={`Admin_Workbook_Add_Playbook_Btn_${phaseindex}_${taskindex}`}
                              title="+ Playbook"
                              data-test="open_playbook_module"
                              onClick={() => { openActionPlaybook(`playbookWorkbookBtn${phaseindex}${taskindex}`, 'playbook'); testTT(phaseindex, taskindex); }}
                              style={{ fontWeight: 'bold' }}
                            />
                            <div id={`playbookWorkbookBtn${phaseindex}${taskindex}`} className={playbookModal && playbookId === `playbookWorkbookBtn${phaseindex}${taskindex}` ? 'popWrapBody popWrapBodyPb popWrapBodyOpen' : 'popWrapBody popWrapBodypb'}>
                              <Icons
                                icontype="common"
                                type="ToasterClose"
                                className="closePopWrap"
                                id={`Admin_Workbook_Close_Playbook_Module_${phaseindex}_${taskindex}`}
                                data-test="close_playbook_module"
                                onClick={() => { openActionPlaybook(`playbookWorkbookBtn${phaseindex}${taskindex}`, 'playbook'); testTT(phaseindex, taskindex, 'clr'); }}
                              />
                              <div className="title">Select Playbook</div>
                              <div className="taskBody" data-test="playbook-tab">
                                {playbookLoading ? (
                                  <ZsSpin id="adminWorkbookplaybookLoading" size="middle" />
                                ) : (
                                  <>
                                    {playbooks.length === 0 && <NoData size="noDataSmall" />}
                                    {playbooks.length > 0 && (
                                    <ZsList
                                      data={playbooks}
                                      rowHeight={45}
                                      overscanCount={3}
                                      Row={playbookRow}
                                    />
                                    )}
                                  </>
                                )}
                              </div>
                              <ZsButton
                                id={`Admin_Workbook_OK_Playbook_Btn_${phaseindex}_${taskindex}`}
                                style={{ marginTop: 15, float: 'right' }}
                                className="newPbtn"
                                type="primary"
                                data-test="add_playbook"
                                title="OK"
                                onClick={() => { addSelectedActionsPlaybooksInData(phaseindex, taskindex, 'playbooks'); }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="selectedList">
                          <div
                            className="controlLabel listTitle"
                            style={{
                              display: 'flex', alignItems: 'center', width: '10%', color: '#4e8bff',
                            }}
                          >
                            <Icons type="playbooksWB" icontype="common" className="ecIcon" style={{ display: 'flex', alignItems: 'center' }} />
                            Playbooks
                          </div>
                          <div className="listBody">
                            {task.playbooks.map((a, playindex) => (
                              <div key={a.token} className="controlLabel singleItem" style={{ background: 'rgb(99, 199, 203,.5)' }}>
                                <Icons
                                  id={`Admin_Workook_Preview_Playbook_Icon_${playindex}`}
                                  data-test="ekasha_remove_field"
                                  icontype="common"
                                  className="adminPlaybookWBIcon"
                                  type="playbooksWB"
                                  style={{ lineHeight: '5px', cursor: 'pointer' }}
                                />
                                <div style={{ wordBreak: 'break-all', margin: '0 5px' }}>{a.name}</div>
                                <Icons
                                  icontype="common"
                                  id={`Admin_Workbook_Remove_Playbook_${phaseindex}_${taskindex}_${playindex}`}
                                  type="ToasterClose"
                                  data-test="remove_playbook"
                                  className="removeAct"
                                  onClick={() => removeActionsFromArray(phaseindex, taskindex, playindex, 'playbooks')}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </>
      )}

      <div className="saveCancleHeader" style={{ visibility: !workbookModelLoading ? 'visible' : 'hidden' }}>
        <ZsButton
          id="Admin_Workbook_Save_Btn"
          data-test="submit_btn"
          disabled={valueEdited === false}
          title={openNewWorkbook !== 'new' ? 'Update' : 'Create'}
          loading={submitLoading}
          onClick={saveData}
        />
      </div>
    </NewWorkbookWrapper>
  );
});
NewWorkbook.propTypes = {
  closeWorkbook: PropTypes.func,
  workbookModelLoading: PropTypes.bool,
  updateWorkbookAction: PropTypes.func,
  addWorkbookAction: PropTypes.func,
  fakeActionWorkbook: PropTypes.func,
  singleWorkbook: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  getWorkbookListOfAction: PropTypes.func,
  fakePlaybookAction: PropTypes.func,
  ekashaAPIGetAction: PropTypes.func,
  getNewAllPlaybookBlockAction: PropTypes.func,
  newWorkbookData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setNewWorkbookData: PropTypes.func,
  setSingleWorkbook: PropTypes.func,
  setWorkbookModelLoading: PropTypes.func,
  setFetchLoading: PropTypes.func,
  setOpenNewWorkbook: PropTypes.func,
  setOpenNewWorkbookStatus: PropTypes.func,
  openNewWorkbook: PropTypes.string,
};

NewWorkbook.defaultProps = {
  closeWorkbook: null,
  workbookModelLoading: false,
  updateWorkbookAction: null,
  addWorkbookAction: null,
  fakeActionWorkbook: null,
  singleWorkbook: null,
  getWorkbookListOfAction: null,
  fakePlaybookAction: null,
  ekashaAPIGetAction: null,
  getNewAllPlaybookBlockAction: null,
  newWorkbookData: null,
  setNewWorkbookData: null,
  setSingleWorkbook: null,
  setWorkbookModelLoading: null,
  setFetchLoading: null,
  setOpenNewWorkbook: null,
  setOpenNewWorkbookStatus: null,
  openNewWorkbook: '',
};
export default NewWorkbook;
