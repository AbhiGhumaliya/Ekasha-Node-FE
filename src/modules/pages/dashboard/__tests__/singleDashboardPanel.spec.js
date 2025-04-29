import { act } from 'react';

import { fireEvent, screen } from '@testing-library/react';
import { getById, renderComponent } from '../../../../helpers/lib/RTL';
import SinglePanle from '../lib/SinglePanle';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';

jest.useFakeTimers();

const mockProps = {
  parentDash: {
    token: 'dash1',
    dashName: 'Test Dashboard',
    interval: 30,
  },
  j: 0,
  singlePanle: {
    panelToken: 'panel1',
  },
  deleteChart: '',
  deleteBtn: jest.fn(),
  panelsData: {
    id: 'panel1',
    data: [{ value: 10, name: 'Test' }],
    title: 'Test Panel',
    panelType: 'barChart',
    xLabel: 'X Axis',
    yLabel: 'Y Axis',
  },
  setIntervalStatus: jest.fn(),
  setDeleteModal: jest.fn(),
  chartSizeChange: jest.fn(),
  panelDrawerClose: jest.fn(),
};

const contextValue = {
  resetIdelTimer: jest.fn(),
};

// Setup function
const setUp = (props = {}, initialState = {}) => renderComponent(
  SinglePanle,
  { ...props },
  initialState,
  null,
  {
    ...contextValue,
  },
);

describe('SinglePanel Component', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'test123');
    setPermissions(handlePermission('RW', 'home', 'dashboard'));
  });

  describe('Panel Rendering', () => {
    it('Should render panel with title', () => {
      setUp(mockProps);
      expect(screen.getByText('Test Panel')).toBeInTheDocument();
      fireEvent.keyDown(document.body, { key: 'escape', keyCode: '27' });
    });

    it('Should render default panel name when title is not provided', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, title: '' } });
      expect(screen.getByText('Panel Name')).toBeInTheDocument();
    });

    it('Should render default panel name when when data is empty', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, data: [] } });
    });

    it('Should render default panel name when when not panelData', () => {
      setUp({ ...mockProps, panelsData: null });
      expect(screen.getByText('Panel Name')).toBeInTheDocument();
    });

    it('Should render loading state when status is false', () => {
      setUp({ ...mockProps, panelsData: null });
    });
  });

  describe('Panel Options Menu', () => {
    it('Should open dropdown menu on click on delete with read only permission', async () => {
      setUp(mockProps);
      setPermissions(handlePermission('RO', 'home', 'dashboard'));
      const menuButton = getById('cardHeaderIcn');
      fireEvent.click(menuButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const deleteOption = getById('delete_modal_open');
      fireEvent.click(deleteOption);
      expect(mockProps.setDeleteModal).not.toHaveBeenCalled();
    });

    it('Should open dropdown menu on click', async () => {
      setUp(mockProps);
      const menuButton = getById('cardHeaderIcn');
      fireEvent.click(menuButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      expect(getById('delete_modal_open')).toBeInTheDocument();
    });

    it('Should call deleteBtn when delete option is clicked', async () => {
      const deleteBtn = jest.fn();
      setUp({ ...mockProps, deleteBtn });
      const menuButton = getById('cardHeaderIcn');
      fireEvent.click(menuButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const deleteOption = getById('delete_modal_open');
      fireEvent.click(deleteOption);
      expect(mockProps.setDeleteModal).toHaveBeenCalledWith(true);
    });
  });

  describe('Interval Timer', () => {
    it('Should set up interval timer on mount', () => {
      setUp(mockProps, { }, { resetIdelTimer: jest.fn() });
      expect(mockProps.setIntervalStatus).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(30 * 60000); // Advance time by interval
      });
    });
  });

  describe('Panel Data Updates based on panelType', () => {
    it('Should update panel data when pieChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'pieChart' } });
    });
    it('Should update panel data when ringChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'ringChart' } });
    });
    it('Should update panel data when halfRingChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'halfRingChart' } });
    });
    it('Should update panel data when halfPieChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'halfPieChart' } });
    });
    it('Should update panel data when horizontalBarChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'horizontalBarChart' } });
    });
    it('Should update panel data when stackedBarChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'stackedBarChart' } });
    });
    it('Should update panel data when lineChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'lineChart' } });
    });
    it('Should update panel data when areaChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'areaChart' } });
    });
    it('Should update panel data when dendrogramChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'dendrogramChart' } });
    });
    it('Should update panel data when funnelChart', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'funnelChart' } });
    });
    it('Should update panel data when table', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'table' } });
    });
    it('Should update panel data when table', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: 'wrong' } });
    });
    it('Should update panel data when table', () => {
      setUp({ ...mockProps, panelsData: { ...mockProps.panelsData, panelType: false } });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
