/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AllNotifications from '../../../components/layout/TopBar/lib/allNotifications';
import {
  notifyAction, allNotificationAction, visitedAction, fakeActionNotification,
} from '../../../apis/notification/notification.action';

const mapStateToProps = (state) => ({
  NotifyResponse: state.Notification.NotifyResponse,
  GetAllNotificationResponse: state.Notification.GetAllNotificationResponse,
  VisitedNotificationResponse: state.Notification.VisitedNotificationResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    notifyAction, allNotificationAction, visitedAction, fakeActionNotification,
  }, dispatch,
);

const AllNotificationsEkasha = connect(mapStateToProps, mapDispatchToProps)(AllNotifications);

export default AllNotificationsEkasha;
