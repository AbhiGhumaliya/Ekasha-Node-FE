import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ssl from '../../pages/administration/lib/ssl';
import {
  getSslData, addSslAction, deleteSslData, fakeActionSsl,
} from '../../../apis/administration/ssl/ssl.action';

const mapStateToProps = (state) => ({
  GetSslResponse: state.Ssl.GetSslResponse,
  AddSslResponse: state.Ssl.AddSslResponse,
  DeleteSslResponse: state.Ssl.DeleteSslResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getSslData, addSslAction, deleteSslData, fakeActionSsl,
  }, dispatch,
);

const SslEkasha = connect(mapStateToProps, mapDispatchToProps)(Ssl);

export default SslEkasha;
