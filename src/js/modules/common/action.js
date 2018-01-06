export const actionTypes = {
  INIT: `@@${APPNAME}/common/init`,
  LOAD_START: `@@${APPNAME}/common/load_start`,
  LOAD_FINISH: `@@${APPNAME}/common/load_finish`,
};

export const actions = {
  init: () => ({
    type: actionTypes.INIT
  }),
  loadStart: () => ({
    type: actionTypes.LOAD_START
  }),
  loadFinish: () => ({
    type: actionTypes.LOAD_FINISH
  }),
};
