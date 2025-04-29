/* eslint-disable max-len */
import React, {
  useState, useEffect, Suspense, lazy, useContext,
} from 'react';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../../../configurations/redux/Store';
import FooterWrapper from './lib/FooterWrapper';
import Icons from '../../icons';
// import AdministratorEkasha from '../../../modules/containers/administration/AdministratorEkasha';
import {
  PermissionRO, licStatus, witing,
} from '../../../helpers/lib/StorageHandlers';
import { panelDrawerClose } from '../../../apis/panel/panel.action';
import { fakeActionNotification } from '../../../apis/notification/notification.action';
import { ZsSpin } from '../../Spin';
import { retryLazy } from '../../../helpers/envData';
import { TimeFilContext } from '../../../modules/containers/TimeFilterContext';

const AdministratorEkasha = lazy(() => retryLazy(() => import('../../../modules/containers/administration/AdministratorEkasha')));

const Footer = React.memo((props) => {
  const {
    setDashIntervalStatus,
  } = useContext(TimeFilContext);

  const [open, setOpen] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [home, setHome] = useState(false);
  const [directOpen, setDirectOpen] = useState(false);
  const dispatch = useDispatch();
  const closeState = () => {
    setTimeout(() => {
      setAnimation(false);
      setDirectOpen(false);
      setOpen(false);
    }, 1000);
    setDashIntervalStatus(true);
  };
  const location = useLocation();
  const MoveToHomeRes = useSelector((state) => (
    state.Notification.MoveToHomeResponse || {}
  ));
  const changeState = () => {
    const modules = {};
    modules.Other = history.location.pathname;
    localStorage.setItem('previosModul', JSON.stringify(modules));
    dispatch(panelDrawerClose());
    setTimeout(() => {
      setAnimation(true);
      history.push({
        pathname: '/zeronsec/administration/SLA',
        search: '',
      });
      setDashIntervalStatus(false);
    }, 1200);
    setOpen(true);
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.split('/')[2] !== 'administration') {
        setOpen(false);
        setAnimation(false);
        setDirectOpen(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!licStatus && !witing) {
      history.push({
        pathname: '/zeronsec/administration/SLA',
        search: '',
      });
      setOpen(true);
      setAnimation(true);
    }
  }, [licStatus]);

  useEffect(() => {
    if (MoveToHomeRes.type === 'MOVE_TO_HOME' && licStatus && !witing) {
      closeState();
      dispatch(fakeActionNotification());
    } else if (!licStatus) {
      history.push({
        pathname: '/zeronsec/administration/SLA',
        search: '',
      });
      setAnimation(true);
      setOpen(true);
    }
  }, [MoveToHomeRes]);

  const checkPermission = () => {
    if (PermissionRO('administration').read) {
      if (location.pathname.split('/')[2] === 'administration' && !open) {
        dispatch(panelDrawerClose());
        setDirectOpen(true);
        setAnimation(true);
      } else if (location.pathname.split('/').length === 2 && location.pathname.split('/')[1] === 'zeronsec') {
        setHome(true);
        setOpen(false);
        setDirectOpen(false);
      } else if (location.pathname.split('/').length >= 4 && location.pathname.split('/')[2] === 'administration') {
        setOpen(true);
        setDirectOpen(true);
      } else {
        // setOpen(false);
        // setDirectOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!witing) {
      if (licStatus) {
        checkPermission();
      } else {
        dispatch(panelDrawerClose());
        history.push({
          pathname: '/zeronsec/administration/SLA',
          search: '',
        });
        setDirectOpen(true);
        setAnimation(true);
      }
    }
    return () => {
      setDashIntervalStatus(true);
    };
  }, [location, witing, licStatus]);

  const openStyle = {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 50px)',
    top: '50px',
    transition: 'top 0.5s',
    zIndex: '999',
  };
  const directStyle = {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 50px)',
    top: '50px',
    transition: 'top 0s',
    zIndex: '999',
  };
  const closeStyle = {
    top: 'calc(100% - 29px)',
    transition: 'top 0.5s',
    position: 'fixed',
    zIndex: '999',
  };
  if (!PermissionRO('administration').read && open) {
    closeState();
    history.push({
      pathname: JSON.parse(localStorage.getItem('previosModul'))?.Other || '/zeronsec',
      search: '',
    });
    return <Redirect to={JSON.parse(localStorage.getItem('previosModul'))?.Other || '/zeronsec'} />;
  }
  if (home) {
    setHome(false);
    return <Redirect to="/zeronsec" />;
  }
  return (
    <FooterWrapper>
      <div className="zsfooter" style={open ? openStyle : (directOpen ? directStyle : closeStyle)}>
        <div className="footercontent">
          {
            PermissionRO('administration').read
              ? (
                <span id="footerIcon_admin" className="adminBtn" style={{ cursor: open ? 'default' : 'pointer' }} onClick={!open ? changeState : null}>
                  <Icons icontype="common" className={((open || directOpen) && 'adIcon active') || ((!open || !directOpen) && 'adIcon')} type="administration" />
                  <span className="titleText">Administration</span>
                </span>
              ) : null
          }
          {(open || directOpen) ? (
            licStatus
            && (
              <Link
                style={{
                  width: '8px', height: '15px', marginTop: '4px', marginRight: '17px',
                }}
                to={{ pathname: JSON.parse(localStorage.getItem('previosModul'))?.Other || '/zeronsec' }}
              >
                <span id="previosModul_close" onClick={() => { closeState(); }} className="closeIcon"><Icons icontype="common" type="FooterArrow" /></span>
              </Link>
            )
          ) : null}
        </div>
        <div className="maincontent openContent">
          <Suspense fallback={<ZsSpin id="adminFooterLoading" />}>
            {animation ? (
              <AdministratorEkasha
                {...props}
                show={open || directOpen}
              />
            ) : (<ZsSpin id="adminAnimation" />)}
          </Suspense>
        </div>
      </div>
    </FooterWrapper>
  );
});

export default Footer;
