/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef } from 'react';
import * as joint from 'jointjs/index';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CreatePlayBookWrapper, BuilderWrapper } from './PlaybookWrapper';
import Icons from '../../../../components/icons';
import ekasaLogo from '../../../../assets/images/logo.svg';
import ZsInput from '../../../../components/forms/input';
import ZsButton from '../../../../components/forms/button';
import AddTaskModal from './addTaskModal';
import Toaster from '../../../../components/toaster';
import {
  endN,
  startN,
  conditionN,
  titleN,
  playbookN,
  actionN,
  otherTaskN,
} from './playbookTaskIcons';
import { RegexList } from '../../../../helpers/lib/RegexList';
import { reConnect, stompClient } from '../../../../helpers/lib/SocketHandlers';
import {
  CreatePlaybookAction, editActionTask,
  editApiTask, editConditionTask, editPlaybookTask,
  editTitleTask, ekashaAPIGetAction, fakePlaybookAction,
  GetApprovalDataAction, getNewAllPlaybookBlockAction,
  GetPlaybookAction, openTaskModal, UpdatePlaybookAction,
  getFieldSuggestion,
  listRunningSchedulePlaybookAction,
} from '../../../../apis/playbook/playbook.actions';
import {
  fakeActionApps, getAllConfiguredAction, getByApp, getListAsset,
} from '../../../../apis/appinit/actions';
import {
  fakeActionIncidentAction, getActions, getActionsDeviceList, getActionsList, getActionToken,
} from '../../../../apis/incidents/subModule/Actions/Actions.action';
import {
  getAllListDataAction, fakeListDataAction,
} from '../../../../apis/administration/lists/lists.action';
import {
  GetOwnerAction, fakeIncidentAction,
} from '../../../../apis/incidents/actions';
import { fakeActionPanel, fetchFieldsForDetails } from '../../../../apis/panel/panel.action';
import NoData from '../../../../components/NoData';
import {
  conditonData,
  handleStorageChange,
  linksData, setConditionData, setLinksData,
} from '../../../../helpers/lib/StorageHandlers';
import PlaybookUpdateAndDeletionModel from './playbookDeletionPreview';

let subscribe;

const NewPlaybook = React.memo((props) => {
  const {
    match,
  } = props;
  const [fullView, setFullView] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [id, setId] = useState(1);
  const [fackId, setFackId] = useState(1);
  const [zoom, setZoom] = useState(0.9);
  const [cursor, setCursor] = useState('grab');
  const [maskLoading, setMaskLoading] = useState(true);
  const [taskIds, setTaskIds] = useState({ id: '', status: false });
  // add new task to playground

  const [lineId, setLineId] = useState(null);
  const [source, setSource] = useState(null);
  const [target, setTarget] = useState(null);

  const [saveType, setSaveType] = useState('new');
  const [playbookName, setPlaybookName] = useState(null);
  const [playbookDesc, setPlaybookDesc] = useState(null);
  const [playbookVersion, setPlaybookVersion] = useState('1.1');
  const [defultVersion, setDefultVersion] = useState('1.1');
  const [playbookIsVersion, setPlaybookISVersion] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paperUpdate, setPaperUpdate] = useState();
  const [selectedBox, setSelectedBox] = useState('');
  const [selectBox, setSelectBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [graph, setGraph] = useState(new joint.dia.Graph());
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [home, setHome] = useState(false);
  const [actionTokenList, setActionTokenList] = useState([]);
  const [filedSuggestionListFilterd, setFieldSuggestionListFilterd] = useState([]);
  const [updatePreviewModel, setUpdatePreviewModel] = useState(false);
  const [updatePreviewModelLoading, setUpdatePreviewModelLoading] = useState(false);

  const [updateData, setUpdateData] = useState(false);

  const ref = useRef({});

  const dispatch = useDispatch();
  const openTaskModalAPI = (param) => dispatch(openTaskModal(param));
  const CreatePlaybookActionAPI = (param) => dispatch(CreatePlaybookAction(param));
  const editActionTaskAPI = (param) => dispatch(editActionTask(param));
  const editApiTaskAPI = (param) => dispatch(editApiTask(param));
  const editConditionTaskAPI = (param) => dispatch(editConditionTask(param));
  const editPlaybookTaskAPI = (param) => dispatch(editPlaybookTask(param));
  const editTitleTaskAPI = (param) => dispatch(editTitleTask(param));
  const ekashaAPIGetActionAPI = (param) => dispatch(ekashaAPIGetAction(param));
  const fakePlaybookActionAPI = (param) => dispatch(fakePlaybookAction(param));
  const GetApprovalDataActionAPI = (param) => dispatch(GetApprovalDataAction(param));
  const getNewAllPlaybookBlockActionAPI = (param) => dispatch(getNewAllPlaybookBlockAction(param));
  const GetPlaybookActionAPI = (param) => dispatch(GetPlaybookAction(param));
  const UpdatePlaybookActionAPI = (param) => dispatch(UpdatePlaybookAction(param));
  const fakeActionAppsAPI = (param) => dispatch(fakeActionApps(param));
  const getAllConfiguredActionAPI = (param) => dispatch(getAllConfiguredAction(param));
  const getByAppAPI = (param) => dispatch(getByApp(param));
  const getListAssetAPI = (param) => dispatch(getListAsset(param));
  const fakeActionIncidentActionAPI = (param) => dispatch(fakeActionIncidentAction(param));
  const getActionsAPI = (param, type) => dispatch(getActions(param, type));
  const getAllListDataActionAPI = () => dispatch(getAllListDataAction());
  const fakeIncidentActionAPI = () => dispatch(fakeIncidentAction());
  const GetOwnerActionAPI = () => dispatch(GetOwnerAction());
  const fakeListDataActionAPI = (param) => dispatch(fakeListDataAction(param));
  const getActionsDeviceListAPI = (param) => dispatch(getActionsDeviceList(param));
  const getActionsListAPI = (param) => dispatch(getActionsList(param));
  const getActionTokenAPI = (param, type) => dispatch(getActionToken(param, type));
  const fakeActionPanelAPI = (param) => dispatch(fakeActionPanel(param));
  const fetchFieldsForDetailsAPI = (param) => dispatch(fetchFieldsForDetails(param));
  const getFieldSuggestionAPI = (param) => dispatch(getFieldSuggestion(param));
  const listRunningSchedulePlaybookActionAPI = (param) => dispatch(listRunningSchedulePlaybookAction(param));

  const CreatePlaybookRes = useSelector(
    (state) => (state.PlayBook.CreatePlaybookResponse || {}),
  );
  const GetPlaybookRes = useSelector(
    (state) => (state.PlayBook.GetPlaybookResponse || {}),
  );
  const UpdatePlaybookRes = useSelector(
    (state) => (state.PlayBook.UpdatePlaybookResponse || {}),
  );
  const FieldSuggestionRes = useSelector(
    (state) => (state.PlayBook.FieldSuggestionResponse || {}),
  );

  const onPlaybookdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'playbook') {
      switch (dataRes.operation) {
        case 'update':
          if (dataRes.status) {
            if (match.params.playbookId === dataRes.data.id) {
              setPlaybookName(dataRes.data.name);
              setPlaybookDesc(dataRes.data.description);
              setPlaybookVersion(dataRes.data.version);
              setDefultVersion(dataRes.data.version);
            }
          }
          break;
        default:
          break;
      }
    }
    if (dataRes.module === 'Group' && dataRes.status) {
      if (dataRes.data.token === JSON.parse(localStorage.getItem('U_TOKENS')).groupToken) {
        // setHome(true);
      }
    }
    if (dataRes.module === 'user') {
      if (dataRes.operation && dataRes.operation === 'update') {
        if (dataRes.status) {
          if (dataRes.data.token === JSON.parse(localStorage.getItem('U_TOKENS')).userToken) {
            // setHome(true);
          }
        }
      }
    }
  };
  const onConnected = () => {
    const channelSub = () => {
      subscribe = stompClient.subscribe('/topic/broadcast', onPlaybookdataReceived);
    };
    channelSub();
    window.addEventListener('stompClientChanged', channelSub);
  };

  useEffect(() => {
    if (!stompClient.connected) {
      reConnect(onConnected);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('storage', (e) => {
      handleStorageChange(e);
    });
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (UpdatePlaybookRes.status) {
      setTimeout(() => {
        window.close();
      }, 10);
      setSaveLoading(false);
      fakePlaybookActionAPI();
    } else if (UpdatePlaybookRes.status === false) {
      setSaveLoading(false);
      fakePlaybookActionAPI();
    }
  }, [UpdatePlaybookRes]);

  useEffect(() => {
    if (CreatePlaybookRes.status) {
      setTimeout(() => {
        window.close();
      }, 10);
      setSaveLoading(false);
      fakePlaybookActionAPI();
    } else if (CreatePlaybookRes.status === false) {
      setSaveLoading(false);
      fakePlaybookActionAPI();
    }
  }, [CreatePlaybookRes]);

  useEffect(() => {
    if (FieldSuggestionRes.status) {
      setFieldSuggestionListFilterd(FieldSuggestionRes.data);
      fakeActionAppsAPI();
    } else if (FieldSuggestionRes.status === false) {
      fakeActionAppsAPI();
    }
  }, [FieldSuggestionRes]);

  const linkLabel = (link, textData, rectWidth) => {
    link.labels([{
      markup: '<g><rect/><text/></g>',
      attrs: {
        text: {
          text: textData,
          'ref-y': '48%',
          'ref-x': '50%',
          'text-anchor': 'middle',
          'font-size': 12,
          ref: 'rect',
          'y-alignment': 'middle',
          fill: '#d58a28',
        },
        rect: {
          fill: 'black',
          stroke: '#d58a28',
          rx: 2,
          ry: 2,
          y: -10,
          width: rectWidth,
          height: '24px',
        },
      },
      position: {
        distance: 0.25,
        args: {
          keepGradient: true,
          ensureLegibility: true,
        },
      },
    }]);
  };

  const addCustomLinkIcon = (link, paper) => {
    joint.linkTools.InfoButton = joint.linkTools.Button.extend({
      name: 'info-button',
      options: {
        markup: [{
          tagName: 'circle',
          selector: 'circle',
          attributes: {
            stroke: 'red',
            fill: 'rgb(20, 21, 23)',
            r: '11',
            class: 'deleteLine',
            style: 'cursor: pointer;',
          },
        },
        {
          tagName: 'path',
          selector: 'path1',
          attributes: {
            d: 'M11.81,6.66V12a1,1,0,0,1-.53.9,1.05,1.05,0,0,1-.6.15H5.82A1.45,1.45,0,0,1,5,12.88,1.07,1.07,0,0,1,4.48,12V6.67A.48.48,0,0,1,5,6.21H5a.48.48,0,0,1,.46.46V12h5.41V6.67a.48.48,0,0,1,.55-.4.47.47,0,0,1,.4.4Z',
            fill: 'red',
            class: 'deleteLine',
            transform: 'translate(-8, -9)',
          },
        },
        {
          tagName: 'path',
          selector: 'path2',
          attributes: {
            d: 'M12.59,4.67H10.46V4a.79.79,0,0,0-.63-.77,1,1,0,0,0-.24,0H6.67A.94.94,0,0,0,6,3.5.8.8,0,0,0,5.79,4v.66H3.67a.47.47,0,0,0-.48.43.48.48,0,0,0,.48.46h8.92a.46.46,0,1,0,0-.91ZM6.74,4.05Zm2.77.62H6.74V4.12H9.51Z',
            fill: 'red',
            class: 'deleteLine',
            transform: 'translate(-8, -9)',
          },
        },
        {
          tagName: 'path',
          selector: 'path3',
          attributes: {
            d: 'M9.67,6.67v4.1a.48.48,0,0,1-1,0h0V6.67a.48.48,0,0,1,.48-.46h0A.48.48,0,0,1,9.67,6.67Z',
            fill: 'red',
            class: 'deleteLine',
            transform: 'translate(-8, -9)',
          },
        },
        {
          tagName: 'path',
          selector: 'path4',
          attributes: {
            d: 'M7.57,6.67v4.1a.47.47,0,0,1-.47.45.46.46,0,0,1-.48-.44h0V6.67a.48.48,0,0,1,.48-.46h0A.48.48,0,0,1,7.57,6.67Z',
            fill: 'red',
            class: 'deleteLine',
            transform: 'translate(-8, -9)',
          },
        }],
        distance: 70,
        offset: 0,
        action() {
          const linkView = link.findView(paper);
          setValueEdited(true);
          linkView.model.remove();
        },
      },
    });
    const infoButton = new joint.linkTools.InfoButton();
    const toolsView = new joint.dia.ToolsView({
      tools: [infoButton],
    });
    const graphSet = graph;
    const taskAttr = graph.getCell(link.attributes.source.id).attributes;
    const data = graphSet.toJSON();
    const AllLinks = [];

    data.cells.forEach((e) => {
      if (e.type === 'link') {
        AllLinks.push(e);
      }
    });
    if (taskAttr.type === 'conditional') {
      let textData;
      const linkPort = link.attributes.source.port;
      for (let i = 0; i < Object.keys(taskAttr.scriptarguments).length; i += 1) {
        if (Object.keys(taskAttr.scriptarguments).length === 1) {
          if (taskAttr.scriptarguments[i + 1].conditionType === 'if' && linkPort === 'out-0') {
            textData = 'if';
          }
        } else if (Object.keys(taskAttr.scriptarguments).length === 2) {
          if (taskAttr.scriptarguments[i + 1].conditionType === 'if' && linkPort === 'out-1') {
            textData = 'if';
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else' && linkPort === 'out-0') {
            textData = 'else';
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else if' && linkPort === 'out-0') {
            textData = 'else if';
          }
        } else if (Object.keys(taskAttr.scriptarguments).length === 3) {
          if (taskAttr.scriptarguments[i + 1].conditionType === 'if' && linkPort === 'out-1') {
            textData = 'if';
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else if') {
            if (taskAttr.scriptarguments[i + 1].condition === '2' && linkPort === 'out-0') {
              textData = 'else if';
            } else if (taskAttr.scriptarguments[i + 1].condition === '3' && linkPort === 'out-2') {
              textData = 'else if 1';
            }
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else' && linkPort === 'out-2') {
            textData = 'else';
          }
        } else if (Object.keys(taskAttr.scriptarguments).length === 4) {
          if (taskAttr.scriptarguments[i + 1].conditionType === 'if' && linkPort === 'out-1') {
            textData = 'if';
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else if') {
            if (taskAttr.scriptarguments[i + 1].condition === '2' && linkPort === 'out-3') {
              textData = 'else if';
            } else if (taskAttr.scriptarguments[i + 1].condition === '3' && linkPort === 'out-0') {
              textData = 'else if 1';
            } else if (taskAttr.scriptarguments[i + 1].condition === '4' && linkPort === 'out-2') {
              textData = 'else if 2';
            }
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else' && linkPort === 'out-2') {
            textData = 'else';
          }
        } else if (Object.keys(taskAttr.scriptarguments).length === 5) {
          if (taskAttr.scriptarguments[i + 1].conditionType === 'if' && linkPort === 'out-1') {
            textData = 'if';
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else if') {
            if (taskAttr.scriptarguments[i + 1].condition === '2' && linkPort === 'out-3') {
              textData = 'else if';
            } else if (taskAttr.scriptarguments[i + 1].condition === '3' && linkPort === 'out-0') {
              textData = 'else if 1';
            } else if (taskAttr.scriptarguments[i + 1].condition === '4' && linkPort === 'out-4') {
              textData = 'else if 2';
            } else if (taskAttr.scriptarguments[i + 1].condition === '5' && linkPort === 'out-2') {
              textData = 'else if 3';
            }
          } else if (taskAttr.scriptarguments[i + 1].conditionType === 'else' && linkPort === 'out-2') {
            textData = 'else';
          }
        }
      }
      if (textData === 'if') {
        linkLabel(link, textData, '24px');
      } else if (textData === 'else') {
        linkLabel(link, textData, '45px');
      } else if (textData === 'else if') {
        linkLabel(link, textData, '55px');
      } else {
        linkLabel(link, textData, '65px');
      }
    }
    const linkView = link.findView(paper);
    linkView.addTools(toolsView);
    linkView.hideTools();
  };
  let linkLineData = [];

  const addLinkInGraph = (lineId, source, target, tt) => {
    const graphSet = graph;
    if (graphSet.getCell(lineId)) {
      setValueEdited(true);
      graphSet.getCell(lineId).remove();
    }
    const link = new joint.dia.Link({
      source,
      target,
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { type: ' gap' } },
      attrs: {
        '.marker-target': {
          fill: tt === 'Failed' ? '#f04848' : '#4e8bff',
          d: 'M 10 0 L 0 5 L 10 10 z',
          stroke: tt === 'Failed' ? '#f04848' : '#4e8bff',
        },
        '.connection': { stroke: tt === 'Failed' ? '#f04848' : '#4e8bff', 'stroke-width': '2px' },
        'connection-wrap': { stroke: tt === 'Failed' ? '#f04848' : '#4e8bff' },
      },
      smooth: true,
      z: -1,
    });
    linkLineData.push(link);
    graphSet.getCell(0).attr('.line2/fill', 'none');
    graphSet.getCell(1).attr('.line2/fill', 'none');
    graphSet.getCell(0).attr('.body/style', 'filter: none;');
    graphSet.getCell(1).attr('.body/style', 'filter: none;');
    graphSet.getCell(link.get('target').id).attr('.body/stroke', 'none');
    graphSet.getCell(link.get('target').id).attr('.body/style', 'filter: none;');
    graphSet.getCell(link.get('source').id).attr('.body/stroke', 'none');
    graphSet.getCell(link.get('source').id).attr('.body/style', 'filter: none;');
    if (graphSet.getCell(link.get('source').id).attributes.deviceName === 'Conditional') {
      graphSet.getCell(link.get('source').id).attr('.body/style', 'transform: rotate(-45deg);');
    } else {
      graphSet.getCell(link.get('source').id).attr('.line2/fill', '#4e8bff');
    }
    if (graphSet.getCell(link.get('target').id).attributes.deviceName === 'Conditional') {
      graphSet.getCell(link.get('target').id).attr('.body/style', 'transform: rotate(-45deg);');
    } else {
      graphSet.getCell(link.get('target').id).attr('.line2/fill', '#4e8bff');
    }
  };
  let rectNodeData = [];
  const addNode = (task) => {
    let markup; let size; let dName = ''; let infoTooltip = ''; let dNameTooltip = ''; let dDescTooltip = ''; let dDesc = ''; let
      ry = -25;
    if (task.type === 'start' || task.type === 'end') {
      ry = 0;
      size = { width: 185, height: 80 };
      dDesc = task.actionDesc;
      if (task.type === 'end') {
        markup = `${endN()}`;
      } else {
        markup = `${startN()}`;
      }
    } else if (task.type === 'conditional') {
      size = { width: 130, height: 130 };
      ry = -65;
      markup = `${conditionN(task, saveType)}`;
    } else if (task.type === 'title') {
      size = { width: 185, height: 130 };
      dName = task.assetName;
      dNameTooltip = task.assetName;
      dDesc = task.actionName;
      dDescTooltip = task.actionName;
      markup = `${titleN(task, saveType)}`;
    } else if (task.type === 'playbook') {
      size = { width: 185, height: 130 };
      dName = task.assetName;
      dNameTooltip = task.assetName;
      markup = `${playbookN(task, saveType)}`;
    } else {
      size = { width: 185, height: 130 };
      if (task.type === 'action') {
        dName = task.assetName;
        dNameTooltip = task.assetName;
        dDesc = task.actionName;
        dDescTooltip = task.actionName;
        infoTooltip = task.actionDesc ? task.actionDesc : 'action descriptiondf  dfdf dfsd df dfsdf fsdf sdfsd sdfsd sdfs dfsd fsdfsd fsdfsdfsd sdfsd fsdfs dfs fsdf';
        markup = `${actionN(task, saveType)}`;
      } else {
        dName = '';
        dDesc = task?.actionDisplayName ? task?.actionDisplayName : task?.actionName;
        dDescTooltip = task?.actionDisplayName ? task?.actionDisplayName : task?.actionName;
        infoTooltip = task.actionDesc ? task.actionDesc : 'action description not available';
        markup = `${otherTaskN(task, saveType)}`;
      }
    }

    const { view, ...rest } = task;
    const rectangle = new joint.shapes.devs.Model({
      ...rest,
      ...view.ports,
      position: view.position,
      markup,
      size,
      ports: {
        groups: {
          in: {
            position: 'left',
            attrs: {
              '.port-body': {
                magnet: 'passive',
                r: 6,
                fill: '#4e8bff',
                stroke: '#4e8bff',
                opacity: 0.4,
                'ref-y': ry,
              },
              '.port-label': {
                fill: 'transparent',
              },
            },
            z: -1,
          },
          out: {
            position: 'right',
            attrs: {
              '.port-body': {
                r: 6,
                fill: '#4e8bff',
                stroke: '#4e8bff',
                opacity: 0.4,
                'ref-y': ry,
              },
              '.port-label': {
                fill: 'transparent',
              },
            },
            z: -1,
          },
        },
      },
      attrs: {
        '.body': {
          size,
          stroke: 'none', // "#4e8bff",
          fill: '#000000',
          rx: rest.type === 'conditional' ? 8 : 1.5,
          ry: rest.type === 'conditional' ? 8 : 1.5,
        },
        '.line1': {
          height: 1.5,
          x: 10,
          y: 40,
          width: size.width - 10,
          fill: '#1b1c1c',
        },
        '.line2': {
          height: 2,
          x: 4,
          y: size.height,
          width: size.width - 8,
          fill: '#4e8bff',
          ry: 1,
        },
        '.label': {
          textAnchor: rest.type !== 'conditional' ? 'left' : 'middle',
          text: rest.name.length > 12 ? `${rest.name.substr(0, 12)}...` : rest.name,
          'font-family': 'Open Sans',
          fill: '#ffffff',
          fontSize: 12,
          fontWeight: 'bold',
          letterSpacing: '1.5',
          refX: rest.type !== 'conditional' ? -30 : 0,
          refY: rest.type !== 'conditional' ? 5 : 20,
        },
        '.playTaskId': {
          textAnchor: rest.type !== 'conditional' ? 'left' : 'middle',
          text: rest.id,
          'font-family': 'Open Sans',
          fill: '#4e8bff',
          fontSize: rest.type !== 'conditional' ? 12 : 17,
          fontWeight: 'bold',
          letterSpacing: '1.5',
          refX: rest.type !== 'conditional' ? -30 : 0,
          refY: rest.type !== 'conditional' ? 5 : 20,
        },
        '.dName': {
          textAnchor: 'left',
          text: dName.length > 19 ? `${dName.substr(0, 19)}...` : dName,
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontStyle: 'italic',
          fontSize: 12,
          refX: -30,
          refY: 5,
        },
        '.dDesc': {
          textAnchor: 'left',
          text: (rest.type === 'start' || rest.type === 'end') ? dDesc : dDesc.length > 19 ? `${dDesc.substr(0, 19)}...` : dDesc,
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontStyle: 'italic',
          fontSize: 12,
          refX: -30,
          refY: 5,
        },
        '.infoTooltip': {
          text: joint.util.breakText(infoTooltip, { width: 400 }),
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontSize: 12,
          id: `tId${task.id}`,
        },
        '.dNameTooltip': {
          text: joint.util.breakText(dNameTooltip, { width: 400 }),
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontSize: 12,
          id: `tDnameId${task.id}`,
        },
        '.dDescTooltip': {
          text: joint.util.breakText(dDescTooltip, { width: 400 }),
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontSize: 12,
          id: `tDescId${task.id}`,
        },
        '.taskNotInField': {
          id: `taskNotInField-${task.id}`,
          style: {
            display: 'none',
            cursor: 'pointer',
          },
        },
        '.wrongField': {
          text: 'Selected action result field was deleted please select another field',
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontSize: 12,
          id: `wrongField${task.id}`,
        },
      },
    });
    rectNodeData.push(rectangle);

    if (graph.getCell(selectedBox)) {
      graph
        .getCell(selectedBox)
        .attr('.body/stroke', 'none');
    }
    setSelectedBox(rest.id);
    setId(id + 1);
  };
  const fromJson = (data) => {
    Object.keys(data.tasks).forEach((e) => {
      addNode(data.tasks[e]);
    });
    graph.addCells(rectNodeData);
    setId(parseInt(data.tasks[parseInt(Object.keys(data.tasks)[Object.keys(data.tasks).length - 1])].id) + 1);
    setFackId(parseInt(data.tasks[parseInt(Object.keys(data.tasks)[Object.keys(data.tasks).length - 1])].id) + 1);

    Object.keys(data.tasks).forEach((pb) => {
      const e = data.tasks[pb];
      if (e.nexttasks) {
        if (e.type === 'conditional') {
          Object.keys(e.scriptarguments).forEach((j) => {
            e.nexttasks[j].forEach((ll) => {
              const src = {
                id: e.id,
                port: e.scriptarguments[j].conditionPort,
              };
              const targetSet = {
                id: ll,
                port: 'in-0',
              };
              addLinkInGraph(null, src, targetSet);
            });
          });
          Object.keys(e.fieldsData).forEach((ele) => {
            const fidsData = e.fieldsData;
            if (fidsData[ele]?.taskId) {
              if (data.tasks[fidsData[ele].taskId] === undefined) {
                graph.getCell(e.id).attr('.taskNotInField/style', 'display: block; cursor: pointer;');
                setGraph(graph);
              }
            }
          });
        } else {
          if (e.type === 'action' || e.type === 'api') {
            Object.keys(e.fieldsData).forEach((ele) => {
              const fidsData = e.fieldsData;
              if (fidsData[ele]?.taskId) {
                if (data.tasks[fidsData[ele].taskId] === undefined) {
                  graph.getCell(e.id).attr('.taskNotInField/style', 'display: block; cursor: pointer;');
                  setGraph(graph);
                }
              }
            });
            const listOfActionToken = {
              taskId: e.id,
              actionToken: e.actionToken,
              displayName: e.deviceName,
            };
            setActionTokenList((pre) => [...pre, listOfActionToken]);
          }
          Object.keys(e.nexttasks).forEach((l) => {
            if (e.nexttasks[l].length > 0) {
              e.nexttasks[l].forEach((ll) => {
                const src = {
                  id: e.id,
                  port: 'out-0',
                };
                const targetSet = {
                  id: ll.toString(),
                  port: 'in-0',
                };
                addLinkInGraph(null, src, targetSet);
              });
            }
          });
        }
      }
    });
    graph.addCell(linkLineData);
    linkLineData.forEach((e) => {
      addCustomLinkIcon(e, paperUpdate);
    });
    setGraph(graph);
    setMaskLoading(false);
    linkLineData = [];
    rectNodeData = [];
  };
  let isDragging;
  let paper;
  let dragStartPosition;

  useEffect(() => {
    if (GetPlaybookRes.status) {
      setPlaybookName(GetPlaybookRes.data.name);
      setPlaybookDesc(GetPlaybookRes.data.description);
      setPlaybookVersion(GetPlaybookRes.data.version);
      setDefultVersion(GetPlaybookRes.data.version);
      fromJson(GetPlaybookRes.data);
      fakePlaybookActionAPI();
    } else if (GetPlaybookRes.status === false) {
      fakePlaybookActionAPI();
    }
  }, [GetPlaybookRes]);

  const removeOutSideTool = (toolTipId, graph) => {
    if (!toolTipId.includes('infoIconTooltip') && !toolTipId.includes('actionDescTooltip') && !toolTipId.includes('actionNameTooltip') && !toolTipId.includes('taskNotInField')) {
      setTaskIds((pre) => {
        if (pre.status) {
          graph.getCell(pre.id)?.attr('.infoTooltip/visibility', 'hidden');
          graph.getCell(pre.id)?.attr('.infoTooltip/filter', 'none');
          graph.getCell(pre.id)?.attr('.dNameTooltip/visibility', 'hidden');
          graph.getCell(pre.id)?.attr('.dNameTooltip/filter', 'none');
          graph.getCell(pre.id)?.attr('.dDescTooltip/visibility', 'hidden');
          graph.getCell(pre.id)?.attr('.dDescTooltip/filter', 'none');
          graph.getCell(pre.id)?.attr('.wrongField/visibility', 'hidden');
          graph.getCell(pre.id)?.attr('.wrongField/filter', 'none');
          pre.id = '';
          pre.status = false;
        }
        return pre;
      });
    }
  };

  const bfsTraversal = (graph, typeData) => {
    const visited = {};
    let currentLevelQueue = [];
    let nextLevelQueue = [];
    const result = {};

    // Start with task ID 0
    const startTaskId = '0';

    // Enqueue the start task to the current level queue
    currentLevelQueue.push(startTaskId);

    while (currentLevelQueue.length > 0) {
      const currentTaskId = currentLevelQueue.shift();
      const currentTask = graph[currentTaskId];

      if (!visited[currentTaskId]) {
        visited[currentTaskId] = true;

        // Add the current task to the result
        const task = {
          id: currentTaskId,
          nexttasks: currentTask?.nexttasks,
        };

        if (currentTaskId !== '0' && currentTaskId !== '1') {
          const taskIdList = Object.keys(visited).filter((taskId) => taskId !== '0' && taskId !== '1');
          task.tid = taskIdList;
        } else {
          task.tid = [];
        }

        result[currentTaskId] = task;

        // Enqueue the next tasks to the next level queue
        // eslint-disable-next-line no-loop-func
        currentTask.nexttasks.default.forEach((nextTaskId) => {
          if (!visited[nextTaskId]) {
            nextLevelQueue.push(nextTaskId);
          }
        });
      }

      // Check if the current level queue is empty
      if (currentLevelQueue.length === 0) {
        // Swap the queues to move to the next level
        [currentLevelQueue, nextLevelQueue] = [nextLevelQueue, currentLevelQueue];
      }
    }

    return result;
  };

  const setNextTaskId = (typeData) => {
    const typeValue = typeData.split('_')[0];
    const typeValueInd = typeData.split('_')[1];
    const tasks = {};
    const data = graph.toJSON();
    const links = [];

    data.cells.forEach((e) => {
      if (e.type === 'link') {
        links.push({ source: e.source, target: e.target });
      } else {
        tasks[e.id] = {
          type: e.type,
          id: e.id,
          actionType: e.actionType,
          configrationStatus: e.configrationStatus,
          name: e.deviceName,
          actionDesc: e.actionDesc,
          deviceName: e.deviceName,
          assetName: e.assetName,
          actionName: e.actionName,
          actionToken: e.actionToken,
          assetToken: e.assetToken,
          actionDisplayName: e.actionDisplayName,
          deviceToken: e.deviceToken,
          validate: false,
          permission: e.permission,
          isPlaybook: e.isPlaybook,
          fieldsData: e.fieldsData,
          valuesData: e.valuesData,
          playbookToken: e.playbookToken,
          scriptarguments: { ...e.scriptarguments },
          displayArgument: { ...e.displayArgument },
          note: e.note ? e.note : {},
          view: {
            position: e.position,
            ports: { inPorts: e.inPorts, outPorts: e.outPorts },
          },
        };
      }
    });
    Object.keys(tasks).forEach((elem) => {
      const foundLinks = links.filter((e) => e.source.id === tasks[elem].id);
      if (!tasks[elem].nexttasks) {
        tasks[elem].nexttasks = { default: [] };
      }
      if (foundLinks.length > 0) {
        if (!tasks[elem].nexttasks.default) {
          tasks[elem].nexttasks.default = [];
          tasks[elem].starttask = { default: [] };
        }
        foundLinks.forEach((fl) => {
          if (
            tasks[elem].nexttasks.default.indexOf(fl.target.id) === -1
          ) {
            if (fl.target?.id !== undefined) {
              tasks[elem].nexttasks.default.push(fl.target.id);
            }
          }
        });
      } else {
        tasks[elem].nexttasks = { default: [] };
        tasks[elem].starttask = { default: [] };
      }
    });
    const result = bfsTraversal(tasks, typeData);
    const previousFieldsData = [];
    if (typeValue === 'edit') {
      if (result[typeValueInd] !== undefined) {
        // on click task then show previous acttion field of all action accept clicked task
        const maxTidArray = Object.values(result)
        .reduce((max, task) => (task.tid.length > max.length ? task.tid : max), []);

        const tIDArray = maxTidArray.filter((el) => el !== typeValueInd);
        tIDArray.forEach((ele) => {
          if (tasks[ele].deviceName !== 'Title') {
            previousFieldsData.push({ taskId: ele, actionToken: tasks[ele].actionToken, displayName: tasks[ele].deviceName });
          }
        });
      } else {
        setFieldSuggestionListFilterd([]);
      }
    }
    if (previousFieldsData.length > 0) {
      getFieldSuggestionAPI(previousFieldsData);
    } else {
      setFieldSuggestionListFilterd([]);
    }
  };

  const boxClicked = (cellView, evt, mx, my) => {
    const tempObj = cellView.model.attributes;
    const graphSet = graph;
    const tasks = {};
    const data = graphSet.toJSON();
    setGraph(graphSet);
    const links = [];

    data.cells.forEach((e) => {
      if (e.type === 'link') {
        links.push(e);
      } else {
        tasks[e.id] = {
          type: e.type,
          id: e.id,
          actionType: e.actionType,
          configrationStatus: e.configrationStatus,
          name: e.deviceName,
          actionDesc: e.actionDesc,
          deviceName: e.deviceName,
          assetName: e.assetName,
          actionName: e.actionName,
          actionToken: e.actionToken,
          assetToken: e.assetToken,
          deviceToken: e.deviceToken,
          actionDisplayName: e.actionDisplayName,
          validate: false,
          permission: e.permission,
          isPlaybook: e.isPlaybook,
          fieldsData: e.fieldsData,
          valuesData: e.valuesData,
          playbookToken: e.playbookToken,
          scriptarguments: { ...e.scriptarguments },
          displayArgument: { ...e.displayArgument },
          note: e.note ? e.note : {},
          view: {
            position: e.position,
            ports: { inPorts: e.inPorts, outPorts: e.outPorts },
          },
        };
      }
    });
    const foundLinks = [];
    const conditionDD = [];
    Object.keys(tasks).forEach((pb) => {
      if (tasks[pb].type === 'conditional') {
        const ports = [];
        for (let i = 0; i < Object.keys(tasks[pb].scriptarguments).length; i += 1) {
          ports.push(`out-${i}`);
        }
        foundLinks[pb] = links.filter((e) => e.source.id === tasks[pb].id);
        setLinksData(foundLinks);
        conditionDD[pb] = tasks[pb].scriptarguments;
        setConditionData(conditionDD);
      }
    });
    setSelectBox(true);
    setValueEdited(true);
    const toolTipId = evt.target.nearestViewportElement.id;
    if (toolTipId !== null) {
      if (toolTipId.includes('infoIconTooltip') || toolTipId.includes('actionDescTooltip') || toolTipId.includes('actionNameTooltip') || toolTipId.includes('taskNotInField')) {
        const tId = toolTipId.split('-')[1];
        setTaskIds((pre) => {
          pre.id = tId;
          pre.status = true;
          graph.getCell(pre.id).attr('.infoTooltip/visibility', 'hidden');
          graph.getCell(pre.id).attr('.infoTooltip/filter', 'none');
          graph.getCell(pre.id).attr('.dNameTooltip/visibility', 'hidden');
          graph.getCell(pre.id).attr('.dNameTooltip/filter', 'none');
          graph.getCell(pre.id).attr('.dDescTooltip/visibility', 'hidden');
          graph.getCell(pre.id).attr('.dDescTooltip/filter', 'none');
          graph.getCell(pre.id).attr('.wrongField/visibility', 'hidden');
          graph.getCell(pre.id).attr('.wrongField/filter', 'none');
          setGraph(graph);
          return { ...pre };
        });
      }
      removeOutSideTool(toolTipId, graph);
    }
    if (graphSet.getCell(selectedBox)) {
      graphSet
        .getCell(selectedBox)
        .attr('.body/stroke', 'none');
      setGraph(graphSet);
    }

    if (tempObj.type !== 'start' && tempObj.type !== 'end') {
      cellView.model.attr('.body/stroke', '#4e8bff');
      const actionData = {
        type: tempObj.type,
        id: tempObj.id,
        actionType: tempObj.actionType,
        configrationStatus: tempObj.configrationStatus,
        name: tempObj.deviceName,
        actionDesc: tempObj.actionDesc,
        deviceName: tempObj.deviceName,
        actionName: tempObj.actionName,
        assetName: tempObj.assetName,
        actionToken: tempObj.actionToken,
        assetToken: tempObj.assetToken,
        deviceToken: tempObj.deviceToken,
        permission: tempObj.permission,
        isPlaybook: tempObj.isPlaybook,
        fieldsData: tempObj.fieldsData,
        valuesData: tempObj.valuesData,
        actionDisplayName: tempObj.actionDisplayName,
        playbookToken: tempObj.playbookToken,
        scriptarguments: tempObj.scriptarguments
          ? tempObj.scriptarguments
          : {},
        displayArgument: tempObj.displayArgument
          ? tempObj.displayArgument
          : {},
        note: tempObj.note ? tempObj.note : {},
        view: {
          position: tempObj.position,
          ports: { inPorts: tempObj.inPorts, outPorts: tempObj.outPorts },
        },
      };

      const handleTaskDelete = (taskData) => {
        if ((taskData.attributes.type === 'action' || taskData.attributes.type === 'api')) {
          const deletedTaskId = taskData.id;
          Object.keys(tasks).forEach((ele) => {
            if (parseInt(tasks[ele].id) > parseInt(deletedTaskId)) {
              if (tasks[ele].fieldsData !== undefined) {
                Object.keys(tasks[ele].fieldsData).forEach((dd) => {
                  const fidsData = tasks[ele].fieldsData;
                  if (fidsData[dd]?.taskId === deletedTaskId) {
                    graphSet.getCell(tasks[ele].id).attr('.taskNotInField/style', 'display: block; cursor: pointer;');
                    setGraph(graphSet);
                  }
                });
              }
            }
          });
        }
      };

      const sd = { data: actionData };
      if (actionData.type === 'conditional') {
        const { x, y } = actionData.view.position;

        const xCondNote = mx - (x + 50) >= 0 && mx - (x + 50) < 31;
        const yCondNote = my - (y + 30) >= 0 && my - (y + 30) < 21;

        const xCond = mx - (x + 60) >= 0 && mx - (x + 60) < 11;
        const yCond = y - (my + 30) >= 0 && y - (my + 30) < 21;

        if (xCond && yCond && saveType !== 'preview') {
          cellView.model.remove();
        } else {
          openTaskModalAPI(actionData.type);
          setSelectedBox(actionData.id);
          if (xCondNote && yCondNote) {
            sd.addNotes = true;
          }
          if (saveType === 'preview') {
            sd.preview = true;
          }
          setNextTaskId(`edit_${cellView.model.id}`);
          editConditionTaskAPI(sd);
        }
      } else {
        const { x, y } = actionData.view.position;

        const xCondNote = mx - (x + 20) >= 0 && mx - (x + 20) < 21;
        const yCondNote = my - (y + 90) > 9 && my - (y + 90) < 29;

        const xCond = mx - (x + 150) >= 0 && mx - (x + 150) < 21;
        const yCond = my - (y + 90) > 9 && my - (y + 90) < 29;
        if (xCond && yCond && saveType !== 'preview') {
          handleTaskDelete(cellView.model);
          cellView.model.remove();
          setFieldSuggestionListFilterd((element) => {
            const elementFilterd = element.filter((ele) => ele.taskId !== cellView.model.id);
            return elementFilterd;
          });
          setActionTokenList((element) => {
            const elementFilterd = element.filter((ele) => ele.taskId !== cellView.model.id);
            return elementFilterd;
          });
        } else {
          openTaskModalAPI(actionData.type);
          setSelectedBox(actionData.id);
          if (xCondNote && yCondNote) {
            sd.addNotes = true;
          }
          if (saveType === 'preview') {
            sd.preview = true;
          }
          if (actionData.type === 'title') {
            editTitleTaskAPI(sd);
          } else if (actionData.type === 'playbook') {
            editPlaybookTaskAPI(sd);
          } else if (actionData.type === 'api') {
            setNextTaskId(`edit_${cellView.model.id}`);
            editApiTaskAPI(sd);
          } else if (actionData.type === 'action') {
            const xCondUser = mx - (x + 60) >= 0 && mx - (x + 60) < 11;
            const yCondUser = my - (y + 100) >= 0 && my - (y + 100) < 21;
            if (xCondUser && yCondUser) {
              sd.userPermission = true;
            }
            setNextTaskId(`edit_${cellView.model.id}`);
            editActionTaskAPI(sd);
          }
        }
      }
    }
  };

  const linkTouch = () => {
    const tasks = {};
    const data = graph.toJSON();
    const links = [];
    let newTaskId = fackId;
    setFackId((p) => {
      newTaskId = (p + 1).toString();
      return p + 1;
    });
    data.cells.forEach((e) => {
      if (e.type === 'link') {
        links.push({ source: e.source, target: e.target });
      } else {
        tasks[e.id] = {
          type: e.type,
          id: e.id,
          actionType: e.actionType,
          configrationStatus: e.configrationStatus,
          name: e.deviceName,
          actionDesc: e.actionDesc,
          deviceName: e.deviceName,
          assetName: e.assetName,
          actionName: e.actionName,
          actionToken: e.actionToken,
          assetToken: e.assetToken,
          deviceToken: e.deviceToken,
          validate: false,
          actionDisplayName: e.actionDisplayName,
          permission: e.permission,
          isPlaybook: e.isPlaybook,
          fieldsData: e.fieldsData,
          valuesData: e.valuesData,
          playbookToken: e.playbookToken,
          scriptarguments: { ...e.scriptarguments },
          displayArgument: { ...e.displayArgument },
          note: e.note ? e.note : {},
          view: {
            position: e.position,
            ports: { inPorts: e.inPorts, outPorts: e.outPorts },
          },
        };
      }
    });
    tasks[newTaskId.toString()] = {
      id: newTaskId.toString(),
      nexttasks: {
        default: [],
      },
    };
    Object.keys(tasks).forEach((elem) => {
      const foundLinks = links.filter((e) => e.source.id === tasks[elem].id);
      if (!tasks[elem].nexttasks) {
        tasks[elem].nexttasks = { default: [] };
      }
      if (foundLinks.length > 0) {
        if (!tasks[elem].nexttasks.default) {
          tasks[elem].nexttasks.default = [];
          tasks[elem].starttask = { default: [] };
        }
        foundLinks.forEach((fl) => {
          if (
            tasks[elem].nexttasks.default.indexOf(fl.target.id) === -1
          ) {
            if (fl.target.id !== undefined) {
              tasks[elem].nexttasks.default.push(fl.target.id);
            } else {
              tasks[elem].nexttasks.default.push(newTaskId);
            }
          }
        });
      } else {
        tasks[elem].nexttasks = { default: [] };
        tasks[elem].starttask = { default: [] };
      }
    });
    const result = bfsTraversal(tasks, 'new');

    const previousFieldsData = [];
    // on click task then show previous acttion field of all action accept clicked task
    const maxTidArray = Object.values(result)
    .reduce((max, task) => (task.tid.length > max.length ? task.tid : max), []);

    const tIDArray = maxTidArray.filter((el) => el !== newTaskId);
    tIDArray.forEach((e) => {
      if (tasks[e].deviceName !== 'Title') {
        previousFieldsData.push({ taskId: e, actionToken: tasks[e].actionToken, displayName: tasks[e].deviceName });
      }
    });
    if (previousFieldsData.length > 0) {
      getFieldSuggestionAPI(previousFieldsData);
    }
  };

  useEffect(() => {
    const graphSet = graph;
    if (graphSet.getCell(selectedBox) && selectBox === false) {
      graphSet
        .getCell(selectedBox)
        .attr('.body/stroke', 'none');
      setGraph(graphSet);
    }
  }, [selectBox]);

  const initPaper = () => {
    const graphSet = graph;
    paper = new joint.dia.Paper({
      el: document.getElementById('paper-restrict'),
      width: window.innerWidth,
      height: window.innerHeight,
      gridSize: 10,
      drawGrid: false,
      restrictTranslate: true,
      model: graphSet,
      snapLinks: { radius: 20 },
      perpendicularLinks: true,
      weight: 1,
      // linkPinning:false,
      interactive: () => {
        if (match.params.type === 'preview') {
          return false;
        }
        return { vertexAdd: false, labelMove: false };
      },
      defaultLink: new joint.dia.Link({
        router: { name: 'metro' },
        connector: { name: 'rounded', args: { type: ' gap' } },
        attrs: {
          '.marker-target': {
            fill: '#4e8bff',
            d: 'M 10 0 L 0 5 L 10 10 z',
            opacity: 1,
            stroke: '#4e8bff',
          },
          '.connection': { stroke: '#4e8bff', 'stroke-width': '0.2px' },
        },
        smooth: true,
        z: -1,
      }),
      validateConnection(
        cellViewS,
        magnetS,
        cellViewT,
        magnetT,
      ) {
        if (cellViewS === cellViewT) {
          return false;
        }

        if (magnetS && magnetS.getAttribute('port-group') === 'in') {
          return false;
        }

        return magnetT && magnetT.getAttribute('port-group') === 'in';
      },
      validateMagnet(cellView, magnet) {
        return magnet.getAttribute('magnet') !== 'passive';
      },
    });

    paper.on('cell:pointerclick', (cellView, evt, mx, my) => {
      if (cellView && cellView.model.attributes.type !== 'link') {
        boxClicked(cellView, evt, mx, my);
      }
    });

    paper.on('blank:pointerdown', (e, x, y) => {
      isDragging = true;
      setCursor('grabbing');
      setZoom((prevState) => {
        dragStartPosition = {
          x: x * prevState,
          y: y * prevState,
        };
        return prevState;
      });
      if (graphSet.getCell(selectedBox)) {
        graphSet
          .getCell(selectedBox)
          .attr('.body/stroke', 'none');
        setGraph(graphSet);
      }
    });

    paper.on('cell:pointerup blank:pointerup', (cellView) => {
      if (cellView.model instanceof joint.dia.Link) {
        const sourceSet = cellView.model.get('source');
        const targetSet = cellView.model.get('target');
        if (!targetSet.id) {
          if (saveType !== 'preview') {
            openTaskModalAPI();
            setLineId(cellView.model.id);
            setSource(sourceSet);
            setTarget(targetSet);
            linkTouch();
          }
        }
        const data = graphSet.toJSON();
        const links = [];
        setValueEdited(true);
        data.cells.forEach((e) => {
          if (e.type === 'link') {
            links.push({ source: e.source, target: e.target, id: e.id });
          }
        });
        const dublecatObj = links.find((nnn, index) => links.find((x, ind) => x.source.port === nnn.source.port && x.source.id === nnn.source.id && x.target.id === nnn.target.id && index !== ind));
        if (dublecatObj !== undefined) {
          if (graph.getCell(dublecatObj.id)) {
            const Index = links.findIndex((d) => d.id === dublecatObj.id);
            if (Index !== -1) {
              graph.getCell(dublecatObj.id).remove();
              setGraph(graph);
              links.splice(Index, 1);
            }
          }
        }
      }
      isDragging = false;
      setCursor('grab');
      dragStartPosition = undefined;
    });

    paper.on('link:mouseenter', (linkView) => {
      linkView.showTools();
    });

    paper.on('link:mouseleave', (linkView) => {
      linkView.hideTools();
    });

    graph.on('change:source change:target', (link) => {
      if (link.get('source').id && link.get('target').id) {
        // both ends of the link are connected.
        graphSet.getCell(link.get('target').id).attr('.body/stroke', 'none');
        graphSet.getCell(link.get('target').id).attr('.body/style', 'filter: none;');
        graphSet.getCell(link.get('source').id).attr('.body/stroke', 'none');
        graphSet.getCell(link.get('source').id).attr('.body/style', 'filter: none;');
        if (graphSet.getCell(link.get('source').id).attributes.deviceName === 'Conditional') {
          graphSet.getCell(link.get('source').id).attr('.body/style', 'transform: rotate(-45deg);');
        } else {
          graphSet.getCell(link.get('source').id).attr('.line2/fill', '#4e8bff');
        }
        if (graphSet.getCell(link.get('target').id).attributes.deviceName === 'Conditional') {
          graphSet.getCell(link.get('target').id).attr('.body/style', 'transform: rotate(-45deg);');
        } else {
          graphSet.getCell(link.get('target').id).attr('.line2/fill', '#4e8bff');
        }
        addCustomLinkIcon(link, paper);
      }
    });
    setPaperUpdate(paper);
  };
  const domInit = () => {
    // window events
    window.addEventListener('resize', () => {
      paper.setDimensions(window.innerWidth, window.innerHeight);
      setPaperUpdate(paper);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        paper.translate(
          e.offsetX - dragStartPosition.x,
          e.offsetY - dragStartPosition.y,
        );
        setPaperUpdate(paper);
      }
      const targetElement = e.composedPath()[1];
      if (targetElement instanceof Element) {
        const toolTipId = targetElement.getAttribute('id');
        if (toolTipId !== null && toolTipId !== undefined) {
          if (toolTipId.includes('infoIconTooltip')) {
            const tId = toolTipId.split('-')[1];
            setTaskIds((pre) => {
              pre.id = tId;
              pre.status = true;
              graph.getCell(pre.id).attr('.infoTooltip/visibility', 'visible');
              graph.getCell(pre.id).attr('.infoTooltip/filter', 'url(#solid)');
              graph.getCell(pre.id).attr('.dNameTooltip/visibility', 'hidden');
              graph.getCell(pre.id).attr('.dNameTooltip/filter', 'none');
              graph.getCell(pre.id).attr('.dDescTooltip/visibility', 'hidden');
              graph.getCell(pre.id).attr('.dDescTooltip/filter', 'none');
              graph.getCell(pre.id).attr('.wrongField/visibility', 'hidden');
              graph.getCell(pre.id).attr('.wrongField/filter', 'none');
              setGraph(graph);
              return { ...pre };
            });
          }
          if (toolTipId.includes('taskNotInField')) {
            const tId = toolTipId.split('-')[1];
            setTaskIds((pre) => {
              pre.id = tId;
              pre.status = true;
              graph.getCell(pre.id).attr('.infoTooltip/visibility', 'hidden');
              graph.getCell(pre.id).attr('.infoTooltip/filter', 'none');
              graph.getCell(pre.id).attr('.dNameTooltip/visibility', 'hidden');
              graph.getCell(pre.id).attr('.dNameTooltip/filter', 'none');
              graph.getCell(pre.id).attr('.dDescTooltip/visibility', 'hidden');
              graph.getCell(pre.id).attr('.dDescTooltip/filter', 'none');
              graph.getCell(pre.id).attr('.wrongField/visibility', 'visible');
              graph.getCell(pre.id).attr('.wrongField/filter', 'url(#solid)');
              setGraph(graph);
              return { ...pre };
            });
          }
          if (toolTipId.includes('actionDescTooltip')) {
            const tId = toolTipId.split('-')[1];
            setTaskIds((pre) => {
              pre.id = tId;
              pre.status = true;
              if (graph.getCell(pre.id).attributes.attrs['.dDesc'].text.includes('...')) {
                graph.getCell(pre.id).attr('.dDescTooltip/visibility', 'visible');
                graph.getCell(pre.id).attr('.dDescTooltip/filter', 'url(#solid)');
                graph.getCell(pre.id).attr('.infoTooltip/visibility', 'hidden');
                graph.getCell(pre.id).attr('.infoTooltip/filter', 'none');
                graph.getCell(pre.id).attr('.dNameTooltip/visibility', 'hidden');
                graph.getCell(pre.id).attr('.dNameTooltip/filter', 'none');
                graph.getCell(pre.id).attr('.wrongField/visibility', 'hidden');
                graph.getCell(pre.id).attr('.wrongField/filter', 'none');
              }
              setGraph(graph);
              return { ...pre };
            });
          }
          if (toolTipId.includes('actionNameTooltip')) {
            const tId = toolTipId.split('-')[1];
            setTaskIds((pre) => {
              pre.id = tId;
              pre.status = true;
              if (graph.getCell(pre.id).attributes.attrs['.dName'].text.includes('...')) {
                graph.getCell(pre.id).attr('.dNameTooltip/visibility', 'visible');
                graph.getCell(pre.id).attr('.dNameTooltip/filter', 'url(#solid)');
                graph.getCell(pre.id).attr('.infoTooltip/visibility', 'hidden');
                graph.getCell(pre.id).attr('.infoTooltip/filter', 'none');
                graph.getCell(pre.id).attr('.dDescTooltip/visibility', 'hidden');
                graph.getCell(pre.id).attr('.dDescTooltip/filter', 'none');
                graph.getCell(pre.id).attr('.wrongField/visibility', 'hidden');
                graph.getCell(pre.id).attr('.wrongField/filter', 'none');
              }
              setGraph(graph);
              return { ...pre };
            });
          }
          removeOutSideTool(toolTipId, graph);
        }
      }
    });

    // div events
    const mainDiv = document.getElementById('pb-content');
    if (mainDiv !== null) {
      mainDiv.addEventListener('wheel', (e) => {
        e.preventDefault();
      });
    }
  };

  useEffect(() => {
    if (!ref.current.mount) {
      ref.current.mount = true;
      initPaper();
      domInit();
      if (match.params.type !== 'new' && match.params.playbookId) {
        setSaveType(match.params.type);
        setTimeout(() => {
          GetPlaybookActionAPI(match.params.playbookId);
        }, 1000);
      } else {
        paper.scale(zoom, zoom);
        setMaskLoading(false);
        setSaveType('new');
        setPaperUpdate(paper);
        // add start mode
        addNode({
          type: 'start',
          id: '0',
          name: 'Start',
          actionDesc: 'Playbook starts here',
          deviceName: 'Start',
          // dDesc: 'start',
          actionToken: 'start',
          assetToken: 'start',
          deviceToken: 'start',
          configrationStatus: true,
          isPlaybook: false,
          playbookToken: '',
          permission: {},
          scriptarguments: {},
          displayArgument: {},
          note: {},
          nexttasks: {
            true: '2',
          },
          view: {
            position: {
              x: 300,
              y: 350,
            },
            ports: { outPorts: ['out-0'] },
          },
        });
        // add end mode
        addNode({
          type: 'end',
          id: '1',
          name: 'End',
          actionDesc: 'Playbook ends here',
          deviceName: 'End',
          configrationStatus: true,
          // dDesc: 'end',
          actionToken: 'end',
          assetToken: 'end',
          deviceToken: 'end',
          permission: {},
          isPlaybook: false,
          playbookToken: '',
          scriptarguments: {},
          displayArgument: {},
          starttask: {
            default: [],
          },
          note: {},
          view: {
            position: {
              x: 800,
              y: 350,
            },
            ports: { inPorts: ['in-0'] },
          },
        });
        graph.addCell(rectNodeData);
        rectNodeData = [];
      }
    }
  }, [localStorage.getItem('modulePermission')]);

  function removeDuplicateObjects(arr) {
    const uniqueArray = arr.filter((obj, index, self) => index === self.findIndex((o) => (
      JSON.stringify(o) === JSON.stringify(obj)
    )));

    return uniqueArray;
  }
  const closeModal = () => {
    if (lineId) {
      if (graph.getCell(lineId)) {
        const targetSet = graph.getCell(lineId).get('target');
        if (!targetSet.id) {
          graph.getCell(lineId).remove();
        }
      }
    }
  };
  const savePlaybook = () => {
    closeModal();
    if (taskDrawerOpen) {
      setTaskDrawerOpen(false);
    }
    setSubmitted(true);
    if (playbookName === null || playbookName === '' || playbookDesc === null || playbookDesc === '') {
      return;
    }
    if (errorMsg) {
      return;
    }

    const tasks = {};
    const graphSet = graph;
    const data = graphSet.toJSON();
    setGraph(graphSet);
    const links = [];

    data.cells.forEach((e) => {
      if (e.type === 'link') {
        links.push({ source: e.source, target: e.target });
      } else {
        tasks[e.id] = {
          type: e.type,
          id: e.id,
          actionType: e.actionType,
          configrationStatus: e.configrationStatus,
          name: e.deviceName,
          actionDesc: e.actionDesc,
          deviceName: e.deviceName,
          assetName: e.assetName,
          actionName: e.actionName,
          actionDisplayName: e.actionDisplayName,
          actionToken: e.actionToken,
          assetToken: e.assetToken,
          deviceToken: e.deviceToken,
          validate: false,
          permission: e.permission,
          isPlaybook: e.isPlaybook,
          fieldsData: e.fieldsData,
          valuesData: e.valuesData,
          playbookToken: e.playbookToken,
          scriptarguments: { ...e.scriptarguments },
          displayArgument: { ...e.displayArgument },
          note: e.note ? e.note : {},
          view: {
            position: e.position,
            ports: { inPorts: e.inPorts, outPorts: e.outPorts },
          },
        };
      }
    });

    Object.keys(tasks).forEach((pb) => {
      if (tasks[pb].type === 'conditional') {
        const foundLinks = links.filter((e) => e.source.id === tasks[pb].id);
        const Fdata = [];
        if (!tasks[pb].nexttasks) {
          tasks[pb].nexttasks = { default: [] };
        }
        if (!tasks[pb].starttask) {
          tasks[pb].starttask = { default: [] };
        }
        for (let i = 0; i < Object.keys(tasks[pb].scriptarguments).length; i += 1) {
          if (Object.keys(tasks[pb].scriptarguments).length === 1) {
            if (tasks[pb].scriptarguments[i + 1].conditionType === 'if') {
              const ifData = foundLinks.filter((d) => d.source.port === 'out-0');
              ifData.forEach((li) => {
                const links = { link: li, condition: 'if', id: 1 };
                Fdata.push(links);
              });
            }
          } else if (Object.keys(tasks[pb].scriptarguments).length === 2) {
            if (tasks[pb].scriptarguments[i + 1].conditionType === 'if') {
              const ifData = foundLinks.filter((d) => d.source.port === 'out-1');
              ifData.forEach((li) => {
                const links = { link: li, condition: 'if', id: 1 };
                Fdata.push(links);
              });
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else') {
              const elseData = foundLinks.filter((d) => d.source.port === 'out-0');
              elseData.forEach((li) => {
                const links = { link: li, condition: 'else', id: 2 };
                Fdata.push(links);
              });
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else if') {
              const elseIfData = foundLinks.filter((d) => d.source.port === 'out-0');
              elseIfData.forEach((li) => {
                const links = { link: li, condition: 'else if', id: 2 };
                Fdata.push(links);
              });
            }
          } else if (Object.keys(tasks[pb].scriptarguments).length === 3) { // it's work proper
            if (tasks[pb].scriptarguments[i + 1].conditionType === 'if') {
              const ifData = foundLinks.filter((d) => d.source.port === 'out-1');
              ifData.forEach((li) => {
                const links = { link: li, condition: 'if', id: 1 };
                Fdata.push(links);
              });
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else if') {
              if (tasks[pb].scriptarguments[i + 1].condition === '2') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-0');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 2 };
                  Fdata.push(links);
                });
              } else if (tasks[pb].scriptarguments[i + 1].condition === '3') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-2');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 3 };
                  Fdata.push(links);
                });
              }
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else') {
              const elseData = foundLinks.filter((d) => d.source.port === 'out-2');
              elseData.forEach((li) => {
                const links = { link: li, condition: 'else', id: 3 };
                Fdata.push(links);
              });
            }
          } else if (Object.keys(tasks[pb].scriptarguments).length === 4) {
            if (tasks[pb].scriptarguments[i + 1].conditionType === 'if') {
              const ifData = foundLinks.filter((d) => d.source.port === 'out-1');
              ifData.forEach((li) => {
                const links = { link: li, condition: 'if', id: 1 };
                Fdata.push(links);
              });
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else if') {
              if (tasks[pb].scriptarguments[i + 1].condition === '2') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-3');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 2 };
                  Fdata.push(links);
                });
              } else if (tasks[pb].scriptarguments[i + 1].condition === '3') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-0');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 3 };
                  Fdata.push(links);
                });
              } else if (tasks[pb].scriptarguments[i + 1].condition === '4') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-2');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 4 };
                  Fdata.push(links);
                });
              }
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else') {
              const elseData = foundLinks.filter((d) => d.source.port === 'out-2');
              elseData.forEach((li) => {
                const links = { link: li, condition: 'else', id: 4 };
                Fdata.push(links);
              });
            }
          } else if (Object.keys(tasks[pb].scriptarguments).length === 5) {
            if (tasks[pb].scriptarguments[i + 1].conditionType === 'if') {
              const ifData = foundLinks.filter((d) => d.source.port === 'out-1');
              ifData.forEach((li) => {
                const links = { link: li, condition: 'if', id: 1 };
                Fdata.push(links);
              });
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else if') {
              if (tasks[pb].scriptarguments[i + 1].condition === '2') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-3');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 2 };
                  Fdata.push(links);
                });
              } else if (tasks[pb].scriptarguments[i + 1].condition === '3') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-0');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 3 };
                  Fdata.push(links);
                });
              } else if (tasks[pb].scriptarguments[i + 1].condition === '4') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-4');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 4 };
                  Fdata.push(links);
                });
              } else if (tasks[pb].scriptarguments[i + 1].condition === '5') {
                const elseIfData = foundLinks.filter((d) => d.source.port === 'out-2');
                elseIfData.forEach((li) => {
                  const links = { link: li, condition: 'else if', id: 5 };
                  Fdata.push(links);
                });
              }
            } else if (tasks[pb].scriptarguments[i + 1].conditionType === 'else') {
              const elseData = foundLinks.filter((d) => d.source.port === 'out-2');
              elseData.forEach((li) => {
                const links = { link: li, condition: 'else', id: 5 };
                Fdata.push(links);
              });
            }
          }
        }
        Object.keys(tasks[pb].scriptarguments).forEach((t) => {
          const ifCon = Fdata.filter((f) => f.condition === tasks[pb].scriptarguments[t].conditionType);
          ifCon.forEach((k) => {
            if (tasks[pb].scriptarguments[k.id]) {
              if (!tasks[pb].nexttasks[k.id]) {
                tasks[pb].nexttasks[k.id] = [k.link.target.id];
                tasks[pb].scriptarguments[k.id].nextTaskId = [k.link.target.id];
              } else if (
                tasks[pb].nexttasks[k.id].indexOf(
                  k.link.target.id,
                ) === -1
              ) {
                tasks[pb].nexttasks[k.id].push(k.link.target.id);
                tasks[pb].scriptarguments[k.id].nextTaskId.push(k.link.target.id);
              }
            }
          });
        });
        if (tasks[pb].id !== '0' && tasks[pb].id !== '1') {
          const linksData = links.filter((e) => e.target.id === tasks[pb].id);
          linksData.forEach((l) => {
            tasks[pb].starttask.default.push(l.target.id);
          });
          const portsData = graphSet.getCell(tasks[pb].id).attributes.ports.items.filter((e) => e.id !== 'in-0');
          if ((Object.keys(tasks[pb].nexttasks).length - 1) !== portsData.length
            || tasks[pb].starttask.default.length === 0) {
            graphSet.getCell(tasks[pb].id).attr('.body/style', 'transform: rotate(-45deg); filter: url(#inset-shadow);');
            tasks[pb].validate = true;
          } else {
            tasks[pb].validate = false;
          }
          setGraph(graphSet);
        }
      } else {
        const foundLinks = links.filter((e) => e.source.id === tasks[pb].id);
        if (!tasks[pb].starttask) {
          tasks[pb].starttask = { default: [] };
        }
        if (!tasks[pb].nexttasks) {
          tasks[pb].nexttasks = { default: [] };
        }
        if (foundLinks.length > 0) {
          if (!tasks[pb].nexttasks.default) {
            tasks[pb].nexttasks.default = [];
            tasks[pb].starttask = { default: [] };
          }
          foundLinks.forEach((fl) => {
            if (
              tasks[pb].nexttasks.default.indexOf(fl.target.id) === -1
            ) {
              tasks[pb].nexttasks.default.push(fl.target.id);
            }
          });
        } else {
          tasks[pb].nexttasks = { default: [] };
          tasks[pb].starttask = { default: [] };
        }
        if (tasks[pb].id !== '0' && tasks[pb].id !== '1') {
          const linksData = links.filter((e) => e.target.id === tasks[pb].id);
          linksData.forEach((l) => {
            tasks[pb].starttask.default.push(l.target.id);
          });
          if (tasks[pb].nexttasks.default.length === 0
            || tasks[pb].starttask.default.length === 0) {
            graphSet.getCell(tasks[pb].id).attr('.line2/fill', 'none');
            graphSet.getCell(tasks[pb].id).attr('.body/style', 'filter: url(#inset-shadow);');
            tasks[pb].validate = true;
            setGraph(graphSet);
          } else {
            tasks[pb].validate = false;
          }
        }
      }
      if (tasks[pb].id === '0' || tasks[pb].id === '1') {
        if (!tasks[pb].starttask) {
          tasks[pb].starttask = { default: [] };
        }
        const linksData = links.filter((e) => e.source.id === tasks[pb].id);
        const linksData1 = links.filter((e) => e.target.id === tasks[pb].id);
        linksData.forEach((l) => {
          tasks[0].starttask.default.push(l.target.id);
        });
        linksData1.forEach((l) => {
          tasks[1].starttask.default.push(l.source.id);
        });
        if (tasks[pb].starttask.default.length === 0) {
          graphSet.getCell(tasks[pb].id).attr('.line2/fill', 'none');
          graphSet.getCell(tasks[pb].id).attr('.body/style', 'filter: url(#inset-shadow);');
          setGraph(graphSet);
          tasks[pb].validate = true;
        } else {
          tasks[pb].validate = false;
        }
      }
    });

    function detectCycle(data) {
      const visited = {};
      const onPath = {};

      function dfs(nodeId) {
        visited[nodeId] = true;
        onPath[nodeId] = true;
        const nextNodes = Object.keys(data[nodeId].nexttasks);
        for (let i = 0; i < nextNodes.length; i += 1) {
          const nextNodeKeysNode = data[nodeId].nexttasks[nextNodes[i]];
          for (let i = 0; i < nextNodeKeysNode.length; i += 1) {
            const nextNodeId = nextNodeKeysNode[i];
            if (!visited[nextNodeId]) {
              if (dfs(nextNodeId)) {
                return true;
              }
            } else if (onPath[nextNodeId]) {
              const src = {
                id: nodeId,
                port: 'out-0',
              };
              const targetSet = {
                id: nextNodeId,
                port: 'in-0',
              };
              graph.getLinks().forEach((elem) => {
                if ((elem.attributes.target.id === targetSet.id && elem.attributes.source.id === src.id)) {
                  src.port = elem.attributes.source.port;
                  graph.getCell(elem.id).remove();
                }
              });
              addLinkInGraph(null, src, targetSet, 'Failed');
              graph.addCell(linkLineData);
              linkLineData.forEach((e) => {
                addCustomLinkIcon(e, paperUpdate);
              });
              setGraph(graph);
              linkLineData = [];
              Toaster({ title: `Playbook detect infinite looping between ${data[nodeId].deviceName} to ${data[nextNodeId].deviceName} please remove looping to save the changes.`, type: 'error' });
              return true;
            }
          }
        }

        onPath[nodeId] = false;
        return false;
      }

      for (const nodeId in data) {
        if (!visited[nodeId]) {
          if (dfs(nodeId)) {
            return true;
          }
        }
      }

      return false;
    }
    const hasCycle = detectCycle(tasks);

    if (hasCycle) {
      return;
    }
    const { playbookId } = match.params;
    const configData = Object.keys(tasks).filter((d) => tasks[d].configrationStatus === false);
    const preid = [];
    Object.keys(tasks).forEach((pb) => {
      const nextNodes = Object.keys(tasks[pb].nexttasks);
      nextNodes.forEach((ele) => {
        tasks[pb].nexttasks[ele].forEach((element) => {
          if (tasks[element].id === element) {
            const aa = {
              p: tasks[pb].id,
              c: element,
              port: 'out-0',
              previousAction: tasks[pb].name,
            };
            preid.push(aa);
          }
        });
      });
    });
    const mainData = [];
    Object.keys(tasks).forEach((pb) => {
      const filterData = preid?.filter((d) => d.c === tasks[pb].id);
      filterData.forEach((element) => {
        if (tasks[element.p].type === 'conditional') {
          if (Object.keys(tasks[element.p].scriptarguments).length > 0) {
            Object.keys(tasks[element.p].scriptarguments).forEach((element2) => {
              tasks[element.p].scriptarguments[element2]?.nextTaskId?.forEach((ele) => {
                if (ele === element.c) {
                  element.port = tasks[element.p].scriptarguments[element2].conditionPort;
                  mainData.push({ ...element });
                }
              });
            });
          }
        } else {
          mainData.push({ ...element });
        }
      });
      const uniqueArray = removeDuplicateObjects(mainData);
      const filterData2 = uniqueArray?.filter((d) => d.c === tasks[pb].id);
      tasks[pb].previousIDs = filterData2;
    });

    const saveData = {
      name: playbookName,
      description: playbookDesc,
      version: playbookVersion === '' ? defultVersion : playbookVersion || '1.1',
      isVersion: playbookIsVersion,
      configStatus: configData.length === 0,
      id:
        saveType === 'edit'
          ? playbookId
          : Math.random()
            .toString(36)
            .slice(2),
      tasks,
      view: {
        scale: zoom,
      },
      userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
      userName: JSON.parse(localStorage.getItem('U_PROFILE')).fullname,
    };
    let newData = false;
    const ddd = [];
    Object.keys(tasks).forEach((pb) => {
      if (tasks[pb].validate && newData === false) {
        newData = true;
      }
      ddd.push(tasks[pb]);
    });
    if (newData) {
      Toaster({ title: 'Tasks connection required', type: 'error' });
    } else if (ddd.filter((d) => d.type !== 'start' && d.type !== 'end').length === 0) {
        Toaster({ title: 'One tasks required', type: 'error' });
        return;
      }
    if (saveType === 'new' && newData === false) {
      setSaveLoading(true);
      CreatePlaybookActionAPI(saveData);
    } else if (saveType !== 'new' && newData === false) {
      listRunningSchedulePlaybookActionAPI(playbookId, localStorage.getItem('customerID'));
      setUpdatePreviewModel(true);
      setUpdateData(saveData);
      // UpdatePlaybookActionAPI(saveData);
    }
  };

  const resetZoom = () => {
    setZoom(0.9);
    const paperUpdateSet = paperUpdate;
    if (paperUpdateSet) {
      paperUpdateSet.scale(0.9, 0.9);
      setPaperUpdate(paperUpdateSet);
    }
  };

  const zoomPaper = (e) => {
    const paperUpdateSet = paperUpdate;
    const size = paperUpdateSet.getComputedSize();
    if (e.deltaY < 0 && zoom > 0.5) {
      setZoom(zoom - 0.1);
      paperUpdateSet.translate(0, 0);
      paperUpdateSet.scale(zoom - 0.1, zoom - 0.1, size.width / 2, size.height / 2);
      setPaperUpdate(paperUpdateSet);
    } else if (e.deltaY > 0 && zoom < 1.8) {
      setZoom(zoom + 0.1);
      paperUpdateSet.translate(0, 0);
      paperUpdateSet.scale(zoom + 0.1, zoom + 0.1, size.width / 2, size.height / 2);
      setPaperUpdate(paperUpdateSet);
    }
  };

  const toggleFullScreen = () => {
    setFullView(!fullView);
  };

  const addTitleInPlayground = (data) => {
    const graphSet = graph;
    if (data.id) {
      const model = graphSet.getCell(data.id);
      if (model) {
        model.attributes.name = data.name;
        model.attributes.assetName = data.assetName;
        model.attributes.actionName = data.actionName;
        model.attributes.note = data.note;
        model.attr(
          '.label/text',
          data.name.length > 19
            ? `${data.name.substr(0, 19)}...`
            : data.name,
        );
        model.attr('.dName/text', data.assetName.length > 19 ? `${data.assetName.substr(0, 19)}...` : data.assetName);
        model.attr('.dDesc/text', data.actionName.length > 19 ? `${data.actionName.substr(0, 19)}...` : data.actionName);
        model.attr('.dNameTooltip/text', joint.util.breakText(data.assetName, { width: 400 }));
        model.attr('.dDescTooltip/text', joint.util.breakText(data.actionName, { width: 400 }));
      }
    } else {
      data.id = id.toString();
      data.name = 'Title';
      data.deviceName = 'Title';
      data.deviceToken = '';
      data.actionDesc = '';
      data.actionType = '';
      data.actionToken = id.toString();
      data.assetToken = '';
      data.permission = {};
      data.configrationStatus = true;
      data.isPlaybook = false;
      data.playbookToken = '';
      data.scriptarguments = {};
      data.displayArgument = {};
      data.nexttasks = {
        default: [],
      };
      data.starttask = {
        default: [],
      };
      data.view = {
        position: target,
        ports: { outPorts: ['out-0'], inPorts: ['in-0'] },
      };
      addNode(data);
      graph.addCells(rectNodeData);
      addLinkInGraph(lineId, source, {
        id: data.id,
        port: 'in-0',
      });
      graph.addCell(linkLineData);
      linkLineData.forEach((e) => {
        addCustomLinkIcon(e, paperUpdate);
      });
      setGraph(graph);
      linkLineData = [];
      rectNodeData = [];
    }
  };
  const linkUpdateData = (e, textData, source, target, type) => {
    const graphSet = graph;
    const link = new joint.dia.Link({
      source,
      target,
      router: { name: 'metro' },
      connector: { name: 'rounded', args: { type: ' gap' } },
      attrs: {
        '.marker-target': {
          fill: '#4e8bff',
          d: 'M 10 0 L 0 5 L 10 10 z',
          stroke: '#4e8bff',
        },
        '.connection': { stroke: '#4e8bff', 'stroke-width': '2px' },
      },
      smooth: true,
      z: -1,
    });
    if (textData === 'if') {
      linkLabel(link, textData, '19px');
    } else if (textData === 'else') {
      linkLabel(link, textData, '40px');
    } else if (textData === 'else if') {
      linkLabel(link, textData, '50px');
    } else {
      linkLabel(link, textData, '60px');
    }
    if (type === 'add') {
      graph.getCell(e.id).remove();
    }
    graphSet.addCell(link);
    addCustomLinkIcon(link, paperUpdate);
  };

  const elseIfOnCondition22 = (addLinks, model, conition, sourcePort, textData) => {
    if (addLinks.length > 0) {
      addLinks.forEach((e) => {
        if (e.labels[0].attrs.text.text === conition) {
          linkUpdateData(e, textData, {
            id: model.id,
            port: sourcePort,
          }, e.target, 'delete');
        }
      });
    }
  };
  const addDecisionInPlayground = (data) => {
    const ports = [];
    for (let i = 0; i < Object.keys(data.scriptarguments).length; i += 1) {
      ports.push(`out-${i}`);
      if (Object.keys(data.scriptarguments).length === 1) {
        if (data.scriptarguments[i + 1].conditionType === 'if') {
          data.scriptarguments[i + 1].conditionPort = 'out-0';
        }
      } else if (Object.keys(data.scriptarguments).length === 2) {
        if (data.scriptarguments[i + 1].conditionType === 'if') {
          data.scriptarguments[i + 1].conditionPort = 'out-1';
        } else if (data.scriptarguments[i + 1].conditionType === 'else') {
          data.scriptarguments[i + 1].conditionPort = 'out-0';
        } else if (data.scriptarguments[i + 1].conditionType === 'else if') {
          data.scriptarguments[i + 1].conditionPort = 'out-0';
        }
      } else if (Object.keys(data.scriptarguments).length === 3) {
        if (data.scriptarguments[i + 1].conditionType === 'if') {
          data.scriptarguments[i + 1].conditionPort = 'out-1';
        } else if (data.scriptarguments[i + 1].conditionType === 'else') {
          data.scriptarguments[i + 1].conditionPort = 'out-2';
        } else if (data.scriptarguments[i + 1].conditionType === 'else if') {
          if (parseInt(data.scriptarguments[i + 1].condition) === 2) {
            data.scriptarguments[i + 1].conditionPort = 'out-0';
          } else if (parseInt(data.scriptarguments[i + 1].condition) === 3) {
            data.scriptarguments[i + 1].conditionPort = 'out-2';
          }
        }
      } else if (Object.keys(data.scriptarguments).length === 4) {
        if (data.scriptarguments[i + 1].conditionType === 'if') {
          data.scriptarguments[i + 1].conditionPort = 'out-1';
        } else if (data.scriptarguments[i + 1].conditionType === 'else') {
          data.scriptarguments[i + 1].conditionPort = 'out-2';
        } else if (data.scriptarguments[i + 1].conditionType === 'else if') {
          if (parseInt(data.scriptarguments[i + 1].condition) === 2) {
            data.scriptarguments[i + 1].conditionPort = 'out-3';
          } else if (parseInt(data.scriptarguments[i + 1].condition) === 3) {
            data.scriptarguments[i + 1].conditionPort = 'out-0';
          } else if (parseInt(data.scriptarguments[i + 1].condition) === 4) {
            data.scriptarguments[i + 1].conditionPort = 'out-2';
          }
        }
      } else if (Object.keys(data.scriptarguments).length === 5) {
        if (data.scriptarguments[i + 1].conditionType === 'if') {
          data.scriptarguments[i + 1].conditionPort = 'out-1';
        } else if (data.scriptarguments[i + 1].conditionType === 'else') {
          data.scriptarguments[i + 1].conditionPort = 'out-2';
        } else if (data.scriptarguments[i + 1].conditionType === 'else if') {
          if (parseInt(data.scriptarguments[i + 1].condition) === 2) {
            data.scriptarguments[i + 1].conditionPort = 'out-3';
          } else if (parseInt(data.scriptarguments[i + 1].condition) === 3) {
            data.scriptarguments[i + 1].conditionPort = 'out-0';
          } else if (parseInt(data.scriptarguments[i + 1].condition) === 4) {
            data.scriptarguments[i + 1].conditionPort = 'out-4';
          } else if (parseInt(data.scriptarguments[i + 1].condition) === 5) {
            data.scriptarguments[i + 1].conditionPort = 'out-2';
          }
        }
      }
    }
    if (data.id) {
      const model = graph.getCell(data.id);
      if (model) {
        model.set('outPorts', ports);
        model.attributes.scriptarguments = data.scriptarguments;
        model.attributes.note = data.note;
        model.attributes.fieldsData = data.fieldsData;
        model.attributes.valuesData = data.valuesData;
        const conditionDone = { id: 0, status: true };
        const conditionDone1 = { id: 0, status: true };
        const conditionDone2 = { id: 0, status: true };
        const conditionDone3 = { id: 0, status: true };
        const elseIfCon = { len: 0, status: true };
        for (let i = 0; i < Object.keys(model.attributes.scriptarguments).length; i += 1) {
          if (Object.keys(model.attributes.scriptarguments).length === 1 && ports.length === 1) {
            if (model.attributes.scriptarguments[i + 1].conditionType === 'if') {
              const ifLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'if');
              const out0Links = linksData[model.id].filter((l) => l.source.port === 'out-0');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-0';
              if (out0Links.length > 0) {
                out0Links.forEach((r) => {
                  graph.getCell(r.id).remove();
                });
              }
              ports.forEach((p) => {
                if (p === 'out-0') {
                  if (ifLinks.length > 0) {
                    ifLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'if') {
                        linkUpdateData(e, 'if', {
                          id: model.id,
                          port: 'out-0',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            }
          } else if (Object.keys(model.attributes.scriptarguments).length === 2 && ports.length === 2) {
            if (model.attributes.scriptarguments[i + 1].conditionType === 'if') {
              const ifLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'if');
              const out1Links = linksData[model.id].filter((l) => l.source.port === 'out-1');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-1';
              if (out1Links.length > 0) {
                out1Links.forEach((r) => {
                  graph.getCell(r.id).remove();
                });
              }
              ports.forEach((p) => {
                if (p === 'out-1') {
                  if (ifLinks.length > 0) {
                    ifLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'if') {
                        linkUpdateData(e, 'if', {
                          id: model.id,
                          port: 'out-1',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else') {
              const elseLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else');
              if (elseIfCon.status) {
                const out0Links = linksData[model.id].filter((l) => l.source.port === 'out-0');
                model.attributes.scriptarguments[i + 1].conditionPort = 'out-0';
                if (out0Links.length > 0) {
                  out0Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
              }
              ports.forEach((p) => {
                if (p === 'out-0') {
                  if (elseLinks.length > 0) {
                    elseLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'else') {
                        linkUpdateData(e, 'else', {
                          id: model.id,
                          port: 'out-0',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else if') {
              const elseIfLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if');
              const out0Links = linksData[model.id].filter((l) => l.source.port === 'out-0');
              const elseIf1 = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 1');
              const elseIf2 = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 2');
              const elseIf3 = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 3');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-0';
              if (elseIfCon.status) {
                if (out0Links.length > 0) {
                  out0Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                elseIfCon.status = false;
                elseIfCon.len = ports.length;
              }
              ports.forEach((p) => {
                for (let j = 0; j < Object.keys(conditonData[data.id]).length; j += 1) {
                  if (conditonData[data.id][j + 1].uniqueValue === model.attributes.scriptarguments[i + 1].uniqueValue) {
                    if (p === 'out-0' && conditionDone.status) {
                      if (conditonData[data.id][j + 1].condition === '2') {
                        elseIfOnCondition22(elseIfLinks, model, 'else if', 'out-0', 'else if');
                        conditionDone.id = 2;
                        conditionDone.status = false;
                      } else if (conditonData[data.id][j + 1].condition === '3') {
                        elseIfOnCondition22(elseIf1, model, 'else if 1', 'out-0', 'else if');
                        conditionDone.id = 3;
                        conditionDone.status = false;
                      } else if (conditonData[data.id][j + 1].condition === '4') {
                        elseIfOnCondition22(elseIf2, model, 'else if 2', 'out-0', 'else if');
                        conditionDone.id = 4;
                        conditionDone.status = false;
                      } else if (conditonData[data.id][j + 1].condition === '5') {
                        elseIfOnCondition22(elseIf3, model, 'else if 3', 'out-0', 'else if');
                        conditionDone.id = 5;
                        conditionDone.status = false;
                      }
                    }
                  }
                }
              });
            }
          } else if (Object.keys(model.attributes.scriptarguments).length === 3 && ports.length === 3) {
            if (model.attributes.scriptarguments[i + 1].conditionType === 'if') {
              const ifLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'if');
              const out1Links = linksData[model.id].filter((l) => l.source.port === 'out-1');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-1';
              if (out1Links.length > 0) {
                out1Links.forEach((r) => {
                  graph.getCell(r.id).remove();
                });
              }
              ports.forEach((p) => {
                if (p === 'out-1') {
                  if (ifLinks.length > 0) {
                    ifLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'if') {
                        linkUpdateData(e, 'if', {
                          id: model.id,
                          port: 'out-1',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else') {
              const elseLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-2';
              if (elseIfCon.status) {
                const out2Links = linksData[model.id].filter((l) => l.source.port === 'out-2');
                if (out2Links.length > 0) {
                  out2Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
              }
              ports.forEach((p) => {
                if (p === 'out-2') {
                  if (elseLinks.length > 0) {
                    elseLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'else') {
                        linkUpdateData(e, 'else', {
                          id: model.id,
                          port: 'out-2',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else if') {
              const elseIfLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if');
              const elseIf1Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 1');
              const elseIf2Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 2');
              const elseIf3Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 3');
              const out0Links = linksData[model.id].filter((l) => l.source.port === 'out-0');
              const out2Links = linksData[model.id].filter((l) => l.source.port === 'out-2');
              if (parseInt(data.scriptarguments[i + 1].condition) === 2) {
                data.scriptarguments[i + 1].conditionPort = 'out-0';
              } else if (parseInt(data.scriptarguments[i + 1].condition) === 3) {
                data.scriptarguments[i + 1].conditionPort = 'out-2';
              }
              if (elseIfCon.status) {
                if (out0Links.length > 0) {
                  out0Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                if (out2Links.length > 0) {
                  out2Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                elseIfCon.status = false;
                elseIfCon.len = ports.length;
              }

              ports.forEach((p) => {
                  for (let j = 0; j < Object.keys(conditonData[data.id]).length; j += 1) {
                  if (conditonData[data.id][j + 1].uniqueValue === model.attributes.scriptarguments[i + 1].uniqueValue) {
                    if (p === 'out-0' && conditionDone.status === true) {
                      if (conditonData[data.id][j + 1].condition === '2') {
                        elseIfOnCondition22(elseIfLinks, model, 'else if', 'out-0', 'else if');
                        conditionDone.id = 2;
                        conditionDone.status = false;
                      } else if (conditonData[data.id][j + 1].condition === '3') {
                        elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-0', 'else if');
                        conditionDone.id = 3;
                        conditionDone.status = false;
                      } else if (conditonData[data.id][j + 1].condition === '4') {
                        elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-0', 'else if');
                        conditionDone.id = 4;
                        conditionDone.status = false;
                      } else if (conditonData[data.id][j + 1].condition === '5') {
                        elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-0', 'else if');
                        conditionDone.id = 5;
                        conditionDone.status = false;
                      }
                    } else if (p === 'out-2' && conditionDone1.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      const parentConditionId = conditionDone.id;
                      if (newConditionId > parentConditionId) {
                        if (newConditionId === 3) {
                          elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-2', 'else if');
                          conditionDone1.status = false;
                          conditionDone1.id = 3;
                        } else if (newConditionId === 4) {
                          elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-2', 'else if');
                          conditionDone1.status = false;
                          conditionDone1.id = 4;
                        } else if (newConditionId === 5) {
                          elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-2', 'else if');
                          conditionDone1.status = false;
                          conditionDone1.id = 5;
                        }
                      }
                    }
                  }
                }
              });
            }
          } else if (Object.keys(model.attributes.scriptarguments).length === 4 && ports.length === 4) {
            if (model.attributes.scriptarguments[i + 1].conditionType === 'if') {
              const ifLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'if');
              const out1Links = linksData[model.id].filter((l) => l.source.port === 'out-1');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-1';
              if (out1Links.length > 0) {
                out1Links.forEach((r) => {
                  graph.getCell(r.id).remove();
                });
              }
              ports.forEach((p) => {
                if (p === 'out-1') {
                  if (ifLinks.length > 0) {
                    ifLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'if') {
                        linkUpdateData(e, 'if', {
                          id: model.id,
                          port: 'out-1',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else') {
              const elseLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else');
              const out2Links = linksData[model.id].filter((l) => l.source.port === 'out-2');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-2';
              if (elseIfCon.status) {
                if (out2Links.length > 0) {
                  out2Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
              }
              ports.forEach((p) => {
                if (p === 'out-2') {
                  if (elseLinks.length > 0) {
                    elseLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'else') {
                        linkUpdateData(e, 'else', {
                          id: model.id,
                          port: 'out-2',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else if') {
              const elseIfLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if');
              const elseIf1Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 1');
              const elseIf2Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 2');
              const elseIf3Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 3');
              const out0Links = linksData[model.id].filter((l) => l.source.port === 'out-0');
              const out2Links = linksData[model.id].filter((l) => l.source.port === 'out-2');
              const out3Links = linksData[model.id].filter((l) => l.source.port === 'out-3');
              if (parseInt(data.scriptarguments[i + 1].condition) === 2) {
                data.scriptarguments[i + 1].conditionPort = 'out-3';
              } else if (parseInt(data.scriptarguments[i + 1].condition) === 3) {
                data.scriptarguments[i + 1].conditionPort = 'out-0';
              } else if (parseInt(data.scriptarguments[i + 1].condition) === 4) {
                data.scriptarguments[i + 1].conditionPort = 'out-2';
              }
              if (elseIfCon.status) {
                if (out3Links.length > 0) {
                  out3Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                if (out0Links.length > 0) {
                  out0Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                if (out2Links.length > 0) {
                  out2Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                elseIfCon.status = false;
                elseIfCon.len = ports.length;
              }

              ports.forEach((p) => {
                for (let j = 0; j < Object.keys(conditonData[data.id]).length; j += 1) {
                  if (conditonData[data.id][j + 1].uniqueValue === model.attributes.scriptarguments[i + 1].uniqueValue) {
                    if (p === 'out-0' && conditionDone.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      if (newConditionId === 2) {
                        elseIfOnCondition22(elseIfLinks, model, 'else if', 'out-3', 'else if');
                        conditionDone.id = 2;
                        conditionDone.status = false;
                      } else if (newConditionId === 3) {
                        elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-3', 'else if');
                        conditionDone.id = 3;
                        conditionDone.status = false;
                      } else if (newConditionId === 4) {
                        elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-3', 'else if');
                        conditionDone.id = 4;
                        conditionDone.status = false;
                      } else if (newConditionId === 5) {
                        elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-3', 'else if');
                        conditionDone.id = 5;
                        conditionDone.status = false;
                      }
                    } else if (p === 'out-2' && conditionDone1.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      const parentConditionId = conditionDone.id;
                      if (newConditionId > parentConditionId) {
                        if (newConditionId === 3) {
                          if (i + 1 === 4) {
                            elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-2', 'else if 2');
                          } else {
                            elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-0', 'else if 1');
                          }
                          conditionDone1.status = false;
                          conditionDone1.id = 3;
                        } else if (newConditionId === 4) {
                          if (i + 1 === 4) {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-2', 'else if 2');
                          } else {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-0', 'else if 1');
                          }
                          conditionDone1.status = false;
                          conditionDone1.id = 4;
                        } else if (newConditionId === 5) {
                          elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-0', 'else if 1');
                          conditionDone1.status = false;
                          conditionDone1.id = 5;
                        }
                      }
                    } else if (p === 'out-3' && conditionDone2.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      const parentConditionId = conditionDone1.id;
                      if (newConditionId > parentConditionId) {
                        if (newConditionId === 4) {
                          if (i + 1 === 2) {
                            elseIfOnCondition22([], model, 'else if 2', 'out-2', 'else if 2');
                          } else {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-2', 'else if 2');
                          }
                          conditionDone2.status = false;
                          conditionDone2.id = 4;
                        } else if (newConditionId === 5) {
                          elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-2', 'else if 2');
                          conditionDone2.status = false;
                          conditionDone2.id = 5;
                        }
                      }
                    }
                  }
                }
              });
            }
          } else if (Object.keys(model.attributes.scriptarguments).length === 5 && ports.length === 5) {
            if (model.attributes.scriptarguments[i + 1].conditionType === 'if') {
              const ifLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'if');
              const out1Links = linksData[model.id].filter((l) => l.source.port === 'out-1');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-1';
              if (out1Links.length > 0) {
                out1Links.forEach((r) => {
                  graph.getCell(r.id).remove();
                });
              }
              ports.forEach((p) => {
                if (p === 'out-1') {
                  if (ifLinks.length > 0) {
                    ifLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'if') {
                        linkUpdateData(e, 'if', {
                          id: model.id,
                          port: 'out-1',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else') {
              const elseLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else');
              const out2Links = linksData[model.id].filter((l) => l.source.port === 'out-2');
              model.attributes.scriptarguments[i + 1].conditionPort = 'out-2';
              if (elseIfCon.status) {
                if (out2Links.length > 0) {
                  out2Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
              }
              ports.forEach((p) => {
                if (p === 'out-2') {
                  if (elseLinks.length > 0) {
                    elseLinks.forEach((e) => {
                      if (e.labels[0].attrs.text.text === 'else') {
                        linkUpdateData(e, 'else', {
                          id: model.id,
                          port: 'out-2',
                        }, e.target, 'delete');
                      }
                    });
                  }
                }
              });
            } else if (model.attributes.scriptarguments[i + 1].conditionType === 'else if') {
              const elseIfLinks = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if');
              const elseIf1Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 1');
              const elseIf2Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 2');
              const elseIf3Links = linksData[model.id].filter((l) => l.labels[0].attrs.text.text === 'else if 3');
              const out0Links = linksData[model.id].filter((l) => l.source.port === 'out-0');
              const out2Links = linksData[model.id].filter((l) => l.source.port === 'out-2');
              const out3Links = linksData[model.id].filter((l) => l.source.port === 'out-3');
              const out4Links = linksData[model.id].filter((l) => l.source.port === 'out-4');

              if (parseInt(data.scriptarguments[i + 1].condition) === 2) {
                data.scriptarguments[i + 1].conditionPort = 'out-3';
              } else if (parseInt(data.scriptarguments[i + 1].condition) === 3) {
                data.scriptarguments[i + 1].conditionPort = 'out-0';
              } else if (parseInt(data.scriptarguments[i + 1].condition) === 4) {
                data.scriptarguments[i + 1].conditionPort = 'out-4';
              } else if (parseInt(data.scriptarguments[i + 1].condition) === 5) {
                data.scriptarguments[i + 1].conditionPort = 'out-2';
              }

              if (elseIfCon.status) {
                if (out3Links.length > 0) {
                  out3Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                if (out0Links.length > 0) {
                  out0Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                if (out4Links.length > 0) {
                  out4Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                if (out2Links.length > 0) {
                  out2Links.forEach((r) => {
                    graph.getCell(r.id).remove();
                  });
                }
                elseIfCon.status = false;
                elseIfCon.len = ports.length;
              }

              ports.forEach((p) => {
                for (let j = 0; j < Object.keys(conditonData[data.id]).length; j += 1) {
                  if (conditonData[data.id][j + 1].uniqueValue === model.attributes.scriptarguments[i + 1].uniqueValue) {
                    if (p === 'out-0' && conditionDone.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      if (newConditionId === 2) {
                        elseIfOnCondition22(elseIfLinks, model, 'else if', 'out-3', 'else if');
                        conditionDone.id = 2;
                        conditionDone.status = false;
                      } else if (newConditionId === 3) {
                        elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-3', 'else if');
                        conditionDone.id = 3;
                        conditionDone.status = false;
                      } else if (newConditionId === 4) {
                        elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-3', 'else if');
                        conditionDone.id = 4;
                        conditionDone.status = false;
                      } else if (newConditionId === 5) {
                        elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-3', 'else if');
                        conditionDone.id = 5;
                        conditionDone.status = false;
                      }
                    } else if (p === 'out-2' && conditionDone1.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      const parentConditionId = conditionDone.id;
                      if (newConditionId > parentConditionId) {
                        if (newConditionId === 3) {
                          if (i + 1 === 4) {
                            elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-4', 'else if 2');
                          } else if (i + 1 === 5) {
                            elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-2', 'else if 3');
                          } else {
                            elseIfOnCondition22(elseIf1Links, model, 'else if 1', 'out-0', 'else if 1');
                          }
                          conditionDone1.status = false;
                          conditionDone1.id = 3;
                        } else if (newConditionId === 4) {
                          if (i + 1 === 4) {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-4', 'else if 2');
                          } else if (i + 1 === 5) {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-2', 'else if 3');
                          } else {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-0', 'else if 1');
                          }
                          conditionDone1.status = false;
                          conditionDone1.id = 4;
                        } else if (newConditionId === 5) {
                          if (i + 1 === 4) {
                            elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-4', 'else if 2');
                          } else if (i + 1 === 5) {
                            elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-2', 'else if 3');
                          } else {
                            elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-0', 'else if 1');
                          }
                          conditionDone1.status = false;
                          conditionDone1.id = 5;
                        }
                      }
                    } else if (p === 'out-3' && conditionDone2.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      const parentConditionId = conditionDone1.id;
                      if (newConditionId > parentConditionId) {
                        if (newConditionId === 4) {
                          if (i + 1 === 5) {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-2', 'else if 3');
                          } else {
                            elseIfOnCondition22(elseIf2Links, model, 'else if 2', 'out-4', 'else if 2');
                          }
                          conditionDone2.status = false;
                          conditionDone2.id = 4;
                        } else if (newConditionId === 5) {
                          if (i + 1 === 2 || i + 1 === 3) {
                            elseIfOnCondition22([], model, 'else if 3', 'out-2', 'else if 2');
                          } else if (i + 1 === 5) {
                            elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-2', 'else if 3');
                          } else {
                            elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-4', 'else if 2');
                          }
                          conditionDone2.status = false;
                          conditionDone2.id = 5;
                        }
                      }
                    } else if (p === 'out-4' && conditionDone3.status === true) {
                      const newConditionId = parseInt(conditonData[data.id][j + 1].condition);
                      const parentConditionId = conditionDone2.id;
                      if (newConditionId > parentConditionId) {
                        if (newConditionId === 5) {
                          if (i + 1 === 2 || i + 1 === 3 || i + 1 === 4) {
                            elseIfOnCondition22([], model, 'else if 3', 'out-2', 'else if 3');
                          } else {
                            elseIfOnCondition22(elseIf3Links, model, 'else if 3', 'out-2', 'else if 3');
                          }
                          conditionDone3.status = false;
                          conditionDone3.id = 5;
                        }
                      }
                    }
                  }
                }
              });
            }
          }
        }
        model.attr('.taskNotInField/style', 'display: none; cursor: pointer;');
      }
    } else {
      const tData = {
        type: 'conditional',
        id: id.toString(),
        name: id.toString(),
        actionDesc: 'Conditional task',
        deviceName: 'Conditional',
        // dDesc: '',
        actionToken: `conditional${id}`,
        actionName: '',
        actionType: '',
        assetName: '',
        assetToken: '',
        deviceToken: '',
        permission: {},
        isPlaybook: false,
        playbookToken: '',
        configrationStatus: data.configrationStatus,
        scriptarguments: data.scriptarguments,
        fieldsData: data.fieldsData,
        valuesData: data.valuesData,
        note: data.note,
        nexttasks: {
          default: [],
        },
        starttask: {
          default: [],
        },
        view: {
          position: target,
          ports: { outPorts: ports, inPorts: ['in-0'] },
        },
      };
      addNode(tData);
      graph.addCell(rectNodeData);
      addLinkInGraph(lineId, source, {
        id: tData.id,
        port: 'in-0',
      });
      graph.addCell(linkLineData);
      linkLineData.forEach((e) => {
        addCustomLinkIcon(e, paperUpdate);
      });
      setGraph(graph);
      linkLineData = [];
      rectNodeData = [];
    }
  };
  const addPlaybookInPlayground = (data) => {
    const graphSet = graph;
    if (data.id) {
      const model = graphSet.getCell(data.id);
      if (model) {
        model.attributes.assetName = data.assetName;
        model.attributes.actionToken = data.actionToken;
        model.attributes.playbookToken = data.actionToken;
        model.attributes.note = data.note;
        model.attributes.scriptarguments = data.scriptarguments;
        model.attr(
          '.label/text',
          data.name.length > 19
            ? `${data.name.substr(0, 19)}...`
            : data.name,
        );
        model.attr('.dName/text', data.assetName.length > 19
          ? `${data.assetName.substr(0, 19)}...` : data.assetName);
        model.attr('.dNameTooltip/text', joint.util.breakText(data.assetName, { width: 400 }));
      }
    } else {
      const actionData = {
        type: 'playbook',
        id: id.toString(),
        name: 'Playbook',
        description: 'Playbook task',
        deviceName: 'Playbook',
        // dDesc: '',
        actionName: '',
        actionDesc: '',
        actionType: '',
        actionToken: data.actionToken,
        configrationStatus: data.configrationStatus,
        assetName: data.assetName,
        assetToken: '',
        deviceToken: '',
        permission: {},
        isPlaybook: data.isPlaybook,
        playbookToken: data.playbookToken,
        scriptarguments: data.scriptarguments,
        note: {},
        validate: false,
        nexttasks: {
          default: [],
        },
        starttask: {
          default: [],
        },
        view: {
          position: target,
          ports: { outPorts: ['out-0'], inPorts: ['in-0'] },
        },
      };

      addNode(actionData);
      graph.addCells(rectNodeData);
      addLinkInGraph(lineId, source, { id: actionData.id, port: 'in-0' });
      graph.addCell(linkLineData);
      linkLineData.forEach((e) => {
        addCustomLinkIcon(e, paperUpdate);
      });
      setGraph(graph);
      linkLineData = [];
      rectNodeData = [];
    }
  };
  const addApiInPlayground = (data) => {
    if (data.id) {
      const model = graph.getCell(data.id);
      if (model && model.attributes.type === 'api') {
        model.attr(
          '.label/text',
          data.name.length > 19
            ? `${data.name.substr(0, 19)}...`
            : data.name,
        );
        model.attr(
          '.dDesc/text',
          data.actionName.length > 19
            ? `${data.actionName.substr(0, 19)}...`
            : data.actionName,
        );
        model.attr('.dNameTooltip/text', joint.util.breakText(data.assetName, { width: 400 }));
        model.attr('.dDescTooltip/text', joint.util.breakText(data.actionName, { width: 400 }));
        model.attributes.actionName = data.actionName;
        model.actionDisplayName = data.actionDisplayName;
        model.attributes.description = data.description;
        model.attributes.scriptarguments = data.scriptarguments;
        model.attributes.displayArgument = data.displayArgument;
        model.attributes.actionToken = data.actionToken;
        model.attributes.configrationStatus = true;
        model.attributes.fieldsData = data.fieldsData;
        model.attributes.valuesData = data.valuesData;
        model.attributes.note = data.note;
        model.attr('.taskNotInField/style', 'display: none; cursor: pointer;');
      }
    } else {
      const listOfActionToken = {
        taskId: data.id ? data.id : id.toString(),
        actionToken: data.actionToken,
        displayName: data.deviceName,
      };
      const result = actionTokenList.reduce((r, a) => {
        r[a.actionToken] = r[a.actionToken] || [];
        r[a.actionToken].push(a);
        return r;
      }, {});
      if (Object.keys(result).length > 0) {
        const resultOfActionToken = result[listOfActionToken.actionToken];
        if (resultOfActionToken !== undefined) {
          const actionDeviceName = resultOfActionToken[resultOfActionToken.length - 1].displayName;
          const actionNameIndex = actionDeviceName.split('_');
          if (actionNameIndex.length > 1 && actionNameIndex[0] === listOfActionToken.displayName) {
            const displayName = `${listOfActionToken.displayName}_${parseInt(actionNameIndex[1]) + 1}`;
            listOfActionToken.displayName = displayName;
            setActionTokenList((pre) => [...pre, listOfActionToken]);
          } else if (actionDeviceName === listOfActionToken.displayName) {
            const displayName = `${listOfActionToken.displayName}_1`;
            listOfActionToken.displayName = displayName;
            setActionTokenList((pre) => [...pre, listOfActionToken]);
          }
        } else {
          setActionTokenList((pre) => [...pre, listOfActionToken]);
        }
      } else {
        setActionTokenList((pre) => [...pre, listOfActionToken]);
      }
      const actionData = {
        type: 'api',
        id: id.toString(),
        name: listOfActionToken.displayName,
        description: data.description,
        deviceName: listOfActionToken.displayName,
        fieldsData: data.fieldsData,
        actionDisplayName: data.actionDisplayName,
        valuesData: data.valuesData,
        actionName: data.actionName,
        actionToken: data.actionToken,
        actionDesc: data.actionDesc,
        actionType: '',
        deviceToken: data.deviceToken,
        // dDesc: '',
        assetName: '',
        assetToken: '',
        permission: {},
        isPlaybook: false,
        playbookToken: '',
        configrationStatus: true,
        scriptarguments: data.scriptarguments,
        displayArgument: data.displayArgument,
        note: {},
        nexttasks: {
          default: [],
        },
        starttask: {
          default: [],
        },
        view: {
          position: target,
          ports: { outPorts: ['out-0'], inPorts: ['in-0'] },
        },
      };
      addNode(actionData);
      graph.addCells(rectNodeData);
      addLinkInGraph(lineId, source, { id: actionData.id, port: 'in-0' });
      graph.addCell(linkLineData);
      linkLineData.forEach((e) => {
        addCustomLinkIcon(e, paperUpdate);
      });
      setGraph(graph);
      linkLineData = [];
      rectNodeData = [];
    }
  };
  const addActionInPlayground = (data) => {
    if (data.id) {
      const model = graph.getCell(data.id);
      if (model && model.attributes.type === 'action') {
        model.attr(
          '.label/text',
          data.name.length > 19
            ? `${data.name.substr(0, 19)}...`
            : data.name,
        );
        model.attr(
          '.dName/text',
          data.assetName.length > 19
            ? `${data.assetName.substr(0, 19)}...`
            : data.assetName,
        );
        model.attr(
          '.dDesc/text',
          data.actionName.length > 19
            ? `${data.actionName.substr(0, 19)}...`
            : data.actionName,
        );
        model.attr('.dNameTooltip/text', joint.util.breakText(data.assetName, { width: 400 }));
        model.attr('.dDescTooltip/text', joint.util.breakText(data.actionName, { width: 400 }));
        model.attributes.actionType = data.actionType;
        model.attributes.configrationStatus = data.configrationStatus;
        model.attributes.name = data.deviceName;
        model.attributes.actionDesc = data.actionDesc;
        model.attributes.deviceName = data.deviceName;
        model.attributes.assetName = data.assetName;
        model.attributes.actionName = data.actionName;
        model.attributes.fieldsData = data.fieldsData;
        model.attributes.valuesData = data.valuesData;
        model.attributes.actionToken = data.actionToken;
        model.attributes.assetToken = data.assetToken;
        model.attributes.deviceToken = data.deviceToken;
        model.attributes.permission = data.permission;
        model.attributes.isPlaybook = data.isPlaybook;
        model.attributes.playbookToken = data.playbookToken;
        model.attributes.scriptarguments = data.scriptarguments;
        model.attributes.displayArgument = data.displayArgument;
        model.attributes.note = data.note;
        model.attr('.taskNotInField/style', 'display: none; cursor: pointer;');
      }
    } else {
      const listOfActionToken = {
        taskId: data.id ? data.id : id.toString(),
        actionToken: data.actionToken,
        displayName: data.deviceName,
      };
      const result = actionTokenList.reduce((r, a) => {
        r[a.actionToken] = r[a.actionToken] || [];
        r[a.actionToken].push(a);
        return r;
      }, {});
      if (Object.keys(result).length > 0) {
        const resultOfActionToken = result[listOfActionToken.actionToken];
        if (resultOfActionToken !== undefined) {
          const actionDeviceName = resultOfActionToken[resultOfActionToken.length - 1].displayName;
          const actionNameIndex = actionDeviceName.split('_');
          if (actionNameIndex.length > 1 && actionNameIndex[0] === listOfActionToken.displayName) {
            const displayName = `${listOfActionToken.displayName}_${parseInt(actionNameIndex[1]) + 1}`;
            listOfActionToken.displayName = displayName;
            setActionTokenList((pre) => [...pre, listOfActionToken]);
          } else if (actionDeviceName === listOfActionToken.displayName) {
            const displayName = `${listOfActionToken.displayName}_1`;
            listOfActionToken.displayName = displayName;
            setActionTokenList((pre) => [...pre, listOfActionToken]);
          }
        } else {
          setActionTokenList((pre) => [...pre, listOfActionToken]);
        }
      } else {
        setActionTokenList((pre) => [...pre, listOfActionToken]);
      }
      const actionData = {
        type: 'action',
        id: id.toString(),
        actionType: data.actionType,
        configrationStatus: data.configrationStatus,
        name: listOfActionToken.displayName,
        actionDesc: data.actionDesc,
        deviceName: listOfActionToken.displayName,
        fieldsData: data.fieldsData,
        valuesData: data.valuesData,
        assetName: data.assetName,
        actionName: data.actionName,
        actionToken: data.actionToken,
        assetToken: data.assetToken,
        deviceToken: data.deviceToken,
        permission: data.permission,
        isPlaybook: data.isPlaybook,
        playbookToken: data.playbookToken,
        scriptarguments: data.scriptarguments,
        displayArgument: data.displayArgument,
        note: {},
        nexttasks: {
          default: [],
        },
        starttask: {
          default: [],
        },
        view: {
          position: target,
          ports: { outPorts: ['out-0'], inPorts: ['in-0'] },
        },
      };

      addNode(actionData);
      graph.addCells(rectNodeData);
      addLinkInGraph(lineId, source, { id: actionData.id, port: 'in-0' });
      setFackId((pre) => pre);
      graph.addCell(linkLineData);
      linkLineData.forEach((e) => {
        addCustomLinkIcon(e, paperUpdate);
      });
      setGraph(graph);
      linkLineData = [];
      rectNodeData = [];
    }
  };
  const onChangeHandler = (e) => {
    setPlaybookVersion(e.target.value);
    setValueEdited(true);
    if (RegexList.versionOnly.test(e.target.value)) {
      setPlaybookISVersion(true);
      setErrorMsg('');
    } else if (e.target.value !== '') {
      setErrorMsg('Enter valid version.');
    }
  };
  if (home) {
    setHome(false);
  }
  if (localStorage.getItem('modulePermission') !== 'RW') {
    return (
      <NoData
        style={{
          height: '100%',
          width: '100%',
          position: 'fixed',
        }}
        message="You don't have permission to access this page"
      />
    );
  }

  return (
    <CreatePlayBookWrapper className={maskLoading ? 'paddingRemove' : 'fullScreen'}>
      {maskLoading
        && (
          <div className="splash-screen">
            <div className="logoCont" style={{ marginRight: '-10px' }}>
              <img style={{ height: '33px', width: '95px' }} alt="brandLogo" src={ekasaLogo} />
            </div>
            <svg
              width="100"
              className="loaderSvg"
              height="100"
              viewBox="0 0 80 80"
            >
              <polyline
                className="line-cornered stroke-still"
                points="0,0 80,0 80,80"
                strokeWidth="5"
                fill="none"
              />
              <polyline
                className="line-cornered stroke-still"
                points="0,0 0,80 80,80"
                strokeWidth="5"
                fill="none"
              />
              <polyline
                className="line-cornered stroke-animation"
                points="0,0 80,0 80,80"
                strokeWidth="5"
                fill="none"
              />
              <polyline
                className="line-cornered stroke-animation"
                points="0,0 0,80 80,80"
                strokeWidth="5"
                fill="none"
              />
            </svg>
          </div>
        )}
      {localStorage.getItem('modulePermission') === 'RW' && (
        <>
          <div className="topOptions">
            <div className="leftPart">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ width: '36%' }}>
                  <ZsInput
                    id="create_playbook_name"
                    inputtype="normal"
                    label="Playbook Name"
                    requiredentry
                    readOnly={saveType === 'preview'}
                    value={playbookName || null}
                    maxLength="normal"
                    placeholder="Enter playbook name"
                    onChange={(e) => { setPlaybookName(e.target.value); setValueEdited(true); }}
                    error={submitted && !playbookName}
                    errormsg="Playbook name is required."
                  />
                </div>
                <div style={{ width: '36%' }}>
                  <ZsInput
                    id="create_playbook_description"
                    inputtype="normal"
                    label="Description"
                    requiredentry
                    readOnly={saveType === 'preview'}
                    value={playbookDesc || null}
                    maxLength="normal"
                    placeholder="Enter playbook description"
                    onChange={(e) => { setPlaybookDesc(e.target.value); setValueEdited(true); }}
                    error={submitted && !playbookDesc}
                    errormsg="Playbook description is required."
                  />
                </div>
                <div style={{ width: '19%' }}>
                  <ZsInput
                    id="create_playbook_version"
                    inputtype="normal"
                    label="Version"
                    requiredentry
                    readOnly={saveType === 'preview'}
                    value={playbookVersion || null}
                    maxLength="normal"
                    placeholder="Enter playbook version"
                    onChange={(e) => onChangeHandler(e, 'version')}
                    error={submitted && errorMsg !== ''}
                    errormsg={errorMsg}
                  />
                </div>
              </div>
            </div>
            <div className="rightPart">
              {saveType !== 'preview' ? (
                <ZsButton
                  id="newPlaybook_saveBtn"
                  disabled={saveLoading || !valueEdited}
                  loading={saveLoading}
                  type="primary"
                  title={saveType === 'new' ? 'Save' : 'Update'}
                  onClick={() => savePlaybook()}
                />
              ) : null}
            </div>
          </div>
          <div
            className={fullView
              ? saveType === 'preview'
                ? 'playground previewMode fullScreen'
                : 'playground fullScreen'
              : saveType === 'preview'
                ? 'playground previewMode'
                : 'playground'}
          >
            <div className="backBtn">
              <Icons
                id="newPlaybook_resetZoomBtn"
                type="playbookResetBtn"
                className="resetZoomBtn"
                icontype="globle"
                onClick={() => resetZoom()}
              />
            </div>
            <div style={{ position: 'absolute' }} className="actionTab">
              <Icons
                id="newPlaybook_zoomInBtn"
                type="zoomIn"
                icontype="globle"
                className="zoomInBtn"
                onClick={() => zoomPaper({ deltaY: +100 })}
              />
              <Icons
                id="newPlaybook_zoomOut"
                type="zoomOut"
                className="zoomInBtn"
                icontype="globle"
                onClick={() => zoomPaper({ deltaY: -100 })}
              />
            </div>
            <div className="screenBtnDiv">
              <Icons
                id="newPlaybook_screenSizeBtn"
                type={fullView ? 'playbookFullScreen' : 'fullScreen1'}
                icontype="globle"
                className="screenSizeBtn"
                onClick={() => toggleFullScreen()}
              />
            </div>
            <BuilderWrapper
              id="pb-content"
              style={{ cursor }}
              onWheel={(e) => { zoomPaper(e); }}
            >
              <div id="paper-restrict" className="mainPaper" />
            </BuilderWrapper>
          </div>
        </>
      )}
      {updatePreviewModel && (
        <PlaybookUpdateAndDeletionModel
          playbookID={match.params.playbookId}
          modelType="Update"
          modelShow={updatePreviewModel}
          setModelShow={setUpdatePreviewModel}
          previewLoading={updatePreviewModelLoading}
          setPreviewModelLoading={setUpdatePreviewModelLoading}
          fakePlaybookAction={fakePlaybookAction}
          UpdatePlaybookActionAPI={UpdatePlaybookActionAPI}
          updateData={updateData}
          defaultScreen={2}
        />
      )}

      <AddTaskModal
        addTitleInPlayground={addTitleInPlayground}
        addDecisionInPlayground={addDecisionInPlayground}
        addPlaybookInPlayground={addPlaybookInPlayground}
        addApiInPlayground={addApiInPlayground}
        getAllListDataActionAPI={getAllListDataActionAPI}
        GetOwnerActionAPI={GetOwnerActionAPI}
        fakeIncidentActionAPI={fakeIncidentActionAPI}
        fakeListDataActionAPI={fakeListDataActionAPI}
        addActionInPlayground={addActionInPlayground}
        closeModal={closeModal}
        getAllConfiguredActionAPI={getAllConfiguredActionAPI}
        getActionsListAPI={getActionsListAPI}
        fakeActionAppsAPI={fakeActionAppsAPI}
        fakeActionIncidentActionAPI={fakeActionIncidentActionAPI}
        getActionsDeviceListAPI={getActionsDeviceListAPI}
        getActionTokenAPI={getActionTokenAPI}
        getListAssetAPI={getListAssetAPI}
        getActionsAPI={getActionsAPI}
        filedSuggestionList={filedSuggestionListFilterd}
        getByAppAPI={getByAppAPI}
        fakeActionPanelAPI={fakeActionPanelAPI}
        fetchFieldsForDetailsAPI={fetchFieldsForDetailsAPI}
        ekashaAPIGetActionAPI={ekashaAPIGetActionAPI}
        fakePlaybookActionAPI={fakePlaybookActionAPI}
        getNewAllPlaybookBlockActionAPI={getNewAllPlaybookBlockActionAPI}
        GetApprovalDataActionAPI={GetApprovalDataActionAPI}
        setSelectBox={setSelectBox}
        setValueEdited={setValueEdited}
        taskDrawerOpen={taskDrawerOpen}
        setTaskDrawerOpen={setTaskDrawerOpen}
        match={match}
        {...props}
      />
    </CreatePlayBookWrapper>
  );
});
NewPlaybook.propTypes = {
  match: PropTypes.oneOfType([PropTypes.any]),
};

NewPlaybook.defaultProps = {
  match: {},
};
export default NewPlaybook;
