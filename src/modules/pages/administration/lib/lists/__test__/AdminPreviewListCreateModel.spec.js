import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import PreviewListCreateModel from '../lib/PreviewListCreateModel';
import { findByTestAtrrFirst } from '../../../../../../helpers/lib/testUtils';

jest.useFakeTimers();

const defaultProps = {
  preListModalType: 'preNewList',
  setPreListModalType: jest.fn(),
  submitListData: jest.fn(),
  submitLoading: false,
  listDataType: 'url',
  setPreviewListModelLoading: jest.fn(),
  previewListModelLoading: false,
  values: {},
  setValues: jest.fn(),
};

const setUp = (props = {}) => {
  const setupProps = { ...defaultProps, ...props };
  return mount(<PreviewListCreateModel {...setupProps} />);
};

describe('NewPreviewListData Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setUp();
  });

  it('Should render component without crashing', () => {
    const component = findByTestAtrrFirst(wrapper, 'ekasha_new_update_modal');
    expect(component.length).toBe(1);
  });

  it('Should render ZsModal with correct props', () => {
    const modal = wrapper.find('ZsModal');
    expect(modal.prop('visible')).toBe('preNewList');
    expect(modal.prop('title')).toBe('New List Data');
  });

  it('Should render ZsInput with correct props', () => {
    const input = wrapper.find('ZsInput');
    expect(input.prop('label')).toBe('URL Value');
    expect(input.prop('maxLength')).toBe('twoZeroFourEight');
  });

  it('Should render ZsButton with correct props', () => {
    const button = wrapper.find('ZsButton');
    expect(button.prop('title')).toBe('Create');
    expect(button.prop('disabled')).toBe(true);
  });

  it('Should call setValues when input value changes', () => {
    const input = wrapper.find('ZsInput');
    act(() => {
      input.prop('onChange')({ target: { value: 'https://example.com' } });
    });
    expect(defaultProps.setValues).toHaveBeenCalledWith({ value: 'https://example.com' });
  });

  it('Should call submitListData when submit button is clicked with valid input', () => {
    wrapper.setProps({ values: { value: 'https://example.com' } });
    const button = wrapper.find('ZsButton');
    act(() => {
      button.prop('onClick')();
    });
    expect(defaultProps.submitListData).toHaveBeenCalledWith({ value: 'https://example.com' });
  });

  it('Should not call submitListData when submit button is clicked with invalid input', () => {
    wrapper.setProps({ values: { value: 'invalid-url' } });
    const button = wrapper.find('ZsButton');
    act(() => {
      button.prop('onClick')();
    });
    expect(defaultProps.submitListData).not.toHaveBeenCalled();
  });

  it('Should call closePreviewList when modal is closed', () => {
    const modal = wrapper.find('ZsModal');
    act(() => {
      modal.prop('onHide')();
    });
    expect(defaultProps.setPreListModalType).toHaveBeenCalledWith('');
    expect(defaultProps.setPreviewListModelLoading).toHaveBeenCalledWith(false);
  });

  it('Should render loading spinner when previewListModelLoading is true', () => {
    wrapper.setProps({ previewListModelLoading: true });
    expect(wrapper.find('ZsSpin').exists()).toBe(true);
  });

  it('Should change title and button text for edit mode', () => {
    wrapper.setProps({ preListModalType: 'preEditList' });
    expect(wrapper.find('ZsModal').prop('title')).toBe('Edit List Data');
    expect(wrapper.find('ZsButton').prop('title')).toBe('Update');
  });

  it('Should focus on input field after modal opens', () => {
    const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(focusSpy).toHaveBeenCalled();
  });

  it('Should handle different list data types', () => {
    ['url', 'ip', 'domain'].forEach((type) => {
      wrapper.setProps({ listDataType: type });
      const input = wrapper.find('ZsInput');
      let expectedMaxLength;
      switch (type) {
        case 'url':
          expectedMaxLength = 'twoZeroFourEight';
          break;
        case 'domain':
          expectedMaxLength = 'twoFiftyFive';
          break;
        default:
          expectedMaxLength = 'normal';
      }
      expect(input.prop('maxLength')).toBe(expectedMaxLength);
    });
  });

  it('Should show error message for invalid input', () => {
    wrapper.setProps({ values: { value: 'invalid-url' } });
    const button = wrapper.find('ZsButton');
    act(() => {
      button.prop('onClick')();
    });
    wrapper.update();
    const input = wrapper.find('ZsInput');
    expect(input.prop('error')).toBe(true);
    expect(input.prop('errormsg')).toBe('Please enter valid URL.');
  });
});
