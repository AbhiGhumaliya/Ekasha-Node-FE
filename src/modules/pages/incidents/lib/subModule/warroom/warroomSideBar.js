import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'antd';
import { DetailAreaWrapper } from './style';
import ZsButton from '../../../../../../components/forms/button';
import Toaster from '../../../../../../components/toaster';
import Icons from '../../../../../../components/icons';
import ZsSelect from '../../../../../../components/forms/select';
import { GetOwnerAction, fakeIncidentAction } from '../../../../../../apis/incidents/actions';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import ZsModal from '../../../../../../components/modal';
import ZsTooltip from '../../../../../../components/tooltip';

let subscribe;

const WarroomSideBar = (props) => {
  const {
    viewDetail, closeSide, getDetailWarroomAction,
    fakeWarroomAction, IncidentId, inviteMemberAction,
    removeInviteMemberAction, selectIncident,
  } = props;

  const [warRoom, setWarRoom] = useState({});
  const [inviteList, setInviteList] = useState([]);
  const [newSelect, setNewSelect] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openWarromUserModal, setOpenWarromUserModal] = useState(false);
  const [warrromUserToken, setWarrromUserToken] = useState('');
  const [placement, setPlacement] = useState(window.innerHeight <= 756 ? 'top' : 'bottom');
  const dispatch = useDispatch();

  const GetOwnerRes = useSelector((state) => (state.Incident.GetOwnerResponse || {}));
  const GetDetailWarroomRes = useSelector(
    (state) => (state.Warroom.GetDetailWarroomResponse || {}),
  );
  const inviteMemberRes = useSelector((state) => (state.Warroom.InviteMemberResponse) || {});
  const removeInviteMemberRes = useSelector((state) => (state.Warroom.RemoveMemberResponse || {}));
  const GetOwnerActionData = () => dispatch(GetOwnerAction());

  const disableAddedField = React.useMemo(() => warRoom?.users?.map(
    (obj) => obj.token,
  ), [warRoom]);

  useEffect(() => {
    if (viewDetail) {
      setLoading(true);
      setLoading(false);
      setOpenWarromUserModal(false);
      getDetailWarroomAction(IncidentId, localStorage.getItem('customerID'));
    }
  }, [viewDetail]);

  useEffect(() => {
    if (viewDetail) {
      closeSide(true);
    }
  }, [openWarromUserModal]);

  const warromDeleteUser = useCallback((id) => {
    if (selectIncident.status === 'Closed') {
      Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
    } else {
      closeSide(true);
      setWarrromUserToken(id);
      setOpenWarromUserModal(true);
    }
  }, [selectIncident]);

  useEffect(() => {
    const mousedownHandler = (e) => {
      if (newSelect === true) {
        if (document.getElementById('pMenuOpen')) {
          if (!document.getElementById('pMenuOpen').contains(e.target)) {
            setNewSelect(false);
            setIsOpen(false);
          }
        }
      }
      if (viewDetail === true) {
        if (document.getElementById('viewDetailBar')) {
          if (!document.getElementById('viewDetailBar').contains(e.target)) {
            closeSide(false);
            setIsOpen(false);
          }
        }
      }
    };
    window.addEventListener('mousedown', mousedownHandler);
    return () => {
      window.removeEventListener('mousedown', mousedownHandler);
    };
  }, [newSelect, viewDetail]);

  const closeDrawer = useCallback(() => {
    closeSide(false);
    setUserId(null);
    setNewSelect(false);
    setWarRoom({});
  }, []);

  const getUserpic = useCallback((name) => {
    const Chatacter = name.split(' ');
    return (Chatacter[0].charAt(0));
  }, []);

  const onWarroomsDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'warRoom') {
      switch (dataRes.operation) {
        case 'update':
          if (dataRes.status) {
            closeSide((pre) => {
              if (pre && IncidentId === parseInt(dataRes.data.incidentId)) {
                setWarRoom((prevState) => {
                  const a = { ...prevState };
                  const j = a.users.findIndex((e) => e.token === dataRes.data.token);
                  if (j !== -1) {
                    a.users.splice(j, 1);
                    a.users = [...a.users, dataRes.data];
                  } else if (j === -1) {
                    if (dataRes.data.inviteStatus === 'assign') {
                      a.assignedName = dataRes.data.name;
                    }
                    if (dataRes.data.inviteStatus === 'owner') {
                      a.ownerName = dataRes.data.name;
                    }
                    a.users = [...a.users, dataRes.data];
                  }
                  return { ...a };
                });
              }
              return pre;
            });
          }
          break;
        case 'add':
          if (dataRes.status) {
            closeSide((pre) => {
              if (pre && IncidentId === parseInt(dataRes.data.incidentId)) {
                setWarRoom((prevState) => {
                  const a = { ...prevState };
                  const i = a.users.findIndex((e) => e.token === dataRes.data.token);
                  if (i === -1) {
                    a.users = [...a.users, dataRes.data];
                  }
                  return { ...a };
                });
              }
              return pre;
            });
          }
          break;
        case 'remove':
          if (dataRes.status) {
            closeSide((pre) => {
              if (pre && IncidentId === parseInt(dataRes.data.incidentId)) {
                setWarRoom((prevState) => {
                  const deleteToken = dataRes.data;
                  const a = prevState;
                  const i = a.users.findIndex((e) => e.token === deleteToken.token);
                  if (i !== -1) {
                    a.users.splice(i, 1);
                  }
                  return { ...a };
                });
              }
              return pre;
            });
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const channelSub = () => {
        subscribe = stompClient.subscribe('/topic/broadcast', onWarroomsDataRecieved);
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
    if (GetOwnerRes.status) {
      setInviteList(GetOwnerRes.data);
      fakeIncidentAction();
    } else if (GetOwnerRes.status === false) {
      fakeIncidentAction();
    }
  }, [GetOwnerRes]);

  useEffect(() => {
    if (GetDetailWarroomRes && GetDetailWarroomRes.status === true) {
      if (GetDetailWarroomRes.data) {
        setLoading(false);
        if (GetDetailWarroomRes.data.ownerName === GetDetailWarroomRes.data.assignedName) {
          GetDetailWarroomRes.data.users.splice(0, 1);
        }
        setWarRoom(GetDetailWarroomRes.data);
      }
      fakeWarroomAction();
    } else if (GetDetailWarroomRes.status === false) {
      setLoading(false);
      setWarRoom({});
      fakeWarroomAction();
    }
  }, [GetDetailWarroomRes]);

  useEffect(() => {
    if (inviteMemberRes && inviteMemberRes.status === true) {
      if (inviteMemberRes.data) {
        setLoading(false);
        setUserId(null);
      }
      fakeWarroomAction();
    } else if (inviteMemberRes.status === false) {
      setLoading(false);
      setUserId(null);
      fakeWarroomAction();
    }
  }, [inviteMemberRes]);

  useEffect(() => {
    if (removeInviteMemberRes && removeInviteMemberRes.status) {
      if (removeInviteMemberRes.data) {
        setOpenWarromUserModal(false);
        setLoading(false);
        closeSide(true);
      }
      fakeWarroomAction();
    } else if (removeInviteMemberRes.status === false) {
      setOpenWarromUserModal(false);
      setLoading(false);
      fakeWarroomAction();
      closeSide(true);
    }
  }, [removeInviteMemberRes]);

  const handleWindowResize = useCallback(() => {
    setPlacement(window.innerHeight <= 756 ? 'top' : 'bottom');
  }, []);

  const addParticipantHandler = useCallback(() => {
    if (warRoom.ownerStatus) {
      if (selectIncident.status === 'Closed') {
        Toaster({ title: 'Incident is closed, you are not allowed to update incident data', type: 'error' });
      } else {
        GetOwnerActionData();
        setNewSelect(!newSelect);
        setIsOpen(!isOpen);
      }
    } else {
      Toaster({ title: "you don't have a permission", type: 'error' });
    }
  }, [warRoom, selectIncident, newSelect, isOpen]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <DetailAreaWrapper id="Incident_Warroom_Sidebar_wrapper">
      <div id="viewDetailBar" className={viewDetail || openWarromUserModal ? 'detailArea areaShow' : 'detailArea'}>
        {(viewDetail || openWarromUserModal)
          && (
            <div>
              <div className="iName" style={{ wordBreak: 'break-word', marginTop: '30px' }}>{warRoom.title}</div>
              <div
                id="Incident_Warroom_Sidebar_backButton"
                onClick={() => closeDrawer()}
                className="backButton"
              >
                <div className="arrow1" />
              </div>
              <div className="basicDtl">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ color: '#4e8bff' }}>Assign to:</div>
                  <div className="userPic">{warRoom.assignedName ? getUserpic(warRoom.assignedName) : '-'}</div>
                  <ZsTooltip
                    autoRight
                    title={warRoom.assignedName}
                    ids={`roomassign_${warRoom.assignedName}`}
                    style={{ width: '150px' }}
                  >
                    <div className="userName" id={`roomassign_${warRoom.assignedName}`}>{warRoom.assignedName || '-----'}</div>
                  </ZsTooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#4e8bff' }}>Owner:</span>
                  <div className="userPic">{warRoom.ownerName ? getUserpic(warRoom.ownerName) : '-'}</div>
                  <ZsTooltip
                    autoRight
                    title={warRoom.ownerName}
                    ids={`roomowner_${warRoom.ownerName}`}
                    style={{ width: '150px' }}
                  >
                    <div className="userName" id={`roomowner_${warRoom.ownerName}`}>{warRoom.ownerName || '-----'}</div>
                  </ZsTooltip>
                </div>
              </div>
              <div>
                <div className="upperTop">
                  <div style={{ color: '#4e8bff', marginTop: '13px' }}>Participants</div>
                  <div className="newBtn">
                    <Dropdown
                      id="Incident_Warroom_Sidebar_dropdown"
                      open={isOpen}
                      getPopupContainer={(ele) => ele.parentNode}
                      overlay={(
                        <div
                          id="pMenuOpen"
                          className="pMenuOpen"
                        >
                          <div className="title">Select User :</div>
                          <ZsSelect
                            id="Incident_Warroom_Sidebar_select"
                            selecttype="normal"
                            value={userId || null}
                            onChange={(e, i) => { setUserId(i.value); }}
                            className="selectOwner"
                            placeholder="Select"
                            data={inviteList}
                            dataAlreadyAdded={disableAddedField}
                          />
                          <ZsButton
                            id="Incident_Warroom_Sidebar_OK_Button"
                            style={{ marginTop: 15, opacity: !userId || userId === null || userId === '' ? '0.6' : '1' }}
                            className="newPbtn2"
                            type="primary"
                            title="OK"
                            onClick={() => {
                              if (!userId || userId === null || userId === '') {
                                Toaster({ title: 'Please select user', type: 'error' });
                              } else {
                                setLoading(true);
                                setNewSelect(!newSelect);
                                setIsOpen(false);
                                inviteMemberAction(
                                  {
                                    incidentId: IncidentId, invitedToToken: userId, customerID: localStorage.getItem('customerID'),
                                  },
                                );
                              }
                            }}
                          />
                        </div>
                      )}
                      placement={placement}
                      trigger={['click']}
                    >
                      <ZsButton
                        id="Incident_Warroom_Sidebar_addUser_Button"
                        style={{
                          height: '27px', minWidth: '27px', width: '27px', cursor: warRoom.ownerStatus ? 'pointer' : 'default', opacity: warRoom.ownerStatus ? '1' : '0.4',
                        }}
                        className="newPbtn"
                        loading={loading}
                        type="primary"
                        title={loading ? '' : '+'}
                        onClick={() => addParticipantHandler()}
                      />
                    </Dropdown>
                  </div>
                </div>
                <div className="downList">
                  {warRoom.users && warRoom.users.map((d) => (
                    <div key={d.token} className="flexMe">
                      <div style={{ width: '30px' }}>
                        <div className="UserPic">{d.name?.charAt(0)}</div>
                      </div>
                      <div className="UserDtl">
                        <ZsTooltip autoRight title={d.name} ids={`Incident_Warroom_Sidebar_name_${d.name}`}>
                          <div
                            className="name"
                            style={{
                              textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}
                            id={`Incident_Warroom_Sidebar_name_${d.name}`}
                          >
                            {d.name}
                          </div>
                        </ZsTooltip>
                        <ZsTooltip autoRight title={d.groupName} ids={`Incident_Warroom_Sidebar_group_name_${d.groupName}`}>
                          <div
                            className="role"
                            style={{
                              textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}
                            id={`Incident_Warroom_Sidebar_group_name_${d.groupName}`}
                          >
                            {d.groupName}
                          </div>
                        </ZsTooltip>
                      </div>
                      {d.inviteStatus === 'invite' && (
                        <div
                          id={`Incident_Warroom_Sidebar_delete_Button_${d.token}`}
                          onClick={warRoom.ownerStatus
                            ? () => warromDeleteUser(d.token) : () => Toaster({ title: "you don't have a permission", type: 'error' })}
                          style={{
                            cursor: warRoom.ownerStatus ? 'pointer' : 'default', opacity: warRoom.ownerStatus ? '1' : '0.4', width: '15px', marginLeft: '8px', marginTop: '4px',
                          }}
                          className="icons"
                        >
                          <Icons icontype="globle" type="delete" className="btmIcn" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
      <ZsModal
        open={openWarromUserModal}
        modaltype="confirm"
        msg="Are you sure to delete this Participant ?"
        title="Warning"
        id="Incident_Warroom_Sidebar_delete_modal"
        className="iocDeleteConfirm"
        loading={loading}
        onOk={() => {
          removeInviteMemberAction(
            { userToken: warrromUserToken, incidentId: IncidentId, customerID: localStorage.getItem('customerID') },
          );
          setLoading(true);
        }}
        onCancel={() => {
          closeSide(true);
          setOpenWarromUserModal(false);
        }}
      />

    </DetailAreaWrapper>
  );
};
WarroomSideBar.propTypes = {
  viewDetail: PropTypes.bool,
  closeSide: PropTypes.func,
  getDetailWarroomAction: PropTypes.func,
  fakeWarroomAction: PropTypes.func,
  IncidentId: PropTypes.number,
  inviteMemberAction: PropTypes.func,
  removeInviteMemberAction: PropTypes.func,
  selectIncident: PropTypes.oneOfType([
    PropTypes.object,
  ]),
};

WarroomSideBar.defaultProps = {
  viewDetail: false,
  closeSide: null,
  getDetailWarroomAction: null,
  fakeWarroomAction: null,
  IncidentId: null,
  inviteMemberAction: null,
  removeInviteMemberAction: null,
  selectIncident: null,
};
export default WarroomSideBar;
