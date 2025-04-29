import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RiskScoreConfiguration from '../../pages/administration/lib/riskScore';
import { fakeRiskScoreAction, getRiskScoreAction, updateRiskScoreAction } from '../../../apis/administration/riskScore/riskScore.action';

const mapStateToProps = (state) => ({
  GetRiskScoreResponse: state.RiskScore.GetRiskScoreResponse,
  UpdateRiskScoreResponse: state.RiskScore.UpdateRiskScoreResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getRiskScoreAction,
    updateRiskScoreAction,
    fakeRiskScoreAction,
  }, dispatch,
);

const RiskScoreConfigEkasha = connect(mapStateToProps, mapDispatchToProps)(RiskScoreConfiguration);

export default RiskScoreConfigEkasha;
