import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import SignInStyleWrapper from './SignInWrapper';
import ekasaLogo from '../../../../assets/images/logo.svg';

const SignInMessage = () => {
  const [login, setLogin] = useState(false);

  if ((localStorage.getItem('U_TOKENS') && !localStorage.getItem('datatoken'))) {
    return <Redirect to="/zeronsec" />;
  }

  useEffect(() => {
    window.onload = () => setLogin(true);
  }, []);

  if (login) return <Redirect to="/" />;

  return (
    <SignInStyleWrapper>
      <div className="signInLogo">
        <img style={{ height: '33px', width: '99px' }} alt="brandLogo" src={ekasaLogo} />
      </div>
      <div className="signInBox animated" style={{ textAlign: 'center' }}>
        <div className="signInLabel" style={{ fontSize: '18px', color: '#7d7979' }}>
          You are logged off !
          <div id="clickHere">
            <Link to="/">Click here</Link>
            {' '}
            to login back.
          </div>
        </div>
      </div>
    </SignInStyleWrapper>
  );
};
export default SignInMessage;
