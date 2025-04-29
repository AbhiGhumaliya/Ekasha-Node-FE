import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EscalationRules from '../../pages/administration/lib/escalationRules';
import {
  getEscalateRulesAction, addEscalateRulesAction, changeStatusAction, getSingleRuleAction,
  updateEscalateRulesAction, deleteEscalateRulesAction, fakeEscalateRulesAction,
} from '../../../apis/administration/escalationRules/escalationRules.action';
import { GetOwnerAction, fakeActionAssets } from '../../../apis/administration/assets/assets.action';
import { rolesListAction, fakeActionRole } from '../../../apis/administration/roles/role.actions';

const mapStateToProps = (state) => ({
  GetEscalateRulesResponse: state.EscalateRules.GetEscalateRulesResponse,
  AddEscalateRulesResponse: state.EscalateRules.AddEscalateRulesResponse,
  ChangeStatusResponse: state.EscalateRules.ChangeStatusResponse,
  getSingleRuleResponse: state.EscalateRules.getSingleRuleResponse,
  updateEscalateRulesResponse: state.EscalateRules.updateEscalateRulesResponse,
  deleteEscalateRulesResponse: state.EscalateRules.deleteEscalateRulesResponse,
  GetAllOwnerResponse: state.Assets.GetAllOwnerResponse,
  RoleListResponse: state.Role.RoleListResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getEscalateRulesAction,
    addEscalateRulesAction,
    changeStatusAction,
    GetOwnerAction,
    getSingleRuleAction,
    updateEscalateRulesAction,
    deleteEscalateRulesAction,
    fakeEscalateRulesAction,
    fakeActionAssets,
    rolesListAction,
    fakeActionRole,
  }, dispatch,
);

const EscalationRulesEkasha = connect(mapStateToProps, mapDispatchToProps)(EscalationRules);

export default EscalationRulesEkasha;
