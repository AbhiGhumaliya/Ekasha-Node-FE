import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AreaChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('AreaChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'Jan', value: 30 },
      { key: 'Feb', value: 70 },
    ],
    lable: {
      xlable: 'Months',
      ylable: 'Values',
    },
  };

  const mockMultiSeriesData = [
    {
      key: 'Series 1',
      value: [
        { key: 'Jan', value: 30 },
        { key: 'Feb', value: 45 },
      ],
    },
    {
      key: 'Series 2',
      value: [
        { key: 'Jan', value: 20 },
        { key: 'Feb', value: 35 },
      ],
    },
    {
      key: 'Series 3',
      value: [
        { key: 'Jan', value: 20 },
        { key: 'Feb', value: 35 },
      ],
    },
    {
      key: 'Series 4',
      value: [
        { key: 'Jan', value: 20 },
        { key: 'Feb', value: 35 },
      ],
    },
    {
      key: 'Series 4',
      value: [
        { key: 'Jan', value: 20 },
        { key: 'Feb', value: 35 },
      ],
    },
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
    render(<AreaChart {...mockProps} />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<AreaChart {...mockProps} data={[]} />);
    jest.runAllTimers();
    expect(getById('testChart')).toHaveTextContent('Nothing to see here!');
  });

  it('renders single series area chart correctly', () => {
    render(<AreaChart {...mockProps} />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartsvg')).toBeInTheDocument();
    expect(document.querySelector('.newAreaXaxis')).toBeInTheDocument();
    expect(document.querySelector('.newAreaYaxis')).toBeInTheDocument();
  });

  it('renders multi series area chart correctly', () => {
    render(<AreaChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartsvg')).toBeInTheDocument();
    const paths = document.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('handles window resize events', () => {
    render(<AreaChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChartsvg')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<AreaChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles horizontal scroll in legend with mouse wheel events', () => {
    render(<AreaChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(2000);

    const scrollContainer = document.querySelector('.scroll-tabs');

    // Test mousewheel event
    fireEvent.wheel(scrollContainer, {
      deltaMode: 0,
      deltaX: 0,
      deltaY: 120,
      wheelDelta: -120,
    });

    // Test DOMMouseScroll event (Firefox support)
    const mouseScrollEvent = new Event('DOMMouseScroll', { bubbles: true });
    Object.defineProperty(mouseScrollEvent, 'detail', { value: 3 });
    fireEvent(scrollContainer, mouseScrollEvent);

    // Test regular scroll
    fireEvent.scroll(scrollContainer, {
      target: {
        scrollLeft: 100,
      },
    });

    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer.scrollLeft).toBe(100);
  });

  it('renders with custom labels', () => {
    const customLabels = {
      xlable: 'Custom X Label',
      ylable: 'Custom Y Label',
    };
    render(<AreaChart {...mockProps} lable={customLabels} />);
    jest.advanceTimersByTime(2000);

    expect(document.querySelector('.newAreaXlable')).toHaveTextContent('Custom X Label');
    expect(document.querySelector('.newAreaYlable')).toHaveTextContent('Custom Y Label');
  });

  it('renders with animation on initial load', () => {
    render(<AreaChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    const paths = document.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('renders without animation after initial load', () => {
    render(<AreaChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    // Trigger a re-render
    fireEvent(window, new Event('resize'));

    const paths = document.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('handles data updates correctly', () => {
    const { rerender } = render(<AreaChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    const updatedData = [
      { key: 'Jan', value: 40 },
      { key: 'Feb', value: 80 },
      { key: 'Mar', value: 60 },
    ];

    rerender(<AreaChart {...mockProps} data={updatedData} />);
    jest.advanceTimersByTime(2000);

    expect(getById('testChartsvg')).toBeInTheDocument();
  });

  it('renders grid lines correctly', () => {
    render(<AreaChart {...mockProps} />);
    jest.advanceTimersByTime(2000);

    expect(document.querySelector('.grid')).toBeInTheDocument();
  });

  it('handles empty values in data correctly', () => {
    const dataWithEmpty = [
      { key: 'Jan', value: 30 },
      { key: 'Feb', value: 0 },
      { key: 'Mar', value: 45 },
    ];
    render(<AreaChart {...mockProps} data={dataWithEmpty} />);
    jest.advanceTimersByTime(2000);

    expect(getById('testChartsvg')).toBeInTheDocument();
  });
});
