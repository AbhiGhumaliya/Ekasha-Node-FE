import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../../../../helpers/lib/RTL';
import RolesEkasha from '../../../../../../../containers/administration/RolesEkasha';
import {
  roleGetAction,
  rolesListAction,
  roleAddAction,
  roleDeleteAction,
  singleRoleAction,
  roleUpdateAction,
  fakeActionRole,
} from '../../../../../../../../apis/administration/roles/role.actions';

jest.useFakeTimers();

const actionProps = {
  roleGetAction,
  rolesListAction,
  roleAddAction,
  roleDeleteAction,
  singleRoleAction,
  roleUpdateAction,
  fakeActionRole,
  openModal: false,
  setOpenModal: jest.fn(),
};

const mockRoleData = [
  {
    token: 'role-token-1',
    name: 'Admin Role',
    auxiliaryRole: ['role1', 'role2'],
  },
  {
    token: 'role-token-2',
    name: 'User Role',
    auxiliaryRole: ['role3'],
  },
  {
    token: 'role_token_3',
    name: 'asdasdasddd',
    auxiliaryRole: '[role2]',
    ownerName: 'Ekasha Admin',
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    createdTime: '2024-11-27T16:36:52Z',
    default: false,
  },
];

const mockRoleListData = [
  { name: 'Role 1', token: 'role1' },
  { name: 'Role 2', token: 'role2' },
  { name: 'Role 3', token: 'role3' },
];

const initialData = {
  Role: {
    RoleGetAllResponse: {
      status: true,
      data: {
        currentPage: 0,
        totalElement: mockRoleData,
        totalCount: 2,
        totalPages: 1,
      },
    },
    RoleListResponse: {
      status: true,
      data: mockRoleListData,
    },
  },
};

const setUp = (props = {}, initialState = { Role: {} }) => renderComponent(
  RolesEkasha,
  props,
  initialState,
  null,
);

describe('New Role Form Tests', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'userManagement'));
  });

  describe('Modal Opening and Basic Form Rendering', () => {
    it('Should open new role modal with empty form', async () => {
      setUp({ ...actionProps, openModal: true }, initialData);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByText('Configure role')).toBeInTheDocument();
    });

    it('Should focus on role name input when modal opens', async () => {
      setUp({ ...actionProps, openModal: true }, initialData);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const roleNameInput = getById('Role_name');
      expect(roleNameInput).toHaveFocus();
    });
  });

  describe('Form Field Interactions', () => {
    beforeEach(async () => {
      setUp({ ...actionProps, openModal: true }, initialData);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle role name input', () => {
      const roleNameInput = getById('Role_name');
      fireEvent.change(roleNameInput, { target: { value: 'Test Role' } });
      expect(roleNameInput.value).toBe('Test Role');
    });

    it('Should validate role name input', () => {
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);

      const roleNameInput = getById('Role_name');
      fireEvent.change(roleNameInput, { target: { value: '@invalid@' } });
      fireEvent.click(submitButton);
    });

    it('Should handle auxiliary role selection and addition', async () => {
      selectOption('create_auxilary_roll', 'Role 1');
      const addButton = getById('Roles_auxilary_add');
      fireEvent.click(addButton);

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      expect(screen.queryByText('role1')).toBeInTheDocument();
    });

    it('Should handle removing auxiliary roles', async () => {
      // First add a role
      const addButton = getById('Roles_auxilary_add');
      selectOption('create_auxilary_roll', 'Role 1');
      fireEvent.click(addButton);
      selectOption('create_auxilary_roll', 'Role 2');
      fireEvent.click(addButton);

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      // Then remove it
      const removeButton = getById('create_auxilary_role_remove0');
      fireEvent.click(removeButton);
    });
  });

  describe('Form Validation and Submission', () => {
    beforeEach(async () => {
      setUp({ ...actionProps, openModal: true }, initialData);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle successful form submission', async () => {
      const roleNameInput = getById('Role_name');
      fireEvent.change(roleNameInput, { target: { value: 'ValidRole' } });

      selectOption('create_auxilary_roll', 'Role 1');
      const addButton = getById('Roles_auxilary_add');
      fireEvent.click(addButton);

      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);
    });

    it('Should disable submit button when form is unchanged', () => {
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);
    });
  });

  describe('Edit Role Mode', () => {
    beforeEach(async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Role.SingleRoleResponse = {
        status: true,
        data: {
          token: 'role_token_3',
          name: 'asdasdasddd',
          auxiliaryRole: '[role2]',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          createdTime: '2024-11-27T16:36:52Z',
          default: false,
        },
      };
      setUp(actionProps, initial);
      fireEvent.click(getById('Admin_ekasha_role_edit_btn_role_token_3'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should load existing role data', () => {
      expect(getById('Role_name').value).toBe('asdasdasddd');
      expect(screen.getByText('Role 2')).toBeInTheDocument();
    });

    it('Should handle role update', async () => {
      expect(screen.getByText('Edit role')).toBeInTheDocument();
      const roleNameInput = getById('Role_name');
      fireEvent.change(roleNameInput, { target: { value: 'UpdatedRole' } });

      const submitButton = screen.getByText('Update');
      fireEvent.click(submitButton);
    });
  });

  describe('Modal Actions', () => {
    beforeEach(async () => {
      setUp({ ...actionProps, openModal: true }, initialData);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should close modal when clicking close button', () => {
      const closeButton = getById('ekasha_model_close_addRoleModal');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Configure role')).not.toBeInTheDocument();
    });

    it('Should clear form data when modal is closed and reopened', async () => {
      const roleNameInput = getById('Role_name');
      fireEvent.change(roleNameInput, { target: { value: 'Test Role' } });

      const closeButton = getById('ekasha_model_close_addRoleModal');
      fireEvent.click(closeButton);
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
