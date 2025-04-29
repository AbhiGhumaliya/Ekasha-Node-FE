import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import WarroomEkasha from '../../../../../../containers/incidents/subModule/warroomEkasha';
import { fakeWarroomAction, getAllMessagesAction } from '../../../../../../../apis/incidents/subModule/Warroom/Warroom.action';

jest.useFakeTimers();

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const actionProps = {
  getAllMessagesAction,
  fakeWarroomAction,
  IncidentId: 1,
  selectIncident: { status: 'Open' },
};

const socketData = [{
  body: JSON.stringify({
    module: 'warRoom',
    operation: 'send',
    status: true,
    data: [{
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
    }],
  }),
},
{
  body: JSON.stringify({
    module: 'warRoom',
    operation: 'addFile',
    status: true,
    data: [{
      messageTime: '2025-02-06T15:50:52.681467172+05:30',
      senderName: 'Ekasha Admin',
      openCompose: false,
      sender: 'm33b2e747',
      customerID: 'Customer_123',
      text: 'Incident',
      id: 'l1479992c',
      type: 'message',
      incidentId: 1,
      chatRoom: 1,
      status: true,
    }],
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

describe('Warroom Component - No Reducer Response', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom = {};
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    const warroomWrapper = getById('Incident_Warroom_Wrapper');
    expect(warroomWrapper).not.toBeInTheDocument();
  });
});

describe('Warroom Component - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.GetAllMessagesResponse.data.warroomStatus = false;
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });

  it('Should show no permission message', () => {
    const noPermissionMessage = getById('Incident_Warroom_Permission_RO_NoData');
    expect(noPermissionMessage).toBeInTheDocument();
  });
});

describe('Warroom Component with False Reducer Response', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.GetAllMessagesResponse.status = false;
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });

  it('Should show False Reducer Response', () => {
    const wrapperNoData = getById('Incident_Warroom_Permission_RO_NoData');
    expect(wrapperNoData).not.toBeInTheDocument();
  });
});

describe('Component Render Status Closed', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp({ ...actionProps, selectIncident: { status: 'Closed' } }, initial);
  });

  it('Should handle chat input and send button click with status closed', () => {
    const ChatInput = getById('Incident_Warroom_MessageInput_TypeText');
    fireEvent.change(ChatInput, { target: { value: 'Hello' } });
    fireEvent.keyPress(ChatInput, { key: 'Enter', code: 13, charCode: 13 });

    const fileUpload = getById('Incident_Warroom_MessageInput_AttachIcon');
    fireEvent.click(fileUpload);
  });
});

describe('Warroom Component - With Data', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Warroom.fileUploadResponse = {
      status: true,
      data: [{
        fileId: '1',
        chatRoom: 1,
      }],
    };
    setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('Should render warroom wrapper', () => {
    const warroomWrapper = getById('Incident_Warroom_Wrapper');
    expect(warroomWrapper).toBeInTheDocument();
  });

  it('Should handle sidebar toggle', () => {
    const sidebarToggle = getById('Incident_Warroom_Show_BrandLogo');
    fireEvent.click(sidebarToggle);
  });

  it('Should handle file download icon click', () => {
    const fileDownload = getById('Incident_Warroom_Message_DownloadIcon');
    fireEvent.click(fileDownload);
  });
});

describe('Warroom Component Warroom Input Component', () => {
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    initial.Warroom.GetFileSizeResponse = {
      status: true,
      data: [{
        fileName: '162524_Ransomware.pdf',
        size: 1228,
        status: true,
      }],
    };
    initial.Warroom.SendMessagesResponse = {
      status: true,
      data: {
        messageTime: '2025-02-06T15:50:52.681467172+05:30',
        senderName: 'Ekasha Admin',
        openCompose: false,
        sender: 'm33b2e747',
        customerID: 'Customer_1',
        text: 'Incident',
      },
    };
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });

  it('Should handle chat input and send button click', () => {
    const ChatInput = getById('Incident_Warroom_MessageInput_TypeText');
    fireEvent.change(ChatInput, { target: { value: 'Hello' } });

    const sendButton = getById('Incident_Warroom_MessageInput_SendButton');
    fireEvent.click(sendButton);
  });

  it('Should handle file upload', async () => {
    const fileUpload = getById('Incident_Warroom_MessageInput_AttachIcon');
    fireEvent.click(fileUpload);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const FileUploadDrop = getById('Incident_Warroom_MessageInput_Modal_FileUpload');
    expect(FileUploadDrop).toBeInTheDocument();

    const mockFile = {
      uid: 'rc-upload-1738648567984-12',
      name: '162524_Ransomware.pdf',
      lastModified: 1738404334777,
      lastModifiedDate: new Date('2025-02-01T10:05:34.777Z'),
      size: 1228,
      type: 'application/pdf',
      percent: 0,
      originFileObj: {
        uid: 'rc-upload-1738648567984-12',
      },
    };

    const fileInput = getById('Incident_Warroom_MessageInput_Modal_FileUpload');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await act(async () => {
      jest.runAllTimers();
      jest.advanceTimersByTime(500);
    });

    const RemoveUploadIcon = getById('Incident_Warroom_MessageInput_Modal_RemoveFiles_0');
    await act(async () => {
      fireEvent.click(RemoveUploadIcon);
    });

    const fileInput2 = getById('Incident_Warroom_MessageInput_Modal_FileUpload');

    await act(async () => {
      fireEvent.change(fileInput2, { target: { files: [mockFile] } });
    });

    await act(async () => {
      jest.runAllTimers();
      jest.advanceTimersByTime(500);
    });

    const submitButton = getById('Incident_Warroom_MessageInput_Modal_UploadButton');
    await act(async () => {
      fireEvent.click(submitButton);
    });
  });
});

describe('Warroom Component WarroomInput Over File Size', () => {
  const initial = JSON.parse(JSON.stringify(initialData));
  beforeEach(() => {
    initial.Warroom.GetFileSizeResponse = {
      status: true,
      data: [
        {
          fileName: '1625_Ransomware.pdf',
          size: 122800,
          status: false,
        }],
    };
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('U_PROFILE', JSON.stringify({
      fullname: 'Umesh Karkar',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    setUp(actionProps, initial);
  });

  it('Should handle file upload Failed', async () => {
    const fileUpload = getById('Incident_Warroom_MessageInput_AttachIcon');
    fireEvent.click(fileUpload);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const FileUploadDrop = getById('Incident_Warroom_MessageInput_Modal_FileUpload');
    expect(FileUploadDrop).toBeInTheDocument();

    const mockFile = {
      uid: 'rc-upload-1738648567984-7',
      name: '1625_Ransomware.pdf',
      lastModified: 1738404334777,
      lastModifiedDate: new Date('2025-02-01T10:05:34.777Z'),
      size: 122800,
      type: 'application/pdf',
      percent: 0,
      originFileObj: {
        uid: 'rc-upload-1738648567984-7',
      },
    };

    const fileInput = getById('Incident_Warroom_MessageInput_Modal_FileUpload');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await act(async () => {
      jest.runAllTimers();
      jest.advanceTimersByTime(500);
    });

    const TryAgain = getById('Incident_Warroom_MessageInput_Modal_TryAgain_0');
    await act(async () => {
      fireEvent.click(TryAgain);
    });

    const CloseModal = getById('ekasha_model_close_Incident_Warroom_MessageInput_Modal');
    await act(async () => {
      fireEvent.click(CloseModal);
    });
  });
});

describe('Socket Operations', () => {
  let mockSubscribe;

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

    setUp(actionProps, initialData);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle warroom socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
        jest.advanceTimersByTime(100);
      });
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
