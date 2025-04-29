import { act } from 'react-dom/test-utils';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import { mountComponent } from '../../../../../../setupTests';
import {
  AddZoneAction, DeleteZoneAction, fakeActionZone, ReadAllZoneAction,
  ReadOneAction, UpdateZoneAction,
} from '../../../../../../apis/administration/zone/zone.action';
import ZoneEkasha from '../../../../../containers/administration/ZoneEkasha';

jest.useFakeTimers();

const actionProps = {
  ReadAllZoneAction,
  DeleteZoneAction,
  AddZoneAction,
  UpdateZoneAction,
  ReadOneAction,
  fakeActionZone,
};

const initialData = {
  Zone: {
    GetAllZoneResponse: {
      code: 200,
      data: {
        content: [
          {
            token: '5b4db51b0ce7',
            zoneName: 'Zone_Test_1',
            zoneStartAddress: '10.2.2.2',
            zoneEndAddres: '10.2.2.5',
            zoneLocation: 'Keshod',
            subnetMask: '22',
            createdTime: '2024-10-04T05:45:42Z',
          },
          {
            token: '51b0ce7',
            zoneName: 'Zone_Test_2',
            zoneStartAddress: '10.3.3.3',
            zoneEndAddres: '10.3.3.5',
            zoneLocation: 'USA',
            subnetMask: '23',
            createdTime: '2024-10-04T01:45:42Z',
          },
        ],
        totalPages: 1,
        totalElements: 2,
        size: 30,
        number: 0,
        numberOfElements: 2,
      },
      message: 'Data fetched.',
      status: true,
    },
    AddZoneResponse: {
      code: 201,
      message: 'Zone info created.',
      status: true,
      data: {
        token: 'r7d34cac1',
        zoneName: 'TEST',
        zoneStartAddress: '10.2.5.6',
        zoneEndAddres: '10.2.5.8',
        zoneLocation: 'KSD',
        subnetMask: '23',
        createdTime: '2024-10-08T16:07:59Z',
      },
      module: 'zoneInfo',
      operation: 'add',
    },
    UpdateZoneResponse: {
      code: 200,
      message: 'Zone info updated.',
      status: true,
      data: {
        token: 'r7d34cac1',
        zoneName: 'TEST_1',
        zoneStartAddress: '10.2.5.6',
        zoneEndAddres: '10.2.5.8',
        zoneLocation: 'KSD',
        subnetMask: '23',
        createdTime: '2024-10-08T16:07:59Z',
      },
      module: 'zoneInfo',
      operation: 'update',
    },
    GetOneZoneResponse: {
      status: false,
      message: 'Data fetched.',
      data: [],
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Zone: {} }) => mountComponent(
  ZoneEkasha, props, initialState, null,
);

describe('Component Rendering - on Create Modal reducer data not received ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create ioc Modal open set check reducer data not received  ', () => {
    const ZoneAddButton = findByTestAtrrFirst(wrapper, 'Administration_Zone_Add_Btn');
    act(() => {
      ZoneAddButton.at(ZoneAddButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on Create Modal Open and create ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    delete initial.Zone.UpdateZoneResponse;
    delete initial.Zone.GetOneZoneResponse;
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create zone Modal open set all value and zoneSubmitButton modal  ', () => {
    const zoneAddButton = findByTestAtrrFirst(wrapper, 'Administration_Zone_Add_Btn');
    act(() => {
      zoneAddButton.at(zoneAddButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Administration_Zone_Create_Update_Modal');
    expect(createModal.length).toBe(1);

    const zoneNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Zone_Name_Input');
    const zoneStartAddressInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Zone_Start_Address_Input');
    const zoneEndAddressInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Zone_End_Address_Input');
    const zoneLocationInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Zone_Location_Input');
    const zoneSubnetMaskInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Zone_Subnet_Mask_Input');
    const zoneSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_Administration_Zone_Submit_Btn');
    jest.advanceTimersByTime(500);
    wrapper = wrapper.update();
    act(() => {
      zoneNameInput.at(1).simulate('change', { target: { value: '' } });
    });
    act(() => {
      zoneSubmitButton.at(zoneSubmitButton.length - 1).simulate('click');
    });
    act(() => {
      zoneNameInput.at(1).simulate('change', { target: { value: 'Test Zone' } });
    });
    act(() => {
      zoneLocationInput.at(1).simulate('change', { target: { value: 'Test Location' } });
    });
    act(() => {
      zoneSubnetMaskInput.at(1).simulate('change', { target: { value: '33' } });
    });
    act(() => {
      zoneStartAddressInput.at(1).simulate('change', { target: { value: '10.2.2.2s' } });
    });
    wrapper = wrapper.update();
    act(() => {
      zoneEndAddressInput.at(1).simulate('change', { target: { value: '10.2.2.5s' } });
    });
    act(() => {
      zoneSubmitButton.at(zoneSubmitButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    act(() => {
      zoneNameInput.at(1).simulate('change', { target: { value: 'Test Zone' } });
    });
    act(() => {
      zoneStartAddressInput.at(1).simulate('change', { target: { value: '10.2.2.2' } });
    });
    act(() => {
      zoneEndAddressInput.at(1).simulate('change', { target: { value: '10.2.2.5' } });
    });
    act(() => {
      zoneLocationInput.at(1).simulate('change', { target: { value: 'Test Location' } });
    });
    act(() => {
      zoneSubnetMaskInput.at(1).simulate('change', { target: { value: '24' } });
    });
    wrapper = wrapper.update();
    act(() => {
      zoneSubmitButton.at(zoneSubmitButton.length - 1).simulate('click');
    });
    act(() => {
      zoneAddButton.at(zoneAddButton.length - 1).props().onClick();
    });
    const closeModal = findByTestAtrrFirst(wrapper,
      'ekasha_model_close_Administration_Zone_Create_Update_Modal');
    expect(closeModal.length).toBe(1);

    act(() => {
      closeModal.props().onClick();
    });
    act(() => {
      zoneAddButton.at(zoneAddButton.length - 1).props().onClick();
    });
    act(() => {
      closeModal.props().onClick();
    });
    wrapper = wrapper.update();
    wrapper.update();
  });
});

describe('Component Rendering - on Edit Modal Open and Update ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Zone.GetOneZoneResponse = {
      status: true,
      message: 'Data fetched.',
      data: {
        token: '51b0ce7',
        zoneName: 'Zone_Test_2',
        zoneStartAddress: '10.3.3.3',
        zoneEndAddres: '10.3.3.5',
        zoneLocation: 'USA',
        subnetMask: '23',
        createdTime: '2024-10-04T01:45:42Z',
      },
    };
    setPermissions(handlePermission('RW', 'administration', 'zone'));
    wrapper = setUp(actionProps, initial);
  });
  it('Create zone Modal open set all value and zoneSubmitButton modal  ', () => {
    const zoneEditButton = findByTestAtrrFirst(wrapper, 'Administration_Zone_Edit_Btn_51b0ce7');
    act(() => {
      zoneEditButton.at(zoneEditButton.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Administration_Zone_Create_Update_Modal');
    expect(createModal.length).toBe(1);
    const zoneNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Administration_Zone_Name_Input');
    const zoneSubmitButton = findByTestAtrr(wrapper, 'ekasha_button_Administration_Zone_Submit_Btn');
    wrapper = wrapper.update();
    act(() => {
      zoneNameInput.at(1).simulate('change', { target: { value: 'Test Zone 123' } });
    });
    act(() => {
      zoneSubmitButton.at(zoneSubmitButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });
});
