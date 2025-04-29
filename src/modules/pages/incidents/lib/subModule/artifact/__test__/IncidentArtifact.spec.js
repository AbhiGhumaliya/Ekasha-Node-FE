import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import ArtifactEkasha from '../../../../../../containers/incidents/subModule/artifactEkasha';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../../../../helpers/lib/scrollTest';
import {
  addArtefactToIOCAction, fakeArtifactAction, getArtifactAction,
} from '../../../../../../../apis/incidents/subModule/Artifact/Artifact.action';

jest.useFakeTimers();

const actionProps = {
  getArtifactAction,
  fakeArtifactAction,
  addArtefactToIOCAction,
  IncidentId: 1,
  selectIncident: { status: 'Open' },
};

const socketData = [{
  body: JSON.stringify({
    module: 'artifact',
    operation: 'add',
    status: true,
    data: {
      incidentId: '1',
      customerID: 'Customer_1',
      artifact: 'test.com',
      artifactType: 'URL',
      token: 'abc123',
      isAddToIoc: true,
      createdTime: '2024-03-20T11:00:00Z',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'artifact',
    operation: 'add',
    status: true,
    data: {
      incidentId: '1',
      customerID: 'Customer_123',
      artifact: 'test.com',
      artifactType: 'URL',
      token: 'abc123',
      isAddToIoc: true,
      createdTime: '2024-03-20T11:00:00Z',
    },
  }),
}];

const initialData = {
  Artifact: {
    GetArtifactResponse: {
      status: true,
      data: {
        artifactData: [
          {
            artifact: 'malware.com',
            artifactType: 'URL',
            token: 'BBH5NYMi',
            isAddToIoc: true,
            createdTime: '2024-03-20T10:00:00Z',
            customerID: 'Customer_1',
          },
          {
            artifact: '10.2.2.2',
            artifactType: 'IP',
            token: 'BBH5',
            isAddToIoc: false,
            createdTime: '2024-03-20T05:00:00Z',
            customerID: 'Customer_1',
          },
          {},
        ],
        currentPage: 1,
        TotalCount: 3,
        totalPages: 1,
      },
    },
    AddArtifactToIOCResponse: {
      status: false,
      data: null,
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  ArtifactEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  {
    ...contextValue, customerID: 'Customer_1', tableView: false, setTableView: jest.fn(),
  },
);

describe('ArtifactEkasha Container - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Artifact = {};
    setPermissions(handlePermission('NA', 'incidents', 'artifact'));
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Incident_Artifact_No_PermissionRO');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('Component Render with No Data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Artifact.GetArtifactResponse.status = false;
    setPermissions(handlePermission('RW', 'incidents', 'artifact'));
    setUp(actionProps, initial);
  });

  it('Should show no data message', () => {
    const noDataMessage = getById('Incident_Artifact_No_Data');
    expect(noDataMessage).toBeInTheDocument();
  });
});

describe('Component Render with Status True without Data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Artifact.GetArtifactResponse.data = {};
    setPermissions(handlePermission('RW', 'incidents', 'artifact'));
    setUp(actionProps, initial);
  });

  it('Should show no data message', () => {
    const noDataMessage = getById('Incident_Artifact_No_Data');
    expect(noDataMessage).toBeInTheDocument();
  });
});

describe('Component Render Status Closed', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'incidents', 'artifact'));
    setUp({ ...actionProps, selectIncident: { status: 'Closed' } }, initial);
  });

  it('Should Open Add to IOC Button Click with Status Closed', async () => {
    const addToIocIcon = getById('Incident_Artifact_Add_To_Ioc_Icon_BBH5NYMi');
    fireEvent.click(addToIocIcon);
  });
});

describe('ArtifactEkasha Container - With Data', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Artifact.AddArtifactToIOCResponse = {
      status: true,
      data: {
        token: 'jd4e4cf7f-5ac0-4c75-bc31-f3fbeaa4c3bd',
        type: 'IP',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        ioc: '10.1.1.91',
        customerID: 'a',
        createdTime: '2025-01-22T12:42:26Z',
      },
    };
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'artifact'));
    setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('Should render artifact table with data', () => {
    const artifactTable = getById('Incident_Artifact_Table');
    expect(artifactTable).toBeInTheDocument();
  });

  it('Should handle search functionality', async () => {
    const searchInput = getById('Incident_Artifect_SearchBox');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const clearSearch = getById('ekasha_searchInput_clearSearch_Incident_Artifect_SearchBox');
    fireEvent.click(clearSearch);
  });

  it('Should handle refresh button click', () => {
    const refreshButton = getById('Incident_Artifact_Refresh_Icon');
    fireEvent.click(refreshButton);
  });

  it('Should Open Artifact Preview Modal', async () => {
    const previewButton = getById('Incident_Artifact_Preview_Icon_BBH5NYMi');
    fireEvent.click(previewButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const closeButton = getById('ekasha_model_close_Incident_Artifact_Preview_Modal');
    fireEvent.click(closeButton);
  });

  it('Should Open Add to IOC Confirm Modal', async () => {
    const addToIocIcon = getById('Incident_Artifact_Add_To_Ioc_Icon_BBH5NYMi');
    fireEvent.click(addToIocIcon);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const modelYesButton = screen.getByText('Yes');
    fireEvent.click(modelYesButton);

    const modelNoButton = screen.getByText('No');
    fireEvent.click(modelNoButton);
  });
});

describe('Artifact Table Search with Only Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'incidents', 'artifact'));
    setUp(actionProps, initial);
  });

  it('Should Add to IOC Button with Read Only Permission', async () => {
    const addToIocIcon = getById('Incident_Artifact_Add_To_Ioc_Icon_BBH5NYMi');
    fireEvent.click(addToIocIcon);
  });

  it('Should copy message in preview modal', async () => {
    const mockCopyToClipboard = jest.fn();
    document.execCommand = mockCopyToClipboard;

    const previewButton = getById('Incident_Artifact_Preview_Icon_BBH5NYMi');
    fireEvent.click(previewButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const copyIcon = getById('Incident_Artifact_Copy_Icon');
    fireEvent.click(copyIcon);
  });
});

describe('Modal Operations', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'artifact'));
    setUp(actionProps, initial);
  });

  it('Should handle add to IOC confirmation modal', async () => {
    const addToIocIcon = getById('Incident_Artifact_Add_To_Ioc_Icon_BBH5NYMi');
    fireEvent.click(addToIocIcon);
  });

  it('Should handle artifact preview modal', () => {
    const previewButton = getById('Incident_Artifact_Preview_Icon_BBH5NYMi');
    fireEvent.click(previewButton);
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'Incident_Artifact_TableTbody',
  mockActionName: 'getArtifactAction',
  mockResulteData: initialData.Artifact.GetArtifactResponse.data.artifactData,
  responseKey: 'Artifact.GetArtifactResponse',
  dataFormat: 'artifactData',
});

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    setPermissions(handlePermission('RW', 'incidents', 'artifact'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
  });

  it('should handle artifact socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
      });
    });

    const artifactTable = getById('Incident_Artifact_Table');
    expect(artifactTable).toBeInTheDocument();
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
