/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Assets from '../../../pages/incidents/lib/subModule/assets';
import {
  getAllAssetesStatus, fakeAssetsIncidentAction, assignToIncident, removeAassignToIncident,
  getAssetData,
} from '../../../../apis/incidents/subModule/Assets/Assets.action';
import {
  getAllIncidentAssetsAction, fakeActionAssets,
} from '../../../../apis/administration/assets/assets.action';
import { getCountryCodeAction, fakeActionUser } from '../../../../apis/administration/users/user.actions';

const mapStateToProps = (state) => ({
  GetAllIncidentAssetsResponse: state.Assets.GetAllIncidentAssetsResponse,
  AssignToIncidentResponse: state.IncAssets.AssignToIncidentResponse,
  RemoveAssignToIncidentResponse: state.IncAssets.RemoveAssignToIncidentResponse,
  GetAllAssetsStatusResponse: state.IncAssets.GetAllAssetsStatusResponse,
  GetAssetsDataResponse: state.IncAssets.GetAssetsDataResponse,
  CountryCodeGetAllResponse: state.User.CountryCodeGetAllResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fakeActionUser,
    getCountryCodeAction,
    getAllAssetesStatus,
    fakeAssetsIncidentAction,
    getAllIncidentAssetsAction,
    fakeActionAssets,
    assignToIncident,
    removeAassignToIncident,
    getAssetData,
  }, dispatch,
);

const IncidentAssetsEkasha = connect(mapStateToProps, mapDispatchToProps)(Assets);

export default IncidentAssetsEkasha;
