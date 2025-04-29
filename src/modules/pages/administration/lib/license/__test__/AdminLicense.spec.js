import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import {
  getAllLicenseAction,
  uploadLicenseAction,
  fakeActionLicense,
} from '../../../../../../apis/administration/license/license.action';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import LicenseEkasha from '../../../../../containers/administration/licenseEkasha';

jest.useFakeTimers();

const actionProps = {
  getAllLicenseAction,
  uploadLicenseAction,
  fakeActionLicense,
};

const initialData = {
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

const setUp = (props = {}, initialState = {
  License: {},
}) => renderComponent(
  LicenseEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.License = {};
    setPermissions(handlePermission('NA', 'administration', 'license'));
    setUp(actionProps, initial);
  });

  it('Should not display license content', () => {
    const licenseElement = screen.queryByText('License');
    expect(licenseElement).not.toBeVisible();
  });
});

describe('Component Rendering - Reducer Response Handler', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.License.GetLicenseResponse.status = false;
    initial.License.UploadLicenseResponse.status = true;
    setPermissions(handlePermission('RW', 'administration', 'license'));
    setUp(actionProps, initial);
  });

  it('Should render license details', async () => {
    expect(screen.getByText('License')).toBeInTheDocument();

    const uploadButton = getById('Admin_License_Upload_Button');
    fireEvent.click(uploadButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const FileUploadDrop = getById('Admin_License_File_Upload_Drop');
    expect(FileUploadDrop).toBeInTheDocument();

    const closeUploadModel = getById('ekasha_model_close_Admin_License_Upload_Modal');
    await act(async () => {
      fireEvent.click(closeUploadModel);
    });
  });
});

describe('Component Rendering - Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'license'));
    setUp(actionProps, initial);
  });

  it('Should render license details in read-only mode', () => {
    expect(screen.getByText('Test Customer')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  it('Should disable upload functionality', async () => {
    await act(async () => {
      const uploadButton = getById('Admin_License_Upload_Button');
      fireEvent.click(uploadButton);
    });
    expect(screen.getByText("You don't have permission.")).toBeInTheDocument();
  });
});

describe('Component Rendering - Write Permission Upload License', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'license'));
    setUp(actionProps, initial);
  });

  it('Should handle license file upload', async () => {
    // Click upload button
    const uploadButton = getById('Admin_License_Upload_Button');
    fireEvent.click(uploadButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const FileUploadDrop = getById('Admin_License_File_Upload_Drop');
    expect(FileUploadDrop).toBeInTheDocument();

    // Create a mock license file
    const file = new File(['dummy content'], 'license.lic', { type: 'application/octet-stream' });

    // Get file input and simulate file selection
    const fileInput = getById('Admin_License_File_Upload_Drop');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    const RemoveUploadIcon = getById('Admin_License_File_Remove_Icon');
    await act(async () => {
      fireEvent.click(RemoveUploadIcon);
    });

    const file2 = new File(['dummy content'], 'license.lic', { type: 'application/octet-stream' });

    // Get file input and simulate file selection
    const fileInput2 = getById('Admin_License_File_Upload_Drop');
    await act(async () => {
      fireEvent.change(fileInput2, { target: { files: [file2] } });
    });

    // Submit form with file
    const submitButton = getById('Admin_License_File_Upload_Submit_Button');
    await act(async () => {
      fireEvent.click(submitButton);
    });
  });
});

describe('Component Rendering - Socket Handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'license'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to socket and handle license updates', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    act(() => {
      subscribeCallback({
        body: JSON.stringify({
          module: 'license',
          operation: 'add',
          status: true,
          data: {
            'Customer Name': 'Updated Customer',
            'Customer Email': 'updated@example.com',
            'Customer Country': 'USA',
            'Customer Domain': 'updated.com',
            'Product Name': 'Updated Product',
            'Product Version': '2.0.0',
            'License Issuer': 'Updated Issuer',
            'License Expiry': '2025-12-31T23:59:59',
            'User Limit': '200',
          },
        }),
      });
    });

    // Verify updated data is displayed
    expect(screen.getByText('Updated Customer')).toBeInTheDocument();
  });

  it('should unsubscribe on unmount', () => {
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
