import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Proxy from '../../pages/administration/lib/proxy/index';
import {
  getAllProxyAction, fakeActionProxy, deleteProxyAction,
  addProxyAction, getSingleProxyAction, updateProxyAction,
} from '../../../apis/administration/proxy/proxy.action';

const mapStateToProps = (state) => ({
  GetAllProxyResponse: state.Proxy.GetAllProxyResponse,
  ProxyDeleteResponse: state.Proxy.ProxyDeleteResponse,
  AddProxyResponse: state.Proxy.AddProxyResponse,
  GetSingleProxyResponse: state.Proxy.GetSingleProxyResponse,
  UpdateProxyResponse: state.Proxy.UpdateProxyResponse,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllProxyAction,
    fakeActionProxy,
    deleteProxyAction,
    addProxyAction,
    getSingleProxyAction,
    updateProxyAction,
  }, dispatch,
);

const ProxyEkasha = connect(mapStateToProps, mapDispatchToProps)(Proxy);

export default ProxyEkasha;
