import React from 'react';
import { mount } from 'enzyme';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DrageContent from '../lib/dragPanel';

describe('DrageContent Component', () => {
  const mockHandleDrop = jest.fn();
  const defaultProps = {
    span: <div>Drag Item</div>,
    item: { id: 1, name: 'Test Chart' },
    handleDrop: mockHandleDrop,
  };

  const wrapper = (props = defaultProps) => mount(
    <DndProvider backend={HTML5Backend}>
      <DrageContent {...props} />
    </DndProvider>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const component = wrapper();
    expect(component.exists()).toBe(true);
  });

  it('should render the span content', () => {
    const component = wrapper();
    expect(component.find('.renderDragItem').text()).toBe('Drag Item');
  });

  it('should render with default props when no props provided', () => {
    const component = wrapper({});
    expect(component.exists()).toBe(true);
  });

  it('should have DragPreviewImage component', () => {
    const component = wrapper();
    expect(component.find('DragPreviewImage').exists()).toBe(true);
  });

  it('should have proper drag configuration', () => {
    const component = wrapper();
    const dragConfig = component.find('DrageContent').prop('item');
    expect(dragConfig).toEqual({ id: 1, name: 'Test Chart' });
  });
});
