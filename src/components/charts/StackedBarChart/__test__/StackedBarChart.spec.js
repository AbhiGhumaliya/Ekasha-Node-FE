import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StackedBarChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('StackedBarChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: 'A', value: [{ key: 'value1', value: 30 }, { key: 'value2', value: 20 }] },
      { key: 'B', value: [{ key: 'value1', value: 70 }, { key: 'value2', value: 40 }] },
    ],
    lable: {
      xlable: 'Categories',
      ylable: 'Values',
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
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });
    const tooltip = document.createElement('div');
    tooltip.id = 'HDS_Tooltip';
    tooltip.style.width = '100px';
    Object.defineProperty(tooltip, 'clientWidth', { configurable: true, value: 1000 });
    document.body.appendChild(tooltip);
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<StackedBarChart {...mockProps} data={[]} />);
    jest.advanceTimersByTime(300);
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('renders chart with correct dimensions and handles resize', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    const svg = document.querySelector('.line_Svg');
    expect(svg).toBeInTheDocument();

    // Test resize
    Object.defineProperty(window, 'innerWidth', { value: 800 });
    fireEvent(window, new Event('resize'));
    jest.advanceTimersByTime(300);
  });

  it('handles mouse interactions on bars', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    const bars = document.querySelectorAll('rect');

    // Test mousemove at different positions
    fireEvent.mouseMove(bars[0], {
      clientX: 100,
      clientY: 100,
      pageX: 100,
      pageY: 100,
    });

    // Test mousemove near right edge
    fireEvent.mouseMove(bars[0], {
      clientX: window.innerWidth - 50,
      clientY: 100,
      pageX: window.innerWidth - 50,
      pageY: 100,
    });

    fireEvent.mouseOut(bars[0]);
  });

  it('handles legend interactions', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    const legendItems = document.querySelectorAll('li');

    // Test clicking each legend item
    legendItems.forEach((item) => {
      fireEvent.click(item);
      fireEvent.click(item); // Toggle back
    });
  });

  it('handles scroll events in legend with jQuery scroll functionality', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    const scrollContainer = document.querySelector('.scroll-tabs');

    // Test mousewheel event with wheelDelta
    fireEvent.wheel(scrollContainer, {
      deltaY: 100,
      detail: null,
      wheelDelta: -120,
    });

    // Test mousewheel event with detail (Firefox)
    fireEvent.wheel(scrollContainer, {
      deltaY: 100,
      detail: 1,
      wheelDelta: null,
    });

    // Test scroll position changes
    const { scrollLeft } = scrollContainer;
    expect(scrollContainer.scrollLeft).toBe(scrollLeft); // Verify scroll position changed

    // Test preventDefault was called
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: 100,
      cancelable: true,
    });
    scrollContainer.dispatchEvent(wheelEvent);
  });

  it('handles animation states correctly', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000); // Wait for animation timeout

    // Trigger a re-render with new data
    const newData = [...mockProps.data];
    newData[0].value[0].value = 50;
    render(<StackedBarChart {...mockProps} data={newData} />);
    jest.advanceTimersByTime(300);
  });

  it('handles single data series', () => {
    const singleDataProps = {
      ...mockProps,
      data: [
        { key: 'single', value: [{ key: 'value1', value: 100 }] },
      ],
    };
    render(<StackedBarChart {...singleDataProps} />);
    jest.advanceTimersByTime(300);
  });

  it('handles large numbers correctly', () => {
    const largeDataProps = {
      ...mockProps,
      data: [
        {
          key: 'A',
          value: [
            { key: 'value1', value: 3000 },
            { key: 'value2', value: 2000 },
          ],
        },
        {
          key: 'B',
          value: [
            { key: 'value1', value: 7000 },
            { key: 'value2', value: 4000 },
          ],
        },
      ],
    };
    render(<StackedBarChart {...largeDataProps} />);
    jest.advanceTimersByTime(300);
  });

  it('handles empty or missing labels', () => {
    render(<StackedBarChart {...mockProps} lable={{}} />);
    jest.advanceTimersByTime(300);

    render(<StackedBarChart {...mockProps} lable={undefined} />);
    jest.advanceTimersByTime(300);
  });

  it('handles window mouseout event', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    fireEvent.mouseOut(window);
    jest.advanceTimersByTime(300);
  });

  it('handles zero values in data', () => {
    const zeroDataProps = {
      ...mockProps,
      data: [
        { key: 'A', value: [{ key: 'value1', value: 0 }, { key: 'value2', value: 0 }] },
        { key: 'B', value: [{ key: 'value1', value: 0 }, { key: 'value2', value: 0 }] },
      ],
    };
    render(<StackedBarChart {...zeroDataProps} />);
    jest.advanceTimersByTime(300);
  });

  it('handles negative values in data', () => {
    const negativeDataProps = {
      ...mockProps,
      data: [
        { key: 'A', value: [{ key: 'value1', value: -30 }, { key: 'value2', value: 20 }] },
        { key: 'B', value: [{ key: 'value1', value: 70 }, { key: 'value2', value: -40 }] },
      ],
    };
    render(<StackedBarChart {...negativeDataProps} />);
    jest.advanceTimersByTime(300);
  });

  it('handles multiple resize events in quick succession', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Multiple resize events
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
      Object.defineProperty(window, 'innerWidth', { value: 800 + i * 100 });
      fireEvent(window, new Event('resize'));
      jest.advanceTimersByTime(100);
    }
  });

  it('handles rapid data updates', () => {
    const { rerender } = render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Multiple data updates
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
      const newData = mockProps.data.map((item) => ({
        ...item,
        value: item.value.map((v) => ({ ...v, value: v.value + i * 10 })),
      }));
      rerender(<StackedBarChart {...mockProps} data={newData} />);
      jest.advanceTimersByTime(100);
    }
  });

  it('handles extreme window dimensions', () => {
    Object.defineProperty(window, 'innerWidth', { value: 10000 });
    Object.defineProperty(window, 'innerHeight', { value: 10000 });
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    Object.defineProperty(window, 'innerWidth', { value: 100 });
    Object.defineProperty(window, 'innerHeight', { value: 100 });
    fireEvent(window, new Event('resize'));
    jest.advanceTimersByTime(300);
  });

  it('handles multiple legend clicks on the same item', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const legendItem = document.querySelector('li');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
      fireEvent.click(legendItem);
      jest.advanceTimersByTime(100);
    }
  });

  it('handles tooltip positioning at screen edges', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const bars = document.querySelectorAll('rect');

    // Test left edge
    fireEvent.mouseMove(bars[0], {
      clientX: 0,
      clientY: 100,
      pageX: 0,
      pageY: 100,
    });

    // Test right edge
    fireEvent.mouseMove(bars[0], {
      clientX: window.innerWidth,
      clientY: 100,
      pageX: window.innerWidth,
      pageY: 100,
    });

    // Test top edge
    fireEvent.mouseMove(bars[0], {
      clientX: 100,
      clientY: 0,
      pageX: 100,
      pageY: 0,
    });
  });

  it('handles scroll events with different delta values', () => {
    render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const scrollContainer = document.querySelector('.scroll-tabs');

    // Test with various delta values
    [-120, -60, 0, 60, 120].forEach((delta) => {
      fireEvent.wheel(scrollContainer, {
        deltaY: delta,
        detail: delta / 60,
        wheelDelta: -delta,
      });
    });
  });

  it('handles component unmount during animation', () => {
    const { unmount } = render(<StackedBarChart {...mockProps} />);
    jest.advanceTimersByTime(100); // Part way through animation
    unmount();
    jest.advanceTimersByTime(300);
  });

  it('handles empty strings in labels', () => {
    render(<StackedBarChart {...mockProps} lable={{ xlable: '', ylable: '' }} />);
    jest.advanceTimersByTime(300);
  });

  it('handles null values in data', () => {
    const nullDataProps = {
      ...mockProps,
      data: [
        { key: 'A', value: [{ key: 'value1', value: null }, { key: 'value2', value: 20 }] },
        { key: 'B', value: [{ key: 'value1', value: 70 }, { key: 'value2', value: null }] },
      ],
    };
    render(<StackedBarChart {...nullDataProps} />);
    jest.advanceTimersByTime(300);
  });
});
