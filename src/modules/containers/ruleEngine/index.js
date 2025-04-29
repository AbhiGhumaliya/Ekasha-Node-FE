/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RuleEngine from '../../pages/rule-engine';
import {
  getRuleDataAction, fakeActionRuleAction, ruleStatusAction, ruleDeleteAction,
  ruleInsertAction, ruleOneAction, ruleUpdateAction, updatePosition,
} from '../../../apis/rule-engine/ruleEngine.actions';
import { GetOwnerAction, fakeActionAssets } from '../../../apis/administration/assets/assets.action';
import {
  fakeActionIntegration, getAllFieldsAction, getAllIntegrationRule,
} from '../../../apis/administration/integration/integration.action';
import { fakeIncidentAction } from '../../../apis/incidents/actions';

const mapStateToProps = (state) => ({
  GetAllRuleListResponse: state.RuleEngines.GetAllRuleListResponse,
  RuleEngineStatusResponse: state.RuleEngines.RuleEngineStatusResponse,
  RuleEngineDeleteResponse: state.RuleEngines.RuleEngineDeleteResponse,
  UpdateRuleEngineResponse: state.RuleEngines.UpdateRuleEngineResponse,
  RuleEngineAddResponse: state.RuleEngines.RuleEngineAddResponse,
  RuleEnginePositionUpdtResponse: state.RuleEngines.RuleEnginePositionUpdtResponse,
  RuleEngineGetOneResponse: state.RuleEngines.RuleEngineGetOneResponse,
  GetOwnerResponse: state.Assets.GetOwnerResponse,
  GetAllIntegrationForRule: state.Integration.GetAllIntegrationForRule,
  GetAllFieldsResponse: state.Integration.GetAllFieldsResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getRuleDataAction,
    getAllIntegrationRule,
    ruleUpdateAction,
    fakeActionRuleAction,
    ruleStatusAction,
    ruleDeleteAction,
    GetOwnerAction,
    fakeActionAssets,
    fakeActionIntegration,
    getAllFieldsAction,
    fakeIncidentAction,
    ruleInsertAction,
    ruleOneAction,
    updatePosition,
  }, dispatch,
);

const RuleEngineEkasha = connect(mapStateToProps, mapDispatchToProps)(RuleEngine);

export default RuleEngineEkasha;
