import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HorizontalBar from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('HorizontalBar', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'A', value: 30 },
      { key: 'B', value: 70 },
    ],
    lable: {
      xlable: 'x axis',
      ylable: 'y axis',
    },
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
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('renders chart with data', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);
    const bars = document.querySelectorAll('.bar');
    expect(bars.length).toBe(2); // Should match the number of data points
  });

  it('displays no data message when data is empty', () => {
    render(<HorizontalBar {...mockProps} data={[]} />);
    jest.advanceTimersByTime(300);
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('handles mouse interactions on bars', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    const bars = document.querySelectorAll('.bar');
    fireEvent.mouseMove(bars[0], {
      pageX: 100,
      pageY: 100,
    });

    // Test tooltip position when close to right edge
    fireEvent.mouseMove(bars[0], {
      pageX: window.innerWidth - 50,
      pageY: 100,
    });

    fireEvent.mouseOut(bars[0]);
  });

  it('handles window resize events', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChart')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<HorizontalBar {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('renders with custom labels', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    const xLabel = document.querySelector('.newBarXlable');
    const yLabel = document.querySelector('.newBarYlable');

    expect(xLabel).toHaveTextContent('X axis');
    expect(yLabel).toHaveTextContent('Y axis');
  });

  it('renders without labels when not provided', () => {
    render(<HorizontalBar {...mockProps} lable={{}} />);
    jest.advanceTimersByTime(300);

    const xLabel = document.querySelector('.newBarXlable');
    const yLabel = document.querySelector('.newBarYlable');

    expect(xLabel).toHaveTextContent('');
    expect(yLabel).toHaveTextContent('');
  });

  it('handles animation timing correctly', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000); // Wait for animation to complete

    const bars = document.querySelectorAll('.bar');
    expect(bars[0]).toHaveAttribute('width');
  });

  it('handles different data values correctly', () => {
    const customData = [
      { key: 'A', value: 100 },
      { key: 'B', value: 50 },
      { key: 'C', value: 75 },
    ];

    render(<HorizontalBar {...mockProps} data={customData} />);
    jest.advanceTimersByTime(300);

    const bars = document.querySelectorAll('.bar');
    expect(bars.length).toBe(3);
  });

  it('handles zero height/width container', () => {
    // Reset dimensions to 0
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 0 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 0 });

    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    const svg = document.querySelector('.line_Svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('handles null container', () => {
    document.body.innerHTML = ''; // Remove the container

    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    expect(document.querySelector('.line_Svg')).not.toBeInTheDocument();
  });

  it('creates gradient with correct attributes', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    const gradient = document.querySelector(`#${mockProps.id}gradient`);
    expect(gradient).toBeInTheDocument();
  });

  it('renders grid lines correctly', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('handles axis rendering correctly', () => {
    render(<HorizontalBar {...mockProps} />);
    jest.advanceTimersByTime(300);

    const xAxisText = document.querySelector('.newBarYaxis');
    const yAxisText = document.querySelector('.newBarXaxis');
    expect(xAxisText).toBeInTheDocument();
    expect(yAxisText).toBeInTheDocument();
  });
});
