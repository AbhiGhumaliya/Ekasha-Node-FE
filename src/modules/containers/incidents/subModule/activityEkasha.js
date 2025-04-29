/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Activity from '../../../pages/incidents/lib/subModule/activity';
import {
  getTimeLineAction, fakeIncidentAction,
} from '../../../../apis/incidents/actions';

const mapStateToProps = (state) => ({
  GetTimeLineResponse: state.Incident.GetTimeLineResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getTimeLineAction,
    fakeIncidentAction,
  }, dispatch,
);

const ActivityEkasha = connect(mapStateToProps, mapDispatchToProps)(Activity);

export default ActivityEkasha;
