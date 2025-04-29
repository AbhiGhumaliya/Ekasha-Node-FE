import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Setup from '../../../pages/authentication/lib/setup';
import {
  fakeActionSetup,
  TestLdapConnection,
  timeZoneListSetup,
  licenceConfigAction,
  LdapConfigAction,
  SyslogConfigAction,
  SslConfigAction,
  clientSetupAction,
  timeZoneConfigAction,
  AddUserAction,
} from '../../../../apis/authentication/lib/setup/setup.action';

const mapStateToProps = (state) => ({
  LdapTestConnectionResponse: state.Setup.LdapTestConnectionResponse,
  TimeZoneListSetupResponse: state.Setup.TimeZoneListSetupResponse,
  SslConfigSetupResponse: state.Setup.SslConfigSetupResponse,
  LicenceConfigResponse: state.Setup.LicenceConfigResponse,
  LdapConfigResponse: state.Setup.LdapConfigResponse,
  SyslogConfigResponse: state.Setup.SyslogConfigResponse,
  ClientDetailSetupResponse: state.Setup.ClientDetailSetupResponse,
  TimeZoneConfigSetupResponse: state.Setup.TimeZoneConfigSetupResponse,
  AddUserResponse: state.Setup.AddUserResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    TestLdapConnection,
    timeZoneListSetup,
    licenceConfigAction,
    LdapConfigAction,
    SyslogConfigAction,
    SslConfigAction,
    clientSetupAction,
    timeZoneConfigAction,
    AddUserAction,
    fakeActionSetup,
  }, dispatch,
);

const SetupEkasha = connect(mapStateToProps, mapDispatchToProps)(Setup);

export default SetupEkasha;
