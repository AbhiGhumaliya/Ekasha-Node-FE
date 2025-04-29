import React, {
  useState, useEffect, lazy, Suspense,
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotFound from '../authentication/lib/404';
import { history } from '../../../configurations/redux/Store';
import { IncidentsBodyWrapper } from './lib/IncidentsWrapper';
import { aclDataIncident, retryLazy } from '../../../helpers/envData';
import ZsTabs from '../../../components/tabs';
import { ZsSpin } from '../../../components/Spin';

const NoteEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/notesEkasha')));
const ActionEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/actionEkasha')));
const ActivityEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/activityEkasha')));
const ArtifactEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/artifactEkasha')));
const IncidentAssetsEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/assetsEkasha')));
const EvidenceEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/evidenceEkasha')));
const ReferencesEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/filesEkasha')));
const OveriewEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/overviewEkasha')));
const PlaybookEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/playbookEkasha')));
const ReportsEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/reportsEkasha')));
const TimelineEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/timeLineEkasha')));
const WarroomEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/warroomEkasha')));
const WorkbookEkasha = lazy(() => retryLazy(() => import('../../containers/incidents/subModule/workbookEkasha')));

const DetailViewBody = React.memo((props) => {
  const [activeDetailTab, setActiveDetailTab] = useState('Timeline');
  const componentsList = {
    Timeline: TimelineEkasha,
    Overview: OveriewEkasha,
    Actions: ActionEkasha,
    Workbooks: WorkbookEkasha,
    Playbooks: PlaybookEkasha,
    Assets: IncidentAssetsEkasha,
    Evidence: EvidenceEkasha,
    Reports: ReportsEkasha,
    Artifacts: ArtifactEkasha,
    Activities: ActivityEkasha,
    Notes: NoteEkasha,
    References: ReferencesEkasha,
    Warroom: WarroomEkasha,
  };

  const ActiveTab = componentsList[activeDetailTab];
  const location = useLocation();

  useEffect(() => {
    window.addEventListener('resize', () => {
      const element = document.getElementById(`incidentTabs-tab-${activeDetailTab}`);
      if (element) {
        const parentDiv = element.parentElement;
        parentDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    });
  }, []);

  const changeTab = (e, type, id) => {
    setActiveDetailTab(e === undefined ? 'Timeline' : e.split('?')[0] || 'Timeline');
    if (type === 'tab' || window.location.hash.split('/').length === 3) {
      history.push(`/zeronsec/incidents/${e || 'Timeline'}`);
    }
    if (id === 'incidentTabs') {
      const element = document.getElementById(`incidentTabs-tab-${e}`);
      if (element !== undefined) {
        const parentDiv = element.parentElement;
        parentDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    }
  };

  useEffect(() => {
    if (window.location.hash.split('/').length > 3 && window.location.hash.split('/')[3].includes('Timeline')) {
      changeTab(window.location.hash.split('/')[3], 'url');
      history.push(`/zeronsec/incidents/${window.location.hash.split('/')[3] || 'Timeline'}`);
    } else {
      changeTab('Timeline', 'url');
      history.push('/zeronsec/incidents/Timeline');
    }
  }, [location]);

  return (
    <IncidentsBodyWrapper>
      {aclDataIncident.findIndex((x) => x.module === activeDetailTab) === -1 && window.location.hash?.split('/')[2] === 'incidents'
          && (<div className="error"><NotFound style={{ position: 'relative', display: 'block' }} /></div>)}
      {(aclDataIncident.findIndex((x) => x.module === activeDetailTab) !== -1 && window.location.hash?.split('/')[2] === 'incidents')
        && (
          <div>
            <div className="tab">
              <ZsTabs
                id="incidentTabs"
                scrollbtn
                tabType="box"
                onTabClick={(e) => changeTab(e, 'tab', 'incidentTabs')}
                defaultSetActiveTab={activeDetailTab}
                data={aclDataIncident}
              />
            </div>
            <Suspense fallback={<ZsSpin id="IncidentTabsLoading" style={{ top: '61%', left: '50%' }} />}>
              <div className="content">
                <ActiveTab {...props} />
              </div>
            </Suspense>
          </div>
        )}
    </IncidentsBodyWrapper>
  );
});
DetailViewBody.propTypes = {
  selectTabChange: PropTypes.bool,
  IncidentId: PropTypes.number,
};

DetailViewBody.defaultProps = {
  selectTabChange: false,
  IncidentId: 0,
};
export default DetailViewBody;
