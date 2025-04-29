import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SideBarWrapper from './lib/SideBarWrapper';
import ZsTooltip from '../../tooltip';
import Toaster from '../../toaster';
import Icons from '../../icons/index';
import { PermissionRO } from '../../../helpers/lib/StorageHandlers';
import { TimeFilContext } from '../../../modules/containers/TimeFilterContext';

const SideBar = React.memo((props) => {
  const {
    collapsed,
  } = props;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selected, setSelected] = useState(useLocation().pathname);
  const [newStatus, setNewStatus] = useState(false);

  const path = useLocation().pathname;

  const menuOpen = collapsed && (windowWidth < 711);

  const {
    setTableView, quickPanelStatus, setQuickPanelStatus,
  } = useContext(TimeFilContext);

  useEffect(() => {
    setSelected(path);
  }, [path, newStatus]);

  let brd = '';
  const a = selected.split('/zeronsec');
  if (a[1] && a[1] !== '') {
    const b = a[1].split('/')[1];
    brd = b;
  }

  if (!a[1]) {
    brd = 'home';
  }

  let quickDash = false;
  let quickInc = false;

  const dflt = PermissionRO().filter((eve) => eve.module === 'home' && eve.permission !== 'NA');
  if (dflt.length > 0) {
    if (dflt[0].subModules) {
      const dflt1 = dflt[0].subModules.filter((e) => e.module === 'dashboard' && e.permission !== 'NA');
      if (dflt1.length > 0) {
        quickDash = true;
      }
    }
  }

  const iflt = PermissionRO().filter((eve) => eve.module === 'incidents' && eve.permission !== 'NA');
  if (iflt.length > 0) {
    quickInc = true;
  }

  const setSelectedMethod = (menu) => {
    setSelected(menu);
  };

  const toggleNew = (status) => {
    setNewStatus(status);
  };

  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', (e) => {
      if (newStatus) {
        if (document.getElementById('newStatus')) {
          if (!document.getElementById('newStatus').contains(e.target)) {
            setNewStatus(false);
          }
        }
      }
    });
    return () => {
      window.removeEventListener('mousedown', null, false);
    };
  }, [newStatus]);

  return (
    <SideBarWrapper
      id="sideBarWrapper"
      style={{ width: menuOpen ? '0px' : '80px', padding: menuOpen ? '0' : '0 10px', boxShadow: collapsed ? 'none' : '0 9px 11px 0 rgba(0,0,0,0.27)' }}
    >
      <div className={menuOpen ? 'sidebar' : 'sidebar openMenu'}>
        {
          PermissionRO().length > 0
            ? (
              <div onClick={() => setTableView(false)}>
                <ul>
                  {
                    PermissionRO().map((menu, index) => (
                      menu.module !== 'administration'
                        ? (
                          <li key={index} style={{ pointerEvents: (path.split('/')[2] || 'home') === menu.module ? 'none' : 'auto' }}>
                            <Link
                              id={`sideMenu_${menu.module}`}
                              style={{ outline: 'none' }}
                              to={{ pathname: menu.module === 'home' ? '/zeronsec' : `/zeronsec/${menu.module}` }}
                              onClick={() => setQuickPanelStatus(false)}
                              className="ecMenu"
                            >
                              <ZsTooltip title={menu.module === 'ruleEngine' ? 'Rule Engine' : menu.module === 'ioc' ? 'IOC' : menu.module === 'home' ? 'Dashboard' : `${menu.module.charAt(0).toUpperCase()}${menu.module.substring(1)}`}>
                                <div className={(path.split('/')[2] || 'home') === menu.module ? 'navItem selected' : 'navItem'}>
                                  <Icons icontype="common" type={`${menu.module === 'home' ? 'dashboard' : menu.module}`} className="navIcon" />
                                </div>
                              </ZsTooltip>
                            </Link>
                          </li>
                        ) : null
                    ))
                  }
                </ul>
              </div>
            ) : null
        }
        {PermissionRO().length === 0
          ? (
            <div>
              <ul>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((menu, index) => (
                  <li style={{ pointerEvents: 'none' }} key={index}>
                    <div style={{ position: 'relative', opacity: '0.2' }} className="navItem">
                      <Icons icontype="globle" type="loading" className="navLoading" />
                      <div className="animated-gradient" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
          : null}
      </div>
      {newStatus
        ? (
          <div id="newStatus" className="extraContentShow" onClick={() => setTableView(false)}>
            {quickInc && brd !== 'incidents' ? (
              <Link id="quickIncidentBtn" to={() => (PermissionRO('incidents').write && { pathname: '/zeronsec/incidents', state: { quickInc: true } })} onClick={PermissionRO('incidents').write ? () => { setSelectedMethod('/zeronsec/incidents'); toggleNew(false); } : () => Toaster({ title: "you don't have a permission to create incident", type: 'error' })} className="ecMenu">
                <Icons type="incidents" icontype="common" className="ecIcon" />
                Incidents
              </Link>
            ) : ''}
            {quickDash && brd !== 'home' ? (
              <Link id="quickDashboardBtn" to={() => (PermissionRO('home', 'dashboard').write && { pathname: '/zeronsec', state: { quickDash: true } })} onClick={PermissionRO('home', 'dashboard').write ? () => { setSelectedMethod('/zeronsec'); toggleNew(false); } : () => Toaster({ title: "you don't have a permission to create dashboard", type: 'error' })} className="ecMenu">
                <Icons type="dashboard" icontype="common" className="ecIcon" />
                Dashboard
              </Link>
            ) : ''}
            {brd !== 'home' ? (
              <Link
                id="quickPanelBtn"
                to={() => PermissionRO('home', 'panel').write && { pathname: '/zeronsec' }}
                onClick={PermissionRO('home', 'panel').write ? () => {
                  setSelectedMethod('/zeronsec');
                  toggleNew(false);
                  setQuickPanelStatus(true);
                } : () => Toaster({ title: "you don't have a permission to create panel", type: 'error' })}
                className="ecMenu"
              >
                <Icons type="panelIcon" icontype="common" className="ecIcon" />
                Panel
              </Link>
            ) : ''}
            <div id="quickCloseBtn" className="ecMenu" onClick={() => toggleNew(!newStatus)}>
              <Icons type="cross" icontype="common" className="ecIcon" />
              Close
            </div>
          </div>
        )
        : (
          <div className={menuOpen ? 'extraBtn' : 'extraBtn openMenu'} onClick={() => setTableView(false)}>
            <ZsTooltip title="Add new" style={{ opacity: 1 }}>
              <div
                id="quickOpenBtn"
                style={{ opacity: (quickPanelStatus || quickDash || quickInc) ? 1 : 0.4 }}
                className={menuOpen ? 'extraContent' : 'extraContent openMenu'}
                onClick={
                () => {
                  if ((quickPanelStatus || quickDash || quickInc)) {
                    toggleNew(!newStatus);
                  } else {
                    Toaster({ title: "You don't have permission.", type: 'error' });
                  }
                }
              }
              >
                <Icons icontype="globle" type="plus" className="addBtn" />
              </div>
            </ZsTooltip>
          </div>
        )}
    </SideBarWrapper>
  );
});

SideBar.propTypes = {
  collapsed: PropTypes.oneOfType([PropTypes.any]),
};

SideBar.defaultProps = {
  collapsed: null,
};
export default SideBar;
