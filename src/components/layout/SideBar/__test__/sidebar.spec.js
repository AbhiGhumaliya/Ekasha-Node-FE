import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { renderComponent, getById } from '../../../../helpers/lib/RTL';
import SideBar from '../index';

jest.useFakeTimers();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/zeronsec/incidents',
  }),
}));

const actionProps = {
  collapsed: false,
};

const userPermissions = {
  code: 200,
  message: 'Get user permission.',
  status: true,
  data: [
    [
      {
        module: 'home',
        permission: 'RW',
        subModules: [
          { module: 'dashboard', permission: 'RW' },
          { module: 'panel', permission: 'RW' },
        ],
      },
      {
        module: 'incidents',
        permission: 'RW',
        subModules: [],
      },
      { module: 'playbook', permission: 'RW' },
      { module: 'ruleEngine', permission: 'RW' },
      { module: 'apps', permission: 'RW' },
      { module: 'reports', permission: 'RW' },
      { module: 'ioc', permission: 'RW' },
      { module: 'jobs', permission: 'RW' },
    ],
  ],
};

const setUp = (props = {}) => {
  const mockContextValue = {
    setTableView: jest.fn(),
    tableView: false,
    quickPanelStatus: false,
    setQuickPanelStatus: jest.fn(),
  };

  return renderComponent(
    SideBar,
    { ...props },
    {},
    mockContextValue,
  );
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    localStorage.setItem('permissions', JSON.stringify(userPermissions.data[0]));
    window.innerWidth = 1024;
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should render sidebar component', () => {
    setUp(actionProps);
    expect(getById('sideBarWrapper')).toBeInTheDocument();
  });

  it('should handle window resize', () => {
    setUp(actionProps);
    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });
    expect(getById('sideBarWrapper')).toBeInTheDocument();
  });

  it('should handle collapsed state', () => {
    setUp({ collapsed: true });
    expect(getById('sideBarWrapper')).toHaveStyle({ width: '80px' });
  });

  it('should handle no permissions state', () => {
    localStorage.removeItem('permissions');
    setUp(actionProps);
    expect(document.querySelector('.navLoading')).toBeInTheDocument();
  });

  it('should handle click outside new status menu', () => {
    setUp(actionProps);
    fireEvent.click(getById('quickOpenBtn'));
    act(() => {
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(mouseDownEvent);
    });
    expect(getById('quickOpenBtn')).toBeInTheDocument();
  });

  describe('Permission based rendering', () => {
    it('should handle read-only permissions', () => {
      const readOnlyPermissions = [...userPermissions.data[0]];
      readOnlyPermissions[0].permission = 'R';
      localStorage.setItem('permissions', JSON.stringify(readOnlyPermissions));
      setUp(actionProps);
      fireEvent.click(getById('quickOpenBtn'));
      expect(getById('sideBarWrapper')).toBeInTheDocument();
    });

    it('should handle no permission access', () => {
      const noPermissions = [...userPermissions.data[0]];
      noPermissions[0].permission = 'NA';
      localStorage.setItem('permissions', JSON.stringify(noPermissions));
      setUp(actionProps);
      fireEvent.click(getById('quickOpenBtn'));
      expect(getById('sideBarWrapper')).toBeInTheDocument();
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
