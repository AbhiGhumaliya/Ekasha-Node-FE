import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ldap from '../../pages/administration/lib/ldap';
import {
  getLdapction,
  deleteLdapAction,
  testLdapAction,
  fakeActionLdap,
  updateLdapAction,
  createLdapAction,
} from '../../../apis/administration/ldap/ldap.action';

const mapStateToProps = (state) => ({
  GetAllLdapResponse: state.Ldap.GetAllLdapResponse,
  DeleteLdapResponse: state.Ldap.DeleteLdapResponse,
  TestLdapResponse: state.Ldap.TestLdapResponse,
  UpdateLdapResponse: state.Ldap.UpdateLdapResponse,
  CreateLdapResponse: state.Ldap.CreateLdapResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getLdapction,
    deleteLdapAction,
    testLdapAction,
    fakeActionLdap,
    updateLdapAction,
    createLdapAction,
  }, dispatch,
);

const LdapEkasha = connect(mapStateToProps, mapDispatchToProps)(Ldap);

export default LdapEkasha;
