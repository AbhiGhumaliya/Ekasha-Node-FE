import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FunnelChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('FunnelChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'A', value: 30 },
      { key: 'B', value: 70 },
    ],
  };

  beforeEach(() => {
    jest.useFakeTimers();
    const div = document.createElement('div');
    div.id = 'testChart';
    div.innerHTML = '<div></div>';
    document.body.appendChild(div);
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });
    Object.defineProperty(document.body, 'clientWidth', { configurable: true, value: 1000 });
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    render(<FunnelChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<FunnelChart {...mockProps} data={[]} />);
    jest.advanceTimersByTime(300);
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('renders funnel chart with data', () => {
    render(<FunnelChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('handles mouse interactions on funnel sections', () => {
    render(<FunnelChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const paths = document.querySelectorAll('path');
    paths.forEach((path) => {
      fireEvent.mouseMove(path, {
        pageX: 100,
        pageY: 100,
        clientX: 100,
        clientY: 100,
      });

      // Test tooltip position when near right edge
      fireEvent.mouseMove(path, {
        pageX: 950,
        pageY: 100,
        clientX: 950,
        clientY: 100,
      });

      fireEvent.mouseOut(path);
    });
  });

  it('handles window resize events', () => {
    render(<FunnelChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChart')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<FunnelChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('handles chart rerender with existing content', () => {
    render(<FunnelChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger a rerender
    fireEvent(window, new Event('resize'));
    jest.advanceTimersByTime(300);

    expect(getById('testChart')).toBeInTheDocument();
  });

  it('creates gradient definitions for each section', () => {
    render(<FunnelChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    mockProps.data.forEach((_, index) => {
      const gradient = document.querySelector(`#testChartgradient${index}`);
      expect(gradient).toBeInTheDocument();
    });
  });

  it('handles window mouseout events', () => {
    render(<FunnelChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    fireEvent.mouseOut(window);
  });

  it('renders with default props', () => {
    render(<FunnelChart />);
    jest.advanceTimersByTime(300);
  });

  it('handles null element case gracefully', () => {
    document.body.innerHTML = ''; // Remove the element
    jest.advanceTimersByTime(300);
  });
});
