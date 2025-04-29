import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Server from '../../pages/administration/lib/server';
import {
  statusAction, startServerAction, stopServerAction, getQueueDataAction, rabbitMQChangePassAction,
  fakeServerAction, restartServerAction, changePortAction,
} from '../../../apis/administration/server/server.action';

const mapStateToProps = (state) => ({
  StatusOfServerResponse: state.Server.StatusOfServerResponse,
  RestartServerResponse: state.Server.RestartServerResponse,
  ChangePortResponse: state.Server.ChangePortResponse,
  StartServerResponse: state.Server.StartServerResponse,
  StopServerResponse: state.Server.StopServerResponse,
  GetQueueDataResponse: state.Server.GetQueueDataResponse,
  RabbitChangePassResponse: state.Server.RabbitChangePassResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    statusAction,
    startServerAction,
    stopServerAction,
    rabbitMQChangePassAction,
    restartServerAction,
    getQueueDataAction,
    changePortAction,
    fakeServerAction,
  }, dispatch,
);

const ServerEkasha = connect(mapStateToProps, mapDispatchToProps)(Server);

export default ServerEkasha;
