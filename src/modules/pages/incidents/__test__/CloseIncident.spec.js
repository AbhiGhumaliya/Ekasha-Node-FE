import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  getAllIncidentAction,
} from '../../../../apis/incidents/actions';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';

jest.useFakeTimers();

const actionProps = {
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
            status: 'In Progress',
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
            status: 'In Progress',
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

describe('CloseIncidentModal Tests', () => {
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
      setPermissions(handlePermission('RW', 'incidents'));
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
    });

    it('Should open close incident modal', async () => {
      // Select incident
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const changeStatusButton = getById('Incident_Table_View_Change_Status_Button');
      fireEvent.click(changeStatusButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      selectOption('Change_Incident_Status_Select', 'Close');

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const saveButton = getById('Close_Incident_Submit');
      fireEvent.click(saveButton);

      setPermissions(handlePermission('RW', 'incidents', 'overview'));

      const commentsInput = getById('Close_Incident_Comments_Input');
      fireEvent.change(commentsInput, { target: { value: 'Test comments' } });
      fireEvent.change(commentsInput, { target: { value: '' } });
      fireEvent.click(saveButton);

      selectOption('Close_Incident_Reason_Select', 'Duplicate');
      fireEvent.click(saveButton);
      selectOption('Close_Incident_Root_Cause_Select', 'Other');
      fireEvent.click(saveButton);

      fireEvent.change(commentsInput, { target: { value: 'Test comments' } });

      fireEvent.click(saveButton);
    });

    it('Should handle modal close', async () => {
      const checkBox = getById('incident_table_view_checkBox_1');
      fireEvent.click(checkBox);

      const changeStatusButton = getById('Incident_Table_View_Change_Status_Button');
      fireEvent.click(changeStatusButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      selectOption('Change_Incident_Status_Select', 'Close');

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const closeButton = getById('ekasha_model_close_Status_Closed_Incident_Modal');
      fireEvent.click(closeButton);
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});
