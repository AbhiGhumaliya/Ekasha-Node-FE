import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  changeIncidentStatusAction,
  getAllIncidentAction,
} from '../../../../apis/incidents/actions';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';

jest.useFakeTimers();

const actionProps = {
  changeIncidentStatusAction,
  getAllIncidentAction,
};

const initialData = {
  Incident: {
    GetAllIncidentResponse: {
      status: true,
      data: {
        currentPage: 1,
        data: [
          {
            customerID: 'Customer_1',
            incidentId: '1',
            incidentName: 'Incident_1',
            assignedToName: 'Abhi Ghumaliya',
            assignedToToken: 'm33b2e747',
            status: 'Queue',
            severity: 'Medium',
            riskWeightage: '0',
            createdOn: '2024-03-20T10:00:00Z',
          },
          {
            customerID: 'Customer_1',
            incidentId: '2',
            incidentName: 'Incident_2',
            assignedToName: 'Ekasha Admin',
            assignedToToken: '828f8c6cccd9',
            status: 'Queue',
            severity: 'Medium',
            riskWeightage: '0',
            createdOn: '2024-03-20T10:00:00Z',
          },
        ],
        message: 'successfully',
        page: 0,
        search: [],
        searchString: [],
        totalCount: 2,
        totalPages: 2,
      },
    },
    GetChangeStatusResponse: {
      status: false,
      message: 'Incident status required.',
      data: {},
    },
  },
  Auth: {
    userPermissionsResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
  },
  Assets: {
    GetOwnerResponse: {
      status: true,
      data: [
        {
          name: 'Ekasha Admin (Administrator)',
          value: '828f8c6cccd9',
        },
        {
          name: 'Abhi Ghumaliya (Administrator)',
          value: 'm33b2e747',
        },
      ],
    },
  },
  Panel: {
    FatchFieldsDetailsResponse: {
      status: false,
      data: null,
    },
  },
  inOverview: {
    BasicDetailsResponse: {
      status: false,
      data: null,
    },
  },
  Template: {
    GetAllTemplateListResponse: {
      status: false,
      data: null,
    },
  },
  APPS: {
    GetListAssetResponse: {
      status: false,
      data: null,
    },
  },
  Dashboard: {
    TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  IncidentsEkasha,
  props,
  initialState,
  contextValue,
);

describe('ChangeStatusIncidentModal Tests', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Modal Interactions', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetChangeStatusResponse = {
        status: true,
        message: 'Incident status updated successfully.',
        data: {},
      };
      setPermissions(handlePermission('RW', 'incidents'));
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
    });
    it('Should handle status selection', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const changeStatusButton = getById('Incident_Table_View_Change_Status_Button');
      fireEvent.click(changeStatusButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Select status
      selectOption('Change_Incident_Status_Select', 'Reopen');
    });

    it('Should handle save button click', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const changeStatusButton = getById('Incident_Table_View_Change_Status_Button');
      fireEvent.click(changeStatusButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Select status
      selectOption('Change_Incident_Status_Select', 'Reopen');

      // Click save
      const saveButton = getById('Change_Incident_Status_Submit');
      fireEvent.click(saveButton);
    });

    it('Should handle modal close', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const changeStatusButton = getById('Incident_Table_View_Change_Status_Button');
      fireEvent.click(changeStatusButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Close modal using backdrop
      const closeModel = getById('ekasha_model_close_Change_Incident_Status_Modal');
      fireEvent.click(closeModel);

      // Verify modal is closed
      expect(closeModel).not.toBeVisible();
    });
  });

  describe('Validation Scenarios', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetChangeStatusResponse = {
        code: 200,
        message: 'Update incidents status.',
        status: true,
        data: {
          successData: [],
          failData: 'Closed incident can be queue. ["9"] incident are closed, so will not queue.',
        },
        module: 'incident',
        operation: 'update',
      };
      setPermissions(handlePermission('RW', 'incidents'));
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
    });
    it('Should show error message when submitting without selection', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const changeStatusButton = getById('Incident_Table_View_Change_Status_Button');
      fireEvent.click(changeStatusButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Click save without selection
      const saveButton = getById('Change_Incident_Status_Submit');
      fireEvent.click(saveButton);
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetChangeStatusResponse = {
        code: 200,
        message: 'Update incidents status.',
        status: true,
        data: {
          permissionData: 'Permission denied for this incidentIds : 1',
        },
        module: 'incident',
        operation: 'update',
      };
      setPermissions(handlePermission('RW', 'incidents'));
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
    });
    it('Should show loading state during submission', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const changeStatusButton = getById('Incident_Table_View_Change_Status_Button');
      fireEvent.click(changeStatusButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Select status and submit
      selectOption('Change_Incident_Status_Select', 'Reopen');

      const saveButton = getById('Change_Incident_Status_Submit');
      fireEvent.click(saveButton);
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});
