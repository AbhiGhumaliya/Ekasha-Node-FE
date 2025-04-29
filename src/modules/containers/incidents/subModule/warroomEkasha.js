/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Warroom from '../../../pages/incidents/lib/subModule/warroom';
import {
  getAllMessagesAction, sendMsgAction, fileUploadAction, fakeWarroomAction,
  getWarroomFilesizeAction, getDetailWarroomAction,
  inviteMemberAction, removeInviteMemberAction,
} from '../../../../apis/incidents/subModule/Warroom/Warroom.action';

const mapStateToProps = (state) => ({
  GetAllMessagesResponse: state.Warroom.GetAllMessagesResponse,
  SendMessagesResponse: state.Warroom.SendMessagesResponse,
  fileUploadResponse: state.Warroom.fileUploadResponse,
  GetDetailWarroomResponse: state.Warroom.GetDetailWarroomResponse,
  DownloadWarroomFileResponse: state.Warroom.DownloadWarroomFileResponse,
  InviteMemberResponse: state.Warroom.InviteMemberResponse,
  RemoveMemberResponse: state.Warroom.RemoveMemberResponse,
  GetFileSizeResponse: state.Warroom.GetFileSizeResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllMessagesAction,
    sendMsgAction,
    fileUploadAction,
    getWarroomFilesizeAction,
    inviteMemberAction,
    removeInviteMemberAction,
    fakeWarroomAction,
    getDetailWarroomAction,
  }, dispatch,
);

const WarroomEkasha = connect(mapStateToProps, mapDispatchToProps)(Warroom);

export default WarroomEkasha;
