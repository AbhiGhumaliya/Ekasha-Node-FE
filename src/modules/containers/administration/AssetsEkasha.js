import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Assets from '../../pages/administration/lib/assets';
import {
  getAllAssetsAction, InsertAssetsFileAction, insertAssetsAction, updateAssetsAction,
  deleteAssetsAction, changeAssetsStatusAction, getSingleAssetAction,
  fakeActionAssets, GetOwnerAction,
} from '../../../apis/administration/assets/assets.action';
import { fakeAssetsIncidentAction } from '../../../apis/incidents/subModule/Assets/Assets.action';
import { getCountryCodeAction, fakeActionUser } from '../../../apis/administration/users/user.actions';

const mapStateToProps = (state) => ({
  GetAllAssetsResponse: state.Assets.GetAllAssetsResponse,
  InsertAssetsFileResponse: state.Assets.InsertAssetsFileResponse,
  InsertAssetsResponse: state.Assets.InsertAssetsResponse,
  UpdateAssetsResponse: state.Assets.UpdateAssetsResponse,
  ChangeAssetsStatusResponse: state.Assets.ChangeAssetsStatusResponse,
  GetSingleAssetsResponse: state.Assets.GetSingleAssetsResponse,
  DeleteAssetsResponse: state.Assets.DeleteAssetsResponse,
  GetOwnerResponse: state.Assets.GetOwnerResponse,
  openAssetsModal: state.IncAssets.openAssetsModal,
  CountryCodeGetAllResponse: state.User.CountryCodeGetAllResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllAssetsAction,
    InsertAssetsFileAction,
    insertAssetsAction,
    updateAssetsAction,
    deleteAssetsAction,
    changeAssetsStatusAction,
    getSingleAssetAction,
    GetOwnerAction,
    fakeActionAssets,
    fakeAssetsIncidentAction,
    getCountryCodeAction,
    fakeActionUser,
  }, dispatch,
);

const AssetsEkasha = connect(mapStateToProps, mapDispatchToProps)(Assets);

export default AssetsEkasha;
