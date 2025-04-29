import { fireEvent, screen } from '@testing-library/react';
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
import { DeletePanelListAction, fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';

jest.useFakeTimers();

const mockPanelData = [
  {
    token: 'panel1',
    title: 'Test Panel 1',
    panelType: 'ringChart',
    addedBy: 'Test User',
    createdTime: '2024-03-20T10:00:00',
    dashToken: 'dash1',
    panelToken: 'panel1',
    ownerToken: 'testUserToken',
  },
  {
    token: 'panel2',
    title: 'Test Panel 2',
    panelType: 'barChart',
    addedBy: 'Test User',
    createdTime: '2024-03-20T11:00:00',
    dashToken: 'dash1',
    panelToken: 'panel2',
    ownerToken: 'testUserToken',
  },
];

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
  newPanelModal: false,
  setNewPanelPreviewModal: jest.fn(),
  newPanelPreviewModal: false,
  setNewPanelModal: jest.fn(),
  selectToken: 'panel1',
  DeletePanelListAction,
  fakeActionDashboard,
  mask: jest.fn(),
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

const initialData = {
  Panel: {
    GetAllPanelListResponse: {
      status: true,
      data: mockPanelData,
    },
    PanelDeleteResponse: null,
    PanelPreviewResponse: null,
    GetDeletePanelListResponse: null,
  },
  Dashboard: {
    GetDeletePanelListResponse: null,
  },
};

// Setup function
const setUp = (props = {}, initialState = {}) => renderComponent(
  PanelsEkasha,
  { ...panelProps, ...props },
  initialState,
  { dashIntervalStatus: true, customerID: 'test123' },
);

describe('SinglePanelBox Component', () => {
  let wrapper;

  describe('Panel Box Rendering', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'home', 'panel'));
      wrapper = setUp(panelProps, initialData);
    });

    it('Should render panel type icons correctly', () => {
      mockPanelData.forEach(() => {
        const panelIcon = getById('select_panel_card');
        fireEvent.click(panelIcon);
        expect(panelIcon).toBeTruthy();
      });
    });
  });

  describe('Panel Operations', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'home', 'panel'));
      wrapper = setUp(panelProps, initialData);
    });

    it('Should handle three dots menu click', () => {
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);

      const optionsMenu = document.querySelector('.overflowOption.opOpen');
      expect(optionsMenu).toBeTruthy();
    });

    it('Should handle panel edit', () => {
      // Open options menu
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);

      // Click edit icon
      const editIcon = getById('panel_chart_edit_icon');
      fireEvent.click(editIcon);
    });
    it('Should handle panel preview', () => {
      // Open options menu
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);

      // Click preview icon
      const previewIcon = getById('panel_chart_view_open');
      fireEvent.click(previewIcon);
    });
    it('Should handle panel edit NA permission', () => {
      // Open options menu
      setPermissions(handlePermission('NA', 'home', 'panel'));
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);

      // Click edit icon
      const editIcon = getById('panel_chart_edit_icon');
      fireEvent.click(editIcon);
    });

    it('Should handle panel edit', () => {
      // Open options menu
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);
    });

    it('Should handle panel delete', () => {
      // Open options menu
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);

      // Click delete icon
      const deleteIcon = getById('panel_chart_delete_icon');
      fireEvent.click(deleteIcon);
    });
  });

  describe('Delete Modal', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'home', 'panel'));
    });

    it('Should show delete confirmation modal', () => {
      wrapper = setUp(panelProps, initialData);

      // Open options menu and click delete
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);
      const deleteIcon = getById('panel_chart_delete_icon');
      fireEvent.click(deleteIcon);

      // Check if modal is displayed
      const deleteModal = document.querySelector('.ant-modal-content');
      expect(deleteModal).toBeTruthy();
    });

    it('Should handle delete confirmation', () => {
      const mockState = {
        ...initialData,
        Dashboard: {
          GetDeletePanelListResponse: {
            status: true,
            data: [{ dashName: 'Test Dashboard' }],
          },
        },
      };

      wrapper = setUp(panelProps, mockState);

      // Open options menu and click delete
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);
      const deleteIcon = getById('panel_chart_delete_icon');
      fireEvent.click(deleteIcon);
      jest.advanceTimersByTime(500);
      expect(screen.getByText('Are you sure to delete this panel?')).toBeInTheDocument();
      const modelYesButton = screen.getByText('Yes');
      fireEvent.click(modelYesButton);
      const modelNoButton = screen.getByText('No');
      fireEvent.click(modelNoButton);
      const modelCloseButton = getById('ConfirmModal_close_panelDeleteConform');
      fireEvent.click(modelCloseButton);
    });
    it('Should handle delete failed response', () => {
      const mockState = {
        ...initialData,
        Dashboard: {
          GetDeletePanelListResponse: {
            status: false,
            data: [{ dashName: 'Test Dashboard' }],
          },
        },
      };

      wrapper = setUp(panelProps, mockState);

      // Open options menu and click delete
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);
    });
  });

  describe('Permission Handling', () => {
    it('Should handle read-only permissions', () => {
      setPermissions(handlePermission('RO', 'home', 'panel'));
      wrapper = setUp(panelProps, initialData);

      // Open options menu
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);
      // Should not call panelFindByToken
    });

    it('Should handle no access permissions', () => {
      setPermissions(handlePermission('NA', 'home', 'panel'));
      wrapper = setUp(panelProps, initialData);

      // Open options menu
      const threeDotMenu = getById('three_dot_op');
      fireEvent.click(threeDotMenu);

      // Try to click delete icon
      const deleteIcon = getById('panel_chart_delete_icon');
      fireEvent.click(deleteIcon);
    });
  });

  describe('Panel Response Handling', () => {
    it('Should handle successful panel delete', () => {
      const successState = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          PanelDeleteResponse: { status: true },
        },
      };

      wrapper = setUp(panelProps, successState);

      // Verify modal is closed after successful delete
      const deleteModal = document.querySelector('.ant-modal-content');
      expect(deleteModal).toBeFalsy();
    });

    it('Should handle failed panel delete', () => {
      const failedState = {
        ...initialData,
        Panel: {
          ...initialData.Panel,
          PanelDeleteResponse: { status: false, error: 'Delete failed' },
        },
      };

      wrapper = setUp(panelProps, failedState);

      // Verify loading state is removed
      const loadingIndicator = document.querySelector('.ant-modal-confirm-loading');
      expect(loadingIndicator).toBeFalsy();
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
