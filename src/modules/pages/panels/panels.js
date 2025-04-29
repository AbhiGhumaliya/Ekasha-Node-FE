import React, {
  useState, useEffect, lazy, Suspense, useContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PermissionRO } from '../../../helpers/lib/StorageHandlers';
import { PanelWrapper } from './lib/panelWrapper';
import ZsDrawer from '../../../components/drawer';
import Icons from '../../../components/icons';
import ZsInput from '../../../components/forms/input';
import NoData from '../../../components/NoData';
import Toaster from '../../../components/toaster';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import { retryLazy } from '../../../helpers/envData';
import { TimeFilContext } from '../../containers/TimeFilterContext';

const SingleBoxPanel = lazy(() => retryLazy(() => import('./singlePanelBox')));
const PreviewPanelModal = lazy(() => retryLazy(() => import('./preview')));
const AddPanelModal = lazy(() => retryLazy(() => import('./addPanel')));

let subscribe;

const Panels = React.memo((props) => {
  const {
    show, fakeActionPanel, panelGetAction, panelDelete, panelPreview, dashTabPanels,
    panelCreate, panelFindByToken, panelUpdate, getIndexFields, fetchFields, parentDash,
    fetchAggregationFields, panelDrawerClose, dropPanel, DeletePanelListAction, fakeActionDashboard,
    newPanelModal, setNewPanelModal, newPanelPreviewModal, setNewPanelPreviewModal, CloseDrawer,
    quickPanelStatus,
  } = props;

  // list in panel
  const [panels, setPanels] = useState([]);
  const [panelsView, setPanelsView] = useState([]);
  const [panelsViewLoadind, setPanelsViewLoadind] = useState(false);
  // select card
  const [select, setSelect] = useState('');
  const [showMore, setShowMore] = useState();
  const [mask, setMask] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [timer, setTimer] = useState(null);

  const {
    dashIntervalStatus,
  } = useContext(TimeFilContext);

  const GetAllPanelListRes = useSelector((state) => (
    state.Panel.GetAllPanelListResponse || {}
  ));

  const PanelUpdateRes = useSelector((state) => (
    state.Panel.PanelUpdateResponse ? state.Panel.PanelUpdateResponse : {}
  ));

  const PanelFindRes = useSelector((state) => (
    state.Panel.PanelFindResponse ? state.Panel.PanelFindResponse : {}
  ));

  const PanelPreviewRes = useSelector((state) => (
    state.Panel.PanelPreviewResponse ? state.Panel.PanelPreviewResponse : {}
  ));

  const PanelDeleteRes = useSelector((state) => (
    state.Panel.PanelDeleteResponse || {}
  ));

  const closeModal = useCallback(() => {
    setModalType('');
    setNewPanelModal(false);
    setShowMore();
    setNewPanelPreviewModal(false);
  }, []);

  const opneChartModal = useCallback((type) => {
    closeModal();
    setModalType(type);
    setNewPanelModal(true);
  }, []);

  const selectCard = useCallback((token) => {
    closeModal();
    setSelect(token);
  }, []);

  const selectOp = useCallback((singleData) => {
    setShowMore(singleData);
    setNewPanelPreviewModal(false);
  }, []);

  const previewChart = useCallback((data) => {
    closeModal();
    setPanelsViewLoadind(true);
    panelPreview(data);
    setSelect(data.token);
    setShowMore();
  }, []);

  const findPanelData = useCallback((token) => {
    panelFindByToken(token);
    setSelect(token);
    closeModal();
  }, []);

  const rptSearchClear = useCallback(() => {
    setSearchValue('');
    panelGetAction('', localStorage.getItem('customerID'));
  }, []);

  const ownerChangeHandler = useCallback((value) => {
    setSearchValue(value);
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      panelGetAction(value, localStorage.getItem('customerID'));
    }, 500);

    setTimer(newTimer);
  }, []);

  const panelUpdateSock = (dataRes) => {
    if (dataRes.status) {
      setSearchValue((pre) => {
        setPanels((prevState) => {
          const index = prevState.findIndex((e) => e.token === dataRes.data.token);
          if (index !== -1) {
            const a = prevState;
            a[index] = dataRes.data;
            const filterData = a.filter(
              (d) => d.title?.toLowerCase()?.includes(pre?.toLowerCase()),
            );
            return [...filterData];
          }
          return prevState;
        });
        return pre;
      });
    }
  };

  const onPaneldataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'panel') {
      switch (dataRes.operation) {
        case 'delete':
          if (dataRes.status) {
            setPanels((prevState) => (prevState.filter((e) => e.token !== dataRes.data)));
          }
          break;
        case 'add':
          if (dataRes.status) {
            if (dataRes.data.customerID === localStorage.getItem('customerID')) {
              setSearchValue((pre) => {
                setPanels((prevState) => {
                  if (prevState.findIndex((e) => e.token === dataRes.data.token) === -1
                && dataRes.data?.title?.toLowerCase()?.includes(pre?.toLowerCase())) {
                    return [dataRes.data, ...prevState];
                  }
                  return prevState;
                });
                return pre;
              });
            }
          }
          break;
        case 'update':
          panelUpdateSock(dataRes);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (quickPanelStatus) {
      setModalType('new');
      setNewPanelModal(true);
    }
  }, [quickPanelStatus]);

  useEffect(() => {
    if (CloseDrawer === 'PANEL_DRAWER_CLOSE') {
      setNewPanelModal(false);
      setNewPanelPreviewModal(false);
    }
  }, [CloseDrawer]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onPaneldataReceived);
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
    if (PanelDeleteRes.status) {
      setMask(false);
    }
  }, [PanelDeleteRes]);

  useEffect(() => {
    if (GetAllPanelListRes.status) {
      setPanels(GetAllPanelListRes.data);
      fakeActionPanel();
    } else if (GetAllPanelListRes.status === false) {
      setPanels([]);
      fakeActionPanel();
    }
  }, [GetAllPanelListRes]);

  useEffect(() => {
    if (PanelPreviewRes.status) {
      setPanelsViewLoadind(false);
      setNewPanelPreviewModal(true);
      if (PanelPreviewRes.data[0].data.length !== 0) {
        setPanelsView(PanelPreviewRes.data[0]);
      } else {
        setPanelsView([]);
      }
      fakeActionPanel();
    } else if (PanelPreviewRes.status === false) {
      setPanelsViewLoadind(false);
      setPanelsView([]);
      fakeActionPanel();
    }
  }, [PanelPreviewRes]);

  useEffect(() => {
    if (newPanelPreviewModal) {
      setShowMore();
    }
    if (!show) {
      closeModal();
    }
  }, [newPanelPreviewModal, show]);

  useEffect(() => {
    if (PanelUpdateRes.status) {
      setModalType('');
      setNewPanelModal(false);
      fakeActionPanel();
    } else if (PanelUpdateRes.status === false) {
      fakeActionPanel();
    }
  }, [PanelUpdateRes]);

  useEffect(() => {
    if (PanelFindRes.status) {
      opneChartModal('edit');
    } else if (PanelFindRes.status === false) {
      fakeActionPanel();
    }
  }, [PanelFindRes]);

  useEffect(() => {
    if (dashIntervalStatus) {
      setSearchValue('');
    }
  }, [dashIntervalStatus]);

  return (
    <PanelWrapper data-test="panel_wrapper">
      <ZsDrawer
        data-test="dashboard_pane__Drawer"
        show={show}
        id="dashboard_pane__Drawer"
        mask={mask}
        modalClass="PanelDrawer userDrawer"
      >
        <div className="panelMainData">
          <div className="zsDrawerHeader">
            <div className="zsDrawerTitle">Panel Library</div>
            <Icons data-test="close_panel_drawer" id="close_panel_drawer" icontype="globle" onClick={() => { panelDrawerClose(); setSearchValue(''); setNewPanelModal(false); }} className="closeIcon" type="close" />
          </div>
          <div className="drawerContent">
            <div className="topPanelActions">
              <div style={{ width: '84%' }}>
                <ZsInput
                  inputtype="search"
                  id="panel_data_search"
                  data-test="panel_data_search"
                  placeholdertext="Search for Panel Name"
                  value={searchValue}
                  maxLength="normal"
                  onChange={(e) => ownerChangeHandler(e.target.value)}
                  searchclear={rptSearchClear}
                />
              </div>
              <Icons
                id="PanelIcon_open"
                data-test="panel_create_chart"
                type="addNewButtonSmall"
                icontype="globle"
                className="addPanelIcon"
                style={{
                  cursor: 'pointer',
                  height: '27px',
                  marginTop: '8px',
                  pointerEvents: !parentDash[0]?.editStatus ? 'auto' : 'none',
                  opacity: PermissionRO('home', 'panel').write && !parentDash[0]?.editStatus ? 1 : 0.4,
                }}
                onClick={PermissionRO('home', 'panel').write ? () => opneChartModal('new') : () => Toaster({ title: "You don't have permission.", type: 'error' })}
              />
            </div>
            <div style={{
              height: 'calc(100% - 50px)', overflow: 'auto', paddingRight: '5px', marginTop: '5px',
            }}
            >
              {
              panels.length > 0
                ? (
                  <Suspense fallback={false}>
                    <SingleBoxPanel
                      listPanel={panels}
                      data-test="more_op_pane_view"
                      selectedFun={selectCard}
                      selectToken={select}
                      setNewPanelModal={setNewPanelModal}
                      functionMore={selectOp}
                      selectedOp={showMore}
                      deleteAction={panelDelete}
                      DeletePanelListAction={DeletePanelListAction}
                      fakeActionDashboard={fakeActionDashboard}
                      fakeActionPanel={fakeActionPanel}
                      mask={setMask}
                      previewModal={previewChart}
                      closeView={newPanelPreviewModal}
                      editModal={findPanelData}
                      dropPanel={dropPanel}
                      dashTabPanels={dashTabPanels}
                      parentDash={parentDash}
                    />
                  </Suspense>
                )
                : (<div style={{ height: 'calc(100vh - 260px)' }}><NoData /></div>)
            }
            </div>
          </div>
        </div>
        {
          newPanelPreviewModal
          && (
            <Suspense fallback={false}>
              <PreviewPanelModal
                data-test="view_chart_modal"
                newPanelPreviewModal={newPanelPreviewModal}
                setNewPanelPreviewModal={setNewPanelPreviewModal}
                panelsView={panelsView}
                panelsViewLoadind={panelsViewLoadind}
              />
            </Suspense>
          )
        }
        {
          newPanelModal
          && (
            <Suspense fallback={false}>
              <AddPanelModal
                newPanelModal={newPanelModal}
                modalType={modalType}
                panelCreate={panelCreate}
                fakeActionPanel={fakeActionPanel}
                closeModal={closeModal}
                actionUpdate={panelUpdate}
                getIndexFields={getIndexFields}
                fetchFields={fetchFields}
                fetchAggregationFields={fetchAggregationFields}
              />
            </Suspense>
          )
        }
      </ZsDrawer>
    </PanelWrapper>
  );
});

Panels.propTypes = {
  CloseDrawer: PropTypes.func,
  getIndexFields: PropTypes.func,
  fetchAggregationFields: PropTypes.func,
  fetchFields: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  panelGetAction: PropTypes.func,
  panelDelete: PropTypes.func,
  panelPreview: PropTypes.func,
  panelCreate: PropTypes.func,
  panelFindByToken: PropTypes.func,
  panelUpdate: PropTypes.func,
  panelDrawerClose: PropTypes.func,
  dropPanel: PropTypes.func,
  DeletePanelListAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  dashTabPanels: PropTypes.func,
  show: PropTypes.bool,
  parentDash: PropTypes.oneOfType([PropTypes.any]),
  newPanelModal: PropTypes.bool,
  setNewPanelModal: PropTypes.func,
  newPanelPreviewModal: PropTypes.bool,
  setNewPanelPreviewModal: PropTypes.func,
  quickPanelStatus: PropTypes.bool,
};

Panels.defaultProps = {
  CloseDrawer: null,
  getIndexFields: null,
  fetchAggregationFields: null,
  fetchFields: null,
  fakeActionPanel: null,
  panelGetAction: null,
  panelDelete: null,
  panelCreate: null,
  panelPreview: null,
  panelFindByToken: null,
  panelUpdate: null,
  panelDrawerClose: null,
  dropPanel: null,
  DeletePanelListAction: null,
  fakeActionDashboard: null,
  dashTabPanels: null,
  show: false,
  parentDash: {},
  newPanelModal: false,
  setNewPanelModal: null,
  newPanelPreviewModal: false,
  setNewPanelPreviewModal: null,
  quickPanelStatus: false,
};
export default Panels;
