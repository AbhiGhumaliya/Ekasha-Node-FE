import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'attributeAnalysis/';

export const changeAttributeAnalysisAction = (data) => {
  const path = `${priFix}analysis`;
  const responseType = 'CHANGE_ATTRIBUTE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const changeFieldAttributeAnalysisAction = (data) => {
  const path = `${priFix}attribute`;
  const responseType = 'CHANGE_FIELD_ATTRIBUTE';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeAttributeAnalysisAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ATTRIBUTE_ACTION' });
};
