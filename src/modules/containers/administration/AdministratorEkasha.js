import React, {
  useState, useEffect, lazy, Suspense, useCallback,
} from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AdministratorWrapper, LicenseWrapper, AdministartionDetailsWrapper } from './lib/AdministratorWrapper';
import { aclDataAdmin, retryLazy } from '../../../helpers/envData';
import { history } from '../../../configurations/redux/Store';
import ZsCard from '../../../components/card';
import ZsTabs from '../../../components/tabs';
import { licStatus, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import { ZsSpin } from '../../../components/Spin';

const LicenseEkasha = lazy(() => retryLazy(() => import('./licenseEkasha')));
const ClientDetailEkasha = lazy(() => retryLazy(() => import('./ClientDetailEkasha')));
const SlaEkasha = lazy(() => retryLazy(() => import('./SlaEkasha')));
const RiskScoreConfigurationEkasha = lazy(() => retryLazy(() => import('./RiskScoreConfigurationEkasha')));
const SslEkasha = lazy(() => retryLazy(() => import('./SslEkasha')));
const CriticalEkasha = lazy(() => retryLazy(() => import('./CriticalEkasha')));
const TimezoneEkasha = lazy(() => retryLazy(() => import('./TimezoneEkasha')));
const WorkbookEkasha = lazy(() => retryLazy(() => import('./WorkbookEkasha')));
const UserEkasha = lazy(() => retryLazy(() => import('./UserEkasha')));
const TenantEkasha = lazy(() => retryLazy(() => import('./TenantEkasha')));
const AssetsEkasha = lazy(() => retryLazy(() => import('./AssetsEkasha')));
const BackupandrestoreEkasha = lazy(() => retryLazy(() => import('./BackupandrestoreEkasha')));
const CustomFieldEkasha = lazy(() => retryLazy(() => import('./CustomFieldEkasha')));
const IntegrationEkasha = lazy(() => retryLazy(() => import('./IntegrationEkasha')));
const LdapEkasha = lazy(() => retryLazy(() => import('./LdapEkasha')));
const AuditLogsEkasha = lazy(() => retryLazy(() => import('./AuditLogsEkasha')));
const ProxyEkasha = lazy(() => retryLazy(() => import('./ProxyEkasha')));
const ServerEkasha = lazy(() => retryLazy(() => import('./ServerEkasha')));
const ListsEkasha = lazy(() => retryLazy(() => import('./ListsEkasha')));
const TemplateEkasha = lazy(() => retryLazy(() => import('./TemplateEkasha')));
const EscalationRulesEkasha = lazy(() => retryLazy(() => import('./EscalationRulesEkasha')));
const NotFound = lazy(() => retryLazy(() => import('../../pages/authentication/lib/404')));
const NoData = lazy(() => retryLazy(() => import('../../../components/NoData')));

const AdministratorEkasha = React.memo((props) => {
  const { show } = props;
  const [activeDetailTab, setActiveDetailTab] = useState('SLA');
  const [expandCol, setExpandCol] = useState(false);

  const componentsList = {
    SLA: SlaEkasha,
    Risk_Weightage_Configuration: RiskScoreConfigurationEkasha,
    Integration: IntegrationEkasha,
    Asset: AssetsEkasha,
    Server_Management: ServerEkasha,
    LDAP_Configuration: LdapEkasha,
    SSL_Configuration: SslEkasha,
    Critical_User: CriticalEkasha,
    User_Management: UserEkasha,
    Tenant: TenantEkasha,
    Escalation_Rules: EscalationRulesEkasha,
    Workbook: WorkbookEkasha,
    Template: TemplateEkasha,
    Lists: ListsEkasha,
    Timezone: TimezoneEkasha,
    'Backup_&_Restore': BackupandrestoreEkasha,
    Custom_Fields: CustomFieldEkasha,
    Proxy_Configuration: ProxyEkasha,
    Logs: AuditLogsEkasha,
  };

  const TagName = componentsList[activeDetailTab];

  const location = useLocation();

  const changeTab = (e, type, id) => {
    const tabName = e.replace(/ /g, '_');
    setActiveDetailTab(tabName);
    if (type === 'tab' || location.pathname.split('/').length === 3) {
      history.push(`/zeronsec/administration/${tabName || 'SLA'}`);
    }
    if (id === 'adminTabs') {
      const element = document.getElementById(`adminTabs-tab-${e}`);
      if (element !== undefined) {
        const parentDiv = element.parentElement;
        parentDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    }
  };

  const expandLeftAdministration = useCallback(() => {
    setExpandCol((prev) => !prev);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const element = document.getElementById(`adminTabs-tab-${activeDetailTab}`);
      if (element) {
        const parentDiv = element.parentElement;
        parentDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    });
  }, [activeDetailTab]);

  useEffect(() => {
    const modules = {};
    modules.Other = JSON.parse(localStorage.getItem('previosModul')).Other;
    localStorage.setItem('previosModul', JSON.stringify(modules));
  }, [activeDetailTab]);

  useEffect(() => {
    const hashPart = window.location.hash.split('/')[3];
    const tabName = aclDataAdmin.find((x) => x.module.replace(/ /g, '_') === hashPart);
    if (tabName) {
      setActiveDetailTab(hashPart);
    } else if (window.location.hash.split('/')[2] === 'administration') {
      setActiveDetailTab('SLA');
    }
  }, [location]);

  return (
    <AdministratorWrapper>
      <div className="mainAdminContent">
        <div className="backButtonWrapper">
          <div className="headerLeft">
            <div id="create_workbook_backBtn" data-test="expandCollapse" onClick={expandLeftAdministration} className="backButton">
              <div className={expandCol ? 'arrow2' : 'arrow1'} />
            </div>
          </div>
        </div>
        <LicenseWrapper className={expandCol ? 'leftSection leftCollapse' : 'leftSection'}>
          <div className="logSideHeader">
            <div className="logHeaderData">
              <div className="logVersion">
                Current Version
              </div>
              <div className="basicAction">
                <div className="version">
                  Ekasha 2.0
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: !PermissionRO('administration', 'license').read ? '75%' : '100%' }}>
            <LicenseEkasha {...props} />
            {
              !PermissionRO('administration', 'client').read
                ? <NoData style={{ height: 'calc(100vh - 728px)' }} data-test="ekasha_client_nodata" message="You don't have permission to access this page" />
                : <ClientDetailEkasha {...props} />
            }
          </div>
        </LicenseWrapper>
      </div>
      <AdministartionDetailsWrapper className={expandCol ? 'rightSection rightExpand' : 'rightSection'}>
        {
          aclDataAdmin.findIndex((x) => x.module.replace(/ /g, '_') === window.location.hash.split('/')[3]) === -1 && show !== false && window.location.hash.split('/')[2] === 'administration'
            ? (
              <div className="error">
                <NotFound redirectPath="Administration" />
              </div>
            )
            : (
              <div style={{ height: '100%' }}>
                <ZsCard>
                  <div className="detailContent">
                    {!licStatus
                      ? (
                        <div className="error" style={{ width: 'auto' }}>
                          <NoData message="You don't have permission to access this page" />
                        </div>
                      )
                      : (
                        <>
                          <div className="tab">
                            <ZsTabs
                              id="adminTabs"
                              scrollbtn
                              tabType="box"
                              defaultSetActiveTab={activeDetailTab.replace(/_/g, ' ')}
                              onTabClick={(e) => changeTab(e, 'tab', 'adminTabs')}
                              data={aclDataAdmin}
                            />
                          </div>
                          <Suspense fallback={<ZsSpin id="AdminEkashaLoading" style={{ top: '52%' }} />}>
                            <div className="adminModule">
                              <TagName {...props} />
                            </div>
                          </Suspense>
                        </>
                      )}
                  </div>
                </ZsCard>
              </div>
            )
        }
      </AdministartionDetailsWrapper>
    </AdministratorWrapper>
  );
});
AdministratorEkasha.propTypes = {
  show: PropTypes.bool,
};

AdministratorEkasha.defaultProps = {
  show: false,
};

export default AdministratorEkasha;
