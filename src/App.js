import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Provider } from 'react-redux';
import { useIdleTimer } from 'react-idle-timer';
import moment from 'moment';
import AppRouter from './appRouter';
import { store, history } from './configurations/redux/Store';
import { IdelTimerContext } from './modules/containers/TimeFilterContext';
import { localRefreshToken } from './helpers/envData';
import { refreshTokenFetchAction } from './apis/authentication/auth.actions';
import { callLogoutSuccess } from './helpers/lib/SessionHandlers';
import { logoutAction } from './apis/administration/users/user.actions';

function App() {
  const expirTime = () => localStorage.getItem('sessionExpireTime') || 120;
  const bufferTimeInMiliSecond = 1 * 60 * 1000; // 1 minute
  const [jwtExpiryTime, setJwtExpiryTime] = useState(expirTime() * 60 * 1000);
  const idleTimerRef = useRef(null);
  const tokenRefreshTimerRef = useRef(null);

  // Function to log out the user
  const logout = () => {
    if (localRefreshToken()) {
      store.dispatch(logoutAction(localRefreshToken()));
    }
    callLogoutSuccess();
    document.location.reload();
  };
  // Function to refresh the JWT token
  const refreshToken = async () => {
    if (!localRefreshToken()) return;
    try {
      const form = new FormData();
      form.append('refreshToken', localRefreshToken());
      const response = await refreshTokenFetchAction(form);
      const Tokens = JSON.parse(localStorage.getItem('U_TOKENS'));
      Tokens.jwtToken = response.data.data;
      localStorage.setItem('U_TOKENS', JSON.stringify(Tokens)); // Save new token
      const exTime = new Date(moment().add(expirTime(), 'minutes'));
      localStorage.setItem('expireTime', exTime);
      clearInterval(tokenRefreshTimerRef.current);
      const time = new Date(exTime) - new Date() - bufferTimeInMiliSecond;
      tokenRefreshTimerRef.current = setInterval(refreshToken, time);
    } catch (error) {
      logout();
    }
  };

  // When user is idle
  const onIdle = () => {
    logout();
  };

  // When user becomes active
  const onActive = () => {
    clearTimeout(tokenRefreshTimerRef.current);
    // Schedule a token refresh again
    // tokenRefreshTimerRef.current = setTimeout(refreshToken, REFRESH_TIME);
  };
  // Hook to detect user activity
  const { reset } = useIdleTimer({
    ref: idleTimerRef,
    timeout: jwtExpiryTime, // Log out after 30 minutes of inactivity
    onIdle, // Callback for idle
    onActive, // Callback for when user becomes active
    debounce: 500, // Debounce for performance
  });

  const refreshTokenApiCall = () => {
    const localExpireTime = localStorage.getItem('expireTime');
    if (localExpireTime) {
      const time = new Date(localExpireTime) - new Date() - bufferTimeInMiliSecond;
      tokenRefreshTimerRef.current = setInterval(refreshToken, time);
    }
  };

  const resetTimer = useCallback((time) => {
    setJwtExpiryTime(expirTime() * 60 * 1000);
    reset();
    if (time) {
      clearInterval(tokenRefreshTimerRef.current);
      refreshTokenApiCall('from reset....');
    }
  }, []);
  // Schedule the initial token refresh on component mount

  useEffect(() => {
    refreshTokenApiCall();
    return () => {
      clearInterval(tokenRefreshTimerRef.current);
    };
  }, []);

  return (
    <IdelTimerContext.Provider value={{ resetIdelTimer: resetTimer }}>
      <div className="globalHeight" data-test="appComponent">
        <Provider store={store}>
          <AppRouter history={history} />
        </Provider>
      </div>
    </IdelTimerContext.Provider>
  );
}

export default App;
