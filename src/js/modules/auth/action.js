export const actionTypes = {
  LOGIN: `@@${process.env.APPNAME}/auth/login`,
  LOGIN_SUCCESS: `@@${process.env.APPNAME}/auth/login_success`,
  LOGIN_FAILED: `@@${process.env.APPNAME}/auth/login_failed`,
  LOGOUT: `@@${process.env.APPNAME}/auth/logout`,
  LOGOUTED: `@@${process.env.APPNAME}/auth/logouted`,
};

export const actions = {
  login: (username, password) => ({
    type: actionTypes.LOGIN,
    payload: {
      username,
      password,
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
  logouted: () => ({
    type: actionTypes.LOGOUTED
  })
};
