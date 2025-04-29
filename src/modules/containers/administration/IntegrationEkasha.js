import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Integration from '../../pages/administration/lib/integration';
import {
  getAllIntegration, fakeActionIntegration, getAllFieldsAction, addIntegrationAction,
  getSingleIntegration, deleteIntegrationAction, updateIntegrationAction,
  getAllIntegrationRule,
} from '../../../apis/administration/integration/integration.action';

const mapStateToProps = (state) => ({
  GetAllIntegration: state.Integration.GetAllIntegration,
  GetSingleIntegration: state.Integration.GetSingleIntegration,
  DeleteIntegrationResponse: state.Integration.DeleteIntegrationResponse,
  GetAllFieldsResponse: state.Integration.GetAllFieldsResponse,
  AddIntegrationResponse: state.Integration.AddIntegrationResponse,
  UpdateIntegrationResponse: state.Integration.UpdateIntegrationResponse,
  GetAllIntegrationForRule: state.Integration.GetAllIntegrationForRule,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllIntegration,
    getSingleIntegration,
    fakeActionIntegration,
    getAllFieldsAction,
    updateIntegrationAction,
    addIntegrationAction,
    deleteIntegrationAction,
    getAllIntegrationRule,
  }, dispatch,
);

const IntegrationEkasha = connect(mapStateToProps, mapDispatchToProps)(Integration);

export default IntegrationEkasha;
