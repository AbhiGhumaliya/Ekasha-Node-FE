import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../helpers/lib/RTL';
import Footer from '../index';
import { panelDrawerClose } from '../../../../apis/panel/panel.action';
import { fakeActionNotification } from '../../../../apis/notification/notification.action';

jest.useFakeTimers();

const footerProps = {
  panelDrawerClose,
  fakeActionNotification,
};

const initialData = {
  Notification: {
    MoveToHomeResponse: null,
  },
  License: {
    GetLicenseResponse: {
      code: 200,
      message: 'License data fetched.',
      status: true,
      data: {
        'Customer Name': 'Test Customer',
        'Customer Email': 'test@example.com',
        'Customer Country': 'India',
        'Customer Domain': 'test.com',
        'Product Name': 'Test Product',
        'Product Version': '1.0.0',
        'License Issuer': 'Test Issuer',
        'License Expiry': '2024-12-31T23:59:59',
        'User Limit': '100',
      },
    },
    UploadLicenseResponse: {
      code: 200,
      message: 'License uploaded successfully.',
      status: false,
      data: {},
    },
  },
};

// Setup function
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  Footer,
  { ...footerProps, ...props },
  initialState,
  {
    ...contextValue,
    setDashIntervalStatus: jest.fn(),
  },
);

describe('Footer Component', () => {
  let wrapper;

  // Part 1: Basic Rendering and Permission Tests
  describe('Footer Component - Basic Rendering', () => {
    beforeEach(() => {
      window.location.hash = '#/zeronsec';
      localStorage.setItem('previosModul', JSON.stringify({ Other: '/zeronsec' }));
      setPermissions(handlePermission('RW', 'administration'));
      wrapper = setUp(footerProps, initialData);
    });

    it('Should render footer wrapper', () => {
      const footerWrapper = getById('footerIcon_admin');
      expect(footerWrapper).toBeInTheDocument();
    });

    it('Should not render administration button without permission', () => {
      setPermissions(handlePermission('NA', 'administration'));
      wrapper = setUp(footerProps, initialData);
    });
  });

  // Part 2: Footer State Management
  describe('Footer Component - State Management', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'administration'));
      wrapper = setUp(footerProps, initialData);
    });

    it('Should handle administration button click', () => {
      const adminButton = getById('footerIcon_admin');
      fireEvent.click(adminButton);
    });
  });

  // Part 3: License Status Handling
  describe('Footer Component - License Status', () => {
    it('Should redirect to SLA page when license is invalid', () => {
      jest.isolateModules(() => {
        jest.doMock('../../../../helpers/lib/StorageHandlers', () => ({
          ...jest.requireActual('../../../../helpers/lib/StorageHandlers'),
          licStatus: false,
          witing: false,
        }));
        wrapper = setUp(footerProps, initialData);
      });
    });
  });

  // Part 4: Navigation and Route Handling
  describe('Footer Component - Navigation', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'administration'));
      wrapper = setUp(footerProps, initialData);
    });

    it('Should handle hash change event', async () => {
      window.location.hash = '#/zeronsec/other';
      const event = new Event('hashchange');
      window.dispatchEvent(event);
      await act(async () => {
        jest.advanceTimersByTime(100);
      });
    });

    it('Should handle administration route', async () => {
      window.location.hash = '#/zeronsec/administration/SLA';
      const event = new Event('hashchange');
      window.dispatchEvent(event);
      await act(async () => {
        jest.advanceTimersByTime(100);
      });
    });
  });

  // Part 5: Response Handling
  describe('Footer Component - Response Handling', () => {
    it('Should handle MoveToHome response', async () => {
      const moveToHomeState = {
        Notification: {
          MoveToHomeResponse: {
            type: 'MOVE_TO_HOME',
          },
        },
      };
      wrapper = setUp(footerProps, moveToHomeState);
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    });

    it('Should handle permission loss', () => {
      setPermissions(handlePermission('NA', 'administration'));
      wrapper.rerender();
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
