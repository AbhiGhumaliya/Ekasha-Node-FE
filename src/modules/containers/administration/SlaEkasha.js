import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sla from '../../pages/administration/lib/sla';
import { findAllSlaAction, fakeActionSla, updateSlaAction } from '../../../apis/administration/sla/sla.action';
import { fakeRiskWeightageAction, findAllRiskWeightageAction, updateRiskWeightageAction } from '../../../apis/administration/riskWeightage/riskWeightage.action';

const mapStateToProps = (state) => ({
  FindAllSlaResponse: state.Sla.FindAllSlaResponse,
  UpdateSlaResponse: state.Sla.UpdateSlaResponse,
  FindAllRiskWeightageResponse: state.RiskWeightage.FindAllRiskWeightageResponse,
  UpdateRiskWeightageResponse: state.RiskWeightage.UpdateRiskWeightageResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    findAllSlaAction,
    updateSlaAction,
    fakeActionSla,
    findAllRiskWeightageAction,
    updateRiskWeightageAction,
    fakeRiskWeightageAction,
  }, dispatch,
);

const SlaEkasha = connect(mapStateToProps, mapDispatchToProps)(Sla);

export default SlaEkasha;
