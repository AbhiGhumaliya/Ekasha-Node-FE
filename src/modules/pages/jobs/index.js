import React, {
  useState, useEffect, useMemo, useContext, useCallback, Suspense,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ekashaPermission, PermissionRO } from '../../../helpers/lib/StorageHandlers';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import ZsTable from '../../../components/table';
import NoData from '../../../components/NoData';
import JobsWrapper from './lib/JobsWrapper';
import { ZsSpin } from '../../../components/Spin';
import { getJobTableColumns } from './JobTableColumns';
import { getTableHeight } from '../../../helpers/envData';
import { TimeFilContext } from '../../containers/TimeFilterContext';
import JobFilters from './lib/JobFilters'; // Import the new JobFilters component

let subscribe;

const Job = React.memo((props) => {
  const { getAllJobAction, fakeActionJob } = props;

  // local state
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalPage, setTotalPage] = useState([]);
  const [errorName, setErrorName] = useState({
    type: 'All',
    page: 0,
    pageData: 20,
    order: 'descending',
    timeFilter: {
      from: moment().subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
      to: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
    },
  });
  const [timer, setTimer] = useState(null);
  const [jobDataList, setJobDataList] = useState([]);

  if (!PermissionRO('jobs').read) {
    return <NoData data-test="PermissionRO_Jobs_No_Data" message="You don't have permission to access this page" />;
  }

  const {
    customerID,
  } = useContext(TimeFilContext);

  // redux state
  const GetAllJobRes = useSelector(
    (state) => (state.Jobs.GetAllJobResponse || {}),
  );

  const nextPage = useCallback(() => {
    getAllJobAction({ ...errorName, page: errorName.page + 1 });
  });

  const setFields = useCallback((e, type) => {
    const errorNameSet = errorName;
    if (type === 'from' || type === 'to') {
      errorNameSet.timeFilter[type] = e;
    }
    errorNameSet[type] = e;
    errorNameSet.page = 0;
    errorNameSet.customerID = localStorage.getItem('customerID');
    setErrorName({ ...errorNameSet });
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      getAllJobAction(errorNameSet);
    }, 500);

    setTimer(newTimer);
  }, [errorName, timer, getAllJobAction]);

  const onJobsdataReceived = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'job') {
      switch (dataRes.operation) {
        case 'update':
          if (dataRes.status) {
            setJobDataList((prevState) => {
              const index = prevState.findIndex((e) => e.token === dataRes.data.jobData.token);
              if (index !== -1) {
                const a = prevState;
                a[index] = dataRes.data.jobData;
                return [...a];
              }
              return prevState;
            });
          }
          break;
        case 'add':
          if (dataRes.status) {
            setJobDataList((prevState) => (
              prevState.findIndex((e) => e.token === dataRes.data.jobData.token) === -1 && dataRes.data.jobData.customerID === localStorage.getItem('customerID')
                ? [dataRes.data.jobData, ...prevState] : prevState));
            setTotalCount((prevState) => prevState + 1);
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const errorNameSet = errorName;
    const callback = () => {
      if (PermissionRO('jobs').read) {
        getAllJobAction({
          type: errorNameSet.type || 'All',
          page: 0,
          pageData: 20,
          order: errorNameSet.order || 'descending',
          customerID: localStorage.getItem('customerID'),
          timeFilter: errorNameSet.timeFilter,
        });
      }
    };
    callback();
    window.addEventListener('ekashaPermissionChanged', callback);
    return () => {
      window.removeEventListener('ekashaPermissionChanged', callback);
    };
  }, [ekashaPermission.aclData, customerID]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onJobsdataReceived);
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
    if (GetAllJobRes.status) {
      if (GetAllJobRes.data.currentPage !== errorName.page) {
        setErrorName({ ...errorName, page: GetAllJobRes.data.currentPage });
        setJobDataList([...jobDataList, ...GetAllJobRes.data.jobData]);
      } else {
        setJobDataList([...GetAllJobRes.data.jobData]);
      }
      setLoading(false);
      setTotalCount(GetAllJobRes.data.TotalCount);
      setTotalPage(GetAllJobRes.data.totalPages);
      fakeActionJob();
    } else if (GetAllJobRes.status === false) {
      setJobDataList([]);
      setLoading(false);
      fakeActionJob();
    }
  }, [GetAllJobRes]);

  const columns = useMemo(() => (getJobTableColumns()), []);

  return (
    <JobsWrapper data-test="job_Wrapper">
      {!loading && (
        <Suspense fallback={null}>
          <JobFilters errorName={errorName} setFields={setFields} />
          {' '}
        </Suspense>
      )}
      {loading && (
        <div style={{ height: 'calc(100% - 40px)' }}>
          <ZsSpin id="JobTableLoading" />
        </div>
      )}
      {!loading && jobDataList.length === 0 && (<NoData data-test="Jobs_No_Data_in_Table" style={{ height: 'calc(100% - 120px)' }} />)}
      {
        !loading && jobDataList.length !== 0 && (
          <div style={{ height: getTableHeight([], 120) }}>
            <ZsTable
              data-test="job_table_wrapper"
              id="jobDataList"
              dataSource={jobDataList}
              columns={columns}
              rowKey="token"
              pagination={false}
              displayType="block"
              changeColors
              totalCount={totalCount}
              nextPage={nextPage}
            />
          </div>
        )
      }
      <div className="tableFooter adminTableFooter">
        <span className="counts">{totalCount}</span>
        <span className="moduleName">Job(s)</span>
      </div>
    </JobsWrapper>
  );
});

Job.propTypes = {
  getAllJobAction: PropTypes.func,
  fakeActionJob: PropTypes.func,
};

Job.defaultProps = {
  getAllJobAction: null,
  fakeActionJob: null,
};

export default Job;
