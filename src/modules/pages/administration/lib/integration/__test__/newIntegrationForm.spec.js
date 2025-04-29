import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import IntegrationEkasha from '../../../../../containers/administration/IntegrationEkasha';
import { renderComponent, getById, selectOption } from '../../../../../../helpers/lib/RTL';
import {
  getAllIntegration,
  fakeActionIntegration,
  getSingleIntegration,
  deleteIntegrationAction,
  getAllFieldsAction,
  addIntegrationAction,
  updateIntegrationAction,
} from '../../../../../../apis/administration/integration/integration.action';

jest.useFakeTimers();

// Mock action props
const actionProps = {
  getAllIntegration,
  fakeActionIntegration,
  getSingleIntegration,
  deleteIntegrationAction,
  getAllFieldsAction,
  addIntegrationAction,
  updateIntegrationAction,
};

// Mock initial data
const mockIntegrationData = [{
  token: 'j0e259362-5439-4d4f-8281-599dfc91d2bc',
  mappings: 'assetId:rerer,incidentName:erer,incidentId:ererer',
  type: 'json',
  configName: 'terer',
  source: null,
  medium: 'backupServer',
  folderName: null,
  intervalUnit: null,
  jobKey: null,
  schedulingStatus: false,
  intr: 0,
  createdDate: '2024-11-26T12:47:28+05:30',
  configuration: '{"path":"sdfsd\\/fsdf","ip":"2.3.2.3","userName":"sdf"}',
}, {
  token: 'n0a674840-e4bf-4050-b0b7-c3b0f9d2628d',
  mappings: 'attachmentExtension:xzcx,incidentName:sdasd',
  type: 'json',
  configName: 'Configuration',
  source: '10.1.1.55',
  medium: 'tcp',
  folderName: null,
  intervalUnit: null,
  jobKey: null,
  schedulingStatus: false,
  intr: 0,
  createdDate: '2024-11-21T14:39:01+05:30',
  configuration: '{}',
}, {
  token: 'test-token3',
  configName: 'Test Integration 3',
  medium: 'tcp',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,description:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}, {
  token: 'test-token4',
  configName: 'Test Integration 4',
  medium: 'udp',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}, {
  token: 'test-token5',
  configName: 'Test Integration 5',
  medium: 'backupserver',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}, {
  token: 'test-token6',
  configName: 'Test Integration 6',
  medium: 'wrong',
  source: 'test@example.com',
  type: 'json',
  mappings: 'incidentName:value1,field2:value2',
  configuration: JSON.stringify({
    ip: '192.168.1.1', port: '514', path: '/test/path', userName: 'test', password: 'test',
  }),
  intr: 1,
  intervalUnit: 'MINUTE',
  schedulingStatus: true,
  folderName: 'TestFolder',
}];

const mockInitialData = {
  Integration: {
    GetAllIntegration: {
      status: true,
      data: {
        currentPage: 0,
        totalElement: mockIntegrationData,
        totalCount: 6,
        totalPages: 1,
      },
    },
    GetAllFieldsResponse: {
      status: true,
      data: [
        { name: 'Incident Name', value: 'incidentName' },
        { name: 'Description', value: 'description' },
        { name: 'Priority', value: 'priority' },
      ],
    },
  },
};

const setUp = (props = {}, initialState = mockInitialData) => renderComponent(
  IntegrationEkasha,
  { ...actionProps, ...props },
  initialState, null,
);

describe('New Integration Form Tests', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'administration', 'integration'));
  });

  describe('Modal Opening and Basic Form Rendering', () => {
    it('Should open new integration modal with empty form', async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById('Admin_integration_Add_btn'));

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByText('Create Integration')).toBeInTheDocument();
    });

    it('Should focus on configuration name input when modal opens', async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById('Admin_integration_Add_btn'));

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const configNameInput = getById('create_Integration_configName');
      expect(configNameInput).toHaveFocus();
    });
  });

  describe('Form Field Interactions', () => {
    beforeEach(async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle configuration name input', () => {
      const configNameInput = getById('create_Integration_configName');
      fireEvent.change(configNameInput, { target: { value: 'Test Integration' } });
      expect(configNameInput.value).toBe('Test Integration');
    });

    it('Should handle source input for udp mediums', () => {
      selectOption('Admin_ekasha_medium_Select', 'UDP');

      const sourceInput = getById('create_Integration_source');
      fireEvent.change(sourceInput, { target: { value: 'test-source' } });
      expect(sourceInput.value).toBe('test-source');
    });

    it('Should handle configuration name input', () => {
      const configSourceInput = getById('create_Integration_source');
      fireEvent.change(configSourceInput, { target: { value: 'Test' } });
      expect(configSourceInput.value).toBe('Test');
    });
  });

  describe('Backup Server Configuration', () => {
    beforeEach(async () => {
      setUp(actionProps, mockInitialData);
    });

    it('Should render all backup server fields', async () => {
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      selectOption('Admin_ekasha_medium_Select', 'Backup Server');
      expect(getById('create_Integration_ip')).toBeInTheDocument();
      expect(getById('create_Integration_path')).toBeInTheDocument();
      expect(getById('create_Integration_user_name')).toBeInTheDocument();
      expect(getById('create_Integration_password')).toBeInTheDocument();
    });

    it('Should handle backup server field inputs', async () => {
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      // Test IP input
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);

      const configNameInput = getById('create_Integration_configName');
      fireEvent.change(configNameInput, { target: { value: 'Test Integration' } });

      selectOption('Admin_ekasha_medium_Select', 'Backup Server');

      const ipInput = getById('create_Integration_ip');
      fireEvent.change(ipInput, { target: { value: '192.168.1.1' } });
      expect(ipInput.value).toBe('192.168.1.1');

      // Test Path input
      const pathInput = getById('create_Integration_path');
      fireEvent.change(pathInput, { target: { value: '/test/path' } });
      expect(pathInput.value).toBe('/test/path');

      // Test Username input
      const usernameInput = getById('create_Integration_user_name');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      expect(usernameInput.value).toBe('testuser');

      // Test Password input
      const passwordInput = getById('create_Integration_password');
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
      expect(passwordInput.value).toBe('testpass');

      fireEvent.click(submitButton);
    });

    it('Should validate backup server fields', async () => {
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      selectOption('Admin_ekasha_medium_Select', 'Backup Server');
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);

      expect(screen.getByText('IP required.')).toBeInTheDocument();
      expect(screen.getByText('Path required.')).toBeInTheDocument();
      expect(screen.getByText('Username required.')).toBeInTheDocument();
      expect(screen.getByText('Password required.')).toBeInTheDocument();
    });
    it('Should validate backup server fields', async () => {
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      selectOption('Admin_ekasha_medium_Select', 'Backup Server');

      const ipInput = getById('create_Integration_ip');
      const pathInput = getById('create_Integration_path');
      fireEvent.change(ipInput, { target: { value: 'dsfsdsdsdfdsfdsfdsf' } });
      expect(ipInput.value).toBe('dsfsdsdsdfdsfdsfdsf');
      fireEvent.change(pathInput, { target: { value: 'dsfsdfdsfdsfdsf' } });
      expect(pathInput.value).toBe('dsfsdfdsfdsfdsf');
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);

      expect(screen.getByText('Invalid Path.')).toBeInTheDocument();
      expect(screen.getByText('Invalid IP.')).toBeInTheDocument();
    });
  });

  describe('JSON Mapping Configuration', () => {
    beforeEach(async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById(`ekasha_integration_edit_btn${1}`));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
    it('Should handle adding JSON field mappings', async () => {
      const jsonRadio = getById('Radio_Name_create_integration_status_JSON');
      fireEvent.click(jsonRadio);
      // const addButton = getById('adminnewIntegration_add');
      // // selectOption('create_Integration_field', 'Priority');
      // const filedValueDescription = getById('create_Integration_value');
      // fireEvent.change(filedValueDescription, { target: { value: '123' } });
      // fireEvent.click(addButton);

      // await act(async () => {
      //   jest.advanceTimersByTime(100);
      // });
    });

    it('Should handle removing JSON field mappings', async () => {
      // First add a field
      const addButton = getById('adminnewIntegration_add');
      selectOption('create_Integration_field', 'Priority');
      const filedValue = getById('create_Integration_value');
      fireEvent.change(filedValue, { target: { value: '123' } });
      fireEvent.click(addButton);

      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      // Then remove it
      const removeButton = getById(`create_Integration_remove${0}`);
      fireEvent.click(removeButton);
      const submitButton = screen.getByText('Update');
      fireEvent.click(submitButton);
    });
  });

  describe('Form Validation and Submission', () => {
    beforeEach(async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should show validation errors for empty required fields', async () => {
      const submitButton = screen.getByText('Create');
      fireEvent.click(submitButton);
    });
  });

  describe('Modal Actions Update', () => {
    beforeEach(async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById(`ekasha_integration_edit_btn${0}`));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should close modal when clicking update close', () => {
      const ipInput = getById('create_Integration_ip');
      fireEvent.change(ipInput, { target: { value: '192.168.1.12' } });
      expect(ipInput.value).toBe('192.168.1.12');

      const submitButton = screen.getByText('Update');
      fireEvent.click(submitButton);
    });
  });

  describe('Modal Actions Update close', () => {
    beforeEach(async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById(`ekasha_integration_edit_btn${0}`));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should close modal when clicking close button', () => {
      const closeButton = getById('ekasha_model_close_Admin_ekasha_Create_Modal');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Update Integration')).not.toBeInTheDocument();
    });
  });

  describe('Modal Actions', () => {
    beforeEach(async () => {
      setUp(actionProps, mockInitialData);
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should close modal when clicking close button', () => {
      const closeButton = getById('ekasha_model_close_Admin_ekasha_Create_Modal');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Create Integration')).not.toBeInTheDocument();
    });

    it('Should clear form data when modal is closed and reopened', async () => {
      // Fill some data
      const configNameInput = getById('create_Integration_configName');
      fireEvent.change(configNameInput, { target: { value: 'Test Integration' } });

      // Close modal
      const closeButton = getById('ekasha_model_close_Admin_ekasha_Create_Modal');
      fireEvent.click(closeButton);

      // Reopen modal
      fireEvent.click(getById('Admin_integration_Add_btn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Check if form is cleared
      const newConfigNameInput = getById('create_Integration_configName');
      expect(newConfigNameInput.value).toBe('');
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
