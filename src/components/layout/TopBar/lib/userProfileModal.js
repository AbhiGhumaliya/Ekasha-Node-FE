import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';
import TopbarWrapper from './TopBarWrapper';
import ZsModal from '../../../modal';
import Icons from '../../../icons';
import ZsSelect from '../../../forms/select';
import Toaster from '../../../toaster';

const UserProfileModal = React.memo((props) => {
  const {
    onHide, show, changePass, proFile, listTimezone, submitTimezone,
    selectedTimezone, setTimezone,
  } = props;

  const [shortName, setShortName] = useState('');
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [showTimezoneList, setShowTimezoneList] = useState(false);

  function handleClickOutside(event) {
    if (dropDownOpen) {
      if (document.getElementById('userProfile') && !document.getElementById('userProfile').contains(event.target)) {
        setDropDownOpen(false);
      }
    }
  }

  const copyToClipboard = useCallback((text, label) => {
    navigator.clipboard.writeText(text);
    Toaster({ title: `${label} copied`, type: 'success' });
  }, []);

  const overflowTextRef = useRef(null);

  const isTextOverflowing = useCallback(() => {
    if (overflowTextRef.current) {
      return overflowTextRef.current.scrollWidth > overflowTextRef.current.clientWidth;
    }
    return false;
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [dropDownOpen]);

  useEffect(() => {
    if (proFile.fullname !== null) {
      setShortName(proFile.fullname.split(' '));
    }
  }, []);

  return (
    <TopbarWrapper style={{ padding: '0px 0px' }}>
      <ZsModal
        modaltype="simple"
        id="userProfileModal"
        onHide={onHide}
        className="userProfile"
        show={show}
        centered
      >
        <div className="innerBody">
          <div className="Header">
            <div className="pImg">
              <span className="ZE">
                {`${shortName[0] !== undefined ? shortName[0].charAt(0) : ''}${shortName[1] !== undefined ? shortName[1].charAt(0) : ''}`}
              </span>
            </div>
            <div className="rightArea">
              <div className="pMainName">
                <div style={{ fontSize: '15px', margin: '0' }}>
                  <div className="overflowText" id={`pMainName_${proFile.fullname}`}>{proFile.fullname}</div>
                </div>
              </div>
              <div className="pRole">{proFile.groupName}</div>
              <div id="user_changepass" className="userBtns" style={{ pointerEvents: proFile.userName === 'admin' ? 'none' : 'auto' }} onClick={changePass}>Change Password</div>
            </div>
          </div>
          <div className="footer">
            <div>
              <div className="spacing">
                <div className="pName">
                  <div className="pNamestyle">
                    Username :
                  </div>
                  <div className="pNamestyleRight">
                    <div className="overflowText" ref={overflowTextRef}>
                      {proFile.userName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="spacing">
                <div className="pName" style={{ display: 'flex' }}>
                  <div className="pNamestyle">
                    Email :
                  </div>
                  <div className="pNamestyleRight">
                    <div className="overflowText" style={{ fontSize: '14px' }} id={`pname_Email_${proFile.email}`} ref={overflowTextRef}>
                      {proFile.email}
                      {isTextOverflowing() && (
                      <Icons
                        iconTooltipType="normal"
                        iconTooltipTitle="Copy"
                        type="copy2"
                        icontype="globle"
                        onClick={() => copyToClipboard(proFile.email, 'Email')}
                        className="copyIcon"
                      />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="spacing">
                <div className="pName">
                  <div className="pNamestyle">
                    Contact :
                  </div>
                  <div className="pNamestyleRight">{proFile.contact || '-'}</div>
                </div>
              </div>
              <div className="spacing">
                <div className="pName">
                  <div className="pNamestyle">
                    Timezone :
                  </div>
                  <div className="pNamestyleRight">
                    {!showTimezoneList && (
                    <>
                      <span className="icon" style={{ position: 'relative', top: '2px', marginRight: '5px' }}>
                        <Icons
                          id="Change_Profile_Timezone"
                          icontype="globle"
                          type="edit"
                          data-test="Change_Profile_Timezone"
                          onClick={() => {
                            setShowTimezoneList(true);
                            setDropDownOpen(true);
                          }}
                        />
                      </span>
                      {selectedTimezone}
                    </>
                    )}
                    {showTimezoneList && (
                    <>
                      <div onClick={() => setDropDownOpen(true)} id="userProfile">
                        <ZsSelect
                          selecttype="normal"
                          id="create_incident_type"
                          data={listTimezone}
                          style={{ width: '197px' }}
                          open={dropDownOpen}
                          autoFocus={dropDownOpen}
                          value={selectedTimezone || null}
                          popupClassName="timezone-dropdown"
                          getPopupContainer={() => document.body}
                          dropdownStyle={{ // Add dropdown specific styles
                            position: 'fixed',
                            zIndex: 1050,
                          }}
                          onChange={(e) => setTimezone(e)}
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Space
                                align="center"
                                id="UserProfileModal_timezonBtn"
                                className="applyTimezonBtn"
                                onClick={() => {
                                  submitTimezone();
                                  setDropDownOpen(false);
                                  setShowTimezoneList(false);
                                }}
                              >
                                Apply
                              </Space>
                            </>
                          )}
                        />
                      </div>
                    </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ZsModal>
    </TopbarWrapper>
  );
});

UserProfileModal.propTypes = {
  onHide: PropTypes.func,
  selectedTimezone: PropTypes.string,
  setTimezone: PropTypes.func,
  submitTimezone: PropTypes.func,
  changePass: PropTypes.func,
  show: PropTypes.bool,
  proFile: PropTypes.oneOfType([PropTypes.any]),
  listTimezone: PropTypes.oneOfType([PropTypes.array]),
};

UserProfileModal.defaultProps = {
  onHide: null,
  selectedTimezone: '',
  setTimezone: null,
  submitTimezone: null,
  changePass: null,
  proFile: null,
  listTimezone: [],
  show: false,
};

export default UserProfileModal;
