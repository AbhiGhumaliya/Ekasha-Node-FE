import { act } from 'react-dom/test-utils';
import { findByTestAtrr } from '../../../../helpers/lib/testUtils';
import SessionNotification from '../lib/SessionNotification';
import { mountComponent } from '../../../../setupTests';

const mockProps = {
  setSession: jest.fn(),
  setActiveDetailTab: jest.fn(),
  userCreateHandler: jest.fn(),
  loading: false,
};

const setUp = (props = {}) => mountComponent(SessionNotification, props);

describe('SessionNotification Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setUp(mockProps);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  it('Should display correct title and description', () => {
    const title = wrapper.find('.card-title');
    const description = wrapper.find('.card-description');

    expect(title.text()).toBe('Active Session Detected');
    expect(description.text()).toBe("You're already logged in on another device. Choose how to proceed:");
  });

  it('Should handle "Continue Here" button click correctly', () => {
    const continueHereBtn = findByTestAtrr(wrapper, 'SessionNotification_ContinueHere');

    act(() => {
      continueHereBtn.at(0).simulate('click');
    });
    wrapper.update();

    expect(mockProps.userCreateHandler).toHaveBeenCalledWith('logout');
  });

  it('Should handle "Return to Login" button click correctly', () => {
    const returnToLoginBtn = findByTestAtrr(wrapper, 'SessionNotification_ReturnToLogin');

    act(() => {
      returnToLoginBtn.at(0).simulate('click');
    });
    wrapper.update();

    expect(mockProps.setSession).toHaveBeenCalledWith(false);
    expect(mockProps.setActiveDetailTab).toHaveBeenCalledWith('Login');
  });

  it('Should render all required icons', () => {
    const icons = wrapper.find('Icons');
    expect(icons).toHaveLength(3); // Protection, Success, and Error icons

    // Verify specific icons
    expect(icons.at(0).props().type).toBe('ProtectionIcon');
    expect(icons.at(1).props().type).toBe('SessionSuccessIcon');
    expect(icons.at(2).props().type).toBe('SessionErrorIcon');
  });

  it('Should render footer text correctly', () => {
    const footerText = wrapper.find('.footer-text p');
    expect(footerText.text()).toBe('For security reasons, you can only be logged in on one device at a time.');
  });
});
