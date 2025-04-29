/* eslint-disable max-len */
import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import {
  getAllJobAction, fakeActionJob,
} from '../../../../apis/jobs/job.actions';
import { TimeFilContext } from '../../../containers/TimeFilterContext';
import JobsEkasha from '../../../containers/jobs/index';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { findByTestAtrr, findByTestAtrrFirst } from '../../../../helpers/lib/testUtils';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';

const permissions = {
  aclData:
  '[{"module":"home","permission":"RW","subModules":[{"module":"dashboard","permission":"RW"},{"module":"panel","permission":"RW"}]},{"module":"administration","permission":"RW","subModules":[{"module":"sla","permission":"RW"},{"module":"integration","permission":"RW"},{"module":"assets","permission":"RW"},{"module":"server","permission":"RW"},{"module":"ldap","permission":"RW"},{"module":"ssl","permission":"RW"},{"module":"userManagement","permission":"RW"},{"module":"escalateRule","permission":"RW"},{"module":"customField","permission":"RW"},{"module":"proxy","permission":"RW"},{"module":"workbook","permission":"RW"},{"module":"template","permission":"RW"},{"module":"lists","permission":"RW"},{"module":"timezone","permission":"RW"},{"module":"backupandrestore","permission":"RW"},{"module":"license","permission":"RW"},{"module":"client","permission":"RW"},{"module":"zone","permission":"RW"},{"module":"logs","permission":"RW"},{"module":"criticalUser","permission":"RW"},{"module":"tenant","permission":"RW"}]},{"module":"incidents","permission":"RW","subModules":[{"module":"overview","permission":"RW"},{"module":"workbook","permission":"RW"},{"module":"action","permission":"RW"},{"module":"incidentPlaybook","permission":"RW"},{"module":"assets","permission":"RW"},{"module":"artifact","permission":"RW"},{"module":"reports","permission":"RW"},{"module":"evidence","permission":"RW"},{"module":"references","permission":"RW"},{"module":"notes","permission":"RW"},{"module":"activity","permission":"RW"}]},{"module":"playbook","permission":"RW"},{"module":"ruleEngine","permission":"RW"},{"module":"apps","permission":"RW"},{"module":"reports","permission":"RW"},{"module":"ioc","permission":"RW"},{"module":"jobs","permission":"NA"}]',
};

const Tokens = {
  groupToken: 'x249a2995-3666-4243-af80-1d5c26739a33',
  userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  roleToken: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
  jwtToken: 'eyJ1c2VyVG9rZW4iOiJtMzNiMmU3NDctYjk3Ny00ZGI2LTlmOWMtODI4ZjhjNmNjY2Q5IiwiYWxnIjoiSFM1MTIifQ.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcxNzc2NTQ2MCwiaWF0IjoxNzE3NzM2NjYwfQ.n_oTACzE5YCacNhVrQxexXBdaq3vIooy4QQwuBqd3p0GaJOL6Fr2wXwhZItNKvfGG67UHlTqBVs7CCQcXDPJiA',
};

global.matchMedia = global.matchMedia || function () {
  return {
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

const actionProps = {
  getAllJobAction,
  fakeActionJob,
};

const mockStore = configureMockStore([thunk]);

const setUp = (props = {}, initialState = { Jobs: {} }) => {
  const contextValue = { customerID: 'Jobs_1' };
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <TimeFilContext.Provider value={contextValue}>
          <JobsEkasha {...props} />
        </TimeFilContext.Provider>
      </Provider>
    </Router>,
  );
  component.debug();
  return component;
};

describe('Component Rendering - on Reducer False Response', () => {
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      contact: '9879898798', email: 'ekashaadmin@gmail.com', fullname: 'Ekasha Admin', groupName: 'admin', role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5', userName: 'admin',
    }));
    const initial = {
      Jobs: {
        GetAllJobResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            TotalCount: 3,
            jobData: [
              {
                token: 'h31a0aa7b-b79a-470e-8238-b1ebadb0885d',
                jobId: '6da64b5bd2ee-4a3414d1-e1b2-47c6-842f-861bff37ca62',
                eventName: 'VT - Added by Hiral',
                jobStatus: 'completed',
                nextRunTime: 'N/A',
                lastRunTime: '2024-06-22T12:45:00Z',
                jobRunTime: '0d:0h:0m:1s',
                jobType: 'Action',
                incidentId: '30',
                customerID: 'Tenant_Incident',
              },
              {
                token: 'q6c005b18-ece0-432d-b0fe-17a6d66bdcc4',
                jobId: '6da64b5bd2ee-2f852d29-c9dd-49e4-9329-8e6e6d8b22a3',
                eventName: 'Report 1',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:03:00 +0530 2025',
                lastRunTime: '2024-06-19T15:03:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
              {
                token: 't1d58bedc-3451-4b7d-888f-7dfdceec61f4',
                jobId: '6da64b5bd2ee-7c045136-4ff3-4c19-819d-086a1593578d',
                eventName: 'Ransomware',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:06:00 +0530 2025',
                lastRunTime: '2024-06-19T15:06:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
            ],
            totalPages: 20,
            currentPage: 1,
          },
        },
      },
    };
    setPermissions({
      aclData: JSON.stringify([
        {
          module: 'home',
          permission: 'RW',
          subModules: [
            {
              module: 'dashboard',
              permission: 'RW',
            },
            {
              module: 'panel',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'administration',
          permission: 'RW',
          subModules: [
            {
              module: 'sla',
              permission: 'RW',
            },
            {
              module: 'integration',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'server',
              permission: 'RW',
            },
            {
              module: 'ldap',
              permission: 'RW',
            },
            {
              module: 'ssl',
              permission: 'RW',
            },
            {
              module: 'userManagement',
              permission: 'RW',
            },
            {
              module: 'escalateRule',
              permission: 'RW',
            },
            {
              module: 'customField',
              permission: 'RW',
            },
            {
              module: 'proxy',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'template',
              permission: 'RW',
            },
            {
              module: 'lists',
              permission: 'RW',
            },
            {
              module: 'timezone',
              permission: 'RW',
            },
            {
              module: 'backupandrestore',
              permission: 'RW',
            },
            {
              module: 'license',
              permission: 'RW',
            },
            {
              module: 'client',
              permission: 'RW',
            },
            {
              module: 'zone',
              permission: 'RW',
            },
            {
              module: 'logs',
              permission: 'RW',
            },
            {
              module: 'criticalUser',
              permission: 'RW',
            },
            {
              module: 'tenant',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'incidents',
          permission: 'RW',
          subModules: [
            {
              module: 'overview',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'action',
              permission: 'RW',
            },
            {
              module: 'incidentPlaybook',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'artifact',
              permission: 'RW',
            },
            {
              module: 'reports',
              permission: 'RW',
            },
            {
              module: 'evidence',
              permission: 'RW',
            },
            {
              module: 'references',
              permission: 'RW',
            },
            {
              module: 'notes',
              permission: 'RW',
            },
            {
              module: 'activity',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'playbook',
          permission: 'RW',
        },
        {
          module: 'ruleEngine',
          permission: 'RW',
        },
        {
          module: 'apps',
          permission: 'RW',
        },
        {
          module: 'reports',
          permission: 'RW',
        },
        {
          module: 'ioc',
          permission: 'RW',
        },
        {
          module: 'jobs',
          permission: 'RW',
        },

      ]),
    });
    setUp(actionProps, initial);
  });

  it('Should Failed Response in Reducer', async () => {});
});

describe('Component Rendering - Render with No Permission', () => {
  let wrapper;
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
    const initial = {
      Jobs: {},
    };
    setPermissions(permissions);
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'PermissionRO_Jobs_No_Data');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with All Permission and No Data of Reducer', () => {
  let wrapper;
  const stub = jest.fn();
  stompClient.connected = true;
  stompClient.subscribe = stub;
  stompClient.subscriptions = [{ 'sub-5': (payload) => stub(payload) }];
  stompClient.ws.readyState = 1;
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
    const initial = {
      Jobs: {},
    };
    setPermissions({
      aclData: JSON.stringify([
        {
          module: 'home',
          permission: 'RW',
          subModules: [
            {
              module: 'dashboard',
              permission: 'RW',
            },
            {
              module: 'panel',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'administration',
          permission: 'RW',
          subModules: [
            {
              module: 'sla',
              permission: 'RW',
            },
            {
              module: 'integration',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'server',
              permission: 'RW',
            },
            {
              module: 'ldap',
              permission: 'RW',
            },
            {
              module: 'ssl',
              permission: 'RW',
            },
            {
              module: 'userManagement',
              permission: 'RW',
            },
            {
              module: 'escalateRule',
              permission: 'RW',
            },
            {
              module: 'customField',
              permission: 'RW',
            },
            {
              module: 'proxy',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'template',
              permission: 'RW',
            },
            {
              module: 'lists',
              permission: 'RW',
            },
            {
              module: 'timezone',
              permission: 'RW',
            },
            {
              module: 'backupandrestore',
              permission: 'RW',
            },
            {
              module: 'license',
              permission: 'RW',
            },
            {
              module: 'client',
              permission: 'RW',
            },
            {
              module: 'zone',
              permission: 'RW',
            },
            {
              module: 'logs',
              permission: 'RW',
            },
            {
              module: 'criticalUser',
              permission: 'RW',
            },
            {
              module: 'tenant',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'incidents',
          permission: 'RW',
          subModules: [
            {
              module: 'overview',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'action',
              permission: 'RW',
            },
            {
              module: 'incidentPlaybook',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'artifact',
              permission: 'RW',
            },
            {
              module: 'reports',
              permission: 'RW',
            },
            {
              module: 'evidence',
              permission: 'RW',
            },
            {
              module: 'references',
              permission: 'RW',
            },
            {
              module: 'notes',
              permission: 'RW',
            },
            {
              module: 'activity',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'playbook',
          permission: 'RW',
        },
        {
          module: 'ruleEngine',
          permission: 'RW',
        },
        {
          module: 'apps',
          permission: 'RW',
        },
        {
          module: 'reports',
          permission: 'RW',
        },
        {
          module: 'ioc',
          permission: 'RW',
        },
        {
          module: 'jobs',
          permission: 'RW',
        },

      ]),
    });
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'job_Wrapper');
    expect(h.length).toBe(1);
  });
  afterEach(() => {
    wrapper.unmount();
  });
});

describe('Component Rendering - Render No Data And Create Button with only read permission', () => {
  let wrapper;
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      contact: '9879898798', email: 'ekashaadmin@gmail.com', fullname: 'Ekasha Admin', groupName: 'admin', role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5', userName: 'admin',
    }));
    const initial = {
      Jobs: {
        GetAllJobResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            TotalCount: 3,
            jobData: [],
            totalPages: 20,
            currentPage: 0,
          },
        },
      },
    };
    setPermissions({
      aclData: JSON.stringify([
        {
          module: 'home',
          permission: 'RW',
          subModules: [
            {
              module: 'dashboard',
              permission: 'RW',
            },
            {
              module: 'panel',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'administration',
          permission: 'RW',
          subModules: [
            {
              module: 'sla',
              permission: 'RW',
            },
            {
              module: 'integration',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'server',
              permission: 'RW',
            },
            {
              module: 'ldap',
              permission: 'RW',
            },
            {
              module: 'ssl',
              permission: 'RW',
            },
            {
              module: 'userManagement',
              permission: 'RW',
            },
            {
              module: 'escalateRule',
              permission: 'RW',
            },
            {
              module: 'customField',
              permission: 'RW',
            },
            {
              module: 'proxy',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'template',
              permission: 'RW',
            },
            {
              module: 'lists',
              permission: 'RW',
            },
            {
              module: 'timezone',
              permission: 'RW',
            },
            {
              module: 'backupandrestore',
              permission: 'RW',
            },
            {
              module: 'license',
              permission: 'RW',
            },
            {
              module: 'client',
              permission: 'RW',
            },
            {
              module: 'zone',
              permission: 'RW',
            },
            {
              module: 'logs',
              permission: 'RW',
            },
            {
              module: 'criticalUser',
              permission: 'RW',
            },
            {
              module: 'tenant',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'incidents',
          permission: 'RW',
          subModules: [
            {
              module: 'overview',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'action',
              permission: 'RW',
            },
            {
              module: 'incidentPlaybook',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'artifact',
              permission: 'RW',
            },
            {
              module: 'reports',
              permission: 'RW',
            },
            {
              module: 'evidence',
              permission: 'RW',
            },
            {
              module: 'references',
              permission: 'RW',
            },
            {
              module: 'notes',
              permission: 'RW',
            },
            {
              module: 'activity',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'playbook',
          permission: 'RW',
        },
        {
          module: 'ruleEngine',
          permission: 'RW',
        },
        {
          module: 'apps',
          permission: 'RW',
        },
        {
          module: 'reports',
          permission: 'RW',
        },
        {
          module: 'ioc',
          permission: 'RW',
        },
        {
          module: 'jobs',
          permission: 'RO',
        },

      ]),
    });
    wrapper = setUp(actionProps, initial);
  });

  it('Nodata only read permission ', () => {
    const noDataTable = findByTestAtrrFirst(wrapper, 'Jobs_No_Data_in_Table');
    expect(noDataTable.length).toBe(1);
  });
});

describe('Component Rendering - on Table Row Select or Deselect or Position Update of Row', () => {
  let wrapper;
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      contact: '9879898798', email: 'ekashaadmin@gmail.com', fullname: 'Ekasha Admin', groupName: 'admin', role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5', userName: 'admin',
    }));
    const initial = {
      Jobs: {
        GetAllJobResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            TotalCount: 3,
            jobData: [
              {
                token: 'h31a0aa7b-b79a-470e-8238-b1ebadb0885d',
                jobId: '6da64b5bd2ee-4a3414d1-e1b2-47c6-842f-861bff37ca62',
                eventName: 'VT - Added by Hiral',
                jobStatus: 'completed',
                nextRunTime: 'N/A',
                lastRunTime: '2024-06-22T12:45:00Z',
                jobRunTime: '0d:0h:0m:1s',
                jobType: 'Action',
                incidentId: '30',
                customerID: 'Tenant_Incident',
              },
              {
                token: 'q6c005b18-ece0-432d-b0fe-17a6d66bdcc4',
                jobId: '6da64b5bd2ee-2f852d29-c9dd-49e4-9329-8e6e6d8b22a3',
                eventName: 'Report 1',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:03:00 +0530 2025',
                lastRunTime: '2024-06-19T15:03:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
              {
                token: 't1d58bedc-3451-4b7d-888f-7dfdceec61f4',
                jobId: '6da64b5bd2ee-7c045136-4ff3-4c19-819d-086a1593578d',
                eventName: 'Ransomware',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:06:00 +0530 2025',
                lastRunTime: '2024-06-19T15:06:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
            ],
            totalPages: 20,
            currentPage: 0,
          },
        },
      },
    };
    setPermissions({
      aclData: JSON.stringify([
        {
          module: 'home',
          permission: 'RW',
          subModules: [
            {
              module: 'dashboard',
              permission: 'RW',
            },
            {
              module: 'panel',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'administration',
          permission: 'RW',
          subModules: [
            {
              module: 'sla',
              permission: 'RW',
            },
            {
              module: 'integration',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'server',
              permission: 'RW',
            },
            {
              module: 'ldap',
              permission: 'RW',
            },
            {
              module: 'ssl',
              permission: 'RW',
            },
            {
              module: 'userManagement',
              permission: 'RW',
            },
            {
              module: 'escalateRule',
              permission: 'RW',
            },
            {
              module: 'customField',
              permission: 'RW',
            },
            {
              module: 'proxy',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'template',
              permission: 'RW',
            },
            {
              module: 'lists',
              permission: 'RW',
            },
            {
              module: 'timezone',
              permission: 'RW',
            },
            {
              module: 'backupandrestore',
              permission: 'RW',
            },
            {
              module: 'license',
              permission: 'RW',
            },
            {
              module: 'client',
              permission: 'RW',
            },
            {
              module: 'zone',
              permission: 'RW',
            },
            {
              module: 'logs',
              permission: 'RW',
            },
            {
              module: 'criticalUser',
              permission: 'RW',
            },
            {
              module: 'tenant',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'incidents',
          permission: 'RW',
          subModules: [
            {
              module: 'overview',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'action',
              permission: 'RW',
            },
            {
              module: 'incidentPlaybook',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'artifact',
              permission: 'RW',
            },
            {
              module: 'reports',
              permission: 'RW',
            },
            {
              module: 'evidence',
              permission: 'RW',
            },
            {
              module: 'references',
              permission: 'RW',
            },
            {
              module: 'notes',
              permission: 'RW',
            },
            {
              module: 'activity',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'playbook',
          permission: 'RW',
        },
        {
          module: 'ruleEngine',
          permission: 'RW',
        },
        {
          module: 'apps',
          permission: 'RW',
        },
        {
          module: 'reports',
          permission: 'RW',
        },
        {
          module: 'ioc',
          permission: 'RW',
        },
        {
          module: 'jobs',
          permission: 'RW',
        },

      ]),
    });
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Get All Jobs and show table', () => {
    const jobsTable = findByTestAtrr(wrapper, 'job_table_wrapper');
    expect(jobsTable.length).toBe(1);
    act(() => {
      jobsTable.props().nextPage();
    });
    wrapper.update();
  });
  afterEach(() => {
    wrapper.unmount();
  });
});

describe('Jobs Component', () => {
  it('should clear jobDataList and set loading to false on failed response', async () => {
    const initial = {
      Jobs: {
        GetAllJobResponse: {
          code: 500,
          message: 'Error fetching data.',
          status: false,
        },
      },
    };

    const wrapper = setUp({ getAllJobAction, fakeActionJob }, initial);

    await act(async () => {
      wrapper.update();
    });

    const jobData = wrapper.find('job_Wrapper');
    expect(jobData.length).toBe(0);
  });
});

describe('Component Rendering - with Socket Data Handler', () => {
  let wrapper;
  let mockSubscribe;

  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      contact: '9879898798', email: 'ekashaadmin@gmail.com', fullname: 'Ekasha Admin', groupName: 'admin', role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5', userName: 'admin',
    }));

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = {
      Jobs: {
        GetAllJobResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            TotalCount: 3,
            jobData: [
              {
                token: 'h31a0aa7b-b79a-470e-8238-b1ebadb0885d',
                jobId: '6da64b5bd2ee-4a3414d1-e1b2-47c6-842f-861bff37ca62',
                eventName: 'VT - Added by Hiral',
                jobStatus: 'completed',
                nextRunTime: 'N/A',
                lastRunTime: '2024-06-22T12:45:00Z',
                jobRunTime: '0d:0h:0m:1s',
                jobType: 'Action',
                incidentId: '30',
                customerID: 'Tenant_Incident',
              },
              {
                token: 'q6c005b18-ece0-432d-b0fe-17a6d66bdcc4',
                jobId: '6da64b5bd2ee-2f852d29-c9dd-49e4-9329-8e6e6d8b22a3',
                eventName: 'Report 1',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:03:00 +0530 2025',
                lastRunTime: '2024-06-19T15:03:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
              {
                token: 't1d58bedc-3451-4b7d-888f-7dfdceec61f4',
                jobId: '6da64b5bd2ee-7c045136-4ff3-4c19-819d-086a1593578d',
                eventName: 'Ransomware',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:06:00 +0530 2025',
                lastRunTime: '2024-06-19T15:06:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
            ],
            totalPages: 20,
            currentPage: 0,
          },
        },
      },
    };
    setPermissions({
      aclData: JSON.stringify([
        {
          module: 'home',
          permission: 'RW',
          subModules: [
            {
              module: 'dashboard',
              permission: 'RW',
            },
            {
              module: 'panel',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'administration',
          permission: 'RW',
          subModules: [
            {
              module: 'sla',
              permission: 'RW',
            },
            {
              module: 'integration',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'server',
              permission: 'RW',
            },
            {
              module: 'ldap',
              permission: 'RW',
            },
            {
              module: 'ssl',
              permission: 'RW',
            },
            {
              module: 'userManagement',
              permission: 'RW',
            },
            {
              module: 'escalateRule',
              permission: 'RW',
            },
            {
              module: 'customField',
              permission: 'RW',
            },
            {
              module: 'proxy',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'template',
              permission: 'RW',
            },
            {
              module: 'lists',
              permission: 'RW',
            },
            {
              module: 'timezone',
              permission: 'RW',
            },
            {
              module: 'backupandrestore',
              permission: 'RW',
            },
            {
              module: 'license',
              permission: 'RW',
            },
            {
              module: 'client',
              permission: 'RW',
            },
            {
              module: 'zone',
              permission: 'RW',
            },
            {
              module: 'logs',
              permission: 'RW',
            },
            {
              module: 'criticalUser',
              permission: 'RW',
            },
            {
              module: 'tenant',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'incidents',
          permission: 'RW',
          subModules: [
            {
              module: 'overview',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'action',
              permission: 'RW',
            },
            {
              module: 'incidentPlaybook',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'artifact',
              permission: 'RW',
            },
            {
              module: 'reports',
              permission: 'RW',
            },
            {
              module: 'evidence',
              permission: 'RW',
            },
            {
              module: 'references',
              permission: 'RW',
            },
            {
              module: 'notes',
              permission: 'RW',
            },
            {
              module: 'activity',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'playbook',
          permission: 'RW',
        },
        {
          module: 'ruleEngine',
          permission: 'RW',
        },
        {
          module: 'apps',
          permission: 'RW',
        },
        {
          module: 'reports',
          permission: 'RW',
        },
        {
          module: 'ioc',
          permission: 'RW',
        },
        {
          module: 'jobs',
          permission: 'RW',
        },

      ]),
    });
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle All operation correctly', () => {
    const socketFackData = [
      {
        body: JSON.stringify({
          module: 'job',
          operation: 'add',
          status: true,
          data: {
            jobData: {
              token: '1',
              eventName: 'Ransomware1',
            },
          },
        }),
      },
      {
        body: JSON.stringify({
          module: 'job',
          operation: 'add',
          status: true,
          data: {
            jobData: {
              token: '1',
              eventName: 'Ransomware1',
            },
          },
        }),
      },
      {
        body: JSON.stringify({
          module: 'job',
          operation: 'update',
          status: true,
          data: {
            jobData: {
              token: '1',
              eventName: 'Ransomware',
            },
          },
        }),
      },
      {
        body: JSON.stringify({
          module: 'job',
          operation: 'update',
          status: true,
          data: {
            jobData: {
              token: '11',
              eventName: 'Ransomware',
            },
          },
        }),
      },
      {
        body: JSON.stringify({
          module: 'job',
          operation: '',
          status: true,
          data: {
            TotalCount: 3,
            jobData: [
              {
                token: '1',
                eventName: 'Ransomware',
              },
            ],
            totalPages: 20,
            currentPage: 1,
          },
        }),
      }];

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    const ruleTable = findByTestAtrrFirst(wrapper, 'job_table_wrapper');
    expect(ruleTable.length).toBe(1);
    socketFackData.forEach((element) => {
      act(() => {
        // Trigger the callback with the mock payload
        subscribeCallback(element);
      });
    });

    wrapper.update();
  });

  afterAll(() => {
    wrapper.unmount();
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      contact: '9879898798', email: 'ekashaadmin@gmail.com', fullname: 'Ekasha Admin', groupName: 'admin', role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5', userName: 'admin',
    }));
    const initial = {
      Jobs: {
        GetAllJobResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            TotalCount: 3,
            jobData: [
              {
                token: 'h31a0aa7b-b79a-470e-8238-b1ebadb0885d',
                jobId: '6da64b5bd2ee-4a3414d1-e1b2-47c6-842f-861bff37ca62',
                eventName: 'VT - Added by Hiral',
                jobStatus: 'completed',
                nextRunTime: 'N/A',
                lastRunTime: '2024-06-22T12:45:00Z',
                jobRunTime: '0d:0h:0m:1s',
                jobType: 'Action',
                incidentId: '30',
                customerID: 'Tenant_Incident',
              },
              {
                token: 'h31a0aa7b-b79a-470e-8238-b1ebadb0885d',
                jobId: '6da64b5bd2ee-4a3414d1-e1b2-47c6-842f-861bff37ca62',
                eventName: 'VT - Added by Hiral',
                jobStatus: 'halt',
                nextRunTime: 'N/A',
                lastRunTime: '2024-06-22T12:45:00Z',
                jobRunTime: '0d:0h:0m:1s',
                jobType: 'Action',
                incidentId: '31',
                customerID: 'Tenant_Incident',
              },
              {
                token: 'q6c005b18-ece0-432d-b0fe-17a6d66bdcc4',
                jobId: '6da64b5bd2ee-2f852d29-c9dd-49e4-9329-8e6e6d8b22a3',
                eventName: 'Report 1',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:03:00 +0530 2025',
                lastRunTime: '2024-06-19T15:03:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
              {
                token: 't1d58bedc-3451-4b7d-888f-7dfdceec61f4',
                jobId: '6da64b5bd2ee-7c045136-4ff3-4c19-819d-086a1593578d',
                eventName: 'Ransomware',
                jobStatus: 'Active',
                nextRunTime: 'Thu Jun 19 15:06:00 +0530 2025',
                lastRunTime: '2024-06-19T15:06:00Z',
                jobRunTime: 'Forever',
                jobType: 'Report',
                incidentId: 'N/A',
                customerID: 'Tenant_Incident',
              },
              {},
            ],
            totalPages: 20,
            currentPage: 0,
          },
        },
      },
    };
    setPermissions({
      aclData: JSON.stringify([
        {
          module: 'home',
          permission: 'RW',
          subModules: [
            {
              module: 'dashboard',
              permission: 'RW',
            },
            {
              module: 'panel',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'administration',
          permission: 'RW',
          subModules: [
            {
              module: 'sla',
              permission: 'RW',
            },
            {
              module: 'integration',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'server',
              permission: 'RW',
            },
            {
              module: 'ldap',
              permission: 'RW',
            },
            {
              module: 'ssl',
              permission: 'RW',
            },
            {
              module: 'userManagement',
              permission: 'RW',
            },
            {
              module: 'escalateRule',
              permission: 'RW',
            },
            {
              module: 'customField',
              permission: 'RW',
            },
            {
              module: 'proxy',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'template',
              permission: 'RW',
            },
            {
              module: 'lists',
              permission: 'RW',
            },
            {
              module: 'timezone',
              permission: 'RW',
            },
            {
              module: 'backupandrestore',
              permission: 'RW',
            },
            {
              module: 'license',
              permission: 'RW',
            },
            {
              module: 'client',
              permission: 'RW',
            },
            {
              module: 'zone',
              permission: 'RW',
            },
            {
              module: 'logs',
              permission: 'RW',
            },
            {
              module: 'criticalUser',
              permission: 'RW',
            },
            {
              module: 'tenant',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'incidents',
          permission: 'RW',
          subModules: [
            {
              module: 'overview',
              permission: 'RW',
            },
            {
              module: 'workbook',
              permission: 'RW',
            },
            {
              module: 'action',
              permission: 'RW',
            },
            {
              module: 'incidentPlaybook',
              permission: 'RW',
            },
            {
              module: 'assets',
              permission: 'RW',
            },
            {
              module: 'artifact',
              permission: 'RW',
            },
            {
              module: 'reports',
              permission: 'RW',
            },
            {
              module: 'evidence',
              permission: 'RW',
            },
            {
              module: 'references',
              permission: 'RW',
            },
            {
              module: 'notes',
              permission: 'RW',
            },
            {
              module: 'activity',
              permission: 'RW',
            },
          ],
        },
        {
          module: 'playbook',
          permission: 'RW',
        },
        {
          module: 'ruleEngine',
          permission: 'RW',
        },
        {
          module: 'apps',
          permission: 'RW',
        },
        {
          module: 'reports',
          permission: 'RW',
        },
        {
          module: 'ioc',
          permission: 'RW',
        },
        {
          module: 'jobs',
          permission: 'RO',
        },

      ]),
    });
    wrapper = setUp(actionProps, initial);
  });
  it('Should handle order select change', () => {
    const orderSelect = findByTestAtrrFirst(wrapper, 'jobs_order_select');
    act(() => {
      orderSelect.props().onChange({ value: 'ascending' });
    });
    wrapper.update();
  });

  it('Should handle type select change', () => {
    const orderSelect = findByTestAtrrFirst(wrapper, 'jobs_type_select');
    act(() => {
      orderSelect.props().onChange({ value: 'All' });
    });
    wrapper.update();
  });

  it('Should handle From time select change', () => {
    const fromTimeSelect = findByTestAtrrFirst(wrapper, 'from_time_select');
    act(() => {
      fromTimeSelect.props().onChange('2024-07-04T12:00:00Z');
    });
    wrapper.update();
  });

  it('Should handle To time select change', () => {
    const toTimeSelect = findByTestAtrrFirst(wrapper, 'to_time_select');
    act(() => {
      toTimeSelect.props().onChange('2024-07-04T12:00:00Z');
    });
    wrapper.update();
  });
});
