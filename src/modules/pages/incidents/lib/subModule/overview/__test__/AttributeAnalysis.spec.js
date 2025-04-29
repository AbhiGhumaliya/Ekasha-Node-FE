import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import AttributeAnalysis from '../lib/AttributeAnalysis';
import {
  changeAttributeAnalysisAction, fakeAttributeAnalysisAction, changeFieldAttributeAnalysisAction,
} from '../../../../../../../apis/incidents/subModule/AttributeAnalysis/AttributeAnalysis.action';
import { fakeActionDashboard } from '../../../../../../../apis/dashboard/dashboard.actions';
import { fakeActionPanel, fetchFieldsForDetails } from '../../../../../../../apis/panel/panel.action';

jest.useFakeTimers();

const actionProps = {
  match: {
    params: {
      fieldType: 'sourceAddress.keyword',
    },
  },
  changeAttributeAnalysisAction,
  fakeAttributeAnalysisAction,
  fakeActionDashboard,
  fetchFieldsForDetails,
  fakeActionPanel,
  changeFieldAttributeAnalysisAction,
};

const initialData = {
  AttributeAnalysis: {
    ChangeAttributeAnalysisResponse: {
      status: true,
      data: [
        { closeIncidentData: 5 },
        { openIncidentData: 10 },
        { totalIncidentData: 15 },
        {
          incidentListData: [
            {
              incidentId: '1',
              incidentName: 'Test_Incident',
              incidentStatus: 'Open',
              incidentCreatedTime: '2024-03-20T10:00:00Z',
            },
          ],
        },
        {
          analysisData: [
            {
              name: 'Analyst 1',
              value: 10,
            },
          ],
        },
        {
          closeIncidentListData: [
            {
              incidentId: '2',
              incidentName: 'Closed Incident',
              reason: 'Test Reason',
              rootCause: 'Test Cause',
              closedTime: '2024-03-21T10:00:00Z',
              comment: 'Test Comment',
            },
            {
              incidentId: '3',
              incidentName: 'Closed Incident 123',
              reason: 'Test Reason',
              rootCause: 'Test Cause',
              closedTime: '2024-03-21T10:00:00Z',
              comment: 'Test Comment',
            },
          ],
        },
        {
          processFieldsData: [
            {
              sourceAddress: '10.9.9.9',
              name: '10.9.9.9',
              value: 4,
            },
          ],
        },
      ],
    },
    ChangeFieldAttributeAnalysisResponse: {
      status: true,
      data: {},
    },
  },
  Panel: {
    FatchFieldsDetailsResponse: {
      status: true,
      data: [
        {
          name: 'Source Address',
          value: 'sourceAddress.keyword',
          fieldType: 'IP',
          regex: '^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1]?[1-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$',
          size: 0,
          validationType: 'IP',
        },
      ],
    },
  },
  Dashboard: {
    TimeFilterUpdate: '',
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  AttributeAnalysis, { ...props, IncidentId: 1 }, initialState, {
    ...contextValue,
    customerID: 'Customer_1',
    tableView: false,
    timeFilData: [{
      activeTypeFrom: 'absolute',
      activeTypeTo: 'absolute',
      fromTo: 'quick',
      quickString: 'Last 1 years',
      commonString: null,
      timeFilter: '{"from":"2024-02-03T16:25:44+05:30","to":"2025-02-03T16:25:44+05:30"}',
    }],
    setTableView: jest.fn(),
  },
);

describe('AttributeAnalysis False Reducer Response', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Test User',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.AttributeAnalysis.ChangeAttributeAnalysisResponse.status = false;
    initial.AttributeAnalysis.ChangeFieldAttributeAnalysisResponse.status = false;
    initial.Panel.FatchFieldsDetailsResponse.status = false;
    setUp(actionProps, initial);
  });
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  it('should handle false reducer', async () => {
    const AttributeAnalysisWrapper = getById('Incident_Overview_Attribute_Analysis_Wrapper');
    expect(AttributeAnalysisWrapper).toBeInTheDocument();
  });
});

describe('AttributeAnalysis Component', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Test User',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render component and handle initial data load', async () => {
    const wrapper = getById('Incident_Overview_Attribute_Analysis_Wrapper');
    expect(wrapper).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Verify counts are displayed
    expect(screen.getByText('15')).toBeInTheDocument(); // Total incidents
    expect(screen.getByText('10')).toBeInTheDocument(); // Open incidents
    expect(screen.getByText('5')).toBeInTheDocument(); // Closed incidents
  });

  it('should handle refresh action', async () => {
    const refreshButton = getById('Incident_Overview_Attribute_Analysis_Refresh_Button');
    fireEvent.click(refreshButton);
  });

  it('should handle time filter updates', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    const updatedData = {
      ...initial,
      Dashboard: {
        TimeFilterUpdate: 'TIMEFILTER_UPDATED_TIME',
      },
    };

    setUp(actionProps, updatedData);
  });

  it('should handle analysis data changes', async () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    const updatedData = {
      ...initial,
      AttributeAnalysis: {
        ...initialData.AttributeAnalysis,
        ChangeFieldAttributeAnalysisResponse: {
          status: true,
          data: {
            newField: 'newValue',
          },
        },
      },
    };

    setUp(actionProps, updatedData);
  });
});

describe('AttributeAnalysis Filter Operations', () => {
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Test User',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'overview'));
    setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle Close Status Data', async () => {
    setUp(actionProps, initial);
    const viewMoreButton = getById('viewWrap_0');
    fireEvent.click(viewMoreButton);
    const viewMoreButton2 = getById('viewWrap_1');
    fireEvent.click(viewMoreButton2);
    fireEvent.click(viewMoreButton2);
  });

  it('should handle full screen Button', async () => {
    const fullScreenButton = getById('Incident_Overview_Process_Relation_FullScreen_Button');
    fireEvent.click(fullScreenButton);
    fireEvent.click(fullScreenButton);
  });

  it('should handle Incident Id Plus Filter Operations', async () => {
    const dropdownTrigger = getById('Incident_Attribute_incidentId_1');
    expect(dropdownTrigger).toBeInTheDocument();

    // Trigger hover event
    fireEvent.mouseEnter(dropdownTrigger);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Click plus filter icon
    const plusFilterIcon = getById('Incident_Overview_Attribute_Analysis_incidentId_Dropdown_Plus_Filter');
    fireEvent.click(plusFilterIcon);
  });

  it('should handle Incident Id Minus Filter Operations', async () => {
    const dropdownTrigger = getById('Incident_Attribute_incidentId_1');
    expect(dropdownTrigger).toBeInTheDocument();

    // Trigger hover event
    fireEvent.mouseEnter(dropdownTrigger);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Click plus filter icon
    const minusFilterIcon = getById('Incident_Overview_Attribute_Analysis_incidentId_Dropdown_Minus_Filter');
    fireEvent.click(minusFilterIcon);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    const RemoveFilterButton = getById('Incident_Overview_Attribute_Analysis_Remove_Filter_1');
    fireEvent.click(RemoveFilterButton);
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
