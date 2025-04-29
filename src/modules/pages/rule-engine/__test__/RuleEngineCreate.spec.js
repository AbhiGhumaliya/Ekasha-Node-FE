import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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
import { TimeFilContext } from '../../../containers/TimeFilterContext';
import RuleEngineEkasha from '../../../containers/ruleEngine';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import {
  findByTestAtrr, findByTestAtrrFirst, findByTestControlsAtrr, handlePermission,
} from '../../../../helpers/lib/testUtils';

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

const mockStore = configureMockStore([thunk]);

jest.useFakeTimers();

const setUp = (props = {}, initialState = { RuleEngines: {}, Assets: {}, Integration: {} }) => {
  const contextValue = { customerID: 'Tenant_1' };
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <TimeFilContext.Provider value={contextValue}>
          <RuleEngineEkasha {...props} />
        </TimeFilContext.Provider>
      </Provider>
    </Router>,
  );
  component.debug();
  return component;
};

describe('Component Rendering - on Reducer Success Response', () => {
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
        RuleEngineAddResponse: {
          code: 200,
          message: 'Rule added.',
          module: 'incidentRule',
          operation: 'add',
          status: true,
        },
        UpdateRuleEngineResponse: {
          code: 200,
          message: 'Rule updated.',
          module: 'incidentRule',
          operation: 'update',
          status: true,
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
        GetAllFieldsResponse: {
          code: 200,
          data: [{
            regex: '(\\S+.+|\\S+)',
            size: 100,
            name: 'Incident ID',
            value: 'incidentId',
            fieldType: 'text',
          }],
          message: 'Data fetched.',
          status: true,
        },
      },
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should set Success Response in Reducer', async () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Add_Button_Icon');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
  });
});

describe('Component Rendering - on Reducer False Response', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      RuleEngines: {
        GetAllRuleListResponse: {
          code: 200,
          message: 'Find all incident rules.',
          status: false,
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
        RuleEngineAddResponse: {
          code: 200,
          message: 'Rule added.',
          module: 'incidentRule',
          operation: 'add',
          status: false,
        },
        UpdateRuleEngineResponse: {
          code: 200,
          message: 'Rule updated.',
          module: 'incidentRule',
          operation: 'update',
          status: false,
        },
      },
      Assets: {
        GetOwnerResponse: {
          code: 200,
          message: 'User data fetched.',
          status: false,
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
          status: false,
          data: [
            {
              name: '123',
              value: 'u2b83751e-93a3-4a68-8e0f-f071e83a3fec',
            },
          ],
        },
        GetAllFieldsResponse: {
          code: 200,
          data: [{
            regex: '(\\S+.+|\\S+)',
            size: 100,
            name: 'Incident ID',
            value: 'incidentId',
            fieldType: 'text',
          }],
          message: 'Data fetched.',
          status: false,
        },
      },
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('Should Failed Response in Reducer', async () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Add_Button_Icon');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
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

describe('Component Rendering - Render All Button with All permission', () => {
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
        RuleEngineGetOneRes: {
          status: false,
          message: 'no data',
          data: {},
          code: 200,
        },
        RuleEngineDeleteRes: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        RuleEngineStatusRes: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
        RuleEnginePositionUpdtRes: {
          status: false,
          message: 'no data',
          data: [],
          code: 200,
        },
      },
      Assets: {},
      Integration: {},
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('add button only read permission', () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Add_Button_Icon');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
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
});

describe('Component Rendering - on Create Rule Model and Submit Data', () => {
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
        GetAllFieldsResponse: {
          code: 200,
          data: [{
            regex: '(\\S+.+|\\S+)',
            size: 100,
            name: 'Incident ID',
            value: 'incidentId',
            fieldType: 'text',
          },
          {
            regex: '^[0-9]{1,19}$',
            size: 19,
            name: 'Alert Count',
            value: 'alertCount',
            fieldType: 'long',
          }],
          message: 'Data fetched.',
          status: true,
        },
      },
    };
    jest.useFakeTimers();
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('Create rule from list', async () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Add_Button_Icon');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'rule_engine_create_modal');
    expect(createModal.length).toBe(1);
    const submit = findByTestAtrr(wrapper, 'ekasha_button_submit_rule_btn_Model');
    const ruleNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_create_ruleName_Input');
    const ruleDescriptionInput = findByTestAtrr(wrapper, 'ekasha_normalInput_textArea_create_ruleDescription_textarea');
    const ruleSourceSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_source_select');
    const ruleOwnerSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_ownerToken_select');
    const ruleAssignSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_assignTo_select');
    const ruleIncidentTypeSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_incidentType_select');
    const ruleCKCSSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_CKCS_select');
    const ruleImpactSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_rule_create_Impact_select');
    const ruleDSCSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_rule_create_DSC_select');
    const ruleDataTypeSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_rule_create_dataType_select');
    const SMTPStatusRadio = findByTestAtrrFirst(wrapper, 'ekasha_radioButton_create_rule_smtp_status');

    const threatNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_TN_Input');
    const threatTypeInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_TT_Input');
    const threatDescriptionInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_TD_Input');
    const AttackMechanismSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_rule_create_AM_select');
    const AttackAgentSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_rule_create_AA_select');
    const MITRETacticInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_mitreTactic_Input');
    const MITRETacticIDInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_mitreTacticId_Input');
    const MITRETechniqueInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_mitreTechnique_Input');
    const MITRETechniqueIDInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_mitreTechniqueId_Input');
    const MITRESubTechniqueInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_mitreSubTechnique_Input');
    const MITRESubTechniqueIDInput = findByTestAtrr(wrapper, 'ekasha_normalInput_rule_create_mitreSubTechniqueId_Input');

    const ruleGroupFieldSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_filterFields0');
    const ruleGroupOpratorSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_filterOperator0');
    act(() => {
      ruleNameInput.at(ruleNameInput.length - 1).simulate('change', { target: { value: 'ABC' } });
      ruleDescriptionInput.at(ruleDescriptionInput.length - 5).simulate('change', { target: { value: 'abcdef' } });
      ruleSourceSelect.props().onChange('QA_CEF');
      ruleOwnerSelect.props().onChange('Ekasha');
      ruleAssignSelect.props().onChange('Abhi');
      ruleIncidentTypeSelect.props().onChange('Malware');
      ruleCKCSSelect.props().onChange('Exploitation');
      ruleImpactSelect.props().onChange('Operational');
      ruleDSCSelect.props().onChange('Confidential');
      ruleDataTypeSelect.props().onChange('Financial Transactions');
      SMTPStatusRadio.at(SMTPStatusRadio.length - 1).props().onChange({ target: { value: true } });

      threatNameInput.at(threatNameInput.length - 1).simulate('change', { target: { value: 'ABC' } });
      threatTypeInput.at(threatTypeInput.length - 1).simulate('change', { target: { value: 'ABC' } });
      threatDescriptionInput.at(threatDescriptionInput.length - 1).simulate('change', { target: { value: 'ABC' } });
      AttackMechanismSelect.props().onChange('Information');
      AttackAgentSelect.props().onChange('Collaborative');
      MITRETacticInput.at(MITRETacticInput.length - 1).simulate('change', { target: { value: 'ABC MITRE' } });
      MITRETacticIDInput.at(MITRETacticIDInput.length - 1).simulate('change', { target: { value: 'ABC MITRE ID' } });
      MITRETechniqueInput.at(MITRETechniqueInput.length - 1).simulate('change', { target: { value: 'ABC MITRE Technique' } });
      MITRETechniqueIDInput.at(MITRETechniqueIDInput.length - 1).simulate('change', { target: { value: 'ABC MITRE Technique ID' } });
      MITRESubTechniqueInput.at(MITRESubTechniqueInput.length - 1).simulate('change', { target: { value: 'ABC MITRE Sub Technique' } });
      MITRESubTechniqueIDInput.at(MITRESubTechniqueIDInput.length - 1).simulate('change', { target: { value: 'ABC MITRE Sub Technique ID' } });

      ruleGroupFieldSelect.props().onChange('incidentId');
      ruleGroupOpratorSelect.props().onChange('isNotExist');
    });
    wrapper.update();
    const incidentKeywordChipInput = findByTestAtrrFirst(wrapper, 'chipInput_create_incident_keywords');
    act(() => {
      incidentKeywordChipInput.at(incidentKeywordChipInput.length - 1).props().onChange({ target: { value: 'ABCKeyword' } });
    });
    wrapper.update();
    act(() => {
      incidentKeywordChipInput.at(incidentKeywordChipInput.length - 1).props().onPressEnter({ target: { value: 'ABCKeyword' } });
    });
    act(() => {
      ruleGroupOpratorSelect.props().onChange('gt');
    });
    wrapper.update();
    const ruleGroupValueInput = findByTestAtrrFirst(wrapper, 'ekasha_normalInput_create_rule_filterValue0');
    act(() => {
      ruleGroupValueInput.at(ruleGroupValueInput.length - 1).simulate('change', { target: { value: '' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      ruleGroupValueInput.at(ruleGroupValueInput.length - 1).simulate('change', { target: { value: 'ABC Field Value' } });
    });
    wrapper.update();
    act(() => {
      ruleGroupOpratorSelect.props().onChange('lt');
    });
    wrapper.update();
    act(() => {
      ruleGroupValueInput.at(ruleGroupValueInput.length - 1).simulate('change', { target: { value: 'ABC Field Value' } });
    });
    wrapper.update();
    act(() => {
      ruleGroupFieldSelect.props().onChange('incidentId');
    });
    wrapper.update();
    act(() => {
      ruleGroupOpratorSelect.props().onChange('isExist');
    });
    wrapper.update();
    const CaseSensitiveCheck = findByTestAtrrFirst(wrapper, 'ekasha_checkbox_ruleCaseSensitive_checkbox');
    act(() => {
      CaseSensitiveCheck.at(CaseSensitiveCheck.length - 1).props()
        .onChange({ target: { checked: false } });
    });
    act(() => {
      CaseSensitiveCheck.at(CaseSensitiveCheck.length - 1).props()
        .onChange({ target: { checked: true } });
    });
    wrapper.update();
    const ruleMainGroupPlusBTN = findByTestAtrrFirst(wrapper, 'ekasha_button_newRule_main_Group_Plus_btn_0');
    act(() => {
      ruleMainGroupPlusBTN.at(ruleMainGroupPlusBTN.length - 1).props().onClick();
    });
    wrapper.update();
    act(() => {
      ruleMainGroupPlusBTN.at(ruleMainGroupPlusBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const mainGroupOpratorORBTN = findByTestAtrrFirst(wrapper, 'mainGroup_orOpt_0');
    act(() => {
      mainGroupOpratorORBTN.at(mainGroupOpratorORBTN.length - 1).props().onClick();
    });
    wrapper.update();
    act(() => {
      mainGroupOpratorORBTN.at(mainGroupOpratorORBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const mainGroupOpratorAndBTN = findByTestAtrrFirst(wrapper, 'mainGroup_andOpt_0');
    act(() => {
      mainGroupOpratorAndBTN.at(mainGroupOpratorAndBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const ruleMainGroupMinusBTN = findByTestAtrrFirst(wrapper, 'ekasha_button_newRule_main_Group_Minus_btn_0');
    act(() => {
      ruleMainGroupMinusBTN.at(ruleMainGroupMinusBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const ruleSubGroupPlusBTN = findByTestAtrrFirst(wrapper, 'ekasha_button_newRule_Sub_Group_Plus_btn_0');
    act(() => {
      ruleSubGroupPlusBTN.at(ruleSubGroupPlusBTN.length - 1).props().onClick();
    });
    wrapper.update();
    act(() => {
      ruleSubGroupPlusBTN.at(ruleSubGroupPlusBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const subGroupOpratorORBTN = findByTestAtrrFirst(wrapper, 'sub_Group_BoxOr_0_0');
    act(() => {
      subGroupOpratorORBTN.at(subGroupOpratorORBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const subGroupOpratorAndBTN = findByTestAtrrFirst(wrapper, 'sub_Group_BoxAnd_0_0');
    act(() => {
      subGroupOpratorAndBTN.at(subGroupOpratorAndBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const ruleSubGroupMinusBTN = findByTestAtrrFirst(wrapper, 'ekasha_button_newRule_Sub_Group_Minus_btn_0');
    act(() => {
      ruleSubGroupMinusBTN.at(ruleSubGroupMinusBTN.length - 1).props().onClick();
    });
    wrapper.update();

    const duplicateAlertsCheck = findByTestAtrrFirst(wrapper, 'ekasha_checkbox_Incidentfield_duplicate_alerts_grouping');
    act(() => {
      duplicateAlertsCheck.at(duplicateAlertsCheck.length - 1).props()
        .onChange({ target: { checked: true } });
    });
    wrapper.update();
    [4, 3, 2, 1, 0].forEach((element) => {
      const ekashaFieldRemoveBTN = findByTestAtrrFirst(wrapper, `ekasha_remove_field_${element}`);
      act(() => {
        ekashaFieldRemoveBTN.at(ekashaFieldRemoveBTN.length - 1).props().onClick();
      });
      wrapper.update();
    });
    const aggFieldsSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_aggFields_select');
    const addJSONBTN = findByTestAtrrFirst(wrapper, 'ekasha_button_ekasha_add_json_BTN');
    act(() => {
      aggFieldsSelect.props().onChange('incidentId');
    });
    wrapper.update();
    act(() => {
      addJSONBTN.at(addJSONBTN.length - 1).props().onClick();
    });
    wrapper.update();
    act(() => {
      aggFieldsSelect.props().onChange('alertCount');
    });
    wrapper.update();
    act(() => {
      addJSONBTN.at(addJSONBTN.length - 1).props().onClick();
    });
    wrapper.update();
    const ruleIntervalTimeInput = findByTestAtrr(wrapper, 'ekasha_normalInput_create_rule_aggTime_Input');
    const ruleIntervalTimeSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_aggTime_select');
    act(() => {
      ruleIntervalTimeInput.at(ruleIntervalTimeInput.length - 1).simulate('change', { target: { value: '' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    act(() => {
      ruleIntervalTimeSelect.props().onChange('h');
    });
    wrapper.update();
    act(() => {
      ruleIntervalTimeInput.at(ruleIntervalTimeInput.length - 1).simulate('change', { target: { value: '0' } });
    });
    wrapper.update();
    act(() => {
      ruleIntervalTimeInput.at(ruleIntervalTimeInput.length - 1).simulate('change', { target: { value: '1' } });
    });
    wrapper.update();
    act(() => {
      ruleIntervalTimeSelect.props().onChange('h');
    });
    wrapper.update();
    const ruleIncStatusSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_Inc_Status_select');
    act(() => {
      ruleIncStatusSelect.props().onChange('closed');
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
  });

  it('Tab Click in Model ', async () => {
    const addBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Add_Button_Icon');
    act(() => {
      addBtn.at(addBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'rule_engine_create_modal');
    expect(createModal.length).toBe(1);
    const ThreatInformationTabClick = findByTestControlsAtrr(wrapper, 'adminTabs-panel-Threat_Information');
    act(() => {
      ThreatInformationTabClick.at(ThreatInformationTabClick.length - 1).simulate('click', { stopPropagation: jest.fn() });
    });
    wrapper.update();
    const BasicDetailTabClick = findByTestControlsAtrr(wrapper, 'adminTabs-panel-Basic_Details');
    act(() => {
      BasicDetailTabClick.at(BasicDetailTabClick.length - 1).simulate('click', { stopPropagation: jest.fn() });
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    wrapper.update();
    const FilterGroupingTabClick = findByTestControlsAtrr(wrapper, 'adminTabs-panel-Filter_&_Grouping');
    act(() => {
      FilterGroupingTabClick.at(FilterGroupingTabClick.length - 1).simulate('click', { stopPropagation: jest.fn() });
    });
    wrapper.update();
    const submit = findByTestAtrr(wrapper, 'ekasha_button_submit_rule_btn_Model');
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
});

describe('Component Rendering - on Edit Rule Model and Submit Data', () => {
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
        GetAllFieldsResponse: {
          code: 200,
          data: [{
            regex: '(\\S+.+|\\S+)',
            size: 100,
            name: 'Incident ID',
            value: 'incidentId',
            fieldType: 'text',
          }],
          message: 'Data fetched.',
          status: true,
        },
      },
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('Edit rule from list', async () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Edit_rule_token');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'rule_engine_create_modal');
    expect(createModal.length).toBe(1);
    const submit = findByTestAtrr(wrapper, 'ekasha_button_submit_rule_btn_Model');
    const ruleNameInput = findByTestAtrr(wrapper, 'ekasha_normalInput_create_ruleName_Input');

    act(() => {
      ruleNameInput.at(ruleNameInput.length - 1).simulate('change', { target: { value: 'ABCDEF' } });
    });
    wrapper.update();
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    const editBtn2 = findByTestAtrrFirst(wrapper, 'Rule_Engine_Edit_rule_token');
    act(() => {
      editBtn2.at(editBtn2.length - 1).props().onClick();
    });
    wrapper.update();
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_rule_engine_create_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
  });
});

describe('Component Rendering - on Edit Default Rule Model without any Changes', () => {
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
            createdTime: '2024-01-23T10:53:59+05:30',
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
            groupsData: [
              {
                token: 'r1a03dbbd-2639-4a5a-bb3e-87908fd4c864',
                ruleToken: 'yb59c00dd-130c-4827-8dc1-54db0c91cfd9',
                groupName: 'Group 1',
                position: '1',
                isMust: true,
                groupData: '[{"field":"","op":"","isMust":true,"position":1}]',
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
        GetAllFieldsResponse: {
          code: 200,
          data: [{
            regex: '(\\S+.+|\\S+)',
            size: 100,
            name: 'Incident ID',
            value: 'incidentId',
            fieldType: 'text',
          }],
          message: 'Data fetched.',
          status: true,
        },
      },
    };
    setPermissions(handlePermission('RW', 'ruleEngine'));
    wrapper = setUp(actionProps, initial);
  });

  it('Edit Default rule from list', async () => {
    const editBtn = findByTestAtrrFirst(wrapper, 'Rule_Engine_Edit_rule_token');
    act(() => {
      editBtn.at(editBtn.length - 1).props().onClick();
    });
    wrapper.update();
    const createModal = findByTestAtrrFirst(wrapper, 'rule_engine_create_modal');
    expect(createModal.length).toBe(1);
    const submit = findByTestAtrr(wrapper, 'ekasha_button_submit_rule_btn_Model');
    const ruleOwnerSelect = findByTestAtrrFirst(wrapper, 'ekasha_NormalSelect_create_rule_ownerToken_select');

    act(() => {
      ruleOwnerSelect.props().onChange('Ekasha Admin');
    });
    act(() => {
      submit.at(1).simulate('click');
    });
    wrapper.update();
    const editBtn2 = findByTestAtrrFirst(wrapper, 'Rule_Engine_Edit_rule_token');
    act(() => {
      editBtn2.at(editBtn2.length - 1).props().onClick();
    });
    wrapper.update();
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_rule_engine_create_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
  });
});
