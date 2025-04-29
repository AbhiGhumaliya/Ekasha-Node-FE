/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Timelineincident from '../../../pages/incidents/lib/subModule/timeLine';
import {
  getTimeLineAction, fakeIncidentAction,
} from '../../../../apis/incidents/actions';

const mapStateToProps = (state) => ({
  GetTimeLineResponse: state.Incident.GetTimeLineResponse,
  CloseDrawerPanel: state.Panel.CloseDrawerPanel,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getTimeLineAction,
    fakeIncidentAction,
  }, dispatch,
);

const TimelineEkasha = connect(mapStateToProps, mapDispatchToProps)(Timelineincident);

export default TimelineEkasha;
