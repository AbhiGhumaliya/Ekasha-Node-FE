/* eslint-disable no-shadow */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as joint from 'jointjs/index';
import $ from 'jquery';
import moment from 'moment';
import { IncidentPreviewPlaybookAction, fakeIncidentPlaybookAction } from '../../../../../../../apis/incidents/subModule/Playbook/Playbook.action';
import Icons from '../../../../../../../components/icons';
import { ZsSpin } from '../../../../../../../components/Spin';
import ZsTooltip from '../../../../../../../components/tooltip';
import {
  actionN, conditionN, endN, otherTaskN, playbookN, startN, successIcn, titleN,
} from '../../../../../playbook/lib/playbookTaskIcons';
import { BuilderWrapper, IncidentPreviewPlaybookWrapper } from '../style';
import {
  GetApprovalDataAction, editActionTask, editApiTask, editConditionTask, editTitleTask, fakePlaybookAction,
} from '../../../../../../../apis/playbook/playbook.actions';
import PlaybookPreviewTaskModel from './playbookPreviewTaskModel';
import PlaybookPreviewDecision from './playbookPreviewDecision';
import { convertTimeBaseTimeZoneFunction, handleStorageChange } from '../../../../../../../helpers/lib/StorageHandlers';
import PlaybookPreviewNote from './playbookPreviewNote';
import PlaybookUserPermissionList from './playbookUserPermissionList';
import EkashaDropdown from '../../../../../../../components/drop_down';
import PlaybookPreviewTitle from './playbookPreviewTitle';

const PreviewPlaybookTab = React.memo((props) => {
  const { match } = props;
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewStatus, setPreviewStatus] = useState(false);
  const [previewData, setPreviewData] = useState(false);
  const [refreshLoad, setRefreshLoad] = useState(false);
  const [actionModel, setActionModel] = useState(false);
  const [actionResult, setActionResult] = useState([]);
  const [noteModel, setNoteModel] = useState(false);
  const [titleModel, setTitleModel] = useState(false);
  const [titleData, setTitleData] = useState({});
  const [noteData, setNoteData] = useState({});
  const [userPermissionModel, setUserPermissionModel] = useState(false);
  const [view, setView] = useState(false);

  // Preview State
  const [id, setId] = useState(1);
  const [graph, setGraph] = useState(new joint.dia.Graph());
  const [zoom, setZoom] = useState(0.9);
  const [cursor, setCursor] = useState('grab');
  const [paperUpdate, setPaperUpdate] = useState();
  const [taskIds, setTaskIds] = useState({ id: '', status: false });
  const saveType = 'preview';

  let lineLinkData = [];

  const dispatch = useDispatch();
  const IncidentPreviewPlaybookActionAPI = (param) => dispatch(IncidentPreviewPlaybookAction(param));
  const editActionTaskAPI = (param) => dispatch(editActionTask(param));
  const editEkashaApiTaskAPI = (param) => dispatch(editApiTask(param));
  const editConditionTaskAPI = (param) => dispatch(editConditionTask(param));
  const GetApprovalDataActionAPI = (param) => dispatch(GetApprovalDataAction(param));
  const editTitleTaskAPI = (param) => dispatch(editTitleTask(param));
  const fakePlaybookActionAPI = (param) => dispatch(fakePlaybookAction(param));

  const IncPreviewPlaybookRes = useSelector(
    (state) => (state.IncidentPlaybook.IncPreviewPlaybookResponse || {}),
  );

  const EditActionTask = useSelector(
    (state) => (state.PlayBook.EditActionTask || {}),
  );
  const EditApiTask = useSelector(
    (state) => (state.PlayBook.EditApiTask || {}),
  );
  const EditTitleTask = useSelector(
    (state) => (state.PlayBook.EditTitleTask || {}),
  );

  const calculateDuration = (start, executeTime) => {
    const created = moment(new Date(start));
    const expectedEnd = moment(new Date(executeTime));
    const total = expectedEnd.diff(created);
    if (total > 86400000) {
      return `${Math.floor((total / (1000 * 60 * 60 * 24)).toString())} Day`;
    }
    if (total > 3600000) {
      return `${Math.floor((total / (1000 * 60 * 60)).toString())} Hr.`;
    }
    if (total > 60000) {
      return `${Math.floor((total / (1000 * 60)).toString()).toString()} Min.`;
    }
    if (Math.floor((total / 1000)) > 0) {
      return `${Math.floor((total / 1000).toString())} Sec.`;
    }
    return '0 Sec.';
  };

  useEffect(() => {
    if (EditActionTask && EditActionTask.type === 'EDIT_ACTION_TASK') {
      if (EditActionTask?.payload?.data?.actionResult && !EditActionTask.payload.addNotes && !EditActionTask.payload.userPermission) {
        setActionResult(EditActionTask?.payload?.data?.actionResult);
        setActionModel(true);
        if (noteModel) {
          setNoteModel(false);
        } else if (userPermissionModel) {
          setUserPermissionModel(false);
        }
      } else if (EditActionTask.payload.addNotes) {
        setNoteData(EditActionTask.payload.data.note);
        setNoteModel(true);
        if (actionModel) {
          setActionModel(false);
        } else if (userPermissionModel) {
          setUserPermissionModel(false);
        }
      } else if (EditActionTask.payload.userPermission) {
        GetApprovalDataActionAPI(EditActionTask.payload.data.assetToken);
        setUserPermissionModel(true);
        if (noteModel) {
          setNoteModel(false);
        } else if (actionModel) {
          setActionModel(false);
        }
      }
      //   fakePlaybookAction();
    }
  }, [EditActionTask]);

  useEffect(() => {
    if (EditApiTask && EditApiTask.type === 'EDIT_API_TASK') {
      if (EditApiTask?.payload?.data?.actionResult && !EditApiTask.payload.addNotes) {
        setActionResult(EditApiTask?.payload?.data?.actionResult);
        setActionModel(true);
        if (noteModel) {
          setNoteModel(false);
        }
      } else if (EditApiTask.payload.addNotes) {
        setNoteData(EditApiTask.payload.data.note);
        setNoteModel(true);
        if (actionModel) {
          setActionModel(false);
        }
      }
      //   fakePlaybookAction();
    }
  }, [EditApiTask]);
  useEffect(() => {
    if (EditTitleTask !== undefined && EditTitleTask.type === 'EDIT_TITLE_TASK') {
      if (EditTitleTask.payload.data && !EditTitleTask.payload.addNotes) {
        setTitleData(EditTitleTask.payload.data);
        setTitleModel(true);
      } else if (EditTitleTask.payload.addNotes) {
        setNoteData(EditTitleTask.payload.data.note);
        setNoteModel(true);
        if (titleModel) {
          setTitleModel(false);
        }
      }
      fakePlaybookActionAPI();
    }
  }, [EditTitleTask]);

  const refreshPreviewTask = () => {
    lineLinkData = [];
    const ApiData = {
      incidentId: match.params.incidentId,
      playbookId: match.params.playbookId,
      preRefToken: match.params.preRefToken,
      refToken: match.params.refToken,
      isNested: match.params.isNested,
      customerID: match.params.customerID,
    };
    IncidentPreviewPlaybookActionAPI(ApiData);
    setRefreshLoad(true);
  };
  useEffect(() => {
    refreshPreviewTask();
    setPreviewLoading(true);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', (e) => {
      handleStorageChange(e);
    });
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Preview Playbook

  const removeOutSideTool = (toolTipId, graph) => {
    if (!toolTipId.includes('infoIconTooltip') && !toolTipId.includes('actionDescTooltip') && !toolTipId.includes('actionNameTooltip')) {
      setTaskIds((pre) => {
        if (pre.status) {
          graph?.getCell(pre.id)?.attr('.infoTooltip/visibility', 'hidden');
          graph?.getCell(pre.id)?.attr('.infoTooltip/filter', 'none');
          graph?.getCell(pre.id)?.attr('.dNameTooltip/visibility', 'hidden');
          graph?.getCell(pre.id)?.attr('.dNameTooltip/filter', 'none');
          graph?.getCell(pre.id)?.attr('.dDescTooltip/visibility', 'hidden');
          graph?.getCell(pre.id)?.attr('.dDescTooltip/filter', 'none');
          pre.id = '';
          pre.status = false;
        }
        return pre;
      });
    }
    // window.removeEventListener('mousemove', null);
  };

  const boxClicked = (cellView, evt, mx, my) => {
    const tempObj = cellView.model.attributes;
    const graphSet = graph;
    const toolTipId = evt.target.nearestViewportElement.id;
    if (toolTipId !== null) {
      if (toolTipId.includes('infoIconTooltip') || toolTipId.includes('actionDescTooltip') || toolTipId.includes('actionNameTooltip')) {
        const tId = toolTipId.split('-')[1];
        setTaskIds((pre) => {
          pre.id = tId;
          pre.status = true;
          graph?.getCell(pre.id).attr('.infoTooltip/visibility', 'hidden');
          graph?.getCell(pre.id).attr('.infoTooltip/filter', 'none');
          graph?.getCell(pre.id).attr('.dNameTooltip/visibility', 'hidden');
          graph?.getCell(pre.id).attr('.dNameTooltip/filter', 'none');
          graph?.getCell(pre.id).attr('.dDescTooltip/visibility', 'hidden');
          graph?.getCell(pre.id).attr('.dDescTooltip/filter', 'none');
          setGraph(graph);
          return { ...pre };
        });
      }
      removeOutSideTool(toolTipId, graph);
    }

    if (tempObj.type !== 'start' && tempObj.type !== 'end') {
      const actionData = {
        type: tempObj.type,
        id: tempObj.id,
        actionType: tempObj.actionType,
        actionResult: tempObj.actionResult,
        configrationStatus: tempObj.configrationStatus,
        name: tempObj.deviceName,
        actionDesc: tempObj.actionDesc,
        deviceName: tempObj.deviceName,
        actionName: tempObj.actionName,
        assetName: tempObj.assetName,
        actionDisplayName: tempObj.actionDisplayName,
        actionToken: tempObj.actionToken,
        assetToken: tempObj.assetToken,
        deviceToken: tempObj.deviceToken,
        refToken: tempObj.refToken,
        result: tempObj.result,
        permission: tempObj.permission,
        isPlaybook: tempObj.isPlaybook,
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
          if (xCondNote && yCondNote) {
            sd.addNotes = true;
          }
          if (saveType === 'preview') {
            sd.preview = true;
          }
          editConditionTaskAPI(sd);
        }
      } else {
        const { x, y } = actionData.view.position;

        const xCondNote = mx - (x + 20) >= 0 && mx - (x + 20) < 21;
        const yCondNote = my - (y + 90) > 9 && my - (y + 90) < 29;

        const xCond = mx - (x + 150) >= 0 && mx - (x + 150) < 21;
        const yCond = my - (y + 90) > 9 && my - (y + 90) < 29;
        if (xCond && yCond && saveType !== 'preview') {
          cellView.model.remove();
        } else {
          if (xCondNote && yCondNote) {
            sd.addNotes = true;
          }
          if (saveType === 'preview') {
            sd.preview = true;
          }
          if (actionData.type === 'title') {
            editTitleTaskAPI(sd);
          } else if (actionData.type === 'playbook') {
            const url = `#/zeronsec/incident/playbook/preview/${localStorage.getItem('customerID')}/${match.params.incidentId}/${sd.data.playbookToken}/${match.params.preRefToken === 'null' ? match.params.refToken : match.params.preRefToken}/${actionData.refToken}/true`;
            window.open(url, url);
            // editPlaybookTaskAPI(sd);
          } else if (actionData.type === 'api') {
            editEkashaApiTaskAPI(sd);
          } else if (actionData.type === 'action') {
            const xCondUser = mx - (x + 60) >= 0 && mx - (x + 60) < 11;
            const yCondUser = my - (y + 100) >= 0 && my - (y + 100) < 21;
            if (xCondUser && yCondUser) {
              sd.userPermission = true;
            }
            editActionTaskAPI(sd);
          }
        }
      }
    }
  };

  const linkLabel = (link, textData, rectWidth) => {
    const linkColor = link.attr('.connection/stroke');
    const fillColor = linkColor || '#4e8bff'; // Default color if link color is not available
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
          fill: fillColor,
        },
        rect: {
          fill: 'black',
          stroke: fillColor,
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

  let paper;
  let isDragging;
  let dragStartPosition;
  let rectData = [];

  const initPaper = () => {
    const element = document.getElementById('paper-restrict');
    if (element && element.innerHTML !== '') {
      element.innerHTML = '';
    }
    paper = new joint.dia.Paper({
      el: document.getElementById('paper-restrict'),
      width: window.innerWidth,
      height: window.innerHeight,
      gridSize: 10,
      drawGrid: false,
      restrictTranslate: true,
      model: graph,
      snapLinks: { radius: 100 },
      perpendicularLinks: true,
      weight: 1,
      interactive: () => {
        if (saveType === 'preview') {
          return false;
        }
        return { vertexAdd: false };
      },
      defaultLink: new joint.dia.Link({
        router: { name: 'metro' },
        connector: { name: 'rounded', args: { type: ' gap' } },
        attrs: {
          '.marker-target': { fill: '#4e8bff', d: 'M 10 0 L 0 5 L 10 10 z', opacity: 1 }, // #70ff5e
          '.connection': { stroke: '#4e8bff', 'stroke-width': '0.2px' }, // #70ff5e
        },
        smooth: true,
        z: -1,
      }),
      validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
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
    });
    paper.on('cell:pointerclick', (cellView, evt, mx, my) => {
      cellView.getBBox();
      if (cellView && cellView.model.attributes.type !== 'link') {
        boxClicked(cellView, evt, mx, my);
      }
    });

    paper.on('cell:pointerup blank:pointerup', (cellView, x, y) => {
      isDragging = false;
      setCursor('grab');
      dragStartPosition = undefined;
    });

    graph?.on('change:source change:target', (link) => {
      if (link.get('source').id && link.get('target').id) {
        // both ends of the link are connected.
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
        paper.translate(e.offsetX - dragStartPosition.x, e.offsetY - dragStartPosition.y);
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
              graph?.getCell(pre.id)?.attr('.infoTooltip/visibility', 'visible');
              graph?.getCell(pre.id)?.attr('.infoTooltip/filter', 'url(#solid)');
              graph?.getCell(pre.id)?.attr('.dNameTooltip/visibility', 'hidden');
              graph?.getCell(pre.id)?.attr('.dNameTooltip/filter', 'none');
              graph?.getCell(pre.id)?.attr('.dDescTooltip/visibility', 'hidden');
              graph?.getCell(pre.id)?.attr('.dDescTooltip/filter', 'none');
              setGraph(graph);
              return { ...pre };
            });
          }
          if (toolTipId.includes('actionDescTooltip')) {
            const tId = toolTipId.split('-')[1];
            setTaskIds((pre) => {
              pre.id = tId;
              pre.status = true;
              if (graph?.getCell(pre.id)?.attributes.attrs['.dDesc'].text.includes('...')) {
                graph?.getCell(pre.id)?.attr('.dDescTooltip/visibility', 'visible');
                graph?.getCell(pre.id)?.attr('.dDescTooltip/filter', 'url(#solid)');
                graph?.getCell(pre.id)?.attr('.infoTooltip/visibility', 'hidden');
                graph?.getCell(pre.id)?.attr('.infoTooltip/filter', 'none');
                graph?.getCell(pre.id)?.attr('.dNameTooltip/visibility', 'hidden');
                graph?.getCell(pre.id)?.attr('.dNameTooltip/filter', 'none');
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
              if (graph?.getCell(pre.id)?.attributes.attrs['.dName'].text.includes('...')) {
                graph?.getCell(pre.id)?.attr('.dNameTooltip/visibility', 'visible');
                graph?.getCell(pre.id)?.attr('.dNameTooltip/filter', 'url(#solid)');
                graph?.getCell(pre.id)?.attr('.infoTooltip/visibility', 'hidden');
                graph?.getCell(pre.id)?.attr('.infoTooltip/filter', 'none');
                graph?.getCell(pre.id)?.attr('.dDescTooltip/visibility', 'hidden');
                graph?.getCell(pre.id)?.attr('.dDescTooltip/filter', 'none');
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
    mainDiv?.addEventListener('wheel', (e) => {
      e.preventDefault();
    });
  };

  const addNode = (task) => {
    let markup; let size; let dName = ''; let dDesc = ''; let ry = -25; let taskStatus = '#4e8bff'; let
      taskIcn = ''; let dNameTooltip = ''; let dDescTooltip = ''; let infoTooltip = '';
    if (task.type === 'api' || task.type === 'action') {
      Object.keys(previewData.tasks).forEach((element) => {
        previewData.tasks[element]?.actionResult?.forEach((element2) => {
          if (previewData.tasks[element].id === element2.taskId) {
            if (element2.status === 'Failed') {
              previewData.tasks[element].mainStatus = 'Failed';
            }
            if (element2.status === 'Success') {
              previewData.tasks[element].mainStatus = 'Success';
            }
          }
        });
        setPreviewData(previewData);
        const i = Object.keys(previewData.tasks).filter((e) => previewData.tasks[e].id === task.id);
        if (i.length > 0) {
          if (previewData.tasks[i[0]].mainStatus === 'Success') {
            taskStatus = '#84c255';
          } else if (previewData.tasks[i[0]].mainStatus === 'Failed') {
            taskStatus = '#f04848';
          }
        }
      });
    } else if (task.type === 'playbook') {
      if (task.status === 'Success') {
        taskStatus = '#84c255';
      } else if (task.status === 'Failed') {
        taskStatus = '#f04848';
      }
    } else if (task.type === 'conditional') {
      // Object.keys(previewData.tasks).forEach((element) => {
      //   const i = Object.keys(previewData.tasks).filter((e) => previewData.tasks[e].id === task.id);
      //   if (i?.length > 0) {
      //     if (previewData.tasks[i[0]]?.matched) {
      //       taskStatus = '#84c255';
      //     } else if (previewData.tasks[i[0]]?.matched === false) {
      //       taskStatus = '#ffff00';
      //     } else {
      //       taskStatus = '#4e8bff';
      //     }
      //   }
      // });
      // Object.keys(previewData.tasks).forEach((element) => {
      //   const dd = previewData.tasks[element]?.previousIDs?.filter((d) => d.matched === true);
      //   if (dd?.length > 0) {
      //     // previewData.tasks[dd[0]].mainStatus = 'Success';
      //   }
      // });
    } else if (task.type === 'start') {
      const i = Object.keys(previewData.tasks).filter((e) => previewData.tasks[e].id === task.id);
      if (i.length > 0) {
        if (previewData.tasks[i[0]].type === 'start') {
          taskStatus = '#84c255';
          taskIcn = successIcn;
        }
      }
    } else if (task.type === 'end') {
      const i = Object.keys(previewData.tasks).filter((e) => previewData.tasks[e].id === task.id);
      if (i.length > 0) {
        if (previewData.playbookStatus === 'Success') {
          if (previewData.tasks[i[0]].type === 'end') {
            taskStatus = '#84c255';
            taskIcn = successIcn;
          }
        }
      }
    }
    if (task.type === 'start' || task.type === 'end') {
      ry = 0;
      size = { width: 185, height: 80 };
      dDesc = task.actionDesc;
      if (task.type === 'end') {
        markup = `${startN()}`;
      } else {
        markup = `${endN()}`;
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
                fill: taskStatus,
                stroke: taskStatus,
                // opacity: 0.4,
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
                fill: taskStatus,
                stroke: taskStatus,
                // opacity: 0.4,
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
          fill: taskStatus,
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
          text: dName.length > 24 ? `${dName.substr(0, 24)}...` : dName,
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
          // fontVariant: 'small-caps'
        },
        '.infoTooltip': {
          text: joint.util.breakText(infoTooltip, { width: 400 }),
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontSize: 12,
          id: `tId${task.id}`,
          // fontVariant: 'small-caps'
        },
        '.dNameTooltip': {
          text: joint.util.breakText(dNameTooltip, { width: 400 }),
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontSize: 12,
          id: `tDnameId${task.id}`,
          // fontVariant: 'small-caps'
        },
        '.dDescTooltip': {
          text: joint.util.breakText(dDescTooltip, { width: 400 }),
          'font-family': 'Open Sans',
          fill: '#a8a8a8',
          fontSize: 12,
          id: `tDescId${task.id}`,
          // fontVariant: 'small-caps'
        },
      },
    });
    rectData.push(rectangle);
    // setGraph(graph);
    setId(id + 1);
  };

  const addCustomLinkIcon = (link, paper2) => {
    const taskAttr = graph?.getCell(link?.attributes.source.id)?.attributes;
    if (taskAttr?.type === 'conditional') {
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
        linkLabel(link, textData, '19px');
      } else if (textData === 'else') {
        linkLabel(link, textData, '40px');
      } else if (textData === 'else if') {
        linkLabel(link, textData, '50px');
      } else {
        linkLabel(link, textData, '60px');
      }
    }
  };

  const addLinkInGraph = (lineId, source, target, stat) => {
    const graphSet = graph;
    let taskStatus = '#4e8bff';
    const cellView = graphSet?.getCell(target.id);

    if (cellView) {
      // eslint-disable-next-line no-shadow
      const { type, id } = cellView.attributes;
      if (type === 'api' || type === 'action') {
        if (stat === 'Success') {
          taskStatus = '#84c255';
        } else if (stat === 'Failed') {
          taskStatus = '#f04848';
        }
      }
      if (type === 'playbook') {
        if (stat) {
          taskStatus = '#84c255';
        } else if (stat === false) {
          taskStatus = '#f04848';
        }
      }
      if (type === 'conditional') {
        if (stat) {
          $(`g[model-id=${id}][data-type="conditional"] circle[port="${target.port}"]`).css('fill', '#84c255');
          $(`g[model-id=${id}][data-type="conditional"] circle[port="${target.port}"]`).css('stroke', '#84c255');
          taskStatus = '#84c255';
        } else if (stat === false) {
          $(`g[model-id=${id}][data-type="conditional"] circle[port="${target.port}"]`).css('fill', '#d68a28');
          $(`g[model-id=${id}][data-type="conditional"] circle[port="${target.port}"]`).css('stroke', '#d68a28');
          taskStatus = '#d68a28';
        } else {
          $(`g[model-id=${id}][data-type="conditional"] circle[port="${target.port}"]`).css('fill', '#4e8bff');
          $(`g[model-id=${id}][data-type="conditional"] circle[port="${target.port}"]`).css('stroke', '#4e8bff');
          taskStatus = '#4e8bff';
        }
        const i = Object.keys(previewData.tasks).filter((d) => previewData.tasks[d].id === id);
        const filterCon = Object.keys(previewData.tasks[i[0]].scriptarguments).filter((d) => previewData.tasks[i[0]].scriptarguments[d].matched === false);
        if (i?.length > 0) {
          Object.keys(previewData.tasks[i[0]].scriptarguments).forEach((element) => {
            if (previewData.tasks[i[0]].scriptarguments[element].matched === true) {
              $(`g[model-id=${id}][data-type="conditional"] circle[port="${previewData.tasks[i[0]].scriptarguments[element].conditionPort}"]`).css('fill', '#84c255');
              $(`g[model-id=${id}][data-type="conditional"] circle[port="${previewData.tasks[i[0]].scriptarguments[element].conditionPort}"]`).css('stroke', '#84c255');
            } else if (filterCon?.length !== 0 && filterCon.length === Object.keys(previewData.tasks[i[0]].scriptarguments).length) {
              $(`g[model-id=${id}][data-type="conditional"] circle[port="${previewData.tasks[i[0]].scriptarguments[element].conditionPort}"]`).css('fill', '#d68a28');
              $(`g[model-id=${id}][data-type="conditional"] circle[port="${previewData.tasks[i[0]].scriptarguments[element].conditionPort}"]`).css('stroke', '#d68a28');
            } else {
              $(`g[model-id=${id}][data-type="conditional"] circle[port="${previewData.tasks[i[0]].scriptarguments[element].conditionPort}"]`).css('fill', '#4e8bff');
              $(`g[model-id=${id}][data-type="conditional"] circle[port="${previewData.tasks[i[0]].scriptarguments[element].conditionPort}"]`).css('stroke', '#4e8bff');
            }
          });
        }
      }
      if (type === 'end') {
        const i = Object.keys(previewData.tasks).filter((d) => previewData.tasks[d].id === source.id);
        if (i?.length > 0) {
          if (previewData.tasks[i[0]].type === 'conditional') {
            Object.keys(previewData.tasks[i[0]].scriptarguments).forEach((ele) => {
              if (previewData.tasks[i[0]].scriptarguments[ele].matched && previewData.tasks[i[0]].scriptarguments[ele].conditionPort === source.port && previewData.playbookStatus === 'Success') {
                taskStatus = '#84c255';
              }
            });
          } else if (previewData.playbookStatus === 'Success' && previewData.tasks[i[0]].type !== 'conditional' && previewData.tasks[i[0]].actionResult) {
            taskStatus = '#84c255';
          } else if (previewData.tasks[i[0]].type === 'playbook' && previewData.tasks[i[0]].status === 'Success') {
            taskStatus = '#84c255';
          } else {
            taskStatus = '#4e8bff';
          }
        }
      }
      const link = new joint.dia.Link({
        source,
        target,
        router: { name: 'metro' },
        connector: { name: 'rounded', args: { type: ' gap' } },
        attrs: {
          '.marker-target': {
            fill: taskStatus,
            d: 'M 10 0 L 0 5 L 10 10 z',
            opacity: 1,
            stroke: taskStatus,
          },
          '.connection': { stroke: taskStatus, 'stroke-width': '0.2px' },
          'connection-wrap': { stroke: taskStatus },
        },
        smooth: true,
        z: -1,
      });
      lineLinkData.push(link);
      addCustomLinkIcon(link, paperUpdate);
    }
    // setGraph(graphSet);
  };

  // back to graph from json data
  const fromJson = (data) => {
    Object.keys(data?.tasks)?.forEach((e, i) => {
      addNode(data.tasks[e]);
      setId(i += 1);
    });
    graph?.addCells(rectData);
    Object.keys(data?.tasks)?.forEach((pb) => {
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
            // e?.previousIDs?.forEach((element) => {
            //   const src1 = {
            //     id: element.p?.toString(),
            //     port: element.port,
            //   };
            //   const targetSet1 = {
            //     id: e.id.toString(),
            //     port: 'in-0',
            //   };
            //   graph?.getLinks()?.forEach((elem) => {
            //     if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
            //       src1.port = elem.attributes.source.port;
            //       graph?.getCell(elem.id).remove();
            //     }
            //   });
            //   addLinkInGraph(null, src1, targetSet1, (data.tasks[element.p].type !== 'conditional' && data.tasks[element.p].type !== 'start') && data.tasks[element.p].actionResult && element.matched ? element.matched : (data.tasks[element.p].type === 'conditional' || data.tasks[element.p].type === 'start') ? element.matched : '');
            // });
          });
        } else {
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
                addLinkInGraph(e, src, targetSet, 'default');
              });
              if (e.actionResult !== undefined && e.type !== 'end' && e.type !== 'playbook') {
                e.actionResult.forEach((d) => {
                  if (d.preId && d.preIdPort) {
                    const src1 = {
                      id: d.preId?.toString(),
                      port: d.preIdPort,
                    };
                    const targetSet1 = {
                      id: e.id.toString(),
                      port: 'in-0',
                    };
                    lineLinkData?.forEach((elem) => {
                      if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
                        src1.port = elem.attributes.source.port;
                        const index = lineLinkData.findIndex((j) => j.id === elem.id);
                        lineLinkData.splice(index, 1);
                        // graph?.getCell(elem.id).remove();
                      }
                    });
                    addLinkInGraph(null, src1, targetSet1, d.status);
                  }
                });
              } else if (e.type === 'playbook') {
                e.previousIDs.forEach((d) => {
                  if (d.p && d.port) {
                    const src1 = {
                      id: d.p,
                      port: d.port,
                    };
                    const targetSet1 = {
                      id: d.c,
                      port: 'in-0',
                    };
                    lineLinkData?.forEach((elem) => {
                      if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
                        src1.port = elem.attributes.source.port;
                        const index = lineLinkData.findIndex((j) => j.id === elem.id);
                        lineLinkData.splice(index, 1);
                        // graph?.getCell(elem.id).remove();
                      }
                    });
                    addLinkInGraph(null, src1, targetSet1, (((data.tasks[d.p].type !== 'conditional' && data.tasks[d.p].type !== 'start') && data.tasks[d.p].actionResult && d.matched !== undefined) || (data.tasks[d.p].type === 'conditional' || data.tasks[d.p].type === 'playbook' || data.tasks[d.p].type === 'start' || data.tasks[d.p].type === 'title')) && data.tasks[d.c].status === 'Success' ? d.matched : data.tasks[d.c].status === 'Failed' ? false : '');
                  }
                });
              }
              if (e.type === 'end') {
                e?.previousIDs?.forEach((d, i) => {
                  if (d.p && d.port) {
                    const src1 = {
                      id: d.p?.toString(),
                      port: d.port,
                    };
                    const targetSet1 = {
                      id: e.id.toString(),
                      port: 'in-0',
                    };
                    lineLinkData?.forEach((elem) => {
                      if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
                        src1.port = elem.attributes.source.port;
                        const index = lineLinkData.findIndex((j) => j.id === elem.id);
                        lineLinkData.splice(index, 1);
                        // graph?.getCell(elem.id).remove();
                      }
                    });
                    addLinkInGraph(null, src1, targetSet1, d.status);
                  }
                });
              }
            }
          });
        }
      }
    });
    Object.keys(data.tasks).forEach((pb) => {
      const e = data.tasks[pb];
      if (e.type === 'conditional') {
        // Object.keys(e.scriptarguments).forEach((j) => {
        e?.previousIDs?.forEach((element) => {
          const src1 = {
            id: element.p?.toString(),
            port: element.port,
          };
          const targetSet1 = {
            id: e.id.toString(),
            port: 'in-0',
          };
          lineLinkData?.forEach((elem) => {
            if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
              src1.port = elem.attributes.source.port;
              const index = lineLinkData.findIndex((k) => k.id === elem.id);
              lineLinkData.splice(index, 1);
              // graph?.getCell(elem.id).remove();
            }
          });
          addLinkInGraph(null, src1, targetSet1, (data.tasks[element.p].type !== 'conditional' && data.tasks[element.p].type !== 'start') && data.tasks[element.p].actionResult && element.matched !== undefined ? element.matched : (data.tasks[element.p].type === 'conditional' || data.tasks[element.p].type === 'start' || data.tasks[element.p].type === 'title') ? element.matched : (data.tasks[element.p].type === 'playbook' && data.tasks[element.p].status === 'Success') ? element.matched : '');
          // addLinkInGraph(null, src1, targetSet1, element.matched);
        });
        // });
      } else {
        Object.keys(e.nexttasks).forEach((l) => {
          if (e.actionResult !== undefined && e.type !== 'end' && e.type !== 'playbook') {
            e.actionResult.forEach((d, i) => {
              if (d.preId && d.preIdPort) {
                const src1 = {
                  id: d.preId?.toString(),
                  port: d.preIdPort,
                };
                const targetSet1 = {
                  id: e.id.toString(),
                  port: 'in-0',
                };
                lineLinkData?.forEach((elem) => {
                  if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
                    src1.port = elem.attributes.source.port;
                    const index = lineLinkData.findIndex((j) => j.id === elem.id);
                    lineLinkData.splice(index, 1);
                    // graph?.getCell(elem.id).remove();
                  }
                });
                addLinkInGraph(null, src1, targetSet1, d.status);
              }
            });
          } else if (e.type === 'playbook') {
            e.previousIDs.forEach((d) => {
              if (d.p && d.port) {
                const src1 = {
                  id: d.p,
                  port: d.port,
                };
                const targetSet1 = {
                  id: d.c,
                  port: 'in-0',
                };
                lineLinkData?.forEach((elem) => {
                  if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
                    src1.port = elem.attributes.source.port;
                    const index = lineLinkData.findIndex((j) => j.id === elem.id);
                    lineLinkData.splice(index, 1);
                    // graph?.getCell(elem.id).remove();
                  }
                });
                addLinkInGraph(null, src1, targetSet1, (((data.tasks[d.p].type !== 'conditional' && data.tasks[d.p].type !== 'start') && data.tasks[d.p].actionResult && d.matched !== undefined) || (data.tasks[d.p].type === 'conditional' || data.tasks[d.p].type === 'playbook' || data.tasks[d.p].type === 'start' || data.tasks[d.p].type === 'title')) && data.tasks[d.c].status === 'Success' ? d.matched : data.tasks[d.c].status === 'Failed' ? false : '');
              }
            });
          }
          if (e.type === 'end') {
            e?.previousIDs?.forEach((d, i) => {
              if (d.p && d.port) {
                const src1 = {
                  id: d.p?.toString(),
                  port: d.port,
                };
                const targetSet1 = {
                  id: e.id.toString(),
                  port: 'in-0',
                };
                lineLinkData?.forEach((elem) => {
                  if ((elem.attributes.target.id === targetSet1.id && elem.attributes.source.id === src1.id && elem.attributes.source.port === src1.port)) {
                    src1.port = elem.attributes.source.port;
                    const index = lineLinkData.findIndex((j) => j.id === elem.id);
                    lineLinkData.splice(index, 1);
                    // graph?.getCell(elem.id).remove();
                  }
                });
                addLinkInGraph(null, src1, targetSet1, d.status);
              }
            });
          }
        });
      }
    });
    graph.addCell(lineLinkData);
    setGraph(graph);
    lineLinkData = [];
    rectData = [];
  };

  useEffect(() => {
    if (IncPreviewPlaybookRes.status && IncPreviewPlaybookRes.status === true) {
      setPreviewStatus(true);
      setPreviewData(IncPreviewPlaybookRes.data);
      // setPreviewData(fackData);
      // fromJson(IncPreviewPlaybookRes.data);
      setPreviewLoading(false);
      setRefreshLoad(false);
      fakeIncidentPlaybookAction();
    } else if (IncPreviewPlaybookRes.status === false) {
      setPreviewData({});
      setPreviewLoading(false);
      setRefreshLoad(false);
      fakeIncidentPlaybookAction();
    }
  }, [IncPreviewPlaybookRes]);

  useEffect(() => {
    if ((saveType === 'edit' || saveType === 'preview') && previewData) {
      setGraph();
      setTimeout(() => {
        setGraph(new joint.dia.Graph());
      }, 200);
    }
    initPaper();
    domInit();
    if (previewData) {
      fromJson(previewData);
    }
  }, [previewData]);

  const resetZoom = () => {
    setZoom(0.9);
    const paperUpdateSet = paperUpdate;
    if (paperUpdateSet) {
      paperUpdateSet.translate(0, 0);
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

  return (
    <IncidentPreviewPlaybookWrapper>
      {
        previewLoading && <ZsSpin id="IncidentPlaybookPreviewLoading" />
      }
      {!previewLoading && (
        <div className="mainBody">
          <div className="contentHeader">
            <div className="contentHeaderBody">
              <div className="wrap">
                <div style={{ width: '40px' }}>
                  <EkashaDropdown
                    className="noti"
                    triggerType="click"
                    visible={view}
                    onOpenChange={(val) => setView(val)}
                    showContent={(
                      <div className="mainViewBody">
                        <div className="topContent">
                          <div className="wrapPart">
                            <div className="leftPart">
                              <div className="leftTitle">Created By :</div>
                            </div>
                            <div className="rightPart">
                              <div className="rightTitle">{previewData.createdBy}</div>
                            </div>
                          </div>
                          {previewData?.parentPlaybookName && (
                            <div className="wrapPart">
                              <div className="leftPart">
                                <div className="leftTitle">Parent Playbook Name :</div>
                              </div>
                              <div className="rightPart">
                                <div className="rightTitle">{previewData.parentPlaybookName}</div>
                              </div>
                            </div>
                          )}
                          {!previewData?.parentPlaybookName && (
                            <>
                              <div className="wrapPart">
                                <div className="leftPart">
                                  <div className="leftTitle">Assigned By :</div>
                                </div>
                                <div className="rightPart">
                                  <div className="rightTitle">{previewData.assignedBy}</div>
                                </div>
                              </div>
                              <div className="wrapPart">
                                <div className="leftPart">
                                  <div className="leftTitle">Assigned Time :</div>
                                </div>
                                <div className="rightPart">
                                  <div className="rightTitle">{previewData.assignedTime ? convertTimeBaseTimeZoneFunction(previewData.assignedTime) : '-'}</div>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="wrapPart">
                            <div className="leftPart">
                              <div className="leftTitle">Playbook Status :</div>
                            </div>
                            <div className="rightPart" style={{ display: 'flex', height: '17px' }}>
                              <div className="rightTitle" style={{ marginRight: '5px' }}>{previewData.playbookStatus}</div>
                              <Icons type={previewData.playbookStatus} icontype="globle" className="btmIcn" />
                            </div>
                          </div>
                          {!previewData?.terminatedBy && !previewData?.parentPlaybookName && (
                            <>
                              <div className="wrapPart">
                                <div className="leftPart">
                                  <div className="leftTitle">Executed Time :</div>
                                </div>
                                <div className="rightPart">
                                  <div className="rightTitle">{previewData.executionStartTime ? convertTimeBaseTimeZoneFunction(previewData.executionStartTime) : '-'}</div>
                                </div>
                              </div>
                              <div className="wrapPart">
                                <div className="leftPart">
                                  <div className="leftTitle">Execution Time :</div>
                                </div>
                                <div className="rightPart">
                                  <div className="rightTitle">{calculateDuration(previewData.executionStartTime, previewData.executionEndTime) || '-'}</div>
                                </div>
                              </div>
                            </>
                          )}
                          {previewData.terminatedBy && !previewData?.parentPlaybookName && (
                            <>
                              <div className="wrapPart">
                                <div className="leftPart">
                                  <div className="leftTitle">Terminated By :</div>
                                </div>
                                <div className="rightPart">
                                  <div className="rightTitle">{previewData.terminatedBy}</div>
                                </div>
                              </div>
                              <div className="wrapPart">
                                <div className="leftPart">
                                  <div className="leftTitle">Terminated Time :</div>
                                </div>
                                <div className="rightPart">
                                  <div className="rightTitle">{previewData.terminatedTime ? convertTimeBaseTimeZoneFunction(previewData.terminatedTime) : '-'}</div>
                                </div>
                              </div>
                              <div className="wrapPart">
                                <div className="leftPart">
                                  <div className="leftTitle">Scheduled Time :</div>
                                </div>
                                <div className="rightPart">
                                  <div className="rightTitle">{previewData.playbookScheduleTime ? convertTimeBaseTimeZoneFunction(previewData.playbookScheduleTime) : '-'}</div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="bottomPart">
                          <div className="leftPart">
                            <div className="leftContent">
                              <div className="leftTag" style={{ background: '#4e8bff' }} />
                              <div className="leftTitle">Not Executed</div>
                            </div>
                            <div className="leftContent">
                              <div className="leftTag" style={{ background: '#84c255' }} />
                              <div className="leftTitle">Success</div>
                            </div>
                            <div className="leftContent">
                              <div className="leftTag" style={{ background: '#d68a28' }} />
                              <div className="leftTitle">Condition Not Matched</div>
                            </div>
                          </div>
                          <div className="rightPart">
                            <div className="leftContent">
                              <div className="leftTag" style={{ background: '#f04848' }} />
                              <div className="leftTitle">Failed</div>
                            </div>
                            <div className="leftContent">
                              <div className="leftTag" style={{ background: '#ffff00' }} />
                              <div className="leftTitle">InProgress</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  >
                    <Icons
                      icontype="common"
                      type="informationIcon"
                      style={{
                        position: 'relative', top: '3px', cursor: 'pointer',
                      }}
                    />
                  </EkashaDropdown>
                </div>
                <div className="headerTitle">Playbook Name :</div>
                <div className="headerContent">
                  <ZsTooltip
                    autoRight
                    title={`${previewData.name}`}
                    ids={`incident_playbook_preview_header_playbookName_${previewData.name}`}
                  >
                    <div
                      id={`incident_playbook_preview_header_playbookName_${previewData.name}`}
                      style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {previewData.name}
                    </div>
                  </ZsTooltip>
                </div>
                <div
                  className="refreshArtifact"
                  onClick={() => refreshPreviewTask()}
                >
                  <div>
                    <Icons
                      icontype="common"
                      type="incPreviewRefresh"
                      data-test="artifact_refresh_btn"
                      className={refreshLoad ? 'spinnerRestart' : null}
                      style={{
                        cursor: 'pointer', position: 'relative', top: '2.5px', opacity: 1,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {refreshLoad && previewData ? <ZsSpin id="IncidentPlaybookPreviewGraphLoading" />
            : (
              <div className="contentBody">
                <div className="backBtn">
                  <Icons
                    type="playbookResetBtn"
                    className="resetZoomBtn"
                    icontype="globle"
                    onClick={() => resetZoom()}
                  />
                </div>
                <div style={{ position: 'absolute' }} className="actionTab">
                  <Icons
                    type="zoomIn"
                    icontype="globle"
                    className="zoomInBtn"
                    onClick={() => zoomPaper({ deltaY: +100 })}
                  />
                  <Icons
                    type="zoomOut"
                    className="zoomInBtn"
                    icontype="globle"
                    onClick={() => zoomPaper({ deltaY: -100 })}
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
            )}
          {/* <div className="contentFooter">
            <div className="wrap">
              <div className="headerTitle">Terminated By :</div>
              <div className="headerContent">
                {previewData?.terminatedBy ? previewData.terminatedBy : '-'}
              </div>
            </div>
            <div className="wrap">
              <div className="headerTitle">Terminated Time :</div>
              <div className="headerContent">
                {previewData?.terminatedTime ? convertTimeBaseTimeZoneFunction(previewData.terminatedTime) : '-'}
              </div>
            </div>
            <div className="wrap">
              <div className="headerTitle">Executed Time :</div>
              <div className="headerContent">
                {previewData?.executionStartTime ? convertTimeBaseTimeZoneFunction(previewData.executionStartTime) : '-'}
              </div>
            </div>
            <div className="wrap">
              <div className="headerTitle">Execution Time :</div>
              <div className="headerContent">
                {calculateDuration(previewData.executionStartTime, previewData.executionEndTime)}
              </div>
            </div>
            <div className="wrap">
              <div className="headerTitle">Scheduled Time :</div>
              <div className="headerContent">
                {previewData.playbookScheduleTime ? convertTimeBaseTimeZoneFunction(previewData.playbookScheduleTime) : '-'}
              </div>
            </div>
          </div> */}
        </div>
      )}
      {actionModel && (
        <PlaybookPreviewTaskModel
          actionResult={actionResult}
          actionModel={actionModel}
          setActionModel={setActionModel}
        />
      )}
      {noteModel && (
        <PlaybookPreviewNote
          noteModel={noteModel}
          setNoteModel={setNoteModel}
          noteData={noteData}
          setNoteData={setNoteData}
        />
      )}
      {titleModel && (
        <PlaybookPreviewTitle
          titleModel={titleModel}
          setTitleModel={setTitleModel}
          titleData={titleData}
          setTitleData={setTitleData}
        />
      )}
      {userPermissionModel && (
        <PlaybookUserPermissionList
          userPermissionModel={userPermissionModel}
          setUserPermissionModel={setUserPermissionModel}
          fakePlaybookActionAPI={fakePlaybookActionAPI}
        />
      )}
      <PlaybookPreviewDecision
        noteModel={noteModel}
        setNoteModel={setNoteModel}
        setNoteData={setNoteData}
        fakePlaybookAction={fakePlaybookAction}
      />
    </IncidentPreviewPlaybookWrapper>
  );
});
export default PreviewPlaybookTab;
