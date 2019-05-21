export const actionTypes = {
  ADD: `@@${process.env.APPNAME}/bookmark/add`,
  PLAY: `@@${process.env.APPNAME}/bookmark/play`,
  STORE_PLAYLIST: `@@${process.env.APPNAME}/bookmark/store_playlist`,
  NEXT: `@@${process.env.APPNAME}/bookmark/next`,
  STOP: `@@${process.env.APPNAME}/bookmark/stop`,
  REMOVE: `@@${process.env.APPNAME}/bookmark/remove`,
  LOADED_LISTS: `@@${process.env.APPNAME}/bookmark/load_list`,
  ADD_TO_LIST: `@@${process.env.APPNAME}/bookmark/add_to_list`,
  REMOVE_FROM_LIST: `@@${process.env.APPNAME}/bookmark/remove_from_list`,
};

export const actions = {
  loaded_lists: lists => ({
    type: actionTypes.LOADED_LISTS,
    payload: lists
  }),
  add_to_list: (listId, fileId) => ({
    type: actionTypes.ADD_TO_LIST,
    payload: {
      listId,
      fileId
    }
  }),
  remove_from_list: (listId, fileId) => ({
    type: actionTypes.REMOVE_FROM_LIST,
    payload: {
      listId,
      fileId
    }
  }),
  add: id => ({
    type: actionTypes.ADD,
    payload: id
  }),
  play: id => ({
    type: actionTypes.PLAY,
    payload: id
  }),
  store_playlist: files => ({
    type: actionTypes.STORE_PLAYLIST,
    payload: files
  }),
  next: () => ({
    type: actionTypes.NEXT,
  }),
  stop: () => ({
    type: actionTypes.STOP
  }),
  remove: id => ({
    type: actionTypes.DELETE,
    payload: id
  }),
};
