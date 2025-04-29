import React, {
  lazy, Suspense, useCallback, useContext, useEffect, useState, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './lib/DragPreviewPlaceholderStyle.css';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { DashboardWrapper } from './lib/DashboardWrapper';
import { ekashaPermission, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import NoData from '../../../components/NoData';
import Icons from '../../../components/icons';
import Toaster from '../../../components/toaster';
import ZsTooltip from '../../../components/tooltip';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../components/modal';
import ZsButton from '../../../components/forms/button';
import { ZsSpin } from '../../../components/Spin';
import { retryLazy } from '../../../helpers/envData';
import { TimeFilContext } from '../../containers/TimeFilterContext';

const KpiEkasha = lazy(() => retryLazy(() => import('../../containers/kpis')));
const HomeEkasha = lazy(() => retryLazy(() => import('../../containers/home')));
const SinglePanle = lazy(() => retryLazy(() => import('./lib/SinglePanle')));
const DashboardCreate = lazy(() => retryLazy(() => import('./lib/dashboardCreate')));
const PanelsEkasha = lazy(() => retryLazy(() => import('../../containers/panel')));

const ResponsiveReactGridLayout = WidthProvider(Responsive);

let subscribe;

const Dashboard = React.memo((props) => {
  const {
    panelGetAction, panelDrawerOpen, ListDashboardAction, fakeActionDashboard,
    CreateDashboardAction, UpdateDashboardAction, GetDashboardAction, DeleteDashboardAction,
    panelDrawerClose, ListPanelDataAction, AddPanelAction, getChartDataAction,
    SaveDashLayout, RemovePanelAction,
  } = props;
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('home');
  const [panelDrawer, setPanelDrawer] = useState(false);
  const [chartSizeChange, setChartSizeChange] = useState(false);
  const [dashboardCreateModal, setDashboardCreateModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [valueEdited, setValueEdited] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [apiCall, setApiCall] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [listDashboard, setListDashboard] = useState([]);
  const [dragTimePositionData, setDragTimePostionUpdateData] = useState([]);
  const [modaltype, setModaltype] = useState('');
  const [updatePanelAr, setUpdatePanelAr] = useState([]);
  const [values, setValues] = useState({});
  const [dashTabPanels, setDashTabPanels] = useState([]);
  const [panelData, setPanelData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [intervalStatus, setIntervalStatus] = useState(false);
  const [deleteChart, setDeleteChart] = useState('');
  const [paneldeleteModal, setPaneldeleteModal] = useState(false);
  const [newPanelModal, setNewPanelModal] = useState(false);
  const [newPanelPreviewModal, setNewPanelPreviewModal] = useState(false);
  const [submitPanelDeleteLoading, setSubmitPanelDeleteLoading] = useState(false);
  const [intervalPaused, setIntervalPaused] = useState(false);
  const [isActionExecuted, setIsActionExecuted] = useState(false);

  const {
    dashIntervalStatus, customerID, quickPanelStatus, setQuickPanelStatus,
  } = useContext(TimeFilContext);

  const OpenDrawer = useSelector((state) => (
    state.Panel.OpenDrawerPanel || {}));
  const CloseDrawer = useSelector((state) => (
    state.Panel.CloseDrawerPanel || {}));
  const ListDashboardRes = useSelector((state) => (
    state.Dashboard.GetAllListDashboardResponse || {}));
  const CreateDashboardRes = useSelector((state) => (
    state.Dashboard.CreateDashboardResponse || {}));
  const GetDashboardRes = useSelector((state) => (
    state.Dashboard.GetDashboardResponse || {}));
  const UpdateDashboardRes = useSelector((state) => (
    state.Dashboard.UpdateDashboardResponse || {}));
  const DeleteDashboardRes = useSelector((state) => (
    state.Dashboard.DeleteDashboardResponse || {}));
  const ListPanelDashRes = useSelector((state) => (
    state.Dashboard.ListPanelDashboardResponse || {}));
  const AddChartDashboardRes = useSelector((state) => (
    state.Dashboard.AddChartDashboardResponse || {}));
  const SaveDashboardEditdRes = useSelector((state) => (
    state.Dashboard.SaveDashboardEditdResponse || {}));
  const GetChartDataRes = useSelector((state) => (
    state.Dashboard.GetChartDataResponse || {}));
  const TimeFilterUpdate = useSelector((state) => (
    state.Dashboard.TimeFilterUpdate || {}));
  const RemovePanelChartRes = useSelector((state) => (
    state.Dashboard.RemovePanelChartResponse || {}));

  const selectHome = useCallback(() => {
    setActiveTab('home');
    setDashTabPanels([]);
    panelDrawerClose();
    setNewPanelPreviewModal(false);
  }, []);

  const dashUpdateSock = useCallback((dataRes) => {
    if (dataRes.status) {
      setListDashboard((prevState) => {
        const index = prevState.findIndex((e) => e.token === dataRes.data.token);
        if (index !== -1) {
          const a = prevState;
          a[index] = dataRes.data;
          return [...a];
        }
        return prevState;
      });
    }
  }, []);

  const dashRemoveSock = useCallback((dataRes) => {
    if (dataRes.status) {
      setActiveTab((token) => {
        if (dataRes.data.dashToken === token) {
          setDashTabPanels((prevState) => {
            const index = prevState.findIndex((e) => e.panelToken === dataRes.data.panelToken);
            if (index !== -1) {
              const a = prevState;
              a.splice(index, 1);
              return [...a];
            }
            return prevState;
          });
          setPanelData((rr) => {
            const index = rr.findIndex((e) => e.id === dataRes.data.panelToken);
            if (index !== -1) {
              const a = rr;
              a.splice(index, 1);
              return [...a];
            }
            return rr;
          });
          setUpdatePanelAr((updateState) => {
            const index = updateState.findIndex((e) => e.panelToken === dataRes.data.panelToken);
            if (index !== -1) {
              const a = updateState;
              a.splice(index, 1);
              return [...a];
            }
            return updateState;
          });
        }
        return token;
      });
    }
  }, []);

  const updatePositionSock = useCallback((dataRes) => {
    setActiveTab((token) => {
      if (token === dataRes.data.dToken) {
        ListPanelDataAction(token);
      }
      return token;
    });
  }, []);

  const RemovePanelDahFromSock = useCallback((dataRes) => {
    if (dataRes.status) {
      setDashTabPanels((prevState) => {
        const index = prevState.findIndex((e) => e.panelToken === dataRes.data);
        if (index !== -1) {
          const a = prevState;
          a.splice(index, 1);
          return [...a];
        }
        return prevState;
      });
      setPanelData((rr) => {
        const index = rr.findIndex((e) => e.id === dataRes.data);
        if (index !== -1) {
          const a = rr;
          a.splice(index, 1);
          return [...a];
        }
        return rr;
      });
      setUpdatePanelAr((updateState) => {
        const index = updateState.findIndex((e) => e.panelToken === dataRes.data);
        if (index !== -1) {
          const a = updateState;
          a.splice(index, 1);
          return [...a];
        }
        return updateState;
      });
    }
  }, []);

  const updatePanelDashFromSock = useCallback((dataRes) => {
    if (dataRes.status) {
      setActiveTab((token) => {
        ListPanelDataAction(token);
        return token;
      });
    }
  }, []);

  const panelSocket = useCallback((dataRes) => {
    if (dataRes.module === 'panel') {
      if (dataRes.operation && dataRes.operation === 'delete') {
        RemovePanelDahFromSock(dataRes);
      }
      if (dataRes.operation && dataRes.operation === 'update') {
        updatePanelDashFromSock(dataRes);
      }
    }
  }, []);

  const onDashboarddataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    panelSocket(dataRes);
    if (dataRes.module === 'dashboard') {
      switch (dataRes.operation) {
        case 'add':
          if (dataRes.status) {
            setListDashboard((prevState) => {
              if (dataRes.data.customerID === localStorage.getItem('customerID')) {
                return [dataRes.data, ...prevState];
              }
              return prevState;
            });
          }
          break;
        case 'delete':
          if (dataRes.status) {
            setListDashboard((prevState) => (prevState.filter((e) => e.token !== dataRes.data)));
            setActiveTab((token) => {
              if (token === dataRes.data) {
                selectHome();
              }
              return token;
            });
          }
          break;
        case 'update':
          dashUpdateSock(dataRes);
          break;
        case 'updatePosition':
          updatePositionSock(dataRes);
          break;
        case 'remove':
          dashRemoveSock(dataRes);
          break;
        default:
          break;
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'chart',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleNewPanelModalChange = useCallback((value) => {
    setNewPanelModal(value);
  }, []);

  const handlenewPanelPreviewModalChange = useCallback((value) => {
    setNewPanelPreviewModal(value);
  }, []);

  const selectKPI = useCallback(() => {
    setActiveTab('KPI');
    setDashTabPanels([]);
    panelDrawerClose();
    setNewPanelPreviewModal(false);
  }, []);

  const deleteModalOpen = useCallback((token) => {
    panelDrawerClose();
    setSelectedRow(token);
    setDeleteModal(true);
  }, []);

  const deleteClose = useCallback(() => {
    setPaneldeleteModal(false);
    setSubmitPanelDeleteLoading(false);
    setDeleteChart('');
  }, []);

  const editDash = useCallback((d) => {
    panelDrawerClose();
    GetDashboardAction(d.token);
  }, []);

  const scrollTab = useCallback(() => {
    const mouseWheel = document.querySelector('.listDashboard');
    if (mouseWheel !== null) {
      mouseWheel.addEventListener('wheel', (e) => {
        const race = 15; // How many pixels to scroll

        if (e.deltaY > 0) {
          mouseWheel.scrollLeft += race; // Scroll right
        } else {
          mouseWheel.scrollLeft -= race; // Scroll left
        }
        e.preventDefault();
      });
    }
  }, []);

  const closeModal = useCallback(() => {
    setDashboardCreateModal(false);
    setSubmitLoading(false);
    setDeleteModal(false);
    setSelectedRow('');
    setValueEdited(false);
    setSubmited(false);
    setValues({});
    setAnimation(false);
  }, []);

  const changeStatus = useCallback((status) => {
    const dd = [];
    setListDashboard((prevState) => {
      prevState.forEach((element) => {
        element.editStatus = status;
        dd.push({ ...element });
      });
      if (status) {
        setIntervalPaused(true);
      } else {
        setIntervalPaused(false);
      }
      return dd;
    });
  }, []);

  const submitDelete = useCallback(() => {
    setSubmitPanelDeleteLoading(true);
    setDeleteChart((pre) => {
      RemovePanelAction(pre.split(',')[1], pre.split(',')[0], localStorage.getItem('customerID'));
      return pre;
    });
  }, []);

  const createModal = useCallback((type) => {
    setModaltype(type);
    if (!panelDrawer) {
      setDashboardCreateModal(true);
    }
  }, [panelDrawer]);

  const setData = useCallback((value, fieldType) => {
    setValueEdited(true);
    const dataOfValues = { ...values, [fieldType]: value };
    setValues(dataOfValues);
  }, [values]);

  const submitModal = useCallback(() => {
    setSubmited(true);
    if (!(values.dashName && values.interval)) {
      return;
    }
    setSubmitLoading(true);
    values.customerID = localStorage.getItem('customerID');
    if (modaltype === 'new') {
      CreateDashboardAction(values);
    } else {
      UpdateDashboardAction(values);
    }
  }, [values]);

  const onLayoutChange = useCallback((layout) => {
    layout.forEach((d) => {
      const getPanel = dashTabPanels.findIndex((x) => x.i === d.i);
      if (getPanel !== -1) {
        dashTabPanels[getPanel].h = d.h;
        dashTabPanels[getPanel].w = d.w;
        dashTabPanels[getPanel].x = d.x;
        dashTabPanels[getPanel].y = d.y;
      }
    });
    setDashTabPanels([...dashTabPanels]);
    setUpdatePanelAr(dashTabPanels);
  }, [dashTabPanels]);

  const selectDashTab = useCallback((token) => {
    panelDrawerClose();
    setNewPanelModal(false);
    setTimeout(() => {
      setNewPanelModal(false);
    }, 500);
    if (activeTab !== token) {
      setDashboardLoading(true);
      setDashTabPanels([]);
      setTimeout(() => {
        ListPanelDataAction(token);
      }, 500);
      setActiveTab(token);
      changeStatus(false);
    }
    setNewPanelPreviewModal(false);
  }, [activeTab]);

  const cancelEditDash = useCallback((token) => {
    if (!isActionExecuted) {
      setDashboardLoading(true);
      setDashTabPanels([]);
      ListPanelDataAction(token);
      changeStatus(false);
      setIsActionExecuted(true);
    }
  }, [isActionExecuted]);

  const dropPanel = useCallback((panel) => {
    const index = dragTimePositionData.findIndex((e) => e.i === '__dropping-elem__');
    const type = panel.panelType;
    const minMax = type === 'ringChart' || type === 'pieChart' || type === 'halfRingChart' || type === 'halfPieChart' || type === 'radarChart';
    if (index !== -1) {
      const newPanelData = {
        dToken: activeTab,
        panelToken: panel.token,
        i: panel.token,
        x: dragTimePositionData[index]?.x,
        y: dragTimePositionData[index]?.y,
        h: 9,
        w: 4,
        xLabel: panel.xLabel ? panel.xLabel : '',
        yLabel: panel.yLabel ? panel.yLabel : '',
        minH: minMax ? 8 : 6,
        minW: 4,
      };
      dragTimePositionData[index] = newPanelData;
      setDashTabPanels(dragTimePositionData);
      setUpdatePanelAr(dragTimePositionData);
      AddPanelAction(panel.token);
    }
  }, [dragTimePositionData, activeTab]);

  const saveLayoutDash = useCallback((token) => {
    SaveDashLayout({ dToken: token, panels: updatePanelAr, customerID: localStorage.getItem('customerID') });
    changeStatus(false);
    setIntervalStatus(false);
  }, [updatePanelAr, activeTab]);

  const submitDelete2 = useCallback(() => {
    setSubmitPanelDeleteLoading(true);
    setDeleteChart((pre) => {
      const panelToken = pre.split(',')[1];
      setDashTabPanels((prevState) => {
        const preInd = prevState.findIndex((e) => e.panelToken === panelToken);
        if (preInd !== -1) {
          if (!prevState[preInd].token) {
            setDashTabPanels((updateState) => updateState.filter(
              (e) => e.panelToken !== panelToken,
            ));
            setUpdatePanelAr((updateState) => updateState.filter(
              (e) => e.panelToken !== panelToken,
            ));
            setPanelData((updateState) => updateState.filter((e) => e.id !== panelToken));
            deleteClose();
          } else if (!apiCall) setApiCall(true);
        }
        return prevState;
      });
      return pre;
    });
  }, [apiCall]);

  const handleOk = useCallback(() => {
    setListDashboard((prevState) => {
      const data = [...prevState];
      if (data.some((d) => d.editStatus)) {
        submitDelete2();
      } else {
        submitDelete();
      }
      return data;
    });
  }, []);

  const onResize = async (_, oldLayoutItem, layoutItem) => {
    // Toggle chart size change state
    await new Promise((resolve) => {
      setChartSizeChange((prevState) => {
        resolve();
        return !prevState;
      });
    });

    const minH = 9;
    const minW = 4;

    layoutItem.h = Math.max(layoutItem.h, minH);
    layoutItem.w = Math.max(layoutItem.w, minW);

    // 2. Then enforce maximum dimensions
    layoutItem.h = Math.min(layoutItem.h, 18); // Maximum height
    layoutItem.w = Math.min(layoutItem.w, 12); // Maximum width

    // 3. Ensure dimensions are whole numbers
    layoutItem.h = Math.round(layoutItem.h);
    layoutItem.w = Math.round(layoutItem.w);

    // Update the dashTabPanels state to reflect the new dimensions
    setDashTabPanels((prevPanels) => {
      const updatedPanels = prevPanels.map((panel) => {
        if (panel.i === layoutItem.i) {
          return {
            ...panel,
            h: layoutItem.h,
            w: layoutItem.w,
            x: layoutItem.x,
            y: layoutItem.y,
            minH,
            minW,
          };
        }
        return panel;
      });
      return updatedPanels;
    });
  };

  const debouncedResize = useCallback(
    debounce((layout, oldItem, newItem) => {
      onResize(layout, oldItem, newItem);
    }, 250), // Increased delay to prevent rapid updates
    [onResize], // Add onResize as dependency
  );

  const onDropInReactGrid = useCallback((layoutItems, dropingItem) => {
    const templayout = JSON.parse(JSON.stringify(dashTabPanels));
    layoutItems.forEach((e) => {
      const getPanel = templayout.findIndex((x) => x.i === e.i);
      if (getPanel !== -1) {
        templayout[getPanel].x = e.x;
        templayout[getPanel].y = e.y;
        setDragTimePostionUpdateData([...templayout]);
      }
    });
    setDragTimePostionUpdateData([...templayout, dropingItem]);
  }, [dashTabPanels]);

  const initialCallMade = useRef(false);

  useEffect(() => {
    const callback = () => {
      if (PermissionRO('home', 'dashboard').read && window.location.hash === '#/zeronsec' && !initialCallMade.current) {
        initialCallMade.current = true;
        setTimeout(() => {
          ListDashboardAction(localStorage.getItem('customerID'));
        }, 200);
      }
      if (location.state && location.state.quickDash) {
        createModal('new');
      }
      if (quickPanelStatus) {
        panelDrawerOpen();
      }
      setPanelDrawer(false);
      scrollTab();
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData, customerID]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onDashboarddataReceived);
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
    if (ListDashboardRes.status) {
      setActiveTab('home');
      setListDashboard(ListDashboardRes.data);
      fakeActionDashboard();
    } else if (ListDashboardRes.status === false) {
      fakeActionDashboard();
    }
  }, [ListDashboardRes]);

  useEffect(() => {
    if (OpenDrawer === 'PANEL_DRAWER_OPEN') {
      setAnimation(true);
      if (!panelDrawer) {
        panelGetAction('', localStorage.getItem('customerID'));
        setPanelDrawer(true);
        setDashboardCreateModal(false);
      }
    }
  }, [OpenDrawer]);

  useEffect(() => {
    if (CloseDrawer === 'PANEL_DRAWER_CLOSE') {
      setAnimation(true);
      setPanelDrawer(false);
      setNewPanelModal(false);
      setNewPanelPreviewModal(false);
    }
  }, [CloseDrawer]);

  useEffect(() => {
    if (CreateDashboardRes.status) {
      closeModal();
      setActiveTab(CreateDashboardRes.data.token);
      setDashTabPanels([]);
      setTimeout(() => {
        const errorClass = $(`#dashTab${CreateDashboardRes.data.token}`);
        if (errorClass.length > 0) {
          errorClass[0].scrollIntoView();
        }
      }, 1500);
      fakeActionDashboard();
    } else if (CreateDashboardRes.status === false) {
      setSubmitLoading(false);
      fakeActionDashboard();
    }
  }, [CreateDashboardRes]);

  useEffect(() => {
    if (AddChartDashboardRes.status) {
      setPanelData((prevState) => [...prevState, AddChartDashboardRes.data[0]]);
      setDragTimePostionUpdateData([]);
      fakeActionDashboard();
    } else if (AddChartDashboardRes.status === false) {
      fakeActionDashboard();
    }
  }, [AddChartDashboardRes]);

  useEffect(() => {
    if (UpdateDashboardRes.status) {
      closeModal();
      fakeActionDashboard();
    } else if (UpdateDashboardRes.status === false) {
      setSubmitLoading(false);
      fakeActionDashboard();
    }
  }, [UpdateDashboardRes]);

  useEffect(() => {
    if (DeleteDashboardRes.status) {
      selectHome();
      closeModal();
      fakeActionDashboard();
    } else if (DeleteDashboardRes.status === false) {
      setSubmitLoading(false);
      fakeActionDashboard();
    }
  }, [DeleteDashboardRes]);

  useEffect(() => {
    if (GetDashboardRes.status) {
      createModal('edit');
      setSelectedRow(GetDashboardRes.data.token);
      setValues(GetDashboardRes.data);
      setDashboardLoading(false);
      fakeActionDashboard();
    } else if (GetDashboardRes.status === false) {
      setDashboardLoading(false);
      setSubmitLoading(false);
      fakeActionDashboard();
    }
  }, [GetDashboardRes]);

  useEffect(() => {
    if (GetChartDataRes.status) {
      setPanelData(GetChartDataRes.data);
      setDashboardLoading(false);
      fakeActionDashboard();
    } else if (GetChartDataRes.status === false) {
      setPanelData([]);
      setDashboardLoading(false);
      fakeActionDashboard();
    }
  }, [GetChartDataRes]);

  useEffect(() => {
    if (TimeFilterUpdate === 'TIMEFILTER_UPDATED_TIME' && activeTab !== 'home' && activeTab !== 'KPI') {
      const res = dashTabPanels;
      const panelToken = [];
      res.forEach((e) => {
        panelToken.push(e.panelToken);
      });
      getChartDataAction(panelToken.join(','));
      fakeActionDashboard();
    }
  }, [TimeFilterUpdate]);

  useEffect(() => {
    if (ListPanelDashRes.status) {
      const dd = ListPanelDashRes.data.map((obj) => ({ ...obj, i: obj.panelToken }));
      setDashTabPanels(dd);
      if (dd.length !== 0) {
        const panelToken = [];
        dd.forEach((e) => {
          panelToken.push(e.panelToken);
        });
        getChartDataAction(panelToken.join(','));
      }
      setDashboardLoading(false);
      fakeActionDashboard();
    } else if (ListPanelDashRes.status === false) {
      setDashboardLoading(false);
      setDashTabPanels([]);
      setUpdatePanelAr([]);
      setPanelData([]);
      fakeActionDashboard();
    }
  }, [ListPanelDashRes]);

  useEffect(() => {
    if (intervalStatus && !intervalPaused && !window.location.hash.includes('administration')) {
      if (!isActionExecuted) {
        ListPanelDataAction(activeTab);
        setIsActionExecuted(true);
      }
    } else {
      setIsActionExecuted(false);
    }
  }, [intervalStatus, intervalPaused, activeTab]);

  useEffect(() => {
    if (SaveDashboardEditdRes.status) {
      fakeActionDashboard();
    } else if (SaveDashboardEditdRes.status === false) {
      if (!isActionExecuted) {
        ListPanelDataAction(activeTab);
        setDashboardLoading(true);
        setDashTabPanels([]);
        fakeActionDashboard();
      }
    }
  }, [SaveDashboardEditdRes]);

  useEffect(() => {
    if (dashIntervalStatus) {
      if (activeTab !== 'home') {
        ListPanelDataAction(activeTab);
      }
      changeStatus(false);
      setIsActionExecuted(true);
    }
  }, [dashIntervalStatus]);

  useEffect(() => {
    if (apiCall) {
      setDeleteChart((pre) => {
        RemovePanelAction(pre.split(',')[1], pre.split(',')[0], localStorage.getItem('customerID'));
        return pre;
      });
      setApiCall(false);
      deleteClose();
    }
  }, [apiCall]);

  useEffect(() => {
    if (dashTabPanels.length !== 0) {
      const res = dashTabPanels;
      const panelToken = [];
      res.forEach((e) => {
        panelToken.push(e.panelToken);
      });
      setIntervalStatus(false);
    }
  }, [dashTabPanels]);

  useEffect(() => {
    if (RemovePanelChartRes.status) {
      deleteClose();
      fakeActionDashboard();
    } else if (RemovePanelChartRes.status === false) {
      setSubmitPanelDeleteLoading(false);
      fakeActionDashboard();
    }
  }, [RemovePanelChartRes]);
  if (!PermissionRO('home').read) {
    return <NoData id="dont_have_pr_dashboard" data-test="dont_have_pr_dashboard" message="You don't have permission to access this page" />;
  }

  return (
    <DashboardWrapper id="dashboard_home" data-test="dashboard_home">
      <div className="dashobardTab homeOpen">
        <ZsTooltip className="toolTipHome" title="Default dashboard">
          <div data-test="select_home_Button" id="dashHomeButton" onClick={() => selectHome()} className={activeTab === 'home' ? 'homeBtn active' : 'homeBtn'}>
            <span style={{ position: 'relative', top: '1px' }}>
              <Icons
                type="home"
                icontype="common"
                className="homeDashboard"
              />
            </span>
          </div>
        </ZsTooltip>
        <ZsTooltip className="toolTipHome" title="KPI dashboard">
          <div data-test="select_home_Button" id="dashKpiButton" style={{ left: '65px', color: '#a4a9af' }} onClick={() => selectKPI()} className={activeTab === 'KPI' ? 'homeBtn active' : 'homeBtn'}>
            <span style={{ position: 'relative', top: '1px' }}>KPI</span>
          </div>
        </ZsTooltip>
        <div className="listDashboard" style={{ width: dashTabPanels && dashTabPanels.length > 0 ? 'calc(100% - 310px)' : activeTab === 'KPI' ? 'calc(100% - 123px)' : 'calc(100% - 310px)' }}>
          {
            listDashboard.length > 0 && listDashboard.map((d, index) => (
              <div
                className={activeTab === d.token ? 'dashboardTab active' : 'dashboardTab'}
                key={index}
                id={`dashTab${d.token}`}
                data-test="select_dashboard_Tab"
                onClick={() => selectDashTab(d.token)}
              >
                <div className="tabBox">
                  <div className="titleTab">
                    <ZsTooltip
                      autoRight
                      type="Dashboard"
                      subType="Incidents"
                      title={d.dashName}
                      interval={d.interval}
                      description={d.description}
                      style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                      <div className="overflowText">{d.dashName}</div>
                    </ZsTooltip>
                  </div>
                  <div className="iconBox">
                    <Icons
                      type="edit"
                      icontype="globle"
                      className="editIcn"
                      data-test={`edit_panel_dash_${d.token}`}
                      id={`getDashEdit${d.token}`}
                      onClick={PermissionRO('home', 'dashboard').write ? () => editDash(d) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                    />
                    <Icons
                      type="close"
                      icontype="globle"
                      className="TabClose"
                      id={`getDashClose${d.token}`}
                      data-test={`delete_panel_dash_${d.token}`}
                      onClick={PermissionRO('home', 'dashboard').delete ? () => deleteModalOpen(d) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {activeTab !== 'KPI' && (
          <div id="dashbordIcon_create" className="addTab">
            <Icons
              type="plus"
              icontype="globle"
              className="addDashboard"
              style={{
                opacity: panelDrawer ? 0.4 : PermissionRO('home', 'dashboard').write ? 1 : 0.4,
                pointerEvents: panelDrawer ? 'none' : 'auto',
              }}
              data-test="create_dashboard_panel"
              id="addDashboardPlus"
              onClick={
                PermissionRO('home', 'dashboard').write
                  ? () => createModal('new')
                  : () => Toaster({ title: "You don't have permission.", type: 'error' })
              }
            />
            {listDashboard.map((d, i) => (
              activeTab === d.token
              && (
                <>
                  <div className="topActions" style={{ width: d.editStatus ? '105px' : '46px' }} key={i}>
                    <div className="rightSide">
                      {d.editStatus
                        ? (
                          <div className="editOk">
                            <ZsButton type="primary" id="dash_save" data-test="dash_save_chart" className="editButton" title="Save" onClick={() => saveLayoutDash(d.token)} />
                            <ZsButton type="primary" id="dash_cancel" className="editButton cancelBtn" data-test="dash_close_chart" title="Cancel" onClick={() => cancelEditDash(d.token)} />
                          </div>
                        )
                        : (
                          <span style={{ cursor: 'pointer', opacity: (newPanelModal || newPanelPreviewModal) ? 0.4 : 1, pointerEvents: (newPanelModal || newPanelPreviewModal) ? 'none' : 'auto' }}>
                            <Icons
                              type="editdash"
                              icontype="common"
                              className="editButtonSingle"
                              style={{
                                opacity: (newPanelModal || newPanelPreviewModal) ? 0.4 : PermissionRO('home', 'dashboard').write ? 1 : 0.4,
                                pointerEvents: (newPanelModal || newPanelPreviewModal) ? 'none' : 'auto',
                              }}
                              id={`dashEdit${d.token}`}
                              onClick={
                             PermissionRO('home', 'dashboard').write
                               ? () => {
                                 changeStatus(true);
                                 panelDrawerOpen();
                                 setQuickPanelStatus(false);
                               }
                               : () => Toaster({ title: "You don't have permission.", type: 'error' })
                                 }
                            />
                          </span>
                        )}
                    </div>
                  </div>
                </>
              )
            ))}
            {
              activeTab !== 'home' && (
                <Icons
                  style={{ cursor: 'pointer' }}
                  icontype="chart"
                  id="open_panel_user_top_icon"
                  type="panelChart"
                  data-test="open_panel_user_top_icon"
                  className="btnImgTop"
                  onClick={
                    PermissionRO('home', 'panel').read
                      ? () => {
                        panelDrawerOpen();
                        setDeleteChart(false);
                        setQuickPanelStatus(false);
                      }
                      : () => Toaster({ title: "You don't have permission.", type: 'error' })
                  }
                />
              )
            }

          </div>
        )}
      </div>
      {listDashboard.length > 0 && listDashboard.map((d, i) => (
        activeTab === d.token
        && (
          <div ref={drop} className={`${canDrop ? 'isDrop' : 'isMove'} panelDash`} key={i}>
            <Suspense fallback={false}>
              <ResponsiveReactGridLayout
                rowHeight={30}
                cols={{
                  lg: 12, md: 12, sm: 12, xs: 12, xxs: 12,
                }}
                layouts={{ lg: dashTabPanels }}
                onLayoutChange={
                    (layout) => onLayoutChange(layout)
                  }
                measureBeforeMount
                data-test="dnd_provider_Chart"
                id="dnd_provider_Chart"
                useCSSTransforms
                transformScale={1}
                compactType="vertical"
                draggableHandle=".rItemHead"
                isDraggable={d?.editStatus && !paneldeleteModal}
                isResizable={d?.editStatus}
                isDroppable={d?.editStatus}
                onResize={debouncedResize}
                onDrop={onDropInReactGrid}
                droppingItem={{ i: '__dropping-elem__', h: 9, w: 4 }}
              >
                {dashTabPanels.map((p, j) => (
                  <div
                    data-test="drag_and_drop_chart"
                    style={{ minHeight: '350px', maxHeight: '100%' }}
                    key={p.panelToken}
                    data-grid={{
                      x: p?.x,
                      y: p?.y,
                      // w: p.w > 4 ? p.w : 4,
                      // h: p.h > 7 ? p.h : 7,
                      w: p?.w,
                      h: p?.h,
                      minW: 3,
                      minH: 9,
                      isBounded: true,
                      xLabel: p?.xLabel ? p?.xLabel : '',
                      yLabel: p?.yLabel ? p?.yLabel : '',
                      maxH: 18,
                      maxW: 12,
                    }}
                  >
                    <SinglePanle
                      j={j}
                      singlePanle={p}
                      panelsData={panelData[j]}
                      parentDash={d}
                      deleteChart={deleteChart}
                      chartSizeChange={chartSizeChange}
                      deleteBtn={setDeleteChart}
                      setIntervalStatus={setIntervalStatus}
                      setDeleteModal={setPaneldeleteModal}
                      panelDrawerClose={panelDrawerClose}
                    />
                  </div>
                ))}
              </ResponsiveReactGridLayout>
              {dashboardLoading === false && dashTabPanels.length === 0 && !d?.editStatus
                  && (
                    <div className="createPanel">
                      You can drag and drop panels from the library
                      <Icons data-test="panel_open_center" id="panel_open_center" style={{ cursor: 'pointer' }} icontype="chart" type="panelChart" className="btnImg" onClick={PermissionRO('home', 'panel').read ? () => panelDrawerOpen() : () => Toaster({ title: "You don't have permission.", type: 'error' })} />
                    </div>
                  )}
            </Suspense>
          </div>
        )))}
      {paneldeleteModal && (
        <ZsModal
          visible={paneldeleteModal}
          id="delete_dashboard_chart_Modal"
          className="deleteUserModal"
          modaltype="confirm"
          msg={`Are you sure you want to delete this panel from "${listDashboard.filter((t) => t.token === activeTab).length > 0 ? listDashboard.filter((t) => t.token === activeTab)[0]?.dashName : ''}" dashboard?`}
          title="Warning"
          type={false}
          data-test="delete_dashboard_chart_Modal"
          loading={submitPanelDeleteLoading}
          onOk={() => handleOk()}
          onCancel={() => deleteClose()}
        />
      )}

      {activeTab !== 'home' && activeTab !== 'KPI' && dashboardLoading && PermissionRO('home', 'dashboard').read
        && (
          <div className="createPanel">
            <ZsSpin id="DashboardTabsLoading" />
          </div>
        )}
      <Suspense fallback={<ZsSpin id="HomeLoading" />}>
        {
          activeTab === 'home'
          && <HomeEkasha activeTab={activeTab} />
        }
      </Suspense>
      <Suspense fallback={<ZsSpin id="KPILoading" />}>
        {
          activeTab === 'KPI'
          && <KpiEkasha activeTab={activeTab} />
        }
      </Suspense>
      {
        PermissionRO('home', 'panel').read && animation
        && (
          <Suspense fallback={false}>
            <PanelsEkasha
              data-test="panels_ekasha_Drawer"
              show={panelDrawer}
              dropPanel={dropPanel}
              dashTabPanels={dashTabPanels}
              parentDash={listDashboard}
              newPanelModal={newPanelModal}
              setNewPanelModal={handleNewPanelModalChange}
              newPanelPreviewModal={newPanelPreviewModal}
              setNewPanelPreviewModal={handlenewPanelPreviewModalChange}
              quickPanelStatus={quickPanelStatus}
              {...props}
            />
          </Suspense>
        )
      }
      {
        dashboardCreateModal && (
          <Suspense fallback={false}>
            <DashboardCreate
              view={dashboardCreateModal}
              loading={submitLoading}
              closeModal={closeModal}
              modaltype={modaltype}
              values={values}
              valueEdited={valueEdited}
              submit={submitModal}
              submited={submited}
              setData={setData}
            />
          </Suspense>
        )
      }
      <ZsModal
        visible={deleteModal}
        className="deleteUserModal"
        modaltype="confirm"
        msg={`Are you sure you want to delete this ${selectedRow.dashName} ?`}
        title="Warning"
        id="delete_dashboard_Modal"
        type={false}
        data-test="delete_dashboard_Modal"
        loading={submitLoading}
        onOk={() => {
          DeleteDashboardAction(selectedRow.token); setSubmitLoading(true);
        }}
        onCancel={() => {
          closeModal();
        }}
      />
    </DashboardWrapper>
  );
});

Dashboard.propTypes = {
  fakeActionAuth: PropTypes.func,
  panelGetAction: PropTypes.func,
  panelDrawerOpen: PropTypes.func,
  ListDashboardAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  CreateDashboardAction: PropTypes.func,
  UpdateDashboardAction: PropTypes.func,
  GetDashboardAction: PropTypes.func,
  DeleteDashboardAction: PropTypes.func,
  panelDrawerClose: PropTypes.func,
  ListPanelDataAction: PropTypes.func,
  AddPanelAction: PropTypes.func,
  getChartDataAction: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  SaveDashLayout: PropTypes.func,
  RemovePanelAction: PropTypes.func,
};

Dashboard.defaultProps = {
  RemovePanelAction: null,
  fakeActionAuth: null,
  panelGetAction: null,
  panelDrawerOpen: null,
  fakeActionDashboard: null,
  ListDashboardAction: null,
  CreateDashboardAction: null,
  UpdateDashboardAction: null,
  GetDashboardAction: null,
  DeleteDashboardAction: null,
  panelDrawerClose: null,
  ListPanelDataAction: null,
  AddPanelAction: null,
  getChartDataAction: null,
  fakeActionPanel: null,
  SaveDashLayout: null,
};
export default Dashboard;
