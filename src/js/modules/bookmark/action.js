export const actionTypes = {
  ADD: `@@${process.env.APPNAME}/bookmark/add`,
  PLAY: `@@${process.env.APPNAME}/bookmark/play`,
  STORE_PLAYLIST: `@@${process.env.APPNAME}/bookmark/store_playlist`,
  NEXT: `@@${process.env.APPNAME}/bookmark/next`,
  STOP: `@@${process.env.APPNAME}/bookmark/stop`,
  REMOVE: `@@${process.env.APPNAME}/bookmark/remove`,
};

export const actions = {
  add: (id) => ({
    type: actionTypes.ADD,
    payload: id
  }),
  play: (id) => ({
    type: actionTypes.PLAY,
    payload: id
  }),
  store_playlist: (files) => ({
    type: actionTypes.STORE_PLAYLIST,
    payload: files
  }),
  next: () => ({
    type: actionTypes.NEXT,
  }),
  stop: () => ({
    type: actionTypes.STOP
  }),
  remove: (id) => ({
    type: actionTypes.DELETE,
    payload: id
  }),
};
