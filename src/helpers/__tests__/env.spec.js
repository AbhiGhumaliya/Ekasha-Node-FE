import { retryLazy, callLogout } from '../envData';
// Mock a function that fails a certain number of times before succeeding

describe('retryLazy', () => {
  it('should reject with the last error if max retries reached without success', async () => {
    // Mock a function that always fails
    const alwaysFailingFunction = jest.fn().mockRejectedValue(new Error('Failed'));

    // Call retryLazy with the always failing function and 3 retries
    await expect(retryLazy(alwaysFailingFunction, 4, 1000)).rejects.toThrow('Failed');

    // Ensure the function was called the expected number of times
    expect(alwaysFailingFunction).toHaveBeenCalledTimes(4); // Called 4 times because of retries
  });

  it('should resolve immediately if function succeeds on first try', async () => {
    // Mock a function that immediately succeeds
    const immediateSuccessFunction = jest.fn().mockResolvedValue('Success');

    // Call retryLazy with the immediately succeeding function
    const result = await retryLazy(immediateSuccessFunction, 5, 1000);

    // Ensure the function was called only once
    expect(immediateSuccessFunction).toHaveBeenCalledTimes(1);

    // Ensure the function succeeded
    expect(result).toBe('Success');
  });
});
describe('callLogout', () => {
  it('should clear localStorage and redirect to "/"', () => {
    // Call callLogout function
    callLogout();
  });
});
