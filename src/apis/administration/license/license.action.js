import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'license/';

export const getAllLicenseAction = () => {
  const path = `${priFix}getlicense`;
  const responseType = 'GET_LICENSE';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const uploadLicenseAction = (file) => {
  const path = `${priFix}uploadlicense`;
  const form = new FormData();
  form.append('file', file);
  const responseType = 'UPLOAD_LICENSE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionLicense = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_LICENSE' });
};
