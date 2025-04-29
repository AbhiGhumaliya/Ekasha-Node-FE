import { act } from 'react-dom/test-utils';
import {
  findByTestAtrr, findByTestAtrrFirst, handlePermission,
} from '../../../../../../helpers/lib/testUtils';
import AssetsEkasha from '../../../../../containers/administration/AssetsEkasha';
import { setPermissions } from '../../../../../../helpers/lib/StorageHandlers';
import {
  changeAssetsStatusAction, deleteAssetsAction, fakeActionAssets, getAllAssetsAction,
  getSingleAssetAction, insertAssetsAction, InsertAssetsFileAction, updateAssetsAction,
} from '../../../../../../apis/administration/assets/assets.action';
import { getCountryCodeAction, fakeActionUser } from '../../../../../../apis/administration/users/user.actions';
import { mountComponent } from '../../../../../../setupTests';

const actionProps = {
  getAllAssetsAction,
  fakeActionAssets,
  changeAssetsStatusAction,
  deleteAssetsAction,
  insertAssetsAction,
  getSingleAssetAction,
  updateAssetsAction,
  InsertAssetsFileAction,
  fakeActionUser,
  getCountryCodeAction,
};

const setUp = (props = {}, initialState = { Assets: {} }) => mountComponent(
  AssetsEkasha, props, initialState, null,
);

describe('Component Rendering - Render with only All permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
              {},
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 2,
            totalPages: 1,
            size: 30,
            number: 0,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        DeleteAssetsResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        InsertAssetsResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
        UpdateAssetsResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
      },
      User: {
        CountryCodeGetAllResponse: {
          status: true,
          message: 'Get all country code details',
          data: [{
            countryflagName: 'unitedStatesVirginIslands',
            countryCode: '1 (340)',
            countryflag: 'iVBORw0KGg',
            countryName: 'United States Virgin Islands',
            token: '1',
          }],
          code: 200,
        },
      },
      IncAssets: {},
    };
    setPermissions(handlePermission('RW', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only All permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_add_Assets_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('edit button only All permission ', () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Admin_edit_Assets_Btn_g1205a406');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on Create Modal Open and create', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
              {},
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 2,
            totalPages: 1,
            size: 30,
            number: 0,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        DeleteAssetsResponse: {
          status: true,
          message: 'no data',
          data: {},
          code: 200,
        },
        InsertAssetsResponse: {
          status: true,
          message: 'no data',
          data: {
            token: 'xd16fb647',
            updateBy: 'Ekasha Admin',
            createdBy: 'Ekasha Admin',
            createdTime: '2024-09-19T12:45:52Z',
            updatedTime: '2024-09-19T12:45:52Z',
            hostName: 'ss',
            locationName: null,
            alternateInterface: null,
            ip: '10.5.6.9',
            assetCriticality: null,
            description: null,
            subnetMask: '22',
            assetOwner: null,
            ownerDesignation: null,
            ownerEmail: null,
            notificationGroup: null,
            ownerNumber: null,
            ownerDepartment: null,
            staticAddressing: null,
            macAddress: null,
            categories: null,
            assetStatus: true,
            countryToken: null,
            customerID: null,
            delete: false,
          },
          code: 200,
        },
        GetSingleAssetsResponse: {
          status: false,
          message: 'Data fetched.',
          data: {},
          code: 200,
        },
        UpdateAssetsResponse: {
          status: true,
          message: 'no data',
          data: [],
          code: 200,
        },
      },
      User: {
        CountryCodeGetAllResponse: {
          status: true,
          message: 'Get all country code details',
          data: [{
            countryflagName: 'unitedStatesVirginIslands',
            countryCode: '1 (340)',
            countryflag: 'iVBORw0KGg',
            countryName: 'United States Virgin Islands',
            token: '1',
          }],
          code: 200,
        },
      },
      IncAssets: {},
    };
    jest.useFakeTimers();
    setPermissions(handlePermission('RW', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });

  it('Create Assets Modal open set all value and submit modal  ', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Assets_Wrapper');
    expect(h.length).toBe(1);
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_add_Assets_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Create_Assets_Modal');
    expect(createModal.length).toBe(1);
    const addManuallyBTN = findByTestAtrr(wrapper, 'assets_add_manually');
    act(() => {
      addManuallyBTN.at(addManuallyBTN.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper.update();
    const submit = findByTestAtrr(wrapper, 'ekasha_button_admin_Asset_create_button');
    const assetsHostInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_hostName_Input');
    const assetIPInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_ip_Input');
    const subnetMaskInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_subnetMask_Input');
    const assetDescriptionInput = findByTestAtrr(wrapper, 'ekasha_normalInput_textArea_Admin_Assets_description_Textarea');
    const locationInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_locationName_Input');
    const macAddressInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_macaddress_Input');
    const staticAddressInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_staticAddress_Input');
    const categoriesInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_categories_Input');
    const alternativeInterfaceInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_alternateInterface_Input');
    const assetCriticalitySelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_Admin_Assets_assetCriticality_Select');
    const ownerInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_owner_Input');
    const ownerEmailInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_ownerEmail_Input');
    const ownerDesignationInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_ownerDesignation_Input');
    const ownerNumberInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_ownerNumber_Input');
    const ownerDepartmentInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_ownerDepartment_Input');
    const notificationGroupInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_notificationGroup_Input');
    const countryCodeSelect = findByTestAtrrFirst(wrapper, 'ekasha_Image_Select_create_Asset_country_code_Select');
    const assetStatusRadio = findByTestAtrrFirst(wrapper, 'ekasha_radioButton_Admin_Assets_assetStatus_Radio');

    act(() => {
      assetsHostInput.at(assetsHostInput.length - 1).simulate('change', { target: { value: 'jkl' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    act(() => {
      assetIPInput.at(assetIPInput.length - 1).simulate('change', { target: { value: '10.2.5.7' } });
      subnetMaskInput.at(subnetMaskInput.length - 1).simulate('change', { target: { value: '23' } });
      assetDescriptionInput.at(assetDescriptionInput.length - 1).simulate('change', { target: { value: 'abc' } });
      locationInput.at(locationInput.length - 1).simulate('change', { target: { value: 'xyz' } });
      macAddressInput.at(macAddressInput.length - 1).simulate('change', { target: { value: '00:25:96:FF:FE:12' } });
      staticAddressInput.at(staticAddressInput.length - 1).simulate('change', { target: { value: '10.2.5.7' } });
      categoriesInput.at(categoriesInput.length - 1).simulate('change', { target: { value: 'Traffic sent' } });
      alternativeInterfaceInput.at(alternativeInterfaceInput.length - 1).simulate('change', { target: { value: '10.1.1.153' } });
      assetCriticalitySelect.props().onChange('high');
      ownerInput.at(ownerInput.length - 1).simulate('change', { target: { value: 'abc' } });
      ownerEmailInput.at(ownerEmailInput.length - 1).simulate('change', { target: { value: 'abc@gmail.com' } });
      ownerDesignationInput.at(ownerDesignationInput.length - 1).simulate('change', { target: { value: 'abc' } });
      ownerNumberInput.at(ownerNumberInput.length - 1).simulate('change', { target: { value: '' } });
      ownerDepartmentInput.at(ownerDepartmentInput.length - 1).simulate('change', { target: { value: 'abc' } });
      notificationGroupInput.at(notificationGroupInput.length - 1).simulate('change', { target: { value: 'cyber' } });
      countryCodeSelect.props().onChange('91');
      assetStatusRadio.at(assetStatusRadio.length - 1).props()
        .onChange({ target: { value: true } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      ownerNumberInput.at(ownerNumberInput.length - 1).simulate('change', { target: { value: '01234567' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      ownerNumberInput.at(ownerNumberInput.length - 1).simulate('change', { target: { value: '0123456789' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Admin_Create_Assets_Modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });
  it('Create Assets Modal open set all value and submit modal with File Upload', () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Assets_Wrapper');
    expect(h.length).toBe(1);
    const addBtn = findByTestAtrrFirst(wrapper, 'Admin_add_Assets_Btn');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper = wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Create_Assets_Modal');
    expect(createModal.length).toBe(1);
    const ImportCSVButton = findByTestAtrr(wrapper, 'ekasha_button_Admin_Assets_Import_Csv_File');
    act(() => {
      ImportCSVButton.at(ImportCSVButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    const backButton = findByTestAtrr(wrapper, 'admin_asset_back_Icon');
    act(() => {
      backButton.at(backButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    const ImportCSVButton2 = findByTestAtrr(wrapper, 'ekasha_button_Admin_Assets_Import_Csv_File');
    act(() => {
      ImportCSVButton2.at(ImportCSVButton2.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    const downloadCSVButton = findByTestAtrr(wrapper, 'Admin_Assets_Download_csv_File');
    act(() => {
      downloadCSVButton.at(downloadCSVButton.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
    const assetfileUploadComponent = findByTestAtrr(wrapper, 'Admin_Assets_file_import_csv_drop');
    act(() => {
      const files = {
        fileList: [],
      };
      assetfileUploadComponent.at(1).props().onChange(files);
    });
    wrapper = wrapper.update();
    const submit = findByTestAtrr(wrapper, 'ekasha_button_admin_Asset_create_button');
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      const files = {
        fileList: [{
          size: 235,
          name: 'AssetFormate (2).csv',
        }],
      };
      assetfileUploadComponent.at(1).props().onChange(files);
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
  });
  afterEach(() => {
    jest.useRealTimers(); // Add this line to clean up fake timers after each test
  });
});

describe('Component Rendering - on Edit Modal Open and Update', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Assets: {
        GetAllAssetsResponse: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: {
            content: [
              {
                token: 'g1205a406',
                updateBy: 'Ekasha Admin',
                createdBy: 'Ekasha Admin',
                createdTime: '2024-09-14T10:30:22Z',
                updatedTime: '2024-09-14T10:30:22Z',
                hostName: 'a',
                locationName: null,
                alternateInterface: null,
                ip: '10.2.3.3',
                assetCriticality: null,
                description: null,
                subnetMask: '21',
                assetOwner: null,
                ownerDesignation: null,
                ownerEmail: null,
                notificationGroup: null,
                ownerNumber: null,
                ownerDepartment: null,
                staticAddressing: null,
                macAddress: null,
                categories: null,
                assetStatus: true,
                countryToken: null,
                customerID: null,
                delete: false,
              },
              {},
            ],
            pageable: {
              sort: {
                unsorted: false,
                sorted: true,
                empty: false,
              },
              offset: 0,
              pageSize: 30,
              pageNumber: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 2,
            totalPages: 1,
            size: 30,
            number: 0,
            sort: {
              unsorted: false,
              sorted: true,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        GetSingleAssetsResponse: {
          status: true,
          message: 'Data fetched.',
          data: {
            token: 'g1205a406',
            updateBy: 'Ekasha Admin',
            createdBy: 'Ekasha Admin',
            createdTime: '2024-09-14T10:30:22Z',
            updatedTime: '2024-09-14T10:30:22Z',
            hostName: 'a',
            locationName: null,
            alternateInterface: null,
            ip: '10.2.3.3',
            assetCriticality: null,
            description: null,
            subnetMask: '21',
            assetOwner: null,
            ownerDesignation: null,
            ownerEmail: null,
            notificationGroup: null,
            ownerNumber: null,
            ownerDepartment: null,
            staticAddressing: null,
            macAddress: null,
            categories: null,
            assetStatus: true,
            countryToken: null,
            customerID: null,
            delete: false,
          },
          code: 200,
        },
        UpdateAssetsResponse: {
          status: true,
          message: 'Asset updated.',
          data: {
            token: 'g1205a406',
            updateBy: 'Ekasha Admin',
            createdBy: 'Ekasha Admin',
            createdTime: '2024-09-14T10:30:22Z',
            updatedTime: '2024-09-14T10:30:22Z',
            hostName: 'a',
            locationName: null,
            alternateInterface: null,
            ip: '10.2.8.8',
            assetCriticality: null,
            description: null,
            subnetMask: '21',
            assetOwner: null,
            ownerDesignation: null,
            ownerEmail: null,
            notificationGroup: null,
            ownerNumber: null,
            ownerDepartment: null,
            staticAddressing: null,
            macAddress: null,
            categories: null,
            assetStatus: true,
            countryToken: null,
            customerID: null,
            delete: false,
          },
          code: 200,
        },
      },
      User: {
        CountryCodeGetAllResponse: {
          status: true,
          message: 'Get all country code details',
          data: [{
            countryflagName: 'unitedStatesVirginIslands',
            countryCode: '1 (340)',
            countryflag: 'iVBORw0KGg',
            countryName: 'United States Virgin Islands',
            token: '1',
          }],
          code: 200,
        },
      },
      IncAssets: {},
    };
    jest.useFakeTimers();
    setPermissions(handlePermission('RW', 'administration', 'assets'));
    wrapper = setUp(actionProps, initial);
  });

  it('Edit Assets Modal open set all value and update modal  ', async () => {
    const h = findByTestAtrrFirst(wrapper, 'Administration_Assets_Wrapper');
    expect(h.length).toBe(1);

    const editBtn = findByTestAtrrFirst(wrapper, 'Admin_edit_Assets_Btn_g1205a406');
    // act(() => {
    //   editBtn.at(editBtn.length - 1).props().onClick();
    // });
    // wrapper = wrapper.update();

    await act(async () => {
      editBtn.simulate('click');
    });
    wrapper.update();

    const editModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_Admin_Create_Assets_Modal');
    expect(editModal.length).toBe(1);
    wrapper.update();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper.update();

    const submit = findByTestAtrr(wrapper, 'ekasha_button_admin_Asset_create_button');
    const assetIPInput = findByTestAtrr(wrapper, 'ekasha_normalInput_Admin_Assets_ip_Input');

    act(() => {
      assetIPInput.at(assetIPInput.length - 1).simulate('change', { target: { value: '10.2.8.8' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();

    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_Admin_Create_Assets_Modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.at(closeModal.length - 1).simulate('click');
    });
    wrapper = wrapper.update();
  });

  afterEach(() => {
    jest.useRealTimers(); // Add this line to clean up fake timers after each test
  });
});
