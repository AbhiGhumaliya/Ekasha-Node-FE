import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PieChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('PieChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'A', value: 30 },
      { key: 'B', value: 70 },
    ],
    type: 'pie',
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
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('calls chart function after mounting', () => {
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000);
    expect(getById('testChartNewPieChart0')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<PieChart {...mockProps} data={[]} />);
    jest.runAllTimers();
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('handles mouse interactions on chart segments', () => {
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const pieSegment = getById('testChartNewPieChart0');
    expect(pieSegment).toBeInTheDocument();

    fireEvent.mouseMove(pieSegment);
    fireEvent.mouseOut(pieSegment);
  });

  it('handles legend item interactions', () => {
    render(
      <BrowserRouter>
        <PieChart {...mockProps} type="home" />
      </BrowserRouter>,
    );
    jest.advanceTimersByTime(2300);

    const legendItem = screen.getByText('A');
    expect(legendItem).toBeInTheDocument();

    fireEvent.mouseMove(legendItem);
    fireEvent.mouseOut(legendItem);
    fireEvent.click(legendItem);
  });

  it('handles window resize events', () => {
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChartNewPieChart0')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<PieChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('handles data with null or empty keys', () => {
    const dataWithNullKey = [
      { key: '', value: 30 },
      { key: null, value: 40 },
      { key: 'Valid', value: 30 },
    ];
    render(<PieChart {...mockProps} data={dataWithNullKey} />);
    jest.advanceTimersByTime(2300);
  });

  it('handles redirect on legend click in home type', () => {
    render(
      <BrowserRouter>
        <PieChart {...mockProps} type="home" />
      </BrowserRouter>,
    );
    jest.advanceTimersByTime(2300);

    const legendItem = screen.getByText('A');
    fireEvent.click(legendItem);
  });

  it('handles tooltip positioning at screen edges', () => {
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const pieSegment = getById('testChartNewPieChart0');
    fireEvent.mouseMove(pieSegment, {
      pageX: window.innerWidth - 50,
      pageY: 100,
      clientX: window.innerWidth - 50,
      clientY: 100,
    });
  });

  it('handles animation timing correctly', () => {
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000); // Animation duration

    const pieSegment = getById('testChartNewPieChart0');
    expect(pieSegment).toBeInTheDocument();
  });

  it('handles window mouseout events', () => {
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    fireEvent.mouseOut(window);
  });

  it('handles legend scroll behavior', () => {
    render(<PieChart {...mockProps} />);
    jest.advanceTimersByTime(2300);

    const legendContainer = getById('testChartcontenter');
    expect(legendContainer).toBeInTheDocument();

    fireEvent.scroll(legendContainer, { target: { scrollTop: 100 } });
  });
});
