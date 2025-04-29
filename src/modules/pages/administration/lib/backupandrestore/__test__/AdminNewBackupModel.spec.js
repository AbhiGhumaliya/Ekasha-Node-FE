import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { renderComponent, getById, selectOption } from '../../../../../../helpers/lib/RTL';
import NewBackup from '../lib/backup/lib/NewBackup';

jest.useFakeTimers();

const mockSingleBackup = {
  jobName: 'Test Backup',
  runType: 'schedule',
  typeData: {
    run: 'daily',
    runHour: '12',
    runDay: '',
    runMonth: '',
  },
  isMove: false,
  moveServerToken: '',
};

const mockServerList = [
  { name: 'Server 1', value: 'server_1' },
  { name: 'Server 2', value: 'server_2' },
];

const initialData = {
  BackUp: {},
};

const defaultProps = {
  onHide: jest.fn(),
  onFinish: jest.fn(),
  setData: jest.fn(),
  type: 'new',
  visible: true,
  singleBackup: mockSingleBackup,
  submitLoading: false,
  submited: false,
  valueEdited: true,
  serverList: mockServerList,
  backupModelLoading: false,
};

const setUp = (props = {}, initialState = { BackUp: {} }) => renderComponent(
  NewBackup,
  { ...defaultProps, ...props },
  initialState,
);

describe('NewBackup Component - Schedule Options - Monthly', () => {
  beforeEach(() => {
    setUp({
      singleBackup: {
        ...mockSingleBackup,
        runType: 'schedule',
        typeData: { ...mockSingleBackup.typeData, run: 'monthly' },
      },
    }, initialData);
  });

  it('Should show date selection for monthly schedule', () => {
    expect(getById('Admin_Backup_Create_Modal_On_Month')).toBeInTheDocument();
  });

  it('Should handle date selection', () => {
    selectOption('Admin_Backup_Create_Modal_On_Month', '9');
  });

  it('Should show error when date is not selected on submit', () => {
    setUp({
      submited: true,
      singleBackup: {
        ...mockSingleBackup,
        runType: 'schedule',
        typeData: { run: 'monthly', runHour: '12', runMonth: '' },
      },
    });
    expect(screen.getByText('Enter date')).toBeInTheDocument();
  });

  it('Should show correct label for monthly schedule', () => {
    expect(screen.getByText('of every month')).toBeInTheDocument();
  });
});

describe('NewBackup Component - Schedule Options - Yearly', () => {
  beforeEach(() => {
    setUp({
      singleBackup: {
        ...mockSingleBackup,
        runType: 'schedule',
        typeData: { ...mockSingleBackup.typeData, run: 'yearly' },
      },
    }, initialData);
  });

  it('Should show date and month selection for yearly schedule', () => {
    expect(getById('Admin_Backup_Create_Modal_On_Date')).toBeInTheDocument();
    expect(getById('Admin_Backup_Create_Modal_OF_Month')).toBeInTheDocument();
  });

  it('Should handle date selection', () => {
    selectOption('Admin_Backup_Create_Modal_On_Date', '10');
  });

  it('Should handle month selection', () => {
    selectOption('Admin_Backup_Create_Modal_OF_Month', '7');
  });

  it('Should show errors when date and month are not selected on submit', () => {
    setUp({
      submited: true,
      singleBackup: {
        ...mockSingleBackup,
        runType: 'schedule',
        typeData: {
          run: 'yearly', runHour: '12', runDay: '', runMonth: '',
        },
      },
    });
    expect(screen.getByText('Enter date')).toBeInTheDocument();
    expect(screen.getByText('Enter month')).toBeInTheDocument();
  });

  it('Should show correct label for yearly schedule', () => {
    expect(screen.getByText('of every year')).toBeInTheDocument();
  });
});

describe('NewBackup Component - Loading States and Submit', () => {
  it('Should show loading spinner', () => {
    setUp({ backupModelLoading: true }, initialData);
    expect(getById('Admin_Backup_Create_Modal_Loading')).toBeInTheDocument();
  });

  it('Should disable submit button when not edited', () => {
    setUp({ valueEdited: false }, initialData);
    const submitButton = getById('Admin_Backup_Create_Modal_Submit');
    expect(submitButton).toBeDisabled();
  });

  it('Should call onFinish when submit button is clicked', () => {
    setUp({}, initialData);
    const submitButton = getById('Admin_Backup_Create_Modal_Submit');
    fireEvent.click(submitButton);
    expect(defaultProps.onFinish).toHaveBeenCalled();
  });

  it('Should show correct button text based on type', () => {
    setUp({}, initialData);
    expect(screen.getByText('Create')).toBeInTheDocument();
    setUp({ type: 'edit' }, initialData);
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});

afterAll(() => {
  jest.useRealTimers();
});
