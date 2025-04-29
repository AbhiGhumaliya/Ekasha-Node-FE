import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { renderComponent, getById, selectOption } from '../../../../../../../helpers/lib/RTL';
import WarroomEkasha from '../../../../../../containers/incidents/subModule/warroomEkasha';
import { fakeWarroomAction, getAllMessagesAction } from '../../../../../../../apis/incidents/subModule/Warroom/Warroom.action';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';

jest.useFakeTimers();

const actionProps = {
  getAllMessagesAction,
  fakeWarroomAction,
  IncidentId: 1,
  selectIncident: { status: 'Open' },
};

const socketData = [{
  body: JSON.stringify({
    module: 'warRoom',
    operation: 'add',
    status: true,
    data: {
      messageTime: '2025-02-06T15:50:52.681467172+05:30',
      senderName: 'Ekasha Admin',
      openCompose: false,
      sender: 'm33b2e747',
      customerID: 'Customer_1',
      text: 'Incident',
      id: 'l1479992c',
      type: 'message',
      incidentId: 1,
      chatRoom: 1,
      status: true,
      users: [
        {
          groupName: 'Administrator',
          inviteStatus: 'owner',
          name: 'Tulesh Goswami',
          token: 'xa4efc2f6',
        },
      ],
    },
  }),
},
{
  body: JSON.stringify({
    module: 'warRoom',
    operation: 'update',
    status: true,
    data: {
      messageTime: '2025-02-06T15:50:52.681467172+05:30',
      senderName: 'Ekasha Admin',
      openCompose: false,
      sender: 'm33b2e747',
      customerID: 'Customer_1',
      text: 'Incident',
      id: 'l1479992c',
      type: 'message',
      incidentId: 1,
      chatRoom: 1,
      status: true,
      inviteStatus: 'owner',
      name: 'Tulesh Goswami',
      token: 'xa4efc2f6',
      users: [
        {
          groupName: 'Administrator',
          inviteStatus: 'owner',
          name: 'Tulesh Goswami',
          token: 'xa4efc2f6',
        },
      ],
    },
  }),
},
{
  body: JSON.stringify({
    module: 'warRoom',
    operation: 'update',
    status: true,
    data: {
      messageTime: '2025-02-06T15:50:52.681467172+05:30',
      senderName: 'Ekasha Admin',
      openCompose: false,
      sender: 'm33b2e747',
      customerID: 'Customer_1',
      text: 'Incident',
      id: 'l1479992c',
      type: 'message',
      incidentId: 1,
      chatRoom: 1,
      status: true,
      inviteStatus: 'assign',
      name: 'Tulesh Goswami',
      token: 'xa4efc2f6',
      users: [
        {
          groupName: 'Administrator',
          inviteStatus: 'assign',
          name: 'Tulesh Goswami',
          token: 'xa4efc2f6',
        },
      ],
    },
  }),
},
{
  body: JSON.stringify({
    module: 'warRoom',
    operation: 'update',
    status: true,
    data: {
      messageTime: '2025-02-06T15:50:52.681467172+05:30',
      senderName: 'Ekasha Admin',
      openCompose: false,
      sender: 'm33b2e747',
      customerID: 'Customer_1',
      text: 'Incident',
      id: 'l1479992c',
      type: 'message',
      incidentId: 1,
      chatRoom: 1,
      status: true,
      inviteStatus: 'assign',
      name: 'Tulesh Goswami',
      token: 'xa4efc',
      users: [
        {
          groupName: 'Administrator',
          inviteStatus: 'assign',
          name: 'Tulesh Goswami',
          token: 'xa4efc2f6',
        },
      ],
    },
  }),
},
{
  body: JSON.stringify({
    module: 'warRoom',
    operation: 'remove',
    status: true,
    data: {
      token: 'xa4efc2f6',
      incidentId: 1,
    },
  }),
},
{
  body: JSON.stringify({
    module: 'warRoom',
    operation: '',
    status: true,
    data: null,
  }),
},
];

const initialData = {
  Incident: {
    GetOwnerResponse: {
      status: true,
      data: [
        {
          name: 'Ekasha Admin (Administrator)',
          value: '828f8c6cccd9',
        },
        {
          name: 'Abhi Ghumaliya (Administrator)',
          value: 'm33b2e747',
        },
        {
          name: 'Hiral Posiya (Tier 1)',
          value: 'e747vgj4f',
        },
      ],
    },
  },
  Warroom: {
    GetAllMessagesResponse: {
      status: true,
      data: {
        warroomStatus: true,
        message: [
          [
            {
              messageTime: '2025-02-06T15:50:52.681467172+05:30',
              senderName: 'Ekasha Admin',
              openCompose: false,
              sender: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              customerID: 'Customer_1',
              text: 'Incident',
              id: 'l1479992c-e09b-4b9c-bf57-39d1d6d1c739',
              type: 'message',
              incidentId: '8',
              chatRoom: '8',
              status: true,
            },
          ],
          [
            {
              messageTime: '2025-02-06T15:50:59.489624095+05:30',
              senderName: 'Ekasha Admin',
              openCompose: false,
              sender: 'm33b2e747',
              customerID: 'Customer_1',
              text: 'Incident',
              id: 'v0b9d970e-2e45-4493-b6d6-687da70669ba',
              type: 'message',
              incidentId: '8',
              chatRoom: '8',
              status: true,
            },
          ],
          [
            {
              messageTime: '2025-02-07T12:53:11.290757237+05:30',
              SHA1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
              openCompose: false,
              FileName: 'SampleListFile (4) (2).csv',
              Filetype: 'csv',
              type: 'file',
              SHA256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              senderName: 'Ekasha Admin',
              attachment: '/opt/Ekasha/resources//warroomdocs/8/SampleListFile (4).csv',
              SHA384: '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
              sender: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              UserId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              customerID: 'Customer',
              id: 'e591e4e05-5524-4dd6-affb-31e3a481d990',
              time: '2025-02-07T12:53:11.290757237+05:30',
              SHA512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
              FileSize: 35,
              MD5: 'b8e8bebb85bdc06e94dc3127f9940407',
              chatRoom: 1,
              status: true,
            },
          ],
        ],
        currentUser: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      },
    },
    fileUploadResponse: {
      status: false,
      data: null,
    },
    GetFileSizeResponse: {
      status: false,
      data: null,
    },
    SendMessagesResponse: {
      status: false,
      data: null,
    },
    GetDetailWarroomResponse: {
      status: false,
      data: null,
    },
    InviteMemberResponse: {
      status: false,
      data: null,
    },
    RemoveMemberResponse: {
      status: false,
      data: null,
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  WarroomEkasha,
  props,
  initialState,
  {
    ...contextValue, customerID: 'Customer_1', tableView: false, setTableView: jest.fn(),
  },
);

describe('Component Render with False Reducer', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.GetDetailWarroomResponse = {
      code: 200,
      message: 'Data fetched.',
      status: false,
      data: null,
    };
    setUp(actionProps, initial);
  });

  it('Should handle False Reducer', async () => {
    const sidebarToggle = getById('Incident_Warroom_Show_BrandLogo');
    fireEvent.click(sidebarToggle);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.mouseDown(document.body);
  });
});

describe('Component Render Sidebar with Status Closed', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.GetDetailWarroomResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        ownerStatus: true,
        ownerName: 'Tulesh Goswami',
        assignedName: 'Tulesh Goswami',
        title: 'DoS and DDoS attacksDoS and DDoS attacksDoS and DDoS attacks',
        users: [
          {
            groupName: 'Administrator',
            inviteStatus: 'owner',
            name: 'Tulesh Goswami',
            token: 'xa4efc2f6',
          },
          {
            groupName: 'QA_ Group',
            name: 'Umesh Karkar',
            token: 'z2a12cc75',
            inviteStatus: 'invite',
          },
        ],
      },
    };
    initial.Warroom.InviteMemberResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {},
    };
    initial.Warroom.RemoveMemberResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {},
    };
    initial.Incident.GetOwnerResponse = {
      code: 200,
      message: 'Data fetched.',
      status: false,
    };
    setUp({ ...actionProps, selectIncident: { status: 'Closed' } }, initial);
  });

  it('Should handle delete button click with status closed', async () => {
    const sidebarToggle = getById('Incident_Warroom_Show_BrandLogo');
    fireEvent.click(sidebarToggle);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    const deleteButton = getById('Incident_Warroom_Sidebar_delete_Button_z2a12cc75');
    fireEvent.click(deleteButton);

    const AddUserButton = getById('Incident_Warroom_Sidebar_addUser_Button');
    fireEvent.click(AddUserButton);
  });
});

describe('Warroom Sidebar Owner Status False', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.GetDetailWarroomResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        ownerStatus: false,
        ownerName: 'Tulesh Goswami',
        assignedName: 'Tulesh Goswami',
        title: 'DoS and DDoS attacksDoS and DDoS attacksDoS and DDoS attacks',
        users: [
          {
            groupName: 'Administrator',
            inviteStatus: 'owner',
            name: 'Tulesh Goswami',
            token: 'xa4efc2f6',
          },
          {
            groupName: 'QA_ Group',
            name: 'Umesh Karkar',
            token: 'z2a12cc75',
            inviteStatus: 'invite',
          },
        ],
      },
    };
    setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('Should handle Delete user Modal with owner status false', async () => {
    const sidebarToggle = getById('Incident_Warroom_Show_BrandLogo');
    fireEvent.click(sidebarToggle);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const deleteButton = getById('Incident_Warroom_Sidebar_delete_Button_z2a12cc75');
    fireEvent.click(deleteButton);

    const AddUserButton = getById('Incident_Warroom_Sidebar_addUser_Button');
    fireEvent.click(AddUserButton);
  });
});

describe('Warroom Sidebar Component', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.GetDetailWarroomResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        ownerStatus: true,
        ownerName: 'Tulesh Goswami',
        assignedName: 'Tulesh Goswami',
        title: 'DoS and DDoS attacksDoS and DDoS attacksDoS and DDoS attacks',
        users: [
          {
            groupName: 'Administrator',
            inviteStatus: 'owner',
            name: 'Tulesh Goswami',
            token: 'xa4efc2f6',
          },
          {
            groupName: 'QA_ Group',
            name: 'Umesh Karkar',
            token: 'z2a12cc75',
            inviteStatus: 'invite',
          },
        ],
      },
    };
    setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('Should handle sidebar toggle', async () => {
    const sidebarToggle = getById('Incident_Warroom_Show_BrandLogo');
    fireEvent.click(sidebarToggle);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const warroomWrapper = getById('Incident_Warroom_Sidebar_wrapper');
    expect(warroomWrapper).toBeInTheDocument();

    const AddUser = getById('Incident_Warroom_Sidebar_addUser_Button');
    fireEvent.click(AddUser);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const OKButton = getById('Incident_Warroom_Sidebar_OK_Button');
    fireEvent.click(OKButton);

    const userSelect = getById('Incident_Warroom_Sidebar_select');
    expect(userSelect).toBeInTheDocument();

    selectOption('Incident_Warroom_Sidebar_select', 'Abhi Ghumaliya (Administrator)');

    fireEvent.click(OKButton);

    const BackButton = getById('Incident_Warroom_Sidebar_backButton');
    fireEvent.click(BackButton);
  });

  it('Should handle Delete user Modal', async () => {
    const sidebarToggle = getById('Incident_Warroom_Show_BrandLogo');
    fireEvent.click(sidebarToggle);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const AddUser = getById('Incident_Warroom_Sidebar_addUser_Button');
    fireEvent.click(AddUser);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.mouseDown(document.body);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(sidebarToggle);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const deleteButton = getById('Incident_Warroom_Sidebar_delete_Button_z2a12cc75');
    fireEvent.click(deleteButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const OKButton = screen.getByText('Yes');
    fireEvent.click(OKButton);

    const CancelButton = screen.getByText('No');
    fireEvent.click(CancelButton);
  });
});

describe('Socket Operations', () => {
  let mockSubscribe;
  let wrapper;

  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.GetDetailWarroomResponse = {
      code: 200,
      message: 'Data fetched.',
      status: true,
      data: {
        ownerStatus: true,
        ownerName: 'Tulesh Goswami',
        assignedName: 'Tulesh Goswami',
        title: 'DoS and DDoS attacksDoS and DDoS attacksDoS and DDoS attacks',
        users: [
          {
            groupName: 'Administrator',
            inviteStatus: 'owner',
            name: 'Tulesh Goswami',
            token: 'xa4efc2f6',
          },
          {
            groupName: 'QA_ Group',
            name: 'Umesh Karkar',
            token: 'z2a12cc75',
            inviteStatus: 'invite',
          },
        ],
      },
    };
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle warroom socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[1][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
      });
    });
  });
});

afterAll(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
