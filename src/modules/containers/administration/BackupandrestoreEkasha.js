import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Backupandrestore from '../../pages/administration/lib/backupandrestore';
import {
  getAllBackupAction, getSingleBackup, addBackupAction, updateBackupAction, deleteBackupAction,
  resumeBackupAction, pauseBackupAction, getListType, fakeActionBackUp,
  getAllRestoreFileList, fileRetoreAction,
} from '../../../apis/administration/backupandrestore/backupandrestore.action';

const mapStateToProps = (state) => ({
  RestoreFileResponse: state.BackUp.RestoreFileResponse,
  GetRestoreFileListResponse: state.BackUp.GetRestoreFileListResponse,
  GetBackupResponse: state.BackUp.GetBackupResponse,
  GetSingleBackupResponse: state.BackUp.GetSingleBackupResponse,
  AddBackupResponse: state.BackUp.AddBackupResponse,
  UpdateBackupResponse: state.BackUp.UpdateBackupResponse,
  DeleteBackupResponse: state.BackUp.DeleteBackupResponse,
  ResumeBackupResponse: state.BackUp.ResumeBackupResponse,
  PauseBackupResponse: state.BackUp.PauseBackupResponse,
  GetServerBackupRes: state.BackUp.GetServerBackupRes,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllRestoreFileList,
    fileRetoreAction,
    getAllBackupAction,
    getSingleBackup,
    addBackupAction,
    updateBackupAction,
    deleteBackupAction,
    resumeBackupAction,
    pauseBackupAction,
    getListType,
    fakeActionBackUp,
  }, dispatch,
);

const BackupandrestoreEkasha = connect(mapStateToProps, mapDispatchToProps)(Backupandrestore);

export default BackupandrestoreEkasha;
