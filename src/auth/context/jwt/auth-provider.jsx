import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email:email.toLowerCase(),
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { accessToken, user ,message } = response.data;

    if(accessToken && user){
      setSession(accessToken);
  
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
      initialize()
    }
    else throw new Error(message);

  }, [initialize]);

  // REGISTER
  const register = useCallback(async (data) => {
    console.log('user dataaaaa', data);

    const response = await axios.post(endpoints.auth.register, {...data,email:data.email.toLowerCase()});

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
    initialize()
  }, [initialize]);
  // const registerAsUS = useCallback(async (info) => {
  //   const data = {
  //     email:info.email,
  //     password:info.password,
  //     confirmPassword:info.confirmPassword,
  //     first_name: info.firstName,
  //     last_name: info.lastName,
  //     userName: `${info.firstName} ${info.lastName}`,
  //     identification_num:info.identification_num,
  //     gender:info.gender,
  //     country:info.country,
  //     city:info.city
  //   };
  //   console.log('user dataaaaa', data);

  //   const response = await axios.post(endpoints.auth.register, data);

  //   const { accessToken, user } = response.data;

  //   sessionStorage.setItem(STORAGE_KEY, accessToken);

  //   dispatch({
  //     type: 'REGISTER',
  //     payload: {
  //       user: {
  //         ...user,
  //         accessToken,
  //       },
  //     },
  //   });
  // }, []);

  // CONFIRM REGISTER
  const confirmRegister = useCallback(async (email, code) => {
    // await Auth.confirmSignUp(email, code);
  }, []);

  // RESEND CODE REGISTER
  const resendCodeRegister = useCallback(async (email) => {
    // await Auth.resendSignUp(email);
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email) => {
    await axios.post(endpoints.auth.forgotpassword, {email:email.toLowerCase()});
  }, []);

  // NEW PASSWORD
  const newPassword = useCallback(async (email, code, password,confirmPassword) => {
     await axios.patch(endpoints.auth.resetpassword, {email:email.toLowerCase(),resetToken:code,password,confirmPassword});
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      // registerAsUS,
      confirmRegister,
      resendCodeRegister,
      forgotPassword,
      newPassword,
      logout,
    }),
    [
      login,
      logout,
      register,
      // registerAsUS,
      confirmRegister,
      resendCodeRegister,
      forgotPassword,
      newPassword,
      state.user,
      status,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
