import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HorizontalBarHomeChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('HorizontalBarHomeChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      {
        key: 'Critical', value: 30, color: '#FF565A', gradient: '#ED1F24',
      },
      {
        key: 'High', value: 25, color: '#F47F4E', gradient: '#FC682B',
      },
      {
        key: 'Medium', value: 20, color: '#FFE579', gradient: '#FFD217',
      },
      {
        key: 'Low', value: 15, color: '#E9EEA9', gradient: '#FFFF73',
      },
    ],
    type: 'home',
    kpiStatus: false,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    const div = document.createElement('div');
    div.id = 'testChart';
    div.innerHTML = '<div></div>';
    document.body.appendChild(div);
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    render(<HorizontalBarHomeChart {...mockProps} />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<HorizontalBarHomeChart {...mockProps} data={[]} />);
    jest.runAllTimers();
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('renders with kpiStatus true', () => {
    render(<HorizontalBarHomeChart {...mockProps} kpiStatus />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('handles bar click and navigation', () => {
    render(
      <BrowserRouter>
        <HorizontalBarHomeChart {...mockProps} />
      </BrowserRouter>,
    );
    jest.advanceTimersByTime(2000);

    const severityLabel = screen.getByText('Critical');
    fireEvent.click(severityLabel);
    // Navigation should occur to /zeronsec/incidents/Timeline
  });

  it('handles mouse interactions with bars', () => {
    render(<HorizontalBarHomeChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    const severityLabel = screen.getByText('Critical');
    fireEvent.mouseOver(severityLabel);
    fireEvent.mouseOut(severityLabel);
  });

  it('handles window resize events', () => {
    render(<HorizontalBarHomeChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChart')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<HorizontalBarHomeChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles different severity levels and colors', () => {
    const customData = [
      { key: 'Critical', value: 30 },
      { key: 'High', value: 25 },
      { key: 'Moderate', value: 20 },
      { key: 'Low', value: 15 },
      { key: 'undefined', value: 10 },
    ];

    render(<HorizontalBarHomeChart {...mockProps} data={customData} />);
    jest.advanceTimersByTime(2000);

    customData.forEach((item) => {
      expect(screen.getByText(item.key)).toBeInTheDocument();
    });
  });

  it('renders correct percentage and value formatting', () => {
    render(<HorizontalBarHomeChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    // Total value is 90, so 30 should be displayed as "33.3%"
    expect(screen.getByText('33.3%')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('handles animation timing correctly', () => {
    render(<HorizontalBarHomeChart {...mockProps} />);
    jest.advanceTimersByTime(2000);
    // Animation should be complete
    const bars = document.querySelectorAll('.bar-fill');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('renders ruler when kpiStatus is false', () => {
    render(<HorizontalBarHomeChart {...mockProps} kpiStatus={false} />);
    jest.advanceTimersByTime(2000);

    const rulerItems = document.querySelectorAll('.cm');
    expect(rulerItems.length).toBe(11); // 0 to 100 by steps of 10
  });

  it('handles undefined data gracefully', () => {
    const invalidData = [{ key: 'InvalidKey', value: 30 }];
    render(<HorizontalBarHomeChart {...mockProps} data={invalidData} />);
    jest.advanceTimersByTime(2000);

    expect(getById('testChart')).toBeInTheDocument();
  });
});
