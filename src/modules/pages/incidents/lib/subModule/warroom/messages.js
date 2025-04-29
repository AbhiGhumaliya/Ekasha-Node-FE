import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import { MessagesStyle } from './style';
import Icons from '../../../../../../components/icons';
import { stompClient } from '../../../../../../helpers/lib/SocketHandlers';
import { downloadFileAction } from '../../../../../../configurations/redux/downloadFile';
import { convertTimeBaseTimeZoneFunction } from '../../../../../../helpers/lib/StorageHandlers';

let subscribe;

const Message = React.memo((props) => {
  const {
    currentUser,
    setMessages,
    messages,
    fakeWarroomAction,
    IncidentId,
  } = props;

  const listRef = useRef({});
  const rowHeights = useRef({});

  const fileUploadRes = useSelector((state) => state.Warroom.fileUploadResponse || {});

  const getUserSide = useCallback((msg, index) => {
    if (msg.status) {
      if (msg.sender === currentUser) {
        const a = msg.senderName && msg.senderName.split(' ');
        return (
          <div className="msgDetails" key={{ index }}>
            <div className="UserPic">{msg.senderName && a[0].charAt(0) + a[1].charAt(0)}</div>
            <span className="msgTime">{convertTimeBaseTimeZoneFunction(msg.messageTime)}</span>
          </div>
        );
      }
      const a = msg.senderName && msg.senderName.split(' ');
      return (
        <div className="msgDetails" key={{ index }}>
          <span className="msgTime">{convertTimeBaseTimeZoneFunction(msg.messageTime)}</span>
          <div className="UserPic">{msg.senderName && a[0].charAt(0) + a[1].charAt(0)}</div>
        </div>
      );
    }
    return null;
  }, [currentUser]);

  const onWarroomDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'warRoom') {
      switch (dataRes.operation) {
        case 'send':
        case 'addFile':
          if (dataRes.status) {
            if (IncidentId === parseInt(dataRes.data[0].chatRoom)) {
              setMessages((prevState) => {
                if (dataRes.data[0].customerID === localStorage.getItem('customerID')) {
                  return [...prevState, dataRes.data];
                }
                return prevState;
              });
              setTimeout(() => {
                setMessages((pre) => {
                  if (listRef.current && pre.length !== 0) {
                    listRef.current.scrollToItem(pre.length);
                  }
                  return pre;
                });
              }, 100);
            }
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
        subscribe = stompClient.subscribe('/topic/broadcast', onWarroomDataRecieved);
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
    setTimeout(() => {
      setMessages((pre) => {
        if (listRef && listRef.current && pre?.length > 0) {
          listRef.current?.scrollToItem(pre.length);
        }
        return pre;
      });
    }, 100);
  }, []);

  useEffect(() => {
    if (fileUploadRes.status && fileUploadRes.status === true) {
      if (fileUploadRes.data) {
        const msg = fileUploadRes.data;
        if (IncidentId === msg[0].chatRoom) {
          setMessages((prevState) => [...prevState, fileUploadRes.data]);
        }
      }
      fakeWarroomAction();
    } else if (fileUploadRes.status === false) {
      fakeWarroomAction();
    }
  }, [fileUploadRes]);

  function setRowHeight(index, size) {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }

  function getRowHeight(index) {
    return rowHeights?.current[index] || 100;
  }

  const Row = useCallback(({ index, style }) => {
    const rowRefs = useRef({});
    const m = messages[index];
    useEffect(() => {
      if (rowRefs.current) {
        setRowHeight(index, rowRefs.current.clientHeight);
      }
      // eslint-disable-next-line
    }, [rowRefs]);
    return (
      <div style={{ ...style }}>
        <div key={index} className={m[0].sender === currentUser ? 'currentUser' : 'otherUser'}>
          <div className="msg" ref={rowRefs}>
            <div className={messages[index + 1] && messages[index + 1].sender === m.sender ? 'messageText' : 'messageText lastMsg'}>
              {m.map((e, j) => (
                e.type === 'message'
                  ? (
                    <span key={j}>
                      {e.text}
                    </span>
                  )
                  : (
                    <span
                      key={j}
                      style={{
                        display: 'flex', margin: '4px', wordBreak: 'break-all', alignItems: 'center',
                      }}
                      className="fileType"
                    >
                      {e.FileName}
                      {` (${e.FileSize / 1000} KB)`}
                      {' '}
                      <Icons
                        id="Incident_Warroom_Message_DownloadIcon"
                        style={{ opacity: '1', marginLeft: '10px', cursor: 'pointer' }}
                        type="download"
                        icontype="common"
                        className="iconHeader"
                        onClick={() => downloadFileAction(`warroom/downloadFile/${IncidentId}/${localStorage.getItem('customerID')}/${e.FileName}`, e.FileName)}
                      />
                    </span>
                  )
              ))}
            </div>
            {m.map((d, j) => (
              getUserSide(d, j)
            ))}
          </div>
        </div>
      </div>
    );
  }, [messages, rowHeights]);

  return (
    <MessagesStyle id="Incident_Warroom_Message_Chat_Wrapper">
      {messages.length > 0 && (
      <AutoSizer>
        {({ height, width }) => (
          <List
            id="Incident_Warroom_Message_Chat_List"
            className="List"
            height={height}
            itemCount={messages.length}
            // eslint-disable-next-line react/jsx-no-bind
            itemSize={getRowHeight}
            ref={listRef}
            width={width}
            overscanCount={15}
            style={{ scrollBehavior: 'smooth' }}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
      )}
    </MessagesStyle>
  );
});
Message.propTypes = {
  currentUser: PropTypes.string,
  setMessages: PropTypes.func,
  messages: PropTypes.oneOfType([
    PropTypes.array,
  ]),
  fakeWarroomAction: PropTypes.func,
  IncidentId: PropTypes.string,
};

Message.defaultProps = {
  currentUser: '',
  setMessages: null,
  messages: [],
  fakeWarroomAction: null,
  IncidentId: '',
};
export default Message;
