import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Panels from '../../pages/panels/panels';
import {
  panelGetAction, fakeActionPanel, panelDelete, panelPreview,
  panelCreate, panelFindByToken, panelUpdate, getIndexFields,
  fetchFields, fetchAggregationFields, panelDrawerOpen, panelDrawerClose,
} from '../../../apis/panel/panel.action';
import { DeletePanelListAction, fakeActionDashboard } from '../../../apis/dashboard/dashboard.actions';

const mapStateToProps = (state) => ({
  GetAllPanelListResponse: state.Panel.GetAllPanelListResponse,
  PanelDeleteResponse: state.Panel.PanelDeleteResponse,
  PanelPreviewResponse: state.Panel.PanelPreviewResponse,
  PanelCreateResponse: state.Panel.PanelCreateResponse,
  PanelFindResponse: state.Panel.PanelFindResponse,
  PanelUpdateResponse: state.Panel.PanelUpdateResponse,
  GetIndexFieldsResponse: state.Panel.GetIndexFieldsResponse,
  FatchQueryFieldsResponse: state.Panel.FatchQueryFieldsResponse,
  FatchQueryAggFieldsResponse: state.Panel.FatchQueryAggFieldsResponse,
  OpenDrawerPanel: state.Panel.OpenDrawerPanel,
  CloseDrawerPanel: state.Panel.CloseDrawerPanel,
  GetDeletePanelListResponse: state.Dashboard.GetDeletePanelListResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    panelGetAction,
    fakeActionPanel,
    panelDelete,
    panelPreview,
    panelCreate,
    panelFindByToken,
    panelUpdate,
    getIndexFields,
    fetchFields,
    fetchAggregationFields,
    panelDrawerOpen,
    panelDrawerClose,
    DeletePanelListAction,
    fakeActionDashboard,
  }, dispatch,
);

const PanelsEkasha = connect(mapStateToProps, mapDispatchToProps)(Panels);

export default PanelsEkasha;
