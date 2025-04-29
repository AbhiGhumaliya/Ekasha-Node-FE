import axiosCall from '../../../../configurations/redux/AxiosCall';

const priFix = 'asset/';

export const getAllAssetesStatus = (data) => {
  const path = `${priFix}getAllAssignedAsset`;
  const responseType = 'GET_ALL_ASSTES_STATUS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const assignToIncident = (data) => {
  const path = `${priFix}assignToIncident?incidentId=${data.incidentId}&customerID=${data.customerID}&assetToken=${data.token}&userToken=${JSON.parse(localStorage.getItem('U_TOKENS')).userToken}&fullname=${JSON.parse(localStorage.getItem('U_PROFILE')).fullname}`;
  const responseType = 'ASSIGN_TO_INCIDENTS';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const removeAassignToIncident = (data) => {
  const path = `${priFix}removeAssignedAsset?incidentId=${data.incidentId}&customerID=${data.customerID}&assetToken=${data.assetToken}&token=${data.token}&fullname=${JSON.parse(localStorage.getItem('U_PROFILE')).fullname}`;
  const responseType = 'REMOVE_ASSIGN_TO_INCIDENTS';
  return axiosCall('put', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAssetData = (data) => {
  const path = `${priFix}getAssignAssetData?assetToken=${data.assetToken}&customerID=${data.customerID}&incidentId=${data.incidentId}`;
  const responseType = 'GET_ASSETS_DATA_EXPAND';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};
export const fakeAssetsIncidentAction = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ASSETS_ACTION' });
};
