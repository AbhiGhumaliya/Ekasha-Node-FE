import { act } from 'react-dom/test-utils';
import { findByTestAtrrFirst, handlePermission } from '../../../../helpers/lib/testUtils';
import IocEkasha from '../../../containers/ioc/index';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import {
  getAllIocAction,
  deleteIocAction,
  fakeActionIoc,
} from '../../../../apis/ioc/actions';
import { mountComponent } from '../../../../setupTests';

const actionProps = {
  getAllIocAction,
  deleteIocAction,
  fakeActionIoc,
};

const initialData = {
  Ioc: {
    GetAllIocResponse: {
      code: 200,
      data: {
        content: [{
          token: 'tokenIoc',
          type: 'ip',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          ioc: '10.2.3.5',
          customerID: '2',
          createdTime: '2024-06-07T11:57:26Z',
        }],
        totalPages: 1,
        totalElements: 1,
        size: 30,
        number: 0,
        numberOfElements: 1,
      },
      message: 'Get all ioc.',
      status: true,
    },
  },
};

const setUp = (props = {}, initialState = { Ioc: {} }) => mountComponent(
  IocEkasha, props, initialState, { customerID: '12345' },
);

describe('Component Rendering - on delete Ioc open and delete and cancel nad click  ', () => {
  let wrapper;
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('RW', 'ioc'));
    wrapper = setUp(actionProps, initial);
  });
  it('delete ioc from list click and open', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_delete_btn_tokenIoc');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();
  });
  it('delete ioc from list ', () => {
    const deleteBtn = findByTestAtrrFirst(wrapper, 'ekasha_ioc_delete_btn_tokenIoc');
    act(() => {
      deleteBtn.props().onClick();
    });
    wrapper.update();
    const deleteModal = findByTestAtrrFirst(wrapper, 'ekasha_ioc_delete_modal');
    act(() => {
      deleteModal.props().onOk();
    });
    act(() => {
      deleteBtn.props().onClick();
    });
    act(() => {
      deleteModal.props().onCancel();
    });
    wrapper = wrapper.update();
  });
});
