export const actionTypes = {
  RESET: `@@${process.env.APPNAME}/dir/reset`,
  REFRESH: `@@${process.env.APPNAME}/dir/refresh`,
  LOAD_SUCCESS: `@@${process.env.APPNAME}/dir/load_sucess`,
  LOAD_FAILED: `@@${process.env.APPNAME}/dir/load_failed`,
};

export const actions = {
  reset: () => ({
    type: actionTypes.RESET
  }),
  refresh: () => ({
    type: actionTypes.REFRESH
  }),
  load_success: files => ({
    type: actionTypes.LOAD_SUCCESS,
    payload: files
  }),
  load_failed: message => ({
    type: actionTypes.LOAD_FAILED,
    payload: message
  }),
};
