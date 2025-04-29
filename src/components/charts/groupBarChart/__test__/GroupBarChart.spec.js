import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GroupBarChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('GroupBarChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'Category A', Undue: 30, Overdue: 20 },
      { key: 'Category B', Undue: 40, Overdue: 25 },
    ],
    KPI: false,
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
    render(<GroupBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<GroupBarChart {...mockProps} data={[]} />);
    jest.runAllTimers();
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('renders chart with data and handles mouse interactions', () => {
    render(<GroupBarChart {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const undueBar = document.querySelector('#testChartUndue');
    const overdueBar = document.querySelector('#testChartOverdue');

    expect(undueBar).toBeInTheDocument();
    expect(overdueBar).toBeInTheDocument();

    // Test mouse interactions
    fireEvent.mouseMove(undueBar, {
      pageX: 100,
      pageY: 100,
      clientX: 100,
      clientY: 100,
    });

    fireEvent.mouseOut(undueBar);

    fireEvent.mouseMove(overdueBar, {
      pageX: 200,
      pageY: 100,
      clientX: 200,
      clientY: 100,
    });

    fireEvent.mouseOut(overdueBar);
  });

  it('handles window resize events', () => {
    render(<GroupBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChart')).toBeInTheDocument();
  });

  it('renders with KPI mode enabled', () => {
    render(<GroupBarChart {...mockProps} KPI />);
    jest.advanceTimersByTime(2300);

    const kpiAxisElements = document.querySelectorAll('.kpiNewLineXaxis');
    expect(kpiAxisElements.length).toBeGreaterThan(0);
  });

  //   it('handles data with null or empty keys', () => {
  //     const dataWithNullKey = [
  //       { key: '', Undue: 30, Overdue: 20 },
  //       { key: null, Undue: 40, Overdue: 25 },
  //       { key: 'Valid', Undue: 50, Overdue: 30 },
  //     ];

  //     render(<GroupBarChart {...mockProps} data={dataWithNullKey} />);
  //     jest.advanceTimersByTime(2300);

  //     expect(getById('testChart')).toBeInTheDocument();
  //   });

  //   it('handles scroll functionality for large datasets', () => {
  //     const largeData = Array.from({ length: 20 }, (_, i) => ({
  //       key: `Category ${i}`,
  //       Undue: Math.random() * 100,
  //       Overdue: Math.random() * 100,
  //     }));

  //     render(<GroupBarChart {...mockProps} data={largeData} />);
  //     jest.advanceTimersByTime(2300);

  //     const brush = document.querySelector('.mover');
  //     expect(brush).toBeInTheDocument();

  //     // Test brush drag
  //     fireEvent.mouseDown(brush);
  //     fireEvent.mouseMove(brush, {
  //       clientX: 150,
  //       clientY: 0,
  //     });
  //     fireEvent.mouseUp(brush);
  //   });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<GroupBarChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles animation timing correctly', () => {
    render(<GroupBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Test initial animation
    const bars = document.querySelectorAll('rect');
    expect(bars.length).toBeGreaterThan(0);

    // Test animation timeout
    jest.advanceTimersByTime(2000);
  });

  it('handles tooltip positioning at screen edges', () => {
    render(<GroupBarChart {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const undueBar = document.querySelector('#testChartUndue');

    // Test tooltip at right edge
    fireEvent.mouseMove(undueBar, {
      pageX: window.innerWidth - 50,
      pageY: 100,
      clientX: window.innerWidth - 50,
      clientY: 100,
    });

    // Test tooltip at left edge
    fireEvent.mouseMove(undueBar, {
      pageX: 50,
      pageY: 100,
      clientX: 50,
      clientY: 100,
    });
  });
});
