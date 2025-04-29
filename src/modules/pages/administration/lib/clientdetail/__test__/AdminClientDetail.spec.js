import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent, selectOption } from '../../../../../../helpers/lib/RTL';
import {
  getClientDataAction,
  addClientDetailAction,
  fakeActionClient,
} from '../../../../../../apis/administration/clientDetails/clientDetail.action';
import { fakeActionUser, getCountryCodeAction } from '../../../../../../apis/administration/users/user.actions';
import ClientEkasha from '../../../../../containers/administration/ClientDetailEkasha';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getClientDataAction,
  addClientDetailAction,
  fakeActionClient,
  fakeActionUser,
  getCountryCodeAction,
};

const initialData = {
  Client: {
    GetClientDataResponse: {
      code: 200,
      message: 'Client data fetched.',
      status: true,
      data: {
        securityTeamName: 'Test Client',
        securityTeamEmail: 'test@example.com',
        securityTeamContact: '1234567890',
        countryToken: 'India - +91',
        imgByte: 'base64string',
        fileName: 'logo.png',
      },
    },
    AddClientDataResponse: {
      code: 200,
      message: 'Client data added.',
      status: false,
      data: {},
    },
  },
  User: {
    CountryCodeGetAllResponse: {
      code: 200,
      message: 'Country codes fetched.',
      status: true,
      data: [{
        countryName: 'India',
        countryCode: '+91',
        countryflag: 'base64string',
        value: 'India - +91',
        name: 'India',
      },
      {
        countryName: 'USA',
        countryCode: '+1',
        countryflag: 'base64string',
        value: 'USA - +1',
        name: 'USA',
      }],
    },
  },
};

const setUp = (props = {}, initialState = {
  Client: {},
  User: {},
}) => renderComponent(
  ClientEkasha, props, initialState, null,
);

describe('Component Rendering - Render with No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Client = {};
    initial.User = {};
    setPermissions(handlePermission('NA', 'administration', 'client'));
    setUp(actionProps, initial);
  });

  it('Should render No Permission Page', () => {
    expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
  });
});

describe('Component Rendering - Render with False Response', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Client.GetClientDataResponse.status = false;
    initial.Client.AddClientDataResponse.status = true;
    initial.User.CountryCodeGetAllResponse.status = false;
    setPermissions(handlePermission('RO', 'administration', 'client'));
    setUp(actionProps, initial);
  });

  it('Should render wrapper', () => {
    expect(getById('AdminClientDetail_wrapper')).toBeInTheDocument();
  });
});

describe('Component Rendering - Read Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RO', 'administration', 'client'));
    setUp(actionProps, initial);
  });

  it('Should render client details in read-only mode', () => {
    expect(getById('AdminClientDetail_wrapper')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('Should disable edit functionality', async () => {
    await act(async () => {
      const editButton = getById('Admin_Client_Detail_Edit_Button');
      fireEvent.click(editButton);
    });
    expect(screen.getByText("You don't have permission.")).toBeInTheDocument();
  });
});

describe('Component Rendering - Write Permission File Upload Validation', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Client.GetClientDataResponse.data.imgByte = '';
    initial.Client.GetClientDataResponse.data.fileName = '';
    delete initial.Client.AddClientDataResponse;
    setPermissions(handlePermission('RW', 'administration', 'client'));
    setUp(actionProps, initial);
  });

  it('Should validate File Upload', async () => {
    const editButton = getById('Admin_Client_Detail_Edit_Button');
    fireEvent.click(editButton);

    const nameInput = getById('Admin_Client_Detail_client_name');
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = getById('Admin_Client_Detail_Save_Button');
    fireEvent.click(saveButton);
  });
});

describe('Component Rendering - Write Permission Form Validation', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'client'));
    setUp(actionProps, initial);
  });

  it('Should validate required fields on save', () => {
    // Enter edit mode
    const editButton = getById('Admin_Client_Detail_Edit_Button');
    fireEvent.click(editButton);

    // Clear required fields
    const nameInput = getById('Admin_Client_Detail_client_name');
    fireEvent.change(nameInput, { target: { value: '' } });

    // Try to save
    const saveButton = getById('Admin_Client_Detail_Save_Button');
    fireEvent.click(saveButton);

    // Check error messages
    expect(screen.getByText('Client name is required.')).toBeInTheDocument();
  });

  it('Should validate email format', () => {
    const editButton = getById('Admin_Client_Detail_Edit_Button');
    fireEvent.click(editButton);

    const emailInput = getById('Admin_Client_Detail_client_email');
    fireEvent.change(emailInput, { target: { value: '' } });

    const saveButton = getById('Admin_Client_Detail_Save_Button');
    fireEvent.click(saveButton);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    fireEvent.click(saveButton);
  });

  it('Should validate contact number', () => {
    const editButton = getById('Admin_Client_Detail_Edit_Button');
    fireEvent.click(editButton);

    const contactInput = getById('Admin_Client_Detail_client_Contact');
    fireEvent.change(contactInput, { target: { value: '456' } });

    const saveButton = getById('Admin_Client_Detail_Save_Button');
    fireEvent.click(saveButton);

    fireEvent.change(contactInput, { target: { value: '' } });

    fireEvent.click(saveButton);

    fireEvent.change(contactInput, { target: { value: '1234567890' } });

    fireEvent.click(saveButton);
  });
});

describe('Component Rendering - Write Permission Form Submission', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'client'));
    setUp(actionProps, initial);
    const editButton = getById('Admin_Client_Detail_Edit_Button');
    fireEvent.click(editButton);
  });

  afterEach(() => {
    // Clean up the mock
    global.URL.createObjectURL.mockReset();
    delete global.URL.createObjectURL;
  });

  it('Should handle file upload correctly', () => {
    // Create a mock file
    const file = new File(['dummy content'], 'test-logo.png', { type: 'image/png' });

    // Get file input and simulate file selection
    const fileInput = getById('Admin_Client_Detail_DropZone');
    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    // Submit form with file
    const saveButton = getById('Admin_Client_Detail_Save_Button');
    act(() => {
      fireEvent.click(saveButton);
    });
  });

  it('Should reject oversized files', async () => {
    const oneKB = 1024;
    const oneMB = oneKB * oneKB;
    const largeFile = new File(
      [new ArrayBuffer(11 * oneMB)], // Creates a 6MB file
      'large-logo.png',
      { type: 'image/png' },
    );

    // Get file input and simulate file selection
    const fileInput = getById('Admin_Client_Detail_DropZone');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
    });
  });

  it('Should handle file upload validation', async () => {
    // Create an invalid file (wrong type)
    const invalidFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    const fileInput = getById('Admin_Client_Detail_DropZone');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    });
  });

  it('Should handle successful form submission', async () => {
    // Fill form with valid data
    const nameInput = getById('Admin_Client_Detail_client_name');
    fireEvent.change(nameInput, { target: { value: 'New Client Name' } });

    const emailInput = getById('Admin_Client_Detail_client_email');
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

    const contactInput = getById('Admin_Client_Detail_client_Contact');
    fireEvent.change(contactInput, { target: { value: '1234567890' } });

    selectOption('client_detail_country_code', '+1');

    // Submit form
    const saveButton = getById('Admin_Client_Detail_Save_Button');
    fireEvent.click(saveButton);
  });

  it('Should handle cancel button click', () => {
    // Make some changes
    const nameInput = getById('Admin_Client_Detail_client_name');
    fireEvent.change(nameInput, { target: { value: 'Changed Name' } });

    // Click cancel
    const cancelButton = getById('Admin_Client_Detail_Cancel_Button');
    fireEvent.click(cancelButton);

    // Verify original data is restored
    expect(screen.getByText('Test Client')).toBeInTheDocument();
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
    setPermissions(handlePermission('RW', 'administration', 'client'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to socket and handle client updates', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    act(() => {
      subscribeCallback({
        body: JSON.stringify({
          module: 'client',
          operation: 'add',
          status: true,
          data: {
            securityTeamName: 'Updated Client',
            securityTeamEmail: 'updated@example.com',
            securityTeamContact: '9876543210',
            countryToken: 'India - +91',
            imgByte: 'base64string',
            fileName: 'logo.png',
          },
        }),
      });
    });
  });

  it('should unsubscribe on unmount', () => {
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });
});
