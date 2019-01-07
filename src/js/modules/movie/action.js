export const actionTypes = {
  TIMEUPDATE: `@@${process.env.APPNAME}/movie/timeupdate`
};

export const actions = {
  timeupdate: (sec) => ({
    type: actionTypes.TIMEUPDATE,
    payload: sec
  })
};
