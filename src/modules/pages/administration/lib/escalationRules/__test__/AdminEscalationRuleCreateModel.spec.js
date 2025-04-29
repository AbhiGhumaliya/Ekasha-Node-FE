import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent, selectOption } from '../../../../../../helpers/lib/RTL';
import {
  changeStatusAction, getSingleRuleAction, deleteEscalateRulesAction,
  getEscalateRulesAction, addEscalateRulesAction,
  updateEscalateRulesAction, fakeEscalateRulesAction,
} from '../../../../../../apis/administration/escalationRules/escalationRules.action';
import { fakeActionAssets, GetOwnerAction } from '../../../../../../apis/administration/assets/assets.action';
import { fakeActionRole, rolesListAction } from '../../../../../../apis/administration/roles/role.actions';
import EscalationRulesEkasha from '../../../../../containers/administration/EscalationRulesEkasha';

jest.useFakeTimers();

const actionProps = {
  changeStatusAction,
  getSingleRuleAction,
  deleteEscalateRulesAction,
  getEscalateRulesAction,
  GetOwnerAction,
  fakeActionAssets,
  addEscalateRulesAction,
  updateEscalateRulesAction,
  fakeActionRole,
  rolesListAction,
  fakeEscalateRulesAction,
};

const initialData = {
  EscalateRules: {
    GetEscalateRulesResponse: {
      code: 200,
      message: 'Rule data featched.',
      status: true,
      data: {
        content: [
          {
            token: 'of21aa854',
            ownerName: 'Umesh Karkar',
            createdTime: '2024-11-16T17:05:45Z',
            severity: 'Critical',
            waitingTime: 1,
            status: true,
          },
          {
            token: 'r82a91821-7116-48e0-a28c-b5f72985cdcf',
            ownerName: 'Hiral Poshiya',
            createdTime: '2024-10-22T16:57:23Z',
            severity: 'Low',
            waitingTime: 1,
            status: true,
          },
        ],
        totalElements: 2,
        totalPages: 1,
        size: 30,
        number: 0,
        numberOfElements: 2,
      },
    },
    AddEscalateRulesResponse: {
      code: 200,
      message: 'Rule added.',
      status: true,
      data: {
        token: 'y00aee412-aeb9-46b7-97e0-492b6eee1429',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        createdTime: '2024-11-26T14:55:04Z',
        severity: 'High',
        team: [
          {
            name: 'Abhi Ghumaliya',
            token: 'x9290e1a2-2ab7-4cff-a09b-1a1cfed0956c',
            type: 'user',
          },
        ],
        waitingTime: 10,
        status: true,
      },
    },
  },
  Assets: {
    GetOwnerResponse: {
      code: 200,
      message: 'User data fetched.',
      status: true,
      data: [
        {
          name: 'Umesh Karkar',
          value: 'e13a06d0a-b714-4968-a0b2-8904b659b36b',
        },
        {
          name: 'Abhi Ghumaliya',
          value: 'm2b5180a6-b718-45bd-9b04-d120b099039b',
        },
        {
          name: 'Yogita Sadaniya',
          value: 'f1fa06f14-540b-4ba2-aee0-b1b1e7095c69',
        },
        {
          name: 'Hiral Poshiya',
          value: 'odc25f874-3c06-4bff-b7f6-405b1615a374',
        },
      ],
    },
  },
  Role: {
    RoleListResponse: {
      code: 200,
      message: 'Role data fetched.',
      status: true,
      data: [
        {
          name: 'SOC Manager',
          token: 'aas58e394bc-362b-4dda-b7435-54fb8qwg5b65',
        },
        {
          name: 'Tier 1',
          token: 'pl30fe97a9-dedc-4167-8670-c9fe809934df',
        },
        {
          name: 'CISO',
          token: 'hjk67394bc-362b-4dda-b7435-54fb8qwg5b6o',
        },
        {
          name: 'Administrator',
          token: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
        },
      ],
    },
  },
};

const setUp = (props = {}, initialState = {
  EscalateRules: {},
  Assets: {},
  Role: {},
}) => renderComponent(
  EscalationRulesEkasha, props, initialState, null,
);

describe('Component Rendering - Open Create Model and Close Model', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.EscalateRules.getSingleRuleResponse = {
      code: 200,
      message: 'Escalate rule Featched.',
      status: false,
    };
    initial.EscalateRules.updateEscalateRulesResponse = {
      code: 200,
      message: 'Rule updated.',
      status: true,
    };

    setPermissions(handlePermission('RW', 'administration', 'escalateRule'));
    setUp(actionProps, initial);
  });

  it('Should Close Create Model', async () => {
    const addButton = getById('Admin_Escalation_Rule_Add_Btn');
    fireEvent.click(addButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('New Escalation Rules')).toBeInTheDocument();

    const closeModal = getById('ekasha_model_close_Admin_new_Escalation_Rules_Modal');
    fireEvent.click(closeModal);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByText('New Escalation Rules')).not.toBeInTheDocument();
  });
});

describe('Component Rendering - Render with All Permission and Open Create Model', () => {
  const selectOption1 = (id, option) => {
    fireEvent.mouseDown(getById(id));
    const options = screen.getAllByText(option);
    fireEvent.click(options[1]);
  };
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.EscalateRules.AddEscalateRulesResponse;
    setPermissions(handlePermission('RW', 'administration', 'escalateRule'));
    setUp(actionProps, initial);
  });

  it('Should Add Button Click and open Create Model open', async () => {
    const addButton = getById('Admin_Escalation_Rule_Add_Btn');
    fireEvent.click(addButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('New Escalation Rules')).toBeInTheDocument();

    const submitButton = getById('Admin_Escalation_Rule_Submit_Btn');
    const waitingTimeInput = getById('Admin_Escalation_Rule_Waiting_Time_Input');

    selectOption1('Admin_Escalation_Rule_Severity_Select', 'High');
    fireEvent.click(submitButton);

    const waitingTimeInput1 = getById('Admin_Escalation_Rule_Waiting_Time_Input');
    fireEvent.change(waitingTimeInput1, { target: { value: 0 } });
    fireEvent.click(submitButton);

    selectOption('Admin_Escalation_Rule_Create_Team_Select', 'Yogita Sadaniya');
    selectOption('Admin_Escalation_Rule_Create_Team_Select', 'Abhi Ghumaliya');

    const closeIcon = getById('Admin_Escalation_Rule_Remove_Chip_Icon_1');
    fireEvent.click(closeIcon);

    fireEvent.change(waitingTimeInput, { target: { value: 10 } });

    fireEvent.click(submitButton);
  });
});

describe('Component Rendering - Render with All Permission and Open Edit Model', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.EscalateRules.getSingleRuleResponse = {
      code: 200,
      message: 'Escalate rule Featched.',
      status: true,
      data: {
        token: 'of21aa854',
        ownerName: 'Umesh Karkar',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        createdTime: '2024-10-22T16:57:23Z',
        severity: 'High',
        team: [
          {
            name: 'Administrator',
            token: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
            type: 'role',
          },
        ],
        waitingTime: 1,
        status: true,
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'escalateRule'));
    setUp(actionProps, initial);
  });

  it('Should Open Edit Model', async () => {
    const editButton = getById('Admin_Escalation_Rule_Edit_btn_of21aa854');
    fireEvent.click(editButton);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Edit Escalation Rules')).toBeInTheDocument();

    const waitingTimeInput = getById('Admin_Escalation_Rule_Waiting_Time_Input');
    fireEvent.change(waitingTimeInput, { target: { value: 15 } });

    const submitButton = getById('Admin_Escalation_Rule_Submit_Btn');
    fireEvent.click(submitButton);
  });
});
