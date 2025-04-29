/* eslint-disable react/prop-types */
import React from 'react';
import {
  render,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { store } from '../../../configurations/redux/Store';
import Page from '../index';

// Mock the required dependencies
jest.mock('../../../helpers/lib/SocketHandlers', () => ({
  stompClient: {
    connected: true,
    subscribe: jest.fn(),
  },
  reConnect: jest.fn(),
}));

jest.mock('../../../apis/authentication/auth.actions', () => ({
  getTimeZone: () => ({ type: 'GET_TIMEZONE' }),
  getUserPermissions: () => ({ type: 'GET_USER_PERMISSIONS' }),
}));

// Mock the lazy-loaded components
jest.mock('../../../components/layout/TopBar/TopBarEkasha', () => ({
  __esModule: true,
  default: function DummyTopBar({ sideBarToggle }) {
    return <div data-testid="topbar" onClick={sideBarToggle}>TopBar</div>;
  },
}));

jest.mock('../../../components/layout/SideBar', () => ({
  __esModule: true,
  default: function DummySideBar({ collapsed }) {
    return <div data-testid="sidebar" data-collapsed={collapsed}>SideBar</div>;
  },
}));

jest.mock('../../../components/layout/Footer', () => ({
  __esModule: true,
  default: function DummyFooter() {
    return <div data-testid="footer">Footer</div>;
  },
}));

jest.mock('../../../router/index', () => ({
  __esModule: true,
  default: function DummyRouter() {
    return <div data-testid="page-router">Page Router</div>;
  },
}));

describe('Page Component', () => {
  const mockUserProfile = {
    userName: 'testUser',
    fullname: 'Test User',
    email: 'test@example.com',
    contact: '1234567890',
    groupName: 'TestGroup',
    role: 'admin',
  };

  const mockTokens = {
    userToken: 'test-token',
    roleToken: 'admin-token',
    groupToken: 'group-token',
  };

  beforeEach(() => {
    // Setup localStorage mock data
    localStorage.clear();
    localStorage.setItem('U_PROFILE', JSON.stringify(mockUserProfile));
    localStorage.setItem('U_TOKENS', JSON.stringify(mockTokens));
    jest.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const renderPage = (initialRoute = '/dashboard') => {
    const history = createMemoryHistory();
    history.push(initialRoute);

    return render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <Router history={history}>
            <Page location={{ pathname: initialRoute }} />
          </Router>
        </Provider>
      </React.Suspense>,
    );
  };

  it('should redirect to login page when U_TOKENS is not present', () => {
    localStorage.removeItem('U_TOKENS');
    renderPage();

    expect(window.location.pathname).toBe('/');
  });
});
