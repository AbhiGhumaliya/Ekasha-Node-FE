import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'actionApproval/';

export const declineActionApprove = (email, token, comment, customerID) => {
  const path = `${priFix}decline/${email}/${token}/${comment}/${customerID}`;
  const responseType = 'DECLINE_ACTION_APPROVAL';
  return axiosCall('get', path, responseType, null);
};

export const checkTokenExipred = (email, token) => {
  const path = `${priFix}checkTokenIsDecline/${email}/${token}`;
  const responseType = 'CHECK_DECLINE_ACTION';
  return axiosCall('get', path, responseType, null);
};

export const fakeActionApproval = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_APPROVAL' });
};
