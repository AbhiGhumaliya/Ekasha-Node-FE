import { act } from 'react';
import { fireEvent } from '@testing-library/react';
import { getById } from './RTL';

/**
 * Creates a reusable scroll test suite
 * @param {Object} config Configuration object for the scroll tests
 * @param {Function} config.setUp - Setup function for the component
 * @param {Object} config.actionProps - Action props for the component
 * @param {Object} config.initialData - Initial state data
 * @param {string} config.scrollContainerId - ID of the scroll container
 * @param {string} config.mockActionName - Name of the action to mock (e.g., 'roleGetAction')
 * @param {Array} config.scrollTestCases - Array of test cases for scroll behavior
 * @param {string} config.responseKey - Key path to the response in initialData
 * (e.g., 'Role.RoleGetAllResponse')
 */
export const createScrollTests = ({
  setUp,
  actionProps,
  initialData,
  contextValue,
  scrollContainerId,
  mockActionName,
  mockResulteData,
  dataFormat,
  responseKey,
}) => {
  const scrollTestCases = [
    {
      scenario: 'should trigger nextPage when all conditions are met',
      scrollConfig: {
        scrollTop: 300,
        scrollHeight: 494, // 300 + 200 - 6
        offsetHeight: 200,
      },
      responseData: dataFormat === 'content' ? {
        number: 0,
        content: Array(30).fill(mockResulteData[0]),
        totalElements: 60,
        totalPages: 2,
      } : dataFormat === 'IncidentTableView' ? {
        currentPage: 0,
        data: Array(30).fill(mockResulteData[0]),
        totalCount: 60,
        totalPages: 2,
      } : dataFormat === 'logData' ? {
        number: 0,
        logData: Array(30).fill(mockResulteData[0]),
        totalCount: 60,
      } : dataFormat === 'artifactData' ? {
        currentPage: 0,
        artifactData: Array(30).fill(mockResulteData[0]),
        TotalCount: 60,
        totalPages: 2,
      } : {
        currentPage: 0,
        totalElement: Array(30).fill(mockResulteData[0]),
        totalCount: 60,
        totalPages: 2,
      },
      expectedToBeCalled: true,
    },
    {
      scenario: 'should not trigger when scrollTop is 0',
      scrollConfig: {
        scrollTop: 0,
        scrollHeight: 194, // 200 - 6
        offsetHeight: 200,
      },
      responseData: dataFormat === 'content' ? {
        number: 0,
        content: Array(30).fill(mockResulteData[0]),
        totalElements: 60,
        totalPages: 2,
      } : dataFormat === 'IncidentTableView' ? {
        currentPage: 0,
        data: Array(30).fill(mockResulteData[0]),
        totalCount: 60,
        totalPages: 2,
      } : dataFormat === 'logData' ? {
        number: 0,
        logData: Array(30).fill(mockResulteData[0]),
        totalCount: 60,
      } : dataFormat === 'artifactData' ? {
        currentPage: 0,
        artifactData: Array(30).fill(mockResulteData[0]),
        TotalCount: 60,
        totalPages: 2,
      } : {
        currentPage: 0,
        totalElement: Array(30).fill(mockResulteData[0]),
        totalCount: 60,
        totalPages: 2,
      },
      expectedToBeCalled: false,
    },
    {
      scenario: 'should not trigger when totalCount <= dataSource.length',
      scrollConfig: {
        scrollTop: 0,
        scrollHeight: 306,
        offsetHeight: 200,
      },
      responseData: dataFormat === 'content' ? {
        number: 0,
        content: Array(30).fill(mockResulteData[0]),
        totalElements: 100,
        totalPages: 4,
      } : dataFormat === 'IncidentTableView' ? {
        currentPage: 0,
        data: Array(30).fill(mockResulteData[0]),
        totalCount: 100,
        totalPages: 4,
      } : dataFormat === 'logData' ? {
        number: 0,
        logData: Array(30).fill(mockResulteData[0]),
        totalCount: 100,
      } : dataFormat === 'artifactData' ? {
        currentPage: 0,
        artifactData: Array(30).fill(mockResulteData[0]),
        TotalCount: 100,
        totalPages: 4,
      } : {
        currentPage: 0,
        totalElement: Array(30).fill(mockResulteData[0]),
        totalCount: 100,
        totalPages: 4,
      },
      expectedToBeCalled: false,
    },
    {
      scenario: 'should not trigger when totalCount < 30',
      scrollConfig: {
        scrollTop: 100,
        scrollHeight: 306,
        offsetHeight: 200,
      },
      responseData: dataFormat === 'content' ? {
        number: 0,
        content: Array(20).fill(mockResulteData[0]),
        totalElements: 20,
        totalPages: 1,
      } : dataFormat === 'IncidentTableView' ? {
        currentPage: 0,
        data: Array(20).fill(mockResulteData[0]),
        totalCount: 20,
        totalPages: 1,
      } : dataFormat === 'logData' ? {
        number: 0,
        logData: Array(30).fill(mockResulteData[0]),
        totalCount: 20,
      } : dataFormat === 'artifactData' ? {
        currentPage: 0,
        artifactData: Array(20).fill(mockResulteData[0]),
        TotalCount: 20,
        totalPages: 1,
      } : {
        currentPage: 0,
        totalElement: Array(20).fill(mockResulteData[0]),
        totalCount: 20,
        totalPages: 1,
      },
      expectedToBeCalled: false,
    },
  ];

  describe('Scroll Functionality Tests', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it.each(scrollTestCases)('$scenario', async ({ scrollConfig, responseData }) => {
      const actionMock = jest.fn();

      // Create modified action props with the mock
      const modifiedActionProps = {
        ...actionProps,
        [mockActionName]: actionMock,
      };

      // Create modified initial data with the response
      const modifiedInitialData = {
        ...initialData,
      };
      // Set the response data using the provided key path
      const keys = responseKey.split('.');
      let current = modifiedInitialData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = {
            status: true,
            data: responseData,
          };
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });

      setUp(modifiedActionProps, modifiedInitialData, contextValue);

      const scrollContainer = getById(scrollContainerId);
      expect(scrollContainer).toBeInTheDocument();

      await act(async () => {
        Object.defineProperties(scrollContainer, {
          offsetHeight: { configurable: true, value: scrollConfig.offsetHeight },
          scrollHeight: { configurable: true, value: scrollConfig.scrollHeight },
          scrollTop: { configurable: true, value: scrollConfig.scrollTop },
        });

        fireEvent.scroll(scrollContainer);
        jest.advanceTimersByTime(1200);
      });
    });
  });
};
