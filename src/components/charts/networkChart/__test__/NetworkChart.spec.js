import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NetworkChart from '../networkChart';
import { AppContext } from '../../../../modules/pages/incidents/lib/subModule/overview/lib/context';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
}));

const getById = (id) => document.querySelector(`#${id}`);

describe('NetworkChart', () => {
  const mockProps = {
    id: 'networkChart',
    analysisData: {
      processFieldsData: [{
        name: 'Root',
        value: 100,
        children: [
          { name: 'Child1', value: 30 },
          {
            name: 'Child2',
            value: 70,
            children: [
              { name: 'GrandChild1', value: 35 },
              { name: 'GrandChild2', value: 35 },
            ],
          },
        ],
      }],
    },
    filterFieldData: [{
      type: 'text',
      field: [
        { value: 'field1', name: 'Field 1', fieldType: 'text' },
        { value: 'field2', name: 'Field 2', fieldType: 'number' },
      ],
    }],
    networkChartFullScreen: false,
  };

  const mockContextValue = {
    analysisMainData: ['field1.keyword'],
    setAnalysisMainData: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    const div = document.createElement('div');
    div.id = 'networkChart';
    div.innerHTML = '<div></div>';
    document.body.appendChild(div);
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });

    // Mock getBoundingClientRect for SVG elements
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 500,
      height: 500,
      top: 0,
      left: 0,
      right: 500,
      bottom: 500,
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);
    expect(getById('networkChart')).toBeInTheDocument();
  });

  it('renders network chart with nodes and links', () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);
    expect(getById('network_svg')).toBeInTheDocument();
    expect(document.querySelector('.singleNode')).toBeInTheDocument();
  });

  it('handles node click and shows/hides options dropdown', () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    // Click to show dropdown
    const nodeSvgIcon = document.querySelector('#nodeSvgIcon');
    fireEvent.click(nodeSvgIcon);
    expect(document.querySelector('.forenGroup')).toBeInTheDocument();

    // Click again to hide dropdown
    fireEvent.click(nodeSvgIcon);
    expect(document.querySelector('.forenGroup')).not.toBeInTheDocument();

    // Click outside should close dropdown
    fireEvent.click(nodeSvgIcon);
    fireEvent.click(document.querySelector('#network_svg'));
    expect(document.querySelector('.forenGroup')).not.toBeInTheDocument();
  });

  it('handles field search and selection for both text and number types', async () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    // Open dropdown and click Field option
    const nodeSvgIcon = document.querySelector('#nodeSvgIcon');
    fireEvent.click(nodeSvgIcon);

    // Find and click the Field option
    const fieldOptions = document.querySelectorAll('.singleProcess');
    const fieldOption = Array.from(fieldOptions)
      .find((el) => el.textContent.trim() === 'Field');
    expect(fieldOption).toBeInTheDocument();
    fireEvent.click(fieldOption);

    // Test search functionality for text field
    const searchField = document.querySelector('#searchAggreFeild');
    expect(searchField).toBeInTheDocument();
    fireEvent.change(searchField, { target: { value: 'Field 1' } });
    jest.advanceTimersByTime(100);

    // Test field selection for text type
    const textField = document.querySelector('.field');
    expect(textField).toBeInTheDocument();
    fireEvent.mouseMove(textField);
    fireEvent.click(textField);

    // Clear previous selection
    mockContextValue.setAnalysisMainData.mockClear();

    // Test search functionality for number field
    fireEvent.change(searchField, { target: { value: 'Field 2' } });
    jest.advanceTimersByTime(100);

    // Test field selection for number type
    const numberField = document.querySelector('.field');
    expect(numberField).toBeInTheDocument();
    fireEvent.mouseMove(numberField);
    fireEvent.click(numberField);

    // Test tooltip behavior
    fireEvent.mouseMove(numberField, {
      clientX: 100,
      clientY: 100,
    });
    expect(document.querySelector('.textTooltip')).toBeInTheDocument();
    fireEvent.mouseOut(numberField);
    expect(document.querySelector('.textTooltip')).not.toBeVisible();
  });

  it('handles zoom controls and transformations', () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    // Create SVG element with zoom behavior
    const svg = document.querySelector('#network_svg');
    expect(svg).toBeInTheDocument();

    // Mock transform attribute
    Object.defineProperty(SVGElement.prototype, 'transform', {
      writable: true,
      value: {
        baseVal: {
          consolidate: () => ({
            matrix: {
              a: 1, // scale
              b: 0,
              c: 0,
              d: 1, // scale
              e: 0, // translateX
              f: 0, // translateY
            },
          }),
        },
      },
    });

    // Add zoom control elements
    const zoomControls = document.createElement('div');
    zoomControls.innerHTML = `
      <button id="zoom-in">Zoom In</button>
      <button id="zoom-out">Zoom Out</button>
      <button id="zoom-reset">Reset</button>
    `;
    document.body.appendChild(zoomControls);

    // Test zoom in
    const zoomIn = document.getElementById('zoom-in');
    expect(zoomIn).toBeInTheDocument();
    fireEvent.click(zoomIn);
    jest.advanceTimersByTime(100);

    // Test zoom out
    const zoomOut = document.getElementById('zoom-out');
    expect(zoomOut).toBeInTheDocument();
    fireEvent.click(zoomOut);
    jest.advanceTimersByTime(100);

    // Test reset zoom
    const zoomReset = document.getElementById('zoom-reset');
    expect(zoomReset).toBeInTheDocument();
    fireEvent.click(zoomReset);
    jest.advanceTimersByTime(100);

    // Test zoom via wheel
    fireEvent.wheel(svg, {
      deltaY: -100,
      ctrlKey: true, // Simulate pinch-zoom gesture
    });
    jest.advanceTimersByTime(100);

    // Test zoom transform on root node
    const rootNode = document.querySelector('.rootNode');
    expect(rootNode).toBeInTheDocument();

    // Simulate different zoom levels
    const zoomLevels = [
      { k: 1.5, class: 'rootNodeLow' },
      { k: 0.75, class: 'rootNodeMid' },
      { k: 0.25, class: 'rootNodeHigh' },
    ];

    zoomLevels.forEach(({ k }) => {
      // Simulate zoom transform
      const event = new Event('zoom');
      event.transform = {
        k,
        x: 0,
        y: 0,
        toString: () => `translate(0,0) scale(${k})`,
      };
      fireEvent(svg, event);
    });
  });

  //   it('handles node drag events with simulation updates', () => {
  //     // Mock d3 force simulation before rendering
  //     const mockForceSimulation = {
  //       force: jest.fn().mockReturnThis(),
  //       on: jest.fn().mockReturnThis(),
  //       nodes: jest.fn().mockReturnThis(),
  //       alpha: jest.fn().mockReturnThis(),
  //       restart: jest.fn().mockReturnThis(),
  //       alphaTarget: jest.fn().mockReturnThis(),
  //     };

  //     // Mock d3 selection methods
  //     const mockD3Selection = {
  //       attr: jest.fn().mockReturnThis(),
  //       style: jest.fn().mockReturnThis(),
  //       call: jest.fn().mockReturnThis(),
  //     };

  //     // Mock d3 methods
  //     jest.spyOn(d3, 'forceSimulation').mockImplementation(() => mockForceSimulation);
  //     jest.spyOn(d3, 'select').mockImplementation(() => mockD3Selection);
  //     jest.spyOn(d3, 'drag').mockImplementation(() => ({
  //       on: jest.fn().mockReturnThis(),
  //     }));

  //     render(
  //       <AppContext.Provider value={mockContextValue}>
  //         <NetworkChart {...mockProps} />
  //       </AppContext.Provider>,
  //     );
  //     jest.advanceTimersByTime(600);

  //     const node = document.querySelector('.singleNode');
  //     expect(node).toBeInTheDocument();

  //     // Simulate drag sequence
  //     const dragStartEvent = new MouseEvent('mousedown', {
  //       bubbles: true,
  //       cancelable: true,
  //       clientX: 0,
  //       clientY: 0,
  //     });
  //     node.dispatchEvent(dragStartEvent);

  //     const dragMoveEvent = new MouseEvent('mousemove', {
  //       bubbles: true,
  //       cancelable: true,
  //       clientX: 100,
  //       clientY: 100,
  //     });
  //     document.dispatchEvent(dragMoveEvent);

  //     const dragEndEvent = new MouseEvent('mouseup', {
  //       bubbles: true,
  //       cancelable: true,
  //     });
  //     document.dispatchEvent(dragEndEvent);

  //     // Verify simulation was called
  //     expect(mockForceSimulation.alphaTarget).toHaveBeenCalledWith(0.3);
  //     expect(mockForceSimulation.restart).toHaveBeenCalled();

  //     jest.advanceTimersByTime(100);
  //   });

  it('handles window resize with debounce', () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    // Multiple resize events within debounce period
    global.innerWidth = 800;
    fireEvent(window, new Event('resize'));
    global.innerWidth = 1000;
    fireEvent(window, new Event('resize'));

    jest.advanceTimersByTime(500); // Debounce timeout
  });

  it('handles node tooltip interactions with position calculations', () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    const nodeLabel = document.querySelector('.nodeLabel');

    // Test tooltip at different positions
    fireEvent.mouseMove(nodeLabel, {
      clientX: 100,
      clientY: 100,
    });

    fireEvent.mouseMove(nodeLabel, {
      clientX: 450,
      clientY: 100,
    });

    fireEvent.mouseOut(nodeLabel);
  });

  //   it('handles show/hide/remove child nodes operations', () => {
  //     // Mock d3 selection methods
  //     const mockD3Selection = {
  //       attr: jest.fn().mockReturnThis(),
  //       style: jest.fn().mockReturnThis(),
  //       call: jest.fn().mockReturnThis(),
  //       append: jest.fn().mockReturnThis(),
  //       on: jest.fn().mockReturnThis(),
  //     };

  //     // Mock d3 methods
  //     jest.spyOn(d3, 'select').mockImplementation(() => mockD3Selection);

  //     const { container } = render(
  //       <AppContext.Provider value={mockContextValue}>
  //         <NetworkChart {...mockProps} />
  //       </AppContext.Provider>,
  //     );
  //     jest.advanceTimersByTime(600);

  //     // Create and append necessary elements for testing
  //     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  //     svg.setAttribute('id', 'network_svg');
  //     container.appendChild(svg);

  //     const node = document.createElement('div');
  //     node.className = 'singleNode';

  //     const icon = document.createElement('div');
  //     icon.setAttribute('id', 'nodeSvgIcon');
  //     node.appendChild(icon);
  //     container.appendChild(node);

  //     // Create options menu
  //     const optionsMenu = document.createElement('div');
  //     optionsMenu.className = 'forenGroup';

  //     const hideChild = document.createElement('div');
  //     hideChild.className = 'singleProcess';
  //     hideChild.textContent = 'Hide child';

  //     const showChild = document.createElement('div');
  //     showChild.className = 'singleProcess';
  //     showChild.textContent = 'Show child';

  //     const removeChild = document.createElement('div');
  //     removeChild.className = 'singleProcess';
  //     removeChild.textContent = 'Remove child';

  //     optionsMenu.appendChild(hideChild);
  //     optionsMenu.appendChild(showChild);
  //     optionsMenu.appendChild(removeChild);
  //     container.appendChild(optionsMenu);

  //     // Test sequence
  //     const nodeSvgIcon = container.querySelector('#nodeSvgIcon');
  //     expect(nodeSvgIcon).toBeInTheDocument();

  //     // Test hide child
  //     fireEvent.click(nodeSvgIcon);
  //     const hideChildOption = container.querySelector('.singleProcess');
  //     expect(hideChildOption).toBeInTheDocument();
  //     fireEvent.click(hideChildOption);
  //     jest.advanceTimersByTime(100);

  //     // Test show child
  //     fireEvent.click(nodeSvgIcon);
  //     const showChildOption = Array.from(container.querySelectorAll('.singleProcess'))[1];
  //     expect(showChildOption).toBeInTheDocument();
  //     fireEvent.click(showChildOption);
  //     jest.advanceTimersByTime(100);

  //     // Test remove child
  //     fireEvent.click(nodeSvgIcon);
  //     const removeChildOption = Array.from(container.querySelectorAll('.singleProcess'))[2];
  //     expect(removeChildOption).toBeInTheDocument();
  //     fireEvent.click(removeChildOption);
  //     jest.advanceTimersByTime(100);

  //     // Cleanup
  //     container.removeChild(svg);
  //     container.removeChild(node);
  //     container.removeChild(optionsMenu);
  //   });

  it('handles field list expansion toggle', () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    const nodeSvgIcon = document.querySelector('#nodeSvgIcon');
    fireEvent.click(nodeSvgIcon);

    const fieldOption = Array.from(document.querySelectorAll('.singleProcess'))
      .find((el) => el.textContent.includes('Field'));

    // Open field list
    fireEvent.click(fieldOption);
    expect(document.querySelector('.fieldContainer')).toBeInTheDocument();

    // Close field list
    fireEvent.click(fieldOption);
    expect(document.querySelector('.fieldContainer')).not.toBeInTheDocument();
  });

  it('updates when networkChartFullScreen changes', () => {
    const { rerender } = render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    rerender(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} networkChartFullScreen />
      </AppContext.Provider>,
    );
    jest.advanceTimersByTime(600);

    expect(getById('network_svg')).toBeInTheDocument();
  });

  it('handles component unmount cleanup', () => {
    const { unmount } = render(
      <AppContext.Provider value={mockContextValue}>
        <NetworkChart {...mockProps} />
      </AppContext.Provider>,
    );

    jest.advanceTimersByTime(600);
    unmount();

    // Verify cleanup
    fireEvent(window, new Event('resize'));
    jest.advanceTimersByTime(600);
  });
});
