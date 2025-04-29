/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import axios from 'axios';
import { callLogout, licenceExpireList } from '../../helpers/envData';
import { apiEndPoint } from '../../helpers/lib/ApiEndpoint';
import { setPermissions, setLicStatus, setWiting } from '../../helpers/lib/StorageHandlers';
import FilterSuccessNotification from './FilterSuccessNotification';
import Toaster from '../../components/toaster';
import FilterErrorNotification from './FilterErrorNotification';
import FilterNotification from './FilterNotification';

export const instance = axios.create({
  baseURL: apiEndPoint,
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
});
export default function axiosCall(method, url, responseType, data, headers, payload) {
  const obj = headers;
  if (obj !== undefined) {
    headers.userToken = JSON.parse(localStorage.getItem('U_TOKENS')).userToken;
  }
  return async (dispatch) => {
    const apiData = data ? {
      method, url, data, headers,
    } : { method, url, headers };
    instance(apiData)
      .then((response) => {
        const index = FilterNotification.findIndex((x) => x === responseType);
        const successIndex = FilterSuccessNotification.findIndex((x) => x === responseType);
        const errorIndex = FilterErrorNotification.findIndex((x) => x === responseType);
        if (index === -1 && JSON.parse(localStorage.getItem('U_TOKENS'))?.userToken) {
          if (successIndex === -1 && response.data.status && response.data.message) {
            Toaster({ title: response.data.message, type: 'success' });
          }
          if (errorIndex === -1 && response.data.status === false && response.data.message) {
            Toaster({ title: response.data.message, type: 'error' });
          }
        }
        if (response.data) {
          if (responseType === 'GET_USER_PERMISSION') {
            const permissions = {
              aclData: JSON.stringify(response.data.data[0]),
            };
            if (JSON.parse(response.data.data[1].licenseStatus)) {
              setPermissions(permissions);
              setLicStatus(true);
            } else {
              setLicStatus(false);
              setPermissions(licenceExpireList);
            }
            setWiting(false);
          }
          dispatch({ type: `${responseType}_SUCCESS`, updatePayload: response.data, payload });
          return response.data;
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          callLogout();
          document.location.reload();
        }
        if (err.response && (err.response.status === 504 || err.response.status === 500)) {
          callLogout();
          // document.location.reload();
        } else if (err.response && err.response.data) {
          dispatch({ type: `${responseType}_ERROR`, updatePayload: err.response.data, payload });
          return err.response.data;
        }
        if (err.response && err.response.data && err.response.status === 500) {
          callLogout();
          // document.location.reload();
          dispatch({
            type: 'FETCH_ERROR',
            updatePayload: err.response || 'Something Went Wrong.',
          });
          return err.response;
        }
      });
  };
}
