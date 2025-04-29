import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { findByTestAtrr } from '../../../../../../helpers/lib/testUtils';
import { TimeFilContext } from '../../../../../containers/TimeFilterContext';
import { fakeListAction, getSinglePreviewAction } from '../../../../../../apis/administration/lists/lists.action';
import ListPreviewEkasha from '../../../../../containers/administration/ListPreviewEkasha';

const actionProps = {
  getSinglePreviewAction,
  match: {
    params: {
      dataToken: '1234567890',
    },
  },
  fakeListAction,
};

const mockStore = configureMockStore([thunk]);

jest.useFakeTimers();

const setUp = (props = {}, initialState = { Lists: {} }) => {
  const contextValue = {};
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <TimeFilContext.Provider value={contextValue}>
          <ListPreviewEkasha {...props} />
        </TimeFilContext.Provider>
      </Provider>
    </Router>,
  );
  return component;
};

describe('Component Rendering - Render List Preview Tab Page', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {},
    };
    wrapper = setUp(actionProps, initial);
  });
  it('Should render List Preview Tab Page', async () => {
    await act(async () => {
      wrapper.update();
    });
    const PreviewListTabContainer = findByTestAtrr(wrapper, 'Admin_Preview_List_Tab_Container');
    expect(PreviewListTabContainer.exists()).toBe(true);
  });
});

describe('Component Rendering - Render List Preview Tab Page', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        SinglePreviewResponse: {
          code: 200,
          status: true,
          data: [{ value: 'test' }],
        },
      },
    };
    wrapper = setUp(actionProps, initial);
  });
  it('Should render List Preview Tab Page', async () => {
    await act(async () => {
      wrapper.update();
    });
    const PreviewListTabContainer = findByTestAtrr(wrapper, 'Admin_Preview_List_Tab_Container');
    expect(PreviewListTabContainer.exists()).toBe(true);
  });
});

describe('Component Rendering - Render List Preview Tab Page with No Data', () => {
  let wrapper;

  beforeEach(() => {
    const initial = {
      Lists: {
        SinglePreviewResponse: {
          code: 200,
          status: false,
          data: [],
        },
      },
    };
    wrapper = setUp(actionProps, initial);
  });
  it('Should render List Preview Tab Page', async () => {
    await act(async () => {
      wrapper.update();
    });
    const PreviewListTabContainer = findByTestAtrr(wrapper, 'Admin_Preview_List_Tab_Container');
    expect(PreviewListTabContainer.exists()).toBe(true);
  });
});
