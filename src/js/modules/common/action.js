export const actionTypes = {
  INIT: `@@${process.env.APPNAME}/common/init`,
  LOAD_START: `@@${process.env.APPNAME}/common/load_start`,
  LOAD_FINISH: `@@${process.env.APPNAME}/common/load_finish`,
  CHANGE_CURRENT: `@@${process.env.APPNAME}/common/change_current`,
};

export const actions = {
  init: () => ({
    type: actionTypes.INIT
  }),
  change_current: file => ({
    type: actionTypes.CHANGE_CURRENT,
    payload: file
  }),
  load_start: () => ({
    type: actionTypes.LOAD_START
  }),
  load_finish: () => ({
    type: actionTypes.LOAD_FINISH
  }),
};
