import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getPasswordPolicyDetailAction,
  updatePasswordPolicyAction,
  fakeActionPolicy,
} from '../../../apis/administration/authenticationPolicy/authenticationPolicy.action';
import authenticationPolicy from '../../pages/administration/lib/users/lib/authenticationPolicy/authenticationPolicyTab';

const mapStateToProps = (state) => ({
  GetPasswordPolicyDetailResponse: state.AuthenticationPolicy.GetPasswordPolicyDetailResponse,
  UpdatePasswordPolicyResponse: state.AuthenticationPolicy.UpdatePasswordPolicyResponse,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getPasswordPolicyDetailAction,
    updatePasswordPolicyAction,
    fakeActionPolicy,
  }, dispatch,
);

const AuthPolicyEkasha = connect(mapStateToProps, mapDispatchToProps)(authenticationPolicy);

export default AuthPolicyEkasha;
