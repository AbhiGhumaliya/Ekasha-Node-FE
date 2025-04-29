import axiosCall from '../../../configurations/redux/AxiosCall';

export const refreshToken = () => {
  const path = 'auth/refreshtoken';
  const responseType = 'RESET_TOKEN_AUTH';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${localStorage.getItem('U_TOKENS') !== null ? JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken : ''}`, isRefreshToken: true });
};

export const fakeActionResetToken = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_RESET_TOKEN' });
};
