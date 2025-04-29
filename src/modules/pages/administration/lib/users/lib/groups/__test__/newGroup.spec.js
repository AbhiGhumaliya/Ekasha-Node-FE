import '@testing-library/jest-dom';
import React, { act } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../../../../helpers/lib/RTL';
import GroupsEkasha from '../../../../../../../containers/administration/GroupsEkasha';
import {
  getAllGroupAction,
  deleteGroupAction,
  createGroupAction,
  getSingleGroupAction,
  updateGroupAction,
  fakeActionGroup,
} from '../../../../../../../../apis/administration/groups/groups.action';
import {
  tenantListAction,
  fakeActionTenant,
  permissionBasedTenantListAction,
} from '../../../../../../../../apis/administration/tenant/tenant.action';
import NewGroup from '../lib/NewGroup';
import { TimeFilContext } from '../../../../../../../containers/TimeFilterContext';
import { mockStore } from '../../../../../../../../setupTests';

jest.useFakeTimers();

const actionProps = {
  getAllGroupAction,
  deleteGroupAction,
  createGroupAction,
  getSingleGroupAction,
  updateGroupAction,
  fakeActionGroup,
  tenantListAction,
  fakeActionTenant,
  permissionBasedTenantListAction,
  openModal: false,
  openGroupModal: false,
};

const mockGroupData = [
  {
    token: 'groupToken',
    name: 'Admin Group',
    createdTime: '2024-09-30T15:43:30Z',
    ownerName: 'Gosai Tulesh',
    ownerToken: 'y43ff06cd-cd17-4e0c-8e0c-8cbc36905976',
    administration: {
      sla: 'RO',
      riskScore: 'NA',
      integration: 'RW',
      assets: 'RW',
      server: 'RW',
      ldap: 'RW',
      ssl: 'RW',
      criticalUser: 'RW',
      userManagement: 'RW',
      tenant: 'RW',
      workbook: 'RW',
      template: 'RW',
      timezone: 'RW',
      backupandrestore: 'RW',
      license: 'RW',
      client: 'RW',
      zone: 'RW',
      customField: 'RW',
      proxy: 'RW',
      logs: 'RO',
      lists: 'RW',
      escalateRule: 'RW',
      administration: 'RW',
    },
    incidents: {
      overview: 'RW',
      action: 'RW',
      incidentWorkbook: 'RW',
      incidentPlaybook: 'RW',
      incidentAssets: 'RW',
      evidence: 'RW',
      incidentReports: 'RW',
      references: 'RW',
      artifact: 'RW',
      activity: 'NA',
      notes: 'RW',
      incidents: 'RO',
    },
    home: {
      dashboard: 'RW',
      panel: 'RW',
      home: 'NA',
    },
    playbook: 'RW',
    ioc: 'RO',
    reports: 'NA',
    jobs: 'RO',
    ruleEngine: 'RW',
    apps: 'RW',
    customerID: 'ActionTest,Ekasha,Customer_QA',
  },
  {
    token: 'groupToken1',
    name: 'User Group',
    createdTime: '2024-09-30T15:43:30Z',
    ownerName: 'Abhi Ghumaliya',
    ownerToken: 'y43ff06cd-cd17-4e0c-8e0c-8cbc36905976',
    administration: {
      sla: 'RW',
      riskScore: 'RW',
      integration: 'RW',
      assets: 'RW',
      server: 'RW',
      ldap: 'RW',
      ssl: 'RW',
      criticalUser: 'RW',
      userManagement: 'RW',
      tenant: 'RW',
      workbook: 'RW',
      template: 'RW',
      timezone: 'RW',
      backupandrestore: 'RW',
      license: 'RW',
      client: 'RW',
      zone: 'RW',
      customField: 'RW',
      proxy: 'RW',
      logs: 'RO',
      lists: 'RW',
      escalateRule: 'RW',
      administration: 'RW',
    },
    incidents: {
      overview: 'RW',
      action: 'RW',
      incidentWorkbook: 'RW',
      incidentPlaybook: 'RW',
      incidentAssets: 'RW',
      evidence: 'RW',
      incidentReports: 'RW',
      references: 'RW',
      artifact: 'RW',
      activity: 'RO',
      notes: 'RW',
      incidents: 'RW',
    },
    home: {
      dashboard: 'RW',
      panel: 'RW',
      home: 'RW',
    },
    playbook: 'RW',
    ioc: 'RW',
    reports: 'RW',
    jobs: 'RO',
    ruleEngine: 'RW',
    apps: 'NA',
    customerID: 'ActionTest,Ekasha,Customer_QA',
  },
  {
    token: 'x249a2995-3666-4243-af80-1d5c26739a33',
    name: 'Test Group',
    createdTime: '2024-09-30T15:43:30Z',
    ownerName: 'Shivangi Vekariya',
    ownerToken: 'y43ff06cd-cd17-4e0c-8e0c-8cbc36905976',
    administration: {
      sla: 'RW',
      riskScore: 'RW',
      integration: 'RW',
      assets: 'RW',
      server: 'RW',
      ldap: 'RW',
      ssl: 'RW',
      criticalUser: 'RW',
      userManagement: 'RW',
      tenant: 'RW',
      workbook: 'RW',
      template: 'RW',
      timezone: 'RW',
      backupandrestore: 'RW',
      license: 'RW',
      client: 'RW',
      zone: 'RW',
      customField: 'RW',
      proxy: 'RW',
      logs: 'RO',
      lists: 'RW',
      escalateRule: 'RW',
      administration: 'RW',
    },
    incidents: {
      overview: 'RW',
      action: 'RW',
      incidentWorkbook: 'RW',
      incidentPlaybook: 'RW',
      incidentAssets: 'RW',
      evidence: 'RW',
      incidentReports: 'RW',
      references: 'RW',
      artifact: 'RW',
      activity: 'RO',
      notes: 'RW',
      incidents: 'RW',
    },
    home: {
      dashboard: 'RW',
      panel: 'RW',
      home: 'RW',
    },
    playbook: 'RW',
    ioc: 'RW',
    reports: 'RW',
    jobs: 'RO',
    ruleEngine: 'RW',
    apps: 'NA',
    customerID: 'ActionTest,Ekasha,Customer_QA',
  },
];

const mockTenantList = [
  { name: 'Tenant 1', value: 'tenant1' },
  { name: 'Tenant 2', value: 'tenant2' },
  { name: 'Tenant 3', value: 'tenant3' },
];

const initialData = {
  Group: {
    GetAllGroupResponse: {
      status: true,
      data: {
        content: mockGroupData,
        number: 0,
        totalElements: 2,
        totalPages: 1,
      },
    },
  },
  Tenant: {
    TenantListResponse: {
      status: true,
      data: mockTenantList,
    },
  },
};

const setUp = (props = {}, initialState = { Group: {}, Tenant: {} }) => renderComponent(
  GroupsEkasha,
  props,
  initialState,
  null,
);

describe('New Group Form Tests', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  describe('Modal Opening and Basic Form Rendering', () => {
    it('Should open new group modal with empty form', async () => {
      setUp({
        ...actionProps,
        openModal: true,
        openGroupModal: true,
        setOpenGroupModal: jest.fn(),
      }, initialData);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should focus on group name input when modal opens', async () => {
      setUp({
        ...actionProps,
        openModal: true,
        openGroupModal: true,
        setOpenGroupModal: jest.fn(),
      }, initialData);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const groupNameInput = getById('create_group_name');
      expect(groupNameInput).toHaveFocus();
    });
  });

  describe('Form Field Interactions', () => {
    beforeEach(async () => {
      setUp({
        ...actionProps,
        openModal: true,
        openGroupModal: true,
        setOpenGroupModal: jest.fn(),
      }, initialData);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle group name input', () => {
      const groupNameInput = getById('create_group_name');
      fireEvent.change(groupNameInput, { target: { value: 'Test Group' } });
      expect(groupNameInput.value).toBe('Test Group');
    });

    it('Should handle Tanent removing tenants', async () => {
      // First add a tenant
      selectOption('topbar_group_tenant_select', 'Tenant 1');
      selectOption('topbar_group_tenant_select', 'Tenant 2');

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      // Then remove it
      const removeButton = getById('create_group_auxilary_role_remove0');
      fireEvent.click(removeButton);
    });
  });

  describe('Permission Management', () => {
    beforeEach(async () => {
      setUp({
        ...actionProps,
        openModal: true,
        openGroupModal: true,
        setOpenGroupModal: jest.fn(),
      }, initialData);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle main module read permission changes', () => {
      const readPermission = getById('create_group_subModules01');
      fireEvent.click(readPermission);
      fireEvent.click(readPermission);
    });

    it('Should handle main module write permission changes', () => {
      const readPermission = getById('create_group_subModules02');
      fireEvent.click(readPermission);
      fireEvent.click(readPermission);
    });

    it('Should handle sub-module read permission changes', () => {
      // First enable main module read permission
      const mainModuleRead = getById('create_group_subModules01');
      fireEvent.click(mainModuleRead);

      // Then test sub-module permission
      const subModuleRead = getById('create_group_submodules001');
      fireEvent.click(subModuleRead);
      fireEvent.click(subModuleRead);
    });

    it('Should handle sub-module write permission changes', () => {
      // First enable main module read permission
      const mainModuleRead = getById('create_group_subModules02');
      fireEvent.click(mainModuleRead);

      // Then test sub-module permission
      const subModuleRead = getById('create_group_submodules011');
      fireEvent.click(subModuleRead);
      fireEvent.click(subModuleRead);

      const subModule1Read = getById('create_group_submodules012');
      fireEvent.click(subModule1Read);
      fireEvent.click(subModule1Read);
    });

    it('Should handle select/deselect all permissions', () => {
      const selectAllButton = getById('create_group_selectAllValue');
      fireEvent.click(selectAllButton);
      fireEvent.click(selectAllButton);
      // Verify permissions are selected
    });
  });

  describe('Edit Group Model', () => {
    let wrapper;
    beforeEach(async () => {
      // Deep clone initial data to avoid mutations
      const initial = {
        ...initialData,
        Group: {
          ...initialData.Group,
          GetSingleGroupResponse: {
            status: true,
            data: { ...mockGroupData[0] },
          },
        },
      };

      // Render component with initial data
      wrapper = setUp({
        ...actionProps,
        setGroupAddStatus: jest.fn(),
        setOpenGroupModal: jest.fn(),
      }, initial);

      const editButton = getById('Admin_User_ekasha_edit_group_btn_groupToken');
      fireEvent.click(editButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle group update submission', async () => {
      const initial = {
        ...initialData,
        Group: {
          ...initialData.Group,
          GetSingleGroupResponse: {
            status: true,
            data: { ...mockGroupData[0] },
          },
        },
      };
      const store = mockStore(initial);
      const propsData = {
        ...actionProps,
        setGroupAddStatus: jest.fn(),
        setOpenGroupModal: jest.fn(),
        setGroupModelLoading: jest.fn(),
        setSubmitLoading: jest.fn(),
        handleCloses: jest.fn(),
        openGroupModal: true,
      };
      wrapper.rerender(
        <Router>
          <Provider store={store}>
            <TimeFilContext.Provider value={null}>
              <NewGroup {...propsData} modalType="edit" />
            </TimeFilContext.Provider>
          </Provider>
        </Router>,
      );
      // Change group name
      const groupNameInput = getById('create_group_name');
      fireEvent.change(groupNameInput, { target: { value: 'Updated Group Name' } });
      expect(groupNameInput.value).toBe('Updated Group Name');

      // Click update button
      const updateButton = screen.getByText('Update group');
      fireEvent.click(updateButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      // Verify update confirmation modal appears
      expect(screen.getByText('Are you sure to Update this group ?')).toBeInTheDocument();
      // Confirm update
      const modelYesButton = screen.getByText('Yes');
      fireEvent.click(modelYesButton);
      const modelNoButton = screen.getByText('No');
      fireEvent.click(modelNoButton);
      const modelCloseButton = getById('ConfirmModal_close_Admin_Group_update_confirm_modal');
      fireEvent.click(modelCloseButton);
    });
  });

  describe('Form Validation and Submission', () => {
    beforeEach(async () => {
      setUp({
        ...actionProps,
        openModal: true,
        openGroupModal: true,
        setOpenGroupModal: jest.fn(),
      }, initialData);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should validate required fields before submission', () => {
      const submitButton = screen.getByText('Add group');
      fireEvent.click(submitButton);
    });

    it('Should handle successful form submission', async () => {
      const groupNameInput = getById('create_group_name');
      fireEvent.change(groupNameInput, { target: { value: 'Valid Group' } });

      selectOption('topbar_group_tenant_select', 'Tenant 1');

      const selectAllButton = getById('create_group_selectAllValue');
      fireEvent.click(selectAllButton);

      const submitButton = screen.getByText('Add group');
      fireEvent.click(submitButton);
    });
    it('Should handle Validation And read permission form submission', async () => {
      const groupNameInput = getById('create_group_name');
      fireEvent.change(groupNameInput, { target: { value: '' } });

      const selectAllButton = getById('create_group_selectAllValue');
      fireEvent.click(selectAllButton);

      const readPermission1 = getById('create_group_subModules02');
      fireEvent.click(readPermission1);

      const submitButton = screen.getByText('Add group');
      fireEvent.click(submitButton);
    });
  });

  describe('GroupsEkasha Component - Response Handling', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'administration', 'userManagement'));
    });

    it('Should handle getAllsingleGroup response blank', () => {
      const initial = {
        ...initialData,
        Group: {
          ...initialData.Group,
          GetSingleGroupResponse: {
            status: true,
            data: { },
          },
        },
      };

      // Render component with initial data
      setUp({
        ...actionProps,
        openModal: false,
        openGroupModal: true,
        setOpenGroupModal: jest.fn(),
        setOpenModal: jest.fn(),
        setGroupAddStatus: jest.fn(),
      }, initial);

      const backButton = getById('create_group_backBtn');
      fireEvent.click(backButton);
    });

    it('Should handle getAllsingleGroup response false', () => {
      const initial = {
        ...initialData,
        Group: {
          ...initialData.Group,
          GetSingleGroupResponse: {
            status: false,
            data: { },
          },
        },
      };

      // Render component with initial data
      setUp({
        ...actionProps,
        openModal: false,
        openGroupModal: true,
        setOpenGroupModal: jest.fn(),
      }, initial);
    });

    it('Should handle getAllsingleGroup response Success', () => {
      const initial = {
        ...initialData,
        Group: {
          ...initialData.Group,
          GetSingleGroupResponse: {
            status: true,
            data: { ...mockGroupData[0], jobs: 'NA' },
          },
        },
      };

      // Render component with initial data
      setUp({
        ...actionProps,
        openModal: false,
        openGroupModal: true,
      }, initial);
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
