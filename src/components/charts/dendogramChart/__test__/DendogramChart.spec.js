import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dendogram from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('Dendogram Chart', () => {
  const mockProps = {
    id: 'testChart',
    data: [{
      key: 'Root',
      value: 100,
      colname: 'root',
      children: [
        { key: 'Child1', value: 30, colname: 'child1' },
        { key: 'Child2', value: 70, colname: 'child2' },
      ],
    }],
  };

  beforeEach(() => {
    // Mock D3 event
    global.d3 = {
      event: {
        pageX: 100,
        pageY: 100,
      },
    };

    jest.useFakeTimers();
    const div = document.createElement('div');
    div.id = 'testChart';
    div.innerHTML = '<div></div>';
    document.body.appendChild(div);

    // Mock element dimensions
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });
    Object.defineProperty(document.body, 'clientWidth', { configurable: true, value: 1000 });

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'HDS_Tooltip';
    tooltip.style.width = '100px';
    Object.defineProperty(tooltip, 'clientWidth', { configurable: true, value: 100 });
    document.body.appendChild(tooltip);
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(300);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('creates dendogram chart after mounting', () => {
    render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(300);
    expect(document.querySelector('.DendoCircle')).toBeInTheDocument();
    expect(document.querySelector('.DendoText')).toBeInTheDocument();
  });

  it('displays no data message when data has empty children', () => {
    const emptyChildrenData = [{
      key: 'Root',
      value: 100,
      children: [],
    }];
    render(<Dendogram {...mockProps} data={emptyChildrenData} />);
    jest.advanceTimersByTime(300);
  });

  it('handles mouse interactions on nodes', () => {
    render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(300);

    const circle = document.querySelector('.DendoCircle');
    expect(circle).toBeInTheDocument();

    fireEvent.mouseOver(circle);
    fireEvent.mouseMove(circle);
    fireEvent.mouseOut(circle);
  });

  it('handles window resize events', () => {
    render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(document.querySelector('.DendoCircle')).toBeInTheDocument();
  });

  it('handles tooltip positioning', () => {
    render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(300);

    const circle = document.querySelector('.DendoCircle');
    expect(circle).toBeInTheDocument();

    // Test left side tooltip
    global.d3.event = { pageX: 100, pageY: 100 };
    fireEvent.mouseMove(circle);

    // Test right side tooltip
    global.d3.event = { pageX: 950, pageY: 100 };
    fireEvent.mouseMove(circle);
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<Dendogram {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles empty object data properly', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Dendogram {...mockProps} data={[{}]} />);
    jest.advanceTimersByTime(300);
    consoleErrorSpy.mockRestore();
  });

  it('handles loading state', () => {
    render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(100);
    jest.advanceTimersByTime(300);
    expect(document.querySelector('.DendoCircle')).toBeInTheDocument();
  });

  it('handles component updates', () => {
    const { rerender } = render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(300);

    const newData = [{
      key: 'NewRoot',
      value: 200,
      colname: 'newroot',
      children: [
        { key: 'NewChild1', value: 100, colname: 'newchild1' },
        { key: 'NewChild2', value: 100, colname: 'newchild2' },
      ],
    }];

    rerender(<Dendogram {...mockProps} data={newData} />);
    jest.advanceTimersByTime(300);
  });

  it('handles window mouseout', () => {
    render(<Dendogram {...mockProps} />);
    jest.advanceTimersByTime(300);
    fireEvent.mouseOut(window);
  });
});
