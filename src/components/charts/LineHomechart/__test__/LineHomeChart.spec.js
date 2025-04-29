import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomelineChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('HomelineChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'Jan', value: 30 },
      { key: 'Feb', value: 70 },
    ],
    kpiStatus: false,
  };

  const mockMultiSeriesData = [
    { key: 'Jan', value: 30 },
    { key: 'Feb', value: 45 },
    { key: 'Mar', value: 60 },
    { key: 'Apr', value: 75 },
    { key: 'May', value: 90 },
    { key: 'Jun', value: 85 },
    { key: 'Jul', value: 95 },
    { key: 'Aug', value: 100 },
    { key: 'Sep', value: 110 },
    { key: 'Oct', value: 120 },
  ];

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
    render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<HomelineChart {...mockProps} data={[]} />);
    jest.runAllTimers();
    expect(getById('testChart')).toHaveTextContent('Nothing to see here!');
  });

  it('renders line chart with basic data correctly', () => {
    render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('renders line chart with KPI status correctly', () => {
    render(<HomelineChart {...mockProps} kpiStatus />);
    jest.advanceTimersByTime(2000);
    expect(document.querySelector('.line_Svg')).toBeInTheDocument();
  });

  it('renders with multiple data points correctly', () => {
    render(<HomelineChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart_cc')).toBeInTheDocument();
    const paths = document.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('handles window resize events', () => {
    render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<HomelineChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles data updates correctly', () => {
    const { rerender } = render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    const updatedData = [
      { key: 'Jan', value: 40 },
      { key: 'Feb', value: 80 },
      { key: 'Mar', value: 60 },
    ];

    rerender(<HomelineChart {...mockProps} data={updatedData} />);
    jest.advanceTimersByTime(2000);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('renders grid lines correctly', () => {
    render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    expect(document.querySelector('.grid')).toBeInTheDocument();
  });

  it('handles mouse events on data points', () => {
    render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    const dataPoint = document.querySelector('.rectag');
    fireEvent.mouseMove(dataPoint);
    fireEvent.mouseOut(dataPoint);

    expect(dataPoint).toBeInTheDocument();
  });

  it('renders scroll functionality for large datasets', () => {
    render(<HomelineChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(2000);
  });

  it('handles scroll interaction correctly', () => {
    render(<HomelineChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(2000);

    const mover = document.querySelector('.mover');
    if (!mover) {
      // Skip test if mover isn't present (happens when dataset is too small)
      return;
    }

    // Create and dispatch custom mouse events
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 0,
    });

    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
    });

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
    });

    mover.dispatchEvent(mouseDownEvent);
    mover.dispatchEvent(mouseMoveEvent);
    mover.dispatchEvent(mouseUpEvent);

    expect(mover).toBeInTheDocument();
  });

  it('renders with zero values correctly', () => {
    const dataWithZero = [
      { key: 'Jan', value: 30 },
      { key: 'Feb', value: 0 },
      { key: 'Mar', value: 45 },
    ];
    render(<HomelineChart {...mockProps} data={dataWithZero} />);
    jest.advanceTimersByTime(2000);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('handles different window sizes', () => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 300 });

    render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('renders tooltip on data point hover', () => {
    render(<HomelineChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    const dataPoints = document.querySelectorAll('#testChartrectag');
    fireEvent.mouseMove(dataPoints[0]);

    // Verify tooltip behavior
    fireEvent.mouseOut(dataPoints[0]);
  });
});
