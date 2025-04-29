/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
  lazy, Suspense, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { WarroomWrapper } from './style';
import WarAddUser from '../../../../../../assets/images/WarAddUser.svg';
import ZsTooltip from '../../../../../../components/tooltip';
import NoData from '../../../../../../components/NoData';
import { ZsSpin } from '../../../../../../components/Spin';
import { retryLazy } from '../../../../../../helpers/envData';

const Message = lazy(() => retryLazy(() => import('./messages')));
const MessageInput = lazy(() => retryLazy(() => import('./messageInput')));
const WarroomSideBar = lazy(() => retryLazy(() => import('./warroomSideBar')));

const Warroom = React.memo((props) => {
  const {
    getAllMessagesAction, fakeWarroomAction, IncidentId,
  } = props;
  const [sideBar, setSideBar] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState({ load: true, message: 'Loading...' });
  const [messages, setMessages] = useState([]);

  const GetAllMessagesRes = useSelector((state) => state.Warroom.GetAllMessagesResponse || {});

  useEffect(() => {
    getAllMessagesAction(IncidentId, localStorage.getItem('customerID'));
  }, []);

  useEffect(() => {
    if (GetAllMessagesRes.status && GetAllMessagesRes.status === true) {
      if (GetAllMessagesRes.data) {
        if (!GetAllMessagesRes.data.warroomStatus) {
          setLoading({ load: true, message: "You don't have permission to access this page" });
        } else {
          setLoading({ load: false, message: 'Loading...' });
        }
        setMessages(GetAllMessagesRes.data.message);
        setCurrentUser(GetAllMessagesRes.data.currentUser);
      }
      fakeWarroomAction();
    } else if (GetAllMessagesRes.status === false) {
      setMessages([]);
      fakeWarroomAction();
    }
  }, [GetAllMessagesRes]);

  if (loading.load) {
    if (loading.message === 'Loading...') {
      return <ZsSpin id="IncidentWarromLoading" style={{ top: '60%' }} />;
    }
    return (
      <NoData
        id="Incident_Warroom_Permission_RO_NoData"
        message={loading.message}
      />
    );
  }

  return (
    <WarroomWrapper id="Incident_Warroom_Wrapper">
      <div className="warRoomContainer">
        <div className="messages">
          <Suspense fallback={false}>
            <Message
              currentUser={currentUser}
              messages={messages}
              setMessages={setMessages}
              {...props}
            />
          </Suspense>
          <Suspense fallback={false}>
            <MessageInput {...props} />
          </Suspense>
        </div>
      </div>
      <div>
        <ZsTooltip subType="iconTool" autoRight title="Show Participants">
          <img
            id="Incident_Warroom_Show_BrandLogo"
            onClick={() => setSideBar(true)}
            style={{
              height: '20px',
              width: '26px',
              position: 'absolute',
              right: '9px',
              top: '13px',
              cursor: 'pointer',
            }}
            alt="brandLogo"
            src={WarAddUser}
          />
        </ZsTooltip>
      </div>
      <Suspense fallback={false}>
        <WarroomSideBar
          viewDetail={sideBar}
          closeSide={setSideBar}
          {...props}
        />
      </Suspense>
    </WarroomWrapper>
  );
});
Warroom.propTypes = {
  getAllMessagesAction: PropTypes.func,
  fakeWarroomAction: PropTypes.func,
  IncidentId: PropTypes.string,
};

Warroom.defaultProps = {
  getAllMessagesAction: null,
  fakeWarroomAction: null,
  IncidentId: '',
};
export default Warroom;
