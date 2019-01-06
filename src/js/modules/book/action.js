export const actionTypes = {
  RESET: `@@${process.env.APPNAME}/book/reset`,
  CHANGE_PAGE: `@@${process.env.APPNAME}/book/change_page`,
  TOGGLE_REVERSE: `@@${process.env.APPNAME}/book/toggle_reverse`,
  LOADED_META: `@@${process.env.APPNAME}/book/loaded_meta`,
  LOADED_IMAGE: `@@${process.env.APPNAME}/book/loaded_image`,
  UPDATE_CACHE: `@@${process.env.APPNAME}/book/update_cache`
};

export const actions = {
  reset: () => ({
    type: actionTypes.RESET,
  }),
  change_page: (page) => ({
    type: actionTypes.CHANGE_PAGE,
    payload: page
  }),
  toggle_reverse: () => ({
    type: actionTypes.TOGGLE_REVERSE,
  }),
  loaded_meta: (type, id, pageCount) => ({
    type: actionTypes.LOADED_META,
    payload: {
      id,
      type,
      pageCount
    }
  }),
  loaded_image: (page, image) => ({
    type: actionTypes.LOADED_IMAGE,
    payload: {
      page,
      image
    }
  }),
  update_cache: (page, state) => ({
    type: actionTypes.UPDATE_CACHE,
    payload: {
      page,
      state
    }
  })
};
