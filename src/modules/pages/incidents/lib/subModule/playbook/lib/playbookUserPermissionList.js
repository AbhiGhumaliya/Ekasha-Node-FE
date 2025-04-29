/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ZsModal from '../../../../../../../components/modal';
import { IncidentPlaybookUserWrapper } from '../style';
import Icons from '../../../../../../../components/icons';
import { ZsSpin } from '../../../../../../../components/Spin';
import NoData from '../../../../../../../components/NoData';
import Toaster from '../../../../../../../components/toaster';

const PlaybookUserPermissionList = (props) => {
  const { userPermissionModel, setUserPermissionModel, fakePlaybookActionAPI } = props;

  const [userPermissionData, setUserPermissionData] = useState([]);
  const [approvalLoading, setApprovalLoading] = useState(true);

  const GetApprovalDataRes = useSelector((state) => (
    state.PlayBook.GetApprovalDataResponse || {}));

  useEffect(() => {
    if (GetApprovalDataRes.status) {
      setUserPermissionData(GetApprovalDataRes.data);
      setApprovalLoading(false);
      fakePlaybookActionAPI();
    } else if (GetApprovalDataRes.status === false) {
      setUserPermissionData([]);
      setApprovalLoading(false);
      fakePlaybookActionAPI();
    }
  }, [GetApprovalDataRes]);
  return (
    <ZsModal
      modaltype="simple"
      title="User"
      onHide={() => setUserPermissionModel(false)}
      className="incidentplaybookUserPermissionPreviewModal"
      show={userPermissionModel}
      centered
      width={500}
    >
      <IncidentPlaybookUserWrapper>
        <div className="mainBody">
          {approvalLoading && (
            <ZsSpin id="IncidentPlaybookPreviewApprovalListLoading" />
          )}
          {!approvalLoading && userPermissionData.length !== 0 && userPermissionData.map((d) => (
            <div className="box">
              <div className="boxWrap">
                <div className="left">Email Address :</div>
                <div className="right">{d}</div>
                <div className="copyIcon">
                  <Icons
                    iconTooltipType="normal"
                    iconTooltipTitle="Copy Email"
                    type="copy2"
                    icontype="globle"
                    onClick={() => {
                      if (d) {
                        const dummy = document.createElement('input');
                        dummy.style.position = 'absolute';
                        document.body.appendChild(dummy);
                        dummy.setAttribute('id', 'dummy_id');
                        document.getElementById('dummy_id').value = JSON.stringify(d).replace(/"/g, '');
                        dummy.select();
                        document.execCommand('copy');
                        document.body.removeChild(dummy);
                        Toaster({ title: `${d} copied`, type: 'success' });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="boxWrap">
                <div className="left">Approval Status :</div>
                <div className="right">-</div>
              </div>
              <div className="boxWrap">
                <div className="left">Response Time :</div>
                <div className="right">-</div>
              </div>
            </div>
          ))}
          {!approvalLoading && userPermissionData.length === 0 && (
            <NoData />
          )}
        </div>
      </IncidentPlaybookUserWrapper>
    </ZsModal>
  );
};
export default PlaybookUserPermissionList;
