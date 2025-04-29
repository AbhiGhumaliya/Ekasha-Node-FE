import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LineChart from '../index';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

// Mock SVG functions
SVGElement.prototype.getTotalLength = () => 100;
SVGElement.prototype.getPointAtLength = () => ({ x: 0, y: 0 });
SVGElement.prototype.getBBox = () => ({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
});

const getById = (id) => document.querySelector(`#${id}`);

describe('LineChart', () => {
  const mockProps = {
    id: 'testChart',
    data: [
      { key: '2023-01', value: 30 },
      { key: '2023-02', value: 70 },
    ],
    lable: {
      xlable: 'Month',
      ylable: 'Value',
    },
    type: 'day',
  };

  const mockMultiSeriesData = [
    {
      key: 'Series1',
      values: [
        { key: 'Jan, 2023', value: 30, keyForVal: '2023-01' },
        { key: 'Feb, 2023', value: 70, keyForVal: '2023-02' },
      ],
    },
    {
      key: 'Series2',
      values: [
        { key: 'Jan, 2023', value: 40, keyForVal: '2023-01' },
        { key: 'Feb, 2023', value: 80, keyForVal: '2023-02' },
      ],
    },
  ];

  const mockKpiData = [
    { key: 'Jan, 2023', value: 30, keyForVal: '2023-01' },
    { key: 'Feb, 2023', value: 70, keyForVal: '2023-02' },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    const div = document.createElement('div');
    div.id = 'testChart';
    div.innerHTML = '<div></div>';
    document.body.appendChild(div);
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });

    // Mock D3 event
    global.d3 = {
      ...global.d3,
      event: {
        pageX: 100,
        pageY: 100,
      },
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    expect(getById('testChart')).toBeInTheDocument();
  });

  it('displays no data message when data is empty', () => {
    render(<LineChart {...mockProps} data={[]} />);
    jest.advanceTimersByTime(300);
    expect(screen.getByText('Nothing to see here!')).toBeInTheDocument();
  });

  it('renders single line chart correctly', () => {
    render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    expect(getById('testChart_cc')).toBeInTheDocument();
    expect(document.querySelector('.line')).toBeInTheDocument();
  });

  it('renders multi-series line chart correctly', () => {
    render(<LineChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(300);
    expect(document.querySelectorAll('.line').length).toBeGreaterThan(0);
  });

  it('handles mouse interactions on data points', () => {
    render(<LineChart {...mockProps} data={mockKpiData} kpiStatus />);
    jest.advanceTimersByTime(300);

    const dataPoint = document.querySelector('.rectag');
    if (dataPoint) {
      fireEvent.mouseMove(dataPoint);
      expect(document.querySelector('.Ytooltip')).toBeInTheDocument();

      fireEvent.mouseOut(dataPoint);
    }
  });

  it('handles window resize events', () => {
    render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    global.innerWidth = 1000;
    global.innerHeight = 800;
    fireEvent(window, new Event('resize'));

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('updates chart when data changes', () => {
    const { rerender } = render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const newData = [
      { key: '2023-01', value: 40 },
      { key: '2023-02', value: 80 },
    ];

    rerender(<LineChart {...mockProps} data={newData} />);
    jest.advanceTimersByTime(300);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('handles KPI status with custom line color', () => {
    render(<LineChart {...mockProps} data={mockKpiData} kpiStatus kpiLineColor="#FF0000" />);
    jest.advanceTimersByTime(300);

    const line = document.querySelector('.line');
    if (line) {
      expect(line).toHaveStyle({ stroke: '#FF0000' });
    }
  });

  it('handles different time types (hour, minute)', () => {
    render(<LineChart {...mockProps} type="hour" />);
    jest.advanceTimersByTime(300);
    expect(document.querySelector('.newLineYaxis')).toBeInTheDocument();

    const { rerender } = render(<LineChart {...mockProps} type="minute" />);
    rerender(<LineChart {...mockProps} type="minute" />);
    jest.advanceTimersByTime(300);
  });

  it('handles mouse interactions on multi-series chart', () => {
    render(<LineChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(300);

    const chartPath = document.querySelector('.line path');
    if (chartPath) {
      fireEvent.mouseMove(chartPath, {
        clientX: 250,
        clientY: 250,
      });
      fireEvent.mouseOut(chartPath);
    }
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<LineChart {...mockProps} />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles chart size changes', () => {
    const { rerender } = render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    rerender(<LineChart {...mockProps} chartSizeChange />);
    jest.advanceTimersByTime(300);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('renders correct axis labels', () => {
    render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    const xLabel = document.querySelector('.newLineXLable');
    const yLabel = document.querySelector('.newLineYLable');

    if (xLabel && yLabel) {
      expect(xLabel).toHaveTextContent('Month');
      expect(yLabel).toHaveTextContent('Value');
    }
  });

  it('handles KPI legend display', () => {
    render(<LineChart {...mockProps} data={mockKpiData} kpiStatus kpiLegend />);
    jest.advanceTimersByTime(300);

    expect(document.querySelector('.kpiNewLineXaxis')).toBeInTheDocument();
  });

  it('handles data sorting', () => {
    const unsortedData = [
      { key: '2023-02', value: 70 },
      { key: '2023-01', value: 30 },
    ];
    render(<LineChart {...mockProps} data={unsortedData} />);
    jest.advanceTimersByTime(300);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  // Additional test cases to increase coverage

  it('handles multi-series chart with empty values', () => {
    const emptyMultiSeriesData = [
      {
        key: 'Series1',
        values: [],
      },
    ];
    render(<LineChart {...mockProps} data={emptyMultiSeriesData} />);
    jest.advanceTimersByTime(300);
  });

  it('handles tooltip positioning on right edge', () => {
    render(<LineChart {...mockProps} data={mockKpiData} kpiStatus />);
    jest.advanceTimersByTime(300);

    const dataPoint = document.querySelector('.rectag');
    if (dataPoint) {
      // Simulate mouse move near right edge
      fireEvent.mouseMove(dataPoint, {
        clientX: window.innerWidth - 50,
        clientY: 100,
      });
      expect(document.querySelector('.Ytooltip')).toBeInTheDocument();
    }
  });

  it('handles grid lines rendering', () => {
    render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    expect(document.querySelector('.grid')).toBeInTheDocument();
  });

  it('handles chart with null values', () => {
    const dataWithNull = [
      { key: '2023-01', value: null },
      { key: '2023-02', value: 70 },
    ];
    render(<LineChart {...mockProps} data={dataWithNull} />);
    jest.advanceTimersByTime(300);
    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('handles chart with missing labels', () => {
    render(<LineChart {...mockProps} lable={{}} />);
    jest.advanceTimersByTime(300);
    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('handles multi-series chart mouse interactions with tooltip', () => {
    render(<LineChart {...mockProps} data={mockMultiSeriesData} />);
    jest.advanceTimersByTime(300);

    const chartArea = document.querySelector('.line_Svg');
    if (chartArea) {
      fireEvent.mouseMove(chartArea, {
        clientX: 250,
        clientY: 250,
      });
      fireEvent.mouseOut(chartArea);
    }
  });

  it('handles component updates with different props', () => {
    const { rerender } = render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Update multiple props
    rerender(<LineChart
      {...mockProps}
      type="hour"
      kpiStatus
      data={mockKpiData}
      chartSizeChange
    />);
    jest.advanceTimersByTime(300);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('handles chart resize with different dimensions', () => {
    render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);

    // Change element dimensions
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 300 });

    fireEvent(window, new Event('resize'));
    jest.advanceTimersByTime(300);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('handles mount state changes correctly', () => {
    render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(300);
    jest.advanceTimersByTime(2000); // Wait for mount state to change

    expect(getById('testChart_cc')).toBeInTheDocument();
  });

  it('updates when chartSizeChange prop changes', () => {
    const { rerender } = render(<LineChart {...mockProps} />);
    jest.advanceTimersByTime(2300);

    rerender(<LineChart {...mockProps} chartSizeChange />);
    jest.advanceTimersByTime(300);

    expect(getById('testChart_cc')).toBeInTheDocument();
  });
});
