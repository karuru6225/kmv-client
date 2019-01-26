export const actionTypes = {
  UPDATE: `@@${process.env.APPNAME}/history/update`,
  DELETE: `@@${process.env.APPNAME}/history/delete`,
  DELETE_ALL: `@@${process.env.APPNAME}/history/deleteAll`
};

export const actions = {
  update: (id, index) => ({
    type: actionTypes.UPDATE,
    payload: {
      id,
      index
    }
  }),
  delete: (id) => ({
    type: actionTypes.DELETE,
    payload: id
  }),
  deleteAll: () => ({
    type: actionTypes.DELETE_ALL
  })
};
