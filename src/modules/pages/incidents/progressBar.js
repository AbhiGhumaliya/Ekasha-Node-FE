import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Icons from '../../../components/icons';
import ProgressBar from '../../../components/progress_bar';
import { calculateSla } from './utils';
import { stompClient } from '../../../helpers/lib/SocketHandlers';
import ZsTooltip from '../../../components/tooltip';

let subscribe;

const ProgressBarView = React.memo((props) => {
  const {
    selectedIncident, getUserpic, getProgressClass,
  } = props;

  const [incident, setIncident] = useState(selectedIncident);

  const onIncidentProgressBarDataRecieved = (payload) => {
    const dataRes = JSON.parse(payload.body);
    if (dataRes.module === 'incident') {
      switch (dataRes.operation) {
        case 'update':
          if (dataRes.status) {
            setIncident((prevState) => {
              if (prevState.incidentId === dataRes.data[0]?.incidentId && dataRes.data[0]?.customerID === localStorage.getItem('customerID')) {
                let a = prevState;
                let data = {};
                dataRes.data.forEach((details) => {
                  if (!details.threatInformation) {
                    data = Object.assign(data, details);
                  }
                });
                a = Object.assign(a, data);
                return { ...a };
              }
              return prevState;
            });
          }
          break;
        case 'updateEscalation':
          if (dataRes.status) {
            setIncident((prevState) => {
              if (prevState.incidentId === dataRes.data.incidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
                let a = prevState;
                a = Object.assign(a, dataRes.data);
                return { ...a };
              }
              return prevState;
            });
          }
          break;
        case 'changeAssign':
          if (dataRes.status) {
            setIncident((prevState) => {
              if (prevState.incidentId === dataRes.data.incidentId && dataRes.data.customerID === localStorage.getItem('customerID')) {
                let a = prevState;
                a = Object.assign(a, dataRes.data);
                a.escalate = dataRes.data.assignedToName;
                return { ...a };
              }
              return prevState;
            });
          }
          break;
        case 'updateTypeDetails':
          if (dataRes.status) {
            setIncident((prevState) => {
              if (prevState.incidentId === dataRes.data.incidentID && dataRes.data.customerID === localStorage.getItem('customerID')) {
                const a = prevState;
                dataRes.data.updateData.forEach((details) => {
                  if (Object.keys(details)[0] === 'sourceAddress') {
                    a.typeDetails.sourceAddress = details[Object.keys(details)[0]];
                  }
                  if (Object.keys(details)[0] === 'sourceLocation') {
                    a.typeDetails.sourceLocation = details[Object.keys(details)[0]];
                  }
                });
                return { ...a };
              }
              return prevState;
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
        subscribe = stompClient.subscribe('/topic/broadcast', onIncidentProgressBarDataRecieved);
      };
      channelSub();
      window.addEventListener('stompClientChanged', channelSub);
    }
    return () => {
      if (subscribe) { subscribe.unsubscribe(); }
      window.removeEventListener('stompClientChanged', null);
    };
  }, [stompClient.connected]);

  const remainingTimeClock = () => {
    setIncident((prv) => ({
      ...prv,
      rem: calculateSla(
        prv.createdOn,
        prv.SLA,
        prv.closedTime,
      ).remaining,
      progress: calculateSla(
        prv.createdOn,
        prv.SLA,
        prv.closedTime,
      ).per,
    }));
  };
  useEffect(() => {
    let removeInter = '';
    removeInter = setInterval(() => {
      remainingTimeClock();
    }, 1000);
    return () => {
      clearInterval(removeInter);
    };
  }, []);
  return (
    <div className="extDetRow1 seperatorBorder">
      <div
        className="detailBoxes"
        style={{
          width: '293px',
          paddingRight: '12px',
        }}
      >
        <div
          className="locAndSla"
        >
          <div className="loc">
            <Icons
              icontype="common"
              type="globe2"
              className="locIcon"
              style={{
                textTransform: 'capitalize',
              }}
            />
          </div>
          <div className="deatailLocationContent">
            <ZsTooltip
              autoRight
              title={incident.typeDetails.sourceLocation}
              ids={`Incident_DetailView_ProgresBar_Location_name${incident.typeDetails.sourceLocation}`}
            >
              <div
                style={{
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px',
                }}
                id={`Incident_DetailView_ProgresBar_Location_name${incident.typeDetails.sourceLocation}`}
              >
                {incident.typeDetails.sourceLocation}
              </div>
            </ZsTooltip>
          </div>
          <div className="sideLabel">
            {incident.rem}
          </div>
        </div>
        <div className="progressBar">
          <ProgressBar className={getProgressClass(incident.progress ? Math.floor(incident.progress) : 0)} now={incident.progress} status="normal" />
        </div>
      </div>
      <div
        className="detailBoxes"
        style={{
          // flexGrow: '2',
          width: '215px',
        }}
      >
        <span
          className="oTitle"
          style={{
            paddingTop: '1px',
          }}
        >
          Assigned To
        </span>
        <span
          className="oValue overflowText"
          style={{
            textTransform: 'capitalize',
            display: 'flex',
            paddingTop: '5px',
          }}
        >
          <div className="userPic">{incident.assignedToName ? getUserpic(incident.assignedToName) : '-'}</div>
          <div className="userName" id={`assign_${incident.assignedToName}`}>
            <ZsTooltip
              autoRight
              title={incident.assignedToName}
              ids={`Incident_DetailView_ProgresBar_AssignTo_name${incident.assignedToName || '-'}`}
            >
              <div
                style={{
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px',
                }}
                id={`Incident_DetailView_ProgresBar_AssignTo_name${incident.assignedToName || '-'}`}
              >
                {incident.assignedToName}
              </div>
            </ZsTooltip>
          </div>
        </span>
      </div>
      <div
        className="detailBoxes"
        style={{
          // flexGrow: '2',
          width: '215px',
        }}
      >
        <span
          className="oTitle"
          style={{
            paddingTop: '1px',
          }}
        >
          Owner
        </span>
        <span
          className="oValue overflowText"
          style={{
            textTransform: 'capitalize',
            display: 'flex',
            paddingTop: '5px',
          }}
        >
          <div className="userPic">{incident.ownerName ? getUserpic(incident.ownerName) : '-'}</div>
          <div className="userName" id={`owner_${incident.ownerName}`}>
            <ZsTooltip
              autoRight
              title={incident.ownerName}
              ids={`Incident_DetailView_ProgresBar_Owner_name${incident.ownerName || '-'}`}
            >
              <div
                style={{
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px',
                }}
                id={`Incident_DetailView_ProgresBar_Owner_name${incident.ownerName || '-'}`}
              >
                {incident.ownerName}
              </div>
            </ZsTooltip>
          </div>
        </span>
      </div>
    </div>
  );
});
ProgressBarView.propTypes = {
  selectedIncident: PropTypes.oneOfType([PropTypes.any]),
  getUserpic: PropTypes.func,
  getProgressClass: PropTypes.func,
};
ProgressBarView.defaultProps = {
  selectedIncident: {},
  getUserpic: null,
  getProgressClass: null,
};
export default ProgressBarView;
