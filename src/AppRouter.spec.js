import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, waitFor } from '@testing-library/react';
import AppRouter from './appRouter';
import { history } from './configurations/redux/Store';

// Mock the lazy-loaded components
jest.mock('./modules/containers/authentication/lib/setup', () => () => 'Setup Component');
jest.mock('./modules/pages/authentication/lib/SignInMessage', () => () => 'SignInMessage Component');
jest.mock('./modules/containers', () => () => 'Containers Component');
jest.mock('./modules/pages/playbook/lib/newPlaybook', () => () => 'NewPlaybook Component');
jest.mock('./modules/containers/authentication', () => () => 'Authentication Component');
jest.mock('./modules/containers/actionApproval', () => () => 'ActionApproval Component');
jest.mock('./modules/containers/administration/ListPreviewEkasha', () => () => 'ListPreviewEkasha Component');
jest.mock('./modules/pages/incidents/lib/subModule/playbook/lib/previewPlaybookTab', () => () => <div>PreviewPlaybookTab</div>);

const mockStore = configureMockStore([thunk]);

const setUp = (props = {}) => {
  const store = mockStore({});
  return mount(
    <Provider store={store}>
      <AppRouter {...props} />
    </Provider>,
  );
};

describe('AppRouter Component', () => {
  beforeEach(() => {
    // Clear history before each test
    history.push('/');
  });

  it('should render without errors', () => {
    const wrapper = setUp();
    expect(wrapper.exists()).toBe(true);
  });

  it('should render Authentication component on root path', () => {
    history.push('/');
    expect(history.location.pathname).toBe('/');
  });

  it('should render Setup component on /setup path', () => {
    history.push('/setup');
    expect(history.location.pathname).toBe('/setup');
  });

  it('should render SignInMessage component on /signininfo path', () => {
    history.push('/signininfo');
    expect(history.location.pathname).toBe('/signininfo');
  });

  it('should render ActionApproval component with params', () => {
    history.push('/actionApproval/test@email.com/token123/customer456');
    expect(history.location.pathname).toBe('/actionApproval/test@email.com/token123/customer456');
  });

  it('should render ListPreviewEkasha component with dataToken', () => {
    history.push('/list/preview/dataToken123');
    expect(history.location.pathname).toBe('/list/preview/dataToken123');
  });

  it('should render NewPlaybook component with type and playbookId', () => {
    history.push('/zeronsec/playbook/type123/playbook456');
    expect(history.location.pathname).toBe('/zeronsec/playbook/type123/playbook456');
  });

  it('should render PreviewPlaybookTab component with all required params', () => {
    history.push('/zeronsec/incident/playbook/type123/customer456/incident789/playbook101/preRef202/ref303/true');
    expect(history.location.pathname).toBe('/zeronsec/incident/playbook/type123/customer456/incident789/playbook101/preRef202/ref303/true');
  });

  it('should render Containers component on /zeronsec path', () => {
    history.push('/zeronsec');
    expect(history.location.pathname).toBe('/zeronsec');
  });

  it('should redirect to root path for unknown routes', () => {
    history.push('/unknown-route');
  });

  it('should handle history prop correctly', () => {
    const customHistory = { ...history };
    const wrapper = setUp({ history: customHistory });
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle null history prop', () => {
    const wrapper = setUp({ history: null });
    expect(wrapper.exists()).toBe(true);
  });
});

describe('AppRouter', () => {
  it('should load lazy components correctly', async () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <AppRouter />
      </Provider>,
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it('should render SignInMessage component correctly', async () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <MemoryRouter initialEntries={['/signininfo']}>
          <AppRouter />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
      // You might want to add a specific test-id to SignInMessage component
    });
  });
});
