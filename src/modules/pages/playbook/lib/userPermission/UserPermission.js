/* eslint-disable react/prop-types */
import React from 'react';
import Icons from '../../../../../components/icons';
import NoData from '../../../../../components/NoData';
import { ZsSpin } from '../../../../../components/Spin';
import { UserPermissionWrapper } from './UserPermissionWrapper';

const UserPermission = (props) => {
  const { approvalMailData, approvalLoading } = props;
  return (
    <UserPermissionWrapper>
      <div className="playbookAddNotesWrapper">
        <div className="actionTopPart">
          <div className="actionTitle">
            <Icons type="playbookUser" icontype="globle" className="iconLeft" style={{ cursor: 'default' }} />
            <span className="openBlockName">User</span>
          </div>
        </div>
        <div className="bodyPart">
          {approvalLoading && <ZsSpin size="middle" id="playbookApprovalEmailIDLoading" />}
          {!approvalLoading && approvalMailData.length > 0 && approvalMailData.map((d, i) => (
            <div
              key={i}
              className="wrap"
            >
              {d}
            </div>
          ))}
          {!approvalLoading && approvalMailData.length === 0 && (
            <NoData />
          )}
        </div>
      </div>
    </UserPermissionWrapper>
  );
};
UserPermission.propTypes = {
};

UserPermission.defaultProps = {

};
export default UserPermission;
