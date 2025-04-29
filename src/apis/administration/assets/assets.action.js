import axiosCall from '../../../configurations/redux/AxiosCall';

const priFix = 'asset/';

export const getAllIncidentAssetsAction = () => {
  const path = `${priFix}getAssets`;
  const responseType = 'GET_ALL_INCIDENT_ASSETS';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getAllAssetsAction = (data) => {
  const path = `${priFix}getAllAsset`;
  const responseType = 'GET_ALL_ASSETS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const InsertAssetsFileAction = (data) => {
  const path = `${priFix}insertAssetFile?fullname=${JSON.parse(localStorage.getItem('U_PROFILE')).fullname}`;
  const form = new FormData();
  data.forEach((element) => {
    form.append('files', element);
  });

  const responseType = 'INSERT_ASSETS_FILE';
  return axiosCall('post', path, responseType, form, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const insertAssetsAction = (data) => {
  const path = `${priFix}insertAsset?fullname=${JSON.parse(localStorage.getItem('U_PROFILE')).fullname}`;
  const responseType = 'INSERT_ASSETS';
  return axiosCall('post', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const updateAssetsAction = (data) => {
  const path = `${priFix}udpateAssets?fullname=${JSON.parse(localStorage.getItem('U_PROFILE')).fullname}`;
  const responseType = 'UPDATE_ASSETS';
  return axiosCall('put', path, responseType, data, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const deleteAssetsAction = (token) => {
  const path = `${priFix}deleteAsset?tokens=${token}`;
  const responseType = 'DELETE_ASSETS';
  return axiosCall('delete', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const changeAssetsStatusAction = (data) => {
  const path = `${priFix}changeAssetStatus?assetToken=${data.token}&assetStatus=${data.assetStatus}`;
  const responseType = 'CHANGE_ASSETS_STATUS';
  return axiosCall('post', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const getSingleAssetAction = (assetToken) => {
  const path = `${priFix}getAsset?assetToken=${assetToken}`;
  const responseType = 'GET_ASSET_TOKEN_DATA';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const GetOwnerAction = () => {
  const path = 'usermanagement/getOwner';
  const responseType = 'GET_OWNER';
  return axiosCall('get', path, responseType, null, { Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}` });
};

export const fakeActionAssets = () => async (dispatch) => {
  dispatch({ type: 'FAKE_ACTION_ASSETS' });
};
