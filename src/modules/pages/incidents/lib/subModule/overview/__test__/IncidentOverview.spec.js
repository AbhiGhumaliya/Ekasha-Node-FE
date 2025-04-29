import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById, selectOption } from '../../../../../../../helpers/lib/RTL';
import OverviewEkasha from '../../../../../../containers/incidents/subModule/overviewEkasha';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import {
  fakeIncidentAction, getDetailsViewAction, getIncidentScoreAction, GetOwnerAction,
} from '../../../../../../../apis/incidents/actions';
import { fakeActionPanel, fetchFieldsForDetails } from '../../../../../../../apis/panel/panel.action';
import {
  addRawLog, basicDetailsAction, changeAssigneeAction, deleteTypeAction,
  fakeOverviewAction, getAllRawDataByIdAction, getRawData, getSingleRawData,
  typeDetailsAction,
} from '../../../../../../../apis/incidents/subModule/Overview/Overview.action';

jest.useFakeTimers();

const actionProps = {
  IncidentId: 1,
  GetOwnerAction,
  fakeIncidentAction,
  getIncidentScoreAction,
  fetchFieldsForDetails,
  fakeActionPanel,
  basicDetailsAction,
  fakeOverviewAction,
  typeDetailsAction,
  deleteTypeAction,
  changeAssigneeAction,
  getDetailsViewAction,
  addRawLog,
  getRawData,
  getSingleRawData,
  getAllRawDataByIdAction,
};

const socketData = [
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateTypeDetails',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentID: '1',
        updateData: [
          {
            sourceAddress: '192.168.1.1',
          },
          {
            sourceLocation: 'Test Location',
          },
          {
            riskWeightage: '0',
          },
        ],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'update',
      status: true,
      data: [{
        customerID: 'Customer_1',
        incidentId: '1',
        status: 'In Progress',
      },
      {
        customerID: 'Customer_1',
        incidentId: '11',
        threatInformation: {
          threatName: 'Threat123',
        },
      }],
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'update',
      status: true,
      data: [{
        customerID: 'Customer_1',
        incidentId: '11',
        status: 'In Progress',
      }],
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'addRawLog',
      status: true,
      data: {
        customerID: 'Customer_1',
        incidentId: '1',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'delete',
      status: true,
      data: {
        fieldName: 'sourceAddress',
        fieldValue: '10.2.3.3',
        fieldOp: 'deleted',
        incidentId: '1',
        customerID: 'Ekasha',
        userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        userName: 'Ekasha Admin',
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateEscalation',
      status: true,
      data: {
        assignedToName: 'Umesh Karkar (Administrator)',
        isEscalate: 'true',
        customerID: 'Customer_1',
        time: '2025-01-21T11:46:17.108Z',
        incidentId: '1',
        assignedToToken: 'n33696a55-28de-4762-8a11-9da8a3c7dddd',
        escalateHistory: [{ user: 'Umesh Karkar (Administrator)', time: '2025-01-21T11:46:17.108Z' }],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: 'updateEscalation',
      status: true,
      data: {
        assignedToName: 'Umesh Karkar (Administrator)',
        isEscalate: 'true',
        customerID: 'Customer_1',
        time: '2025-01-21T11:46:17.108Z',
        incidentId: '11',
        assignedToToken: 'n33696a55-28de-4762-8a11-9da8a3c7dddd',
        escalateHistory: [{ user: 'Umesh Karkar (Administrator)', time: '2025-01-21T11:46:17.108Z' }],
      },
    }),
  },
  {
    body: JSON.stringify({
      module: 'incident',
      operation: '',
    }),
  },
];

const initialData = {
  Incident: {
    GetAllIncidentResponse: {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        search: [],
        searchString: [],
        data: [
          {
            mitreTacticId: null,
            occuredTime: false,
            keywords: '',
            warroom: false,
            assignedToName: 'Umesh Karkar (Administrator)',
            mitreTechniqueId: null,
            incidentType: 'Network',
            isEscalate: 'true',
            SLA: '2025-01-03T17:50:40.193Z',
            mitreSubTechnique: null,
            source: 'Ekasha',
            mitreTechnique: null,
            createdOn: '2025-01-03T15:50:40.153125+05:30',
            slaStatus: '',
            ownerName: 'Umesh Karkar',
            aggCount: 1,
            dataClassification: null,
            typeDetails: null,
            details: 'Malicious software is typically spread through email- and web-based attacks. Attackers use malware to infect computers and corporate networks by exploiting vulnerabilities in their software, such as web browsers or web applications. Malware can lead to se',
            mitreTactic: null,
            lastUpdatedTime: '2025-01-03T07:00:57.793Z',
            lastOccuredTime: '2025-01-03T05:20:39.050Z',
            incidentName: 'Malware',
            ownerToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            assignedToToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            severity: 'Medium',
            occurredAt: '2025-01-03T05:20:39.050Z',
            occurred: '2025-01-03T10:50:39.050+05:30',
            reminder: null,
            riskWeightage: 0,
            impact: null,
            dataType: null,
            threatInformation: {},
            check: true,
            userName: 'Ekasha Admin',
            userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            lastSeen: null,
            alertCount: 1,
            createdBy: 'Ekasha Admin',
            isEdit: false,
            customerID: 'Customer_1',
            cyberKillChainStage: 'Reconnaissance',
            mitreSubTechniqueId: null,
            incidentId: '2',
            status: 'Queue',
          },
          {
            mitreTacticId: null,
            occuredTime: false,
            keywords: '',
            warroom: false,
            assignedToName: 'Ekasha Admin (Administrator)',
            mitreTechniqueId: null,
            incidentType: 'Undefined',
            isEscalate: 'true',
            SLA: '2025-01-02T16:00:34.641Z',
            mitreSubTechnique: null,
            source: 'Ekasha',
            mitreTechnique: null,
            createdOn: '2025-01-02T15:00:34.592444+05:30',
            slaStatus: '',
            ownerName: 'Umesh Karkar',
            aggCount: 1,
            dataClassification: 'Confidential',
            typeDetails: null,
            details: 'Common Indicators of Compromise (IOCs)',
            mitreTactic: null,
            lastUpdatedTime: '2025-01-02T10:28:34.592Z',
            lastOccuredTime: '2025-01-02T10:28:33.050Z',
            incidentName: 'Common Indicators of Compromise (IOCs) ID 1',
            ownerToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            assignedToToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            severity: 'Low',
            occurredAt: '2025-01-02T10:28:33.050Z',
            occurred: '2025-01-02T15:58:33.050+05:30',
            reminder: null,
            riskWeightage: 0,
            impact: null,
            dataType: 'Health Information',
            threatInformation: {},
            check: true,
            userName: 'Umesh Karkar',
            userToken: 'a2b79f959-fd0f-4287-ad47-cc6e72ec5bdc',
            lastSeen: null,
            alertCount: 1,
            createdBy: 'Umesh Karkar',
            isEdit: true,
            customerID: 'Customer_1',
            cyberKillChainStage: 'Delivery',
            mitreSubTechniqueId: null,
            incidentId: '1',
            status: 'Queue',
          },
        ],
        totalPages: 0,
        page: 0,
        totalCount: 2,
        message: 'successfully',
        currentPage: 0,
      },
    },
    GetDetailViewResponse: {
      status: true,
      data: {
        incidentId: '1',
        incidentName: 'Test Incident',
        details: 'Test Details',
        status: 'Queue',
        severity: 'High',
        assignedToName: 'Umesh Karkar (Administrator)',
        createdOn: '2024-03-20T10:00:00Z',
        SLA: '2024-03-21T10:00:00Z',
        alertCount: 1,
        riskWeightage: 0,
        typeDetails: {
          sourceAddress: '192.168.1.1',
        },
        threatInformation: {
          threatName: 'Threat',
        },
        escalateHistory: [{ user: 'Umesh Karkar (Administrator)', time: '2025-01-21T11:46:17.108Z' }],
      },
    },
    GetUpdateIncidentTitleResonse: {
      status: false,
      data: null,
    },
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
          name: 'Hiral Posiya (Tier 1)',
          value: 'e747vgj4f',
        },
      ],
    },
    GetIncidentScoreResponse: {
      status: true,
      data: [
        {
          riskweightage: 25,
          weightageSeverity: 'Medium',
        },
        {
          chart: [
            {
              value: 0,
              key: 'User',
            },
            {
              value: 0,
              key: 'Alert Criticality',
            },
            {
              value: 5,
              key: 'Asset',
            },
            {
              value: 0,
              key: 'Vulnerability',
            },
            {
              value: 20,
              key: 'Lookup',
            },
          ],
        },
        {
          weightagePreview: {
            Lookup: {
              Lookup: [
                {
                  destinationAddress: {
                    abuse: {
                      score: '100',
                    },
                    otx: {
                      score: '100',
                    },
                    score: '20',
                  },
                },
              ],
              score: '20',
            },
            'Asset Criticality': {
              score: '5',
            },
          },
        },
      ],
    },
  },
  inOverview: {
    DeleteTypeDetailsResponse: {
      status: false,
      data: null,
    },
    BasicDetailsResponse: {
      status: false,
      data: null,
    },
    GetRawLogResponse: {
      status: false,
      data: null,
    },
    GetSingleRawLogResponse: {
      status: false,
      data: null,
    },
    GetAllRawLogByIdResponse: {
      status: false,
      data: null,
    },
    RawLogResponse: {
      status: false,
      data: null,
    },
    TypeDetailsResponse: {
      status: false,
      data: null,
    },
    ChangeAssigneeResponse: {
      status: false,
      data: null,
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
          regex: '',
        },
        {
          regex: '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$',
          size: 20,
          validationType: 'Long',
          name: 'Source Port',
          value: 'sourcePort',
          fieldType: 'long',
        },
        {
          regex: '^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1]?[1-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$',
          size: 0,
          validationType: 'IP',
          name: 'Source Address',
          value: 'sourceAddress',
          fieldType: 'IP',
        },
      ],
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  OverviewEkasha, { ...props, IncidentId: 1 }, initialState, {
    ...contextValue,
    customerID: 'Customer_1',
    tableView: false,
    setTableView: jest.fn(),
  },
);

describe('OverviewEkasha Container - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.inOverview = {};
    initial.Incident = {};
    initial.Panel = {};
    setPermissions(handlePermission('NA', 'incidents', 'overview'));
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Incident_Overview_No_Permission_NoData');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('OverviewEkasha Container - Reducer Response Handle', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.inOverview.BasicDetailsResponse.status = true;
    initial.inOverview.RawLogResponse.status = true;
    initial.inOverview.ChangeAssigneeResponse.status = true;
    initial.Incident.GetOwnerResponse.status = false;
    initial.Incident.GetDetailViewResponse.status = false;
    initial.inOverview.DeleteTypeDetailsResponse.status = true;
    initial.inOverview.GetSingleRawLogResponse = {
      status: true,
      data: {},
    };
    initial.Panel.FatchFieldsDetailsResponse.status = false;
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Incident_Overview_Wrapper');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('OverviewEkasha Container - Read Only Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetIncidentScoreResponse.status = false;
    setPermissions(handlePermission('RO', 'incidents', 'overview'));
    setUp(actionProps, initial);
  });

  it('Should show Read Only permission message', () => {
    const EditIncidentDataIcon = getById('Incident_Overview_IncidentData_Edit_Icon');
    fireEvent.click(EditIncidentDataIcon);

    const editBasicDetailsIcon = getById('Incident_Overview_Details_Edit_Icon');
    fireEvent.click(editBasicDetailsIcon);

    const EscalateButton = getById('Incident_Overview_Details_Escalate_Button');
    fireEvent.click(EscalateButton);

    const AlertPlusIcon = getById('Incident_Overview_Alert_Plus_Icon');
    fireEvent.click(AlertPlusIcon);
  });
});

describe('OverviewEkasha Container - Status Closed Incident', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetDetailViewResponse.data.status = 'Closed';
    initial.Incident.GetDetailViewResponse.data.incidentCloseData = [
      {
        closedBy: 'Ekasha Admin',
        reason: 'Maintenance',
        rootCause: 'Employee error',
        comment: 'sdg',
        closedTime: '2025-01-27T05:40:11.341Z',
      },
    ];
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    setUp(actionProps, initial);
  });

  it('Should Status Closed Incident', async () => {
    const EditIncidentDataIcon = getById('Incident_Overview_IncidentData_Edit_Icon');
    fireEvent.click(EditIncidentDataIcon);

    const EscalateButton = getById('Incident_Overview_Details_Escalate_Button');
    fireEvent.click(EscalateButton);

    const StatusInfoIcon = getById('Incident_Overview_Details_Status_Info_Icon');
    fireEvent.click(StatusInfoIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const closeButton = getById('ekasha_model_close_Status_Closed_Incident_Modal');
    fireEvent.click(closeButton);

    const AlertPlusIcon = getById('Incident_Overview_Alert_Plus_Icon');
    fireEvent.click(AlertPlusIcon);

    const RiskWeightageInfoIcon = getById('Incident_Overview_Details_RiskWeightage_Info_Icon');
    fireEvent.click(RiskWeightageInfoIcon);
  });

  it('Should Status Reopen Incident', async () => {
    const EditBasicDetailsIcon = getById('Incident_Overview_Details_Edit_Icon');
    fireEvent.click(EditBasicDetailsIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    selectOption('Incident_Overview_Details_Status_Select', 'Reopen', 1);
  });
});

describe('OverviewEkasha Container - With IncidentData', () => {
  let originalExecCommand;
  beforeEach(() => {
    originalExecCommand = document.execCommand;
    // Mock the execCommand function
    document.execCommand = jest.fn();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });

  afterEach(() => {
    // Restore the original execCommand function
    document.execCommand = originalExecCommand;
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('Should render overview wrapper', () => {
    const overviewWrapper = getById('Incident_Overview_Wrapper');
    expect(overviewWrapper).toBeInTheDocument();
  });

  it('Should handle edit incident data', async () => {
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const CopyIcon = getById('Incident_Overview_IncidentData_Attribute_Link_Copy_Icon_192\\.168\\.1\\.1');
    fireEvent.click(CopyIcon);

    const AttributLinkClick = getById('Incident_Overview_IncidentData_Attribute_Link_192\\.168\\.1\\.1');
    fireEvent.click(AttributLinkClick);

    const editIcon = getById('Incident_Overview_IncidentData_Edit_Icon');
    fireEvent.click(editIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const ErrorIncidentDataIcon = getById('Incident_Overview_IncidentData_Error_Icon');
    expect(ErrorIncidentDataIcon).toBeInTheDocument();
    fireEvent.click(ErrorIncidentDataIcon);

    const editIcon2 = getById('Incident_Overview_IncidentData_Edit_Icon');
    fireEvent.click(editIcon2);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const plusIcon = getById('Incident_Overview_IncidentData_Plus_Icon');
    fireEvent.click(plusIcon);

    selectOption('Incident_Overview_IncidentData_Fields_Select', 'Custom Field');
    selectOption('Incident_Overview_IncidentData_Fields_Select', 'Custom2');

    const inputField = getById('Incident_Overview_IncidentData_SubTypes_Input_1');
    fireEvent.change(inputField, { target: { value: '' } });

    const SuccessIncidentDataButton = getById('Incident_Overview_IncidentData_Success_Icon');
    fireEvent.click(SuccessIncidentDataButton);

    const inputField2 = getById('Incident_Overview_IncidentData_SubTypes_Input_2');
    fireEvent.change(inputField2, { target: { value: '' } });
    fireEvent.change(inputField, { target: { value: 'ABCD' } });
    fireEvent.click(SuccessIncidentDataButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const FieldAddModalYesButton = screen.getByText('Yes');
    fireEvent.click(FieldAddModalYesButton);

    const FieldAddModalNoButton = screen.getByText('No');
    fireEvent.click(FieldAddModalNoButton);
  });

  it('Should handle edit incident data with Remove Field', async () => {
    const editIcon = getById('Incident_Overview_IncidentData_Edit_Icon');
    fireEvent.click(editIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const RemoveIncidentDataField2 = getById('Incident_Overview_IncidentData_SubTypes_Remove_Icon_0');
    fireEvent.click(RemoveIncidentDataField2);

    const FieldRemoveModalYesButton2 = screen.getByText('Yes');
    fireEvent.click(FieldRemoveModalYesButton2);

    const SuccessIncidentDataButton = getById('Incident_Overview_IncidentData_Success_Icon');
    fireEvent.click(SuccessIncidentDataButton);

    const editIcon2 = getById('Incident_Overview_IncidentData_Edit_Icon');
    fireEvent.click(editIcon2);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const plusIcon = getById('Incident_Overview_IncidentData_Plus_Icon');
    fireEvent.click(plusIcon);

    selectOption('Incident_Overview_IncidentData_Fields_Select', 'Custom Field');

    const RemoveIncidentDataField = getById('Incident_Overview_IncidentData_SubTypes_Remove_Icon_1');
    fireEvent.click(RemoveIncidentDataField);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const FieldRemoveModalYesButton = screen.getByText('Yes');
    fireEvent.click(FieldRemoveModalYesButton);

    const FieldRemoveModalNoButton = screen.getByText('No');
    fireEvent.click(FieldRemoveModalNoButton);
  });

  it('Should Alert Preview Button Click', async () => {
    const AlertPreviewIcon = getById('Incident_Overview_Alert_Preview_Icon');
    fireEvent.click(AlertPreviewIcon);
  });
});

describe('OverviewEkasha Container - Basic Details Editing', () => {
  let originalExecCommand;
  beforeEach(() => {
    originalExecCommand = document.execCommand;
    // Mock the execCommand function
    document.execCommand = jest.fn();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.inOverview.TypeDetailsResponse.status = true;
    setUp(actionProps, initial);
  });

  afterEach(() => {
    // Restore the original execCommand function
    document.execCommand = originalExecCommand;
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle incident Details Section', async () => {
    const RiskWeightageCopyIcon = getById('Incident_Overview_Details_RiskWeightage_Copy_Icon');
    fireEvent.click(RiskWeightageCopyIcon);

    const StatusCopyIcon = getById('Incident_Overview_Details_Status_Copy_Icon');
    fireEvent.click(StatusCopyIcon);

    const SeverityCopyIcon = getById('Incident_Overview_Details_Severity_Copy_Icon');
    fireEvent.click(SeverityCopyIcon);

    const editIcon = getById('Incident_Overview_Details_Edit_Icon');
    fireEvent.click(editIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    selectOption('Incident_Overview_Details_Type_Select', 'Malware');
    selectOption('Incident_Overview_Details_CyberKillChainStage_Select', 'Exploitation');
    selectOption('Incident_Overview_Details_Severity_Select', 'Critical');
    selectOption('Incident_Overview_Details_Owner_Select', 'Abhi Ghumaliya (Administrator)');
    selectOption('Incident_Overview_Details_Status_Select', 'Response');
    selectOption('Incident_Overview_Details_AssignedTo_Select', 'Ekasha Admin (Administrator)');
    selectOption('Incident_Overview_Details_DataType_Select', 'Personal Information (Employee Data)');
    selectOption('Incident_Overview_Details_Impact_Select', 'Operational');
    selectOption('Incident_Overview_Details_DataClassification_Select', 'Secret');
    selectOption('Incident_Overview_Details_CIA_Triad_Impact_Select', 'Integrity');

    const threatNameInput = getById('Incident_Overview_Details_ThreatName_Input');
    fireEvent.change(threatNameInput, { target: { value: 'T12' } });

    const threatTypeInput = getById('Incident_Overview_Details_ThreatType_Input');
    fireEvent.change(threatTypeInput, { target: { value: 'T123' } });

    const threatDescriptionInput = getById('Incident_Overview_Details_ThreatDescription_Input');
    fireEvent.change(threatDescriptionInput, { target: { value: 'T1234' } });

    selectOption('Incident_Overview_Details_AttackMechanism_Select', 'Information');

    selectOption('Incident_Overview_Details_AttackAgent_Select', 'Outsider');

    const mitreTacticInput = getById('Incident_Overview_Details_MITRE_Tactic_Input');
    fireEvent.change(mitreTacticInput, { target: { value: 'Mabc' } });

    const mitreTacticIdInput = getById('Incident_Overview_Details_MITRE_Tactic_ID_Input');
    fireEvent.change(mitreTacticIdInput, { target: { value: 'Mabcid' } });

    const techniqueInput = getById('Incident_Overview_Details_MITRE_Technique_Input');
    fireEvent.change(techniqueInput, { target: { value: 'T1234' } });

    // Test MITRE Technique ID input
    const techniqueIdInput = getById('Incident_Overview_Details_MITRE_Technique_ID_Input');
    fireEvent.change(techniqueIdInput, { target: { value: 'ID1234' } });

    // Test MITRE Sub Technique input
    const subTechniqueInput = getById('Incident_Overview_Details_MITRE_Sub_Technique_Input');
    fireEvent.change(subTechniqueInput, { target: { value: 'Sub.001' } });

    const subTechniqueIdInput = getById('Incident_Overview_Details_MITRE_Sub_Technique_ID_Input');
    fireEvent.change(subTechniqueIdInput, { target: { value: 'Sub id 001' } });
  });

  it('should handle incident Details Assigned To Select', async () => {
    const editIcon = getById('Incident_Overview_Details_Edit_Icon');
    fireEvent.click(editIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const ErrorIncidentDetailsIcon = getById('Incident_Overview_Details_Error_Icon');
    fireEvent.click(ErrorIncidentDetailsIcon);

    const editIcon2 = getById('Incident_Overview_Details_Edit_Icon');
    fireEvent.click(editIcon2);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    selectOption('Incident_Overview_Details_AssignedTo_Select', 'Ekasha Admin (Administrator)');

    const SuccessIncidentDetailsIcon = getById('Incident_Overview_Details_Success_Icon');
    fireEvent.click(SuccessIncidentDetailsIcon);
  });

  it('should handle incident Details Escalate Handler', async () => {
    const EscalateHandlerIcon = getById('Incident_Overview_Details_Escalate_Button');
    fireEvent.click(EscalateHandlerIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    selectOption('Incident_Overview_Details_Escalate_Select', 'Hiral Posiya (Tier 1)');

    const EscalateHandlerModalYesButton = getById('Incident_Overview_Details_Escalate_OK_Button');
    fireEvent.click(EscalateHandlerModalYesButton);

    fireEvent.mouseDown(document.body);
  });
});

describe('Incident Status Closed Select', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetDetailViewResponse.data.status = 'Response';
    setUp(actionProps, initial);
  });
  it('should handle incident Status Closed Select', async () => {
    const editIcon = getById('Incident_Overview_Details_Edit_Icon');
    fireEvent.click(editIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    selectOption('Incident_Overview_Details_Status_Select', 'Close');
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const closeButton = getById('ekasha_model_close_Status_Closed_Incident_Modal');
    fireEvent.click(closeButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    selectOption('Incident_Overview_Details_Status_Select', 'Close');
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const saveButton = getById('Close_Incident_Submit');
    fireEvent.click(saveButton);

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

    const SuccessIncidentDetailsIcon = getById('Incident_Overview_Details_Success_Icon');
    fireEvent.click(SuccessIncidentDetailsIcon);
  });
});

describe('OverviewEkasha Container - Alerts Editing', () => {
  let originalExecCommand;
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    originalExecCommand = document.execCommand;
    // Mock the execCommand function
    document.execCommand = jest.fn();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    initial.inOverview.GetRawLogResponse = {
      message: 'Raw data.',
      status: true,
      data: [
        {
          alertName: 'Common Indicators of Compromise (IOCs)',
          createdDate: '2025-01-27T05:39:56.533Z',
          id: '6O9bp5QBjlhgyUxux0hT',
        },
        {
          alertName: 'Incident 1',
          createdDate: '2025-01-28T05:39:56.533Z',
          id: 'di96sJQBjlhgyUxuhu',
        },
      ],
    };
    initial.inOverview.GetAllRawLogByIdResponse = {
      message: 'Raw data.',
      status: true,
      data: [
        {
          logType: 'json',
          createdDate: '2025-01-27T10:43:17.459Z',
          alertName: 'Common Indicators of Compromise (IOCs)',
          customerID: 'Ekasha',
          rawLog: '[{"abc":"123"}]',
          id: '6O9bp5QBjlhgyUxux0hT',
          incidentId: '2',
        },
        {
          logType: 'text',
          createdDate: '2025-01-29T05:13:27.475Z',
          alertName: 'Incident 1',
          customerID: 'Ekasha',
          rawLog: 'sdgsdgsg',
          id: 'di96sJQBjlhgyUxuhu',
          incidentId: '2',
        },
      ],
    };
    setUp(actionProps, initial);
  });

  afterEach(() => {
    // Restore the original execCommand function
    document.execCommand = originalExecCommand;
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should open alert modal and submit', async () => {
    const AlertPlusIcon = getById('Incident_Overview_Alert_Plus_Icon');
    fireEvent.click(AlertPlusIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const SubmitButton = getById('Incident_Overview_Alert_Submit_Button');

    const logTypeRadioText = getById('Radio_Name_Incident_Overview_Alert_Create_LogType_Radio_Text');
    fireEvent.click(logTypeRadioText);
    fireEvent.click(SubmitButton);

    const alertDataInput0 = getById('Incident_Overview_Alert_Create_AlertData_TextArea');
    fireEvent.change(alertDataInput0, { target: { value: 'Test Alert Data' } });

    const logTypeRadioJSON = getById('Radio_Name_Incident_Overview_Alert_Create_LogType_Radio_JSON');
    fireEvent.click(logTypeRadioJSON);
    fireEvent.click(SubmitButton);

    const alertDataInput = getById('Incident_Overview_Alert_Create_AlertData_TextArea');
    fireEvent.change(alertDataInput, { target: { value: 'abc' } });
    fireEvent.click(SubmitButton);
    fireEvent.change(alertDataInput, { target: { value: '[{"abc":"123"}]' } });
    fireEvent.click(SubmitButton);
    fireEvent.change(alertDataInput, { target: { value: '{"abc":"123"}' } });
    fireEvent.click(SubmitButton);

    const ConfirmYesButton = screen.getByText('Yes');
    fireEvent.click(ConfirmYesButton);

    const ConfirmNoButton = screen.getByText('No');
    fireEvent.click(ConfirmNoButton);

    const AlertModalCloseButton = getById('ekasha_model_close_Incident_Overview_Alert_Create_Modal');
    fireEvent.click(AlertModalCloseButton);
  });

  it('should alert Preview Model Open', async () => {
    const ItemClick = getById('wrapper_labelsIcircle0');
    fireEvent.click(ItemClick);

    const AlertPreviewIcon = getById('Incident_Overview_Alert_Preview_Icon');
    fireEvent.click(AlertPreviewIcon);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    setUp(actionProps, initial);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const expandIcon = getById('Incident_Overview_Alert_Timeline_Expand_Dot_6O9bp5QBjlhgyUxux0hT');
    fireEvent.click(expandIcon);

    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    fireEvent.click(expandIcon);

    const searchInput = getById('Incident_Overview_Alert_Preview_SearchBox');
    fireEvent.change(searchInput, { target: { value: 'Common Indicators of Compromise (IOCs)' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const clearSearchIcon = getById('ekasha_searchInput_clearSearch_Incident_Overview_Alert_Preview_SearchBox');
    fireEvent.click(clearSearchIcon);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const expandIcon2 = getById('Incident_Overview_Alert_Timeline_Expand_Dot_di96sJQBjlhgyUxuhu');
    fireEvent.click(expandIcon2);

    fireEvent.change(searchInput, { target: { value: 'sdgs' } });

    const AlertModalCloseButton = getById('ekasha_model_close_Incident_Overview_Alert_Preview_Modal');
    fireEvent.click(AlertModalCloseButton);
  });
});

describe('Incident Overview Details Scroll', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Incident.GetDetailViewResponse.data.riskWeightage = '10';
    setUp(actionProps, initial);
  });
  it('should handle incident Overview Details Scroll', async () => {
    const leftData = getById('Incident_Overview_Details_Left_Data');
    fireEvent.scroll(leftData);
  });
});

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    localStorage.setItem('U_PROFILE', JSON.stringify({
      role: 'pl67e394bc',
    }));
    localStorage.setItem('U_TOKENS', JSON.stringify({
      userToken: 'm33b2e747',
    }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents'));
    wrapper = setUp(actionProps, initial, { customerID: 'Customer_1' });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    wrapper = setUp(actionProps, initialData, { customerID: 'Customer_1' });
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle all socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    socketData.forEach((element) => {
      act(() => {
        subscribeCallback(element);
      });
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
