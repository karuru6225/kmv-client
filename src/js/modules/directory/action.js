export const actionTypes = {
  REFRESH: `@@${APPNAME}/dir/refresh`,
  LOAD_SUCCESS: `@@${APPNAME}/dir/load_sucess`,
  LOAD_FAILED: `@@${APPNAME}/dir/load_failed`,
};

export const actions = {
  refresh: id => ({
    type: actionTypes.REFRESH,
    payload: id
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
