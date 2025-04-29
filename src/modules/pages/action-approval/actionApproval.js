import React, {
  lazy, Suspense, useCallback, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ZsSpin } from '../../../components/Spin';
import { retryLazy } from '../../../helpers/envData';

const LinkReasonComponent = lazy(() => retryLazy(() => import('./linkReasonComponent')));
const LinkExpiredComponent = lazy(() => retryLazy(() => import('./linkexpiredComponent')));
const LinkExceptionComponent = lazy(() => retryLazy(() => import('./linkExceptionComponent')));
const LinkDeclineComponent = lazy(() => retryLazy(() => import('./linkDeclineComponent')));

const ActionApproval = React.memo((props) => {
  const {
    declineActionApprove, checkTokenExipred, fakeActionApproval,
  } = props;

  const [loading, setLoding] = useState(true);
  const [linkNotExpired, setLinkNotExired] = useState(false);
  const [linkDecline, setLinkDecline] = useState(false);
  const [linkException, setLinkException] = useState(false);
  const [declineData, setDeclineData] = useState([]);

  const data = document.location.hash.split('/');

  const DeclineActionApprovalRes = useSelector((state) => (
    state.ActionApproval.DeclineActionApprovalResponse || {}
  ));
  const CheckDeclineActionRes = useSelector((state) => (
    state.ActionApproval.CheckDeclineActionResponse || {}
  ));

  const submitAction = useCallback((value) => {
    declineActionApprove(data[2], data[3], value, localStorage.getItem('customerID'));
  }, [data]);

  useEffect(() => {
    if (CheckDeclineActionRes && CheckDeclineActionRes.status === true) {
      setLinkNotExired(true);
      setLoding(false);
      fakeActionApproval();
    } else if (CheckDeclineActionRes.status === false) {
      setLinkNotExired(false);
      setLoding(false);
      fakeActionApproval();
    }
  }, [CheckDeclineActionRes]);

  useEffect(() => {
    checkTokenExipred(data[2], data[3]);
  }, []);

  useEffect(() => {
    if (DeclineActionApprovalRes && DeclineActionApprovalRes.status === true) {
      setDeclineData(DeclineActionApprovalRes.data);
      setLinkDecline(true);
      setLinkNotExired(false);
      setTimeout(() => {
        setLinkDecline(false);
        window.close();
      }, 10000);
      fakeActionApproval();
    } else if (DeclineActionApprovalRes.status === false) {
      setLinkNotExired(false);
      setLinkException(true);
      fakeActionApproval();
    }
  }, [DeclineActionApprovalRes]);

  return (
    <>
      <div id="actionApprovalWrapper" style={{ display: 'unset', background: '#1c1e20' }}>
        {loading && (
        <>
          <ZsSpin id="ActionApprovalSpinner" />
        </>
        )}
        {linkException && (
          <>
            <Suspense fallback={null}>
              <LinkExceptionComponent />
            </Suspense>
          </>
        )}
        {linkNotExpired && (
          <>
            <Suspense fallback={null}>
              <LinkReasonComponent
                submitAction={submitAction}
              />
            </Suspense>
          </>
        )}
        {linkDecline && (
          <>
            <Suspense fallback={null}>
              <LinkDeclineComponent data={declineData} />
            </Suspense>
          </>
        )}
        {!loading && !linkNotExpired && !linkDecline && !linkException && (
          <>
            <Suspense fallback={null}>
              <LinkExpiredComponent />
            </Suspense>
          </>
        )}
      </div>
    </>
  );
});
ActionApproval.propTypes = {
  declineActionApprove: PropTypes.func,
  checkTokenExipred: PropTypes.func,
  fakeActionApproval: PropTypes.func,
};

ActionApproval.defaultProps = {
  declineActionApprove: null,
  checkTokenExipred: null,
  fakeActionApproval: null,
};
export default ActionApproval;
