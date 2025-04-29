import { clearLocalData } from './StorageHandlers';

export const callLogoutSuccess = () => {
  clearLocalData();
};
export const checkSession = () => {
  const data = localStorage.getItem('jwtToken');
  if (!data) {
    callLogoutSuccess();
  }
};
