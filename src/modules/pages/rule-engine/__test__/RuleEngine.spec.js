import { act } from 'react-dom/test-utils';
import {
  getRuleDataAction, fakeActionRuleAction, ruleStatusAction, ruleUpdateAction,
  ruleDeleteAction, ruleInsertAction, updatePosition, ruleOneAction,
} from '../../../../apis/rule-engine/ruleEngine.actions';
import { GetOwnerAction, fakeActionAssets } from '../../../../apis/administration/assets/assets.action';
import {
  fakeActionIntegration, getAllFieldsAction, getAllIntegrationRule,
} from '../../../../apis/administration/integration/integration.action';
import { fakeIncidentAction } from '../../../../apis/incidents/actions';
import RuleEngineEkasha from '../../../containers/ruleEngine';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { findByTestAtrr, findByTestAtrrFirst, handlePermission } from '../../../../helpers/lib/testUtils';
import { stompClient } from '../../../../helpers/lib/SocketHandlers';
import { mountComponent } from '../../../../setupTests';

const actionProps = {
  getRuleDataAction,
  fakeActionRuleAction,
  ruleStatusAction,
  ruleDeleteAction,
  GetOwnerAction,
  fakeActionAssets,
  fakeActionIntegration,
  getAllFieldsAction,
  fakeIncidentAction,
  ruleInsertAction,
  updatePosition,
  ruleOneAction,
  ruleUpdateAction,
  getAllIntegrationRule,
};

jest.useFakeTimers();

function doAsync(c) {
  setTimeout(() => {
    c(true);
  }, 2000);
}
const setUp = (props = {}, initialState = {
  RuleEngines: {},
  Assets: {},
  Integration: {},
}) => mountComponent(
  RuleEngineEkasha, props, initialState, { customerID: '12345' },
);

// const setUp = (props = {}, initialState = { RuleEngines: {}, Assets: {}, Integration: {} }) => {
//   const contextValue = { customerID: 'Tenant_1' };
//   const store = mockStore(initialState);
//   const component = mount(
//     <Router>
//       <Provider store={store}>
//         <TimeFilContext.Provider value={contextValue}>
//           <RuleEngineEkasha {...props} />
//         </TimeFilContext.Provider>
//       </Provider>
//     </Router>,
//   );
//   component.debug();
//   return component;
// };

describe('Component Rendering - on Reducer False Response', () => {
  beforeEach(() => {
    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: true,
          data: {
            content: [{
              token: 'default_rule_token',
              incidentType: null,
              threatInformation: '{}',
              ruleName: 'Ekasha - Default Rule',
              description: 'This is default rule created by ekasha system',
              tags: null,
              cyberkillchainstage: null,
              aggFields: 'incidentName,sourceAddress,destinationAddress,sourcePort,destinationPort',
              aggtime: '1-h',
              source: null,
              assignTo: null,
              impact: null,
              dataClassification: null,
              dataType: null,
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-01-23T10:53:59Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 1,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: true,
            }, {
              token: 'rule_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: 'Test Rule',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'p53e38de9-b124-4e4a-aeb9-e32012d8cdee',
              assignTo: 'n48342b13-3743-42df-ab49-1e44e87e49e7',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-18T12:29:14Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 2,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalElements: 2,
            totalPages: 1,
            last: true,
            size: 30,
            number: 0,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        RuleEngineStatusResponse: {
          code: 200,
          message: 'Rule status updated.',
          status: false,
          data: {},
          module: 'incidentRule',
          operation: 'updateStatus',
        },
        RuleEngineDeleteResponse: {
          code: 200,
          message: 'Rule deleted.',
          status: false,
          data: [],
          module: 'incidentRule',
          operation: 'delete',
        },
        RuleEngineGetOneResponse: {
          code: 200,
          message: 'Find one incident rule.',
          status: false,
          data: {},
        },
        RuleEnginePositionUpdtResponse: {
          code: 200,
          message: 'Update rule position.',
          status: false,
          data: [],
          module: 'incidentRule',
          operation: 'updatePosition',
        },
      },
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    setUp(actionProps, initial);
  });

  it('Should Failed Response in Reducer', async () => {});
});

describe('Component Rendering - Render with No Permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      RuleEngines: {},
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('NA', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrr(wrapper, 'PermissionRO_Rule_Engine_No_Data');
    expect(h.text()).toBe("You don't have permission to access this page");
  });
});

describe('Component Rendering - Render with All Permission and No Data of Reducer', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      RuleEngines: {},
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render No Permission Page', () => {
    const h = findByTestAtrrFirst(wrapper, 'RuleEngine_Wrapper');
    expect(h.length).toBe(1);
  });
});

describe('Component Rendering - Render No Data And Create Button with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: true,
          data: {
            content: [],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalElements: 0,
            totalPages: 0,
            last: true,
            size: 30,
            number: 0,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 0,
            first: true,
            empty: false,
          },
        },
      },
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('RO', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('Nodata only read permission ', () => {
    const noDataTable = findByTestAtrrFirst(wrapper, 'Rule_Engine_No_Data_in_Table');
    expect(noDataTable.length).toBe(1);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Add_Button_Icon');
    act(() => {
      addBtn.at(addBtn.length - 1).simulate('click');
    });
  });
});

describe('Component Rendering - Render with only read permission', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: true,
          data: {
            content: [{
              token: 'default_rule_token',
              incidentType: null,
              threatInformation: '{}',
              ruleName: 'Ekasha - Default Rule',
              description: 'This is default rule created by ekasha system',
              tags: null,
              cyberkillchainstage: null,
              aggFields: 'incidentName,sourceAddress,destinationAddress,sourcePort,destinationPort',
              aggtime: '1-h',
              source: null,
              assignTo: null,
              impact: null,
              dataClassification: null,
              dataType: null,
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-01-23T10:53:59Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 1,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: true,
            }, {
              token: 'rule_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: 'Test Rule',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'p53e38de9-b124-4e4a-aeb9-e32012d8cdee',
              assignTo: 'n48342b13-3743-42df-ab49-1e44e87e49e7',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-18T12:29:14Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 2,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalElements: 2,
            totalPages: 1,
            last: true,
            size: 30,
            number: 1,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        RuleEngineStatusResponse: {
          code: 200,
          message: 'Rule status updated.',
          status: true,
          data: {},
          module: 'incidentRule',
          operation: 'updateStatus',
        },
        RuleEnginePositionUpdtResponse: {
          code: 200,
          message: 'Update rule position.',
          status: true,
          data: [{
            token: 'default_rule_token',
            incidentType: null,
            threatInformation: '{}',
            ruleName: 'Ekasha - Default Rule',
            description: 'This is default rule created by ekasha system',
            tags: null,
            cyberkillchainstage: null,
            aggFields: 'incidentName,sourceAddress,destinationAddress,sourcePort,destinationPort',
            aggtime: '1-h',
            source: null,
            assignTo: null,
            impact: null,
            dataClassification: null,
            dataType: null,
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            status: true,
            caseSensitive: false,
            createdTime: '2024-01-23T10:53:59Z',
            incidentStatus: 'open',
            groupDuplicate: false,
            position: 2,
            mitreSubTechnique: null,
            mitreSubTechniqueId: null,
            mitreTactic: null,
            mitreTacticId: null,
            mitreTechnique: null,
            mitreTechniqueId: null,
            isDefault: true,
          }, {
            token: 'rule_token',
            incidentType: '',
            threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
            ruleName: 'Test Rule',
            description: '',
            tags: '',
            cyberkillchainstage: '',
            aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
            aggtime: '1-d',
            source: 'p53e38de9-b124-4e4a-aeb9-e32012d8cdee',
            assignTo: 'n48342b13-3743-42df-ab49-1e44e87e49e7',
            impact: '',
            dataClassification: '',
            dataType: '',
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            status: true,
            caseSensitive: false,
            createdTime: '2024-06-18T12:29:14Z',
            incidentStatus: 'open',
            groupDuplicate: false,
            position: 1,
            mitreSubTechnique: null,
            mitreSubTechniqueId: null,
            mitreTactic: null,
            mitreTacticId: null,
            mitreTechnique: null,
            mitreTechniqueId: null,
            isDefault: false,
          }],
          module: 'incidentRule',
          operation: 'updatePosition',
        },
      },
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('RO', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });
  it('edit button only read permission ', () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Edit_rule_token');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('clone button only read permission ', () => {
    const cloneBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Clone_rule_token');
    act(() => {
      cloneBtn.at(cloneBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete button only read permission ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Delete_rule_token');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('Should render Get All Rule and search table only read permission ', () => {
    const ruleTable = findByTestAtrrFirst(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    const searchInput = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_rule_engine_searchBox');
    act(() => {
      searchInput.props().onChange({ target: { value: 'rer' } });
    });
    wrapper.update();
    jest.advanceTimersByTime(300);
    wrapper.update();
    jest.advanceTimersByTime(500);
    const clearSearch = findByTestAtrr(wrapper, 'ekasha_searchInput_clearSearch_rule_engine_searchBox');
    act(() => {
      clearSearch.at(clearSearch.length - 1).simulate('click');
    });
    wrapper.update();
  });
  it('Should Row move only Read permission', () => {
    const ruleTable = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    const statusChnage = findByTestAtrrFirst(wrapper, 'ekasha_toggleWrap_Rule_Engine_Toggle_Switch_Icon');
    act(() => {
      statusChnage.at(statusChnage.length - 1).props().onChange();
    });
    wrapper.update();
    act(() => {
      ruleTable.props().rowSelection.onSelect({
        token: 'default_rule_token',
      });
    });
    wrapper.update();
    const ruleRowUp = findByTestAtrr(wrapper, 'rule_rowUp');
    act(() => {
      ruleRowUp.at(ruleRowUp.length - 1).props().onClick();
    });
    wrapper.update();
    const ruleRowDown = findByTestAtrr(wrapper, 'rull_rowDown');
    act(() => {
      ruleRowDown.at(ruleRowDown.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteAll = findByTestAtrr(wrapper, 'ruleEngine_deleteAllBtn');
    act(() => {
      deleteAll.props().onClick();
    });
    wrapper = wrapper.update();
  });
  it('Should Row Check in Read permission', () => {
    const ruleTable = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    const ruleTableAllCheckbox = findByTestAtrrFirst(wrapper, 'ekasha_checkbox_Table_Header_CheckBox_ekasha_rule_engine_table');
    act(() => {
      ruleTableAllCheckbox.at(ruleTableAllCheckbox.length - 1).props().onChange({
        token: 'rule_token',
      });
    });
    wrapper.update();
    const ruleTableCheckbox = findByTestAtrrFirst(wrapper, 'ekasha_checkbox_rule_Checkbox_rule_token');
    act(() => {
      ruleTableCheckbox.at(ruleTableCheckbox.length - 1).props().onChange({
        token: 'rule_token',
      });
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on delete Rule Model', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: true,
          data: {
            content: [{
              token: 'default_rule_token',
              incidentType: null,
              threatInformation: '{}',
              ruleName: 'Ekasha - Default Rule',
              description: 'This is default rule created by ekasha system',
              tags: null,
              cyberkillchainstage: null,
              aggFields: 'incidentName,sourceAddress,destinationAddress,sourcePort,destinationPort',
              aggtime: '1-h',
              source: null,
              assignTo: null,
              impact: null,
              dataClassification: null,
              dataType: null,
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-01-23T10:53:59Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 1,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: true,
            }, {
              token: 'rule_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: 'Test Rule',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'p53e38de9-b124-4e4a-aeb9-e32012d8cdee',
              assignTo: 'n48342b13-3743-42df-ab49-1e44e87e49e7',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-18T12:29:14Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 2,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }, {}],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalElements: 2,
            totalPages: 1,
            last: true,
            size: 30,
            number: 0,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        RuleEngineDeleteResponse: {
          code: 200,
          message: 'Rule deleted.',
          status: true,
          data: [
            'rule_token',
          ],
          module: 'incidentRule',
          operation: 'delete',
        },
      },
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('delete rule from list', async () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Delete_rule_token');
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
  it('delete rule from open modal', async () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Delete_rule_token');
    await act(async () => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'delete_rule_engine_model');
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onOk();
    });
    act(() => {
      deleteBtn.at(deleteBtn.length - 1).props().onClick();
    });
    act(() => {
      deleteModal.at(deleteModal.length - 1).props().onCancel();
    });
    wrapper = wrapper.update();
  });
});

describe('Component Rendering - on Clone Rule Model', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: true,
          data: {
            content: [{
              token: 'default_rule_token',
              incidentType: null,
              threatInformation: '{}',
              ruleName: 'Ekasha - Default Rule',
              description: 'This is default rule created by ekasha system',
              tags: null,
              cyberkillchainstage: null,
              aggFields: 'incidentName,sourceAddress,destinationAddress,sourcePort,destinationPort',
              aggtime: '1-h',
              source: null,
              assignTo: null,
              impact: null,
              dataClassification: null,
              dataType: null,
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-01-23T10:53:59Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 1,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: true,
            }, {
              token: 'rule_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: '333',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'u2b83751e-93a3-4a68-8e0f-f071e83a3fec',
              assignTo: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-19T12:22:43Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 3,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalElements: 2,
            totalPages: 1,
            last: true,
            size: 30,
            number: 0,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
        RuleEngineGetOneResponse: {
          code: 200,
          message: 'Find one incident rule.',
          status: true,
          data: {
            token: 'rule_token',
            incidentType: '',
            threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
            ruleName: '333',
            description: '',
            tags: '',
            cyberkillchainstage: '',
            aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
            aggtime: '1-d',
            source: 'u2b83751e-93a3-4a68-8e0f-f071e83a3fec',
            assignTo: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            impact: '',
            dataClassification: '',
            dataType: '',
            ownerName: 'Ekasha Admin',
            ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            status: true,
            caseSensitive: false,
            createdTime: '2024-06-19T12:22:43+05:30',
            incidentStatus: 'open',
            groupDuplicate: false,
            position: 3,
            mitreSubTechnique: null,
            mitreSubTechniqueId: null,
            mitreTactic: null,
            mitreTacticId: null,
            mitreTechnique: null,
            mitreTechniqueId: null,
            isDefault: false,
            groupsData: [
              {
                token: 'r1409b3c5-3f94-49e4-a6fa-1f3e133546a4',
                ruleToken: 'u9079b7be-e21b-478f-96f0-7f6b044f8277',
                groupName: 'Group 1',
                position: '1',
                isMust: true,
                groupData: '[{"field":"incidentId","op":"isExist","isMust":true,"position":1,"size":100}]',
              },
            ],
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
              name: 'Ekasha Admin',
              value: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
            },
          ],
        },
      },
      Integration: {
        GetAllIntegrationForRule: {
          code: 200,
          message: 'Data fetched.',
          status: true,
          data: [
            {
              name: '123',
              value: 'u2b83751e-93a3-4a68-8e0f-f071e83a3fec',
            },
          ],
        },
      },
    };
    jest.useFakeTimers();
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('clone rule from list', async () => {
    const cloneBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Clone_rule_token');
    act(() => {
      cloneBtn.at(cloneBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('clone rule from open modal', async () => {
    const cloneBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Clone_rule_token');
    act(() => {
      cloneBtn.at(cloneBtn.length - 1).props().onClick();
    });
    wrapper.update();
    function cloneConfirmCallback() {
      act(() => {
        wrapper.update();
      });
      const cloneModal = findByTestAtrrFirst(wrapper, 'rule_engine_create_modal');
      act(() => {
        expect(cloneModal.length).toBe(1);
      });
      wrapper.update();
      const submitRule = findByTestAtrr(wrapper, 'ekasha_button_submit_rule_btn_Model');
      const RuleNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_create_ruleName_Input');
      act(() => {
        RuleNameInput.at(RuleNameInput.length - 1).simulate('change', { target: { value: '' } });
      });
      wrapper.update();
      act(() => {
        submitRule.at(submitRule.length - 1).props().onClick();
      });
      act(() => {
        jest.advanceTimersByTime(10);
      });
      wrapper.update();
      act(() => {
        RuleNameInput.at(RuleNameInput.length - 1).simulate('change', { target: { value: '3213213214' } });
      });
      wrapper.update();
      act(() => {
        submitRule.at(submitRule.length - 1).props().onClick();
      });
      act(() => {
        jest.advanceTimersByTime(10);
      });
      wrapper.update();
    }
    act(() => {
      doAsync(cloneConfirmCallback);
      jest.runOnlyPendingTimers();
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });
});

describe('Component Rendering - on Table Row Select or Deselect or Position Update of Row', () => {
  let wrapper;
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

  beforeEach(() => {
    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: true,
          data: {
            content: [{
              token: 'default_rule_token',
              incidentType: null,
              threatInformation: '{}',
              ruleName: 'Ekasha - Default Rule',
              description: 'This is default rule created by ekasha system',
              tags: null,
              cyberkillchainstage: null,
              aggFields: 'incidentName,sourceAddress,destinationAddress,sourcePort,destinationPort',
              aggtime: '1-h',
              source: null,
              assignTo: null,
              impact: null,
              dataClassification: null,
              dataType: null,
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-01-23T10:53:59Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 1,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: true,
            }, {
              token: 'rule_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: '333',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'u2b83751e-93a3-4a68-8e0f-f071e83a3fec',
              assignTo: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-19T12:22:43Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 2,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }, {
              token: 'rule_second_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: '22',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'p53e38de9-b124-4e4a-aeb9-e32012d8cdee',
              assignTo: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-20T16:14:04Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 3,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalElements: 3,
            totalPages: 2,
            last: true,
            size: 30,
            number: 0,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
      },
      Assets: {},
      Integration: {},
    };
    jest.useFakeTimers();
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });
  it('Should render Get All Rule and show table', () => {
    const ruleTable = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    const statusChnage = findByTestAtrrFirst(wrapper, 'ekasha_toggleWrap_Rule_Engine_Toggle_Switch_Icon');
    act(() => {
      statusChnage.at(statusChnage.length - 1).props().onChange();
    });
    wrapper.update();
    act(() => {
      ruleTable.props().nextPage();
    });
    wrapper.update();
    act(() => {
      ruleTable.props().rowSelection.onSelectAll(true, [{
        token: 'default_rule_token',
      },
      {
        token: 'rule_token',
      },
      {
        token: 'rule_second_token',
      },
      ]);
    });
    act(() => {
      ruleTable.props().rowSelection.onSelectAll(false, [{
        token: 'default_rule_token',
      },
      {
        token: 'rule_token',
      },
      {
        token: 'rule_second_token',
      },
      ]);
    });
    const defaultRuleTable = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    act(() => {
      defaultRuleTable.props().rowSelection.onSelect({
        token: 'default_rule_token',
      });
    });
    wrapper.update();
    const deleteAll = findByTestAtrr(wrapper, 'ruleEngine_deleteAllBtn');
    act(() => {
      deleteAll.props().onClick();
    });
    wrapper.update();
    const defaultRuleTable2 = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    act(() => {
      defaultRuleTable2.props().rowSelection.onSelect({
        token: 'default_rule_token',
      });
    });
    wrapper.update();
    const ruleTable2 = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    act(() => {
      ruleTable2.props().rowSelection.onSelect({
        token: 'rule_token',
      });
    });
    wrapper.update();
    const deleteAll2 = findByTestAtrr(wrapper, 'ruleEngine_deleteAllBtn');
    act(() => {
      deleteAll2.props().onClick();
    });
    const ruleTable3 = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    act(() => {
      ruleTable3.props().rowSelection.onSelect({
        token: 'rule_second_token',
      });
    });
    wrapper.update();
    const ruleTable4 = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    act(() => {
      ruleTable4.props().rowSelection.onSelect({
        token: 'rule_second_token',
      });
    });
    wrapper.update();
    const selectAll = findByTestAtrr(wrapper, 'ruleEngine_selectAllBtn');
    act(() => {
      selectAll.props().onClick('selectAll');
    });
    const deselectAll = findByTestAtrr(wrapper, 'ruleEngine_deselectAllBtn');
    act(() => {
      deselectAll.props().onClick('deselectAll');
    });
    wrapper = wrapper.update();
  });

  it('Should Row move and Reset btn Click', () => {
    const ruleTable = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    act(() => {
      ruleTable.props().rowSelection.onSelect({
        token: 'rule_token',
      });
    });
    wrapper.update();
    const ruleRowUp = findByTestAtrr(wrapper, 'rule_rowUp');
    act(() => {
      ruleRowUp.at(ruleRowUp.length - 1).props().onClick();
    });
    wrapper.update();
    const ruleRowDown = findByTestAtrr(wrapper, 'rull_rowDown');
    act(() => {
      ruleRowDown.at(ruleRowDown.length - 1).props().onClick();
    });
    wrapper.update();
    const ruleTable2 = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    act(() => {
      ruleTable2.props().rowSelection.onSelect({
        token: 'rule_token',
      });
    });
    wrapper.update();
    const ruleTable3 = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    act(() => {
      ruleTable3.props().rowSelection.onSelect({
        token: 'rule_token',
      });
    });
    wrapper.update();
    const rulePositionResetBTN = findByTestAtrr(wrapper, 'ekasha_button_rule_position_reset_BTN');
    act(() => {
      rulePositionResetBTN.at(rulePositionResetBTN.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should Row move and Update Position btn Click', () => {
    const ruleTable = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    act(() => {
      ruleTable.props().rowSelection.onSelect({
        token: 'rule_token',
      });
    });
    wrapper.update();
    const ruleRowUp = findByTestAtrr(wrapper, 'rule_rowUp');
    act(() => {
      ruleRowUp.at(ruleRowUp.length - 1).props().onClick();
    });
    wrapper.update();
    const rulePositionSaveBTN = findByTestAtrr(wrapper, 'ekasha_button_rule_position_update_BTN');
    act(() => {
      rulePositionSaveBTN.at(rulePositionSaveBTN.length - 1).props().onClick();
    });
    wrapper.update();
  });

  it('Should Open Position Update Model.', () => {
    const ruleTable = findByTestAtrr(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    act(() => {
      ruleTable.props().rowSelection.onSelect({
        token: 'rule_token',
      });
    });
    wrapper.update();
    const ruleRowUp = findByTestAtrr(wrapper, 'rule_rowUp');
    act(() => {
      ruleRowUp.at(ruleRowUp.length - 1).props().onClick();
    });
    wrapper.update();
    const rulePositionSaveBTN = findByTestAtrr(wrapper, 'ekasha_button_rule_position_update_BTN');
    act(() => {
      rulePositionSaveBTN.at(rulePositionSaveBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const updateModal = findByTestAtrrFirst(wrapper, 'update_position_rule_engine_model');
    act(() => {
      expect(updateModal.length).toBe(1);
    });
    wrapper.update();
    act(() => {
      updateModal.props().onOk();
    });
    wrapper.update();
    act(() => {
      updateModal.props().onCancel();
    });
    wrapper.update();
    // act(() => {
    //   doAsync(updateConfirmCallback);
    //   jest.runOnlyPendingTimers();
    // });
  });
  afterAll(() => {
    jest.useRealTimers();
    wrapper.unmount();
  });
});

describe('Component Rendering - with Socket Data Handler', () => {
  let wrapper;
  let mockSubscribe;

  beforeEach(() => {
    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: true,
          data: {
            content: [{
              token: 'default_rule_token',
              incidentType: null,
              threatInformation: '{}',
              ruleName: 'Ekasha - Default Rule',
              description: 'This is default rule created by ekasha system',
              tags: null,
              cyberkillchainstage: null,
              aggFields: 'incidentName,sourceAddress,destinationAddress,sourcePort,destinationPort',
              aggtime: '1-h',
              source: null,
              assignTo: null,
              impact: null,
              dataClassification: null,
              dataType: null,
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-01-23T10:53:59Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 1,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: true,
            }, {
              token: 'rule_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: '333',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'u2b83751e-93a3-4a68-8e0f-f071e83a3fec',
              assignTo: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-19T12:22:43Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 2,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }, {
              token: 'rule_second_token',
              incidentType: '',
              threatInformation: '{"attackMachanism":"","threatDesc":"","threatType":"","threatName":"","attackAgent":""}',
              ruleName: '22',
              description: '',
              tags: '',
              cyberkillchainstage: '',
              aggFields: 'sourceAddress,sourcePort,destinationAddress,incidentName,destinationPort',
              aggtime: '1-d',
              source: 'p53e38de9-b124-4e4a-aeb9-e32012d8cdee',
              assignTo: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              impact: '',
              dataClassification: '',
              dataType: '',
              ownerName: 'Ekasha Admin',
              ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              caseSensitive: false,
              createdTime: '2024-06-20T16:14:04Z',
              incidentStatus: 'open',
              groupDuplicate: false,
              position: 3,
              mitreSubTechnique: null,
              mitreSubTechniqueId: null,
              mitreTactic: null,
              mitreTacticId: null,
              mitreTechnique: null,
              mitreTechniqueId: null,
              isDefault: false,
            }],
            pageable: {
              sort: {
                sorted: true,
                unsorted: false,
                empty: false,
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 30,
              paged: true,
              unpaged: false,
            },
            totalElements: 3,
            totalPages: 2,
            last: true,
            size: 30,
            number: 0,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false,
            },
            numberOfElements: 2,
            first: true,
            empty: false,
          },
        },
      },
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should subscribe to the topic on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    wrapper.unmount();
    expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
  });

  it('should not subscribe if stompClient is not connected', () => {
    jest.clearAllMocks();
    stompClient.connected = false;
    expect(stompClient.subscribe).not.toHaveBeenCalled();
  });

  it('should handle All operation correctly', () => {
    const ruleTable = findByTestAtrrFirst(wrapper, 'ekasha_rule_engine_table');
    expect(ruleTable.length).toBe(1);
    act(() => {
      ruleTable.props().rowSelection.onSelect({
        token: 'rule_second_token',
      });
    });
    wrapper.update();
    const socketFackData = [{
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'add',
        status: true,
        data: { token: '1', ruleName: 'Rule 1' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'add',
        status: true,
        data: { token: '1', ruleName: 'Rule 11' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'updatePosition',
        status: true,
        data: [
          { token: '1', position: '1' },
          { token: '2', position: '2' }],
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'update',
        status: true,
        data: { token: '1', ruleName: 'Rule 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'update',
        status: true,
        data: { token: '11', ruleName: 'Rule 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: '',
        status: true,
        data: { token: '11', ruleName: 'Rule 1 Updated' },
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'updateStatus',
        status: true,
        data: { ruleToken: '1', ruleStatus: false },
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'updateStatus',
        status: true,
        data: { ruleToken: '11', ruleStatus: false },
      }),
    },
    {
      body: JSON.stringify({
        module: 'incidentRule',
        operation: 'delete',
        status: true,
        data: ['1'],
      }),
    }];

    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
    const searchInput = findByTestAtrrFirst(wrapper, 'ekasha_searchInput_rule_engine_searchBox');
    act(() => {
      searchInput.props().onChange({ target: { value: 'Rule 1' } });
    });
    socketFackData.forEach((element) => {
      act(() => {
        // Trigger the callback with the mock payload
        subscribeCallback(element);
      });
    });

    wrapper.update();
  });

  afterAll(() => {
    wrapper.unmount();
  });
});
