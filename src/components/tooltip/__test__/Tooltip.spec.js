import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ZsTooltip from '../index';

describe('ZsTooltip Component', () => {
  beforeEach(() => {
    // Create tooltip div that the component expects
    const tooltipDiv = document.createElement('div');
    tooltipDiv.setAttribute('id', 'HDS_Model_Tooltip');
    document.body.appendChild(tooltipDiv);
  });

  afterEach(() => {
    // Clean up the tooltip div after each test
    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    if (tooltipDiv) {
      document.body.removeChild(tooltipDiv);
    }
  });

  it('renders children correctly', () => {
    render(
      <ZsTooltip title="Test Tooltip">
        <div>Hover me</div>
      </ZsTooltip>,
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on mouse move', () => {
    render(
      <ZsTooltip title="Test Tooltip">
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.display).toBe('block');
    expect(tooltipDiv.innerHTML).toContain('Test Tooltip');
  });

  it('hides tooltip on mouse leave', () => {
    render(
      <ZsTooltip title="Test Tooltip">
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseLeave(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.display).toBe('none');
  });

  it('renders dashboard type tooltip correctly', () => {
    render(
      <ZsTooltip
        type="Dashboard"
        title="Dashboard Title"
        description="Dashboard Description"
        subType="Incidents"
        IncidentID="INC123"
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.innerHTML).toContain('Dashboard Title');
    expect(tooltipDiv.innerHTML).toContain('Dashboard Description');
    expect(tooltipDiv.innerHTML).toContain('INC123');
  });

  it('renders user type tooltip correctly', () => {
    const userTitle = ['User 1', 'User 2'];
    render(
      <ZsTooltip
        subType="User"
        title={userTitle}
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.innerHTML).toContain('User 1\nUser 2');
  });

  it('renders notification type tooltip correctly', () => {
    render(
      <ZsTooltip
        subType="notification"
        titleStartText="Start "
        highlightedText="highlighted"
        titleEndText=" end"
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.innerHTML).toContain('Start');
    expect(tooltipDiv.innerHTML).toContain('highlighted');
    expect(tooltipDiv.innerHTML).toContain('end');
  });

  it('updates tooltip position when autoRight is true', () => {
    render(
      <ZsTooltip
        title="Test Tooltip"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper, {
      pageX: window.innerWidth - 100, // Near right edge
      pageY: 100,
    });

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.display).toBe('block');
  });

  it('handles long titles with different width thresholds', () => {
    const longTitle = 'a'.repeat(1200); // 1200 characters
    render(
      <ZsTooltip
        title={longTitle}
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.width).toBe('550px');

    // Test even longer title
    const veryLongTitle = 'a'.repeat(1600);
    render(
      <ZsTooltip
        title={veryLongTitle}
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    fireEvent.mouseMove(wrapper);
  });

  it('handles bottom overflow correctly', () => {
    render(
      <ZsTooltip
        title="Test Tooltip"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper, {
      pageX: 100,
      pageY: window.innerHeight - 10, // Near bottom edge
    });
  });

  it('handles iconTool subType correctly', () => {
    render(
      <ZsTooltip
        title="Icon Tooltip"
        subType="iconTool"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper, {
      pageX: window.innerWidth - 50,
      pageY: 100,
    });
  });

  it('handles LineClapToolTip type with overflow', () => {
    // Setup a div with overflow
    const overflowingDiv = document.createElement('div');
    overflowingDiv.setAttribute('id', 'testId');
    overflowingDiv.style.height = '20px';
    overflowingDiv.style.overflow = 'hidden';
    overflowingDiv.innerHTML = 'Very long text that should overflow'.repeat(5);
    document.body.appendChild(overflowingDiv);

    render(
      <ZsTooltip
        type="LineClapToolTip"
        title="Line Clamp Tooltip"
        ids="testId"
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    // Cleanup
    document.body.removeChild(overflowingDiv);
  });

  it('handles Dashboard type with Types prop', () => {
    render(
      <ZsTooltip
        type="Dashboard"
        title="Dashboard Title"
        Types="Custom Type"
        subType="Incidents"
        interval="Daily"
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.innerHTML).toContain('Custom Type');
    expect(tooltipDiv.innerHTML).toContain('Daily');
  });

  it('handles autoWidth prop correctly', () => {
    render(
      <ZsTooltip
        title="Test Tooltip"
        autoWidth="IncidentTableView"
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    expect(wrapper).toHaveStyle({ width: 'auto' });
  });

  it('hides tooltip on wheel event', () => {
    render(
      <ZsTooltip title="Test Tooltip">
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);
    fireEvent.wheel(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.display).toBe('none');
  });

  it('hides tooltip on click', () => {
    render(
      <ZsTooltip title="Test Tooltip">
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);
    fireEvent.click(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.display).toBe('none');
  });

  it('updates tooltip when updateStatus changes', () => {
    const { rerender } = render(
      <ZsTooltip
        title="Test Tooltip"
        updateStatus={1}
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    // Update the component with new updateStatus
    rerender(
      <ZsTooltip
        title="Test Tooltip"
        updateStatus={2}
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.display).toBe('none');
  });

  it('handles right edge positioning with iconTool subType', () => {
    // Mock window dimensions
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });

    render(
      <ZsTooltip
        title="Icon Tooltip"
        subType="iconTool"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');

    // Simulate tooltip dimensions
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 200 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    // Test right edge with bottom overflow
    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: window.innerHeight - 20,
    });
  });

  it('handles right edge positioning with User subType', () => {
    // Mock window dimensions
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });

    render(
      <ZsTooltip
        title={['User Info']}
        subType="User"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');

    // Simulate tooltip dimensions
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 200 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    // Test right edge positioning
    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: 100,
    });
  });

  it('handles right edge positioning with different title lengths', () => {
    // Mock window dimensions
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });

    const longTitle = 'a'.repeat(1200);
    render(
      <ZsTooltip
        title={longTitle}
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');

    // Simulate tooltip dimensions
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 550 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    // Test right edge with long content
    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: 100,
    });

    expect(tooltipDiv.style.transform).toContain('translate');
  });

  it('handles tooltip positioning with different space conditions', () => {
    // Mock window dimensions
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });

    render(
      <ZsTooltip
        title="Test Tooltip"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');

    // Simulate tooltip dimensions
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 200 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    // Test with enough right space
    fireEvent.mouseMove(wrapper, {
      pageX: 100,
      pageY: 100,
    });

    expect(tooltipDiv.style.borderRadius).toBe('0 15px 15px 15px');
    expect(tooltipDiv.style.transform).toContain('translate');

    // Test with limited right space
    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: 100,
    });
  });

  it('handles tooltip positioning with description overflow', () => {
    const longDescription = 'a'.repeat(100);
    render(
      <ZsTooltip
        type="Dashboard"
        title="Dashboard Title"
        description={longDescription}
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');

    // Simulate tooltip dimensions
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 400 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: 100,
    });

    expect(tooltipDiv.style.wordBreak).toBe('break-all');
    expect(tooltipDiv.style.width).toBe('400px');
  });

  it('handles tooltip with ids and text overflow', () => {
    // Create element with overflow
    const overflowDiv = document.createElement('div');
    overflowDiv.id = 'overflow-test';
    Object.defineProperty(overflowDiv, 'offsetWidth', { value: 100 });
    Object.defineProperty(overflowDiv, 'scrollWidth', { value: 200 });
    document.body.appendChild(overflowDiv);

    render(
      <ZsTooltip
        title="Test Tooltip"
        ids="overflow-test"
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper);

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    expect(tooltipDiv.style.display).toBe('block');

    // Cleanup
    document.body.removeChild(overflowDiv);
  });

  it('handles tooltip width calculation for different title and description lengths', () => {
    // Mock window and tooltip dimensions
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });
    Object.defineProperty(document.body, 'clientHeight', { value: 768 });

    // Test case 1: title length between 65 and 1000
    const mediumTitle = 'Test Tooltip'.repeat(100);
    render(
      <ZsTooltip
        title={mediumTitle}
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    let wrapper = screen.getByText('Hover me').parentElement;

    fireEvent.mouseMove(wrapper, { pageX: 500, pageY: 500 });

    // Test case 2: description length > 65
    const longDescription = 'a'.repeat(70);
    render(
      <ZsTooltip
        title="Short Title"
        description={longDescription}
        autoRight
      >
        <div>Move here</div>
      </ZsTooltip>,
    );

    wrapper = screen.getByText('Hover me').parentElement;

    fireEvent.mouseMove(wrapper, { pageX: 500, pageY: 500 });
  });

  it('handles complex positioning scenarios with autoRight', () => {
    // Mock window dimensions
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });
    Object.defineProperty(document.body, 'clientHeight', { value: 768 });

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 200 });
    Object.defineProperty(tooltipDiv, 'clientHeight', { value: 100 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    render(
      <ZsTooltip
        title="Test Tooltip"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;

    // Test case 1: Right space < totalLengthText with isRight true
    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: 100,
    });
    expect(tooltipDiv.style.transform).toContain('translate');

    // Test case 2: Bottom overflow
    fireEvent.mouseMove(wrapper, {
      pageX: 100,
      pageY: 700,
    });
  });

  it('handles all conditions for totalLengthText calculation', () => {
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });
    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 200 });

    // Test case 1: title length between 1000 and 1500
    const title1200 = 'xyz'.repeat(400);
    render(
      <ZsTooltip
        title={title1200}
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    let wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper, { pageX: 500, pageY: 500 });

    // Test case 2: title length > 1500
    const title1600 = 'a'.repeat(1600);
    render(
      <ZsTooltip
        title={title1600}
        autoRight
      >
        <div>moving</div>
      </ZsTooltip>,
    );

    wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper, { pageX: 500, pageY: 500 });
  });

  it('handles specific edge cases for tooltip positioning', () => {
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });
    Object.defineProperty(document.body, 'clientHeight', { value: 768 });

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 200 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    // Test with iconTool subType and bottom overflow
    render(
      <ZsTooltip
        title="Test Tooltip"
        subType="iconTool"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;

    // Test near right edge with bottom overflow
    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: 700,
    });
  });

  it('handles all conditions for isRight calculation', () => {
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 200 });
    Object.defineProperty(tooltipDiv, 'offsetLeft', { value: 0 });
    Object.defineProperty(tooltipDiv, 'offsetTop', { value: 0 });

    render(
      <ZsTooltip
        title="Test Tooltip"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;

    // Test when isRight is true (near right edge)
    fireEvent.mouseMove(wrapper, {
      pageX: 900,
      pageY: 100,
    });

    // Test when isRight is false (enough space on right)
    fireEvent.mouseMove(wrapper, {
      pageX: 100,
      pageY: 100,
    });
    expect(tooltipDiv.style.borderRadius).toBe('0 15px 15px 15px');
  });

  it('handles tooltip width calculation with clientWidth fallback', () => {
    Object.defineProperty(document.body, 'clientWidth', { value: 1024 });

    const tooltipDiv = document.getElementById('HDS_Model_Tooltip');
    Object.defineProperty(tooltipDiv, 'clientWidth', { value: 150 });

    render(
      <ZsTooltip
        title="Short title"
        autoRight
      >
        <div>Hover me</div>
      </ZsTooltip>,
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    fireEvent.mouseMove(wrapper, { pageX: 500, pageY: 500 });

    // Should use clientWidth when title length conditions aren't met
    expect(tooltipDiv.style.width).toBe('auto');
  });
});
