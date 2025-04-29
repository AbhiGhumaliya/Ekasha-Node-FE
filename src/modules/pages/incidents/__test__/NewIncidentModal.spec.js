import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import moment from 'moment';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../helpers/lib/RTL';
import IncidentsEkasha from '../../../containers/incidents';
import {
  createIncidentAction,
  getAllIncidentAction,
  GetOwnerAction,
} from '../../../../apis/incidents/actions';
import * as envData from '../../../../helpers/envData';

jest.useFakeTimers();

const mockScrollIntoView = jest.fn();

// Mock jQuery
global.$ = jest.fn(() => [{
  parentElement: {
    scrollIntoView: mockScrollIntoView,
  },
}]);

// Spy on the scrollToError function
jest.spyOn(envData, 'scrollToError');

const actionProps = {
  createIncidentAction,
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
            details: 'Test incident details',
            status: 'Queue',
            severity: 'Medium',
            riskWeightage: '0',
            createdOn: '2024-03-20T10:00:00Z',
          },
        ],
        totalCount: 1,
      },
    },
    CreateIncidentResponse: {
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
        {
          name: 'Tulesh Gosai (Tier 1)',
          value: 'b2e747',
        },
      ],
    },
  },
  Panel: {
    FatchFieldsDetailsResponse: {
      status: true,
      data: [
        {
          fieldType: 'text',
          name: 'Custom Field',
          value: 'custom_field',
          size: 100,
          regex: '^[a-zA-Z0-9]+$',
        },
        {
          fieldType: 'text',
          name: 'Custom Custom',
          value: 'custom_custom',
          size: 100,
          regex: '^[a-zA-Z0-9]+$',
        },
        {
          fieldType: 'text',
          name: 'Custom2',
          value: 'custom_2',
          size: 100,
          regex: '^[a-zA-Z0-9]+$',
        },
        {
          regex: '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$',
          size: 20,
          validationType: 'Long',
          name: 'Source Port',
          value: 'sourcePort',
          fieldType: 'long',
        },
      ],
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

describe('NewIncident Component', () => {
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

  describe('Basic Details Tab', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    beforeEach(() => {
      setUp(actionProps, initial, { tableView: true, customerID: 'Customer_1', setTableView: jest.fn() });
      // Clear the mock calls before each test
      envData.scrollToError.mockClear();
      mockScrollIntoView.mockClear();
    });
    it('Should handle all basic details inputs', async () => {
      jest.setTimeout(10000);
      const createButton = getById('Incident_Add_Button_Icon');
      fireEvent.click(createButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const SubmitButton = getById('Create_Incident_Modal_Submit_Button');
      // Incident Name
      const incidentNameInput = getById('Create_Incident_Modal_Incident_Name_Input');
      fireEvent.change(incidentNameInput, { target: { value: 'Test Incident' } });
      expect(incidentNameInput.value).toBe('Test Incident');

      fireEvent.click(SubmitButton);

      // Details
      const detailsInput = getById('Create_Incident_Modal_Details_Input');
      fireEvent.change(detailsInput, { target: { value: 'Test Details' } });
      expect(detailsInput.value).toBe('Test Details');

      const dateTimePicker = getById('Create_Incident_Modal_Occured_At_DateTime_Picker');

      // Current Time Checkbox
      const currentTimeCheckbox = getById('Create_Incident_Modal_Current_Time_Checkbox');
      fireEvent.click(currentTimeCheckbox);
      expect(currentTimeCheckbox).toBeChecked();

      fireEvent.change(dateTimePicker, { target: { value: 'Invalid date' } });
      fireEvent.click(SubmitButton);

      fireEvent.click(currentTimeCheckbox);
      fireEvent.click(currentTimeCheckbox);

      fireEvent.change(dateTimePicker, { target: { value: '' } });
      fireEvent.click(SubmitButton);

      fireEvent.click(currentTimeCheckbox);

      // Mock current date to a fixed value
      const mockDate = new Date('2025-01-06T09:00:00Z');
      jest.setSystemTime(mockDate);

      // Date Time Picker
      fireEvent.change(dateTimePicker, { target: { value: moment('abcd').format().toString() } });
      fireEvent.click(SubmitButton);
      fireEvent.change(dateTimePicker, { target: { value: moment('2025-01-06T10:00:00Z').format().toString() } });
      fireEvent.click(SubmitButton);
      fireEvent.change(dateTimePicker, { target: { value: moment('2024-03-20T10:00:00Z').format().toString() } });
      fireEvent.click(SubmitButton);
      expect(dateTimePicker.value).toBe(moment('2024-03-20T10:00:00Z').format().toString());

      selectOption('Create_Incident_Modal_Status_Select', 'Response');

      // Severity Select
      const severityRadio = getById('Radio_Name_Create_Incident_Modal_Low_Severity_Radio_Medium');
      fireEvent.click(severityRadio);

      selectOption('Create_Incident_Modal_Incident_Type_Select', 'Malware');
      selectOption('Create_Incident_Modal_Cyber_Killchain_Stage_Select', 'Exploitation');
      selectOption('Create_Incident_Modal_Impact_Select', 'Regulatory');
      selectOption('Create_Incident_Modal_Owner_Select', 'Ekasha Admin (Administrator)');

      selectOption('Create_Incident_Modal_Assign_To_Select', 'Tulesh Gosai (Tier 1)');
      selectOption('Create_Incident_Modal_Data_Type_Select', 'Health Information');
      selectOption('Create_Incident_Modal_Data_Classification_Select', 'Top Secret');
      selectOption('Create_Incident_Modal_CIA_Triad_Impact_Select', 'Integrity');
      const keywordsInput = getById('Create_Incident_Modal_Keywords_Chip_Input');
      fireEvent.change(keywordsInput, { target: { value: 'test,keyword' } });
      fireEvent.keyDown(keywordsInput, { key: 'Enter' });

      fireEvent.click(SubmitButton);
    });

    it('Should handle all Threat Information Tabs inputs', async () => {
      const createButton = getById('Incident_Add_Button_Icon');
      fireEvent.click(createButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const SubmitButton = getById('Create_Incident_Modal_Submit_Button');
      expect(SubmitButton).toBeInTheDocument();
      const ThreatInformationTab = document.querySelector('[data-node-key="Threat Information"]');
      fireEvent.click(ThreatInformationTab);

      const threatNameInput = getById('Create_Incident_Modal_Threat_Name_Input');
      fireEvent.change(threatNameInput, { target: { value: 'Test Threat Name' } });

      const threatTypeInput = getById('Create_Incident_Modal_Threat_Type_Input');
      fireEvent.change(threatTypeInput, { target: { value: 'Test Threat Type' } });

      const threatDescriptionInput = getById('Create_Incident_Modal_Threat_Description_Input');
      fireEvent.change(threatDescriptionInput, { target: { value: 'Test Threat Description' } });

      selectOption('Create_Incident_Modal_Attack_Mechanism_Select', 'Information');

      selectOption('Create_Incident_Modal_Attack_Agent_Select', 'Outsider');

      const mitreTacticInput = getById('Create_Incident_Modal_MITRE_Tactic_Input');
      fireEvent.change(mitreTacticInput, { target: { value: 'Test MITRE Tactic' } });

      const mitreTacticIdInput = getById('Create_Incident_Modal_MITRE_Tactic_ID_Input');
      fireEvent.change(mitreTacticIdInput, { target: { value: 'Test MITRE Tactic ID' } });

      const mitreTechniqueInput = getById('Create_Incident_Modal_MITRE_Technique_Input');
      fireEvent.change(mitreTechniqueInput, { target: { value: 'Test MITRE Technique' } });

      const mitreTechniqueIdInput = getById('Create_Incident_Modal_MITRE_Technique_ID_Input');
      fireEvent.change(mitreTechniqueIdInput, { target: { value: 'Test MITRE Technique ID' } });

      const mitreSubTechniqueInput = getById('Create_Incident_Modal_MITRE_Sub_Technique_Input');
      fireEvent.change(mitreSubTechniqueInput, { target: { value: 'Test MITRE Sub Technique' } });

      const mitreSubTechniqueIdInput = getById('Create_Incident_Modal_MITRE_Sub_Technique_ID_Input');
      fireEvent.change(mitreSubTechniqueIdInput, { target: { value: 'Test MITRE Sub Technique ID' } });

      fireEvent.click(SubmitButton);
    });

    it('Should handle all Data Tab inputs', async () => {
      const createButton = getById('Incident_Add_Button_Icon');
      fireEvent.click(createButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const SubmitButton = getById('Create_Incident_Modal_Submit_Button');
      expect(SubmitButton).toBeInTheDocument();

      const incidentNameInput = getById('Create_Incident_Modal_Incident_Name_Input');
      fireEvent.change(incidentNameInput, { target: { value: 'Test Incident' } });

      const currentTimeCheckbox = getById('Create_Incident_Modal_Current_Time_Checkbox');
      fireEvent.click(currentTimeCheckbox);

      selectOption('Create_Incident_Modal_Status_Select', 'Response');
      selectOption('Create_Incident_Modal_Owner_Select', 'Ekasha Admin (Administrator)');

      const dataTab = document.querySelector('[data-node-key="Data"]');
      fireEvent.click(dataTab);

      selectOption('Create_Incident_Modal_Incident_Data_Fields_Select', 'Custom Field');

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const customFieldInput = getById('Create_Incident_Modal_Sub_Types_0');
      fireEvent.change(customFieldInput, { target: { value: 'Test Custom Field' } });
      fireEvent.change(customFieldInput, { target: { value: '' } });
      fireEvent.click(SubmitButton);

      selectOption('Create_Incident_Modal_Incident_Data_Fields_Select', 'Source Port');

      fireEvent.change(customFieldInput, { target: { value: 'Test Custom Field' } });
      const customFieldInput1 = getById('Create_Incident_Modal_Sub_Types_1');
      fireEvent.change(customFieldInput1, { target: { value: '123' } });

      const removeButton = getById('Create_Incident_Modal_Sub_Types_Remove_0');
      fireEvent.click(removeButton);

      selectOption('Create_Incident_Modal_Incident_Data_Fields_Select', 'Custom Custom');
      const customFieldInput2 = getById('Create_Incident_Modal_Sub_Types_1');
      fireEvent.change(customFieldInput2, { target: { value: '' } });

      selectOption('Create_Incident_Modal_Incident_Data_Fields_Select', 'Custom2');
      const customFieldInput3 = getById('Create_Incident_Modal_Sub_Types_2');
      fireEvent.change(customFieldInput3, { target: { value: 'fhdfhf' } });

      const removeButton2 = getById('Create_Incident_Modal_Sub_Types_Remove_2');
      fireEvent.click(removeButton2);

      fireEvent.click(SubmitButton);
    });

    it('Should handle Alert Tab inputs', async () => {
      const createButton = getById('Incident_Add_Button_Icon');
      fireEvent.click(createButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const incidentNameInput = getById('Create_Incident_Modal_Incident_Name_Input');
      fireEvent.change(incidentNameInput, { target: { value: 'Test Incident' } });

      const currentTimeCheckbox = getById('Create_Incident_Modal_Current_Time_Checkbox');
      fireEvent.click(currentTimeCheckbox);

      selectOption('Create_Incident_Modal_Status_Select', 'Response');
      selectOption('Create_Incident_Modal_Owner_Select', 'Ekasha Admin (Administrator)');

      const alertTab = document.querySelector('[data-node-key="Alert"]');
      fireEvent.click(alertTab);
      const SubmitButton = getById('Create_Incident_Modal_Submit_Button');

      const logTypeRadio = getById('Radio_Name_Create_Incident_Modal_Alert_Log_Type_Radio_Text');
      fireEvent.click(logTypeRadio);

      fireEvent.click(SubmitButton);

      const alertDataInput = getById('Create_Incident_Modal_Alert_Alert_Data_Textarea');
      fireEvent.change(alertDataInput, { target: { value: 'Test Alert Data' } });

      const logTypeRadioJSON = getById('Radio_Name_Create_Incident_Modal_Alert_Log_Type_Radio_JSON');
      fireEvent.click(logTypeRadioJSON);

      fireEvent.click(SubmitButton);

      fireEvent.change(alertDataInput, { target: { value: 'abc' } });
      fireEvent.click(SubmitButton);
      fireEvent.change(alertDataInput, { target: { value: '{"abc": "aa"}' } });
      fireEvent.click(SubmitButton);
      fireEvent.change(alertDataInput, { target: { value: '[{"abc":"123"}]' } });
      fireEvent.click(SubmitButton);
    });
  });

  describe('Modal Close', () => {
    it('Should close modal and reset form when clicking close button', async () => {
      const createButton = getById('Incident_Add_Button_Icon');
      fireEvent.click(createButton);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      // Fill some data
      fireEvent.change(getById('Create_Incident_Modal_Incident_Name_Input'), {
        target: { value: 'Test Incident' },
      });

      // Close modal
      const closeButton = getById('ekasha_model_close_Create_Incident_Modal');
      fireEvent.click(closeButton);

      // Verify modal is closed
      expect(getById('Create_Incident_Modal')).not.toBeInTheDocument();

      // Reopen modal and verify form is reset
      fireEvent.click(createButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(getById('Create_Incident_Modal_Incident_Name_Input').value).toBe('');
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
});
