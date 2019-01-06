export const actionTypes = {
  RESET: `@@${process.env.APPNAME}/dir/reset`,
  REFRESH: `@@${process.env.APPNAME}/dir/refresh`,
  CHANGE_PAGE: `@@${process.env.APPNAME}/dir/change_page`,
  SORT_CONDITION: `@@${process.env.APPNAME}/dir/sort_condition`,
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
  change_page: (page) => ({
    type: actionTypes.CHANGE_PAGE,
    payload: page
  }),
  sort_condition: (column, desc) => ({
    type: actionTypes.CHANGE_PAGE,
    payload: {
      column,
      desc
    }
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
