import { act } from 'react-dom/test-utils';
import { findByTestAtrrFirst, handlePermission } from '../../../../helpers/lib/testUtils';
import IocEkasha from '../../../containers/ioc/index';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import {
  getAllIocAction,
  fakeActionIoc,
  enrichIocAction,
} from '../../../../apis/ioc/actions';
import { mountComponent } from '../../../../setupTests';

const actionProps = {
  getAllIocAction,
  fakeActionIoc,
  enrichIocAction,
};

const initialData = {
  Ioc: {
    GetAllIocResponse: {
      code: 200,
      data: {
        content: [{
          token: 'tokenIoc',
          type: 'URL',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: '10.2.3.5',
          customerID: '2',
          createdTime: '2024-06-07T11:57:26Z',
        }, {
          token: 'tokenIoc1',
          type: 'ip',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: '10.2.3.5',
          customerID: '2',
          createdTime: '2024-06-07T11:57:26Z',
        }],
        totalPages: 1,
        totalElements: 2,
        size: 30,
        number: 0,
        numberOfElements: 2,
      },
      message: 'Get all ioc.',
      status: true,
    },
    EnrichIocResponse: {
      status: false,
      message: 'no data',
      data: {
        incidents: [],
        iocToken: 'x6be2bc64-7fd6-4b93-bad3-56c60501f0fe',
        enrichIoc: [],
      },
      code: 200,
    },
  },
};

const setUp = (props = {}, initialState = { Ioc: {} }) => mountComponent(
  IocEkasha, props, initialState, { customerID: '12345' },
);

describe('Component Rendering - on Enrich Modal with type URL an COPY ', () => {
  let wrapper;
  beforeEach(() => {
    document.execCommand = jest.fn();
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Ioc.EnrichIocResponse = {
      status: true,
      message: 'no data',
      data: {
        incidents: [
          {
            incidentId: '3',
            incidentName: 'tret',
          },
          {
            incidentId: '2',
            incidentName: 'yiyuiuyi',
          },
        ],
        iocToken: 'x6be2bc64-7fd6-4b93-bad3-56c60501f0fe',
        enrichIoc: [],
      },
      code: 200,
    };
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  afterEach(() => {
    // Clear mock calls
    jest.clearAllMocks();
  });
  it('Enrich ioc Modal open and close with IP', () => {
    const enrichBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_enrich_btn_tokenIoc');
    act(() => {
      enrichBtn.props().onClick();
    });
    wrapper.update();
  });
  it('Enrich ioc Modal open, copy and close with URL', () => {
    const enrichBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_enrich_btn_tokenIoc');
    act(() => {
      enrichBtn.props().onClick();
    });
    wrapper = wrapper.update();
    const enrichModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_ioc_Enrich_modal');
    expect(enrichModal.length).toBe(1);
    const enrichModalCopy = findByTestAtrrFirst(wrapper, 'ekasha_ioc_url_copy');
    expect(enrichModalCopy.length).toBe(1);
    act(() => {
      enrichModalCopy.props().onClick();
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ioc_Enrich_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
    wrapper.update();
  });
});
describe('Component Rendering - on Enrich Modal with IP', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('Enrich ioc Modal open and close with IP', () => {
    const enrichBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_enrich_btn_tokenIoc1');
    act(() => {
      enrichBtn.props().onClick();
    });
    wrapper.update();
  });
  it('Enrich ioc Modal open and close with IP', () => {
    const enrichBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_enrich_btn_tokenIoc1');
    act(() => {
      enrichBtn.props().onClick();
    });
    wrapper = wrapper.update();
    const enrichModal = findByTestAtrrFirst(wrapper, 'ekasha_simpleModal_ioc_Enrich_modal');
    expect(enrichModal.length).toBe(1);
    const closeModal = findByTestAtrrFirst(wrapper, 'ekasha_model_close_ioc_Enrich_modal');
    expect(closeModal.length).toBe(1);
    act(() => {
      closeModal.props().onClick();
    });
    wrapper.update();
  });
});
