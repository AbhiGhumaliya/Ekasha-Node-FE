/* eslint-disable import/no-mutable-exports */
import moment from 'moment-timezone';
import { stompClient } from './SocketHandlers';
import { callLogout } from '../envData';
import { history } from '../../configurations/redux/Store';

export let LocalgetAllFilter = {
  page: 0,
  pageData: 10,
  searchString: [],
  search: [],
  sortingBase: 'createdOn',
  sortingType: 'desc',
};
export const setLocalgetAllFilter = (data) => {
  LocalgetAllFilter = data;
};

export const clearLocalData = () => {
  localStorage.clear();
  history.push('/');
  stompClient.disconnect();
  setLocalgetAllFilter({
    page: 0,
    pageData: 10,
    searchString: [],
    search: [],
    sortingBase: 'createdOn',
    sortingType: 'desc',
  });
};

export const handleStorageChange = (e) => {
  e.stopPropagation();
  if (e.url === window.location.href) {
    if (!e.key) {
      callLogout();
    } else {
      localStorage.setItem(e.key, e.oldValue);
    }
  }
  if (JSON.parse(localStorage.getItem('U_TOKENS')) === null) {
    clearLocalData();
    window.location.reload();
  }
};
export let ekashaPermission = {};
const event = new CustomEvent('ekashaPermissionChanged', { ekashaPermission });
window.dispatchEvent(event);
export let licStatus = true;
export const setLicStatus = (status) => {
  licStatus = status;
};

export let linksData = [];
export const setLinksData = (data) => {
  linksData = data;
};
export let conditonData = [];
export const setConditionData = (data) => {
  conditonData = data;
};

export const integrationData = { config: '', token: '' };

export const setintegrationData = (data, token) => {
  integrationData.config = data;
  integrationData.token = token;
};

export const InputLength = {
  two: '2',
  three: '3',
  seventeen: '17',
  fifteen: '15',
  twenty: '20',
  twentyFive: '25',
  thirty: '30',
  twentySeven: '27',
  fortyFive: '45',
  fifty: '50',
  sixtyFour: '64',
  hundred: '100',
  twoHundred: '200',
  twoFiveZero: '250',
  twoFiftyFive: '255',
  oneTwoEight: '128',
  twoZeroFourEight: '2048',
  threeTwoZero: '320',
  fiveZeroZero: '500',
  sixFiveZero: '650',
  warMsgLength: '65536',
  thirtyTwo: '32',
  seventy: '70',
  normal: '150',
  domain: '255',
  url: '2048',
  ip: '150',
  alertDataLength: '25000',
  thousand: '1000',
};
export let witing = true;
export const setWiting = (status) => {
  witing = status;
};

export let dashInterval = '';
export const setDashInterval = (status) => {
  dashInterval = status;
};

export let openNewWorkbookStatus = '';
export const setOpenNewWorkbookStatus = (status) => {
  openNewWorkbookStatus = status;
};

export let newWorkbookStoreData = {
  workbookName: '',
  workbookData: [
    {
      name: '',
      description: '',
      collapseStatus: false,
      tasks: [
        {
          name: '',
          description: '',
          ownerName: '',
          owner: '',
          actions: [],
          playbooks: [],
          actionList: [],
        },
      ],
    },
  ],
};
export const setNewWorkbookDataStoreData = (data) => {
  newWorkbookStoreData = data;
};

export const setPermissions = (permissions) => {
  ekashaPermission = permissions;
  if (permissions && permissions.aclData) {
    const dataPermission = JSON.parse(permissions.aclData);
    const data = dataPermission.find((d) => d.module === 'administration');
    const dataPlaybook = dataPermission.find((d) => d.module === 'playbook');
    const result = data.subModules.find((k) => k.module === 'lists');
    localStorage.setItem('modulePermission', dataPlaybook?.permission);
    localStorage.setItem('modulePermissionList', result?.permission);
  }
};
const checkACLDataAvailablity = () => {
  if (!ekashaPermission.aclData) {
    return false;
  }
  return true;
};

export const PermissionRO = (root, sub) => {
  if (checkACLDataAvailablity()) {
    const rootModule = JSON.parse(ekashaPermission.aclData);
    if (root !== undefined) {
      const index = rootModule.findIndex((x) => x.module === root);
      if (index !== -1) {
        if (sub !== undefined) {
          const subIndex = rootModule[index].subModules.findIndex((x) => x.module === sub);
          if (subIndex !== -1) {
            if (rootModule[index].subModules[subIndex].permission === 'RW') {
              rootModule[index].subModules[subIndex].read = true;
              rootModule[index].subModules[subIndex].write = true;
              rootModule[index].subModules[subIndex].delete = true;
              rootModule[index].subModules[subIndex].download = true;
              return rootModule[index].subModules[subIndex];
            }
            if (rootModule[index].subModules[subIndex].permission === 'RO') {
              rootModule[index].subModules[subIndex].read = true;
              rootModule[index].subModules[subIndex].write = false;
              rootModule[index].subModules[subIndex].delete = false;
              rootModule[index].subModules[subIndex].download = true;
              return rootModule[index].subModules[subIndex];
            }
            if (rootModule[index].subModules[subIndex].permission === 'NA') {
              rootModule[index].subModules[subIndex].read = false;
              rootModule[index].subModules[subIndex].write = false;
              rootModule[index].subModules[subIndex].delete = false;
              rootModule[index].subModules[subIndex].download = false;
              return rootModule[index].subModules[subIndex];
            }
          }
        }
        if (rootModule[index].permission === 'RW') {
          rootModule[index].read = true;
          rootModule[index].write = true;
          rootModule[index].delete = true;
          rootModule[index].download = true;
          return rootModule[index];
        }
        if (rootModule[index].permission === 'RO') {
          rootModule[index].read = true;
          rootModule[index].write = false;
          rootModule[index].delete = false;
          rootModule[index].download = true;
          return rootModule[index];
        }
        if (rootModule[index].permission === 'NA') {
          rootModule[index].read = false;
          rootModule[index].write = false;
          rootModule[index].delete = false;
          rootModule[index].download = false;
          return rootModule[index];
        }
      }
      return rootModule;
    }
    return rootModule;
  }
  return [];
};

/** TimeZone Handle */

export const localToUtc = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DD HH:mm:ss.SSS', localTimeZone).utc().format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;
export const serverToUtc = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DD HH:mm:ss.SSS', localTimeZone).utc().format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;

// for Diffrent Formate
export const utcToEkasha = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('Do MMM YYYY,  HH:mm:ss')}`;
export const utcToServer = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('Do MMM YYYY,  HH:mm:ss')}`;
export const localToServer = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('YYYY-MM-DDTHH:mm:ss.SSSZ')}`;
export const utcTocheck = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('DD MMM YYYY, HH:mm A')}`;
export const utcTofullDate = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('YYYY-MM-DDTHH:mm:ss.SSSZ')}`;
export const utcToDate = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('Do MMM, YYYY')}`;
export const utcToHour = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('hh:mm, a')}`;
export const utcToHourAM = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('hh:mm A')}`;
export const utcToDateA = (date, localTimeZone) => `${moment.tz(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', localTimeZone).format('DD MMM, YY')}`;

export const convertTimeBaseTimeZoneFunction = (time, type) => {
  const userTimezone = localStorage.getItem('userTimezone');
  const serverTimeZone = localStorage.getItem('serverTimezone');
  const servertoUTC = localToUtc(time, serverTimeZone); // Server to UTC timezone
  const localtoUTC = serverToUtc(time, userTimezone); // user to UTC timezone
  const browserTimezone = serverToUtc(time, moment.tz.guess()); // user to browser timezone
  if (time) {
    if (type === 'ddmmyyyy') {
      return utcToDate(servertoUTC, userTimezone); // UTC to User timezone
    }
    if (type === 'hh:mm') {
      return utcToHour(servertoUTC, userTimezone); // UTC to User timezone
    }
    if (type === 'fullDate') {
      return utcTofullDate(servertoUTC, userTimezone); // UTC to User timezone
    }
    if (type === 'hourA') {
      return utcToHourAM(servertoUTC, userTimezone); // UTC to User timezone
    }
    if (type === 'dateA') {
      return utcToDateA(servertoUTC, userTimezone); // UTC to User timezone
    }
    if (type === 'Server') {
      return utcToServer(localtoUTC, serverTimeZone); // UTC to User timezone
    }
    if (type === 'localToServer') {
      return localToServer(browserTimezone, serverTimeZone); // UTC to User timezone
    }
    if (type === 'check') {
      return utcTocheck(localtoUTC, serverTimeZone); // UTC to User timezone
    }
    if (time === 'N/A') {
      return time; // Job timezone
    }
    return utcToEkasha(servertoUTC, userTimezone); // UTC to User timezone
  }
  return '-';
};
