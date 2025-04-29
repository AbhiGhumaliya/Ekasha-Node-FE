import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { findByTestAtrr } from './helpers/lib/testUtils';
import App from './App';
import { history } from './configurations/redux/Store';

const mockStore = configureMockStore([thunk]);
const setUp = (props = {}, initialState = {}) => {
  const store = mockStore(initialState);

  const component = mount(
    <Provider store={store}><App {...props} /></Provider>,
  );
  return component;
};

describe('App Component', () => {
  it('Should render without errors', () => {
    const wrapper = setUp();
    const h = findByTestAtrr(wrapper, 'appComponent');
    expect(h.length).toBe(1);
  });
  it('Should render without errors when localstorage has access token', () => {
    localStorage.setItem('jwtToken', '111');
    const wrapper = setUp();
    const h = findByTestAtrr(wrapper, 'appComponent');
    expect(h.length).toBe(1);
  });
  it('renders /signin route correctly', () => {
    history.push('/signin');

    mount(<Provider store={mockStore({ Auth: {} })}><App history={history} /></Provider>);
    expect(history.location.pathname).toBe('/signin');
  });
});
