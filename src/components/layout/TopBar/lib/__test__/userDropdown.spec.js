import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { renderComponent, getById, selectOption } from '../../../../../helpers/lib/RTL';
import UserDropdown from '../userDropdown';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

jest.mock('../../../../../helpers/lib/SocketHandlers', () => {
  const mockStompClient = {
    connected: false,
    connect: jest.fn((headers, connectCallback) => {
      setTimeout(() => {
        mockStompClient.connected = true;
        connectCallback();
      }, 100); // Simulate async connection
    }),
    disconnect: jest.fn((disconnectCallback) => {
      if (mockStompClient.connected) {
        mockStompClient.connected = false;
        disconnectCallback();
      }
    }),
    subscribe: jest.fn(),
  };

  return {
    stompClient: mockStompClient,
  };
});

const GetAllTimezoneListRes = {
  status: true,
  code: 200,
  message: 'Data fetched.',
  data: [
    { name: 'Africa/Abidjan', value: 'Africa/Abidjan' },
    { name: 'Africa/Accra', value: 'Africa/Accra' },
    { name: 'Asia/Urumqi', value: 'Asia/Urumqi' },
    { name: 'Australia/Eucla', value: 'Australia/Eucla' },
    { name: 'Australia/Lindeman', value: 'Australia/Lindeman' },
    { name: 'Australia/Lord_Howe', value: 'Australia/Lord_Howe' },
    { name: 'Europe/Busingen', value: 'Europe/Busingen' },
    { name: 'Europe/Guernsey', value: 'Europe/Guernsey' },
    { name: 'Europe/Vatican', value: 'Europe/Vatican' },
    { name: 'Indian/Chagos', value: 'Indian/Chagos' },
    { name: 'Indian/Christmas', value: 'Indian/Christmas' },
    { name: 'Indian/Cocos', value: 'Indian/Cocos' },
    { name: 'Indian/Kerguelen', value: 'Indian/Kerguelen' },
    { name: 'UTC', value: 'UTC' },
  ],
};

const actionProps = {
  userProfile: {
    userName: 'admin',
    email: 'supportsfgsdhsdghdfgjdfghsdfgsdfgsdfhsdfvasdfafvsdhegjnf@zeronsec.com',
    fullname: 'Ekasha Admin',
    groupName: 'Administrator',
    role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
    contact: '',
  },
  logoutAction: jest.fn(),
  fakeAction: jest.fn(),
  ChangePasswordAction: jest.fn(),
  checkValidPassAction: jest.fn(),
  validPassPolicy: jest.fn(),
  timeZoneList: jest.fn(),
  changeTimeZone: jest.fn(),
  fakeActionTimezone: jest.fn(),
  fakeActionAuth: jest.fn(),
};
const initialData = {
  Auth: {
    CheckValidPassResponse: {},
    ValidPassPolicyResponse: {},
    getCurrentTimezoneResponse: {},
    userPermissionsResponse: {},
  },
  TIMEZONE: {
    GetAllTimezoneListResponse: GetAllTimezoneListRes,
    ChangeTimezoneResponse: {},
  },
  User: {
    LogoutResponse: {},
  },
};
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  UserDropdown,
  { ...props },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Responce Handling', () => {
  describe('Responce Handling true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Auth.CheckValidPassResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: [],
      };
      initial.Auth.ValidPassPolicyResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: [],
      };
      initial.Auth.getCurrentTimezoneResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: {
          serverTimezone: 'Asia/Kolkata',
          userTimezone: 'Asia/Kolkata',
        },
      };
      initial.TIMEZONE.ChangeTimezoneResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: {
          timezone: 'Asia/Kolkata',
        },
      };
      initial.User.LogoutResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        // data: {},
      };
      initial.User.ChangePasswordResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        // data: {},
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should not render component', () => {
      expect(getById('view_Notification')).not.toBeInTheDocument();
    });
  });
  describe('Responce Handling false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Auth.CheckValidPassResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        data: [],
      };
      initial.Auth.ValidPassPolicyResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        data: ['done'],
      };
      initial.Auth.getCurrentTimezoneResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        data: [],
      };
      initial.TIMEZONE.ChangeTimezoneResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        data: [],
      };
      initial.User.LogoutResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        // data: {},
      };
      initial.User.ChangePasswordResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        // data: {},
      };
      initial.TIMEZONE.GetAllTimezoneListResponse = {
        status: false,
        code: 400,
        message: 'Data fetched.',
        data: [],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('should not render component', () => {
      expect(getById('view_Notification')).not.toBeInTheDocument();
    });
  });
});

describe('Dropdown', () => {
  describe('Profile click', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('Profile Dropdown', async () => {
      const userDrpMenu = getById('userDrpMenu');
      fireEvent.click(userDrpMenu);
      const userDropdown = getById('userDropdown');
      fireEvent.click(userDropdown);
      fireEvent.click(document.body);
      fireEvent.click(userDropdown);
      const userDropdownModal = getById('UserDropDown_profile');
      fireEvent.click(userDropdownModal);

      // Change Password
      let ChangePass = getById('user_changepass');
      fireEvent.click(ChangePass);
      const CloseBtn = getById('ChangePass_closeBtn');
      fireEvent.click(CloseBtn);
      ChangePass = getById('user_changepass');
      fireEvent.click(ChangePass);
      const CurrentPassword = getById('current_password');
      fireEvent.change(CurrentPassword, { target: { value: '' } });
      const SaveBtn = getById('ChangePass_confirmBtn');
      fireEvent.click(SaveBtn);
      fireEvent.change(CurrentPassword, { target: { value: 'admin@123' } });
      fireEvent.click(SaveBtn);
      const NewPassword = getById('password');
      fireEvent.change(NewPassword, { target: { value: 'admin@1123' } });
      fireEvent.click(SaveBtn);
      const ConfirmPassword = getById('confirm_Password');
      fireEvent.change(ConfirmPassword, { target: { value: 'admin@' } });
      fireEvent.click(SaveBtn);
      fireEvent.change(ConfirmPassword, { target: { value: 'admin@1123' } });
      fireEvent.click(SaveBtn);

      // Change Timezone
      const PencilIcon = getById('Change_Profile_Timezone');
      fireEvent.click(PencilIcon);
      const timezoneListInput = getById('create_incident_type');
      fireEvent.change(timezoneListInput, { target: { value: 'Africa/Accra' } });
      const timezoneList = 'create_incident_type';
      selectOption(timezoneList, 'Africa/Accra');
      const ApplyBtn = getById('UserProfileModal_timezonBtn');
      fireEvent.click(ApplyBtn);
      // fireEvent.change(getById(timezoneList), { target: { value: 'Africa/Abidjan' } });
      const CloseIcon = getById('ekasha_model_close_userProfileModal');
      fireEvent.click(CloseIcon);
    });
    it('should handle clicks inside vis-timeline element', () => {
      // Create a mock timeline element
      const timelineDiv = document.createElement('div');
      timelineDiv.className = 'vis-timeline';
      document.body.appendChild(timelineDiv);

      // Create a child element inside timeline
      const insideElement = document.createElement('div');
      timelineDiv.appendChild(insideElement);

      // Simulate click inside timeline
      act(() => {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        insideElement.dispatchEvent(clickEvent);
      });

      // Clean up
      document.body.removeChild(timelineDiv);
    });
  });
  describe('Logout click', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('Logout Dropdown', async () => {
      let userDrpMenu = getById('userDrpMenu');
      fireEvent.click(userDrpMenu);
      let userDropdown = getById('userDropdown');
      fireEvent.click(userDropdown);
      fireEvent.click(document.body);
      fireEvent.click(userDropdown);
      let userDropdownModal = getById('UserDropDown_Logout');
      fireEvent.click(userDropdownModal);
      const cancleBtn = getById('closeBtn');
      fireEvent.click(cancleBtn);
      userDrpMenu = getById('userDrpMenu');
      fireEvent.click(userDrpMenu);
      userDropdown = getById('userDropdown');
      fireEvent.click(userDropdown);
      fireEvent.click(document.body);
      fireEvent.click(userDropdown);
      userDropdownModal = getById('UserDropDown_Logout');
      fireEvent.click(userDropdownModal);
      const logoutBtn = getById('deleteBtn');
      fireEvent.click(logoutBtn);
    });
  });
  describe('licenseStatus === false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Auth.userPermissionsResponse = {
        status: true,
        code: 200,
        message: 'Data fetched.',
        data: {
          data: [
            {
              licenseStatus: false,
            },
            {
              licenseStatus: false,
            },
          ],
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setUp(actionProps, initial);
    });
    it('Logout Dropdown', async () => {
      const userDrpMenu = getById('userDrpMenu');
      fireEvent.click(userDrpMenu);
      const userDropdown = getById('userDropdown');
      fireEvent.click(userDropdown);
      fireEvent.click(document.body);
      fireEvent.click(userDropdown);
      const userDropdownModal = getById('UserDropDown_profile');
      fireEvent.click(userDropdownModal);
    });
  });
  describe('resetStatus === true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      localStorage.setItem('resetStatus', 'true');
      setUp(actionProps, initial);
    });
    it('Logout Dropdown', async () => {
      const userDrpMenu = getById('userDrpMenu');
      fireEvent.click(userDrpMenu);
      const userDropdown = getById('userDropdown');
      fireEvent.click(userDropdown);
      fireEvent.click(document.body);
      fireEvent.click(userDropdown);
      const userDropdownModal = getById('UserDropDown_profile');
      fireEvent.click(userDropdownModal);
    });
  });
});

describe('Profile click with ValidPassPolicyResponse false', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.ValidPassPolicyResponse = {
      status: false,
      code: 400,
      message: 'Data fetched.',
      data: ['done'],
    };
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });
  it('Profile Dropdown', async () => {
    const userDrpMenu = getById('userDrpMenu');
    fireEvent.click(userDrpMenu);
    const userDropdown = getById('userDropdown');
    fireEvent.click(userDropdown);
    fireEvent.click(document.body);
    fireEvent.click(userDropdown);
    const userDropdownModal = getById('UserDropDown_profile');
    fireEvent.click(userDropdownModal);

    // Change Password
    let ChangePass = getById('user_changepass');
    fireEvent.click(ChangePass);
    // const CloseBtn = getById('ChangePass_closeBtn');
    // fireEvent.click(CloseBtn);
    ChangePass = getById('user_changepass');
    fireEvent.click(ChangePass);
    const CurrentPassword = getById('current_password');
    fireEvent.change(CurrentPassword, { target: { value: '' } });
    const SaveBtn = getById('ChangePass_confirmBtn');
    fireEvent.click(SaveBtn);
    fireEvent.change(CurrentPassword, { target: { value: 'admin@123' } });
    const NewPassword = getById('password');
    fireEvent.change(NewPassword, { target: { value: 'admin@1123' } });
    const ConfirmPassword = getById('confirm_Password');
    fireEvent.change(ConfirmPassword, { target: { value: 'admin@1123' } });
    fireEvent.click(SaveBtn);
  });
});

describe('Reset Password with CheckValidPassResponse true', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Auth.CheckValidPassResponse = {
      status: true,
      code: 200,
      message: 'Data fetched.',
      data: ['done'],
    };
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });
  it('Reset Password Dropdown', async () => {
    const userDrpMenu = getById('userDrpMenu');
    fireEvent.click(userDrpMenu);
    const userDropdown = getById('userDropdown');
    fireEvent.click(userDropdown);
    const userDropdownModal = getById('UserDropDown_profile');
    fireEvent.click(userDropdownModal);

    // Change Password
    const ChangePass = getById('user_changepass');
    fireEvent.click(ChangePass);
    const CurrentPassword = getById('current_password');
    fireEvent.change(CurrentPassword, { target: { value: 'admin@123' } });
    const NewPassword = getById('password');
    fireEvent.change(NewPassword, { target: { value: 'admin@1123' } });
    const ConfirmPassword = getById('confirm_Password');
    fireEvent.change(ConfirmPassword, { target: { value: 'admin@1123' } });
    const SaveBtn = getById('ChangePass_confirmBtn');
    fireEvent.click(SaveBtn);
  });
});
