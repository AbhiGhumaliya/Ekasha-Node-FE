import React from 'react';
import { ExpiredWrapper } from './style';
import ekasaLogo from '../../../assets/images/logo.svg';

const LinkExceptionComponent = React.memo(() => (
  <>
    <ExpiredWrapper id="linkExceptionComponent" style={{ display: 'unset' }}>
      <div style={{ height: '50px' }}>
        <img style={{ height: '33px', width: '99px' }} alt="brandLogo" src={ekasaLogo} />
      </div>
      <div className="ModelDiv">
        <div className="second">
          <div className="LinkExLogo">
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" width="19" height="19" viewBox="0 0 45 50">
              <path d="M49.9,45.9a7.84,7.84,0,0,0-.5-1.4Q38.3,23.35,27.4,2.2c-.5-1-1-2.2-2.4-2.2s-1.9,1.1-2.4,2.1Q11.65,23.25.7,44.3C-.6,46.8-.1,49.1,3.6,49c7.1-.1,14.3,0,21.4,0H46.3a9.7,9.7,0,0,0,1.7-.1A2.26,2.26,0,0,0,49.9,45.9ZM21.7,14.3A3,3,0,0,1,24.9,11a3.1,3.1,0,0,1,3.3,3.3V31a3,3,0,0,1-3.3,3.3A3,3,0,0,1,21.7,31V14.3Zm3.2,29.6a3.42,3.42,0,0,1-3.5-3.5,3.5,3.5,0,1,1,7,.1A3.34,3.34,0,0,1,24.9,43.9Z" fill="#ff4a4a" />
            </svg>
          </div>
          <span className="message">Some error will be raised on Action Decline.</span>
        </div>
        <a href="/">
          <div className="HomeBtn">Back to Ekasha home</div>
        </a>
      </div>
    </ExpiredWrapper>
  </>
));

export default LinkExceptionComponent;
