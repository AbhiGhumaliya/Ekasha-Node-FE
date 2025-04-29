import '@testing-library/jest-dom';
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { IdelTimerContext, TimeFilContext } from './modules/containers/TimeFilterContext';

configure({ adapter: new Adapter() });

// Define the tokens
const Tokens = {
  groupToken: 'x249a2995-3666-4243-af80-1d5c26739a33',
  userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  roleToken: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
  jwtToken: 'eyJ1c2VyVG9rZW4iOiJtMzNiMmU3NDctYjk3Ny00ZGI2LTlmOWMtODI4ZjhjNmNjY2Q5IiwiYWxnIjoiSFM1MTIifQ.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcxNzc2NTQ2MCwiaWF0IjoxNzE3NzM2NjYwfQ.n_oTACzE5YCacNhVrQxexXBdaq3vIooy4QQwuBqd3p0GaJOL6Fr2wXwhZItNKvfGG67UHlTqBVs7CCQcXDPJiA',
};

// Set the tokens in localStorage
localStorage.setItem('U_TOKENS', JSON.stringify(Tokens));
localStorage.setItem('U_PROFILE', JSON.stringify({
  contact: '9879898798', email: 'ekashaadmin@gmail.com', fullname: 'Ekasha Admin', groupName: 'admin', role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5', userName: 'admin',
}));

export const mockStore = configureMockStore([thunk]);

export const mountComponent = (Component, props, initialState, contextValue, appContextValue) => {
  const store = mockStore(initialState);
  const component = mount(
    <Router>
      <Provider store={store}>
        <IdelTimerContext.Provider value={appContextValue}>
          <TimeFilContext.Provider value={contextValue}>
            <Component {...props} />
          </TimeFilContext.Provider>
        </IdelTimerContext.Provider>
      </Provider>
    </Router>,
  );
  return component;
};
