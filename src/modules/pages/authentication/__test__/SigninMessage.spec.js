import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignInMessage from '../lib/SignInMessage';

// Mock the logo import
jest.mock('../../../../assets/images/logo.svg', () => 'mocked-logo.svg');

describe('SignInMessage Component', () => {
  const renderSignInMessage = () => render(
    <BrowserRouter>
      <SignInMessage />
    </BrowserRouter>,
  );

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders the logo and message correctly', () => {
    renderSignInMessage();

    // Check if logo is present
    const logo = screen.getByAltText('brandLogo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-logo.svg');

    // Check if message is displayed
    expect(screen.getByText('You are logged off !')).toBeInTheDocument();
    expect(screen.getByText('Click here')).toBeInTheDocument();
    expect(screen.getByText('to login back.')).toBeInTheDocument();
  });

  it('redirects to /zeronsec when U_TOKENS exists but datatoken does not', () => {
    localStorage.setItem('U_TOKENS', 'some-token');
    const { container } = renderSignInMessage();

    // Check if Redirect component is rendered
    expect(container.innerHTML).toBe('');
  });

  it('redirects to / when login state becomes true', () => {
    const { container } = renderSignInMessage();

    // Trigger window.onload
    global.window.onload();

    // Check if Redirect component is rendered
    expect(container.innerHTML).toBe('');
  });
});
