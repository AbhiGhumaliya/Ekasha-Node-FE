import React from 'react';
import { ExpiredWrapper } from './style';
import ekasaLogo from '../../../assets/images/logo.svg';
import Icons from '../../../components/icons';

const LinkExpiredComponent = React.memo(() => (
  <>
    <ExpiredWrapper id="linkExpiredComponent" style={{ display: 'unset' }}>
      <div style={{ height: '50px' }}>
        <img style={{ height: '33px', width: '99px' }} alt="brandLogo" src={ekasaLogo} />
      </div>
      <div className="ModelDiv">
        <div className="second">
          <div className="LinkExLogo">
            <Icons type="linkExpired" id="Approval_link_expired" icontype="globle" />
          </div>
          <span className="message">Your Link has been Expired.</span>
        </div>
        <a href="/">
          <div className="HomeBtn">Back to Ekasha home</div>
        </a>
      </div>
    </ExpiredWrapper>
  </>
));

export default LinkExpiredComponent;
