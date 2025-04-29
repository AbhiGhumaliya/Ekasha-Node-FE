import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HalfPie from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('HalfPieChart', () => {
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
    const tooltip = document.createElement('div');
    tooltip.id = 'HDS_Tooltip';
    tooltip.style.width = '100px';
    Object.defineProperty(tooltip, 'clientWidth', { configurable: true, value: 1000 });
    document.body.appendChild(tooltip);
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('calls chart function after mounting', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<HalfPie {...mockProps} data={[]} />);
    jest.runAllTimers();
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('handles mouse interactions on chart segments', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const chartSegment = getById('testChartNewRingchart0');
    expect(chartSegment).toBeInTheDocument();

    // Test mousemove
    fireEvent.mouseMove(chartSegment, {
      pageX: 100,
      pageY: 100,
    });

    // Test mouseout
    fireEvent.mouseOut(chartSegment);
  });

  it('handles legend interactions', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const legendItem = screen.getByText('A');
    expect(legendItem).toBeInTheDocument();

    // Test legend mouseover
    fireEvent.mouseOver(legendItem);

    // Test legend mouseout
    fireEvent.mouseOut(legendItem);

    // Test legend click
    fireEvent.click(legendItem);
  });

  it('handles window resize events', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<HalfPie {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('handles animation timing correctly', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(200); // Initial chart render delay
    jest.advanceTimersByTime(2000); // Animation duration

    const chartSegment = getById('testChartNewRingchart0');
    expect(chartSegment).toBeInTheDocument();
  });

  it('handles multiple data points correctly', () => {
    const multipleDataProps = {
      ...mockProps,
      data: [
        { key: 'A', value: 20 },
        { key: 'B', value: 30 },
        { key: 'C', value: 25 },
        { key: 'D', value: 25 },
      ],
    };

    render(<HalfPie {...multipleDataProps} />);
    jest.advanceTimersByTime(2300);

    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
    expect(getById('testChartNewRingchart3')).toBeInTheDocument();
  });

  it('handles tooltip positioning', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const chartSegment = getById('testChartNewRingchart0');

    // Test tooltip at different positions
    fireEvent.mouseMove(chartSegment, {
      pageX: 100,
      pageY: 100,
    });

    fireEvent.mouseMove(chartSegment, {
      pageX: window.innerWidth - 50,
      pageY: 100,
    });
  });

  it('handles window mouseout events', () => {
    render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(300);

    fireEvent.mouseOut(window);
  });

  it('handles re-renders with new data', () => {
    const { rerender } = render(<HalfPie {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const newData = [
      { key: 'X', value: 40 },
      { key: 'Y', value: 60 },
    ];

    rerender(<HalfPie {...mockProps} data={newData} />);
    jest.advanceTimersByTime(2300);

    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Y')).toBeInTheDocument();
  });
});
