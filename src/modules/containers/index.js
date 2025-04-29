import React, {
  useState, useEffect, lazy,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Redirect } from 'react-router';
import EkashaWraper from './lib/EkashaWrapper';
import {
  handleStorageChange, witing,
} from '../../helpers/lib/StorageHandlers';
import ekasaLogo from '../../assets/images/logo.svg';
import { history, store } from '../../configurations/redux/Store';
import { TimeFilContext } from './TimeFilterContext';
import { retryLazy } from '../../helpers/envData';
import { getTimeZone, getUserPermissions } from '../../apis/authentication/auth.actions';

const TopBarEkasha = lazy(() => retryLazy(() => import('../../components/layout/TopBar/TopBarEkasha')));
const SideBar = lazy(() => retryLazy(() => import('../../components/layout/SideBar')));
const Footer = lazy(() => retryLazy(() => import('../../components/layout/Footer')));
const PageRouter = lazy(() => retryLazy(() => import('../../router/index')));

const Page = (props) => {
  const [loading, setLoading] = useState(true);
  const [sideBarView, setSideBarView] = useState(true);
  const [tableView, setTableView] = useState(false);
  const [customerID, setCustomerID] = useState(localStorage.getItem('customerID') || 'ekasha');
  const [quickPanelStatus, setQuickPanelStatus] = useState(false);
  const [dashIntervalStatus, setDashIntervalStatus] = useState(true);
  const [selectStatus, setSelectStatus] = useState(false);
  const [timeFilData, setTimeFilData] = useState([{
    activeTypeFrom: localStorage.getItem('activeTypeFrom'),
    activeTypeTo: localStorage.getItem('activeTypeTo'),
    fromTo: localStorage.getItem('fromTo'),
    quickString: localStorage.getItem('quickString'),
    commonString: localStorage.getItem('commonString'),
    timeFilter: localStorage.getItem('timeFilter'),
  }]);

  // const [proFile, setProfile] = useState(JSON.parse(localStorage.getItem('U_PROFILE')));
  if (!localStorage.getItem('U_TOKENS')) {
    localStorage.clear();
    history.push('/');
    return (
      <Redirect to={{
        pathname: '/',
        // eslint-disable-next-line react/prop-types
        search: props.location.search,
      }}
      />
    );
  }

  const onBackButtonEvent = () => {
    if (history.location.pathname.split('/')[2] !== 'administration') {
      setLoading(true);
      setLoading(false);
    }
  };
  useEffect(() => {
    store.dispatch(getTimeZone(JSON.parse(localStorage.getItem('U_PROFILE')).userName));
    store.dispatch(getUserPermissions());
    window.addEventListener('popstate', onBackButtonEvent);
    window.addEventListener('storage', (e) => {
      handleStorageChange(e);
    });
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // const onProfileReceived = (payload) => {
  //   const dataRes = JSON.parse(payload.body);
  //   if (dataRes.module === 'session') {
  //     if (dataRes.operation === 'remove') {
  //       if (dataRes.status && dataRes.data ===
  //  JSON.parse(localStorage.getItem('U_TOKENS')).userToken) {
  //         clearLocalData();
  //         window.location.reload();
  //       }
  //     }
  //   }
  //   if (dataRes.module === 'timeZone') {
  //     if (dataRes.operation === 'update') {
  //       if (dataRes.status) {
  //         clearLocalData();
  //         window.location.reload();
  //       }
  //     }
  //   }
  //   if (dataRes.module === 'user') {
  //     switch (dataRes.operation) {
  //       case 'update':
  //         if (dataRes.status) {
  //           if (dataRes.data.token === JSON.parse(localStorage.getItem('U_TOKENS')).userToken) {
  //             const userProfile = {};
  //             userProfile.contact = dataRes.data.contactNum;
  //             userProfile.email = dataRes.data.email;
  //             userProfile.fullname = `${dataRes.data.firstName} ${dataRes.data.lastName}`;
  //             userProfile.groupName = dataRes.data.groupName;
  //             userProfile.userName = dataRes.data.username;
  //             userProfile.role = dataRes.data.userRoleToken;
  //             if (dataRes.data.userRoleToken !==
  //  JSON.parse(localStorage.getItem('U_TOKENS')).roleToken) {
  //               localStorage.clear();
  //               window.location.href = '/';
  //             }
  //             setProfile(userProfile);
  //             const tokens = JSON.parse(localStorage.getItem('U_TOKENS'));
  //             tokens.groupToken = dataRes.data.groupToken;
  //             localStorage.setItem('U_TOKENS', JSON.stringify(Object.assign(tokens)));
  //             localStorage.setItem('U_PROFILE', JSON.stringify(userProfile));
  //           }
  //         }
  //         break;
  //       case 'delete':
  //         if (dataRes.status) {
  //           if (dataRes.data === JSON.parse(localStorage.getItem('U_TOKENS')).userToken) {
  //             localStorage.clear();
  //             window.location.href = '/';
  //           }
  //         }
  //         break;
  //       case 'updateStatus':
  //         if (dataRes.status) {
  //           if (dataRes.data === JSON.parse(localStorage.getItem('U_TOKENS')).userToken) {
  //             clearLocalData();
  //             window.location.reload();
  //           }
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // };

  // const onConnected = () => {
  //   console.log('Connected to server.....');
  //   const channelSub = () => {
  //     subscribe = stompClient.subscribe('/topic/broadcast', onProfileReceived);
  //   };
  //   channelSub();
  //   window.addEventListener('stompClientChanged', channelSub);
  // };

  // useEffect(() => {
  //   // eslint-disable-next-line react/prop-types
  //   if (!stompClient.connected &&
  // !props.location.pathname.includes('/zeronsec/incidents/attribute/')) {
  //     reConnect(onConnected);
  //   }
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1500);
  //   return () => {
  //     if (subscribe) { subscribe.unsubscribe(); }
  //     window.removeEventListener('stompClientChanged', null);
  //   };
  // }, [stompClient.connected]);

  return (
    <EkashaWraper>
      <TimeFilContext.Provider value={{
        timeFilData,
        setTimeFilData,
        setTableView,
        tableView,
        setDashIntervalStatus,
        dashIntervalStatus,
        customerID,
        setCustomerID,
        quickPanelStatus,
        setQuickPanelStatus,
        selectStatus,
        setSelectStatus,
      }}
      >
        {loading
          ? (
            <div className="splash-screen">
              <div className="logoCont">
                {' '}
                <img
                  style={{
                    height: '33px', width: '95px', position: 'relative', bottom: '6px',
                  }}
                  alt="brandLogo"
                  src={ekasaLogo}
                />
              </div>
              <svg width="100" className="loaderSvg" height="100" viewBox="0 0 80 80">
                <polyline className="line-cornered stroke-still" points="0,0 80,0 80,80" strokeWidth="5" fill="none" />
                <polyline className="line-cornered stroke-still" points="0,0 0,80 80,80" strokeWidth="5" fill="none" />
                <polyline className="line-cornered stroke-animation" points="0,0 80,0 80,80" strokeWidth="5" fill="none" />
                <polyline className="line-cornered stroke-animation" points="0,0 0,80 80,80" strokeWidth="5" fill="none" />
              </svg>
            </div>
          )
          : (
            <>
              <div style={{ display: witing ? 'block' : 'none' }} className="splash-screen">
                <div className="logoCont">
                  {' '}
                  <img
                    style={{
                      height: '33px', width: '95px', position: 'absolute', bottom: '0', top: '0', left: '0', right: '0', margin: 'auto',
                    }}
                    alt="brandLogo"
                    src={ekasaLogo}
                  />
                </div>
                <svg width="100" className="loaderSvg" height="100" viewBox="0 0 80 80">
                  <polyline className="line-cornered stroke-still" points="0,0 80,0 80,80" strokeWidth="5" fill="none" />
                  <polyline className="line-cornered stroke-still" points="0,0 0,80 80,80" strokeWidth="5" fill="none" />
                  <polyline className="line-cornered stroke-animation" points="0,0 80,0 80,80" strokeWidth="5" fill="none" />
                  <polyline className="line-cornered stroke-animation" points="0,0 0,80 80,80" strokeWidth="5" fill="none" />
                </svg>
              </div>
              <div
                id="root2"
                style={{ height: '100%' }}
              >
                <TopBarEkasha
                  // userInfo={proFile}
                  sideBarToggle={() => (setSideBarView(!sideBarView))}
                  setTimeFilData={setTimeFilData}
                />
                <div style={{ height: 'calc(100% - 85px)', display: 'flex' }}>
                  <div>
                    <SideBar collapsed={sideBarView} />
                  </div>
                  <div className="zscontent">
                    <div className="zscontentmain">
                      <DndProvider backend={HTML5Backend}>
                        <PageRouter {...props} />
                      </DndProvider>
                    </div>
                  </div>
                </div>
                <Footer
                  {...props}
                />
              </div>
            </>
          )}
      </TimeFilContext.Provider>
    </EkashaWraper>
  );
};
export default Page;
