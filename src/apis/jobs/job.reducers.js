export default (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }
  switch (action.type) {
    case 'GET_ALL_JOBS_SUCCESS':
    case 'GET_ALL_JOBS_ERROR':
      return {
        ...state,
        GetAllJobResponse: action.updatePayload,
      };
    case 'FAKE_ACTION_JOB':
      return [];
    default:
      return state;
  }
};
