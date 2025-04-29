/* eslint-disable max-len */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import TopbarWrapper from './lib/TopBarWrapper';
import ekasaLogo from '../../../assets/images/logo.svg';
import Icons from '../../icons';
import UserDropDown from './lib/userDropdown';
import TopbarTimeFilter from './lib/topbarTimeFilter';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import TopbarNotifications from './lib/TopbarNotifications';
import { licStatus } from '../../../helpers/lib/StorageHandlers';
import { history } from '../../../configurations/redux/Store';
import { TimeFilContext } from '../../../modules/containers/TimeFilterContext';
import ZsSelect from '../../forms/select';

let subscribe;

const TopBar = React.memo((props) => {
  const {
    sideBarToggle, userInfo, logoutAction, fakeActionUser, ChangePasswordAction,
    getUserPermissions, moveDashboardAction, fakeActionAuth, checkValidPassAction,
    validPassPolicy, timeZoneList, changeTimeZone, fakeActionTimezone,
    permissionBasedTenantListAction, fakeActionTenant, notifyAction,
  } = props;

  const {
    setTableView, tableView, customerID, setCustomerID, setQuickPanelStatus,
    selectStatus, setSelectStatus,
  } = useContext(TimeFilContext);

  const [tenantData, setTenantData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const selectRef = useRef(null);

  const PermissionsRes = useSelector((state) => (
    state.Auth.userPermissionsResponse || {}
  ));

  const PermissionBasedTenantListRes = useSelector((state) => (
    state.Tenant.PermissionBasedTenantListResponse || {}));

  const getCurrentTimezoneRes = useSelector((state) => (
    state.Auth.getCurrentTimezoneResponse || {}
  ));

  const TenantStatus = (window.location.hash.split('/')[3] !== 'SSL_Configuration'
                        && window.location.hash.split('/')[3] !== 'Timezone');

  const tenantOnChangeHandler = (value) => {
    localStorage.setItem('customerID', value);
    setCustomerID(value);
    setNotifications([]);
    setQuickPanelStatus(false);
    notifyAction({ customerID: value });
  };

  const userSockTopbar = (dataRes) => {
    if (dataRes.module === 'user') {
      if (dataRes.operation && dataRes.operation === 'update') {
        if (dataRes.status) {
          if (dataRes.data.token === JSON.parse(localStorage.getItem('U_TOKENS')).userToken) {
            setTimeout(() => {
              getUserPermissions();
            }, 1000);
          }
        }
      }
    }
  };
  const onGroupdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'Group' && dataRes.status) {
      if (dataRes.data.token === JSON.parse(localStorage.getItem('U_TOKENS')).groupToken) {
        setTimeout(() => {
          getUserPermissions();
        }, 1000);
      }
    }
    userSockTopbar(dataRes);
    if (dataRes.module === 'license' && dataRes.operation === 'add' && dataRes.status) {
      setTimeout(() => {
        getUserPermissions();
      }, 1000);
    }
  };
  useEffect(() => {
    permissionBasedTenantListAction();
  }, []);

  useEffect(() => {
    window.addEventListener('click', (e) => {
      if (document.getElementsByClassName('vis-timeline').length > 0) {
        if (document.getElementsByClassName('vis-timeline')[0].contains(e.target)) {
          setSelectStatus(false);
        }
      }
    });

    return () => {
      window.addEventListener('click', null);
    };
  }, []);

  const handleDropdownVisibleChange = (open) => {
    setSelectStatus(open);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setSelectStatus(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onGroupdataReceived);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  useEffect(() => {
    if (PermissionBasedTenantListRes.status) {
      if (!localStorage.getItem('customerID')) {
        localStorage.setItem('customerID', PermissionBasedTenantListRes?.data[0]?.value || 'ekasha');
        setCustomerID(PermissionBasedTenantListRes?.data[0]?.value || 'ekasha');
        notifyAction({ customerID: PermissionBasedTenantListRes?.data[0]?.value || 'ekasha' });
      } else {
        setCustomerID(localStorage.getItem('customerID') || 'ekasha');
        notifyAction({ customerID: localStorage.getItem('customerID') || 'ekasha' });
      }
      setNotifications([]);
      setTenantData(PermissionBasedTenantListRes.data);
      fakeActionTenant();
    } else if (PermissionBasedTenantListRes.status === false) {
      setTenantData([]);
      fakeActionTenant();
    }
  }, [PermissionBasedTenantListRes]);

  useEffect(() => {
    if (getCurrentTimezoneRes.status) {
      localStorage.setItem('serverTimezone', getCurrentTimezoneRes.data.serverTimezone);
      localStorage.setItem('userTimezone', getCurrentTimezoneRes.data.userTimezone);
      fakeActionAuth();
    } else if (getCurrentTimezoneRes.status === false) {
      fakeActionAuth();
    }
  }, [getCurrentTimezoneRes]);

  useEffect(() => {
    if (PermissionsRes.status || PermissionsRes.status === false) {
      fakeActionAuth();
    }
  }, [PermissionsRes]);

  const params = licStatus ? '/zeronsec' : '/zeronsec/administration/SLA';

  return (
    <TopbarWrapper id="TopBarWrapper">
      <div className="btLeft">
        <div className="brandLogo" id="TopBar_brandLogo" onClick={() => moveDashboardAction()}>
          <Link
            to={{ pathname: params }}
          >
            <img style={{ height: '55px', width: '92px' }} alt="brandLogo" src={ekasaLogo} />
          </Link>
        </div>
        <div className="toggler" style={{ paddingLeft: '10px' }} id="TopBar_menubar" onClick={sideBarToggle}><Icons icontype="common" type="menuBar" /></div>
        <span className="breadCrumbs">
          <span className="bdcontainer">
            {window.location.hash.split('/')[2] === 'allNotifications' ? `${window.location.hash.split('/')[2].substring(0, 3)} ${window.location.hash.split('/')[2].substring(3, 20)}` : window.location.hash.split('/')[2] || 'dashboard'}
          </span>
        </span>
      </div>
      <div className="btRight">
        {TenantStatus
      && (
        <div ref={selectRef} style={{ marginTop: '8px', marginRight: '10px' }}>
          <ZsSelect
            selecttype="normal"
            width={150}
            open={selectStatus}
            onDropdownVisibleChange={handleDropdownVisibleChange}
            id="topbar_Tenant_Select"
            data={tenantData}
            placeholder="Select Tenant"
            onChange={(e) => tenantOnChangeHandler(e)}
            value={tenantData.length === 0 && customerID === 'ekasha' ? null : customerID}
          />
        </div>
      )}
        {(window.location.hash.split('/')[2]) === 'incidents' && (window.location.hash.split('/')[3]) !== 'attribute'
        && (
          <div className="tView" style={{ marginRight: '15px' }}>
            <div className={tableView ? 'cViewSelected' : 'cView'}>
              <div
                id="TopBar_cardView"
                className="cardIcon"
                style={{ cursor: 'pointer' }}
                onClick={() => setTableView(false)}
              >
                <Icons
                  iconTooltipType="normal"
                  iconTooltipTitle="Card View"
                  icontype="globle"
                  type="cardView"
                />
              </div>
              <div style={{
                height: '18px', width: '1px', background: 'gray', marginTop: '5px',
              }}
              />
              <Link to={{ pathname: '/zeronsec/incidents' }}>
                <div
                  id="TopBar_tableView"
                  className="tableIcon"
                  onClick={() => setTableView(true)}
                >
                  <Icons
                    iconTooltipType="normal"
                    iconTooltipTitle="Table View"
                    icontype="globle"
                    type="tableView"
                  />
                </div>
              </Link>
            </div>
          </div>
        )}
        {licStatus
          && (
            <span className="content">
              {
                (((useLocation().pathname.split('/')[1] === 'zeronsec' && window.location.hash.split('/').length === 2)) || (window.location.hash.split('/')[2] === 'incidents') || (window.location.hash.split('/')[3] === 'Logs'))
                && <TopbarTimeFilter {...props} />
              }
            </span>
          )}
        {
          licStatus && (history.location.pathname.split('/')[3] !== 'attribute')
          && (
            <span style={{ width: '50px', textAlign: 'center' }}>
              {JSON.parse(localStorage.getItem('U_TOKENS')) !== null && JSON.parse(localStorage.getItem('U_TOKENS')).userToken && (
              <TopbarNotifications
                setTableView={setTableView}
                notifications={notifications}
                setNotifications={setNotifications}
                {...props}
              />
              )}
            </span>
          )
        }
        {history.location.pathname.split('/')[3] !== 'attribute'
        && (
        <span className="content" style={{ right: !licStatus ? '-8px' : '194px' }}>
          <UserDropDown
            userProfile={userInfo}
            logoutAction={logoutAction}
            checkValidPassAction={checkValidPassAction}
            timeZoneList={timeZoneList}
            changeTimeZone={changeTimeZone}
            fakeActionTimezone={fakeActionTimezone}
            fakeActionAuth={fakeActionAuth}
            validPassPolicy={validPassPolicy}
            fakeAction={fakeActionUser}
            ChangePasswordAction={ChangePasswordAction}
          />
        </span>
        )}
      </div>
    </TopbarWrapper>
  );
});
TopBar.propTypes = {
  changeTimeZone: PropTypes.func,
  timeZoneList: PropTypes.func,
  fakeActionTimezone: PropTypes.func,
  sideBarToggle: PropTypes.func,
  fakeActionUser: PropTypes.func,
  ChangePasswordAction: PropTypes.func,
  validPassPolicy: PropTypes.func,
  checkValidPassAction: PropTypes.func,
  logoutAction: PropTypes.func,
  refreshToken: PropTypes.func,
  getUserPermissions: PropTypes.func,
  setLoading: PropTypes.func,
  moveDashboardAction: PropTypes.func,
  fakeActionAuth: PropTypes.func,
  fakeActionResetToken: PropTypes.func,
  fakeActionTenant: PropTypes.func,
  userInfo: PropTypes.oneOfType([PropTypes.any]),
  permissionBasedTenantListAction: PropTypes.func,
  notifyAction: PropTypes.func,
};

TopBar.defaultProps = {
  changeTimeZone: null,
  timeZoneList: null,
  fakeActionTimezone: null,
  logoutAction: null,
  sideBarToggle: null,
  fakeActionUser: null,
  refreshToken: null,
  ChangePasswordAction: null,
  validPassPolicy: null,
  checkValidPassAction: null,
  userInfo: null,
  getUserPermissions: null,
  setLoading: null,
  fakeActionAuth: null,
  fakeActionTenant: null,
  fakeActionResetToken: null,
  moveDashboardAction: null,
  permissionBasedTenantListAction: null,
  notifyAction: null,
};
export default TopBar;
