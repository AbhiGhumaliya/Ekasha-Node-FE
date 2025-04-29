import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../lib/404';

describe('NotFound Component', () => {
  const renderNotFound = (props) => render(
    <BrowserRouter>
      <NotFound {...props} />
    </BrowserRouter>,
  );

  it('renders 404 page with correct content', () => {
    renderNotFound({ redirectPath: 'Administration' });

    // Check if main elements are present
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found or resource may be broken')).toBeInTheDocument();
    expect(screen.getByText('Reload')).toBeInTheDocument();
  });

  it('renders correct redirect link for Administration path', () => {
    renderNotFound({ redirectPath: 'Administration' });
    const link = screen.getByRole('link', { name: 'Reload' });
    expect(link).toHaveAttribute('href', '/zeronsec/administration/SLA');
  });

  it('renders correct redirect link for non-Administration path', () => {
    renderNotFound({ redirectPath: 'Other' });
    const link = screen.getByRole('link', { name: 'Reload' });
    expect(link).toHaveAttribute('href', '/zeronsec');
  });

  it('renders SVG elements', () => {
    renderNotFound({ redirectPath: 'Administration' });
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(document.querySelectorAll('path')).toHaveLength(5);
  });
});
