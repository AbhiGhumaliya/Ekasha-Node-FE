import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Client from '../../pages/administration/lib/clientdetail';
import { getClientDataAction, fakeActionClient, addClientDetailAction } from '../../../apis/administration/clientDetails/clientDetail.action';
import { getCountryCodeAction, fakeActionUser } from '../../../apis/administration/users/user.actions';

const mapStateToProps = (state) => ({
  GetClientDataResponse: state.Client.GetClientDataResponse,
  AddClientDataResponse: state.Client.AddClientDataResponse,
  CountryCodeGetAllResponse: state.User.CountryCodeGetAllResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getClientDataAction,
    fakeActionClient,
    addClientDetailAction,
    getCountryCodeAction,
    fakeActionUser,
  }, dispatch,
);

const ClientDetailEkasha = connect(mapStateToProps, mapDispatchToProps)(Client);

export default ClientDetailEkasha;
