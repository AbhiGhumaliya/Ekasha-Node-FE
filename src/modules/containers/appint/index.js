import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppInt from '../../pages/appsint';
import {
  getAllConfiguredAction, fakeActionApps, getByAppsDeviceAction, getListAsset,
  deleteIntegration, getProxyDevice, addIntegration, getAllAppsTagsListAction,
  getIntegration, updateIntegration, getAllSmtpList,
  filterSearchAppsAction, ActionStatusUpdateAction,
} from '../../../apis/appinit/actions';

const mapStateToProps = (state) => ({
  GetAllConfiguresResponse: state.APPS.GetAllConfiguresResponse,
  GetAppsDeviceActionResponse: state.APPS.GetAppsDeviceActionResponse,
  GetProxyDeviceResponse: state.APPS.GetProxyDeviceResponse,
  DeleteIntegrationResponse: state.APPS.DeleteIntegrationResponse,
  AddIntegrationResponse: state.APPS.AddIntegrationResponse,
  UpdateIntegrationResponse: state.APPS.UpdateIntegrationResponse,
  GetIntegrationResponse: state.APPS.GetIntegrationResponse,
  GetListAssetResponse: state.APPS.GetListAssetResponse,
  GetAllSmtpListResponse: state.APPS.GetListAssetResponse,
  GetAllAppsTagsListResponse: state.APPS.GetAllAppsTagsListResponse,
  GetAllSearchAppsResponse: state.APPS.GetAllSearchAppsResponse,
  ActionStatusUpdateResponse: state.APPS.ActionStatusUpdateResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllSmtpList,
    getAllConfiguredAction,
    getByAppsDeviceAction,
    getListAsset,
    deleteIntegration,
    addIntegration,
    updateIntegration,
    getProxyDevice,
    getIntegration,
    fakeActionApps,
    getAllAppsTagsListAction,
    filterSearchAppsAction,
    ActionStatusUpdateAction,
  }, dispatch,
);

const AppIntEkasha = connect(mapStateToProps, mapDispatchToProps)(AppInt);

export default AppIntEkasha;
