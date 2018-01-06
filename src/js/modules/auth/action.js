export const actionTypes = {
  LOGIN: `@@${APPNAME}/auth/login`,
  LOGIN_SUCCESS: `@@${APPNAME}/auth/login_success`,
  LOGIN_FAILED: `@@${APPNAME}/auth/login_failed`,
  LOGOUT: `@@${APPNAME}/auth/logout`,
  LOGOUT_SUCCESS: `@@${APPNAME}/auth/logout_success`,
  LOGOUT_FAILED: `@@${APPNAME}/auth/logout_failed`,
};

export const actions = {
  login: (username, password, state) => ({
    type: actionTypes.LOGIN,
    payload: {
      username,
      password,
      state
    }
  }),
  login_success: token => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: token
  }),
  login_failed: message => ({
    type: actionTypes.LOGIN_FAILED,
    payload: message
  }),
  logout: () => ({
    type: actionTypes.LOGOUT
  }),
  logout_success: () => ({
    type: actionTypes.LOGOUT_SUCCESS
  }),
  logout_failed: () => ({
    type: actionTypes.LOGOUT_FAILED
  })
};
