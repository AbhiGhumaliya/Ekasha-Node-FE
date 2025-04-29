import React, {
  lazy, Suspense, useContext, useEffect, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { IncidentsWrapper } from './lib/IncidentsWrapper';
import { LocalgetAllFilter, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import { TimeFilContext } from '../../containers/TimeFilterContext';
import { retryLazy } from '../../../helpers/envData';
import NoData from '../../../components/NoData';

const IncidentList = lazy(() => retryLazy(() => import('./IncidentList')));
const IncidentDetailView = lazy(() => retryLazy(() => import('./IncidentDetailView')));
const IncidentTableView = lazy(() => retryLazy(() => import('./incidentTableView')));

const Incidents = React.memo((props) => {
  const {
    createIncidentAction, fakeIncidentAction, fetchFieldsForDetails, fakeActionPanel,
    getAllIncidentAction, getIncidentScoreAction, fakeActionAssets, fakeActionDashboard,
    GetOwnerAction, basicDetailsAction, assignUserAction, fakeActionAuth,
    changeIncidentStatusAction, getIndexFields, fetchFields,
  } = props;

  const [createIncident, setCreateIncident] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [PageRowCount, setPageRowCount] = useState('10');
  const [getAllFilter, setGetAllFilter] = useState(LocalgetAllFilter);
  const [ownerList, setOwnerList] = useState([]);
  const [incidentId, setIncidentId] = useState();
  const [incidentData, setIncidentData] = useState(false);
  const [selectIncident, setSelectIncident] = useState({});
  const [selectTab, setSelectTab] = useState(false);
  const [toogleCard, setToogleCard] = useState(false);
  const [incidentsList, setIncidentList] = useState([]);

  const resetData = useLocation();

  const PermissionsRes = useSelector((state) => (
    state.Auth.userPermissionsResponse || {}
  ));

  useEffect(() => {
    if (PermissionsRes.status || PermissionsRes.status === false) {
      fakeActionAuth();
    }
  }, [PermissionsRes]);

  const {
    tableView, setTableView,
  } = useContext(TimeFilContext);

  const CloseModal = () => {
    setCreateIncident(false);
    setSubmited(false);
  };

  useEffect(() => {
    setIncidentData((pre) => pre);
  }, [incidentData]);

  useEffect(() => {
    setTableView(false);
  }, []);

  if (!PermissionRO('incidents').read) {
    return <NoData id="Incident_Permission_No_Data" message="You don't have permission to access this page" />;
  }
  return (
    <>
      {tableView
        ? (
          <Suspense fallback={false}>
            <IncidentTableView
              GetOwnerAction={GetOwnerAction}
              fakeIncidentAction={fakeIncidentAction}
              fakeActionAssets={fakeActionAssets}
              CloseModal={CloseModal}
              createIncident={createIncident}
              setCreateIncident={setCreateIncident}
              submited={submited}
              setSubmited={setSubmited}
              fakeActionDashboard={fakeActionDashboard}
              fetchFieldsForDetails={fetchFieldsForDetails}
              createIncidentAction={createIncidentAction}
              getAllIncidentAction={getAllIncidentAction}
              assignUserAction={assignUserAction}
              changeIncidentStatusAction={changeIncidentStatusAction}
              setTableView={setTableView}
              getAllFilter={getAllFilter}
              setGetAllFilter={setGetAllFilter}
              PageRowCount={PageRowCount}
              setPageRowCount={setPageRowCount}
            />
          </Suspense>
        )
        : (
          <IncidentsWrapper id="IncidentsWrapper">
            <Suspense fallback={false}>
              <IncidentList
                selectIncidentId={setIncidentId}
                setSelectTab={setSelectTab}
                setIncidentNumber={setIncidentData}
                IncidentId={incidentId}
                fakeActionAssets={fakeActionAssets}
                getIncidentScoreAction={getIncidentScoreAction}
                fakeActionPanel={fakeActionPanel}
                fakeIncidentAction={fakeIncidentAction}
                getAllIncidentAction={getAllIncidentAction}
                basicDetailsAction={basicDetailsAction}
                GetOwnerAction={GetOwnerAction}
                resetData={resetData}
                location={useLocation().pathname}
                createIncident={createIncident}
                setCreateIncident={setCreateIncident}
                getAllTableFilter={getAllFilter}
                setGetAllTableFilter={setGetAllFilter}
                setIncidentList={setIncidentList}
                getIndexFields={getIndexFields}
                fetchFields={fetchFields}
                ownerList={ownerList}
                setOwnerList={setOwnerList}
                toogleCard={toogleCard}
                {...props}
              />
            </Suspense>
            <Suspense fallback={false}>
              <IncidentDetailView
                IncidentId={incidentId}
                selectIncidentId={setIncidentId}
                selectIncident={selectIncident}
                setIncidnet={setSelectIncident}
                incidentNumber={incidentData}
                selectTabChange={selectTab}
                incidentsList={incidentsList}
                submiteds={submited}
                setSubmiteds={setSubmited}
                createIncident={createIncident}
                CloseModal={CloseModal}
                fakeIncidentAction={fakeIncidentAction}
                ownerList={ownerList}
                setOwnerList={setOwnerList}
                fetchFieldsForDetails={fetchFieldsForDetails}
                createIncidentAction={createIncidentAction}
                setToogleCard={setToogleCard}
                toogleCard={toogleCard}
                {...props}
              />
            </Suspense>
          </IncidentsWrapper>
        )}
    </>
  );
});
Incidents.propTypes = {
  createIncidentAction: PropTypes.func,
  fetchFieldsForDetails: PropTypes.func,
  fakeIncidentAction: PropTypes.func,
  getAllIncidentAction: PropTypes.func,
  getIncidentScoreAction: PropTypes.func,
  GetOwnerAction: PropTypes.func,
  basicDetailsAction: PropTypes.func,
  assignUserAction: PropTypes.func,
  changeIncidentStatusAction: PropTypes.func,
  fakeActionPanel: PropTypes.func,
  fakeActionAssets: PropTypes.func,
  fakeActionDashboard: PropTypes.func,
  getIndexFields: PropTypes.func,
  fetchFields: PropTypes.func,
  fakeActionAuth: PropTypes.func,
};

Incidents.defaultProps = {
  createIncidentAction: null,
  fetchFieldsForDetails: null,
  fakeIncidentAction: null,
  getAllIncidentAction: null,
  getIncidentScoreAction: null,
  GetOwnerAction: null,
  basicDetailsAction: null,
  fakeActionPanel: null,
  assignUserAction: null,
  changeIncidentStatusAction: null,
  fakeActionAssets: null,
  fakeActionDashboard: null,
  getIndexFields: null,
  fetchFields: null,
  fakeActionAuth: null,
};
export default Incidents;
