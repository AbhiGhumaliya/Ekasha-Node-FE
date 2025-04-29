import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('TableChart', () => {
  const mockProps = {
    id: 'testTable',
    data: [
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' },
    ],
  };

  beforeEach(() => {
    jest.useFakeTimers();
    const div = document.createElement('div');
    div.id = 'testTable';
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
    render(<TableChart {...mockProps} />);
    jest.advanceTimersByTime(0);
    expect(getById('testTable')).toBeInTheDocument();
  });

  it('renders table with correct data', () => {
    render(<TableChart {...mockProps} />);
    jest.advanceTimersByTime(0);

    const headers = document.querySelectorAll('th');
    expect(headers[0]).toHaveTextContent('name');
    expect(headers[1]).toHaveTextContent('age');
    expect(headers[2]).toHaveTextContent('city');

    const cells = document.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('John');
    expect(cells[1]).toHaveTextContent('30');
    expect(cells[2]).toHaveTextContent('New York');
  });

  it('displays no data message when data is empty', () => {
    render(<TableChart {...mockProps} data={[]} />);
    jest.advanceTimersByTime(0);
    expect(getById('testTable')).toContainHTML('Nothing to see here!');
  });

  it('displays no data message when data is null', () => {
    render(<TableChart {...mockProps} data={null} />);
    jest.advanceTimersByTime(0);
    expect(getById('testTable')).toContainHTML('Nothing to see here!');
  });

  it('handles window resize events', () => {
    render(<TableChart {...mockProps} />);
    jest.advanceTimersByTime(0);

    // Trigger resize event
    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testTable')).toBeInTheDocument();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<TableChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('handles element with no dimensions', () => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 0 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 0 });

    render(<TableChart {...mockProps} />);
    jest.advanceTimersByTime(0);

    // Should not create table when dimensions are 0
    expect(document.querySelector('table')).not.toBeInTheDocument();
  });

  it('clears existing content before rendering new table', () => {
    render(<TableChart {...mockProps} />);
    jest.advanceTimersByTime(0);

    // Re-render with new data
    render(<TableChart {...mockProps} data={[{ name: 'Alice', age: 35, city: 'Paris' }]} />);
    jest.advanceTimersByTime(0);

    const cells = document.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('Alice');
    expect(cells[1]).toHaveTextContent('35');
    expect(cells[2]).toHaveTextContent('Paris');
  });

  it('handles null element case', () => {
    document.body.innerHTML = ''; // Remove the test element
    render(<TableChart {...mockProps} />);
    jest.advanceTimersByTime(0);
    // Should not throw error when element is not found
  });

  it('updates on data change', () => {
    const { rerender } = render(<TableChart {...mockProps} />);
    jest.advanceTimersByTime(0);

    const newData = [
      { name: 'Bob', age: 40, city: 'Berlin' },
    ];

    rerender(<TableChart id="testTable" data={newData} />);
    jest.advanceTimersByTime(0);

    const cells = document.querySelectorAll('td');
    expect(cells[0]).toHaveTextContent('Bob');
    expect(cells[1]).toHaveTextContent('40');
    expect(cells[2]).toHaveTextContent('Berlin');
  });
});
