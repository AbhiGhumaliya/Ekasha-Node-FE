import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { convertTimeBaseTimeZoneFunction, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import ZsBox from '../../../components/box';
import Icons from '../../../components/icons';
import ZsTooltip from '../../../components/tooltip';
import DraggablePanel from '../dashboard/lib/dragPanel';
import Toaster from '../../../components/toaster';
import ZsModal from '../../../components/modal';
import { DeletePanelListWrapper } from './lib/panelWrapper';
import { ZsSpin } from '../../../components/Spin';
import NoData from '../../../components/NoData';

const SingleBoxPanel = React.memo((props) => {
  const {
    listPanel, selectToken, selectedFun, functionMore, selectedOp,
    previewModal, editModal, deleteAction, fakeActionPanel, mask, dashTabPanels,
    dropPanel, setNewPanelModal, DeletePanelListAction, fakeActionDashboard, parentDash,
  } = props;
  // delete modal show
  const [deleteModal, setDeleteModal] = useState(false);

  // singlePanel data
  const [singleData, setSingleData] = useState({});
  // submit loading
  const [submitLoading, setsubmitLoading] = useState(false);
  const [panelListLoad, setPanelListLoad] = useState(false);
  const [panelListOfDelete, setPanelListOfDelete] = useState([]);

  // open delete Modal
  const opneDeleteModal = useCallback((data) => {
    setPanelListLoad(true);
    DeletePanelListAction(data.token);
    setDeleteModal(true);
    setSingleData(data);
    mask(true);
    if (selectToken === data.token) {
      setNewPanelModal(false);
    }
  }, [selectToken]);
  // submit deleteModal
  const submitDelete = useCallback(() => {
    deleteAction(singleData.token);
    setsubmitLoading(true);
  }, [singleData]);
  // close Modal
  const closeModal = useCallback(() => {
    setDeleteModal(false);
    setSingleData({});
    mask(false);
    setsubmitLoading(false);
  }, []);

  const PanelDeleteRes = useSelector((state) => (
    state.Panel.PanelDeleteResponse ? state.Panel.PanelDeleteResponse : {}
  ));
  const GetDeletePanelListRes = useSelector((state) => (
    state.Dashboard.GetDeletePanelListResponse || {}));

  useEffect(() => {
    if (PanelDeleteRes.status) {
      closeModal();
      mask(false);
      fakeActionPanel();
    } else if (PanelDeleteRes.status === false) {
      setsubmitLoading(false);
      fakeActionPanel();
    }
  }, [PanelDeleteRes]);

  useEffect(() => {
    if (GetDeletePanelListRes.status) {
      setPanelListOfDelete(GetDeletePanelListRes.data);
      setPanelListLoad(false);
      fakeActionDashboard();
    } else if (GetDeletePanelListRes.status === false) {
      setPanelListOfDelete([]);
      setPanelListLoad(false);
      fakeActionDashboard();
    }
  }, [GetDeletePanelListRes]);
  const panelBoxContent = (singlePanel, i) => (
    <ZsBox
      key={i}
      id={`panel_box_${i}`}
      style={{
        opacity: dashTabPanels.findIndex((d) => d.panelToken === singlePanel.token) !== -1
        && parentDash[0]?.editStatus ? 0.4 : 1,
        marginTop: i === 0 ? '0' : '6px',
        marginBottom: listPanel.length - 1 === i ? '0' : '5px',
      }}
      boxClass={
          singlePanel.token === selectToken
            ? 'overflowText selectedPanel'
            : 'overflowText'
        }
    >
      <div className="overflowWrap">
        {(parentDash[0]?.editStatus === undefined || parentDash[0].editStatus === false) && (
          <div className="wrapInnerDiv">
            <Icons icontype="common" id="three_dot_op" data-test="three_dot_op" type="overflowEllipsis" onClick={() => functionMore(singlePanel)} />
          </div>
        )}
        <div className={selectedOp && (parentDash[0]?.editStatus === undefined || parentDash[0].editStatus === false) && selectedOp.token === singlePanel.token ? 'overflowOption opOpen' : 'overflowOption'}>
          {
            selectedOp && selectedOp.token === singlePanel.token
              ? (
                <div className="boxIcon">
                  <Icons
                    type="edit"
                    id="panel_chart_edit_icon"
                    icontype="globle"
                    style={{ cursor: 'pointer' }}
                    className="pIcon"
                    data-test="panel_chart_edit_icon"
                    onClick={PermissionRO('home', 'panel').write ? () => editModal(selectedOp.token) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                  />
                  <Icons
                    type="eyeOpen"
                    id="panel_chart_view_open"
                    icontype="common"
                    style={{ cursor: 'pointer' }}
                    className="eyeView"
                    data-test="panel_chart_view_open"
                    onClick={() => previewModal(selectedOp)}
                  />
                  <Icons
                    type="delete"
                    id="panel_chart_delete_icon"
                    icontype="globle"
                    className="pIcon"
                    data-test="panel_chart_delete_icon"
                    style={{ cursor: 'pointer' }}
                    onClick={PermissionRO('home', 'panel').delete ? () => opneDeleteModal(selectedOp) : () => Toaster({ title: "You don't have permission.", type: 'error' })}
                  />
                </div>
              )
              : null
            }
        </div>
      </div>
      <div className="boxContent">
        <div className="iconPanel">
          <Icons
            icontype="chart"
            data-test="select_panel_card"
            id="select_panel_card"
            type={singlePanel.panelType}
            onClick={() => selectedFun(singlePanel.token)}
          />
        </div>
        <div className="dataPanel" style={{ textTransform: 'unset', overflow: 'hidden' }}>
          <ZsTooltip
            autoRight
            // subType="Panel"
            updateStatus={dashTabPanels}
            title={singlePanel.title}
            ids={`panel_Name_Wrap${singlePanel.title}`}
            style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal' }}
          >
            <div
              className="pName panelNameWrap overflowText"
              style={{ height: '22px', width: '147px' }}
              id={`panel_Name_Wrap${singlePanel.title}`}
            >
              {singlePanel.title}
            </div>
          </ZsTooltip>
          <div className="pDescription">{singlePanel.addedBy}</div>
          <div className="pDescription" style={{ float: 'right' }}>
            {' '}
            {convertTimeBaseTimeZoneFunction(singlePanel.createdTime)}
          </div>
        </div>
      </div>
    </ZsBox>
  );
  return (
    <>
      {
        listPanel.map((singlePanel, i) => (
          dashTabPanels.findIndex((d) => d.panelToken === singlePanel.token) === -1
          && parentDash.findIndex((g) => g?.editStatus === true) !== -1 ? (
            <DraggablePanel
              key={i}
              span={panelBoxContent(singlePanel, i)}
              item={singlePanel}
              handleDrop={dropPanel}
            >
              {/* {panelBoxContent(singlePanel, i)} */}
            </DraggablePanel>
            )
            : panelBoxContent(singlePanel, i)
        ))
      }
      <ZsModal
        visible={deleteModal}
        modaltype="confirm"
        msg=""
        // msg="Are you sure you want to delete this panel ?"
        title="Warning"
        id="panelDeleteConform"
        type
        loading={submitLoading}
        confirmType
        onOk={() => submitDelete()}
        onCancel={() => closeModal()}
        closeModal={() => closeModal()}
      >
        <DeletePanelListWrapper>
          <div className="mainBody">
            <div className="modelHeader">
              <div className="rightPartHeader">
                {singleData.title}
              </div>
            </div>
            <div className="title" style={{ marginTop: '3px' }}>This chart is used in following dashboards:</div>
            <div className="modelBody">
              <div className="wrap">
                {panelListLoad ? (
                  <ZsSpin size="middle" id="DashboardPanelListDeleteListLoading" style={{ top: '47%' }} />
                )
                  : !panelListLoad && panelListOfDelete?.length !== 0
                  && panelListOfDelete?.map((d, i) => (
                    <div className="bodyWrapContent" key={i}>{d.dashName}</div>
                  ))}
                {!panelListLoad && panelListOfDelete?.length === 0 && <NoData />}
              </div>
            </div>
            <div className="modelFooter">
              <div className="title">Are you sure to delete this panel?</div>
              <div className="title" style={{ marginTop: '4px' }}>Deleting this panel will break the chart configuration in those dashboard.</div>
            </div>
          </div>
        </DeletePanelListWrapper>
      </ZsModal>
    </>
  );
});
SingleBoxPanel.propTypes = {
  listPanel: PropTypes.oneOfType([PropTypes.array]),
  selectToken: PropTypes.string,
  selectedFun: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  functionMore: PropTypes.func,
  selectedOp: PropTypes.oneOfType([PropTypes.any]),
  previewModal: PropTypes.func,
  editModal: PropTypes.func,
  deleteAction: PropTypes.func,
  mask: PropTypes.func,
  dropPanel: PropTypes.func,
  setNewPanelModal: PropTypes.func,
  DeletePanelListAction: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  dashTabPanels: PropTypes.oneOfType([PropTypes.any]),
  parentDash: PropTypes.oneOfType([PropTypes.any]),
};

SingleBoxPanel.defaultProps = {
  listPanel: [],
  selectToken: '',
  selectedFun: null,
  fakeActionPanel: null,
  functionMore: null,
  selectedOp: null,
  editModal: null,
  previewModal: null,
  deleteAction: null,
  mask: null,
  dropPanel: null,
  setNewPanelModal: null,
  DeletePanelListAction: null,
  fakeActionDashboard: null,
  dashTabPanels: [],
  parentDash: [],
};
export default SingleBoxPanel;
