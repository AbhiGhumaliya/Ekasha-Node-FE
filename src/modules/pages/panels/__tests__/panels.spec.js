import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../helpers/lib/RTL';
import PanelsEkasha from '../../../containers/panel';
import {
  panelDrawerOpen, panelDrawerClose, panelGetAction, fakeActionPanel,
  panelDelete, panelPreview,
  panelCreate, panelFindByToken, panelUpdate, getIndexFields,
  fetchFields, fetchAggregationFields,
} from '../../../../apis/panel/panel.action';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const panelProps = {
  panelDelete,
  panelPreview,
  panelCreate,
  panelFindByToken,
  panelUpdate,
  getIndexFields,
  fetchFields,
  fetchAggregationFields,
  panelGetAction,
  panelDrawerOpen,
  fakeActionPanel,
  panelDrawerClose,
  setNewPanelModal: jest.fn(),
  newPanelModal: false,
  setNewPanelPreviewModal: jest.fn(),
  newPanelPreviewModal: false,
  quickPanelStatus: true,
  dashTabPanels: [
    {
      token: 'dash1',
      name: 'Dashboard 1',
    },
  ],
  parentDash: [{
    token: 'dash1',
    name: 'Dashboard 1',
    editStatus: false,
  }],
};

const mockPanelData = [
  {
    token: 'panel1',
    dashToken: 'dash1',
    panelToken: 'panel1',
    gToken: 'dash156565',
    ownerToken: 'testUserToken',
    x: 0,
    y: 0,
    w: 4,
    minW: 4,
    minH: 9,
    h: 9,
    i: 'panel1',
  },
  {
    token: 'panel2',
    dashToken: 'dash1',
    panelToken: 'panel2',
    gToken: 'dash156565',
    ownerToken: 'testUserToken',
    x: 4,
    y: 0,
    w: 4,
    minW: 4,
    minH: 9,
    h: 9,
    i: 'panel2',
  },
];

const initialData = {
  Panel: {
    OpenDrawerPanel: null,
    CloseDrawerPanel: null,
    GetAllPanelListResponse: [
      {
        status: true,
        data: mockPanelData,
      },
    ],
    PanelDeleteResponse: null,
    PanelPreviewResponse: null,
    PanelCreateResponse: null,
    PanelFindResponse: null,
    PanelUpdateResponse: null,
    GetIndexFieldsResponse: null,
    FatchQueryFieldsResponse: null,
    FatchQueryAggFieldsResponse: null,
    GetDeletePanelListResponse: null,
  },
  Dashboard: {
    GetDeletePanelListResponse: null,
  },
};

// Setup function
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  PanelsEkasha,
  { ...panelProps, ...props },
  initialState,
  {
    ...contextValue, dashIntervalStatus: true, customerID: 'test123',
  },
);

describe('Dashboard Component', () => {
  let wrapper;
  let mockSubscribe;

  // Part 1: Panel Operations
  describe('Dashboard Component - Panel Operations', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'home', 'panel'));
    });

    it('Should handle panel drawer open', () => {
      wrapper = setUp({ ...panelProps, CloseDrawer: 'PANEL_DRAWER_CLOSE' }, initialData);
      const panelCloseButton = getById('close_panel_drawer');
      fireEvent.click(panelCloseButton);
    });

    it('Should handle panel drawer panel_data_search', () => {
      wrapper = setUp(panelProps, initialData);
      const panelDataSearch = getById('panel_data_search');
      fireEvent.change(panelDataSearch, { target: { value: 'test' } });
      expect(panelDataSearch.value).toBe('test');
      jest.advanceTimersByTime(500);
      const clearButton = getById('ekasha_searchInput_clearSearch_panel_data_search');
      fireEvent.click(clearButton);
      expect(panelDataSearch.value).toBe('');
    });

    it('Should handle panel drawer PanelIcon_open', () => {
      wrapper = setUp({ ...panelProps, newPanelModal: true }, initialData);
      const panelIconOpen = getById('PanelIcon_open');
      fireEvent.click(panelIconOpen);
    });

    it('Should handle panel drawer panel preview modal', () => {
      const initial = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          PanelPreviewResponse: { status: true, data: [{ data: mockPanelData[0] }] },
        },
      };
      wrapper = setUp({ ...panelProps, newPanelPreviewModal: true }, initial);
    });
  });

  // Part 2: Panel Operations Read Only
  describe('Dashboard Component - Panel Operations Read Only', () => {
    beforeEach(() => {
      setPermissions(handlePermission('NA', 'home', 'panel'));
      wrapper = setUp(panelProps, initialData);
    });

    it('Should handle panel drawer PanelIcon_open', () => {
      const panelIconOpen = getById('PanelIcon_open');
      fireEvent.click(panelIconOpen);
    });
  });

  // Response Handling
  describe('Dashboard Component - Response Handling', () => {
    // Panel response handling tests
    it('Should handle successful panel list response', () => {
      const panelListSuccessState = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          GetAllPanelListResponse: {
            status: true,
            data: mockPanelData,
          },
        },
      };
      wrapper = setUp(panelProps, panelListSuccessState);
    });

    it('Should handle successful panel operations responses', () => {
      const panelOperationsSuccessState = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          PanelDeleteResponse: { status: true },
          PanelPreviewResponse: { status: true, data: [{ data: mockPanelData[0] }] },
          PanelCreateResponse: { status: true, data: { token: 'new-panel' } },
          PanelFindResponse: { status: true, data: mockPanelData[0] },
          PanelUpdateResponse: { status: true },
          GetIndexFieldsResponse: { status: true, data: [] },
          FatchQueryFieldsResponse: { status: true, data: [] },
          FatchQueryAggFieldsResponse: { status: true, data: [] },
          GetDeletePanelListResponse: { status: true, data: [] },
        },
      };
      wrapper = setUp(panelProps, panelOperationsSuccessState);
    });

    it('Should handle successful panel operations with blank data responses', () => {
      const panelOperationsSuccessState = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          PanelPreviewResponse: { status: true, data: [{ data: [] }] },
        },
      };
      wrapper = setUp(panelProps, panelOperationsSuccessState);
    });

    it('Should handle failed panel operations responses', () => {
      const panelOperationsFailedState = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          GetAllPanelListResponse: { status: false, error: 'Failed to fetch panel list' },
          PanelDeleteResponse: { status: false, error: 'Failed to delete panel' },
          PanelPreviewResponse: { status: false, error: 'Failed to preview panel' },
          PanelCreateResponse: { status: false, error: 'Failed to create panel' },
          PanelFindResponse: { status: false, error: 'Failed to find panel' },
          PanelUpdateResponse: { status: false, error: 'Failed to update panel' },
          GetIndexFieldsResponse: { status: false, error: 'Failed to get index fields' },
          FatchQueryFieldsResponse: { status: false, error: 'Failed to fetch query fields' },
          FatchQueryAggFieldsResponse: { status: false, error: 'Failed to fetch aggregation fields' },
          GetDeletePanelListResponse: { status: false, error: 'Failed to get delete panel list' },
        },
      };
      wrapper = setUp(panelProps, panelOperationsFailedState);
    });
  });

  // Add new test block for Socket Operations
  describe('Panel Component - Socket Operations', () => {
    beforeEach(async () => {
      setPermissions(handlePermission('RW', 'home', 'panel'));
      mockSubscribe = {
        unsubscribe: jest.fn(),
      };
      stompClient.connected = true;
      stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

      const successState = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          GetAllPanelListResponse: {
            status: true,
            data: mockPanelData,
          },
        },
      };
      wrapper = setUp(panelProps, successState);
    });

    it('Should subscribe to socket on mount', () => {
      expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    });

    it('Should handle panel update socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'update',
            status: true,
            data: {
              token: 'panel1',
              title: 'Updated Panel',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle panel update socket message with different token', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'update',
            status: true,
            data: {
              token: 'panel14444',
              title: 'Updated Panel',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle panel update socket message with wrong operation', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'wrong',
            status: true,
            data: {
              token: 'panel14444',
              title: 'Updated Panel',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle panel delete socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'delete',
            status: true,
            data: 'panel1',
          }),
        });
      });
    });

    it('Should handle panel add socket message', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'add',
            status: true,
            data: {
              token: 'panel3',
              title: 'New Panel',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle panel add socket message with wrong token', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'add',
            status: true,
            data: {
              token: 'panel1',
              title: 'New Panel',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should handle panel add socket message with different customerID', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'add',
            status: true,
            data: {
              token: 'panel3',
              title: 'New Panel',
              customerID: 'different-customer-id',
            },
          }),
        });
      });
    });

    it('Should handle panel update socket message with search value', () => {
      // First set a search value
      const panelDataSearch = getById('panel_data_search');
      fireEvent.change(panelDataSearch, { target: { value: 'test' } });

      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

      act(() => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'panel',
            operation: 'update',
            status: true,
            data: {
              token: 'panel1',
              title: 'test panel',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should unsubscribe from socket on unmount', () => {
      wrapper.unmount();
      expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
