import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Critical from '../../pages/administration/lib/criticalUser';
import {
  getAllCriticalUserAction,
  getSingleCriticalAction,
  addCriticalUserAction,
  updateCriticalUserAction,
  deleteCriticalUserAction,
  importCriticalUserAction,
  fakeActionCriticalUser,
} from '../../../apis/administration/criticalUser/criticalUser.action';

const mapStateToProps = (state) => ({
  GetAllCriticalUserResponse: state.Critical.GetAllCriticalUserResponse,
  AddCriticalUserResponse: state.Critical.AddCriticalUserResponse,
  UpdateCriticalUserResponse: state.Critical.UpdateCriticalUserResponse,
  GetSingleCriticalUserResponse: state.Critical.GetSingleCriticalUserResponse,
  CriticalUserDeleteResponse: state.Critical.CriticalUserDeleteResponse,
  CriticalUserImportResponse: state.Critical.CriticalUserImportResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllCriticalUserAction,
    getSingleCriticalAction,
    addCriticalUserAction,
    updateCriticalUserAction,
    deleteCriticalUserAction,
    importCriticalUserAction,
    fakeActionCriticalUser,
  }, dispatch,
);

const CriticalEkasha = connect(mapStateToProps, mapDispatchToProps)(Critical);

export default CriticalEkasha;
