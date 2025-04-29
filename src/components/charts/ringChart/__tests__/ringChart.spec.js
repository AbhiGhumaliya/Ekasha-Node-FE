import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EkashaRingChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('EkashaRingChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'A', value: 30 },
      { key: 'B', value: 70 },
    ],
    type: 'ring',
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
    render(<EkashaRingChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('calls chart function after mounting', () => {
    render(<EkashaRingChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
  });
  it('displays no data message when data is empty', () => {
    render(<EkashaRingChart {...mockProps} data={[]} />);
    jest.runAllTimers();

    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });
  it('Click on chart ', () => {
    render(<EkashaRingChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
    // click on testChartNewRingchart0
    fireEvent.click(getById('testChartNewRingchart0'));
    const legendItems = screen.getByText('A');
    expect(legendItems).toBeInTheDocument();
    fireEvent.click(legendItems);
  });
  it('Mounse move on chart ', () => {
    render(<EkashaRingChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
    // click on testChartNewRingchart0
    fireEvent.mouseMove(getById('testChartNewRingchart0'), {
      clientX: 100,
      clientY: 100,
    });

    const legend = document.querySelector('.ringli');
    fireEvent.mouseOver(legend);
    fireEvent.mouseOut(legend);
  });
  it('Mounse mouse out on chart ', () => {
    render(<EkashaRingChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
    // click on testChartNewRingchart0
    fireEvent.mouseOut(getById('testChartNewRingchart0'));
  });
  it('handles window resize events', () => {
    render(<EkashaRingChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChartNewRingchart0')).toBeInTheDocument();
  });
  it('handles attribute filtering with plus icon', () => {
    const mockSetIncidentFilter = jest.fn();
    render(
      <EkashaRingChart
        {...mockProps}
        subType="attributeAnalysis"
        incidentFilter={[]}
        setIncidentFilter={mockSetIncidentFilter}
      />,
    );
    jest.advanceTimersByTime(2300);

    const plusIcon = document.querySelector('#nodeSvgPlusIcon');
    fireEvent.click(plusIcon);
    fireEvent.mouseMove(getById('testChartNewRingchart0'), {
      clientX: 100,
      clientY: 100,
    });
    const legend = document.querySelector('.ringli');
    fireEvent.mouseOver(legend);
    fireEvent.mouseOut(legend);
    fireEvent.mouseOut(getById('testChartNewRingchart0'));
    expect(mockSetIncidentFilter).toHaveBeenCalledWith([
      { field: 'assignedToName', value: 'A', operator: 'eq' },
    ]);
  });
  it('handles attribute filtering with minus icon', () => {
    const mockSetIncidentFilter = jest.fn();
    render(
      <EkashaRingChart
        {...mockProps}
        subType="attributeAnalysis"
        incidentFilter={[]}
        setIncidentFilter={mockSetIncidentFilter}
      />,
    );
    jest.advanceTimersByTime(2300);

    const minusIcon = document.querySelector('#nodeSvgMinusIcon');
    fireEvent.click(minusIcon);

    expect(mockSetIncidentFilter).toHaveBeenCalledWith([
      { field: 'assignedToName', value: 'A', operator: '!eq' },
    ]);
  });
  it('updates existing filter when clicking plus/minus icons', () => {
    const existingFilter = [{ field: 'assignedToName', value: 'A', operator: 'eq' }];
    const mockSetIncidentFilter = jest.fn();
    render(
      <EkashaRingChart
        {...mockProps}
        subType="attributeAnalysis"
        incidentFilter={existingFilter}
        setIncidentFilter={mockSetIncidentFilter}
      />,
    );
    jest.advanceTimersByTime(2300);

    const minusIcon = document.querySelector('#nodeSvgMinusIcon');
    fireEvent.click(minusIcon);

    expect(mockSetIncidentFilter).toHaveBeenCalledWith([
      { field: 'assignedToName', value: 'A', operator: '!eq' },
    ]);
  });
  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<EkashaRingChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });
  it('handles custom dashboard chart type', () => {
    render(<EkashaRingChart {...mockProps} chartType="customDash" />);
    jest.advanceTimersByTime(2300);

    const legendItems = document.querySelectorAll('.ringli span');
    expect(legendItems[0]).toHaveStyle({ display: 'flex' });
  });
  it('handles legend item interactions', () => {
    render(
      <BrowserRouter>
        <EkashaRingChart {...mockProps} type="home" />
      </BrowserRouter>,
    );
    jest.advanceTimersByTime(2300); // Wait for both 300ms and 2000ms timeouts
    const legendItems = screen.getByText('A');
    expect(legendItems).toBeInTheDocument(); // Add assertion to verify element exists
    fireEvent.mouseOut(legendItems);
    fireEvent.mouseMove(legendItems, {
      pageX: 200,
      pageY: 100,
      clientX: 200,
      clientY: 100,
    });
    fireEvent.mouseMove(legendItems, {
      pageX: window.innerWidth - 50,
      pageY: 100,
      clientX: window.innerWidth - 50,
      clientY: 100,
    });
    fireEvent.click(legendItems);
  });
  // Test window mouseout handler
  it('handles window mouseout events', () => {
    render(<EkashaRingChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    fireEvent.mouseOut(window);
    // Should trigger toolOut
  });
});
