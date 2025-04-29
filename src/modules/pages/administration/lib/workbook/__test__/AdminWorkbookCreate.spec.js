import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../helpers/lib/RTL';
import {
  getAllWorkbookAction,
  getSingleWorkbookAction,
  deleteWorkbookAction,
  addWorkbookAction,
  updateWorkbookAction,
  fakeActionWorkbook,
  getWorkbookListOfAction,
} from '../../../../../../apis/administration/workbook/workbook.action';
import WorkbookEkasha from '../../../../../containers/administration/WorkbookEkasha';
import { ekashaAPIGetAction, fakePlaybookAction, getNewAllPlaybookBlockAction } from '../../../../../../apis/playbook/playbook.actions';

jest.useFakeTimers();

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const actionProps = {
  getAllWorkbookAction,
  fakeActionWorkbook,
  deleteWorkbookAction,
  addWorkbookAction,
  updateWorkbookAction,
  getSingleWorkbookAction,
  ekashaAPIGetAction,
  fakePlaybookAction,
  getWorkbookListOfAction,
  getNewAllPlaybookBlockAction,
};

const initialData = {
  Workbook: {
    GetAllWrokbookResponse: {
      code: 200,
      message: 'Workbook data fetched.',
      status: true,
      data: {
        content: [
          {
            token: 'wb21aa854',
            workbookName: 'Security Workbook',
            ownerName: 'Umesh Karkar',
            createdTime: '2024-11-16T17:05:45Z',
            status: true,
          },
          {
            token: 'wb6b6f36',
            workbookName: 'Incident Response',
            ownerName: 'Abhi Ghumaliya',
            createdTime: '2024-11-16T17:05:13Z',
            status: true,
          },
          {},
        ],
        totalElements: 10,
        totalPages: 1,
        size: 30,
        number: 0,
        numberOfElements: 3,
      },
    },
    AddWorkbookResponse: {
      code: 200,
      message: 'Workbook Added.',
      status: false,
      data: {},
    },
    UpdateWorkbookResponse: {
      code: 200,
      message: 'Workbook Updated.',
      status: false,
      data: {},
    },
    WorkbookDeleteResponse: {
      code: 200,
      message: 'Workbook Deleted.',
      status: false,
      data: {},
    },
    GetSingleWorkbookResponse: {
      code: 200,
      message: 'Workbook Data Fetched.',
      status: false,
      data: {},
    },
    GetWorkbookActionListResponse: {
      code: 200,
      message: 'Workbook Action Data Fetched.',
      status: false,
      data: [],
    },
  },
  PlayBook: {
    GetAllEkashaAPIResponse: {
      code: 200,
      message: 'Ekasha API Data Fetched.',
      status: false,
      data: {},
    },
    GetNewAllPlaybookBlockResponse: {
      code: 200,
      message: 'Playbook Block Data Fetched.',
      status: false,
      data: {},
    },
  },
};

const setUp = (props = {}, initialState = {
  Workbook: {},
  PlayBook: {},
}) => renderComponent(
  WorkbookEkasha, props, initialState, null,
);

describe('Component Rendering - Create Workbook Success Response', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Workbook.AddWorkbookResponse = {
      code: 200,
      message: 'Workbook Added.',
      status: true,
      data: {
        token: 'p5af5da81-9641-4d05-8ded-431fd9644c13',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        status: 'Published',
        workbookName: 'Test Workbook',
        workbookdata: '[{"name":"Test Workbook Phase Name","description":"Test Workbook Phase Description","collapseStatus":true,"tasks":[{"name":"Test Workbook Task Name","description":"Test Workbook Task Description","ownerName":"","owner":"Ekasha Admin","actions":[],"playbooks":[{"name":"get incident type","token":"pv279hto5pg","type":"playbook","dataToken":""}],"actionList":[{"displayName":"Create Incident","actionName":"createIncident","token":"113","type":"api","dataToken":""},{"name":"Email Reputation","type":"action","dataToken":""}]}]}]',
        updateTime: '2024-12-02T16:56:16Z',
        createdTime: '2024-12-02T16:56:16Z',
        permanent: false,
      },
    };
    initial.Workbook.UpdateWorkbookResponse = {
      code: 200,
      message: 'Workbook Updated.',
      status: true,
      data: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });
  it('Should Render Successfully', () => {
    const addButton = getById('Admin_Workbook_Add_Btn');
    fireEvent.click(addButton);
  });
});

describe('Component Rendering - Open Create Model and Close Model', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Workbook.GetSingleWorkbookResponse;
    initial.PlayBook = {};
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });

  it('Should Open and Close Create Model', async () => {
    const addButton = getById('Admin_Workbook_Add_Btn');
    fireEvent.click(addButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const backButton = getById('Admin_Workbook_Back_Btn');
    fireEvent.click(backButton);

    expect(getById('Admin_Workbook_Back_Btn')).not.toBeInTheDocument();
  });
});

describe('Content Rendering - No Data of Action and Playbook Block', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Workbook.GetSingleWorkbookResponse;
    initial.PlayBook.GetAllEkashaAPIResponse = {
      code: 200,
      message: 'Ekasha API Data Fetched.',
      status: true,
      data: [],
    };
    initial.Workbook.GetWorkbookActionListResponse = {
      code: 200,
      message: 'Workbook Action Data Fetched.',
      status: true,
      data: [],
    };
    initial.PlayBook.GetNewAllPlaybookBlockResponse = {
      code: 200,
      message: 'Playbook Block Data Fetched.',
      status: true,
      data: [],
    };
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });
  it('No Data Icon Show of Action and Playbook Block', async () => {
    const addButton = getById('Admin_Workbook_Add_Btn');
    fireEvent.click(addButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const collapseStatus = getById('Admin_Workbook_Phase_Collapse_Status_0');
    fireEvent.click(collapseStatus);

    const playbookButton = getById('Admin_Workbook_Add_Playbook_Btn_0_0');
    fireEvent.click(playbookButton);

    const ActionButton = getById('Admin_Workbook_Add_Action_Btn_0_0');
    fireEvent.click(ActionButton);

    const workbookNameInput = getById('Admin_Workbook_Name_Input');
    fireEvent.change(workbookNameInput, { target: { value: '456' } });
    fireEvent.change(workbookNameInput, { target: { value: '' } });

    const submitButton = getById('Admin_Workbook_Save_Btn');
    fireEvent.click(submitButton);

    fireEvent.change(workbookNameInput, { target: { value: '456' } });

    fireEvent.click(submitButton);

    const phaseNameInput = getById('Admin_Workbook_Phase_Name_Input_0');
    fireEvent.change(phaseNameInput, { target: { value: '4566' } });

    fireEvent.click(submitButton);

    const phaseDescriptionInput = getById('Admin_Workbook_Phase_Description_Textarea_0');
    fireEvent.change(phaseDescriptionInput, { target: { value: 'Test Description' } });

    fireEvent.click(submitButton);

    const taskNameInput = getById('Admin_Workbook_Task_Name_Input_0_0');
    fireEvent.change(taskNameInput, { target: { value: 'Test Task' } });

    fireEvent.click(submitButton);

    const backButton = getById('Admin_Workbook_Back_Btn');
    fireEvent.click(backButton);
  });
});

describe('Content Rendering - Open Create Model and Submit', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Workbook.GetSingleWorkbookResponse;
    initial.PlayBook.GetAllEkashaAPIResponse = {
      code: 200,
      message: 'Ekasha API Data Fetched.',
      status: true,
      data: [
        {
          token: 'ek1',
          actionName: 'Test API 3',
        },
        {
          token: 'ek2',
          actionName: 'Test API 4',
        },
        {
          token: 'ek3',
          actionName: 'Test API 5',
        },
      ],
    };
    initial.Workbook.GetWorkbookActionListResponse = {
      code: 200,
      message: 'Workbook Action Data Fetched.',
      status: true,
      data: ['URL Reputation', 'IP Reputation', 'File Reputation'],
    };
    initial.PlayBook.GetNewAllPlaybookBlockResponse = {
      code: 200,
      message: 'Playbook Block Data Fetched.',
      status: true,
      data: [
        {
          name: 'y1',
          configStatus: true,
          id: '5me3x1d0o37',
          value: '5me3x1d0o37',
        },
        {
          name: 'y4',
          configStatus: true,
          id: 'yywa0e8ujg',
          value: 'yywa0e8ujg',
        },
        {
          name: 'y5',
          configStatus: true,
          id: 'q08vc2muf28',
          value: 'q08vc2muf28',
        },
      ],
    };
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });
  it('Create Model Content with Valid Data', async () => {
    const addButton = getById('Admin_Workbook_Add_Btn');
    fireEvent.click(addButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const submitButton = getById('Admin_Workbook_Save_Btn');
    fireEvent.click(submitButton);

    const nameInput = getById('Admin_Workbook_Name_Input');
    fireEvent.change(nameInput, { target: { value: '' } });

    fireEvent.click(submitButton);

    fireEvent.change(nameInput, { target: { value: 'Test Workbook' } });

    const addPhaseButton = getById('Admin_Workbook_Add_Phase_Btn');
    fireEvent.click(addPhaseButton);

    const phaseNameInput = getById('Admin_Workbook_Phase_Name_Input_0');
    fireEvent.change(phaseNameInput, { target: { value: 'Test Phase' } });

    const phaseDescriptionInput = getById('Admin_Workbook_Phase_Description_Textarea_0');
    fireEvent.change(phaseDescriptionInput, { target: { value: 'Test Description' } });

    const removePhaseButton = getById('Admin_Workbook_Remove_Phase_1');
    fireEvent.click(removePhaseButton);

    const collapseStatus = getById('Admin_Workbook_Phase_Collapse_Status_0');
    fireEvent.click(collapseStatus);

    fireEvent.click(collapseStatus);

    const addTaskButton = getById('Admin_Workbook_Add_Task_Btn_0_0');
    fireEvent.click(addTaskButton);

    const removeTaskButton = getById('Admin_Workbook_Remove_Task_0_1');
    fireEvent.click(removeTaskButton);

    const taskNameInput = getById('Admin_Workbook_Task_Name_Input_0_0');
    fireEvent.change(taskNameInput, { target: { value: 'Test Task' } });

    const taskDescriptionInput = getById('Admin_Workbook_Task_Description_Textarea_0_0');
    fireEvent.change(taskDescriptionInput, { target: { value: 'Test Description' } });

    const playbookButton = getById('Admin_Workbook_Add_Playbook_Btn_0_0');
    fireEvent.click(playbookButton);

    fireEvent.mouseDown(document.body);

    fireEvent.click(playbookButton);

    const closePlaybookButton = getById('Admin_Workbook_Close_Playbook_Module_0_0');
    fireEvent.click(closePlaybookButton);

    fireEvent.click(playbookButton);

    const playbookSelect = getById('Admin_Workbook_Playbook_Select_5me3x1d0o37');
    fireEvent.click(playbookSelect);

    const playbookSelect2 = getById('Admin_Workbook_Playbook_Select_q08vc2muf28');
    fireEvent.click(playbookSelect2);

    fireEvent.click(playbookSelect2);

    const playbookSelect3 = getById('Admin_Workbook_Playbook_Select_yywa0e8ujg');
    fireEvent.click(playbookSelect3);

    const okPlaybookButton = getById('Admin_Workbook_OK_Playbook_Btn_0_0');
    fireEvent.click(okPlaybookButton);

    const ActionButton = getById('Admin_Workbook_Add_Action_Btn_0_0');
    fireEvent.click(ActionButton);

    fireEvent.mouseDown(document.body);

    fireEvent.click(ActionButton);

    const closeActionButton = getById('Admin_Workbook_Close_Action_Module_0_0');
    fireEvent.click(closeActionButton);

    fireEvent.click(ActionButton);

    const actionTab = getById('Admin_Workbook_Tabs-tab-Actions');
    expect(actionTab).toBeInTheDocument();
    fireEvent.click(actionTab);

    const actionSelect = getById('Admin_Workbook_Action_Select_ek1');
    expect(actionSelect).toBeInTheDocument();

    fireEvent.click(actionSelect);

    const actionSelect2 = getById('Admin_Workbook_Action_Select_ek2');
    expect(actionSelect2).toBeInTheDocument();
    fireEvent.click(actionSelect2);

    fireEvent.click(actionSelect2);

    const actionSelect3 = getById('Admin_Workbook_Action_Select_ek3');
    expect(actionSelect3).toBeInTheDocument();
    fireEvent.click(actionSelect3);

    const actionPanel = document.querySelector('[aria-controls="Admin_Workbook_Tabs-panel-Apis"]');
    expect(actionPanel).toBeInTheDocument();
    fireEvent.click(actionPanel);

    const ActionSelect = getById('Admin_Workbook_Configure_Action_0');
    expect(ActionSelect).toBeInTheDocument();
    fireEvent.click(ActionSelect);

    const ActionSelect2 = getById('Admin_Workbook_Configure_Action_1');
    expect(ActionSelect2).toBeInTheDocument();
    fireEvent.click(ActionSelect2);

    fireEvent.click(ActionSelect2);

    const okActionButton = getById('Admin_Workbook_OK_Action_Btn_0_0');
    fireEvent.click(okActionButton);

    const removeActionIcon = getById('Admin_Workbook_Remove_Action_0_0_0');
    fireEvent.click(removeActionIcon);

    const removePlaybookIcon = getById('Admin_Workbook_Remove_Playbook_0_0_0');
    fireEvent.click(removePlaybookIcon);

    const submitButton2 = getById('Admin_Workbook_Save_Btn');
    fireEvent.click(submitButton2);
  });
});

describe('Content Rendering - Open Edit Model and Submit', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.PlayBook.GetAllEkashaAPIResponse = {
      code: 200,
      message: 'Ekasha API Data Fetched.',
      status: true,
      data: [
        {
          token: 'ek1',
          actionName: 'Test API 3',
        },
        {
          token: 'ek2',
          actionName: 'Test API 4',
        },
        {
          token: 'ek3',
          actionName: 'Test API 5',
        },
      ],
    };
    initial.Workbook.GetWorkbookActionListResponse = {
      code: 200,
      message: 'Workbook Action Data Fetched.',
      status: true,
      data: ['URL Reputation', 'IP Reputation', 'File Reputation'],
    };
    initial.PlayBook.GetNewAllPlaybookBlockResponse = {
      code: 200,
      message: 'Playbook Block Data Fetched.',
      status: true,
      data: [
        {
          name: 'y1',
          configStatus: true,
          id: '5me3x1d0o37',
          value: '5me3x1d0o37',
        },
        {
          name: 'y4',
          configStatus: true,
          id: 'yywa0e8ujg',
          value: 'yywa0e8ujg',
        },
        {
          name: 'y5',
          configStatus: true,
          id: 'q08vc2muf28',
          value: 'q08vc2muf28',
        },
      ],
    };
    initial.Workbook.GetSingleWorkbookResponse = {
      code: 200,
      message: 'Workbook Data Fetched.',
      status: true,
      data: {
        token: 'zc542a538-89f6-49a6-8216-a5b5ef5549c2',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        status: 'Published',
        workbookName: 'gthygfhfgh',
        workbookdata: '[{"name":"gfhfg","description":"hgfhgfhgfh","collapseStatus":true,"tasks":[{"name":"gfhgfh","description":"fghgfhgfh","ownerName":"","owner":"Ekasha Admin","actions":[],"playbooks":[],"actionList":[]}]}]',
        updateTime: '2024-07-08T16:19:52Z',
        createdTime: '2024-07-08T16:19:52Z',
        permanent: false,
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'workbook'));
    setUp(actionProps, initial);
  });
  it('Edit Model Content with Valid Data', async () => {
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    const backButton = getById('Admin_Workbook_Back_Btn');
    fireEvent.click(backButton);

    const editButton = getById('Admin_Workbook_Edit_Btn_wb21aa854');
    fireEvent.click(editButton);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const submitButton = getById('Admin_Workbook_Save_Btn');

    const nameInput = getById('Admin_Workbook_Name_Input');
    fireEvent.change(nameInput, { target: { value: 'Test Workbook Update' } });

    fireEvent.click(submitButton);
  });
});
