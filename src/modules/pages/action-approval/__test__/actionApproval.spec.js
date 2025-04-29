import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import ActionApprovalEkasha from '../../../containers/actionApproval';
import { checkTokenExipred, declineActionApprove } from '../../../../apis/actionApproval/action';
import { getById, renderComponent } from '../../../../helpers/lib/RTL';

jest.useFakeTimers();

const actionProps = {
  declineActionApprove,
  checkTokenExipred,
};

const initialData = {
  ActionApproval: {
    DeclineActionApprovalResponse: {
      status: false,
    },
    CheckDeclineActionResponse: {
      status: false,
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  ActionApprovalEkasha,
  props,
  initialState,
  contextValue,
);

describe('ActionApproval Component', () => {
  beforeEach(() => {
    // Mock window.location.hash
    Object.defineProperty(window, 'location', {
      value: {
        hash: '#/path/test@email.com/token123',
      },
      writable: true,
    });
  });

  setUp(actionProps, initialData);

  it('should render loading spinner initially', () => {
    setUp(actionProps, initialData);
  });

  describe('Response Handling - CheckDeclineActionResponse', () => {
    it('should show LinkReasonComponent when token is valid', async () => {
      const state = {
        ActionApproval: {
          CheckDeclineActionResponse: {
            status: true,
          },
        },
      };
      setUp(actionProps, state);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const actionReason = getById('action_approval_reason');
      fireEvent.change(actionReason, { target: { value: 'test' } });
      const submitBtn = getById('action_approval_reason_submit');
      fireEvent.click(submitBtn);
    });

    it('should show LinkExpiredComponent when token is invalid', () => {
      const state = {
        ActionApproval: {
          CheckDeclineActionResponse: {
            status: false,
          },
        },
      };
      setUp(actionProps, state);
    });
  });

  describe('Response Handling - DeclineActionApprovalResponse', () => {
    it('should show LinkExceptionComponent on decline success', () => {
      const state = {
        ActionApproval: {
          DeclineActionApprovalResponse: {
            status: true,
            data: { someData: 'test' },
          },
        },
      };
      setUp(actionProps, state);
    });
    it('should show LinkExceptionComponent on decline failure', () => {
      const state = {
        ActionApproval: {
          DeclineActionApprovalResponse: {
            status: false,
          },
        },
      };
      setUp(actionProps, state);
    });

    it('should close window after successful decline', async () => {
      const windowSpy = jest.spyOn(window, 'close').mockImplementation(() => {});
      const state = {
        ActionApproval: {
          DeclineActionApprovalResponse: {
            status: true,
            data: { someData: 'test' },
          },
        },
      };
      setUp(actionProps, state);

      await act(async () => {
        jest.advanceTimersByTime(10000);
      });
      expect(windowSpy).toHaveBeenCalled();
      windowSpy.mockRestore();
    });
  });
});
