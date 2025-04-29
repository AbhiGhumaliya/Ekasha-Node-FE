import React, {
  useState, Suspense, lazy, useCallback,
} from 'react';
import { PermissionRO } from '../../../helpers/lib/StorageHandlers';
import NoData from '../../../components/NoData';
import { ReportsWrapper } from './lib/ReportsWrapper';
import ZsTabs from '../../../components/tabs';
import Icons from '../../../components/icons';
import { ZsSpin } from '../../../components/Spin';
import Toaster from '../../../components/toaster';
import { retryLazy } from '../../../helpers/envData';

const ReportTab = lazy(() => retryLazy(() => import('./lib/reportTab')));
const ArchiveTab = lazy(() => retryLazy(() => import('./lib/archiveTab')));

const Reports = React.memo((props) => {
  const [activeReportTab, setactiveReportTab] = useState('Reports');
  const [openNewReportModal, setOpenNewReportModal] = useState(false);
  const [reportType, setReportType] = useState('new');

  const componentsList = {
    Reports: ReportTab,
    Archives: ArchiveTab,
  };

  const ActiveTab = componentsList[activeReportTab.split(' ').join('')];

  const createModalOpen = useCallback(() => {
    setOpenNewReportModal(true);
    setReportType('new');
  }, []);

  // check permissions of add button tab wise
  const permissionCheckOnClick = useCallback(() => {
    if (activeReportTab === 'Reports' && PermissionRO('reports').write) {
      createModalOpen();
    } else {
      Toaster({ title: "You don't have permission.", type: 'error' });
    }
  }, [activeReportTab]);

  // check permissions of add button tab wise
  const permissionCheck = useCallback(() => {
    if (activeReportTab === 'Reports' && PermissionRO('reports').write) {
      return 1;
    }
    return 0.4;
  }, [activeReportTab]);

  const reportTabs = [{ module: 'Reports' }, { module: 'Archives' }];

  if (!PermissionRO('reports').read) {
    return <NoData id="Reports_Permission_RO_NoData_Page" message="You don't have permission to access this page" />;
  }
  return (
    <ReportsWrapper id="Reports_Wrapper">
      <div className="headerUserManagement">
        <ZsTabs
          id="Reports_Tabs"
          className="AdminUserTab"
          scrollbtn
          tabType="box"
          defaultSetActiveTab={activeReportTab}
          onTabClick={(e) => setactiveReportTab(e)}
          data={reportTabs}
        />
        {activeReportTab === 'Reports' && (
          <div className="addUserManagementBtn">
            <Icons
              id="Reports_Add_Button"
              icontype="globle"
              type="addNewButtonSmall"
              style={{ cursor: 'pointer', opacity: permissionCheck() }}
              onClick={() => permissionCheckOnClick()}
            />
          </div>
        )}
      </div>
      <Suspense fallback={<ZsSpin id="AdminUserSubTabLoading" />}>
        <ActiveTab
          reportType={reportType}
          setReportType={setReportType}
          openNewReportModal={openNewReportModal}
          setOpenNewReportModal={setOpenNewReportModal}
          {...props}
        />
      </Suspense>
    </ReportsWrapper>
  );
});
Reports.propTypes = {
};

Reports.defaultProps = {
};
export default Reports;
