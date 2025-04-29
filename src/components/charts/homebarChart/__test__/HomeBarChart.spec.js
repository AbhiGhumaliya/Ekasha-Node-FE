import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeBarChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('HomeBarChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'A', value: 30 },
      { key: 'B', value: 70 },
      { key: 'C', value: 50 },
      { key: 'D', value: 40 },
      { key: 'E', value: 60 },
      { key: 'F', value: 80 }, // Added more data points to test scrolling
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
    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('renders chart with data', () => {
    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    const bars = document.querySelectorAll('#testChartbar');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('displays no data message when data is empty', () => {
    render(<HomeBarChart {...mockProps} data={[]} />);
    jest.advanceTimersByTime(300);
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('handles mouse interactions on bars', () => {
    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const bars = document.querySelectorAll('#testChartbar');
    fireEvent.mouseMove(bars[0], {
      pageX: 100,
      pageY: 100,
    });

    fireEvent.mouseOut(bars[0]);
  });

  it('handles window resize events', () => {
    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChart')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<HomeBarChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles animation timing correctly', () => {
    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000); // Wait for animation to complete

    const bars = document.querySelectorAll('#testChartbar');
    expect(bars[0]).toHaveAttribute('height');
  });

  it('handles different data values correctly', () => {
    const customData = [
      { key: 'A', value: 100 },
      { key: 'B', value: 50 },
      { key: 'C', value: 75 },
    ];

    render(<HomeBarChart {...mockProps} data={customData} />);
    jest.advanceTimersByTime(300);

    const bars = document.querySelectorAll('#testChartbar');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('handles zero height/width container', () => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 0 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 0 });

    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const svg = document.querySelector('.horizontalBar_Svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('handles null container', () => {
    document.body.innerHTML = '';

    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    expect(document.querySelector('.horizontalBar_Svg')).not.toBeInTheDocument();
  });

  it('handles scroll functionality', () => {
    render(<HomeBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const mover = document.querySelector('.mover');
    if (mover) {
      fireEvent.mouseDown(mover);
      fireEvent(mover, new MouseEvent('drag', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
      }));
      fireEvent.mouseUp(mover);
    }
  });

  //   it('handles data with empty or null keys', () => {
  //     const dataWithEmptyKeys = [
  //       { key: '', value: 30 },
  //       { key: null, value: 40 },
  //       { key: 'Valid', value: 50 },
  //     ];

  //     render(<HomeBarChart {...mockProps} data={dataWithEmptyKeys} />);
  //     jest.advanceTimersByTime(300);

  //     const bars = document.querySelectorAll('#testChartbar');
  //     expect(bars.length).toBeGreaterThan(0);
  //   });

  it('handles large numbers with correct formatting', () => {
    const largeNumberData = [
      { key: 'A', value: 1000000 },
      { key: 'B', value: 2000000 },
    ];

    render(<HomeBarChart {...mockProps} data={largeNumberData} />);
    jest.advanceTimersByTime(300);

    const yAxisLabels = document.querySelectorAll('.newLineYaxis');
    expect(yAxisLabels.length).toBeGreaterThan(0);
  });
});
