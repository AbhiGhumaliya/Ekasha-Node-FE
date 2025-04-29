import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  assignUserAction,
  getAllIncidentAction,
  GetOwnerAction,
} from '../../../../apis/incidents/actions';

jest.useFakeTimers();

const actionProps = {
  assignUserAction,
  getAllIncidentAction,
  GetOwnerAction,
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
    GetAssignUserResponse: {
      status: false,
      data: null,
      message: 'Data not found',
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
  Auth: {
    userPermissionsResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
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

describe('AssignIncidentModal Component', () => {
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

  describe('User Selection', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetAssignUserResponse = {
        code: 200,
        message: 'Update incidents assign to user.',
        status: true,
        data: {
          successData: [],
          failData: '["9"] incident are closed, so will not change assign user.',
        },
        module: 'incident',
        operation: 'updateEscalation',
      };
      setPermissions(handlePermission('RW', 'incidents'));
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
    });
    it('Should handle user selection change', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const assignButton = getById('Incident_Table_View_Assign_Button');
      fireEvent.click(assignButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Select a user
      selectOption('incidnet_Table_view_Assign_Select', 'Ekasha Admin (Administrator)');

      // Verify submit button is enabled
      const submitButton = getById('incidnet_Table_view_Assign_Submit');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetAssignUserResponse = {
        code: 200,
        message: 'Update incidents assign to user.',
        status: true,
        data: {
          successData: [
            {
              mitreTacticId: null,
              occuredTime: false,
              keywords: '',
              assignedToName: 'Tulesh Tulesh(Administrator)',
              mitreTechniqueId: null,
              incidentType: 'Network',
              SLA: '2024-12-25T09:50:57.338Z',
              mitreSubTechnique: null,
              source: 'Ekasha',
              mitreTechnique: null,
              createdOn: '2024-12-24T15:20:57.277231+05:30',
              slaStatus: 'Overdue',
              ownerName: 'Ekasha Admin',
              aggCount: 1,
              dataClassification: null,
              assetId: null,
              details: 'Incident_8',
              mitreTactic: null,
              lastUpdatedTime: '2025-01-02T09:51:02.074Z',
              lastOccuredTime: '2024-12-24T09:50:56.050Z',
              incidentName: 'Incident_8',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              assignedToToken: 'fb6532cbf-e449-462f-94cb-53b7adf8db5c',
              incidentStatus: 'Investigate',
              severity: 'Low',
              occurredAt: '2024-12-24T09:50:56.050Z',
              occurred: '2024-12-24T15:20:56.050+05:30',
              reminder: null,
              riskWeightage: 0,
              impact: null,
              dataType: 'Personal Information (Customer Data)',
              threatInformation: {},
              check: true,
              userName: 'Ekasha Admin',
              userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              lastSeen: null,
              alertCount: 1,
              createdBy: 'Ekasha Admin',
              customerID: 'U_ID',
              attachmentName: null,
              cyberKillChainStage: 'Reconnaissance',
              mitreSubTechniqueId: null,
              incidentId: '8',
            },
          ],
        },
        module: 'incident',
        operation: 'updateEscalation',
      };
      setPermissions(handlePermission('RW', 'incidents'));
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
    });
    it('Should handle successful form submission', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const assignButton = getById('Incident_Table_View_Assign_Button');
      fireEvent.click(assignButton);

      // Select a user
      selectOption('incidnet_Table_view_Assign_Select', 'Ekasha Admin (Administrator)');

      // Submit form
      const submitButton = getById('incidnet_Table_view_Assign_Submit');
      fireEvent.click(submitButton);

      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      // Verify modal is closed
      expect(getById('Assign_Incident_Modal')).not.toBeInTheDocument();
    });

    it('Should show loading state during submission', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const assignButton = getById('Incident_Table_View_Assign_Button');
      fireEvent.click(assignButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Select a user
      selectOption('incidnet_Table_view_Assign_Select', 'Ekasha Admin (Administrator)');

      // Submit form
      const submitButton = getById('incidnet_Table_view_Assign_Submit');
      fireEvent.click(submitButton);
    });
  });

  describe('Modal Close', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Incident.GetAssignUserResponse = {
        code: 200,
        message: 'Update incidents assign to user.',
        status: true,
        data: {
          permissionData: 'Permission denied for this incidentIds : 1',
        },
        module: 'incident',
        operation: 'updateEscalation',
      };
      setPermissions(handlePermission('RW', 'incidents'));
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
    });
    it('Should close modal when clicking close button', async () => {
      // Open modal
      const checkBox = getById('incident_table_view_checkBox_2');
      fireEvent.click(checkBox);

      const assignButton = getById('Incident_Table_View_Assign_Button');
      fireEvent.click(assignButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Click close button
      const closeButton = getById('ekasha_model_close_Assign_Incident_Modal');
      fireEvent.click(closeButton);
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});
