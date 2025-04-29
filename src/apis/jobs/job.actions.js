import axiosCall from '../../configurations/redux/AxiosCall';

const priFix = 'job/';
export const getAllJobAction = (data) => {
  const path = `${priFix}getAllJobs`;
  const responseType = 'GET_ALL_JOBS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionJob = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_JOB' });
};
