import React from 'react';
import PropTypes from 'prop-types';
import { ExpiredWrapper } from './style';
import ekasaLogo from '../../../assets/images/logo.svg';
import Icons from '../../../components/icons';

const LinkDeclineComponent = React.memo((props) => {
  const {
    data,
  } = props;

  return (
    <>
      <ExpiredWrapper id="linkDeclineComponent" style={{ display: 'unset' }}>
        <div style={{ height: '50px' }}>
          <img style={{ height: '33px', width: '99px' }} alt="brandLogo" src={ekasaLogo} />
        </div>
        <div className="container">
          <div className="subContainer">
            <div className="headercontent">
              <div className="actionApprovalIcon">
                <Icons type="linkDeclined" id="Approval_link_expired" icontype="globle" />
              </div>
              <span className="title">Action Declined Successfully</span>
            </div>
            <div>
              <div className="contentDetail">
                <div className="contentField">
                  <div className="spacing">
                    <div className="pName">
                      <span className="pNamestyle">Incident ID : </span>
                      <div className="pNameValue">
                        <p>{data.incidentId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="spacing">
                    <div className="pName">
                      <span className="pNamestyle">Incident Name : </span>
                      <div className="pNameValue">
                        <p>{data.incidentName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="spacing">
                    <div className="pName">
                      <span className="pNamestyle">Action Name : </span>
                      <div className="pNameValue">
                        <p>{data.actionName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="spacing">
                    <div className="pName">
                      <span className="pNamestyle">Target Device : </span>
                      <div className="pNameValue">
                        <p>{data.targetDevice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ExpiredWrapper>
    </>
  );
});
LinkDeclineComponent.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
  ]),
};

LinkDeclineComponent.defaultProps = {
  data: [],
};
export default LinkDeclineComponent;
