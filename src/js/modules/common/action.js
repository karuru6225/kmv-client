export const actionTypes = {
  INIT: `@@${APPNAME}/common/init`,
  CHANGE_CURRENT: `@@${APPNAME}/common/change_current`,
  LOAD_START: `@@${APPNAME}/common/load_start`,
  LOAD_FINISH: `@@${APPNAME}/common/load_finish`,
};

export const actions = {
  init: () => ({
    type: actionTypes.INIT
  }),
  change_current: current => ({
    type: actionTypes.CHANGE_CURRENT,
    payload: current
  }),
  load_start: () => ({
    type: actionTypes.LOAD_START
  }),
  load_finish: () => ({
    type: actionTypes.LOAD_FINISH
  }),
};
