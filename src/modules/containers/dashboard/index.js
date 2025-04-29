import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dashboard from '../../pages/dashboard';
import {
  panelDrawerOpen, panelDrawerClose, panelGetAction, fakeActionPanel,
} from '../../../apis/panel/panel.action';
import {
  ListDashboardAction, fakeActionDashboard, CreateDashboardAction,
  UpdateDashboardAction, GetDashboardAction, DeleteDashboardAction, ListPanelDataAction,
  AddPanelAction, getChartDataAction, SaveDashLayout, RemovePanelAction,
} from '../../../apis/dashboard/dashboard.actions';

const mapStateToProps = (state) => ({
  OpenDrawerPanel: state.Panel.OpenDrawerPanel,
  CloseDrawerPanel: state.Panel.CloseDrawerPanel,
  // home state start
  CreateDashboardResponse: state.Dashboard.CreateDashboardResponse,
  UpdateDashboardResponse: state.Dashboard.UpdateDashboardResponse,
  GetDashboardResponse: state.Dashboard.GetDashboardResponse,
  DeleteDashboardResponse: state.Dashboard.DeleteDashboardResponse,
  GetAllListDashboardResponse: state.Dashboard.GetAllListDashboardResponse,
  ListPanelDashboardResponse: state.Dashboard.ListPanelDashboardResponse,
  GetChartDataResponse: state.Dashboard.GetChartDataResponse,
  SaveDashboardEditdResponse: state.Dashboard.SaveDashboardEditdResponse,
  AddChartDashboardResponse: state.Dashboard.AddChartDashboardResponse,
  RemovePanelChartResponse: state.Dashboard.RemovePanelChartResponse,
  TimeFilterUpdate: state.Dashboard.TimeFilterUpdate,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    panelDrawerOpen,
    panelDrawerClose,
    panelGetAction,
    fakeActionPanel,
    // home actions start
    ListDashboardAction,
    fakeActionDashboard,
    CreateDashboardAction,
    UpdateDashboardAction,
    GetDashboardAction,
    DeleteDashboardAction,
    ListPanelDataAction,
    getChartDataAction,
    AddPanelAction,
    SaveDashLayout,
    RemovePanelAction,
  }, dispatch,
);

const DashboardEkasha = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default DashboardEkasha;
