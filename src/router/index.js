import React, {
  lazy, Suspense, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from '../helpers/lib/RootComponent';
import { ZsSpin } from '../components/Spin';
import AttributeAnalysisEkasha from '../modules/containers/incidents/subModule/attributeEkasha';
import { retryLazy } from '../helpers/envData';
import NoData from '../components/NoData';

const AdministrationRoute = React.memo(() => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000); // 3 seconds timeout
    return () => clearTimeout(timer);
  }, []);
  return showLoading ? (
    <ZsSpin id="ContainerLoading" />
  ) : (
    <NoData style={{ position: 'absolute' }} id="Page_Router_Permission_NoData" message="You don't have permission to access this page" />
  );
});

const PageRouter = React.memo((props) => {
  const { match } = props;

  const DashBoard = lazy(() => retryLazy(() => import('../modules/containers/dashboard')));
  const Incidents = lazy(() => retryLazy(() => import('../modules/containers/incidents')));
  const Playbook = lazy(() => retryLazy(() => import('../modules/containers/playbook')));
  const RuleEngine = lazy(() => retryLazy(() => import('../modules/containers/ruleEngine')));
  const Appint = lazy(() => retryLazy(() => import('../modules/containers/appint')));
  const Jobs = lazy(() => retryLazy(() => import('../modules/containers/jobs')));
  const Ioc = lazy(() => retryLazy(() => import('../modules/containers/ioc')));
  const Reports = lazy(() => retryLazy(() => import('../modules/containers/reports')));
  const Notification = lazy(() => import('../modules/containers/notification'));
  const NotFound = lazy(() => retryLazy(() => import('../modules/pages/authentication/lib/404')));

  return (
    <Suspense fallback={<ZsSpin id="mainRouteLoading" />}>
      <div style={{ height: '100%' }}>
        <Switch>
          <Route exact path={`${match.url}/`} component={asyncComponent(DashBoard)} />
          <Route path={`${match.url}/incidents/attribute/:incidId/:fieldType/:fieldValue`} component={AttributeAnalysisEkasha} />
          <Route path={`${match.url}/incidents`} component={asyncComponent(Incidents)} />
          <Route path={`${match.url}/incidents/TimeLine/:type/:incidentId`} component={asyncComponent(Incidents)} />
          <Route exact path={`${match.url}/playBook`} component={asyncComponent(Playbook)} />
          <Route path={`${match.url}/ruleEngine`} component={asyncComponent(RuleEngine)} />
          <Route path={`${match.url}/apps`} component={asyncComponent(Appint)} />
          <Route path={`${match.url}/reports`} component={asyncComponent(Reports)} />
          <Route path={`${match.url}/ioc`} component={asyncComponent(Ioc)} />
          <Route path={`${match.url}/jobs`} component={asyncComponent(Jobs)} />
          <Route
            path={`${match.url}/administration/:submodule`}
            component={AdministrationRoute}
          />
          <Route path={`${match.url}/allNotifications`} component={asyncComponent(Notification)} />
          <Route
            path={match.url}
            component={NotFound}
          />
        </Switch>
      </div>
    </Suspense>
  );
});
PageRouter.propTypes = {
  match: PropTypes.oneOfType([PropTypes.any]),
};

PageRouter.defaultProps = {
  match: null,
};
export default PageRouter;
