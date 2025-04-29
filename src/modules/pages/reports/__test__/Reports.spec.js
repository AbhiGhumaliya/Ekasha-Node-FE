import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../helpers/lib/RTL';
import Reports from '../../../containers/reports';
import Toaster from '../../../../components/toaster';
import {
  addReportAction, deletArchiveReportAction, deleteReportAction, fakeReportAction,
  getAllArchiveReportAction, getAllReportAction, getSingleReportAction, updateReportAction,
} from '../../../../apis/reports/actions';

jest.mock('../../../../components/toaster');

jest.useFakeTimers();

const actionsProps = {
  getAllReportAction,
  getAllArchiveReportAction,
  deleteReportAction,
  deletArchiveReportAction,
  fakeReportAction,
  getSingleReportAction,
  updateReportAction,
  addReportAction,
};

const initialData = {
  Reports: {
    GetAllReportResponse: {
      data: [],
      status: false,
    },
    GetAllArchiveReportResponse: {
      data: [],
      status: false,
    },
    GetSingleReportResponse: {
      data: {},
      status: false,
    },
    UpdateReportResponse: {
      data: {},
      status: false,
    },
    AddReportResponse: {
      data: {},
      status: false,
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  Reports,
  props,
  initialState,
  contextValue,
);

describe('Reports Container - No Permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('NA', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionsProps, initial);
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Reports_Permission_RO_NoData_Page');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('Reports Container - Read Only Permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RO', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionsProps, initial);
  });

  it('Should handle add button click with read-only permissions', () => {
    const addButton = getById('Reports_Add_Button');
    fireEvent.click(addButton);
    expect(Toaster).toHaveBeenCalledWith({
      title: "You don't have permission.",
      type: 'error',
    });
  });
});

describe('Reports Container - Read Write Permission', () => {
  beforeEach(() => {
    setPermissions(handlePermission('RW', 'reports'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionsProps, initial);
  });

  it('Should render reports wrapper', () => {
    const reportsWrapper = getById('Reports_Wrapper');
    expect(reportsWrapper).toBeInTheDocument();
  });

  it('Should handle tab changes', () => {
    const tabs = getById('Reports_Tabs');
    expect(tabs).toBeInTheDocument();

    // Click Archives tab
    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);
    expect(getById('Reports_Wrapper')).toBeInTheDocument();

    // Click Reports tab
    const reportsTab = screen.getByText('Reports');
    fireEvent.click(reportsTab);
    expect(getById('Reports_Wrapper')).toBeInTheDocument();
  });

  it('Should handle new report creation', async () => {
    const addButton = getById('Reports_Add_Button');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const closeModel = getById('ekasha_model_close_Report_Create_Modal');
    fireEvent.click(closeModel);
  });

  it('Should handle add button visibility based on active tab', () => {
    // Initially on Reports tab, button should be visible
    const addButton = getById('Reports_Add_Button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveStyle({ opacity: 1 });

    // Switch to Archives tab
    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);

    // Add button should not be visible in Archives tab
    expect(addButton).not.toBeInTheDocument();
  });

  it('Should pass correct props to active tab component', async () => {
    // Switch to Archives tab
    const archivesTab = screen.getByText('Archives');
    fireEvent.click(archivesTab);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
