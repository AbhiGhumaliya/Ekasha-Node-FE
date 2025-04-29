import React, { lazy, Suspense } from 'react';
import {
  Route,
  Switch,
  Redirect,
  HashRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { retryLazy } from './helpers/envData';
import asyncComponent from './helpers/lib/RootComponent';
import PreviewPlaybookTab from './modules/pages/incidents/lib/subModule/playbook/lib/previewPlaybookTab';

const Setup = lazy(() => import('./modules/containers/authentication/lib/setup'));
const SignInMessage = lazy(() => import('./modules/pages/authentication/lib/SignInMessage'));
const Containers = lazy(() => retryLazy(() => import('./modules/containers')));
const NewPlaybook = lazy(() => retryLazy(() => import('./modules/pages/playbook/lib/newPlaybook')));
const Authentication = lazy(() => retryLazy(() => import('./modules/containers/authentication')));
const ActionApproval = lazy(() => import('./modules/containers/actionApproval'));
const ListPreviewEkasha = lazy(() => import('./modules/containers/administration/ListPreviewEkasha'));

const AppRouter = (props) => (
  <div className="globalHeight">
    <HashRouter history={props.history}>
      <Suspense fallback={false}>
        <Switch>
          <Route exact path="/" component={asyncComponent(Authentication)} />
          <Route path="/setup" component={asyncComponent(Setup)} />
          <Route path="/signininfo" component={asyncComponent(SignInMessage)} />
          <Route path="/actionApproval/:email/:token/:customerID" component={asyncComponent(ActionApproval)} />
          <Route path="/list/preview/:dataToken" component={asyncComponent(ListPreviewEkasha)} />
          <Route exact path="/zeronsec/playbook/:type/:playbookId" component={asyncComponent(NewPlaybook)} />
          <Route exact path="/zeronsec/incident/playbook/:type/:customerID/:incidentId/:playbookId/:preRefToken/:refToken/:isNested" component={PreviewPlaybookTab} />
          <Route path="/zeronsec" component={asyncComponent(Containers)} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </HashRouter>
  </div>
);

AppRouter.propTypes = {
  history: PropTypes.oneOfType([PropTypes.object]),
};
AppRouter.defaultProps = {
  history: null,
};

export default AppRouter;
